import React from 'react'
import { Editor, EditorConfig, DEFAULT_CATEGORIES, DEFAULT_NODE_TYPES } from '../index'

/**
 * Test component to verify drag and drop functionality
 * This demonstrates that all node types can be dragged and dropped
 */
const dragDropTestConfig: EditorConfig = {
  theme: 'light',
  layout: 'vertical',
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
  enabledCategories: ['core', 'logic', 'math', 'string', 'flow', 'console'],
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

export function DragDropTest() {
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
        config={dragDropTestConfig}
        onWorkflowChange={handleWorkflowChange}
        onWorkflowExecute={handleWorkflowExecute}
        onWorkflowSave={handleWorkflowSave}
        onWorkflowLoad={handleWorkflowLoad}
      />
    </div>
  )
}

export default DragDropTest 