import type {
  WorkflowDefinition,
  WorkflowState,
  WorkflowNode,
  NodeState,
  NodeId,
  WorkflowId,
  ExecutionResult,
  StorageAdapter,
  NodeExecutor,
  FlowsConfig,
  WorkflowEvent,
} from '../types/index.js';
import { ExecutionStatus } from '../types/index.js';
import { WorkflowEventSystem } from './event-system.js';

/**
 * Default node executor that handles basic node types
 */
class DefaultNodeExecutor implements NodeExecutor {
  async execute(
    node: WorkflowNode,
    context: Record<string, unknown>,
    inputs: Record<string, unknown>
  ): Promise<unknown> {
    switch (node.type) {
      case 'data':
        // Data nodes just pass through their inputs
        return { ...node.inputs, ...inputs };
      
      case 'transform':
        // Simple transformation node
        return this.applyTransformation(node.inputs, inputs, context);
      
      case 'delay':
        // Delay node waits for a specified time
        const delayMs = (node.inputs.delay as number) || 1000;
        await new Promise(resolve => setTimeout(resolve, delayMs));
        return { delayed: true, duration: delayMs };
      
      default:
        throw new Error(`Unknown node type: ${node.type}`);
    }
  }

  private applyTransformation(
    nodeInputs: Record<string, unknown>,
    runtimeInputs: Record<string, unknown>,
    context: Record<string, unknown>
  ): Record<string, unknown> {
    // Simple merge for now - can be extended with more complex logic
    return {
      ...nodeInputs,
      ...runtimeInputs,
      context: context,
      transformed: true,
    };
  }
}

/**
 * Main workflow executor class
 * Handles DAG execution with state persistence and event coordination
 */
export class WorkflowExecutor {
  private storage: StorageAdapter;
  private nodeExecutor: NodeExecutor;
  private eventSystem: WorkflowEventSystem;
  private config: FlowsConfig;
  private runningWorkflows: Set<WorkflowId> = new Set();

  constructor(
    storage: StorageAdapter,
    config: FlowsConfig,
    nodeExecutor?: NodeExecutor
  ) {
    this.storage = storage;
    this.config = config;
    this.nodeExecutor = nodeExecutor || new DefaultNodeExecutor();
    this.eventSystem = new WorkflowEventSystem();
  }

  /**
   * Start executing a workflow from a definition
   */
  async startWorkflow(
    definition: WorkflowDefinition,
    initialContext: Record<string, unknown> = {}
  ): Promise<ExecutionResult> {
    const workflowId = definition.id;

    if (this.runningWorkflows.has(workflowId)) {
      throw new Error(`Workflow ${workflowId} is already running`);
    }

    // Check if workflow already exists in storage
    const existingState = await this.storage.load(workflowId);
    if (existingState && existingState.status === ExecutionStatus.RUNNING) {
      throw new Error(`Workflow ${workflowId} is already running`);
    }

    // Create initial state
    const state: WorkflowState = {
      id: workflowId,
      definition,
      status: ExecutionStatus.RUNNING,
      nodes: {},
      startedAt: new Date(),
      context: initialContext,
      events: [],
    };

    // Initialize node states
    definition.nodes.forEach(node => {
      state.nodes[node.id] = {
        id: node.id,
        status: ExecutionStatus.PENDING,
        attempts: 0,
      };
    });

    await this.storage.save(workflowId, state);
    this.runningWorkflows.add(workflowId);

    try {
      const result = await this.executeWorkflow(state);
      return result;
    } finally {
      this.runningWorkflows.delete(workflowId);
    }
  }

  /**
   * Resume execution of an existing workflow
   */
  async resumeWorkflow(workflowId: WorkflowId): Promise<ExecutionResult> {
    const state = await this.storage.load(workflowId);
    if (!state) {
      throw new Error(`Workflow ${workflowId} not found`);
    }

    if (state.status === ExecutionStatus.COMPLETED) {
      throw new Error(`Workflow ${workflowId} is already completed`);
    }

    if (this.runningWorkflows.has(workflowId)) {
      throw new Error(`Workflow ${workflowId} is already running`);
    }

    this.runningWorkflows.add(workflowId);

    try {
      const result = await this.executeWorkflow(state);
      return result;
    } finally {
      this.runningWorkflows.delete(workflowId);
    }
  }

  /**
   * Main workflow execution logic
   */
  private async executeWorkflow(state: WorkflowState): Promise<ExecutionResult> {
    const startTime = Date.now();
    
    try {
      while (this.hasExecutableNodes(state)) {
        const executableNodes = this.getExecutableNodes(state);
        
        if (executableNodes.length === 0) {
          // No executable nodes, check if we're waiting for events
          const waitingNodes = this.getWaitingNodes(state);
          if (waitingNodes.length > 0) {
            this.log('info', `Waiting for events for nodes: ${waitingNodes.map(n => n.id).join(', ')}`);
            break; // Exit execution loop, workflow is waiting
          } else {
            // No executable or waiting nodes - workflow might be stuck
            throw new Error('Workflow execution stalled - no executable nodes found');
          }
        }

        // Execute nodes in parallel where possible
        await Promise.all(executableNodes.map(node => this.executeNode(state, node)));
        
        // Save state after each execution round
        await this.storage.save(state.id, state);
      }

      // Determine final status
      const allCompleted = Object.values(state.nodes).every(
        node => node.status === ExecutionStatus.COMPLETED || node.status === ExecutionStatus.SKIPPED
      );

      if (allCompleted) {
        state.status = ExecutionStatus.COMPLETED;
        state.completedAt = new Date();
      } else {
        state.status = ExecutionStatus.WAITING;
      }

      await this.storage.save(state.id, state);

      const duration = Date.now() - startTime;
      const nodeResults: Record<NodeId, unknown> = {};
      
      Object.values(state.nodes).forEach(node => {
        if (node.result !== undefined) {
          nodeResults[node.id] = node.result;
        }
      });

      return {
        workflowId: state.id,
        status: state.status,
        duration,
        nodeResults,
      };

    } catch (error) {
      state.status = ExecutionStatus.FAILED;
      state.completedAt = new Date();
      
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      await this.storage.save(state.id, state);

      return {
        workflowId: state.id,
        status: ExecutionStatus.FAILED,
        error: errorMessage,
        duration: Date.now() - startTime,
        nodeResults: {},
      };
    }
  }

  /**
   * Execute a single node
   */
  private async executeNode(state: WorkflowState, node: WorkflowNode): Promise<void> {
    const nodeState = state.nodes[node.id];
    
    this.log('debug', `Executing node: ${node.id} (${node.type})`);
    
    nodeState.status = ExecutionStatus.RUNNING;
    nodeState.startedAt = new Date();
    nodeState.attempts++;

    try {
      // Check for timeout
      const timeout = node.timeout || this.config.security?.maxExecutionTime;
      let result: unknown;

      if (timeout) {
        result = await Promise.race([
          this.nodeExecutor.execute(node, state.context, node.inputs),
          new Promise((_, reject) => 
            setTimeout(() => reject(new Error('Node execution timeout')), timeout)
          )
        ]);
      } else {
        result = await this.nodeExecutor.execute(node, state.context, node.inputs);
      }

      nodeState.result = result;
      nodeState.status = ExecutionStatus.COMPLETED;
      nodeState.completedAt = new Date();
      
      this.log('debug', `Node ${node.id} completed successfully`);

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      nodeState.error = errorMessage;
      
      // Check if we should retry
      if (node.retryConfig && nodeState.attempts < node.retryConfig.maxAttempts) {
        this.log('warn', `Node ${node.id} failed, will retry. Attempt ${nodeState.attempts}/${node.retryConfig.maxAttempts}`);
        
        nodeState.status = ExecutionStatus.PENDING;
        
        // Calculate delay for retry
        const baseDelay = node.retryConfig.delay;
        const multiplier = node.retryConfig.backoffMultiplier || 1;
        const maxDelay = node.retryConfig.maxDelay || baseDelay * 10;
        const delay = Math.min(baseDelay * Math.pow(multiplier, nodeState.attempts - 1), maxDelay);
        
        // Schedule retry
        setTimeout(() => {
          // Node will be picked up in the next execution cycle
        }, delay);
        
      } else {
        nodeState.status = ExecutionStatus.FAILED;
        nodeState.completedAt = new Date();
        this.log('error', `Node ${node.id} failed permanently: ${errorMessage}`);
      }
    }
  }

  /**
   * Get nodes that are ready to execute
   */
  private getExecutableNodes(state: WorkflowState): WorkflowNode[] {
    return state.definition.nodes.filter(node => {
      const nodeState = state.nodes[node.id];
      
      // Node must be pending
      if (nodeState.status !== ExecutionStatus.PENDING) return false;
      
      // All dependencies must be completed
      const dependenciesComplete = node.dependencies.every(depId => {
        const depState = state.nodes[depId];
        return depState && depState.status === ExecutionStatus.COMPLETED;
      });
      
      if (!dependenciesComplete) return false;
      
      // If node is waiting for events, check if they've occurred
      if (node.waitForEvents && node.waitForEvents.length > 0) {
        const eventsOccurred = node.waitForEvents.every(eventType => {
          return this.eventSystem.hasEventOccurred(eventType, undefined, nodeState.startedAt);
        });
        
        if (!eventsOccurred) {
          nodeState.status = ExecutionStatus.WAITING;
          nodeState.waitingForEvents = node.waitForEvents;
          return false;
        }
      }
      
      return true;
    });
  }

  /**
   * Check if there are any nodes that can potentially be executed
   */
  private hasExecutableNodes(state: WorkflowState): boolean {
    return Object.values(state.nodes).some(node => 
      node.status === ExecutionStatus.PENDING || 
      node.status === ExecutionStatus.WAITING
    );
  }

  /**
   * Get nodes that are waiting for events
   */
  private getWaitingNodes(state: WorkflowState): NodeState[] {
    return Object.values(state.nodes).filter(node => 
      node.status === ExecutionStatus.WAITING
    );
  }

  /**
   * Emit an event that workflows can wait for
   */
  emitEvent(event: WorkflowEvent): void {
    this.eventSystem.emit(event);
  }

  /**
   * Get the event system for advanced event handling
   */
  getEventSystem(): WorkflowEventSystem {
    return this.eventSystem;
  }

  /**
   * Get workflow state
   */
  async getWorkflowState(workflowId: WorkflowId): Promise<WorkflowState | null> {
    return this.storage.load(workflowId);
  }

  /**
   * Delete a workflow
   */
  async deleteWorkflow(workflowId: WorkflowId): Promise<void> {
    if (this.runningWorkflows.has(workflowId)) {
      throw new Error(`Cannot delete running workflow: ${workflowId}`);
    }
    await this.storage.delete(workflowId);
  }

  /**
   * List all workflows
   */
  async listWorkflows(): Promise<WorkflowId[]> {
    return this.storage.list();
  }

  /**
   * Logging utility
   */
  private log(level: string, message: string): void {
    const configLevel = this.config.logging?.level || 'info';
    const levels = { debug: 0, info: 1, warn: 2, error: 3 };
    
    if (levels[level as keyof typeof levels] >= levels[configLevel as keyof typeof levels]) {
      if (this.config.logging?.handler) {
        this.config.logging.handler(message, level);
      } else {
        // Use explicit console methods
        switch (level) {
          case 'debug':
            console.debug(message);
            break;
          case 'info':
            console.info(message);
            break;
          case 'warn':
            console.warn(message);
            break;
          case 'error':
            console.error(message);
            break;
          default:
            console.log(message);
        }
      }
    }
  }
} 