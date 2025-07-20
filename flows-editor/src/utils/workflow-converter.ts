import type { Node, Edge } from 'reactflow'
import type { Workflow, WorkflowNode } from '../types'
import type { NodeData, EdgeData } from '../types'
import { v4 as uuidv4 } from 'uuid'

/**
 * Converts React Flow nodes and edges to a Flows workflow
 */
export function convertToWorkflow(
  nodes: Node<NodeData>[],
  edges: Edge<EdgeData>[],
  workflowId: string = 'workflow',
  workflowName: string = 'Workflow'
): Workflow {
  // Convert nodes to workflow nodes
  const workflowNodes: WorkflowNode[] = nodes.map(node => {
    const nodeData = node.data as NodeData
    
    return {
      id: node.id,
      type: nodeData.type,
      inputs: nodeData.inputs || {},
      dependencies: getNodeDependencies(node.id, edges),
    }
  })

  return {
    id: workflowId,
    name: workflowName,
    nodes: workflowNodes,
  }
}

/**
 * Converts a Flows workflow to React Flow nodes and edges
 */
export function convertFromWorkflow(workflow: Workflow): {
  nodes: Node<NodeData>[]
  edges: Edge<EdgeData>[]
} {
  const nodes: Node<NodeData>[] = workflow.nodes.map((workflowNode: WorkflowNode, index: number) => {
    // Calculate position based on dependencies
    const position = calculateNodePosition(workflowNode, workflow.nodes, index)
    
    return {
      id: workflowNode.id,
      type: 'default', // Will be overridden by custom node types
      position,
      data: {
        label: workflowNode.id,
        type: workflowNode.type,
        category: getNodeCategory(workflowNode.type),
        inputs: workflowNode.inputs,
        outputs: {},
        config: {},
      } as NodeData,
    }
  })

  const edges: Edge<EdgeData>[] = []
  
  // Create edges based on dependencies
  workflow.nodes.forEach((workflowNode: WorkflowNode) => {
    workflowNode.dependencies?.forEach((dependencyId: string) => {
      const sourceNode = nodes.find(n => n.id === dependencyId)
      const targetNode = nodes.find(n => n.id === workflowNode.id)
      
      if (sourceNode && targetNode) {
        edges.push({
          id: `${dependencyId}-${workflowNode.id}`,
          source: dependencyId,
          target: workflowNode.id,
          type: 'default',
          data: {
            label: '',
            type: 'default',
          } as EdgeData,
        })
      }
    })
  })

  return { nodes, edges }
}

/**
 * Gets the dependencies for a node based on incoming edges
 */
function getNodeDependencies(nodeId: string, edges: Edge<EdgeData>[]): string[] {
  return edges
    .filter(edge => edge.target === nodeId)
    .map(edge => edge.source)
}

/**
 * Calculates node position based on dependencies and index
 */
function calculateNodePosition(
  node: WorkflowNode,
  allNodes: WorkflowNode[],
  index: number
): { x: number; y: number } {
  const baseX = 200
  const baseY = 100
  const spacingX = 300
  const spacingY = 150
  
  if (!node.dependencies || node.dependencies.length === 0) {
    // Root node - place at top
    return { x: baseX, y: baseY }
  }
  
  // Find the maximum Y position of dependency nodes
  const dependencyNodes = allNodes.filter(n => node.dependencies?.includes(n.id))
  const maxDependencyY = Math.max(...dependencyNodes.map(n => {
    const nodeIndex = allNodes.findIndex(nn => nn.id === n.id)
    return baseY + (nodeIndex * spacingY)
  }))
  
  // Place this node below its dependencies
  return { x: baseX + (index * spacingX), y: maxDependencyY + spacingY }
}

/**
 * Gets the category for a node type
 */
function getNodeCategory(nodeType: string): string {
  if (nodeType.startsWith('logic-')) return 'logic'
  if (nodeType.startsWith('math-')) return 'math'
  if (nodeType.startsWith('string-')) return 'string'
  if (nodeType === 'condition' || nodeType.startsWith('merge-')) return 'flow'
  return 'core'
}

/**
 * Validates a workflow for cycles and other issues
 */
export function validateWorkflow(
  nodes: Node<NodeData>[],
  edges: Edge<EdgeData>[]
): { isValid: boolean; errors: string[] } {
  const errors: string[] = []
  
  // Check for cycles
  if (hasCycles(nodes, edges)) {
    errors.push('Workflow contains cycles')
  }
  
  // Check for orphaned nodes
  const connectedNodes = new Set<string>()
  edges.forEach(edge => {
    connectedNodes.add(edge.source)
    connectedNodes.add(edge.target)
  })
  
  nodes.forEach(node => {
    if (!connectedNodes.has(node.id)) {
      errors.push(`Node "${node.id}" is not connected`)
    }
  })
  
  // Check for duplicate node IDs
  const nodeIds = nodes.map(n => n.id)
  const uniqueIds = new Set(nodeIds)
  if (nodeIds.length !== uniqueIds.size) {
    errors.push('Duplicate node IDs found')
  }
  
  return {
    isValid: errors.length === 0,
    errors,
  }
}

/**
 * Detects cycles in the workflow using DFS
 */
function hasCycles(nodes: Node<NodeData>[], edges: Edge<EdgeData>[]): boolean {
  const visited = new Set<string>()
  const recursionStack = new Set<string>()
  
  // Create adjacency list
  const adjacencyList = new Map<string, string[]>()
  nodes.forEach(node => {
    adjacencyList.set(node.id, [])
  })
  
  edges.forEach(edge => {
    const neighbors = adjacencyList.get(edge.source) || []
    neighbors.push(edge.target)
    adjacencyList.set(edge.source, neighbors)
  })
  
  function hasCycleUtil(nodeId: string): boolean {
    if (recursionStack.has(nodeId)) {
      return true
    }
    
    if (visited.has(nodeId)) {
      return false
    }
    
    visited.add(nodeId)
    recursionStack.add(nodeId)
    
    const neighbors = adjacencyList.get(nodeId) || []
    for (const neighbor of neighbors) {
      if (hasCycleUtil(neighbor)) {
        return true
      }
    }
    
    recursionStack.delete(nodeId)
    return false
  }
  
  for (const node of nodes) {
    if (!visited.has(node.id)) {
      if (hasCycleUtil(node.id)) {
        return true
      }
    }
  }
  
  return false
}

/**
 * Creates a new node with default data
 */
export function createNewNode(
  type: string,
  category: string,
  position: { x: number; y: number }
): Node<NodeData> {
  return {
    id: uuidv4(),
    type: 'default',
    position,
    data: {
      label: type,
      type,
      category,
      inputs: {},
      outputs: {},
      config: {},
    } as NodeData,
  }
}

/**
 * Creates a new edge between two nodes
 */
export function createNewEdge(
  sourceId: string,
  targetId: string
): Edge<EdgeData> {
  return {
    id: `${sourceId}-${targetId}`,
    source: sourceId,
    target: targetId,
    type: 'default',
    data: {
      label: '',
      type: 'default',
    } as EdgeData,
  }
} 