// Main exports
export { Editor } from './components/Editor'
export type { EditorProps } from './components/Editor'

// Types
export type {
  Workflow,
  WorkflowNode,
  NodeCategory,
  NodeTypeDefinition,
  NodeInputDefinition,
  NodeOutputDefinition,
  PluginManifest,
  UIConfig,
  FlowsConfig,
  EditorFeatures,
  EditorState,
  ExecutionResult,
  EditorEvents,
  NodeData,
  EdgeData,
  WorkflowExport,
  EditorConfig,
} from './types'

// Constants
export {
  DEFAULT_CATEGORIES,
  DEFAULT_NODE_TYPES,
} from './types'

// Plugin system
export {
  EditorPluginRegistry,
  pluginRegistry,
  getPluginRegistry,
  registerPlugin,
  getNodeType,
  getAllNodeTypes,
  getAllCategories,
} from './utils/plugin-registry'

// Flows integration
export {
  FlowsIntegration,
  createFlowsIntegration,
  executeWorkflow,
  validateWorkflow,
  getDefaultFlowsConfig,
  getAvailableNodeTypes,
} from './utils/flows-integration'

// Utilities
export {
  convertToWorkflow,
  convertFromWorkflow,
  createNewNode,
  createNewEdge,
  validateWorkflow as validateWorkflowStructure,
} from './utils/workflow-converter'

// Store
export {
  useEditorStore,
  useNodes,
  useEdges,
  useSelectedNodes,
  useSelectedEdges,
  useIsDirty,
  useNodeTypes,
  useCategories,
} from './store'

// Demo components
export { default as SimpleDemo } from './demo/SimpleDemo'
export { default as App } from './demo/App'
export { default as ComprehensiveExample } from './demo/ComprehensiveExample' 