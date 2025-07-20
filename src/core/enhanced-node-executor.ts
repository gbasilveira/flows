import type {
  WorkflowNode,
  NodeExecutor as INodeExecutor,
  WorkflowDefinition,
  WorkflowId,
  ExecutionStatus,
} from '../types/index.js';

/**
 * Standard NodeExecutor that handles all built-in node types
 * Includes optional subflow support and custom executor delegation
 */
export class NodeExecutor implements INodeExecutor {
  private subflowRegistry: Map<WorkflowId, WorkflowDefinition> = new Map();
  private customExecutor?: INodeExecutor;
  private maxSubflowDepth: number;
  private subflowEnabled: boolean;

  constructor(
    options: {
      customExecutor?: INodeExecutor;
      maxSubflowDepth?: number;
      enableSubflows?: boolean;
    } = {}
  ) {
    this.customExecutor = options.customExecutor;
    this.maxSubflowDepth = options.maxSubflowDepth || 5;
    this.subflowEnabled = options.enableSubflows ?? true;
  }

  /**
   * Register a workflow that can be called by subflow nodes
   */
  registerSubflow(definition: WorkflowDefinition): void {
    if (!this.subflowEnabled) {
      throw new Error('Subflows are disabled. Enable them in constructor options.');
    }
    this.subflowRegistry.set(definition.id, definition);
  }

  /**
   * Unregister a subflow workflow
   */
  unregisterSubflow(workflowId: WorkflowId): void {
    this.subflowRegistry.delete(workflowId);
  }

  /**
   * Get all registered subflow workflows
   */
  getRegisteredSubflows(): WorkflowDefinition[] {
    return Array.from(this.subflowRegistry.values());
  }

  async execute(
    node: WorkflowNode,
    context: Record<string, unknown>,
    inputs: Record<string, unknown>
  ): Promise<unknown> {
    switch (node.type) {
      case 'subflow':
        if (!this.subflowEnabled) {
          throw new Error(`Subflow nodes require enableSubflows: true in NodeExecutor options`);
        }
        return this.executeSubflow(node, context, inputs);
        
      case 'data':
        // Data nodes pass through their inputs
        return { ...node.inputs, ...inputs };
        
      case 'delay':
        // Delay node waits for specified time
        const delayMs = (node.inputs.delay as number) || 1000;
        await new Promise(resolve => setTimeout(resolve, delayMs));
        return { delayed: true, duration: delayMs };
        
      default:
        // Try custom executor if provided
        if (this.customExecutor) {
          return this.customExecutor.execute(node, context, inputs);
        }
        
        throw new Error(`Unknown node type: ${node.type}`);
    }
  }

  /**
   * Execute a subflow node
   * Note: This is a simplified implementation. For full subflow support,
   * integrate with a WorkflowExecutor instance via dependency injection.
   */
  private async executeSubflow(
    node: WorkflowNode,
    context: Record<string, unknown>,
    inputs: Record<string, unknown>
  ): Promise<unknown> {
    const subflowId = node.inputs.workflowId as WorkflowId;
    const subflowDefinition = this.subflowRegistry.get(subflowId);
    
    if (!subflowDefinition) {
      throw new Error(`Subflow definition not found: ${subflowId}`);
    }

    // Check recursion depth
    const executionContext = context.__subflow_execution_context as any;
    if (executionContext?.callStack?.length >= this.maxSubflowDepth) {
      throw new Error(`Maximum subflow depth (${this.maxSubflowDepth}) exceeded`);
    }

    // For now, return a placeholder result
    // In a full implementation, this would create and execute the subworkflow
    return {
      subflowId,
      status: 'placeholder' as ExecutionStatus,
      message: 'Subflow execution requires integration with WorkflowExecutor',
      inputs,
    };
  }
} 