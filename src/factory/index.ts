/**
 * Factory functions for creating workflow components
 */
import { WorkflowExecutor } from '../core/index.js';
import { DefaultNodeExecutor } from '../core/node-executor.js';
import { 
  MemoryStorageAdapter, 
  LocalStorageAdapter, 
  RemoteStorageAdapter,
  type RemoteStorageConfig 
} from '../storage/index.js';
import { 
  StorageType, 
  type FlowsConfig,
  type WorkflowId,
  type WorkflowNode,
  type WorkflowDefinition,
  type WorkflowEvent,
  type EventType,
  type NodeId,
  type NodeExecutor,
} from '../types/index.js';

/**
 * Factory function to create a workflow executor with common configurations
 */
export function createFlows(config: FlowsConfig, nodeExecutor?: NodeExecutor): WorkflowExecutor {
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
  
  // Use provided executor or default to DefaultNodeExecutor with basic settings
  const executor = nodeExecutor || new DefaultNodeExecutor({ enableSubflows: false });
  
  return new WorkflowExecutor(storage, executor, config);
}

/**
 * Utility function to create a simple workflow definition
 */
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

/**
 * Utility function to create workflow events
 */
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