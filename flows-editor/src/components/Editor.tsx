import React, { useCallback, useRef, useState } from 'react'
import ReactFlow, {
  Node,
  Edge,
  Connection,
  Controls,
  Background,
  MiniMap,
  OnConnect,
  OnEdgesDelete,
  OnNodesDelete,
  OnNodesChange,
  OnEdgesChange,
  NodeChange,
} from 'reactflow'
import 'reactflow/dist/style.css'
import {
  FluentProvider,
  webLightTheme,
  makeStyles,
  tokens,
} from '@fluentui/react-components'
import {
  Button,
  Badge,
  Title3,
  Caption1,
} from '@fluentui/react-components'
import {
  PlayRegular,
  SaveRegular,
  FolderOpenRegular,
  ZoomInRegular,
  ZoomOutRegular,
  ArrowMaximizeRegular,
} from '@fluentui/react-icons'
import { Sidebar } from './sidebar/Sidebar'
import { BaseNode } from './nodes/BaseNode'
import { useEditorStore } from '../store'
import { convertToWorkflow, convertFromWorkflow, createNewNode } from '../utils/workflow-converter'
import type { EdgeData, EditorConfig } from '../types'

const useStyles = makeStyles({
  root: {
    height: '100vh',
    width: '100vw',
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: tokens.colorNeutralBackground1,
  },
  toolbar: {
    borderBottom: `1px solid ${tokens.colorNeutralStroke2}`,
    backgroundColor: tokens.colorNeutralBackground2,
    padding: '8px 16px',
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
  },
  main: {
    flex: 1,
    display: 'flex',
    overflow: 'hidden',
  },
  flowContainer: {
    flex: 1,
    position: 'relative',
  },
  reactFlow: {
    backgroundColor: tokens.colorNeutralBackground1,
  },
  statusBar: {
    padding: '8px 16px',
    borderTop: `1px solid ${tokens.colorNeutralStroke2}`,
    backgroundColor: tokens.colorNeutralBackground2,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    fontSize: tokens.fontSizeBase100,
    color: tokens.colorNeutralForeground3,
  },
  statusItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  minimap: {
    backgroundColor: tokens.colorNeutralBackground2,
    border: `1px solid ${tokens.colorNeutralStroke2}`,
  },
  controls: {
    backgroundColor: tokens.colorNeutralBackground1,
    border: `1px solid ${tokens.colorNeutralStroke2}`,
    borderRadius: tokens.borderRadiusMedium,
    boxShadow: tokens.shadow4,
  },
  toolbarGroup: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
})

const nodeTypes = {
  default: BaseNode,
}

export interface EditorProps {
  config?: EditorConfig
  onWorkflowChange?: (workflow: any) => void
  onWorkflowExecute?: (workflow: any) => void
  onWorkflowSave?: (workflow: any) => void
  onWorkflowLoad?: (workflow: any) => void
}

export const Editor: React.FC<EditorProps> = ({
  config = {},
  onWorkflowChange,
  onWorkflowExecute,
  onWorkflowSave,
  onWorkflowLoad,
}) => {
  const styles = useStyles()
  const reactFlowWrapper = useRef<HTMLDivElement>(null)
  const [reactFlowInstance, setReactFlowInstance] = useState<any>(null)
  
  const {
    nodes: storeNodes,
    edges: storeEdges,
    addNode,
    removeNode,
    updateNode,
    addEdge,
    removeEdge,
    setDirty,
    setExecuting,
    setConfig,
    setEvents,
    isDirty,
    isExecuting,
  } = useEditorStore()

  // Initialize config with defaults
  React.useEffect(() => {
    const defaultConfig: EditorConfig = {
      theme: 'light',
      layout: 'vertical',
      enabledCategories: ['core', 'logic', 'math', 'string', 'flow'],
      ui: {
        sidebarWidth: 280,
        minimapEnabled: true,
      },
      flowsConfig: {
        storage: { type: 'memory' },
        logging: { level: 'info' },
        failureHandling: {
          strategy: 'retry',
          config: { maxRetries: 3, retryDelay: 1000 }
        },
      },
      features: {
        dragAndDrop: true,
        validation: true,
        minimap: true,
        subflows: true,
        customHandlers: true,
      },
      ...config, // Override with provided config
    }
    
    setConfig(defaultConfig)
    setEvents({
      onWorkflowChange,
      onWorkflowExecute,
      onWorkflowSave,
      onWorkflowLoad,
    })
  }, [config, onWorkflowChange, onWorkflowExecute, onWorkflowSave, onWorkflowLoad])

  const onConnect: OnConnect = useCallback(
    (params: Connection) => {
      const newEdge = {
        id: `${params.source}-${params.target}`,
        source: params.source!,
        target: params.target!,
        type: 'default',
        data: { label: '', type: 'default' } as EdgeData,
      }
      addEdge(newEdge)
    },
    [addEdge]
  )

  const onNodesDelete: OnNodesDelete = useCallback(
    (deleted: Node[]) => {
      deleted.forEach(node => removeNode(node.id))
    },
    [removeNode]
  )

  const onEdgesDelete: OnEdgesDelete = useCallback(
    (deleted: Edge[]) => {
      deleted.forEach(edge => removeEdge(edge.id))
    },
    [removeEdge]
  )

  const onNodesChange: OnNodesChange = useCallback(
    (changes: NodeChange[]) => {
      changes.forEach(change => {
        if (change.type === 'position' && change.position) {
          updateNode(change.id, { position: change.position })
        }
      })
    },
    [updateNode]
  )

  const onEdgesChange: OnEdgesChange = useCallback(
    () => {
      // Handle edge changes if needed
    },
    []
  )

  const onDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault()
    event.dataTransfer.dropEffect = 'move'
  }, [])

  const onDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault()

      const reactFlowBounds = reactFlowWrapper.current?.getBoundingClientRect()
      if (!reactFlowBounds) return

      const data = JSON.parse(event.dataTransfer.getData('application/reactflow'))
      
      // Handle nodeType data from sidebar
      if (data.id && data.type) {
        const position = reactFlowInstance.project({
          x: event.clientX - reactFlowBounds.left,
          y: event.clientY - reactFlowBounds.top,
        })

        const newNode = createNewNode(data.id, data.category, position)
        addNode(newNode)
      }
    },
    [reactFlowInstance, addNode]
  )

  const handleNodeDragStart = useCallback(() => {
    // Node drag started from sidebar
  }, [])

  const handleNodeDragEnd = useCallback(() => {
    // Node drag ended
  }, [])

  const handleExecute = useCallback(() => {
    const workflow = convertToWorkflow(storeNodes, storeEdges)
    setExecuting(true)
    
    // Simulate execution
    setTimeout(() => {
      setExecuting(false)
      onWorkflowExecute?.(workflow)
    }, 2000)
  }, [storeNodes, storeEdges, setExecuting, onWorkflowExecute])

  const handleSave = useCallback(() => {
    const workflow = convertToWorkflow(storeNodes, storeEdges)
    onWorkflowSave?.(workflow)
    setDirty(false)
  }, [storeNodes, storeEdges, onWorkflowSave, setDirty])

  const handleLoad = useCallback(() => {
    // This would typically open a file picker
    // For now, we'll create a sample workflow
    const sampleWorkflow = {
      id: 'sample-workflow',
      name: 'Sample Workflow',
      nodes: [
        {
          id: 'start',
          type: 'data',
          inputs: { message: 'Hello, World!' },
          dependencies: [],
        },
        {
          id: 'process',
          type: 'data',
          inputs: { result: 'processed' },
          dependencies: ['start'],
        },
      ],
    }
    
    const { nodes, edges } = convertFromWorkflow(sampleWorkflow)
    nodes.forEach(node => addNode(node))
    edges.forEach(edge => addEdge(edge))
    onWorkflowLoad?.(sampleWorkflow)
  }, [addNode, addEdge, onWorkflowLoad])

  const handleZoomIn = useCallback(() => {
    reactFlowInstance?.zoomIn()
  }, [reactFlowInstance])

  const handleZoomOut = useCallback(() => {
    reactFlowInstance?.zoomOut()
  }, [reactFlowInstance])

  const handleFitView = useCallback(() => {
    reactFlowInstance?.fitView()
  }, [reactFlowInstance])

  return (
    <FluentProvider theme={webLightTheme}>
      <div className={styles.root}>
        <div className={styles.toolbar}>
          <div className={styles.toolbarGroup}>
            <Title3>Flows Editor</Title3>
          </div>
          
          <div className={styles.toolbarGroup}>
            <Button
              appearance="primary"
              icon={<PlayRegular />}
              onClick={handleExecute}
              disabled={isExecuting}
            >
              {isExecuting ? 'Executing...' : 'Execute'}
            </Button>
            
            <Button
              appearance="subtle"
              icon={<SaveRegular />}
              onClick={handleSave}
              disabled={!isDirty}
            >
              Save
            </Button>
            
            <Button
              appearance="subtle"
              icon={<FolderOpenRegular />}
              onClick={handleLoad}
            >
              Load
            </Button>
          </div>
          
          <div className={styles.toolbarGroup}>
            <Button
              appearance="subtle"
              icon={<ZoomInRegular />}
              onClick={handleZoomIn}
            />
            
            <Button
              appearance="subtle"
              icon={<ZoomOutRegular />}
              onClick={handleZoomOut}
            />
            
            <Button
              appearance="subtle"
              icon={<ArrowMaximizeRegular />}
              onClick={handleFitView}
            />
          </div>
          
          <div className={styles.toolbarGroup}>
            <Badge appearance="filled" color={isDirty ? 'danger' : 'brand'}>
              {storeNodes.length} nodes
            </Badge>
            
            <Badge appearance="filled" color="brand">
              {storeEdges.length} edges
            </Badge>
          </div>
        </div>

        <div className={styles.main}>
          <Sidebar
            onNodeDragStart={handleNodeDragStart}
            onNodeDragEnd={handleNodeDragEnd}
            width={config.ui?.sidebarWidth}
          />
          
          <div className={styles.flowContainer} ref={reactFlowWrapper}>
            <ReactFlow
              nodes={storeNodes}
              edges={storeEdges}
              onNodesChange={onNodesChange}
              onEdgesChange={onEdgesChange}
              onConnect={onConnect}
              onNodesDelete={onNodesDelete}
              onEdgesDelete={onEdgesDelete}
              onInit={setReactFlowInstance}
              onDrop={onDrop}
              onDragOver={onDragOver}
              nodeTypes={nodeTypes}
              className={styles.reactFlow}
              fitView
            >
              <Controls className={styles.controls} />
              <Background />
              <MiniMap className={styles.minimap} />
            </ReactFlow>
          </div>
        </div>

        <div className={styles.statusBar}>
          <div className={styles.statusItem}>
            <Caption1>
              {isDirty ? 'Unsaved changes' : 'All changes saved'}
            </Caption1>
          </div>
          
          <div className={styles.statusItem}>
            <Caption1>
              {storeNodes.length} nodes, {storeEdges.length} edges
            </Caption1>
          </div>
        </div>
      </div>
    </FluentProvider>
  )
} 