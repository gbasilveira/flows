import type { 
  PluginManifest, 
  NodeTypeDefinition, 
  NodeCategory 
} from '../types'

import { 
  HandlerPlugin
} from 'flows'

/**
 * Plugin Registry for the Flows Editor
 * Integrates with the flows library plugin system
 */
export class EditorPluginRegistry {
  private plugins: Map<string, PluginManifest> = new Map()
  private initialized = false

  constructor() {
    // Only initialize once
    if (!this.initialized) {
      this.initializeBuiltInPlugins()
      this.initialized = true
    }
  }

  /**
   * Initialize built-in plugins from the flows library
   */
  private initializeBuiltInPlugins() {
    // Check if plugin is already registered
    if (this.plugins.has('flows-built-in')) {
      return
    }

    // Core plugin with all built-in operations
    const builtInPlugin: PluginManifest = {
      id: 'flows-built-in',
      name: 'Flows Built-in Operations',
      version: '1.0.0',
      description: 'Core logical, mathematical, string, and flow control operations',
      author: 'Flows Team',
      categories: [
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
          description: 'Console operations for debugging and logging',
          icon: 'Terminal',
          color: '#6b69d6',
          order: 6,
        },
      ],
      nodeTypes: [
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
          name: 'Console Log',
          description: 'Output messages to console.log with optional data and formatting',
          category: 'console',
          icon: 'Terminal',
          color: '#6b69d6',
          inputs: [
            { id: 'message', name: 'Message', type: 'string', required: true, description: 'Message to log' },
            { id: 'data', name: 'Data', type: 'object', required: false, description: 'Optional data to log alongside message' },
            { id: 'options', name: 'Options', type: 'object', required: false, description: 'Formatting options (timestamp, prefix)' }
          ],
          outputs: [
            { id: 'result', name: 'Result', type: 'object', description: 'Log operation result' }
          ],
          configurable: true,
        },
        {
          id: 'console-error',
          name: 'Console Error',
          description: 'Output error messages to console.error with optional data and formatting',
          category: 'console',
          icon: 'Error',
          color: '#d13438',
          inputs: [
            { id: 'message', name: 'Message', type: 'string', required: true, description: 'Error message to log' },
            { id: 'data', name: 'Data', type: 'object', required: false, description: 'Optional error data to log' },
            { id: 'options', name: 'Options', type: 'object', required: false, description: 'Formatting options (timestamp, prefix)' }
          ],
          outputs: [
            { id: 'result', name: 'Result', type: 'object', description: 'Error log operation result' }
          ],
          configurable: true,
        },
        {
          id: 'console-warn',
          name: 'Console Warn',
          description: 'Output warning messages to console.warn with optional data and formatting',
          category: 'console',
          icon: 'Warning',
          color: '#ff8c00',
          inputs: [
            { id: 'message', name: 'Message', type: 'string', required: true, description: 'Warning message to log' },
            { id: 'data', name: 'Data', type: 'object', required: false, description: 'Optional warning data to log' },
            { id: 'options', name: 'Options', type: 'object', required: false, description: 'Formatting options (timestamp, prefix)' }
          ],
          outputs: [
            { id: 'result', name: 'Result', type: 'object', description: 'Warning log operation result' }
          ],
          configurable: true,
        },
        {
          id: 'console-info',
          name: 'Console Info',
          description: 'Output informational messages to console.info with optional data and formatting',
          category: 'console',
          icon: 'Info',
          color: '#0078d4',
          inputs: [
            { id: 'message', name: 'Message', type: 'string', required: true, description: 'Info message to log' },
            { id: 'data', name: 'Data', type: 'object', required: false, description: 'Optional info data to log' },
            { id: 'options', name: 'Options', type: 'object', required: false, description: 'Formatting options (timestamp, prefix)' }
          ],
          outputs: [
            { id: 'result', name: 'Result', type: 'object', description: 'Info log operation result' }
          ],
          configurable: true,
        },
        {
          id: 'console-debug',
          name: 'Console Debug',
          description: 'Output debug messages to console.debug with optional data and formatting',
          category: 'console',
          icon: 'Bug',
          color: '#6b69d6',
          inputs: [
            { id: 'message', name: 'Message', type: 'string', required: true, description: 'Debug message to log' },
            { id: 'data', name: 'Data', type: 'object', required: false, description: 'Optional debug data to log' },
            { id: 'options', name: 'Options', type: 'object', required: false, description: 'Formatting options (timestamp, prefix)' }
          ],
          outputs: [
            { id: 'result', name: 'Result', type: 'object', description: 'Debug log operation result' }
          ],
          configurable: true,
        },
        {
          id: 'console-table',
          name: 'Console Table',
          description: 'Display tabular data in the console using console.table',
          category: 'console',
          icon: 'Table',
          color: '#6b69d6',
          inputs: [
            { id: 'data', name: 'Data', type: 'array', required: true, description: 'Data to display as table' },
            { id: 'options', name: 'Options', type: 'object', required: false, description: 'Table formatting options (columns)' }
          ],
          outputs: [
            { id: 'result', name: 'Result', type: 'object', description: 'Table display operation result' }
          ],
          configurable: true,
        },
        {
          id: 'console-time',
          name: 'Console Time',
          description: 'Start a timer for performance measurement using console.time',
          category: 'console',
          icon: 'Timer',
          color: '#6b69d6',
          inputs: [
            { id: 'message', name: 'Message', type: 'string', required: true, description: 'Timer label' },
            { id: 'options', name: 'Options', type: 'object', required: false, description: 'Timer configuration options' }
          ],
          outputs: [
            { id: 'result', name: 'Result', type: 'object', description: 'Timer start operation result' }
          ],
          configurable: true,
        },
        {
          id: 'console-timeend',
          name: 'Console Time End',
          description: 'End a timer and display elapsed time using console.timeEnd',
          category: 'console',
          icon: 'Timer',
          color: '#6b69d6',
          inputs: [
            { id: 'message', name: 'Message', type: 'string', required: true, description: 'Timer label to end' },
            { id: 'options', name: 'Options', type: 'object', required: false, description: 'Timer configuration options' }
          ],
          outputs: [
            { id: 'result', name: 'Result', type: 'object', description: 'Timer end operation result' }
          ],
          configurable: true,
        },
        {
          id: 'console-group',
          name: 'Console Group',
          description: 'Create a collapsible group in the console using console.group',
          category: 'console',
          icon: 'Folder',
          color: '#6b69d6',
          inputs: [
            { id: 'message', name: 'Message', type: 'string', required: true, description: 'Group label' },
            { id: 'options', name: 'Options', type: 'object', required: false, description: 'Group configuration (collapsed)' }
          ],
          outputs: [
            { id: 'result', name: 'Result', type: 'object', description: 'Group start operation result' }
          ],
          configurable: true,
        },
        {
          id: 'console-groupend',
          name: 'Console Group End',
          description: 'End a console group using console.groupEnd',
          category: 'console',
          icon: 'Folder',
          color: '#6b69d6',
          inputs: [],
          outputs: [
            { id: 'result', name: 'Result', type: 'object', description: 'Group end operation result' }
          ],
          configurable: false,
        },
        {
          id: 'console-clear',
          name: 'Console Clear',
          description: 'Clear the console using console.clear',
          category: 'console',
          icon: 'Clear',
          color: '#6b69d6',
          inputs: [
            { id: 'options', name: 'Options', type: 'object', required: false, description: 'Clear configuration (preserve)' }
          ],
          outputs: [
            { id: 'result', name: 'Result', type: 'object', description: 'Clear operation result' }
          ],
          configurable: true,
        },
        {
          id: 'console-trace',
          name: 'Console Trace',
          description: 'Output a stack trace using console.trace',
          category: 'console',
          icon: 'Bug',
          color: '#6b69d6',
          inputs: [
            { id: 'message', name: 'Message', type: 'string', required: true, description: 'Trace label' },
            { id: 'options', name: 'Options', type: 'object', required: false, description: 'Trace configuration options' }
          ],
          outputs: [
            { id: 'result', name: 'Result', type: 'object', description: 'Trace operation result' }
          ],
          configurable: true,
        },
        {
          id: 'console-count',
          name: 'Console Count',
          description: 'Count the number of times this node is executed using console.count',
          category: 'console',
          icon: 'Number',
          color: '#6b69d6',
          inputs: [
            { id: 'message', name: 'Message', type: 'string', required: true, description: 'Counter label' },
            { id: 'options', name: 'Options', type: 'object', required: false, description: 'Counter configuration options' }
          ],
          outputs: [
            { id: 'result', name: 'Result', type: 'object', description: 'Count operation result' }
          ],
          configurable: true,
        },
        {
          id: 'console-countreset',
          name: 'Console Count Reset',
          description: 'Reset a counter using console.countReset',
          category: 'console',
          icon: 'Number',
          color: '#6b69d6',
          inputs: [
            { id: 'message', name: 'Message', type: 'string', required: true, description: 'Counter label to reset' },
            { id: 'options', name: 'Options', type: 'object', required: false, description: 'Counter configuration options' }
          ],
          outputs: [
            { id: 'result', name: 'Result', type: 'object', description: 'Count reset operation result' }
          ],
          configurable: true,
        },
      ],
    }

    this.registerPlugin(builtInPlugin)
  }

  /**
   * Register a plugin
   */
  registerPlugin(plugin: PluginManifest) {
    this.plugins.set(plugin.id, plugin)
  }

  /**
   * Get all registered plugins
   */
  getPlugins(): PluginManifest[] {
    return Array.from(this.plugins.values())
  }

  /**
   * Get plugin by ID
   */
  getPlugin(id: string): PluginManifest | undefined {
    return this.plugins.get(id)
  }

  /**
   * Get all node types from all plugins
   */
  getAllNodeTypes(): NodeTypeDefinition[] {
    const nodeTypes: NodeTypeDefinition[] = []
    
    for (const plugin of this.plugins.values()) {
      nodeTypes.push(...plugin.nodeTypes)
    }
    
    return nodeTypes
  }

  /**
   * Get node type by ID
   */
  getNodeType(id: string): NodeTypeDefinition | undefined {
    for (const plugin of this.plugins.values()) {
      const nodeType = plugin.nodeTypes.find(nt => nt.id === id)
      if (nodeType) return nodeType
    }
    return undefined
  }

  /**
   * Get all categories from all plugins
   */
  getAllCategories(): NodeCategory[] {
    const categories: NodeCategory[] = []
    const seen = new Set<string>()
    
    for (const plugin of this.plugins.values()) {
      for (const category of plugin.categories) {
        if (!seen.has(category.id)) {
          seen.add(category.id)
          categories.push(category)
        }
      }
    }
    
    return categories.sort((a, b) => a.order - b.order)
  }

  /**
   * Get node types by category
   */
  getNodeTypesByCategory(categoryId: string): NodeTypeDefinition[] {
    return this.getAllNodeTypes().filter(nt => nt.category === categoryId)
  }

  /**
   * Get flows library plugins for execution
   */
  getFlowsPlugins(): HandlerPlugin[] {
    // This would integrate with the flows library plugin system
    // For now, return empty array - the flows library handles its own plugins
    return []
  }

  /**
   * Check if a node type is available
   */
  hasNodeType(id: string): boolean {
    return this.getNodeType(id) !== undefined
  }

  /**
   * Get available node types for a given category
   */
  getAvailableNodeTypes(categoryId?: string): string[] {
    const nodeTypes = categoryId 
      ? this.getNodeTypesByCategory(categoryId)
      : this.getAllNodeTypes()
    
    return nodeTypes.map(nt => nt.id)
  }
}

/**
 * Global plugin registry instance
 */
export const pluginRegistry = new EditorPluginRegistry()

/**
 * Utility functions for working with plugins
 */
export function getPluginRegistry(): EditorPluginRegistry {
  return pluginRegistry
}

export function registerPlugin(plugin: PluginManifest): void {
  pluginRegistry.registerPlugin(plugin)
}

export function getNodeType(id: string): NodeTypeDefinition | undefined {
  return pluginRegistry.getNodeType(id)
}

export function getAllNodeTypes(): NodeTypeDefinition[] {
  return pluginRegistry.getAllNodeTypes()
}

export function getAllCategories(): NodeCategory[] {
  return pluginRegistry.getAllCategories()
} 