import type { Node, Edge } from 'reactflow'

// Define our own Workflow type since flows library doesn't export it
export interface Workflow {
  id: string
  name: string
  nodes: WorkflowNode[]
}

export interface WorkflowNode {
  id: string
  type: string
  inputs?: Record<string, any>
  dependencies?: string[]
}

// ============================================================================
// Plugin System Types
// ============================================================================

export interface NodeCategory {
  id: string
  name: string
  description: string
  icon: string
  color: string
  order: number
}

export interface NodeTypeDefinition {
  id: string
  name: string
  description: string
  category: string
  icon: string
  color: string
  inputs: NodeInputDefinition[]
  outputs: NodeOutputDefinition[]
  configurable: boolean
  handler?: any // Simplified for now
}

export interface NodeInputDefinition {
  id: string
  name: string
  type: 'string' | 'number' | 'boolean' | 'array' | 'object' | 'select'
  required: boolean
  defaultValue?: any
  options?: { label: string; value: any }[]
  description?: string
}

export interface NodeOutputDefinition {
  id: string
  name: string
  type: 'string' | 'number' | 'boolean' | 'array' | 'object'
  description?: string
}

export interface PluginManifest {
  id: string
  name: string
  version: string
  description: string
  author: string
  categories: NodeCategory[]
  nodeTypes: NodeTypeDefinition[]
  dependencies?: string[]
}

// ============================================================================
// Editor Configuration Types
// ============================================================================

export interface EditorConfig {
  // Core settings
  theme?: 'light' | 'dark' | 'auto'
  layout?: 'vertical' | 'horizontal'
  
  // Plugin configuration
  plugins?: PluginManifest[]
  enabledCategories?: string[]
  customCategories?: NodeCategory[]
  
  // UI customization
  ui?: UIConfig
  
  // Workflow engine configuration
  flowsConfig?: FlowsConfig
  
  // Editor features
  features?: EditorFeatures
}

export interface UIConfig {
  // Layout
  sidebarWidth?: number
  toolbarHeight?: number
  minimapEnabled?: boolean
  
  // Styling
  nodeColors?: Record<string, string>
  edgeColors?: Record<string, string>
  backgroundColor?: string
  
  // Customisation
  customCSS?: string
  customThemes?: Record<string, any>
}

export interface FlowsConfig {
  storage?: {
    type: 'memory' | 'localStorage' | 'remote'
    config?: any
  }
  logging?: {
    level: 'debug' | 'info' | 'warn' | 'error'
  }
  failureHandling?: {
    strategy: 'retry' | 'circuitBreaker' | 'deadLetter'
    config?: any
  }
}

export interface EditorFeatures {
  // Core features
  dragAndDrop?: boolean
  nodeResizing?: boolean
  nodeSelection?: boolean
  edgeEditing?: boolean
  
  // Advanced features
  minimap?: boolean
  controls?: boolean
  background?: boolean
  grid?: boolean
  
  // Workflow features
  validation?: boolean
  autoLayout?: boolean
  snapToGrid?: boolean
  
  // Export/Import
  exportFormats?: ('json' | 'png' | 'svg')[]
  importFormats?: ('json')[]
}

// ============================================================================
// Editor State Types
// ============================================================================

export interface EditorState {
  // Workflow data
  workflow: Workflow | null
  nodes: Node[]
  edges: Edge[]
  
  // UI state
  selectedNodes: string[]
  selectedEdges: string[]
  hoveredNode: string | null
  
  // Editor state
  isDirty: boolean
  isExecuting: boolean
  executionResults: ExecutionResult[]
  
  // View state
  zoom: number
  pan: { x: number; y: number }
  viewport: { x: number; y: number; zoom: number }
}

export interface ExecutionResult {
  nodeId: string
  status: 'pending' | 'running' | 'completed' | 'failed'
  result?: any
  error?: string
  timestamp: Date
}

// ============================================================================
// Event Types
// ============================================================================

export interface EditorEvents {
  onNodeAdd?: (node: Node) => void
  onNodeRemove?: (nodeId: string) => void
  onNodeUpdate?: (node: Node) => void
  onEdgeAdd?: (edge: Edge) => void
  onEdgeRemove?: (edgeId: string) => void
  onEdgeUpdate?: (edge: Edge) => void
  onWorkflowChange?: (workflow: Workflow) => void
  onWorkflowExecute?: (workflow: Workflow) => void
  onWorkflowSave?: (workflow: Workflow) => void
  onWorkflowLoad?: (workflow: Workflow) => void
}

// ============================================================================
// Built-in Node Categories
// ============================================================================

export const DEFAULT_CATEGORIES: NodeCategory[] = [
  {
    id: 'core',
    name: 'Core',
    description: 'Basic workflow nodes',
    icon: 'Circle',
    color: '#0078d4',
    order: 1,
  },
  {
    id: 'logic',
    name: 'Logic',
    description: 'Logical operations and conditions',
    icon: 'Branch',
    color: '#107c10',
    order: 2,
  },
  {
    id: 'math',
    name: 'Mathematics',
    description: 'Mathematical operations',
    icon: 'Calculator',
    color: '#d13438',
    order: 3,
  },
  {
    id: 'string',
    name: 'Text',
    description: 'String manipulation operations',
    icon: 'Text',
    color: '#ff8c00',
    order: 4,
  },
  {
    id: 'flow',
    name: 'Flow Control',
    description: 'Workflow control operations',
    icon: 'Flow',
    color: '#5c2d91',
    order: 5,
  },
  {
    id: 'custom',
    name: 'Custom',
    description: 'Custom node types',
    icon: 'Code',
    color: '#6b69d6',
    order: 6,
  },
]

// ============================================================================
// Built-in Node Types
// ============================================================================

export const DEFAULT_NODE_TYPES: NodeTypeDefinition[] = [
  // Core nodes
  {
    id: 'data',
    name: 'Data',
    description: 'Pass-through data node',
    category: 'core',
    icon: 'Database',
    color: '#0078d4',
    inputs: [
      { id: 'value', name: 'Value', type: 'object', required: false, description: 'Data to pass through' }
    ],
    outputs: [
      { id: 'value', name: 'Value', type: 'object', description: 'Passed through data' }
    ],
    configurable: true,
  },
  {
    id: 'delay',
    name: 'Delay',
    description: 'Wait for specified duration',
    category: 'core',
    icon: 'Clock',
    color: '#0078d4',
    inputs: [
      { id: 'duration', name: 'Duration (ms)', type: 'number', required: true, defaultValue: 1000 }
    ],
    outputs: [
      { id: 'value', name: 'Value', type: 'object', description: 'Input value after delay' }
    ],
    configurable: true,
  },
  
  // Logic nodes
  {
    id: 'logic-and',
    name: 'AND',
    description: 'Boolean AND operation',
    category: 'logic',
    icon: 'Branch',
    color: '#107c10',
    inputs: [
      { id: 'values', name: 'Values', type: 'array', required: true, description: 'Array of boolean values' }
    ],
    outputs: [
      { id: 'result', name: 'Result', type: 'boolean', description: 'AND result' }
    ],
    configurable: false,
  },
  {
    id: 'logic-or',
    name: 'OR',
    description: 'Boolean OR operation',
    category: 'logic',
    icon: 'Branch',
    color: '#107c10',
    inputs: [
      { id: 'values', name: 'Values', type: 'array', required: true, description: 'Array of boolean values' }
    ],
    outputs: [
      { id: 'result', name: 'Result', type: 'boolean', description: 'OR result' }
    ],
    configurable: false,
  },
  
  // Math nodes
  {
    id: 'math-add',
    name: 'Add',
    description: 'Add multiple numbers',
    category: 'math',
    icon: 'Calculator',
    color: '#d13438',
    inputs: [
      { id: 'values', name: 'Values', type: 'array', required: true, description: 'Array of numbers to add' }
    ],
    outputs: [
      { id: 'result', name: 'Result', type: 'number', description: 'Sum of all values' }
    ],
    configurable: false,
  },
  {
    id: 'math-multiply',
    name: 'Multiply',
    description: 'Multiply multiple numbers',
    category: 'math',
    icon: 'Calculator',
    color: '#d13438',
    inputs: [
      { id: 'values', name: 'Values', type: 'array', required: true, description: 'Array of numbers to multiply' }
    ],
    outputs: [
      { id: 'result', name: 'Result', type: 'number', description: 'Product of all values' }
    ],
    configurable: false,
  },
  
  // String nodes
  {
    id: 'string-concat',
    name: 'Concatenate',
    description: 'Concatenate strings',
    category: 'string',
    icon: 'Text',
    color: '#ff8c00',
    inputs: [
      { id: 'values', name: 'Values', type: 'array', required: true, description: 'Array of strings to concatenate' },
      { id: 'separator', name: 'Separator', type: 'string', required: false, defaultValue: '', description: 'Separator between strings' }
    ],
    outputs: [
      { id: 'result', name: 'Result', type: 'string', description: 'Concatenated string' }
    ],
    configurable: true,
  },
  
  // Flow control nodes
  {
    id: 'condition',
    name: 'Condition',
    description: 'Conditional execution',
    category: 'flow',
    icon: 'Flow',
    color: '#5c2d91',
    inputs: [
      { id: 'condition', name: 'Condition', type: 'boolean', required: true, description: 'Condition to evaluate' },
      { id: 'thenValue', name: 'Then', type: 'object', required: false, description: 'Value if condition is true' },
      { id: 'elseValue', name: 'Else', type: 'object', required: false, description: 'Value if condition is false' }
    ],
    outputs: [
      { id: 'result', name: 'Result', type: 'object', description: 'Selected value based on condition' }
    ],
    configurable: true,
  },
]

// ============================================================================
// Utility Types
// ============================================================================

export type NodeData = {
  label: string
  type: string
  category: string
  inputs?: Record<string, any>
  outputs?: Record<string, any>
  config?: Record<string, any>
}

export type EdgeData = {
  label?: string
  type?: string
}

export interface WorkflowExport {
  workflow: Workflow
  nodes: Node[]
  edges: Edge[]
  metadata: {
    version: string
    exportedAt: string
    editorVersion: string
  }
} 