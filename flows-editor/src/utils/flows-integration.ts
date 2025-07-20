import type { 
  EditorConfig, 
  FlowsConfig, 
  Workflow
} from '../types'

// Import flows library
import { 
  createFlows, 
  createWorkflow, 
  StorageType, 
  DefaultNodeExecutor,
  type FlowsConfig as FlowsLibraryConfig
} from 'flows'

/**
 * Flows Integration Utility
 * Connects the flows-editor with the flows library for execution
 */
export class FlowsIntegration {
  private flowsInstance: any = null
  private config: EditorConfig

  constructor(config: EditorConfig) {
    this.config = config
    this.initializeFlows()
  }

  /**
   * Initialize the flows library with configuration
   */
  private initializeFlows() {
    const flowsConfig = this.buildFlowsConfig()
    const executor = this.buildNodeExecutor()
    
    this.flowsInstance = createFlows(flowsConfig, executor)
  }

  /**
   * Build flows library configuration from editor config
   */
  private buildFlowsConfig(): FlowsLibraryConfig {
    const editorFlowsConfig = this.config.flowsConfig || {}
    
    return {
      storage: this.buildStorageConfig(editorFlowsConfig.storage),
      logging: this.buildLoggingConfig(editorFlowsConfig.logging),
      failureHandling: this.buildFailureHandlingConfig(editorFlowsConfig.failureHandling),
    }
  }

  /**
   * Build storage configuration
   */
  private buildStorageConfig(storageConfig?: any) {
    if (!storageConfig) {
      return { type: StorageType.MEMORY }
    }

    switch (storageConfig.type) {
      case 'memory':
        return { type: StorageType.MEMORY }
      case 'localStorage':
        return { 
          type: StorageType.LOCAL_STORAGE,
          config: storageConfig.config || { keyPrefix: 'flows_editor_' }
        }
      case 'remote':
        return { 
          type: StorageType.REMOTE,
          config: storageConfig.config || {}
        }
      default:
        return { type: StorageType.MEMORY }
    }
  }

  /**
   * Build logging configuration
   */
  private buildLoggingConfig(loggingConfig?: any) {
    return {
      level: loggingConfig?.level || 'info'
    }
  }

  /**
   * Build failure handling configuration
   */
  private buildFailureHandlingConfig(failureConfig?: any) {
    if (!failureConfig) {
      return undefined
    }

    return {
      strategy: failureConfig.strategy || 'retry',
      config: failureConfig.config || {}
    }
  }

  /**
   * Build node executor with plugins
   */
  private buildNodeExecutor(): DefaultNodeExecutor {
    const options: any = {
      enableSubflows: this.config.features?.subflows !== false,
      allowCustomHandlers: this.config.features?.customHandlers !== false,
    }

    // Add plugins based on configuration
    const plugins: any[] = []

    // Add built-in plugins based on enabled categories
    const enabledCategories = this.config.enabledCategories || ['core', 'logic', 'math', 'string', 'flow', 'console']
    
    // For now, we'll use a simplified approach without importing specific plugins
    // The flows library will handle its own plugin system
    if (enabledCategories.includes('logic') || enabledCategories.includes('math') || 
        enabledCategories.includes('string') || enabledCategories.includes('flow') ||
        enabledCategories.includes('console')) {
      // Enable all built-in plugins by default
      // The flows library will handle plugin loading internally
    }

    // Add custom plugins if configured
    if (this.config.plugins) {
      for (const _plugin of this.config.plugins) {
        // Convert editor plugin to flows plugin format
        const flowsPlugin = this.convertEditorPluginToFlowsPlugin()
        if (flowsPlugin) {
          plugins.push(flowsPlugin)
        }
      }
    }

    options.plugins = plugins

    return new DefaultNodeExecutor(options)
  }

  /**
   * Convert editor plugin to flows plugin format
   */
  private convertEditorPluginToFlowsPlugin(): any {
    // Placeholder for plugin conversion logic
    return {}
  }

  /**
   * Execute a workflow
   */
  async executeWorkflow(workflow: Workflow): Promise<any> {
    if (!this.flowsInstance) {
      throw new Error('Flows instance not initialized')
    }

    const flowsWorkflow = this.convertEditorWorkflowToFlowsWorkflow(workflow)
    return await this.flowsInstance.startWorkflow(flowsWorkflow)
  }

  /**
   * Convert editor workflow format to flows library format
   */
  private convertEditorWorkflowToFlowsWorkflow(workflow: Workflow): any {
    return createWorkflow(
      workflow.id,
      workflow.name,
      workflow.nodes.map(node => ({
        id: node.id,
        type: node.type,
        inputs: node.inputs || {},
        dependencies: node.dependencies || [],
      }))
    )
  }

  /**
   * Convert flows library workflow format to editor format
   */
  convertFlowsWorkflowToEditorWorkflow(flowsWorkflow: any): Workflow {
    return {
      id: flowsWorkflow.id,
      name: flowsWorkflow.name,
      nodes: flowsWorkflow.nodes.map((node: any) => ({
        id: node.id,
        type: node.type,
        inputs: node.inputs || {},
        dependencies: node.dependencies || [],
      }))
    }
  }

  /**
   * Get available node types
   */
  getAvailableNodeTypes(): string[] {
    if (!this.flowsInstance) {
      return []
    }

    // Get node types from the executor
    const executor = (this.flowsInstance as any).executor
    if (executor && typeof executor.getAvailableNodeTypes === 'function') {
      return executor.getAvailableNodeTypes()
    }

    return []
  }

  /**
   * Validate a workflow
   */
  validateWorkflow(workflow: Workflow): { isValid: boolean; errors: string[] } {
    const errors: string[] = []

    // Basic validation
    if (!workflow.id) {
      errors.push('Workflow must have an ID')
    }

    if (!workflow.name) {
      errors.push('Workflow must have a name')
    }

    if (!workflow.nodes || workflow.nodes.length === 0) {
      errors.push('Workflow must have at least one node')
    }

    // Validate nodes
    const nodeIds = new Set<string>()
    for (const node of workflow.nodes) {
      if (!node.id) {
        errors.push('All nodes must have an ID')
        continue
      }

      if (nodeIds.has(node.id)) {
        errors.push(`Duplicate node ID: ${node.id}`)
      }
      nodeIds.add(node.id)

      if (!node.type) {
        errors.push(`Node ${node.id} must have a type`)
      }

      // Check if node type is available
      const availableTypes = this.getAvailableNodeTypes()
      if (node.type && !availableTypes.includes(node.type)) {
        errors.push(`Unknown node type: ${node.type}`)
      }
    }

    // Validate dependencies
    for (const node of workflow.nodes) {
      if (node.dependencies) {
        for (const depId of node.dependencies) {
          if (!nodeIds.has(depId)) {
            errors.push(`Node ${node.id} depends on non-existent node: ${depId}`)
          }
        }
      }
    }

    return {
      isValid: errors.length === 0,
      errors
    }
  }

  /**
   * Dispose of the flows instance
   */
  dispose(): void {
    if (this.flowsInstance && typeof this.flowsInstance.dispose === 'function') {
      this.flowsInstance.dispose()
    }
    this.flowsInstance = null
  }

  /**
   * Get flows instance for direct access
   */
  getFlowsInstance(): any {
    return this.flowsInstance
  }

  /**
   * Get configuration
   */
  getConfig(): EditorConfig {
    return this.config
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