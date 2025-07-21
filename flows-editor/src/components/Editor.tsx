import React, { useCallback, useRef, useState } from 'react'
import {
  ReactFlow,
  Controls,
  MiniMap,
  Background,
  useNodesState,
  useEdgesState,
  Connection,
  Edge,
  Node,
  BackgroundVariant,
  OnConnect,
  ReactFlowProvider,
} from 'reactflow'
import 'reactflow/dist/style.css'
import {
  Toolbar,
  ToolbarButton,
  ToolbarDivider,
  makeStyles,
  tokens,
  Text,
} from '@fluentui/react-components'
import {
  PlayRegular,
  SaveRegular,
  FolderOpenRegular,
  SettingsRegular,
  DismissRegular,
} from '@fluentui/react-icons'

import { BaseNode } from './nodes/BaseNode'
import { Sidebar } from './sidebar/Sidebar'
import { NodeManipulationPanel } from './NodeManipulationPanel'
import { useEditorStore } from '../store'
import type { EditorConfig } from '../types'
import { convertToWorkflow, createNewNode } from '../utils/workflow-converter'

const useStyles = makeStyles({
  root: {
    width: '100%',
    height: '100vh',
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: tokens.colorNeutralBackground1,
    fontFamily: tokens.fontFamilyBase,
  },
  toolbar: {
    padding: '12px 16px',
    borderBottom: `1px solid ${tokens.colorNeutralStroke2}`,
    backgroundColor: tokens.colorNeutralBackground2,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexShrink: 0,
  },
  toolbarLeft: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
  },
  toolbarRight: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  title: {
    fontSize: tokens.fontSizeBase600,
    fontWeight: tokens.fontWeightSemibold,
    color: tokens.colorNeutralForeground1,
  },
  mainContent: {
    flex: 1,
    display: 'flex',
    overflow: 'hidden',
  },
  canvasContainer: {
    flex: 1,
    position: 'relative',
    display: 'flex',
  },
  reactFlowWrapper: {
    flex: 1,
    height: '100%',
  },
})

// Register all node types with ReactFlow
const nodeTypes = {
  default: BaseNode,
  // Add specific node types for different categories
  data: BaseNode,
  delay: BaseNode,
  subflow: BaseNode,
  'logic-and': BaseNode,
  'logic-or': BaseNode,
  'logic-not': BaseNode,
  'logic-xor': BaseNode,
  'math-add': BaseNode,
  'math-subtract': BaseNode,
  'math-multiply': BaseNode,
  'math-divide': BaseNode,
  'math-power': BaseNode,
  'math-modulo': BaseNode,
  'string-concat': BaseNode,
  'string-substring': BaseNode,
  'string-replace': BaseNode,
  'string-match': BaseNode,
  'string-split': BaseNode,
  'string-compare': BaseNode,
  'string-length': BaseNode,
  'string-case': BaseNode,
  condition: BaseNode,
  'merge-all': BaseNode,
  'merge-any': BaseNode,
  'merge-majority': BaseNode,
  'merge-count': BaseNode,
  'console-log': BaseNode,
  'console-error': BaseNode,
  'console-warn': BaseNode,
  'console-info': BaseNode,
  'console-debug': BaseNode,
  'console-table': BaseNode,
  'console-time': BaseNode,
  'console-timeend': BaseNode,
  'console-group': BaseNode,
  'console-groupend': BaseNode,
  'console-clear': BaseNode,
  'console-trace': BaseNode,
  'console-count': BaseNode,
  'console-countreset': BaseNode,
  // Data Primitive node types
  'number-parse': BaseNode,
  'number-format': BaseNode,
  'number-validate': BaseNode,
  'number-range': BaseNode,
  'number-round': BaseNode,
  'number-clamp': BaseNode,
  'string-parse': BaseNode,
  'string-validate': BaseNode,
  'string-encode': BaseNode,
  'string-decode': BaseNode,
  'string-format': BaseNode,
  'string-sanitize': BaseNode,
  'array-create': BaseNode,
  'array-filter': BaseNode,
  'array-map': BaseNode,
  'array-reduce': BaseNode,
  'array-sort': BaseNode,
  'array-flatten': BaseNode,
  'array-unique': BaseNode,
  'array-chunk': BaseNode,
  'array-slice': BaseNode,
  'array-join': BaseNode,
  'object-create': BaseNode,
  'object-get': BaseNode,
  'object-set': BaseNode,
  'object-merge': BaseNode,
  'object-clone': BaseNode,
  'object-keys': BaseNode,
  'object-values': BaseNode,
  'object-entries': BaseNode,
  'object-pick': BaseNode,
  'object-omit': BaseNode,
  'object-freeze': BaseNode,
  'boolean-parse': BaseNode,
  'boolean-validate': BaseNode,
  'json-parse': BaseNode,
  'json-stringify': BaseNode,
  'json-validate': BaseNode,
  'json-schema-validate': BaseNode,
  'type-check': BaseNode,
  'type-convert': BaseNode,
  'type-validate': BaseNode,
  'data-is-null': BaseNode,
  'data-is-undefined': BaseNode,
  'data-is-empty': BaseNode,
  'data-is-valid': BaseNode,
  'data-default': BaseNode,
}

export interface EditorProps {
  config?: EditorConfig
  onWorkflowChange?: (workflow: any) => void
  onWorkflowExecute?: (workflow: any) => void
  onWorkflowSave?: (workflow: any) => void
  onWorkflowLoad?: (workflow: any) => void
}

interface EditorContentProps extends EditorProps {}

const EditorContent: React.FC<EditorContentProps> = ({
  config,
  onWorkflowExecute,
  onWorkflowSave,
  onWorkflowLoad,
}) => {
  const styles = useStyles()
  const reactFlowWrapper = useRef<HTMLDivElement>(null)
  const { 
    nodes, 
    edges, 
    isManipulationPanelOpen,
    addNode, 
    addEdge: storeAddEdge, 
    setSelectedNodes, 
    setConfig,
    setManipulationPanelOpen,
  } = useEditorStore()
  
  const [reactFlowNodes, setNodes, onNodesChange] = useNodesState(nodes)
  const [reactFlowEdges, setEdges, onEdgesChange] = useEdgesState(edges)
  const [reactFlowInstance, setReactFlowInstance] = useState<any>(null)

  // Sync store state with ReactFlow state
  React.useEffect(() => {
    setNodes(nodes)
  }, [nodes, setNodes])

  React.useEffect(() => {
    setEdges(edges)
  }, [edges, setEdges])

  // Set configuration on mount
  React.useEffect(() => {
    if (config) {
      setConfig(config)
    }
  }, [config, setConfig])

  const onConnect: OnConnect = useCallback(
    (params: Connection) => {
      if (!params.source || !params.target) return
      
      const newEdge: Edge = {
        id: `${params.source}-${params.target}`,
        source: params.source,
        target: params.target,
        type: 'default',
        data: { label: '', type: 'default' },
      }
      storeAddEdge(newEdge)
    },
    [storeAddEdge]
  )

  const handleDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault()
    event.dataTransfer.dropEffect = 'move'
  }, [])

  const handleDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault()

      if (!reactFlowWrapper.current || !reactFlowInstance) {
        return
      }

      const nodeType = event.dataTransfer.getData('application/reactflow')
      
      if (!nodeType) {
        return
      }

      const position = reactFlowInstance.screenToFlowPosition({
        x: event.clientX,
        y: event.clientY,
      })

      // Determine category based on node type
      const category = determineNodeCategory(nodeType)
      const newNode = createNewNode(nodeType, category, position)
      addNode(newNode)
    },
    [reactFlowInstance, addNode]
  )

  // Helper function to determine node category
  const determineNodeCategory = (nodeType: string): string => {
    if (nodeType.startsWith('logic-')) return 'logic'
    if (nodeType.startsWith('math-')) return 'math'
    if (nodeType.startsWith('string-')) return 'string'
    if (nodeType.startsWith('console-')) return 'console'
    if (nodeType.startsWith('number-')) return 'number'
    if (nodeType.startsWith('array-')) return 'array'
    if (nodeType.startsWith('object-')) return 'object'
    if (nodeType.startsWith('boolean-')) return 'boolean'
    if (nodeType.startsWith('json-')) return 'json'
    if (nodeType.startsWith('type-')) return 'type-checking'
    if (nodeType.startsWith('data-')) return 'data-validation'
    if (nodeType === 'condition') return 'flow'
    if (nodeType.startsWith('merge-')) return 'flow'
    return 'core'
  }

  const handleSelectionChange = useCallback(
    ({ nodes: selectedNodes }: { nodes: Node[] }) => {
      setSelectedNodes(selectedNodes.map(n => n.id))
    },
    [setSelectedNodes]
  )

  const handleExecute = useCallback(() => {
    if (onWorkflowExecute) {
      const workflow = convertToWorkflow(nodes, edges)
      onWorkflowExecute(workflow)
    }
  }, [nodes, edges, onWorkflowExecute])

  const handleSave = useCallback(() => {
    if (onWorkflowSave) {
      const workflow = convertToWorkflow(nodes, edges)
      onWorkflowSave(workflow)
    }
  }, [nodes, edges, onWorkflowSave])

  const handleLoad = useCallback(() => {
    if (onWorkflowLoad) {
      onWorkflowLoad(null)
    }
  }, [onWorkflowLoad])

  return (
    <div className={styles.root}>
      {/* Toolbar */}
      <div className={styles.toolbar}>
        <div className={styles.toolbarLeft}>
          <Text className={styles.title}>Flows Editor</Text>
          <Toolbar>
            <ToolbarButton 
              appearance="primary" 
              icon={<PlayRegular />}
              onClick={handleExecute}
            >
              Execute
            </ToolbarButton>
            <ToolbarDivider />
            <ToolbarButton icon={<SaveRegular />} onClick={handleSave}>
              Save
            </ToolbarButton>
            <ToolbarButton icon={<FolderOpenRegular />} onClick={handleLoad}>
              Load
            </ToolbarButton>
          </Toolbar>
        </div>
        <div className={styles.toolbarRight}>
          <ToolbarButton 
            icon={isManipulationPanelOpen ? <DismissRegular /> : <SettingsRegular />}
            onClick={() => setManipulationPanelOpen(!isManipulationPanelOpen)}
            appearance={isManipulationPanelOpen ? "primary" : "subtle"}
          >
            {isManipulationPanelOpen ? 'Close Settings' : 'Node Settings'}
          </ToolbarButton>
        </div>
      </div>

      {/* Main Content */}
      <div className={styles.mainContent}>
        {/* Sidebar */}
        <Sidebar 
          width={config?.ui?.sidebarWidth}
          onNodeDragStart={(nodeType, event) => {
            // Handle node drag start if needed
            console.log('Node drag start:', nodeType, event)
          }}
          onNodeDragEnd={(event) => {
            // Handle node drag end if needed
            console.log('Node drag end:', event)
          }}
        />

        {/* Canvas Container */}
        <div className={styles.canvasContainer}>
          <div ref={reactFlowWrapper} className={styles.reactFlowWrapper}>
            <ReactFlow
              nodes={reactFlowNodes}
              edges={reactFlowEdges}
              onNodesChange={onNodesChange}
              onEdgesChange={onEdgesChange}
              onConnect={onConnect}
              onInit={setReactFlowInstance}
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onSelectionChange={handleSelectionChange}
              nodeTypes={nodeTypes}
              fitView
              fitViewOptions={{
                padding: 0.1,
              }}
            >
              <Controls />
              {config?.ui?.minimapEnabled && <MiniMap />}
              <Background 
                variant={BackgroundVariant.Dots} 
                gap={12} 
                size={1}
                color={tokens.colorNeutralStroke3}
              />
            </ReactFlow>
          </div>
          
          {/* Node Manipulation Panel */}
          {isManipulationPanelOpen && (
            <NodeManipulationPanel
              isOpen={isManipulationPanelOpen}
              onClose={() => setManipulationPanelOpen(false)}
            />
          )}
        </div>
      </div>
    </div>
  )
}

export const Editor: React.FC<EditorProps> = (props) => {
  return (
    <ReactFlowProvider>
      <EditorContent {...props} />
    </ReactFlowProvider>
  )
} 