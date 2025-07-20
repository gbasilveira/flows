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
  CIRCUIT_OPEN = 'circuit_open',
  DEAD_LETTERED = 'dead_lettered',
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
 * Failure handling strategies
 */
export enum FailureStrategy {
  FAIL_FAST = 'fail_fast',                    // Stop immediately on first failure
  RETRY_AND_FAIL = 'retry_and_fail',          // Retry then fail if unsuccessful
  RETRY_AND_DLQ = 'retry_and_dlq',            // Retry then send to dead letter queue
  RETRY_AND_SKIP = 'retry_and_skip',          // Retry then skip and continue
  CIRCUIT_BREAKER = 'circuit_breaker',        // Use circuit breaker pattern
  GRACEFUL_DEGRADATION = 'graceful_degradation', // Continue with reduced functionality
}

/**
 * Types of failures
 */
export enum FailureType {
  TRANSIENT = 'transient',       // Temporary failures (network, timeout)
  PERMANENT = 'permanent',       // Permanent failures (validation, logic errors)
  POISON = 'poison',            // Messages that consistently fail
  DEPENDENCY = 'dependency',     // External dependency failures
  RESOURCE = 'resource',        // Resource exhaustion failures
  SECURITY = 'security',        // Security-related failures
}

/**
 * Circuit breaker states
 */
export enum CircuitState {
  CLOSED = 'closed',     // Normal operation
  OPEN = 'open',         // Failures detected, circuit is open
  HALF_OPEN = 'half_open', // Testing if service is back to normal
}

/**
 * Enhanced retry configuration for nodes
 */
export interface RetryConfig {
  maxAttempts: number;
  delay: number;
  backoffMultiplier?: number;
  maxDelay?: number;
  retryableErrors?: string[]; // Specific error patterns to retry
  nonRetryableErrors?: string[]; // Errors that should not be retried
  jitter?: boolean; // Add randomization to delays
}

/**
 * Circuit breaker configuration
 */
export interface CircuitBreakerConfig {
  failureThreshold: number;    // Number of failures to open circuit
  timeWindow: number;          // Time window in ms to count failures
  recoveryTimeout: number;     // Time in ms before trying half-open
  successThreshold?: number;   // Successes needed in half-open to close
  monitoringWindow?: number;   // Rolling window for failure rate calculation
}

/**
 * Dead letter queue configuration
 */
export interface DeadLetterConfig {
  enabled: boolean;
  maxRetries?: number;         // Max retries before DLQ
  retentionPeriod?: number;    // How long to keep DLQ items (ms)
  handler?: (node: WorkflowNode, error: string, attempts: number) => void;
  storage?: 'memory' | 'persistent' | 'external';
}

/**
 * Failure monitoring configuration
 */
export interface FailureMonitoringConfig {
  enabled: boolean;
  failureRateThreshold?: number;  // Percentage (0-100)
  alertingEnabled?: boolean;
  alertHandler?: (alert: FailureAlert) => void;
  metricsCollectionInterval?: number; // ms
  retentionPeriod?: number; // How long to keep metrics (ms)
}

/**
 * Failure alert information
 */
export interface FailureAlert {
  workflowId: WorkflowId;
  nodeId?: NodeId;
  alertType: 'HIGH_FAILURE_RATE' | 'CIRCUIT_OPEN' | 'DLQ_THRESHOLD' | 'POISON_MESSAGE';
  message: string;
  timestamp: Date;
  metadata?: Record<string, unknown>;
}

/**
 * Comprehensive failure handling configuration
 */
export interface FailureHandlingConfig {
  strategy: FailureStrategy;
  circuitBreaker?: CircuitBreakerConfig;
  deadLetter?: DeadLetterConfig;
  monitoring?: FailureMonitoringConfig;
  poisonMessageThreshold?: number; // Attempts before considering poison
  gracefulDegradationConfig?: {
    continueOnNodeFailure?: boolean;
    skipDependentNodes?: boolean;
    fallbackResults?: Record<NodeId, unknown>;
  };
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
  failureHandling?: FailureHandlingConfig;
  metadata?: Record<string, unknown>;
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
  failureHandling?: FailureHandlingConfig; // Global failure handling
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
  failureType?: FailureType;
  startedAt?: Date;
  completedAt?: Date;
  attempts: number;
  waitingForEvents?: EventType[];
  circuitState?: CircuitState;
  lastFailureTime?: Date;
  consecutiveFailures?: number;
  deadLettered?: boolean;
  isPoisonMessage?: boolean;
}

/**
 * Circuit breaker state
 */
export interface CircuitBreakerState {
  state: CircuitState;
  failureCount: number;
  lastFailureTime?: Date;
  lastSuccessTime?: Date;
  nextAttemptTime?: Date;
  consecutiveSuccesses?: number;
}

/**
 * Failure metrics for monitoring
 */
export interface FailureMetrics {
  workflowId: WorkflowId;
  nodeId?: NodeId;
  totalExecutions: number;
  totalFailures: number;
  failureRate: number;
  lastFailureTime?: Date;
  failuresByType: Record<FailureType, number>;
  averageRetryAttempts: number;
  poisonMessageCount: number;
  circuitOpenCount: number;
  deadLetterCount: number;
}

/**
 * Dead letter queue item
 */
export interface DeadLetterItem {
  id: string;
  workflowId: WorkflowId;
  nodeId: NodeId;
  originalNode: WorkflowNode;
  error: string;
  failureType: FailureType;
  attempts: number;
  timestamp: Date;
  retryCount: number;
  canRetry: boolean;
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
  circuitBreakers?: Record<NodeId, CircuitBreakerState>;
  failureMetrics?: Record<NodeId, FailureMetrics>;
  deadLetterQueue?: DeadLetterItem[];
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
  failureHandling?: FailureHandlingConfig;
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
  failureMetrics?: FailureMetrics[];
  deadLetterItems?: DeadLetterItem[];
} 