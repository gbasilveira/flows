import type {
  WorkflowNode,
  NodeExecutor,
  WorkflowDefinition,
  WorkflowId,
} from '../types/index.js';
import type { WorkflowExecutor } from './workflow-executor.js';
import { SubflowNodeExecutor } from './subflow-node-executor.js';

/**
 * Enhanced NodeExecutor that handles both standard and subflow node types
 * This is the recommended NodeExecutor for applications using subflows
 */
export class EnhancedNodeExecutor implements NodeExecutor {
  private subflowExecutor: SubflowNodeExecutor;

  constructor(
    private workflowExecutor: WorkflowExecutor,
    private customExecutor?: NodeExecutor,
    maxSubflowDepth: number = 5
  ) {
    this.subflowExecutor = new SubflowNodeExecutor(workflowExecutor, maxSubflowDepth);
  }

  /**
   * Register a workflow that can be called by subflow nodes
   */
  registerSubflow(definition: WorkflowDefinition): void {
    this.subflowExecutor.registerWorkflow(definition);
  }

  /**
   * Unregister a subflow workflow
   */
  unregisterSubflow(workflowId: WorkflowId): void {
    this.subflowExecutor.unregisterWorkflow(workflowId);
  }

  /**
   * Get all registered subflow workflows
   */
  getRegisteredSubflows(): WorkflowDefinition[] {
    return this.subflowExecutor.getRegisteredWorkflows();
  }

  async execute(
    node: WorkflowNode,
    context: Record<string, unknown>,
    inputs: Record<string, unknown>
  ): Promise<unknown> {
    switch (node.type) {
      case 'subflow':
        return this.subflowExecutor.execute(node, context, inputs);
        
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
} 