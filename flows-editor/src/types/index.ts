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
  
  // Flows library features
  subflows?: boolean
  customHandlers?: boolean
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
  {
    id: 'subflow',
    name: 'Subflow',
    description: 'Execute another workflow',
    category: 'core',
    icon: 'Flow',
    color: '#0078d4',
    inputs: [
      { id: 'workflowId', name: 'Workflow ID', type: 'string', required: true, description: 'ID of the workflow to execute' }
    ],
    outputs: [
      { id: 'result', name: 'Result', type: 'object', description: 'Result from subflow execution' }
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
  {
    id: 'logic-not',
    name: 'NOT',
    description: 'Boolean NOT operation',
    category: 'logic',
    icon: 'Branch',
    color: '#107c10',
    inputs: [
      { id: 'values', name: 'Values', type: 'array', required: true, description: 'Array with single boolean value' }
    ],
    outputs: [
      { id: 'result', name: 'Result', type: 'boolean', description: 'NOT result' }
    ],
    configurable: false,
  },
  {
    id: 'logic-xor',
    name: 'XOR',
    description: 'Boolean XOR operation',
    category: 'logic',
    icon: 'Branch',
    color: '#107c10',
    inputs: [
      { id: 'values', name: 'Values', type: 'array', required: true, description: 'Array with exactly two boolean values' }
    ],
    outputs: [
      { id: 'result', name: 'Result', type: 'boolean', description: 'XOR result' }
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
    id: 'math-subtract',
    name: 'Subtract',
    description: 'Subtract numbers',
    category: 'math',
    icon: 'Calculator',
    color: '#d13438',
    inputs: [
      { id: 'values', name: 'Values', type: 'array', required: true, description: 'Array of numbers to subtract' }
    ],
    outputs: [
      { id: 'result', name: 'Result', type: 'number', description: 'Subtraction result' }
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
  {
    id: 'math-divide',
    name: 'Divide',
    description: 'Divide numbers (with zero-division protection)',
    category: 'math',
    icon: 'Calculator',
    color: '#d13438',
    inputs: [
      { id: 'values', name: 'Values', type: 'array', required: true, description: 'Array of numbers to divide' }
    ],
    outputs: [
      { id: 'result', name: 'Result', type: 'number', description: 'Division result' }
    ],
    configurable: false,
  },
  {
    id: 'math-power',
    name: 'Power',
    description: 'Exponentiation (base^exponent)',
    category: 'math',
    icon: 'Calculator',
    color: '#d13438',
    inputs: [
      { id: 'base', name: 'Base', type: 'number', required: true, description: 'Base number' },
      { id: 'exponent', name: 'Exponent', type: 'number', required: true, description: 'Exponent' }
    ],
    outputs: [
      { id: 'result', name: 'Result', type: 'number', description: 'Power result' }
    ],
    configurable: false,
  },
  {
    id: 'math-modulo',
    name: 'Modulo',
    description: 'Modulo operation (remainder after division)',
    category: 'math',
    icon: 'Calculator',
    color: '#d13438',
    inputs: [
      { id: 'dividend', name: 'Dividend', type: 'number', required: true, description: 'Number to divide' },
      { id: 'divisor', name: 'Divisor', type: 'number', required: true, description: 'Number to divide by' }
    ],
    outputs: [
      { id: 'result', name: 'Result', type: 'number', description: 'Modulo result' }
    ],
    configurable: false,
  },
  
  // String nodes
  {
    id: 'string-concat',
    name: 'Concatenate',
    description: 'Concatenate multiple strings',
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
  {
    id: 'string-substring',
    name: 'Substring',
    description: 'Extract substring using start/end positions',
    category: 'string',
    icon: 'Text',
    color: '#ff8c00',
    inputs: [
      { id: 'text', name: 'Text', type: 'string', required: true, description: 'Input text' },
      { id: 'start', name: 'Start Position', type: 'number', required: true, description: 'Starting position (0-based)' },
      { id: 'end', name: 'End Position', type: 'number', required: false, description: 'Ending position (optional)' }
    ],
    outputs: [
      { id: 'result', name: 'Result', type: 'string', description: 'Extracted substring' }
    ],
    configurable: true,
  },
  {
    id: 'string-replace',
    name: 'Replace',
    description: 'Replace text with regex support',
    category: 'string',
    icon: 'Text',
    color: '#ff8c00',
    inputs: [
      { id: 'text', name: 'Text', type: 'string', required: true, description: 'Input text' },
      { id: 'search', name: 'Search Pattern', type: 'string', required: true, description: 'Text or regex to search for' },
      { id: 'replace', name: 'Replacement', type: 'string', required: true, description: 'Text to replace with' },
      { id: 'global', name: 'Global Replace', type: 'boolean', required: false, defaultValue: true, description: 'Replace all occurrences' }
    ],
    outputs: [
      { id: 'result', name: 'Result', type: 'string', description: 'Text with replacements' }
    ],
    configurable: true,
  },
  {
    id: 'string-match',
    name: 'Match',
    description: 'Match text against regex patterns',
    category: 'string',
    icon: 'Text',
    color: '#ff8c00',
    inputs: [
      { id: 'text', name: 'Text', type: 'string', required: true, description: 'Text to match' },
      { id: 'pattern', name: 'Pattern', type: 'string', required: true, description: 'Regex pattern to match against' }
    ],
    outputs: [
      { id: 'result', name: 'Result', type: 'boolean', description: 'Match result' }
    ],
    configurable: true,
  },
  {
    id: 'string-split',
    name: 'Split',
    description: 'Split string into array using delimiter',
    category: 'string',
    icon: 'Text',
    color: '#ff8c00',
    inputs: [
      { id: 'text', name: 'Text', type: 'string', required: true, description: 'Text to split' },
      { id: 'delimiter', name: 'Delimiter', type: 'string', required: true, description: 'Delimiter to split on' }
    ],
    outputs: [
      { id: 'result', name: 'Result', type: 'array', description: 'Array of split strings' }
    ],
    configurable: true,
  },
  {
    id: 'string-compare',
    name: 'Compare',
    description: 'Compare strings with case-sensitivity options',
    category: 'string',
    icon: 'Text',
    color: '#ff8c00',
    inputs: [
      { id: 'text1', name: 'Text 1', type: 'string', required: true, description: 'First string to compare' },
      { id: 'text2', name: 'Text 2', type: 'string', required: true, description: 'Second string to compare' },
      { id: 'caseSensitive', name: 'Case Sensitive', type: 'boolean', required: false, defaultValue: true, description: 'Whether comparison is case sensitive' }
    ],
    outputs: [
      { id: 'result', name: 'Result', type: 'boolean', description: 'Comparison result' }
    ],
    configurable: true,
  },
  {
    id: 'string-length',
    name: 'Length',
    description: 'Get string length',
    category: 'string',
    icon: 'Text',
    color: '#ff8c00',
    inputs: [
      { id: 'text', name: 'Text', type: 'string', required: true, description: 'Text to measure' }
    ],
    outputs: [
      { id: 'result', name: 'Result', type: 'number', description: 'String length' }
    ],
    configurable: false,
  },
  {
    id: 'string-case',
    name: 'Case Transform',
    description: 'Transform case (upper, lower, title, sentence)',
    category: 'string',
    icon: 'Text',
    color: '#ff8c00',
    inputs: [
      { id: 'text', name: 'Text', type: 'string', required: true, description: 'Text to transform' },
      { id: 'caseType', name: 'Case Type', type: 'select', required: true, options: [
        { label: 'Upper Case', value: 'upper' },
        { label: 'Lower Case', value: 'lower' },
        { label: 'Title Case', value: 'title' },
        { label: 'Sentence Case', value: 'sentence' }
      ], description: 'Type of case transformation' }
    ],
    outputs: [
      { id: 'result', name: 'Result', type: 'string', description: 'Transformed text' }
    ],
    configurable: true,
  },
  
  // Flow control nodes
  {
    id: 'condition',
    name: 'Condition',
    description: 'Conditional execution with multiple condition types',
    category: 'flow',
    icon: 'Flow',
    color: '#5c2d91',
    inputs: [
      { id: 'conditionType', name: 'Condition Type', type: 'select', required: true, options: [
        { label: 'Simple', value: 'simple' },
        { label: 'Compare', value: 'compare' },
        { label: 'Exists', value: 'exists' },
        { label: 'Range', value: 'range' }
      ], description: 'Type of condition to evaluate' },
      { id: 'condition', name: 'Condition', type: 'boolean', required: false, description: 'Simple boolean condition' },
      { id: 'left', name: 'Left Value', type: 'object', required: false, description: 'Left side of comparison' },
      { id: 'right', name: 'Right Value', type: 'object', required: false, description: 'Right side of comparison' },
      { id: 'operator', name: 'Operator', type: 'select', required: false, options: [
        { label: 'Equals', value: '===' },
        { label: 'Not Equals', value: '!==' },
        { label: 'Greater Than', value: '>' },
        { label: 'Less Than', value: '<' },
        { label: 'Greater or Equal', value: '>=' },
        { label: 'Less or Equal', value: '<=' },
        { label: 'Contains', value: 'contains' },
        { label: 'Starts With', value: 'startsWith' },
        { label: 'Ends With', value: 'endsWith' }
      ], description: 'Comparison operator' },
      { id: 'thenValue', name: 'Then Value', type: 'object', required: false, description: 'Value if condition is true' },
      { id: 'elseValue', name: 'Else Value', type: 'object', required: false, description: 'Value if condition is false' }
    ],
    outputs: [
      { id: 'result', name: 'Result', type: 'object', description: 'Selected value based on condition' }
    ],
    configurable: true,
  },
  {
    id: 'merge-all',
    name: 'Merge All',
    description: 'Wait for all dependencies to succeed',
    category: 'flow',
    icon: 'Flow',
    color: '#5c2d91',
    inputs: [
      { id: 'strict', name: 'Strict Mode', type: 'boolean', required: false, defaultValue: true, description: 'Require all dependencies to succeed' }
    ],
    outputs: [
      { id: 'result', name: 'Result', type: 'object', description: 'Combined results from all dependencies' }
    ],
    configurable: true,
  },
  {
    id: 'merge-any',
    name: 'Merge Any',
    description: 'Proceed when any dependency succeeds',
    category: 'flow',
    icon: 'Flow',
    color: '#5c2d91',
    inputs: [
      { id: 'strict', name: 'Strict Mode', type: 'boolean', required: false, defaultValue: false, description: 'Require at least one dependency to succeed' }
    ],
    outputs: [
      { id: 'result', name: 'Result', type: 'object', description: 'Result from first successful dependency' }
    ],
    configurable: true,
  },
  {
    id: 'merge-majority',
    name: 'Merge Majority',
    description: 'Proceed when majority of dependencies succeed',
    category: 'flow',
    icon: 'Flow',
    color: '#5c2d91',
    inputs: [
      { id: 'strict', name: 'Strict Mode', type: 'boolean', required: false, defaultValue: true, description: 'Require majority to succeed' }
    ],
    outputs: [
      { id: 'result', name: 'Result', type: 'object', description: 'Combined results from successful dependencies' }
    ],
    configurable: true,
  },
  {
    id: 'merge-count',
    name: 'Merge Count',
    description: 'Proceed when specific number of dependencies succeed',
    category: 'flow',
    icon: 'Flow',
    color: '#5c2d91',
    inputs: [
      { id: 'requiredCount', name: 'Required Count', type: 'number', required: true, description: 'Number of dependencies that must succeed' },
      { id: 'strict', name: 'Strict Mode', type: 'boolean', required: false, defaultValue: true, description: 'Require exact count to succeed' }
    ],
    outputs: [
      { id: 'result', name: 'Result', type: 'object', description: 'Combined results from successful dependencies' }
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