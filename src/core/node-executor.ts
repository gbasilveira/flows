import type {
  WorkflowNode,
  NodeExecutor as INodeExecutor,
  WorkflowDefinition,
  WorkflowId,
} from '../types/index.js';
import { DataHandler, DelayHandler, SubflowHandler } from './handlers/index.js';

/**
 * Standard NodeExecutor that handles all built-in node types
 * Uses specialized handlers for different node types and supports custom executors
 */
export class NodeExecutor implements INodeExecutor {
  private dataHandler: DataHandler;
  private delayHandler: DelayHandler;
  private subflowHandler: SubflowHandler;
  private customExecutor?: INodeExecutor;
  private subflowEnabled: boolean;

  constructor(
    options: {
      customExecutor?: INodeExecutor;
      maxSubflowDepth?: number;
      enableSubflows?: boolean;
    } = {}
  ) {
    this.customExecutor = options.customExecutor;
    this.subflowEnabled = options.enableSubflows ?? true;
    
    // Initialize handlers
    this.dataHandler = new DataHandler();
    this.delayHandler = new DelayHandler();
    this.subflowHandler = new SubflowHandler({
      maxSubflowDepth: options.maxSubflowDepth || 5,
    });
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
        // Try custom executor if provided
        if (this.customExecutor) {
          return this.customExecutor.execute(node, context, inputs);
        }
        
        throw new Error(`Unknown node type: ${node.type}. Available types: data, delay${this.subflowEnabled ? ', subflow' : ''}`);
    }
  }
} 