import React from 'react'
import { Editor, EditorConfig, DEFAULT_CATEGORIES, DEFAULT_NODE_TYPES } from '../index'

const demoConfig: EditorConfig = {
  theme: 'light',
  layout: 'vertical',
  plugins: [
    {
      id: 'built-in-operations',
      name: 'Built-in Operations',
      version: '1.0.0',
      description: 'Core logical, mathematical, and string operations',
      author: 'Flows Team',
      categories: DEFAULT_CATEGORIES,
      nodeTypes: DEFAULT_NODE_TYPES,
    },
  ],
  enabledCategories: ['core', 'logic', 'math', 'string', 'flow'],
  ui: {
    sidebarWidth: 280,
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
  },
}

const App: React.FC = () => {
  const handleWorkflowChange = (workflow: any) => {
    console.log('Workflow changed:', workflow)
  }

  const handleWorkflowExecute = (workflow: any) => {
    console.log('Executing workflow:', workflow)
  }

  const handleWorkflowSave = (workflow: any) => {
    console.log('Saving workflow:', workflow)
    // In a real app, this would save to localStorage or a server
    localStorage.setItem('flows-editor-workflow', JSON.stringify(workflow))
  }

  const handleWorkflowLoad = (workflow: any) => {
    console.log('Loading workflow:', workflow)
  }

  return (
    <div style={{ height: '100vh', width: '100vw' }}>
      <Editor
        config={demoConfig}
        onWorkflowChange={handleWorkflowChange}
        onWorkflowExecute={handleWorkflowExecute}
        onWorkflowSave={handleWorkflowSave}
        onWorkflowLoad={handleWorkflowLoad}
      />
    </div>
  )
}

export default App 