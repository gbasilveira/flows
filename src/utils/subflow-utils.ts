import type {
  FlowsConfig,
  WorkflowDefinition,
  WorkflowNode,
  NodeExecutor,
  WorkflowId,
} from '../types/index.js';
import { createFlows } from '../index.js';
import { NodeExecutor as DefaultNodeExecutor } from '../core/node-executor.js';
import type { WorkflowExecutor } from '../core/workflow-executor.js';

/**
 * Configuration for subflow-enabled workflow executor
 */
export interface SubflowConfig extends FlowsConfig {
  subflow?: {
    maxDepth?: number;
    preregisteredWorkflows?: WorkflowDefinition[];
  };
}

/**
 * Create a workflow executor with subflow support
 */
export function createFlowsWithSubflows(
  config: SubflowConfig,
  customExecutor?: NodeExecutor
): WorkflowExecutor & { 
  registerSubflow: (definition: WorkflowDefinition) => void;
  unregisterSubflow: (workflowId: WorkflowId) => void;
  getRegisteredSubflows: () => WorkflowDefinition[];
} {
  // Create executor with subflow support enabled
  const nodeExecutor = new DefaultNodeExecutor({
    customExecutor,
    maxSubflowDepth: config.subflow?.maxDepth || 5,
    enableSubflows: true,
  });

  // Register preloaded workflows
  if (config.subflow?.preregisteredWorkflows) {
    config.subflow.preregisteredWorkflows.forEach(workflow => {
      nodeExecutor.registerSubflow(workflow);
    });
  }

  // Create workflow executor with subflow-enabled node executor
  const workflowExecutor = createFlows(config, nodeExecutor);

  // Return enhanced version with subflow methods
  return Object.assign(workflowExecutor, {
    registerSubflow: (definition: WorkflowDefinition) => {
      nodeExecutor.registerSubflow(definition);
    },
    unregisterSubflow: (workflowId: WorkflowId) => {
      nodeExecutor.unregisterSubflow(workflowId);
    },
    getRegisteredSubflows: () => {
      return nodeExecutor.getRegisteredSubflows();
    },
  });
}

/**
 * Helper function to create a subflow node
 */
export function createSubflowNode(
  id: string,
  subflowDefinition: WorkflowDefinition | WorkflowId,
  inputs: Record<string, unknown> = {},
  dependencies: string[] = [],
  options: {
    name?: string;
    description?: string;
    maxDepth?: number;
    subflowContext?: Record<string, unknown>;
    timeout?: number;
  } = {}
): WorkflowNode {
  const node: WorkflowNode = {
    id,
    type: 'subflow',
    name: options.name,
    description: options.description,
    inputs,
    dependencies,
    timeout: options.timeout,
    subflowMaxDepth: options.maxDepth,
    subflowContext: options.subflowContext,
  };

  if (typeof subflowDefinition === 'string') {
    node.subflowId = subflowDefinition;
  } else {
    node.subflowDefinition = subflowDefinition;
  }

  return node;
}

/**
 * Helper to create a module-style workflow (designed to be called as subflow)
 */
export function createWorkflowModule(
  id: WorkflowId,
  name: string,
  nodes: WorkflowNode[],
  options: {
    description?: string;
    version?: string;
    inputs?: string[];  // Expected input parameters
    outputs?: string[]; // Expected output parameters
    metadata?: Record<string, unknown>;
  } = {}
): WorkflowDefinition {
  return {
    id,
    name,
    description: options.description,
    version: options.version || '1.0.0',
    nodes,
    metadata: {
      ...options.metadata,
      moduleType: 'subflow',
      expectedInputs: options.inputs || [],
      expectedOutputs: options.outputs || [],
    },
  };
} 