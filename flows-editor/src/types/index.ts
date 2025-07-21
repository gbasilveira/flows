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
    id: 'console',
    name: 'Console',
    description: 'Console output operations',
    icon: 'Document',
    color: '#6b69d6',
    order: 6,
  },
  {
    id: 'number',
    name: 'Numbers',
    description: 'Number operations and manipulation',
    icon: 'NumberSymbol',
    color: '#00b294',
    order: 7,
  },
  {
    id: 'array',
    name: 'Arrays',
    description: 'Array operations and manipulation',
    icon: 'List',
    color: '#881798',
    order: 8,
  },
  {
    id: 'object',
    name: 'Objects',
    description: 'Object operations and manipulation',
    icon: 'Object',
    color: '#ff6b35',
    order: 9,
  },
  {
    id: 'boolean',
    name: 'Booleans',
    description: 'Boolean operations and validation',
    icon: 'ToggleRight',
    color: '#8c8c8c',
    order: 10,
  },
  {
    id: 'json',
    name: 'JSON',
    description: 'JSON parsing and validation',
    icon: 'Code',
    color: '#2b88d8',
    order: 11,
  },
  {
    id: 'type-checking',
    name: 'Type Checking',
    description: 'Type checking and conversion',
    icon: 'CheckMark',
    color: '#107c10',
    order: 12,
  },
  {
    id: 'data-validation',
    name: 'Data Validation',
    description: 'Data validation and default values',
    icon: 'Shield',
    color: '#d13438',
    order: 13,
  },
  {
    id: 'custom',
    name: 'Custom',
    description: 'Custom node types',
    icon: 'Code',
    color: '#6b69d6',
    order: 14,
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
  
  // Console nodes
  {
    id: 'console-log',
    name: 'Log',
    description: 'Output data to the console',
    category: 'console',
    icon: 'Document',
    color: '#6b69d6',
    inputs: [
      { id: 'message', name: 'Message', type: 'string', required: true, description: 'Data to log' }
    ],
    outputs: [
      { id: 'result', name: 'Result', type: 'object', description: 'Original input data' }
    ],
    configurable: true,
  },
  {
    id: 'console-error',
    name: 'Error',
    description: 'Output error data to the console',
    category: 'console',
    icon: 'Document',
    color: '#6b69d6',
    inputs: [
      { id: 'message', name: 'Message', type: 'string', required: true, description: 'Error to log' }
    ],
    outputs: [
      { id: 'result', name: 'Result', type: 'object', description: 'Original input data' }
    ],
    configurable: true,
  },
  {
    id: 'console-warn',
    name: 'Warn',
    description: 'Output warning data to the console',
    category: 'console',
    icon: 'Document',
    color: '#6b69d6',
    inputs: [
      { id: 'message', name: 'Message', type: 'string', required: true, description: 'Warning to log' }
    ],
    outputs: [
      { id: 'result', name: 'Result', type: 'object', description: 'Original input data' }
    ],
    configurable: true,
  },
  {
    id: 'console-info',
    name: 'Info',
    description: 'Output info data to the console',
    category: 'console',
    icon: 'Document',
    color: '#6b69d6',
    inputs: [
      { id: 'message', name: 'Message', type: 'string', required: true, description: 'Info to log' }
    ],
    outputs: [
      { id: 'result', name: 'Result', type: 'object', description: 'Original input data' }
    ],
    configurable: true,
  },
  {
    id: 'console-debug',
    name: 'Debug',
    description: 'Output debug data to the console',
    category: 'console',
    icon: 'Document',
    color: '#6b69d6',
    inputs: [
      { id: 'message', name: 'Message', type: 'string', required: true, description: 'Debug info to log' }
    ],
    outputs: [
      { id: 'result', name: 'Result', type: 'object', description: 'Original input data' }
    ],
    configurable: true,
  },
  {
    id: 'console-table',
    name: 'Table',
    description: 'Display tabular data in the console',
    category: 'console',
    icon: 'Document',
    color: '#6b69d6',
    inputs: [
      { id: 'data', name: 'Data', type: 'array', required: true, description: 'Data to display as table' }
    ],
    outputs: [
      { id: 'result', name: 'Result', type: 'object', description: 'Original input data' }
    ],
    configurable: true,
  },
  {
    id: 'console-time',
    name: 'Time',
    description: 'Start a timer for performance measurement',
    category: 'console',
    icon: 'Document',
    color: '#6b69d6',
    inputs: [
      { id: 'label', name: 'Label', type: 'string', required: true, description: 'Timer label' }
    ],
    outputs: [
      { id: 'result', name: 'Result', type: 'object', description: 'Original input data' }
    ],
    configurable: true,
  },
  {
    id: 'console-timeend',
    name: 'Time End',
    description: 'End a timer and display elapsed time',
    category: 'console',
    icon: 'Document',
    color: '#6b69d6',
    inputs: [
      { id: 'label', name: 'Label', type: 'string', required: true, description: 'Timer label to end' }
    ],
    outputs: [
      { id: 'result', name: 'Result', type: 'object', description: 'Original input data' }
    ],
    configurable: true,
  },
  {
    id: 'console-group',
    name: 'Group',
    description: 'Create a collapsible group in the console',
    category: 'console',
    icon: 'Document',
    color: '#6b69d6',
    inputs: [
      { id: 'label', name: 'Label', type: 'string', required: true, description: 'Group label' }
    ],
    outputs: [
      { id: 'result', name: 'Result', type: 'object', description: 'Original input data' }
    ],
    configurable: true,
  },
  {
    id: 'console-groupend',
    name: 'Group End',
    description: 'End a console group',
    category: 'console',
    icon: 'Document',
    color: '#6b69d6',
    inputs: [
      { id: 'label', name: 'Label', type: 'string', required: false, description: 'Group label to end' }
    ],
    outputs: [
      { id: 'result', name: 'Result', type: 'object', description: 'Original input data' }
    ],
    configurable: true,
  },
  {
    id: 'console-clear',
    name: 'Clear',
    description: 'Clear the console',
    category: 'console',
    icon: 'Document',
    color: '#6b69d6',
    inputs: [
      { id: 'label', name: 'Label', type: 'string', required: false, description: 'Clear label' }
    ],
    outputs: [
      { id: 'result', name: 'Result', type: 'object', description: 'Original input data' }
    ],
    configurable: true,
  },
  {
    id: 'console-trace',
    name: 'Trace',
    description: 'Output a stack trace to the console',
    category: 'console',
    icon: 'Document',
    color: '#6b69d6',
    inputs: [
      { id: 'label', name: 'Label', type: 'string', required: false, description: 'Trace label' }
    ],
    outputs: [
      { id: 'result', name: 'Result', type: 'object', description: 'Original input data' }
    ],
    configurable: true,
  },
  {
    id: 'console-count',
    name: 'Count',
    description: 'Count the number of times this node is executed',
    category: 'console',
    icon: 'Document',
    color: '#6b69d6',
    inputs: [
      { id: 'label', name: 'Label', type: 'string', required: true, description: 'Counter label' }
    ],
    outputs: [
      { id: 'result', name: 'Result', type: 'object', description: 'Original input data' }
    ],
    configurable: true,
  },
  {
    id: 'console-countreset',
    name: 'Count Reset',
    description: 'Reset a counter',
    category: 'console',
    icon: 'Document',
    color: '#6b69d6',
    inputs: [
      { id: 'label', name: 'Label', type: 'string', required: true, description: 'Counter label to reset' }
    ],
    outputs: [
      { id: 'result', name: 'Result', type: 'object', description: 'Original input data' }
    ],
    configurable: true,
  },
  
  // Data Primitive nodes
  // Number Operations
  {
    id: 'number-parse',
    name: 'Number Parse',
    description: 'Convert values to numbers with fallback support',
    category: 'number',
    icon: 'NumberSymbol',
    color: '#0078d4',
    inputs: [
      { id: 'value', name: 'Value', type: 'object', required: true, description: 'Value to convert to number' },
      { id: 'fallback', name: 'Fallback', type: 'number', required: false, description: 'Fallback value if conversion fails' }
    ],
    outputs: [
      { id: 'result', name: 'Result', type: 'number', description: 'Parsed number value' }
    ],
    configurable: true,
  },
  {
    id: 'number-format',
    name: 'Number Format',
    description: 'Format numbers using locale and options',
    category: 'number',
    icon: 'NumberSymbol',
    color: '#0078d4',
    inputs: [
      { id: 'value', name: 'Value', type: 'number', required: true, description: 'Number to format' },
      { id: 'locale', name: 'Locale', type: 'string', required: false, defaultValue: 'en-US', description: 'Locale for formatting' },
      { id: 'options', name: 'Options', type: 'object', required: false, description: 'NumberFormat options' }
    ],
    outputs: [
      { id: 'result', name: 'Result', type: 'string', description: 'Formatted number string' }
    ],
    configurable: true,
  },
  {
    id: 'number-validate',
    name: 'Number Validate',
    description: 'Validate numbers with range and constraint checks',
    category: 'number',
    icon: 'NumberSymbol',
    color: '#0078d4',
    inputs: [
      { id: 'value', name: 'Value', type: 'number', required: true, description: 'Number to validate' },
      { id: 'min', name: 'Min', type: 'number', required: false, description: 'Minimum allowed value' },
      { id: 'max', name: 'Max', type: 'number', required: false, description: 'Maximum allowed value' },
      { id: 'allowNaN', name: 'Allow NaN', type: 'boolean', required: false, defaultValue: false, description: 'Allow NaN values' },
      { id: 'allowInfinity', name: 'Allow Infinity', type: 'boolean', required: false, defaultValue: false, description: 'Allow Infinity values' }
    ],
    outputs: [
      { id: 'result', name: 'Result', type: 'object', description: 'Validation result with isValid and reason' }
    ],
    configurable: true,
  },
  {
    id: 'number-range',
    name: 'Number Range',
    description: 'Generate number ranges with step support',
    category: 'number',
    icon: 'NumberSymbol',
    color: '#0078d4',
    inputs: [
      { id: 'start', name: 'Start', type: 'number', required: true, description: 'Start of range' },
      { id: 'end', name: 'End', type: 'number', required: true, description: 'End of range' },
      { id: 'step', name: 'Step', type: 'number', required: false, defaultValue: 1, description: 'Step increment' }
    ],
    outputs: [
      { id: 'result', name: 'Result', type: 'array', description: 'Array of numbers in range' }
    ],
    configurable: true,
  },
  {
    id: 'number-round',
    name: 'Number Round',
    description: 'Round numbers using various methods and precision',
    category: 'number',
    icon: 'NumberSymbol',
    color: '#0078d4',
    inputs: [
      { id: 'value', name: 'Value', type: 'number', required: true, description: 'Number to round' },
      { id: 'method', name: 'Method', type: 'select', required: false, defaultValue: 'round', options: [
        { label: 'Round', value: 'round' },
        { label: 'Floor', value: 'floor' },
        { label: 'Ceil', value: 'ceil' },
        { label: 'Trunc', value: 'trunc' }
      ], description: 'Rounding method' },
      { id: 'precision', name: 'Precision', type: 'number', required: false, defaultValue: 0, description: 'Decimal precision' }
    ],
    outputs: [
      { id: 'result', name: 'Result', type: 'number', description: 'Rounded number' }
    ],
    configurable: true,
  },
  {
    id: 'number-clamp',
    name: 'Number Clamp',
    description: 'Clamp numbers to specified min/max ranges',
    category: 'number',
    icon: 'NumberSymbol',
    color: '#0078d4',
    inputs: [
      { id: 'value', name: 'Value', type: 'number', required: true, description: 'Number to clamp' },
      { id: 'min', name: 'Min', type: 'number', required: false, description: 'Minimum value' },
      { id: 'max', name: 'Max', type: 'number', required: false, description: 'Maximum value' }
    ],
    outputs: [
      { id: 'result', name: 'Result', type: 'number', description: 'Clamped number' }
    ],
    configurable: true,
  },
  
  // String Operations
  {
    id: 'string-parse',
    name: 'String Parse',
    description: 'Convert values to strings with encoding support',
    category: 'string',
    icon: 'Text',
    color: '#ff8c00',
    inputs: [
      { id: 'value', name: 'Value', type: 'object', required: true, description: 'Value to convert to string' },
      { id: 'encoding', name: 'Encoding', type: 'string', required: false, defaultValue: 'utf8', description: 'String encoding' }
    ],
    outputs: [
      { id: 'result', name: 'Result', type: 'string', description: 'Parsed string value' }
    ],
    configurable: true,
  },
  {
    id: 'string-validate',
    name: 'String Validate',
    description: 'Validate strings with length and pattern checks',
    category: 'string',
    icon: 'Text',
    color: '#ff8c00',
    inputs: [
      { id: 'value', name: 'Value', type: 'string', required: true, description: 'String to validate' },
      { id: 'minLength', name: 'Min Length', type: 'number', required: false, description: 'Minimum string length' },
      { id: 'maxLength', name: 'Max Length', type: 'number', required: false, description: 'Maximum string length' },
      { id: 'pattern', name: 'Pattern', type: 'string', required: false, description: 'Regex pattern to match' },
      { id: 'allowEmpty', name: 'Allow Empty', type: 'boolean', required: false, defaultValue: false, description: 'Allow empty strings' }
    ],
    outputs: [
      { id: 'result', name: 'Result', type: 'object', description: 'Validation result with isValid and reason' }
    ],
    configurable: true,
  },
  {
    id: 'string-encode',
    name: 'String Encode',
    description: 'Encode strings using various encoding methods',
    category: 'string',
    icon: 'Text',
    color: '#ff8c00',
    inputs: [
      { id: 'value', name: 'Value', type: 'string', required: true, description: 'String to encode' },
      { id: 'encoding', name: 'Encoding', type: 'select', required: false, defaultValue: 'base64', options: [
        { label: 'Base64', value: 'base64' },
        { label: 'URL', value: 'url' },
        { label: 'HTML', value: 'html' },
        { label: 'URI', value: 'uri' }
      ], description: 'Encoding method' }
    ],
    outputs: [
      { id: 'result', name: 'Result', type: 'string', description: 'Encoded string' }
    ],
    configurable: true,
  },
  {
    id: 'string-decode',
    name: 'String Decode',
    description: 'Decode strings using various encoding methods',
    category: 'string',
    icon: 'Text',
    color: '#ff8c00',
    inputs: [
      { id: 'value', name: 'Value', type: 'string', required: true, description: 'String to decode' },
      { id: 'encoding', name: 'Encoding', type: 'select', required: false, defaultValue: 'base64', options: [
        { label: 'Base64', value: 'base64' },
        { label: 'URL', value: 'url' },
        { label: 'HTML', value: 'html' },
        { label: 'URI', value: 'uri' }
      ], description: 'Encoding method' }
    ],
    outputs: [
      { id: 'result', name: 'Result', type: 'string', description: 'Decoded string' }
    ],
    configurable: true,
  },
  {
    id: 'string-format',
    name: 'String Format',
    description: 'Format strings using template substitution',
    category: 'string',
    icon: 'Text',
    color: '#ff8c00',
    inputs: [
      { id: 'template', name: 'Template', type: 'string', required: true, description: 'Template string with placeholders' },
      { id: 'values', name: 'Values', type: 'object', required: false, description: 'Values to substitute' }
    ],
    outputs: [
      { id: 'result', name: 'Result', type: 'string', description: 'Formatted string' }
    ],
    configurable: true,
  },
  {
    id: 'string-sanitize',
    name: 'String Sanitize',
    description: 'Sanitize strings by removing HTML, scripts, and normalizing whitespace',
    category: 'string',
    icon: 'Text',
    color: '#ff8c00',
    inputs: [
      { id: 'value', name: 'Value', type: 'string', required: true, description: 'String to sanitize' },
      { id: 'removeHtml', name: 'Remove HTML', type: 'boolean', required: false, defaultValue: false, description: 'Remove HTML tags' },
      { id: 'removeScripts', name: 'Remove Scripts', type: 'boolean', required: false, defaultValue: false, description: 'Remove script tags' },
      { id: 'normalizeWhitespace', name: 'Normalize Whitespace', type: 'boolean', required: false, defaultValue: false, description: 'Normalize whitespace' }
    ],
    outputs: [
      { id: 'result', name: 'Result', type: 'string', description: 'Sanitized string' }
    ],
    configurable: true,
  },
  
  // Array Operations
  {
    id: 'array-create',
    name: 'Array Create',
    description: 'Create arrays with specified length, fill values, or initial values',
    category: 'array',
    icon: 'List',
    color: '#107c10',
    inputs: [
      { id: 'length', name: 'Length', type: 'number', required: false, defaultValue: 0, description: 'Array length' },
      { id: 'fillValue', name: 'Fill Value', type: 'object', required: false, description: 'Value to fill array with' },
      { id: 'values', name: 'Values', type: 'array', required: false, description: 'Initial array values' }
    ],
    outputs: [
      { id: 'result', name: 'Result', type: 'array', description: 'Created array' }
    ],
    configurable: true,
  },
  {
    id: 'array-filter',
    name: 'Array Filter',
    description: 'Filter arrays based on various conditions',
    category: 'array',
    icon: 'List',
    color: '#107c10',
    inputs: [
      { id: 'array', name: 'Array', type: 'array', required: true, description: 'Array to filter' },
      { id: 'condition', name: 'Condition', type: 'select', required: true, options: [
        { label: 'Truthy', value: 'truthy' },
        { label: 'Falsy', value: 'falsy' },
        { label: 'Equals', value: 'equals' },
        { label: 'Not Equals', value: 'not-equals' },
        { label: 'Includes', value: 'includes' },
        { label: 'Starts With', value: 'starts-with' },
        { label: 'Ends With', value: 'ends-with' }
      ], description: 'Filter condition' },
      { id: 'value', name: 'Value', type: 'object', required: false, description: 'Value to compare against' }
    ],
    outputs: [
      { id: 'result', name: 'Result', type: 'array', description: 'Filtered array' }
    ],
    configurable: true,
  },
  {
    id: 'array-map',
    name: 'Array Map',
    description: 'Transform array elements using various operations',
    category: 'array',
    icon: 'List',
    color: '#107c10',
    inputs: [
      { id: 'array', name: 'Array', type: 'array', required: true, description: 'Array to transform' },
      { id: 'operation', name: 'Operation', type: 'select', required: true, options: [
        { label: 'ToString', value: 'toString' },
        { label: 'ToNumber', value: 'toNumber' },
        { label: 'ToBoolean', value: 'toBoolean' },
        { label: 'Get Property', value: 'getProperty' },
        { label: 'Uppercase', value: 'uppercase' },
        { label: 'Lowercase', value: 'lowercase' }
      ], description: 'Transformation operation' },
      { id: 'key', name: 'Key', type: 'string', required: false, description: 'Property key for getProperty operation' }
    ],
    outputs: [
      { id: 'result', name: 'Result', type: 'array', description: 'Transformed array' }
    ],
    configurable: true,
  },
  {
    id: 'array-reduce',
    name: 'Array Reduce',
    description: 'Reduce arrays using various aggregation operations',
    category: 'array',
    icon: 'List',
    color: '#107c10',
    inputs: [
      { id: 'array', name: 'Array', type: 'array', required: true, description: 'Array to reduce' },
      { id: 'operation', name: 'Operation', type: 'select', required: true, options: [
        { label: 'Sum', value: 'sum' },
        { label: 'Product', value: 'product' },
        { label: 'Concat', value: 'concat' },
        { label: 'Join', value: 'join' },
        { label: 'Max', value: 'max' },
        { label: 'Min', value: 'min' }
      ], description: 'Reduction operation' },
      { id: 'initialValue', name: 'Initial Value', type: 'object', required: false, description: 'Initial value for reduction' },
      { id: 'separator', name: 'Separator', type: 'string', required: false, description: 'Separator for join operation' }
    ],
    outputs: [
      { id: 'result', name: 'Result', type: 'object', description: 'Reduced value' }
    ],
    configurable: true,
  },
  {
    id: 'array-sort',
    name: 'Array Sort',
    description: 'Sort arrays with direction and key-based sorting',
    category: 'array',
    icon: 'List',
    color: '#107c10',
    inputs: [
      { id: 'array', name: 'Array', type: 'array', required: true, description: 'Array to sort' },
      { id: 'direction', name: 'Direction', type: 'select', required: false, defaultValue: 'asc', options: [
        { label: 'Ascending', value: 'asc' },
        { label: 'Descending', value: 'desc' }
      ], description: 'Sort direction' },
      { id: 'key', name: 'Key', type: 'string', required: false, description: 'Property key for object sorting' }
    ],
    outputs: [
      { id: 'result', name: 'Result', type: 'array', description: 'Sorted array' }
    ],
    configurable: true,
  },
  {
    id: 'array-flatten',
    name: 'Array Flatten',
    description: 'Flatten nested arrays to specified depth',
    category: 'array',
    icon: 'List',
    color: '#107c10',
    inputs: [
      { id: 'array', name: 'Array', type: 'array', required: true, description: 'Array to flatten' },
      { id: 'depth', name: 'Depth', type: 'number', required: false, defaultValue: 1, description: 'Flatten depth' }
    ],
    outputs: [
      { id: 'result', name: 'Result', type: 'array', description: 'Flattened array' }
    ],
    configurable: true,
  },
  {
    id: 'array-unique',
    name: 'Array Unique',
    description: 'Remove duplicate values from arrays',
    category: 'array',
    icon: 'List',
    color: '#107c10',
    inputs: [
      { id: 'array', name: 'Array', type: 'array', required: true, description: 'Array to deduplicate' },
      { id: 'key', name: 'Key', type: 'string', required: false, description: 'Property key for object deduplication' }
    ],
    outputs: [
      { id: 'result', name: 'Result', type: 'array', description: 'Array with unique values' }
    ],
    configurable: true,
  },
  {
    id: 'array-chunk',
    name: 'Array Chunk',
    description: 'Split arrays into chunks of specified size',
    category: 'array',
    icon: 'List',
    color: '#107c10',
    inputs: [
      { id: 'array', name: 'Array', type: 'array', required: true, description: 'Array to chunk' },
      { id: 'size', name: 'Size', type: 'number', required: true, description: 'Chunk size' }
    ],
    outputs: [
      { id: 'result', name: 'Result', type: 'array', description: 'Array of chunks' }
    ],
    configurable: true,
  },
  {
    id: 'array-slice',
    name: 'Array Slice',
    description: 'Extract portions of arrays using start/end indices',
    category: 'array',
    icon: 'List',
    color: '#107c10',
    inputs: [
      { id: 'array', name: 'Array', type: 'array', required: true, description: 'Array to slice' },
      { id: 'start', name: 'Start', type: 'number', required: false, defaultValue: 0, description: 'Start index' },
      { id: 'end', name: 'End', type: 'number', required: false, description: 'End index' }
    ],
    outputs: [
      { id: 'result', name: 'Result', type: 'array', description: 'Sliced array' }
    ],
    configurable: true,
  },
  {
    id: 'array-join',
    name: 'Array Join',
    description: 'Join array elements into strings with separators',
    category: 'array',
    icon: 'List',
    color: '#107c10',
    inputs: [
      { id: 'array', name: 'Array', type: 'array', required: true, description: 'Array to join' },
      { id: 'separator', name: 'Separator', type: 'string', required: false, defaultValue: '', description: 'Join separator' }
    ],
    outputs: [
      { id: 'result', name: 'Result', type: 'string', description: 'Joined string' }
    ],
    configurable: true,
  },
  
  // Object Operations
  {
    id: 'object-create',
    name: 'Object Create',
    description: 'Create objects from properties or entries',
    category: 'object',
    icon: 'Object',
    color: '#5c2d91',
    inputs: [
      { id: 'properties', name: 'Properties', type: 'object', required: false, description: 'Object properties' },
      { id: 'entries', name: 'Entries', type: 'array', required: false, description: 'Array of [key, value] pairs' }
    ],
    outputs: [
      { id: 'result', name: 'Result', type: 'object', description: 'Created object' }
    ],
    configurable: true,
  },
  {
    id: 'object-get',
    name: 'Object Get',
    description: 'Get object properties using dot notation paths',
    category: 'object',
    icon: 'Object',
    color: '#5c2d91',
    inputs: [
      { id: 'object', name: 'Object', type: 'object', required: true, description: 'Object to get property from' },
      { id: 'path', name: 'Path', type: 'string', required: true, description: 'Dot notation path' },
      { id: 'defaultValue', name: 'Default Value', type: 'object', required: false, description: 'Default value if property not found' }
    ],
    outputs: [
      { id: 'result', name: 'Result', type: 'object', description: 'Property value' }
    ],
    configurable: true,
  },
  {
    id: 'object-set',
    name: 'Object Set',
    description: 'Set object properties using dot notation paths',
    category: 'object',
    icon: 'Object',
    color: '#5c2d91',
    inputs: [
      { id: 'object', name: 'Object', type: 'object', required: true, description: 'Object to set property on' },
      { id: 'path', name: 'Path', type: 'string', required: true, description: 'Dot notation path' },
      { id: 'value', name: 'Value', type: 'object', required: true, description: 'Value to set' }
    ],
    outputs: [
      { id: 'result', name: 'Result', type: 'object', description: 'Object with updated property' }
    ],
    configurable: true,
  },
  {
    id: 'object-merge',
    name: 'Object Merge',
    description: 'Merge multiple objects with shallow or deep merging',
    category: 'object',
    icon: 'Object',
    color: '#5c2d91',
    inputs: [
      { id: 'objects', name: 'Objects', type: 'array', required: true, description: 'Array of objects to merge' },
      { id: 'deep', name: 'Deep', type: 'boolean', required: false, defaultValue: false, description: 'Perform deep merge' }
    ],
    outputs: [
      { id: 'result', name: 'Result', type: 'object', description: 'Merged object' }
    ],
    configurable: true,
  },
  {
    id: 'object-clone',
    name: 'Object Clone',
    description: 'Clone objects with shallow or deep copying',
    category: 'object',
    icon: 'Object',
    color: '#5c2d91',
    inputs: [
      { id: 'object', name: 'Object', type: 'object', required: true, description: 'Object to clone' },
      { id: 'deep', name: 'Deep', type: 'boolean', required: false, defaultValue: false, description: 'Perform deep clone' }
    ],
    outputs: [
      { id: 'result', name: 'Result', type: 'object', description: 'Cloned object' }
    ],
    configurable: true,
  },
  {
    id: 'object-keys',
    name: 'Object Keys',
    description: 'Get array of object keys',
    category: 'object',
    icon: 'Object',
    color: '#5c2d91',
    inputs: [
      { id: 'object', name: 'Object', type: 'object', required: true, description: 'Object to get keys from' }
    ],
    outputs: [
      { id: 'result', name: 'Result', type: 'array', description: 'Array of object keys' }
    ],
    configurable: false,
  },
  {
    id: 'object-values',
    name: 'Object Values',
    description: 'Get array of object values',
    category: 'object',
    icon: 'Object',
    color: '#5c2d91',
    inputs: [
      { id: 'object', name: 'Object', type: 'object', required: true, description: 'Object to get values from' }
    ],
    outputs: [
      { id: 'result', name: 'Result', type: 'array', description: 'Array of object values' }
    ],
    configurable: false,
  },
  {
    id: 'object-entries',
    name: 'Object Entries',
    description: 'Get array of object key-value pairs',
    category: 'object',
    icon: 'Object',
    color: '#5c2d91',
    inputs: [
      { id: 'object', name: 'Object', type: 'object', required: true, description: 'Object to get entries from' }
    ],
    outputs: [
      { id: 'result', name: 'Result', type: 'array', description: 'Array of [key, value] pairs' }
    ],
    configurable: false,
  },
  {
    id: 'object-pick',
    name: 'Object Pick',
    description: 'Create new object with selected properties',
    category: 'object',
    icon: 'Object',
    color: '#5c2d91',
    inputs: [
      { id: 'object', name: 'Object', type: 'object', required: true, description: 'Object to pick properties from' },
      { id: 'keys', name: 'Keys', type: 'array', required: true, description: 'Array of property keys to pick' }
    ],
    outputs: [
      { id: 'result', name: 'Result', type: 'object', description: 'Object with selected properties' }
    ],
    configurable: true,
  },
  {
    id: 'object-omit',
    name: 'Object Omit',
    description: 'Create new object without specified properties',
    category: 'object',
    icon: 'Object',
    color: '#5c2d91',
    inputs: [
      { id: 'object', name: 'Object', type: 'object', required: true, description: 'Object to omit properties from' },
      { id: 'keys', name: 'Keys', type: 'array', required: true, description: 'Array of property keys to omit' }
    ],
    outputs: [
      { id: 'result', name: 'Result', type: 'object', description: 'Object without specified properties' }
    ],
    configurable: true,
  },
  {
    id: 'object-freeze',
    name: 'Object Freeze',
    description: 'Freeze objects to prevent modification',
    category: 'object',
    icon: 'Object',
    color: '#5c2d91',
    inputs: [
      { id: 'object', name: 'Object', type: 'object', required: true, description: 'Object to freeze' },
      { id: 'deep', name: 'Deep', type: 'boolean', required: false, defaultValue: false, description: 'Perform deep freeze' }
    ],
    outputs: [
      { id: 'result', name: 'Result', type: 'object', description: 'Frozen object' }
    ],
    configurable: true,
  },
  
  // Boolean Operations
  {
    id: 'boolean-parse',
    name: 'Boolean Parse',
    description: 'Convert values to booleans with fallback support',
    category: 'boolean',
    icon: 'Toggle',
    color: '#d13438',
    inputs: [
      { id: 'value', name: 'Value', type: 'object', required: true, description: 'Value to convert to boolean' },
      { id: 'fallback', name: 'Fallback', type: 'boolean', required: false, defaultValue: false, description: 'Fallback value if conversion fails' }
    ],
    outputs: [
      { id: 'result', name: 'Result', type: 'boolean', description: 'Parsed boolean value' }
    ],
    configurable: true,
  },
  {
    id: 'boolean-validate',
    name: 'Boolean Validate',
    description: 'Validate boolean values and conversions',
    category: 'boolean',
    icon: 'Toggle',
    color: '#d13438',
    inputs: [
      { id: 'value', name: 'Value', type: 'object', required: true, description: 'Value to validate as boolean' }
    ],
    outputs: [
      { id: 'result', name: 'Result', type: 'object', description: 'Validation result with isValid and value' }
    ],
    configurable: false,
  },
  
  // JSON Operations
  {
    id: 'json-parse',
    name: 'JSON Parse',
    description: 'Parse JSON strings with fallback support',
    category: 'json',
    icon: 'Document',
    color: '#0078d4',
    inputs: [
      { id: 'value', name: 'Value', type: 'string', required: true, description: 'JSON string to parse' },
      { id: 'fallback', name: 'Fallback', type: 'object', required: false, description: 'Fallback value if parsing fails' }
    ],
    outputs: [
      { id: 'result', name: 'Result', type: 'object', description: 'Parsed JSON object' }
    ],
    configurable: true,
  },
  {
    id: 'json-stringify',
    name: 'JSON Stringify',
    description: 'Convert values to JSON strings with formatting',
    category: 'json',
    icon: 'Document',
    color: '#0078d4',
    inputs: [
      { id: 'value', name: 'Value', type: 'object', required: true, description: 'Value to stringify' },
      { id: 'space', name: 'Space', type: 'number', required: false, defaultValue: 0, description: 'Indentation spaces' }
    ],
    outputs: [
      { id: 'result', name: 'Result', type: 'string', description: 'JSON string' }
    ],
    configurable: true,
  },
  {
    id: 'json-validate',
    name: 'JSON Validate',
    description: 'Validate JSON strings for syntax correctness',
    category: 'json',
    icon: 'Document',
    color: '#0078d4',
    inputs: [
      { id: 'value', name: 'Value', type: 'string', required: true, description: 'JSON string to validate' }
    ],
    outputs: [
      { id: 'result', name: 'Result', type: 'object', description: 'Validation result with isValid and reason' }
    ],
    configurable: false,
  },
  {
    id: 'json-schema-validate',
    name: 'JSON Schema Validate',
    description: 'Validate JSON against schemas',
    category: 'json',
    icon: 'Document',
    color: '#0078d4',
    inputs: [
      { id: 'value', name: 'Value', type: 'object', required: true, description: 'Value to validate' },
      { id: 'schema', name: 'Schema', type: 'object', required: true, description: 'JSON schema to validate against' }
    ],
    outputs: [
      { id: 'result', name: 'Result', type: 'object', description: 'Validation result with isValid and value' }
    ],
    configurable: true,
  },
  
  // Type Checking Operations
  {
    id: 'type-check',
    name: 'Type Check',
    description: 'Determine the type of values',
    category: 'type-checking',
    icon: 'Search',
    color: '#ff8c00',
    inputs: [
      { id: 'value', name: 'Value', type: 'object', required: true, description: 'Value to check type of' }
    ],
    outputs: [
      { id: 'result', name: 'Result', type: 'string', description: 'Type of the value' }
    ],
    configurable: false,
  },
  {
    id: 'type-convert',
    name: 'Type Convert',
    description: 'Convert values between different types',
    category: 'type-checking',
    icon: 'Search',
    color: '#ff8c00',
    inputs: [
      { id: 'value', name: 'Value', type: 'object', required: true, description: 'Value to convert' },
      { id: 'targetType', name: 'Target Type', type: 'select', required: true, options: [
        { label: 'String', value: 'string' },
        { label: 'Number', value: 'number' },
        { label: 'Boolean', value: 'boolean' },
        { label: 'Array', value: 'array' },
        { label: 'Object', value: 'object' }
      ], description: 'Target type to convert to' }
    ],
    outputs: [
      { id: 'result', name: 'Result', type: 'object', description: 'Converted value' }
    ],
    configurable: true,
  },
  {
    id: 'type-validate',
    name: 'Type Validate',
    description: 'Validate values against expected types',
    category: 'type-checking',
    icon: 'Search',
    color: '#ff8c00',
    inputs: [
      { id: 'value', name: 'Value', type: 'object', required: true, description: 'Value to validate' },
      { id: 'expectedType', name: 'Expected Type', type: 'string', required: true, description: 'Expected type' }
    ],
    outputs: [
      { id: 'result', name: 'Result', type: 'object', description: 'Validation result with isValid, actualType, and expectedType' }
    ],
    configurable: true,
  },
  
  // Data Validation Operations
  {
    id: 'data-is-null',
    name: 'Data Is Null',
    description: 'Check if values are null',
    category: 'data-validation',
    icon: 'CheckMark',
    color: '#107c10',
    inputs: [
      { id: 'value', name: 'Value', type: 'object', required: true, description: 'Value to check' }
    ],
    outputs: [
      { id: 'result', name: 'Result', type: 'boolean', description: 'True if value is null' }
    ],
    configurable: false,
  },
  {
    id: 'data-is-undefined',
    name: 'Data Is Undefined',
    description: 'Check if values are undefined',
    category: 'data-validation',
    icon: 'CheckMark',
    color: '#107c10',
    inputs: [
      { id: 'value', name: 'Value', type: 'object', required: true, description: 'Value to check' }
    ],
    outputs: [
      { id: 'result', name: 'Result', type: 'boolean', description: 'True if value is undefined' }
    ],
    configurable: false,
  },
  {
    id: 'data-is-empty',
    name: 'Data Is Empty',
    description: 'Check if values are empty (null, undefined, empty string, empty array, empty object)',
    category: 'data-validation',
    icon: 'CheckMark',
    color: '#107c10',
    inputs: [
      { id: 'value', name: 'Value', type: 'object', required: true, description: 'Value to check' }
    ],
    outputs: [
      { id: 'result', name: 'Result', type: 'boolean', description: 'True if value is empty' }
    ],
    configurable: false,
  },
  {
    id: 'data-is-valid',
    name: 'Data Is Valid',
    description: 'Validate data based on various criteria',
    category: 'data-validation',
    icon: 'CheckMark',
    color: '#107c10',
    inputs: [
      { id: 'value', name: 'Value', type: 'object', required: true, description: 'Value to validate' },
      { id: 'criteria', name: 'Criteria', type: 'select', required: false, defaultValue: 'not-null', options: [
        { label: 'Not Null', value: 'not-null' },
        { label: 'Not Undefined', value: 'not-undefined' },
        { label: 'Not Empty', value: 'not-empty' },
        { label: 'Truthy', value: 'truthy' },
        { label: 'Falsy', value: 'falsy' }
      ], description: 'Validation criteria' }
    ],
    outputs: [
      { id: 'result', name: 'Result', type: 'boolean', description: 'True if value is valid' }
    ],
    configurable: true,
  },
  {
    id: 'data-default',
    name: 'Data Default',
    description: 'Provide default values when data is invalid or missing',
    category: 'data-validation',
    icon: 'CheckMark',
    color: '#107c10',
    inputs: [
      { id: 'value', name: 'Value', type: 'object', required: true, description: 'Value to check' },
      { id: 'defaultValue', name: 'Default Value', type: 'object', required: true, description: 'Default value to use' },
      { id: 'fallbackIf', name: 'Fallback If', type: 'select', required: false, defaultValue: 'null-undefined', options: [
        { label: 'Null/Undefined', value: 'null-undefined' },
        { label: 'Empty', value: 'empty' },
        { label: 'Falsy', value: 'falsy' },
        { label: 'Always', value: 'always' }
      ], description: 'When to use default value' }
    ],
    outputs: [
      { id: 'result', name: 'Result', type: 'object', description: 'Value or default value' }
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
  status?: 'pending' | 'running' | 'completed' | 'failed'
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