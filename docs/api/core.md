# Core API Reference

This section documents the core classes and interfaces that make up the Flows workflow engine.

## WorkflowExecutor

The main class for executing workflows. It orchestrates workflow execution, manages state, and coordinates with storage adapters and node executors.

### Constructor

```typescript
constructor(
  storage: StorageAdapter,
  config?: FlowsConfig,
  nodeExecutor?: NodeExecutor
)
```

**Parameters:**
- `storage`: Storage adapter for persisting workflow state
- `config`: Optional configuration object (defaults provided)
- `nodeExecutor`: Optional custom node executor (uses default if not provided)

**Example:**
```typescript
import { WorkflowExecutor, MemoryStorageAdapter, DefaultNodeExecutor } from 'flows';

const storage = new MemoryStorageAdapter();
const executor = new WorkflowExecutor(storage, {
  logging: { level: 'info' },
  security: { validateNodes: true }
});
```

### Methods

#### `startWorkflow(workflow: WorkflowDefinition): Promise<WorkflowResult>`

Starts execution of a workflow.

**Parameters:**
- `workflow`: The workflow definition to execute

**Returns:** Promise resolving to workflow execution result

**Example:**
```typescript
const result = await executor.startWorkflow(myWorkflow);
console.log('Workflow completed:', result.status);
```

**Throws:**
- `ValidationError`: If workflow definition is invalid
- `ExecutionError`: If workflow execution fails

#### `resumeWorkflow(workflowId: string): Promise<WorkflowResult>`

Resumes a paused workflow.

**Parameters:**
- `workflowId`: Unique identifier of the workflow to resume

**Returns:** Promise resolving to workflow execution result

**Example:**
```typescript
const result = await executor.resumeWorkflow('my-workflow-123');
```

#### `getWorkflowState(workflowId: string): Promise<WorkflowState | null>`

Retrieves the current state of a workflow.

**Parameters:**
- `workflowId`: Unique identifier of the workflow

**Returns:** Promise resolving to workflow state or null if not found

**Example:**
```typescript
const state = await executor.getWorkflowState('my-workflow-123');
if (state) {
  console.log('Status:', state.status);
  console.log('Completed nodes:', state.completedNodes.length);
}
```

#### `cancelWorkflow(workflowId: string): Promise<void>`

Cancels a running or paused workflow.

**Parameters:**
- `workflowId`: Unique identifier of the workflow to cancel

**Example:**
```typescript
await executor.cancelWorkflow('my-workflow-123');
```

#### `deleteWorkflow(workflowId: string): Promise<void>`

Deletes a workflow and its state.

**Parameters:**
- `workflowId`: Unique identifier of the workflow to delete

**Example:**
```typescript
await executor.deleteWorkflow('my-workflow-123');
```

#### `listWorkflows(): Promise<WorkflowListItem[]>`

Lists all workflows known to the executor.

**Returns:** Promise resolving to array of workflow list items

**Example:**
```typescript
const workflows = await executor.listWorkflows();
workflows.forEach(workflow => {
  console.log(`${workflow.id}: ${workflow.status}`);
});
```

#### `emitEvent(event: WorkflowEvent): void`

Emits an event that can be consumed by waiting workflows.

**Parameters:**
- `event`: The event to emit

**Example:**
```typescript
executor.emitEvent({
  id: 'user-action-001',
  type: 'button-clicked',
  data: { buttonId: 'submit' },
  timestamp: new Date(),
});
```

#### `getEventSystem(): WorkflowEventSystem`

Gets the event system for advanced event handling.

**Returns:** The workflow event system instance

**Example:**
```typescript
const eventSystem = executor.getEventSystem();
eventSystem.on('workflow-completed', (event) => {
  console.log('Workflow completed:', event.workflowId);
});
```

#### `getFailureMetrics(workflowId?: string, nodeId?: string): FailureMetric[]`

Gets failure metrics for monitoring and debugging.

**Parameters:**
- `workflowId`: Optional workflow ID to filter metrics
- `nodeId`: Optional node ID to filter metrics

**Returns:** Array of failure metrics

**Example:**
```typescript
const metrics = executor.getFailureMetrics('my-workflow-123');
console.log('Failure rate:', metrics[0]?.failureRate);
```

#### `getDeadLetterQueue(workflowId?: string): DeadLetterItem[]`

Gets items from the dead letter queue.

**Parameters:**
- `workflowId`: Optional workflow ID to filter items

**Returns:** Array of dead letter queue items

**Example:**
```typescript
const dlqItems = executor.getDeadLetterQueue();
console.log(`${dlqItems.length} items in dead letter queue`);
```

#### `retryDeadLetterItem(workflowId: string, itemId: string): Promise<boolean>`

Retries a specific item from the dead letter queue.

**Parameters:**
- `workflowId`: Workflow ID containing the item
- `itemId`: ID of the item to retry

**Returns:** Promise resolving to true if retry succeeded

**Example:**
```typescript
const success = await executor.retryDeadLetterItem('workflow-123', 'item-456');
if (success) {
  console.log('Item retried successfully');
}
```

#### `dispose(): Promise<void>`

Cleans up resources and stops background processes.

**Example:**
```typescript
await executor.dispose();
```

## WorkflowEventSystem

Manages workflow events and event-driven behaviour.

### Methods

#### `on(eventType: string, listener: EventListener): void`

Registers an event listener.

**Parameters:**
- `eventType`: Type of event to listen for (use '*' for all events)
- `listener`: Function to call when event occurs

**Example:**
```typescript
eventSystem.on('user-registered', (event) => {
  console.log('User registered:', event.data.userId);
});
```

#### `off(eventType: string, listener?: EventListener): void`

Removes event listener(s).

**Parameters:**
- `eventType`: Type of event to stop listening for
- `listener`: Specific listener to remove (optional, removes all if not specified)

**Example:**
```typescript
eventSystem.off('user-registered', myListener);
```

#### `emit(event: WorkflowEvent): void`

Emits an event to all registered listeners.

**Parameters:**
- `event`: The event to emit

**Example:**
```typescript
eventSystem.emit({
  id: 'evt-001',
  type: 'payment-completed',
  data: { amount: 99.99 },
  timestamp: new Date(),
});
```

#### `waitForEvent(eventType: string, timeout?: number): Promise<WorkflowEvent>`

Waits for a specific event type.

**Parameters:**
- `eventType`: Type of event to wait for
- `timeout`: Optional timeout in milliseconds

**Returns:** Promise resolving to the event

**Example:**
```typescript
try {
  const event = await eventSystem.waitForEvent('payment-completed', 30000);
  console.log('Payment completed:', event.data);
} catch (error) {
  console.log('Payment timed out');
}
```

#### `getEventHistory(eventType?: string, since?: Date, filter?: EventFilter): WorkflowEvent[]`

Retrieves historical events.

**Parameters:**
- `eventType`: Optional event type filter
- `since`: Optional date to filter events since
- `filter`: Optional custom filter function

**Returns:** Array of matching events

**Example:**
```typescript
const recentEvents = eventSystem.getEventHistory(
  'user-action',
  new Date(Date.now() - 3600000) // Last hour
);
```

## FailureManager

Handles workflow failure scenarios, retries, and monitoring.

### Methods

#### `shouldExecuteNode(node: WorkflowNode, nodeState: NodeState, workflowState: WorkflowState): boolean`

Determines if a node should be executed based on failure handling rules.

**Parameters:**
- `node`: The workflow node
- `nodeState`: Current state of the node
- `workflowState`: Current state of the workflow

**Returns:** Boolean indicating whether to execute the node

#### `handleNodeFailure(node: WorkflowNode, nodeState: NodeState, workflowState: WorkflowState, error: Error): Promise<FailureHandlingResult>`

Handles a node execution failure.

**Parameters:**
- `node`: The failed workflow node
- `nodeState`: Current state of the node
- `workflowState`: Current state of the workflow
- `error`: The error that occurred

**Returns:** Promise resolving to failure handling result

#### `handleNodeSuccess(node: WorkflowNode, nodeState: NodeState, workflowState: WorkflowState): void`

Handles successful node execution for failure tracking.

**Parameters:**
- `node`: The successful workflow node
- `nodeState`: Current state of the node
- `workflowState`: Current state of the workflow

#### `calculateRetryDelay(baseDelay: number, attempt: number, backoffMultiplier: number, maxDelay: number, useJitter: boolean): number`

Calculates the delay before the next retry attempt.

**Parameters:**
- `baseDelay`: Base delay in milliseconds
- `attempt`: Current attempt number (1-based)
- `backoffMultiplier`: Multiplier for exponential backoff
- `maxDelay`: Maximum delay in milliseconds
- `useJitter`: Whether to add randomization

**Returns:** Delay in milliseconds

**Example:**
```typescript
const delay = failureManager.calculateRetryDelay(
  1000,    // 1 second base delay
  3,       // 3rd attempt
  2,       // Double delay each time
  30000,   // Max 30 seconds
  true     // Add jitter
);
```

## Storage Adapters

### StorageAdapter Interface

Base interface that all storage adapters must implement.

```typescript
interface StorageAdapter {
  saveWorkflowState(workflowId: string, state: WorkflowState): Promise<void>;
  loadWorkflowState(workflowId: string): Promise<WorkflowState | null>;
  deleteWorkflowState(workflowId: string): Promise<void>;
  listWorkflows(): Promise<string[]>;
}
```

### MemoryStorageAdapter

In-memory storage adapter (data lost on restart).

#### Constructor

```typescript
constructor()
```

**Example:**
```typescript
const storage = new MemoryStorageAdapter();
```

#### Methods

Implements all `StorageAdapter` methods. Data is stored in memory and lost when the process exits.

### LocalStorageAdapter

Browser localStorage storage adapter.

#### Constructor

```typescript
constructor(config?: LocalStorageConfig)
```

**Parameters:**
- `config`: Optional configuration object

**Example:**
```typescript
const storage = new LocalStorageAdapter({
  keyPrefix: 'myapp_flows_'
});
```

#### Configuration

```typescript
interface LocalStorageConfig {
  keyPrefix?: string;  // Prefix for localStorage keys
}
```

### RemoteStorageAdapter

Remote API storage adapter.

#### Constructor

```typescript
constructor(config: RemoteStorageConfig)
```

**Parameters:**
- `config`: Configuration object with API settings

**Example:**
```typescript
const storage = new RemoteStorageAdapter({
  baseUrl: 'https://api.example.com/flows',
  apiKey: 'your-api-key',
  timeout: 10000,
});
```

#### Configuration

```typescript
interface RemoteStorageConfig {
  baseUrl: string;                    // Base URL for the API
  apiKey?: string;                    // Optional API key
  timeout?: number;                   // Request timeout in ms
  headers?: Record<string, string>;   // Additional headers
}
```

## Node Executors

### NodeExecutor Interface

Base interface for node executors.

```typescript
interface NodeExecutor {
  execute(
    node: WorkflowNode,
    context: Record<string, unknown>,
    inputs: Record<string, unknown>
  ): Promise<unknown>;
}
```

### DefaultNodeExecutor

Built-in executor for standard node types.

#### Constructor

```typescript
constructor()
```

#### Supported Node Types

- `'data'`: Pass-through node that returns its inputs
- `'delay'`: Delay node that waits for specified duration

**Example:**
```typescript
const executor = new DefaultNodeExecutor();

// Data node
const dataNode = {
  id: 'pass-data',
  type: 'data',
  inputs: { message: 'Hello World' },
  dependencies: []
};

// Delay node
const delayNode = {
  id: 'wait',
  type: 'delay',
  inputs: { duration: 5000 }, // 5 seconds
  dependencies: []
};
```

## Utility Functions

### `createFlows(config: FlowsConfig, nodeExecutor?: NodeExecutor): WorkflowExecutor`

Factory function to create a configured workflow executor.

**Parameters:**
- `config`: Configuration object
- `nodeExecutor`: Optional custom node executor

**Returns:** Configured WorkflowExecutor instance

**Example:**
```typescript
const flows = createFlows({
  storage: { type: StorageType.MEMORY },
  logging: { level: 'info' }
});
```

### `createWorkflow(id: string, name: string, nodes: WorkflowNode[], options?: WorkflowOptions): WorkflowDefinition`

Helper function to create workflow definitions.

**Parameters:**
- `id`: Unique workflow identifier
- `name`: Human-readable workflow name
- `nodes`: Array of workflow nodes
- `options`: Optional workflow options

**Returns:** Complete workflow definition

**Example:**
```typescript
const workflow = createWorkflow(
  'user-onboarding',
  'User Onboarding Process',
  [
    { id: 'step1', type: 'data', inputs: {}, dependencies: [] },
    { id: 'step2', type: 'data', inputs: {}, dependencies: ['step1'] }
  ],
  {
    description: 'Complete user onboarding flow',
    timeout: 300000
  }
);
```

### `createEvent(type: string, data: unknown, nodeId?: string, workflowId?: string): WorkflowEvent`

Helper function to create workflow events.

**Parameters:**
- `type`: Event type
- `data`: Event data payload
- `nodeId`: Optional target node ID
- `workflowId`: Optional target workflow ID

**Returns:** Complete workflow event

**Example:**
```typescript
const event = createEvent('user-clicked', { 
  buttonId: 'submit',
  timestamp: Date.now() 
});
```

## Error Classes

### `ValidationError`

Thrown when workflow or node validation fails.

```typescript
class ValidationError extends Error {
  constructor(message: string, public details?: unknown) {
    super(message);
  }
}
```

### `ExecutionError`

Thrown when workflow execution encounters an error.

```typescript
class ExecutionError extends Error {
  constructor(
    message: string,
    public workflowId: string,
    public nodeId?: string,
    public cause?: Error
  ) {
    super(message);
  }
}
```

### `TimeoutError`

Thrown when operations exceed their timeout.

```typescript
class TimeoutError extends Error {
  constructor(message: string, public timeoutMs: number) {
    super(message);
  }
}
```

## Event Types

### System Events

Flows automatically emits these events:

- `'workflow-started'`: When a workflow begins execution
- `'workflow-completed'`: When a workflow completes successfully
- `'workflow-failed'`: When a workflow fails
- `'workflow-cancelled'`: When a workflow is cancelled
- `'workflow-paused'`: When a workflow pauses (waiting for events)
- `'workflow-resumed'`: When a paused workflow resumes
- `'node-started'`: When a node begins execution
- `'node-completed'`: When a node completes successfully
- `'node-failed'`: When a node execution fails
- `'node-skipped'`: When a node is skipped due to failure handling

**Example:**
```typescript
flows.getEventSystem().on('workflow-completed', (event) => {
  console.log(`Workflow ${event.workflowId} completed in ${event.data.duration}ms`);
});
```

---

## Next Steps

- **[Utility Functions](./utilities.md)** - Helper functions and utilities
- **[Types & Interfaces](./types.md)** - Complete type definitions
- **[Configuration](./configuration.md)** - Configuration options reference
- **[Examples](../examples/)** - See the API in action 