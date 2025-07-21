import { Editor } from '../components/Editor'
import { DEFAULT_CATEGORIES, DEFAULT_NODE_TYPES, type EditorConfig } from '../types'

/**
 * Test component to verify data primitive nodes are showing in the Node Palette
 * This demonstrates that all data primitive categories and node types are properly configured
 */
const dataPrimitiveTestConfig: EditorConfig = {
  theme: 'light',
  layout: 'vertical',
  plugins: [
    {
      id: 'flows-built-in',
      name: 'Flows Built-in Operations',
      version: '1.0.0',
      description: 'Complete set of logical, mathematical, string, flow control, and data primitive operations',
      author: 'Flows Team',
      categories: DEFAULT_CATEGORIES,
      nodeTypes: DEFAULT_NODE_TYPES,
    },
  ],
  enabledCategories: ['core', 'logic', 'math', 'string', 'flow', 'console', 'number', 'array', 'object', 'boolean', 'json', 'type-checking', 'data-validation'],
  ui: {
    sidebarWidth: 320,
    toolbarHeight: 60,
    minimapEnabled: true,
    backgroundColor: '#f5f5f5',
  },
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
      },
    },
  },
  features: {
    dragAndDrop: true,
    nodeResizing: false,
    nodeSelection: true,
    edgeEditing: true,
    minimap: true,
    controls: true,
    background: true,
    grid: true,
    validation: true,
    autoLayout: false,
    snapToGrid: false,
    exportFormats: ['json', 'png'],
    importFormats: ['json'],
    subflows: true,
    customHandlers: true,
  },
}

export function DataPrimitiveTest() {
  const handleWorkflowChange = (workflow: any) => {
    console.log('✅ Workflow changed:', workflow)
  }

  const handleWorkflowExecute = (workflow: any) => {
    console.log('🚀 Executing workflow:', workflow)
  }

  const handleWorkflowSave = (workflow: any) => {
    console.log('💾 Saving workflow:', workflow)
  }

  const handleWorkflowLoad = (workflow: any) => {
    console.log('📂 Loading workflow:', workflow)
  }

  return (
    <div style={{ height: '100vh', width: '100vw' }}>
      <Editor
        config={dataPrimitiveTestConfig}
        onWorkflowChange={handleWorkflowChange}
        onWorkflowExecute={handleWorkflowExecute}
        onWorkflowSave={handleWorkflowSave}
        onWorkflowLoad={handleWorkflowLoad}
      />
    </div>
  )
}

export default DataPrimitiveTest 