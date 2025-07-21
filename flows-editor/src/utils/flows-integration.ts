import type { 
  EditorConfig, 
  FlowsConfig, 
  Workflow
} from '../types'

// Import flows library
// TODO: Re-enable when flows package build is fixed
/*
import { 
  createFlows, 
  createWorkflow, 
  StorageType, 
  DefaultNodeExecutor,
  type FlowsConfig as FlowsLibraryConfig
} from 'flows'
*/

/**
 * Flows Integration Utility
 * Connects the flows-editor with the flows library for execution
 */
export class FlowsIntegration {
  private flowsInstance: any = null

  constructor(_config: EditorConfig) {
    // TODO: Re-enable when flows package is available
    // this.config = config
    // this.initializeFlows()
  }

  /**
   * Execute a workflow using the flows library
   */
  async executeWorkflow(workflow: Workflow): Promise<any> {
    // TODO: Re-enable when flows package is available
    /*
    if (!this.flowsInstance) {
      throw new Error('Flows instance not initialized')
    }

    try {
      // Convert editor workflow to flows library format
      const flowsWorkflow = this.convertWorkflowFormat(workflow)
      
      // Create node executor with built-in handlers
      const nodeExecutor = new DefaultNodeExecutor()
      
      // Execute the workflow
      const result = await this.flowsInstance.executeWorkflow(
        flowsWorkflow, 
        nodeExecutor
      )
      
      return result
    } catch (error) {
      console.error('Workflow execution failed:', error)
      throw error
    }
    */
    
    // Temporary mock implementation
    console.log('Workflow execution (mock):', workflow)
    return { status: 'completed', result: 'Mock execution result' }
  }

  /**
   * Validate a workflow before execution
   */
  validateWorkflow(workflow: Workflow): { isValid: boolean; errors: string[] } {
    // TODO: Re-enable when flows package is available
    /*
    if (!this.flowsInstance) {
      return { isValid: false, errors: ['Flows instance not initialized'] }
    }

    try {
      const flowsWorkflow = this.convertWorkflowFormat(workflow)
      const nodeExecutor = new DefaultNodeExecutor()
      
      // Validate the workflow structure
      const validation = this.flowsInstance.validateWorkflow(flowsWorkflow, nodeExecutor)
      return validation
    } catch (error) {
      return { isValid: false, errors: [error.message] }
    }
    */
    
    // Temporary mock validation
    const errors: string[] = []
    
    if (!workflow.nodes || workflow.nodes.length === 0) {
      errors.push('Workflow must contain at least one node')
    }
    
    return { isValid: errors.length === 0, errors }
  }

  /**
   * Get available node types from flows library
   */
  getAvailableNodeTypes(): any[] {
    // TODO: Re-enable when flows package is available
    /*
    if (!this.flowsInstance) return []
    return this.flowsInstance.getAvailableNodeTypes()
    */
    
    // Temporary mock node types
    return []
  }

  /**
   * Get flows instance for direct access
   */
  getFlowsInstance(): any {
    return this.flowsInstance
  }

  /**
   * Dispose of the flows integration
   */
  dispose(): void {
    // TODO: Re-enable when flows package is available
    /*
    if (this.flowsInstance) {
      this.flowsInstance.dispose?.()
      this.flowsInstance = null
    }
    */
    this.flowsInstance = null
  }
}

/**
 * Create a flows integration instance
 */
export function createFlowsIntegration(config: EditorConfig): FlowsIntegration {
  return new FlowsIntegration(config)
}

/**
 * Utility function to execute a workflow
 */
export async function executeWorkflow(
  workflow: Workflow, 
  config: EditorConfig
): Promise<any> {
  const integration = createFlowsIntegration(config)
  
  try {
    const result = await integration.executeWorkflow(workflow)
    return result
  } finally {
    integration.dispose()
  }
}

/**
 * Utility function to validate a workflow
 */
export function validateWorkflow(
  workflow: Workflow, 
  config: EditorConfig
): { isValid: boolean; errors: string[] } {
  const integration = createFlowsIntegration(config)
  
  try {
    return integration.validateWorkflow(workflow)
  } finally {
    integration.dispose()
  }
}

/**
 * Get default flows configuration
 */
export function getDefaultFlowsConfig(): FlowsConfig {
  return {
    storage: {
      type: 'memory'
    },
    logging: {
      level: 'info'
    },
    failureHandling: {
      strategy: 'retry',
      config: {
        maxRetries: 3,
        retryDelay: 1000
      }
    }
  }
}

/**
 * Get all available node types from flows library
 */
export function getAvailableNodeTypes(): string[] {
  // These are the node types available in the flows library
  return [
    // Core nodes
    'data',
    'delay',
    'subflow',
    
    // Logical operations
    'logic-and',
    'logic-or', 
    'logic-not',
    'logic-xor',
    
    // Mathematical operations
    'math-add',
    'math-subtract',
    'math-multiply',
    'math-divide',
    'math-power',
    'math-modulo',
    
    // String operations
    'string-concat',
    'string-substring',
    'string-replace',
    'string-match',
    'string-split',
    'string-compare',
    'string-length',
    'string-case',
    
    // Flow control
    'condition',
    'merge-all',
    'merge-any',
    'merge-majority',
    'merge-count'
  ]
} 