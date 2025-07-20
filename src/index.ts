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

// Core workflow types
export type {
  WorkflowDefinition,
  WorkflowNode,
  WorkflowId,
  NodeId,
  ExecutionStatus,
  NodeExecutor,
} from './types/index.js';

export type {
  HandlerPlugin,
} from './core/plugin-registry.js';

// Core workflow components
export {
  WorkflowExecutor,
  WorkflowEventSystem,
  FailureManager,
} from './core/index.js';

// Node executors and handlers
export {
  DefaultNodeExecutor,
} from './core/node-executor.js';

export {
  DataHandler,
  DelayHandler,
  SubflowHandler,
  LogicalHandler,
  MathHandler,
  StringHandler,
  ConditionHandler,
  MergeHandler,
} from './core/handlers/index.js';

export {
  PluginRegistry,
} from './core/plugin-registry.js';

// Built-in plugins and collections
export {
  // Individual plugins
  logicalAndPlugin,
  logicalOrPlugin,
  logicalNotPlugin,
  logicalXorPlugin,
  mathAddPlugin,
  mathSubtractPlugin,
  mathMultiplyPlugin,
  mathDividePlugin,
  mathPowerPlugin,
  mathModuloPlugin,
  stringConcatPlugin,
  stringSubstringPlugin,
  stringReplacePlugin,
  stringMatchPlugin,
  stringSplitPlugin,
  stringComparePlugin,
  stringLengthPlugin,
  stringCasePlugin,
  conditionPlugin,
  mergeAllPlugin,
  mergeAnyPlugin,
  mergeMajorityPlugin,
  mergeCountPlugin,
  
  // Plugin collections
  logicalPlugins,
  mathPlugins,
  stringPlugins,
  flowControlPlugins,
  allBuiltInPlugins,
  
  // Utility functions
  getPluginsByCategory,
  getPluginMetadata,
} from './core/built-in-plugins.js';

// Storage adapters
export {
  MemoryStorageAdapter,
  LocalStorageAdapter,
  RemoteStorageAdapter,
} from './storage/index.js';

// Configuration and enums
export {
  StorageType,
  FailureStrategy,
  ExecutionStatus as ExecutionStatusEnum,
} from './types/index.js';

export type {
  FlowsConfig,
  FailureHandlingConfig,
} from './types/index.js';

// Factory functions
export {
  createFlows,
  createWorkflow,
  createEvent,
} from './factory/index.js';

// Utilities
export {
  createFlowsWithSubflows,
} from './utils/subflow-utils.js'; 