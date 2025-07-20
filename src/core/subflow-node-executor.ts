import type {
  WorkflowNode,
  WorkflowDefinition,
  WorkflowId,
  NodeExecutor,
  ExecutionResult,
} from '../types/index.js';
import { ExecutionStatus } from '../types/index.js';
import type { WorkflowExecutor } from './workflow-executor.js';

/**
 * Execution context for tracking subflow call depth and hierarchy
 */
export interface SubflowExecutionContext {
  callStack: WorkflowId[];
  maxDepth: number;
  parentWorkflowId: WorkflowId;
  parentNodeId: string;
}

/**
 * NodeExecutor that handles subflow execution
 * Enables workflows to call other workflows as nodes
 */
export class SubflowNodeExecutor implements NodeExecutor {
  private workflowRegistry: Map<WorkflowId, WorkflowDefinition> = new Map();
  private executionContexts: Map<string, SubflowExecutionContext> = new Map();

  constructor(
    private workflowExecutor: WorkflowExecutor,
    private defaultMaxDepth: number = 5
  ) {}

  /**
   * Register a workflow definition that can be called by subflow nodes
   */
  registerWorkflow(definition: WorkflowDefinition): void {
    this.workflowRegistry.set(definition.id, definition);
  }

  /**
   * Unregister a workflow definition
   */
  unregisterWorkflow(workflowId: WorkflowId): void {
    this.workflowRegistry.delete(workflowId);
  }

  /**
   * Get all registered workflows
   */
  getRegisteredWorkflows(): WorkflowDefinition[] {
    return Array.from(this.workflowRegistry.values());
  }

  async execute(
    node: WorkflowNode,
    context: Record<string, unknown>,
    inputs: Record<string, unknown>
  ): Promise<unknown> {
    if (node.type !== 'subflow') {
      throw new Error(`SubflowNodeExecutor can only handle 'subflow' type nodes, got: ${node.type}`);
    }

    // Get the subflow definition
    const subflowDefinition = this.getSubflowDefinition(node);
    if (!subflowDefinition) {
      throw new Error(`Subflow definition not found for node: ${node.id}`);
    }

    // Get execution context for recursion tracking
    const executionContext = this.getExecutionContext(context);
    
    // Check recursion depth
    const maxDepth = node.subflowMaxDepth || this.defaultMaxDepth;
    if (executionContext.callStack.length >= maxDepth) {
      throw new Error(
        `Maximum subflow depth (${maxDepth}) exceeded. Call stack: ${executionContext.callStack.join(' -> ')}`
      );
    }

    // Check for circular references
    if (executionContext.callStack.includes(subflowDefinition.id)) {
      throw new Error(
        `Circular subflow reference detected: ${executionContext.callStack.join(' -> ')} -> ${subflowDefinition.id}`
      );
    }

    // Create child workflow with unique ID to avoid conflicts
    const childWorkflowId = this.generateChildWorkflowId(
      executionContext.parentWorkflowId,
      node.id,
      subflowDefinition.id
    );

    const childDefinition: WorkflowDefinition = {
      ...subflowDefinition,
      id: childWorkflowId,
    };

    // Prepare child workflow context
    const childContext = this.prepareChildContext(node, context, inputs, executionContext);

    try {
      // Execute child workflow
      const result = await this.workflowExecutor.startWorkflow(childDefinition, childContext);
      
      if (result.status === ExecutionStatus.FAILED) {
        throw new Error(`Subflow execution failed: ${result.error || 'Unknown error'}`);
      }

      // Return the child workflow results
      return {
        subflowId: childWorkflowId,
        status: result.status,
        duration: result.duration,
        nodeResults: result.nodeResults,
        // Include summary data for parent workflow
        completedNodes: Object.keys(result.nodeResults).length,
        failureCount: result.failureMetrics ? 
          Object.values(result.failureMetrics).reduce((sum, metrics) => sum + metrics.totalFailures, 0) : 0,
      };

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown subflow error';
      throw new Error(`Subflow '${subflowDefinition.id}' failed: ${errorMessage}`);
    }
  }

  /**
   * Get subflow definition from node configuration
   */
  private getSubflowDefinition(node: WorkflowNode): WorkflowDefinition | null {
    // Direct definition takes precedence
    if (node.subflowDefinition) {
      return node.subflowDefinition;
    }

    // Look up by ID in registry
    if (node.subflowId) {
      return this.workflowRegistry.get(node.subflowId) || null;
    }

    return null;
  }

  /**
   * Extract execution context from parent workflow context
   */
  private getExecutionContext(context: Record<string, unknown>): SubflowExecutionContext {
    const contextKey = '__subflow_execution_context';
    
    if (context[contextKey]) {
      return context[contextKey] as SubflowExecutionContext;
    }

    // Create initial context if not present
    return {
      callStack: [],
      maxDepth: this.defaultMaxDepth,
      parentWorkflowId: 'unknown',
      parentNodeId: 'unknown',
    };
  }

  /**
   * Prepare context for child workflow execution
   */
  private prepareChildContext(
    node: WorkflowNode,
    parentContext: Record<string, unknown>,
    inputs: Record<string, unknown>,
    executionContext: SubflowExecutionContext
  ): Record<string, unknown> {
    // Create new execution context for child
    const childExecutionContext: SubflowExecutionContext = {
      callStack: [...executionContext.callStack, executionContext.parentWorkflowId],
      maxDepth: executionContext.maxDepth,
      parentWorkflowId: executionContext.parentWorkflowId,
      parentNodeId: node.id,
    };

    // Merge contexts: parent context + node inputs + subflow context + execution context
    return {
      ...parentContext,
      ...node.inputs,
      ...inputs,
      ...(node.subflowContext || {}),
      __subflow_execution_context: childExecutionContext,
      __parent_workflow_id: executionContext.parentWorkflowId,
      __parent_node_id: node.id,
    };
  }

  /**
   * Generate unique child workflow ID
   */
  private generateChildWorkflowId(
    parentWorkflowId: WorkflowId,
    nodeId: string,
    subflowId: WorkflowId
  ): WorkflowId {
    const timestamp = Date.now();
    const random = Math.random().toString(36).substring(2, 8);
    return `${parentWorkflowId}.${nodeId}.${subflowId}.${timestamp}.${random}`;
  }
} 