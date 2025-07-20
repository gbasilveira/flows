import type { WorkflowNode } from '../types/index.js';

/**
 * Interface for handler plugins
 */
export interface HandlerPlugin {
  /** Name of the node type this plugin handles */
  nodeType: string;
  
  /** Handler implementation */
  handler: {
    execute(
      node: WorkflowNode,
      context: Record<string, unknown>,
      inputs: Record<string, unknown>
    ): Promise<unknown>;
  };
  
  /** Optional metadata */
  metadata?: {
    name?: string;
    version?: string;
    description?: string;
    author?: string;
  };
}

/**
 * Plugin registry for managing handler plugins
 */
export class PluginRegistry {
  private plugins: Map<string, HandlerPlugin> = new Map();
  private allowCustomHandlers: boolean;

  constructor(options: { allowCustomHandlers?: boolean } = {}) {
    this.allowCustomHandlers = options.allowCustomHandlers ?? true;
  }

  /**
   * Register a handler plugin
   */
  register(plugin: HandlerPlugin): void {
    if (!this.allowCustomHandlers) {
      throw new Error('Custom handlers are disabled. Enable them in constructor options.');
    }

    if (this.isReservedNodeType(plugin.nodeType)) {
      throw new Error(`Cannot override built-in node type: ${plugin.nodeType}`);
    }

    this.plugins.set(plugin.nodeType, plugin);
  }

  /**
   * Unregister a handler plugin
   */
  unregister(nodeType: string): boolean {
    if (this.isReservedNodeType(nodeType)) {
      throw new Error(`Cannot unregister built-in node type: ${nodeType}`);
    }

    return this.plugins.delete(nodeType);
  }

  /**
   * Get a handler plugin by node type
   */
  get(nodeType: string): HandlerPlugin | undefined {
    return this.plugins.get(nodeType);
  }

  /**
   * Check if a plugin is registered for a node type
   */
  has(nodeType: string): boolean {
    return this.plugins.has(nodeType);
  }

  /**
   * Get all registered plugins
   */
  getAll(): HandlerPlugin[] {
    return Array.from(this.plugins.values());
  }

  /**
   * Get all registered node types
   */
  getRegisteredTypes(): string[] {
    return Array.from(this.plugins.keys());
  }

  /**
   * Clear all registered plugins
   */
  clear(): void {
    this.plugins.clear();
  }

  /**
   * Check if a node type is reserved (built-in)
   */
  private isReservedNodeType(nodeType: string): boolean {
    const reservedTypes = ['data', 'delay'];
    return reservedTypes.includes(nodeType);
  }

  /**
   * Create a plugin from a simple handler function
   */
  static createPlugin(
    nodeType: string,
    handler: (
      node: WorkflowNode,
      context: Record<string, unknown>,
      inputs: Record<string, unknown>
    ) => Promise<unknown>,
    metadata?: HandlerPlugin['metadata']
  ): HandlerPlugin {
    return {
      nodeType,
      handler: { execute: handler },
      metadata,
    };
  }
} 