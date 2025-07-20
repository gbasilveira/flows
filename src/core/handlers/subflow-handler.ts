import type { 
  WorkflowNode, 
  WorkflowDefinition, 
  WorkflowId, 
  ExecutionStatus 
} from '../../types/index.js';

/**
 * Handler for 'subflow' node types
 * Subflow nodes execute other workflows as part of the current workflow
 */
export class SubflowHandler {
  private subflowRegistry: Map<WorkflowId, WorkflowDefinition> = new Map();
  private maxSubflowDepth: number;

  constructor(options: { maxSubflowDepth?: number } = {}) {
    this.maxSubflowDepth = options.maxSubflowDepth || 5;
  }

  /**
   * Register a workflow that can be called by subflow nodes
   */
  registerSubflow(definition: WorkflowDefinition): void {
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
      executedAt: new Date().toISOString(),
    };
  }
} 