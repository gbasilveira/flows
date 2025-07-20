import { create } from 'zustand'
import { immer } from 'zustand/middleware/immer'
import type { Node, Edge } from 'reactflow'
import type { Workflow } from '../types'
import type { 
  EditorState, 
  EditorConfig, 
  NodeTypeDefinition, 
  NodeCategory,
  ExecutionResult,
  EditorEvents 
} from '../types'
import { DEFAULT_CATEGORIES, DEFAULT_NODE_TYPES } from '../types'

interface EditorStore extends EditorState {
  // Actions
  setConfig: (config: EditorConfig) => void
  setWorkflow: (workflow: Workflow | null) => void
  addNode: (node: Node) => void
  removeNode: (nodeId: string) => void
  updateNode: (nodeId: string, updates: Partial<Node>) => void
  addEdge: (edge: Edge) => void
  removeEdge: (edgeId: string) => void
  updateEdge: (edgeId: string, updates: Partial<Edge>) => void
  setSelectedNodes: (nodeIds: string[]) => void
  setSelectedEdges: (edgeIds: string[]) => void
  setHoveredNode: (nodeId: string | null) => void
  setDirty: (dirty: boolean) => void
  setExecuting: (executing: boolean) => void
  addExecutionResult: (result: ExecutionResult) => void
  clearExecutionResults: () => void
  setViewport: (viewport: { x: number; y: number; zoom: number }) => void
  setZoom: (zoom: number) => void
  setPan: (pan: { x: number; y: number }) => void
  
  // Plugin management
  nodeTypes: NodeTypeDefinition[]
  categories: NodeCategory[]
  addNodeType: (nodeType: NodeTypeDefinition) => void
  removeNodeType: (nodeTypeId: string) => void
  addCategory: (category: NodeCategory) => void
  removeCategory: (categoryId: string) => void
  
  // Events
  events: EditorEvents
  setEvents: (events: EditorEvents) => void
}

export const useEditorStore = create<EditorStore>()(
  immer((set, get) => ({
    // Initial state
    workflow: null,
    nodes: [],
    edges: [],
    selectedNodes: [],
    selectedEdges: [],
    hoveredNode: null,
    isDirty: false,
    isExecuting: false,
    executionResults: [],
    zoom: 1,
    pan: { x: 0, y: 0 },
    viewport: { x: 0, y: 0, zoom: 1 },
    nodeTypes: DEFAULT_NODE_TYPES, // Initialize with default node types
    categories: DEFAULT_CATEGORIES, // Initialize with default categories
    events: {},
    
    setConfig: (config: EditorConfig) => {
      set((state) => {
        // Update categories
        if (config.customCategories) {
          state.categories = [...state.categories, ...config.customCategories]
        }
        
        // Update node types from plugins
        if (config.plugins) {
          const pluginNodeTypes = config.plugins.flatMap(plugin => plugin.nodeTypes)
          state.nodeTypes = [...state.nodeTypes, ...pluginNodeTypes]
        }
        
        // Filter node types based on enabled categories
        if (config.enabledCategories) {
          state.nodeTypes = state.nodeTypes.filter(nodeType => 
            config.enabledCategories!.includes(nodeType.category)
          )
        }
      })
    },
    
    setWorkflow: (workflow: Workflow | null) => {
      set((state) => {
        state.workflow = workflow
        state.isDirty = false
      })
    },
    
    addNode: (node: Node) => {
      set((state) => {
        state.nodes.push(node)
        state.isDirty = true
      })
      get().events.onNodeAdd?.(node)
    },
    
    removeNode: (nodeId: string) => {
      set((state) => {
        state.nodes = state.nodes.filter(n => n.id !== nodeId)
        state.edges = state.edges.filter(e => e.source !== nodeId && e.target !== nodeId)
        state.selectedNodes = state.selectedNodes.filter(id => id !== nodeId)
        state.isDirty = true
      })
      get().events.onNodeRemove?.(nodeId)
    },
    
    updateNode: (nodeId: string, updates: Partial<Node>) => {
      set((state) => {
        const nodeIndex = state.nodes.findIndex(n => n.id === nodeId)
        if (nodeIndex !== -1) {
          state.nodes[nodeIndex] = { ...state.nodes[nodeIndex], ...updates }
          state.isDirty = true
        }
      })
      const node = get().nodes.find(n => n.id === nodeId)
      if (node) {
        get().events.onNodeUpdate?.(node)
      }
    },
    
    addEdge: (edge: Edge) => {
      set((state) => {
        state.edges.push(edge)
        state.isDirty = true
      })
      get().events.onEdgeAdd?.(edge)
    },
    
    removeEdge: (edgeId: string) => {
      set((state) => {
        state.edges = state.edges.filter(e => e.id !== edgeId)
        state.selectedEdges = state.selectedEdges.filter(id => id !== edgeId)
        state.isDirty = true
      })
      get().events.onEdgeRemove?.(edgeId)
    },
    
    updateEdge: (edgeId: string, updates: Partial<Edge>) => {
      set((state) => {
        const edgeIndex = state.edges.findIndex(e => e.id === edgeId)
        if (edgeIndex !== -1) {
          state.edges[edgeIndex] = { ...state.edges[edgeIndex], ...updates }
          state.isDirty = true
        }
      })
      const edge = get().edges.find(e => e.id === edgeId)
      if (edge) {
        get().events.onEdgeUpdate?.(edge)
      }
    },
    
    setSelectedNodes: (nodeIds: string[]) => {
      set((state) => {
        state.selectedNodes = nodeIds
      })
    },
    
    setSelectedEdges: (edgeIds: string[]) => {
      set((state) => {
        state.selectedEdges = edgeIds
      })
    },
    
    setHoveredNode: (nodeId: string | null) => {
      set((state) => {
        state.hoveredNode = nodeId
      })
    },
    
    setDirty: (dirty: boolean) => {
      set((state) => {
        state.isDirty = dirty
      })
    },
    
    setExecuting: (executing: boolean) => {
      set((state) => {
        state.isExecuting = executing
      })
    },
    
    addExecutionResult: (result: ExecutionResult) => {
      set((state) => {
        state.executionResults.push(result)
      })
    },
    
    clearExecutionResults: () => {
      set((state) => {
        state.executionResults = []
      })
    },
    
    setViewport: (viewport: { x: number; y: number; zoom: number }) => {
      set((state) => {
        state.viewport = viewport
        state.pan = { x: viewport.x, y: viewport.y }
        state.zoom = viewport.zoom
      })
    },
    
    setZoom: (zoom: number) => {
      set((state) => {
        state.zoom = zoom
        state.viewport.zoom = zoom
      })
    },
    
    setPan: (pan: { x: number; y: number }) => {
      set((state) => {
        state.pan = pan
        state.viewport.x = pan.x
        state.viewport.y = pan.y
      })
    },
    
    addNodeType: (nodeType: NodeTypeDefinition) => {
      set((state) => {
        state.nodeTypes.push(nodeType)
      })
    },
    
    removeNodeType: (nodeTypeId: string) => {
      set((state) => {
        state.nodeTypes = state.nodeTypes.filter(nt => nt.id !== nodeTypeId)
      })
    },
    
    addCategory: (category: NodeCategory) => {
      set((state) => {
        state.categories.push(category)
      })
    },
    
    removeCategory: (categoryId: string) => {
      set((state) => {
        state.categories = state.categories.filter(c => c.id !== categoryId)
      })
    },
    
    setEvents: (events: EditorEvents) => {
      set((state) => {
        state.events = events
      })
    },
  }))
)

// Selectors for better performance
export const useNodes = () => useEditorStore((state) => state.nodes)
export const useEdges = () => useEditorStore((state) => state.edges)
export const useSelectedNodes = () => useEditorStore((state) => state.selectedNodes)
export const useSelectedEdges = () => useEditorStore((state) => state.selectedEdges)
export const useWorkflow = () => useEditorStore((state) => state.workflow)
export const useIsDirty = () => useEditorStore((state) => state.isDirty)
export const useIsExecuting = () => useEditorStore((state) => state.isExecuting)
export const useNodeTypes = () => useEditorStore((state) => state.nodeTypes)
export const useCategories = () => useEditorStore((state) => state.categories)
export const useViewport = () => useEditorStore((state) => state.viewport) 