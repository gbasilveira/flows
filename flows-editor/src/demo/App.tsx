import { Editor, EditorConfig, DEFAULT_CATEGORIES, DEFAULT_NODE_TYPES } from '../index'

const demoConfig: EditorConfig = {
  theme: 'light',
  layout: 'vertical',
  plugins: [
    {
      id: 'flows-built-in',
      name: 'Flows Built-in Operations',
      version: '1.0.0',
      description: 'Core logical, mathematical, string, flow control, and data primitive operations',
      author: 'Flows Team',
      categories: DEFAULT_CATEGORIES,
      nodeTypes: DEFAULT_NODE_TYPES,
    },
  ],
  enabledCategories: ['core', 'logic', 'math', 'string', 'flow', 'console', 'number', 'array', 'object', 'boolean', 'json', 'type-checking', 'data-validation'],
  ui: {
    sidebarWidth: 320, // Wider width to test auto-centering behavior
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

function App() {
  const handleWorkflowChange = (workflow: any) => {
    console.log('Workflow changed:', workflow)
  }

  const handleWorkflowExecute = (workflow: any) => {
    console.log('Executing workflow:', workflow)
  }

  const handleWorkflowSave = (workflow: any) => {
    console.log('Saving workflow:', workflow)
  }

  const handleWorkflowLoad = (workflow: any) => {
    console.log('Loading workflow:', workflow)
  }

  return (
    <Editor
      config={demoConfig}
      onWorkflowChange={handleWorkflowChange}
      onWorkflowExecute={handleWorkflowExecute}
      onWorkflowSave={handleWorkflowSave}
      onWorkflowLoad={handleWorkflowLoad}
    />
  )
}

export default App 