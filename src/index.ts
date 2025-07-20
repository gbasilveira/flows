/**
 * Flows - A stateful, secure, JS-embedded DAG workflow executor
 * 
 * This library provides:
 * - DAG-based workflow execution
 * - Configurable state persistence (memory, localStorage, remote API)
 * - Asynchronous event handling
 * - Frontend compatibility
 * - TypeScript support
 */

// Core types
export type {
  // Basic types
  NodeId,
  WorkflowId,
  EventType,

  // Node and workflow definitions
  WorkflowNode,
  WorkflowDefinition,
  RetryConfig,

  // Runtime state
  NodeState,
  WorkflowState,
  WorkflowEvent,

  // Execution
  ExecutionResult,
  NodeExecutor,
  EventListener,

  // Storage
  StorageAdapter,

  // Configuration
  FlowsConfig,

  // Failure handling types
  FailureHandlingConfig,
  CircuitBreakerConfig,
  DeadLetterConfig,
  FailureMonitoringConfig,
  FailureAlert,
  FailureMetrics,
  DeadLetterItem,
  CircuitBreakerState,
} from './types/index.js';

export { 
  ExecutionStatus, 
  StorageType,
  FailureStrategy,
  FailureType,
  CircuitState,
} from './types/index.js';

// Storage adapters
export {
  MemoryStorageAdapter,
  LocalStorageAdapter,
  RemoteStorageAdapter,
  type RemoteStorageConfig,
} from './storage/index.js';

// Core workflow engine
export {
  WorkflowExecutor,
  WorkflowEventSystem,
  FailureManager,
} from './core/index.js';

/**
 * Factory function to create a workflow executor with common configurations
 */
import { WorkflowExecutor } from './core/index.js';
import { 
  MemoryStorageAdapter, 
  LocalStorageAdapter, 
  RemoteStorageAdapter,
  type RemoteStorageConfig 
} from './storage/index.js';
import { 
  StorageType, 
  type FlowsConfig,
  type WorkflowId,
  type WorkflowNode,
  type WorkflowDefinition,
  type WorkflowEvent,
  type EventType,
  type NodeId,
} from './types/index.js';

export function createFlows(config: FlowsConfig): WorkflowExecutor {
  let storage;
  
  switch (config.storage.type) {
    case StorageType.MEMORY:
      storage = new MemoryStorageAdapter();
      break;
      
    case StorageType.LOCAL_STORAGE:
      const prefix = config.storage.config?.keyPrefix as string;
      storage = new LocalStorageAdapter(prefix);
      break;
      
    case StorageType.REMOTE:
      const remoteConfig = config.storage.config as unknown as RemoteStorageConfig;
      if (!remoteConfig?.baseUrl) {
        throw new Error('Remote storage requires baseUrl in config');
      }
      storage = new RemoteStorageAdapter(remoteConfig);
      break;
      
    default:
      throw new Error(`Unsupported storage type: ${config.storage.type}`);
  }
  
  return new WorkflowExecutor(storage, config);
}

// Utility function to create a simple workflow definition
export function createWorkflow(
  id: WorkflowId,
  name: string,
  nodes: WorkflowNode[],
  options: {
    description?: string;
    version?: string;
    metadata?: Record<string, unknown>;
  } = {}
): WorkflowDefinition {
  return {
    id,
    name,
    description: options.description,
    version: options.version || '1.0.0',
    nodes,
    metadata: options.metadata,
  };
}

// Utility function to create workflow events
export function createEvent(
  type: EventType,
  data?: unknown,
  nodeId?: NodeId
): WorkflowEvent {
  return {
    id: `${type}_${Date.now()}_${Math.random().toString(36).slice(2, 11)}`,
    type,
    data,
    timestamp: new Date(),
    nodeId,
  };
} 