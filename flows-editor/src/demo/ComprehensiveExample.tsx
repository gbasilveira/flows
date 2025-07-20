import { useState } from 'react'
import { 
  Editor, 
  EditorConfig, 
  DEFAULT_CATEGORIES, 
  DEFAULT_NODE_TYPES,
  executeWorkflow,
  validateWorkflow
} from '../index'

/**
 * Comprehensive example demonstrating all handlers and plugins
 * This example shows how to configure the editor with all available
 * node types from the flows library
 */
const comprehensiveConfig: EditorConfig = {
  theme: 'light',
  layout: 'vertical',
  
  // Enable all built-in plugins
  plugins: [
    {
      id: 'flows-built-in',
      name: 'Flows Built-in Operations',
      version: '1.0.0',
      description: 'Complete set of logical, mathematical, string, and flow control operations',
      author: 'Flows Team',
      categories: DEFAULT_CATEGORIES,
      nodeTypes: DEFAULT_NODE_TYPES,
    },
  ],
  
  // Enable all categories
  enabledCategories: ['core', 'logic', 'math', 'string', 'flow', 'console'],
  
  // UI configuration
  ui: {
    sidebarWidth: 300,
    toolbarHeight: 70,
    minimapEnabled: true,
    backgroundColor: '#f8f9fa',
    nodeColors: {
      'data': '#0078d4',
      'delay': '#0078d4',
      'subflow': '#0078d4',
      'logic-and': '#107c10',
      'logic-or': '#107c10',
      'logic-not': '#107c10',
      'logic-xor': '#107c10',
      'math-add': '#d13438',
      'math-subtract': '#d13438',
      'math-multiply': '#d13438',
      'math-divide': '#d13438',
      'math-power': '#d13438',
      'math-modulo': '#d13438',
      'string-concat': '#ff8c00',
      'string-substring': '#ff8c00',
      'string-replace': '#ff8c00',
      'string-match': '#ff8c00',
      'string-split': '#ff8c00',
      'string-compare': '#ff8c00',
      'string-length': '#ff8c00',
      'string-case': '#ff8c00',
      'condition': '#5c2d91',
      'merge-all': '#5c2d91',
      'merge-any': '#5c2d91',
      'merge-majority': '#5c2d91',
      'merge-count': '#5c2d91',
      'console-log': '#6b69d6',
      'console-error': '#d13438',
      'console-warn': '#ff8c00',
      'console-info': '#0078d4',
      'console-debug': '#6b69d6',
      'console-table': '#6b69d6',
      'console-time': '#6b69d6',
      'console-timeend': '#6b69d6',
      'console-group': '#6b69d6',
      'console-groupend': '#6b69d6',
      'console-clear': '#6b69d6',
      'console-trace': '#6b69d6',
      'console-count': '#6b69d6',
      'console-countreset': '#6b69d6',
    },
  },
  
  // Flows library configuration
  flowsConfig: {
    storage: {
      type: 'memory',
    },
    logging: {
      level: 'info',
    },
    failureHandling: {
      strategy: 'retry',
      config: {
        maxRetries: 3,
        retryDelay: 1000,
        circuitBreaker: {
          failureThreshold: 5,
          timeWindow: 60000,
          recoveryTimeout: 30000,
        },
      },
    },
  },
  
  // Enable all features
  features: {
    dragAndDrop: true,
    nodeResizing: true,
    nodeSelection: true,
    edgeEditing: true,
    minimap: true,
    controls: true,
    background: true,
    grid: true,
    validation: true,
    autoLayout: false,
    snapToGrid: false,
    exportFormats: ['json', 'png', 'svg'],
    importFormats: ['json'],
    subflows: true,
    customHandlers: true,
  },
}

/**
 * Example workflow demonstrating various node types
 */
const exampleWorkflow = {
  id: 'comprehensive-example',
  name: 'Comprehensive Example Workflow',
  nodes: [
    // Core nodes
    {
      id: 'input-data',
      type: 'data',
      inputs: { 
        message: 'Hello, World!',
        numbers: [10, 20, 30],
        boolean: true
      },
      dependencies: [],
    },
    {
      id: 'delay-node',
      type: 'delay',
      inputs: { duration: 1000 },
      dependencies: ['input-data'],
    },
    
    // Logic nodes
    {
      id: 'logic-and',
      type: 'logic-and',
      inputs: { values: [true, true, false] },
      dependencies: ['input-data'],
    },
    {
      id: 'logic-or',
      type: 'logic-or',
      inputs: { values: [false, false, true] },
      dependencies: ['input-data'],
    },
    {
      id: 'logic-not',
      type: 'logic-not',
      inputs: { values: [false] },
      dependencies: ['input-data'],
    },
    {
      id: 'logic-xor',
      type: 'logic-xor',
      inputs: { values: [true, false] },
      dependencies: ['input-data'],
    },
    
    // Math nodes
    {
      id: 'math-add',
      type: 'math-add',
      inputs: { values: [10, 20, 30] },
      dependencies: ['input-data'],
    },
    {
      id: 'math-multiply',
      type: 'math-multiply',
      inputs: { values: [2, 3, 4] },
      dependencies: ['input-data'],
    },
    {
      id: 'math-divide',
      type: 'math-divide',
      inputs: { values: [100, 5] },
      dependencies: ['input-data'],
    },
    {
      id: 'math-power',
      type: 'math-power',
      inputs: { base: 2, exponent: 8 },
      dependencies: ['input-data'],
    },
    
    // String nodes
    {
      id: 'string-concat',
      type: 'string-concat',
      inputs: { 
        values: ['Hello', 'World', '!'],
        separator: ' '
      },
      dependencies: ['input-data'],
    },
    {
      id: 'string-length',
      type: 'string-length',
      inputs: { text: 'Hello, World!' },
      dependencies: ['input-data'],
    },
    {
      id: 'string-case',
      type: 'string-case',
      inputs: { 
        text: 'hello world',
        caseType: 'upper'
      },
      dependencies: ['input-data'],
    },
    
    // Flow control nodes
    {
      id: 'condition',
      type: 'condition',
      inputs: {
        conditionType: 'compare',
        left: 60,
        right: 50,
        operator: '>',
        thenValue: 'High value',
        elseValue: 'Normal value'
      },
      dependencies: ['math-add'],
    },
    {
      id: 'merge-all',
      type: 'merge-all',
      inputs: { strict: true },
      dependencies: ['logic-and', 'logic-or', 'math-add'],
    },
  ],
}

function ComprehensiveExample() {
  const [executionResult, setExecutionResult] = useState<any>(null)
  const [validationResult, setValidationResult] = useState<any>(null)

  const handleWorkflowChange = (workflow: any) => {
    console.log('Workflow changed:', workflow)
  }

  const handleWorkflowExecute = async (workflow: any) => {
    console.log('Executing workflow:', workflow)
    
    try {
      // Validate the workflow first
      const validation = validateWorkflow(workflow, comprehensiveConfig)
      setValidationResult(validation)
      
      if (validation.isValid) {
        // Execute the workflow
        const result = await executeWorkflow(workflow, comprehensiveConfig)
        setExecutionResult(result)
        console.log('Execution result:', result)
      } else {
        console.error('Workflow validation failed:', validation.errors)
      }
    } catch (error) {
      console.error('Workflow execution failed:', error)
    }
  }

  const handleWorkflowSave = (workflow: any) => {
    console.log('Saving workflow:', workflow)
    // In a real app, this would save to localStorage or a server
    localStorage.setItem('flows-editor-comprehensive-workflow', JSON.stringify(workflow))
  }

  const handleWorkflowLoad = (workflow: any) => {
    console.log('Loading workflow:', workflow)
  }

  return (
    <div style={{ height: '100vh', width: '100vw', display: 'flex', flexDirection: 'column' }}>
      {/* Header */}
      <div style={{ 
        padding: '16px', 
        backgroundColor: '#f8f9fa', 
        borderBottom: '1px solid #dee2e6',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <h1 style={{ margin: 0, fontSize: '24px', color: '#495057' }}>
          Flows Editor - Comprehensive Example
        </h1>
        <div style={{ display: 'flex', gap: '8px' }}>
          {validationResult && (
            <div style={{ 
              padding: '4px 8px', 
              borderRadius: '4px',
              backgroundColor: validationResult.isValid ? '#d4edda' : '#f8d7da',
              color: validationResult.isValid ? '#155724' : '#721c24',
              fontSize: '12px'
            }}>
              {validationResult.isValid ? '✓ Valid' : '✗ Invalid'}
            </div>
          )}
          {executionResult && (
            <div style={{ 
              padding: '4px 8px', 
              borderRadius: '4px',
              backgroundColor: '#d1ecf1',
              color: '#0c5460',
              fontSize: '12px'
            }}>
              ✓ Executed
            </div>
          )}
        </div>
      </div>

      {/* Editor */}
      <div style={{ flex: 1 }}>
        <Editor
          config={comprehensiveConfig}
          onWorkflowChange={handleWorkflowChange}
          onWorkflowExecute={handleWorkflowExecute}
          onWorkflowSave={handleWorkflowSave}
          onWorkflowLoad={handleWorkflowLoad}
        />
      </div>

      {/* Results Panel */}
      {(validationResult || executionResult) && (
        <div style={{ 
          height: '200px', 
          backgroundColor: '#f8f9fa', 
          borderTop: '1px solid #dee2e6',
          padding: '16px',
          overflow: 'auto'
        }}>
          <h3 style={{ margin: '0 0 16px 0', fontSize: '16px' }}>Results</h3>
          
          {validationResult && (
            <div style={{ marginBottom: '16px' }}>
              <h4 style={{ margin: '0 0 8px 0', fontSize: '14px' }}>Validation</h4>
              {validationResult.isValid ? (
                <div style={{ color: '#155724' }}>✓ Workflow is valid</div>
              ) : (
                <div>
                  <div style={{ color: '#721c24', marginBottom: '8px' }}>✗ Validation errors:</div>
                  <ul style={{ margin: 0, paddingLeft: '20px', color: '#721c24' }}>
                    {validationResult.errors.map((error: string, index: number) => (
                      <li key={index}>{error}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
          
          {executionResult && (
            <div>
              <h4 style={{ margin: '0 0 8px 0', fontSize: '14px' }}>Execution Results</h4>
              <pre style={{ 
                margin: 0, 
                fontSize: '12px', 
                backgroundColor: '#fff', 
                padding: '8px', 
                borderRadius: '4px',
                overflow: 'auto',
                maxHeight: '100px'
              }}>
                {JSON.stringify(executionResult, null, 2)}
              </pre>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default ComprehensiveExample 