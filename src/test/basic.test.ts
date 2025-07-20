import { describe, it, expect } from 'vitest';
import {
  createFlows,
  createWorkflow,
  createEvent,
  StorageType,
  ExecutionStatus,
  type WorkflowNode,
} from '../index.js';

describe('Flows Library', () => {
  it('should create a workflow executor', () => {
    const config = {
      storage: {
        type: StorageType.MEMORY,
      },
    };

    const flows = createFlows(config);
    expect(flows).toBeDefined();
  });

  it('should execute a simple workflow', async () => {
    const config = {
      storage: {
        type: StorageType.MEMORY,
      },
      logging: {
        level: 'error' as const, // Reduce noise in tests
      },
    };

    const flows = createFlows(config);

    const nodes: WorkflowNode[] = [
      {
        id: 'start',
        type: 'data',
        inputs: { message: 'Hello' },
        dependencies: [],
      },
      {
        id: 'transform',
        type: 'transform',
        inputs: { operation: 'test' },
        dependencies: ['start'],
      },
    ];

    const workflow = createWorkflow('test-workflow', 'Test Workflow', nodes);

    const result = await flows.startWorkflow(workflow);

    expect(result.status).toBe(ExecutionStatus.COMPLETED);
    expect(result.workflowId).toBe('test-workflow');
    expect(result.nodeResults).toBeDefined();
    expect(result.nodeResults.start).toBeDefined();
    expect(result.nodeResults.transform).toBeDefined();
  });

  it('should handle workflow with events', async () => {
    const config = {
      storage: {
        type: StorageType.MEMORY,
      },
      logging: {
        level: 'error' as const,
      },
    };

    const flows = createFlows(config);

    const nodes: WorkflowNode[] = [
      {
        id: 'start',
        type: 'data',
        inputs: { message: 'Starting' },
        dependencies: [],
      },
      {
        id: 'wait',
        type: 'data',
        inputs: { waiting: true },
        dependencies: ['start'],
        waitForEvents: ['test_event'],
      },
    ];

    const workflow = createWorkflow('event-workflow', 'Event Workflow', nodes);

    // Start workflow (it will wait for the event)
    const executionPromise = flows.startWorkflow(workflow);

    // Give it a moment to start
    await new Promise(resolve => setTimeout(resolve, 100));

    // Emit the event
    const event = createEvent('test_event', { data: 'test' });
    flows.emitEvent(event);

    const result = await executionPromise;

    expect(result.status).toBe(ExecutionStatus.WAITING); // Still waiting because the event node doesn't complete
  });

  it('should create workflow events', () => {
    const event = createEvent('test_event', { test: true }, 'node1');

    expect(event.type).toBe('test_event');
    expect(event.data).toEqual({ test: true });
    expect(event.nodeId).toBe('node1');
    expect(event.timestamp).toBeInstanceOf(Date);
    expect(event.id).toBeDefined();
  });

  it('should manage workflow state', async () => {
    const config = {
      storage: {
        type: StorageType.MEMORY,
      },
      logging: {
        level: 'error' as const,
      },
    };

    const flows = createFlows(config);

    const nodes: WorkflowNode[] = [
      {
        id: 'simple',
        type: 'data',
        inputs: { test: true },
        dependencies: [],
      },
    ];

    const workflow = createWorkflow('state-test', 'State Test', nodes);
    
    await flows.startWorkflow(workflow);

    // Check if workflow exists
    const workflows = await flows.listWorkflows();
    expect(workflows).toContain('state-test');

    // Get workflow state
    const state = await flows.getWorkflowState('state-test');
    expect(state).toBeDefined();
    expect(state?.id).toBe('state-test');

    // Clean up
    await flows.deleteWorkflow('state-test');
    
    const workflowsAfterDelete = await flows.listWorkflows();
    expect(workflowsAfterDelete).not.toContain('state-test');
  });
}); 