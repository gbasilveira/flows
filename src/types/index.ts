/**
 * Core types for the Flows DAG workflow executor
 */

export type NodeId = string;
export type WorkflowId = string;
export type EventType = string;

/**
 * Execution status of a node or workflow
 */
export enum ExecutionStatus {
  PENDING = 'pending',
  RUNNING = 'running',
  COMPLETED = 'completed',
  FAILED = 'failed',
  WAITING = 'waiting',
  SKIPPED = 'skipped',
}

/**
 * Storage backend types
 */
export enum StorageType {
  MEMORY = 'memory',
  LOCAL_STORAGE = 'localStorage',
  REMOTE = 'remote',
}

/**
 * Node definition in the DAG
 */
export interface WorkflowNode {
  id: NodeId;
  type: string;
  name?: string;
  description?: string;
  inputs: Record<string, unknown>;
  outputs?: Record<string, unknown>;
  dependencies: NodeId[];
  waitForEvents?: EventType[];
  retryConfig?: RetryConfig;
  timeout?: number;
  metadata?: Record<string, unknown>;
}

/**
 * Retry configuration for nodes
 */
export interface RetryConfig {
  maxAttempts: number;
  delay: number;
  backoffMultiplier?: number;
  maxDelay?: number;
}

/**
 * Complete workflow definition
 */
export interface WorkflowDefinition {
  id: WorkflowId;
  name: string;
  description?: string;
  version: string;
  nodes: WorkflowNode[];
  metadata?: Record<string, unknown>;
}

/**
 * Runtime state of a node
 */
export interface NodeState {
  id: NodeId;
  status: ExecutionStatus;
  result?: unknown;
  error?: string;
  startedAt?: Date;
  completedAt?: Date;
  attempts: number;
  waitingForEvents?: EventType[];
}

/**
 * Runtime state of a workflow
 */
export interface WorkflowState {
  id: WorkflowId;
  definition: WorkflowDefinition;
  status: ExecutionStatus;
  nodes: Record<NodeId, NodeState>;
  startedAt?: Date;
  completedAt?: Date;
  context: Record<string, unknown>;
  events: WorkflowEvent[];
}

/**
 * Events that can trigger node execution
 */
export interface WorkflowEvent {
  id: string;
  type: EventType;
  data?: unknown;
  timestamp: Date;
  nodeId?: NodeId;
}

/**
 * Storage adapter interface
 */
export interface StorageAdapter {
  save(workflowId: WorkflowId, state: WorkflowState): Promise<void>;
  load(workflowId: WorkflowId): Promise<WorkflowState | null>;
  delete(workflowId: WorkflowId): Promise<void>;
  list(): Promise<WorkflowId[]>;
}

/**
 * Node executor interface
 */
export interface NodeExecutor {
  execute(
    node: WorkflowNode,
    context: Record<string, unknown>,
    inputs: Record<string, unknown>
  ): Promise<unknown>;
}

/**
 * Event listener interface
 */
export interface EventListener {
  on(eventType: EventType, callback: (event: WorkflowEvent) => void): void;
  off(eventType: EventType, callback: (event: WorkflowEvent) => void): void;
  emit(event: WorkflowEvent): void;
}

/**
 * Configuration for the workflow engine
 */
export interface FlowsConfig {
  storage: {
    type: StorageType;
    config?: Record<string, unknown>;
  };
  security?: {
    validateNodes?: boolean;
    allowedNodeTypes?: string[];
    maxExecutionTime?: number;
  };
  logging?: {
    level: 'debug' | 'info' | 'warn' | 'error';
    handler?: (message: string, level: string) => void;
  };
}

/**
 * Result of workflow execution
 */
export interface ExecutionResult {
  workflowId: WorkflowId;
  status: ExecutionStatus;
  result?: unknown;
  error?: string;
  duration: number;
  nodeResults: Record<NodeId, unknown>;
} 