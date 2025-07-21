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
  // Get default inputs and outputs based on node type
  const { inputs, outputs } = getDefaultNodeConfig(type)
  
  return {
    id: uuidv4(),
    type: 'default', // All nodes use the default BaseNode component
    position,
    data: {
      label: getNodeDisplayName(type),
      type,
      category,
      inputs,
      outputs,
      config: {},
    } as NodeData,
  }
}

/**
 * Get default inputs and outputs for a node type
 */
function getDefaultNodeConfig(type: string): { inputs: Record<string, any>; outputs: Record<string, any> } {
  switch (type) {
    case 'data':
      return {
        inputs: { value: {} },
        outputs: { value: {} }
      }
    case 'delay':
      return {
        inputs: { duration: 1000 },
        outputs: { value: {} }
      }
    case 'subflow':
      return {
        inputs: { workflowId: '' },
        outputs: { result: {} }
      }
    case 'logic-and':
    case 'logic-or':
    case 'logic-not':
    case 'logic-xor':
      return {
        inputs: { values: [] },
        outputs: { result: false }
      }
    case 'math-add':
    case 'math-subtract':
    case 'math-multiply':
      return {
        inputs: { values: [] },
        outputs: { result: 0 }
      }
    case 'math-divide':
    case 'math-power':
    case 'math-modulo':
      return {
        inputs: { dividend: 0, divisor: 1 },
        outputs: { result: 0 }
      }
    case 'string-concat':
      return {
        inputs: { values: [], separator: '' },
        outputs: { result: '' }
      }
    case 'string-substring':
      return {
        inputs: { text: '', start: 0, end: 0 },
        outputs: { result: '' }
      }
    case 'string-replace':
      return {
        inputs: { text: '', search: '', replace: '', global: true },
        outputs: { result: '' }
      }
    case 'string-match':
      return {
        inputs: { text: '', pattern: '' },
        outputs: { result: false }
      }
    case 'string-split':
      return {
        inputs: { text: '', delimiter: '' },
        outputs: { result: [] }
      }
    case 'string-compare':
      return {
        inputs: { text1: '', text2: '', caseSensitive: true },
        outputs: { result: false }
      }
    case 'string-length':
      return {
        inputs: { text: '' },
        outputs: { result: 0 }
      }
    case 'string-case':
      return {
        inputs: { text: '', caseType: 'upper' },
        outputs: { result: '' }
      }
    case 'condition':
      return {
        inputs: { 
          conditionType: 'simple',
          condition: true,
          thenValue: null,
          elseValue: null
        },
        outputs: { result: null }
      }
    case 'merge-all':
    case 'merge-any':
    case 'merge-majority':
      return {
        inputs: { strict: true },
        outputs: { result: {} }
      }
    case 'merge-count':
      return {
        inputs: { requiredCount: 1, strict: true },
        outputs: { result: {} }
      }
    case 'console-log':
    case 'console-error':
    case 'console-warn':
    case 'console-info':
    case 'console-debug':
      return {
        inputs: { message: '', data: null, options: {} },
        outputs: { result: null }
      }
    case 'console-table':
      return {
        inputs: { data: [], options: {} },
        outputs: { result: null }
      }
    case 'console-time':
    case 'console-timeend':
      return {
        inputs: { label: '' },
        outputs: { result: null }
      }
    case 'console-group':
    case 'console-groupend':
    case 'console-clear':
    case 'console-trace':
    case 'console-count':
    case 'console-countreset':
      return {
        inputs: { label: '' },
        outputs: { result: null }
      }
    default:
      return {
        inputs: {},
        outputs: {}
      }
  }
}

/**
 * Get display name for a node type
 */
function getNodeDisplayName(type: string): string {
  switch (type) {
    case 'data':
      return 'Data'
    case 'delay':
      return 'Delay'
    case 'subflow':
      return 'Subflow'
    case 'logic-and':
      return 'AND'
    case 'logic-or':
      return 'OR'
    case 'logic-not':
      return 'NOT'
    case 'logic-xor':
      return 'XOR'
    case 'math-add':
      return 'Add'
    case 'math-subtract':
      return 'Subtract'
    case 'math-multiply':
      return 'Multiply'
    case 'math-divide':
      return 'Divide'
    case 'math-power':
      return 'Power'
    case 'math-modulo':
      return 'Modulo'
    case 'string-concat':
      return 'Concatenate'
    case 'string-substring':
      return 'Substring'
    case 'string-replace':
      return 'Replace'
    case 'string-match':
      return 'Match'
    case 'string-split':
      return 'Split'
    case 'string-compare':
      return 'Compare'
    case 'string-length':
      return 'Length'
    case 'string-case':
      return 'Case Transform'
    case 'condition':
      return 'Condition'
    case 'merge-all':
      return 'Merge All'
    case 'merge-any':
      return 'Merge Any'
    case 'merge-majority':
      return 'Merge Majority'
    case 'merge-count':
      return 'Merge Count'
    case 'console-log':
      return 'Console Log'
    case 'console-error':
      return 'Console Error'
    case 'console-warn':
      return 'Console Warn'
    case 'console-info':
      return 'Console Info'
    case 'console-debug':
      return 'Console Debug'
    case 'console-table':
      return 'Console Table'
    case 'console-time':
      return 'Console Time'
    case 'console-timeend':
      return 'Console Time End'
    case 'console-group':
      return 'Console Group'
    case 'console-groupend':
      return 'Console Group End'
    case 'console-clear':
      return 'Console Clear'
    case 'console-trace':
      return 'Console Trace'
    case 'console-count':
      return 'Console Count'
    case 'console-countreset':
      return 'Console Count Reset'
    default:
      return type
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