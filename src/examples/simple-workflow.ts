/**
 * Simple example of using the Flows library
 */
import {
  createFlows,
  createWorkflow,
  createEvent,
  StorageType,
  type FlowsConfig,
  type WorkflowNode,
} from '../index.js';

// Create configuration
const config: FlowsConfig = {
  storage: {
    type: StorageType.MEMORY,
  },
  logging: {
    level: 'info',
  },
};

// Create workflow executor
const flows = createFlows(config);

// Define workflow nodes
const nodes: WorkflowNode[] = [
  {
    id: 'start',
    type: 'data',
    name: 'Start Node',
    inputs: { message: 'Hello, World!' },
    dependencies: [],
  },
  {
    id: 'delay',
    type: 'delay',
    name: 'Delay Node',
    inputs: { delay: 1000 },
    dependencies: ['start'],
  },
  {
    id: 'wait_for_user',
    type: 'data',
    name: 'Wait for User Input',
    inputs: { prompt: 'Please confirm...' },
    dependencies: ['delay'],
    waitForEvents: ['user_confirmation'],
  },
  {
    id: 'finish',
    type: 'data',
    name: 'Finish Node',
    inputs: { status: 'completed' },
    dependencies: ['wait_for_user'],
  },
];

// Create workflow definition
const workflowDef = createWorkflow(
  'simple-example',
  'Simple Example Workflow',
  nodes,
  {
    description: 'A simple example workflow demonstrating basic features',
    version: '1.0.0',
  }
);

// Example usage
export async function runExample() {
  console.log('Starting workflow...');
  
  // Start workflow execution
  const executionPromise = flows.startWorkflow(workflowDef, {
    userId: 'demo-user',
  });

  // Simulate user confirmation event after 2 seconds
  setTimeout(() => {
    console.log('Emitting user confirmation event...');
    
    const confirmationEvent = createEvent('user_confirmation', {
      confirmed: true,
      timestamp: new Date(),
    });
    
    flows.emitEvent(confirmationEvent);
  }, 2000);

  // Wait for workflow completion
  const result = await executionPromise;
  
  console.log('Workflow completed:', result);
  console.log('Node results:', result.nodeResults);
  
  return result;
}

// Run the example if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  runExample().catch(console.error);
} 