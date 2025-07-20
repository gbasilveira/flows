import type {
  WorkflowNode,
  NodeExecutor as INodeExecutor,
  WorkflowDefinition,
  WorkflowId,
} from '../types/index.js';
import { DataHandler, DelayHandler, SubflowHandler } from './handlers/index.js';
import { PluginRegistry, type HandlerPlugin } from './plugin-registry.js';

/**
 * Standard NodeExecutor that handles all built-in node types
 * Uses specialized handlers for different node types and supports plugins
 */
export class NodeExecutor implements INodeExecutor {
  private dataHandler: DataHandler;
  private delayHandler: DelayHandler;
  private subflowHandler: SubflowHandler;
  private pluginRegistry: PluginRegistry;
  private customExecutor?: INodeExecutor;
  private subflowEnabled: boolean;

  constructor(
    options: {
      customExecutor?: INodeExecutor;
      maxSubflowDepth?: number;
      enableSubflows?: boolean;
      allowCustomHandlers?: boolean;
      plugins?: HandlerPlugin[];
    } = {}
  ) {
    this.customExecutor = options.customExecutor;
    this.subflowEnabled = options.enableSubflows ?? true;
    
    // Initialize plugin registry
    this.pluginRegistry = new PluginRegistry({
      allowCustomHandlers: options.allowCustomHandlers ?? true,
    });

    // Register plugins if provided
    if (options.plugins) {
      options.plugins.forEach(plugin => this.pluginRegistry.register(plugin));
    }
    
    // Initialize core handlers (always available)
    this.dataHandler = new DataHandler();
    this.delayHandler = new DelayHandler();
    this.subflowHandler = new SubflowHandler({
      maxSubflowDepth: options.maxSubflowDepth || 5,
    });
  }

  /**
   * Register a handler plugin
   */
  registerPlugin(plugin: HandlerPlugin): void {
    this.pluginRegistry.register(plugin);
  }

  /**
   * Unregister a handler plugin
   */
  unregisterPlugin(nodeType: string): boolean {
    return this.pluginRegistry.unregister(nodeType);
  }

  /**
   * Get all registered plugins
   */
  getRegisteredPlugins(): HandlerPlugin[] {
    return this.pluginRegistry.getAll();
  }

  /**
   * Get all available node types (built-in + plugins)
   */
  getAvailableNodeTypes(): string[] {
    const builtInTypes = ['data', 'delay'];
    if (this.subflowEnabled) {
      builtInTypes.push('subflow');
    }
    return [...builtInTypes, ...this.pluginRegistry.getRegisteredTypes()];
  }

  /**
   * Register a workflow that can be called by subflow nodes
   */
  registerSubflow(definition: WorkflowDefinition): void {
    if (!this.subflowEnabled) {
      throw new Error('Subflows are disabled. Enable them in constructor options.');
    }
    this.subflowHandler.registerSubflow(definition);
  }

  /**
   * Unregister a subflow workflow
   */
  unregisterSubflow(workflowId: WorkflowId): void {
    this.subflowHandler.unregisterSubflow(workflowId);
  }

  /**
   * Get all registered subflow workflows
   */
  getRegisteredSubflows(): WorkflowDefinition[] {
    return this.subflowHandler.getRegisteredSubflows();
  }

  async execute(
    node: WorkflowNode,
    context: Record<string, unknown>,
    inputs: Record<string, unknown>
  ): Promise<unknown> {
    switch (node.type) {
      // Built-in core handlers (always available)
      case 'data':
        return this.dataHandler.execute(node, context, inputs);
        
      case 'delay':
        return this.delayHandler.execute(node, context, inputs);
        
      case 'subflow':
        if (!this.subflowEnabled) {
          throw new Error(`Subflow nodes require enableSubflows: true in NodeExecutor options`);
        }
        return this.subflowHandler.execute(node, context, inputs);
        
      default:
        // Try plugin handlers first
        const plugin = this.pluginRegistry.get(node.type);
        if (plugin) {
          return plugin.handler.execute(node, context, inputs);
        }

        // Try custom executor as fallback
        if (this.customExecutor) {
          return this.customExecutor.execute(node, context, inputs);
        }
        
        const availableTypes = this.getAvailableNodeTypes();
        throw new Error(`Unknown node type: ${node.type}. Available types: ${availableTypes.join(', ')}`);
    }
  }
} 