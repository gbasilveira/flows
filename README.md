# Flows

A stateful, secure, JavaScript-embedded DAG (Directed Acyclic Graph) workflow executor designed for frontend applications.

## Features

- 🔄 **DAG Workflow Execution**: Execute complex workflows with dependencies and parallel processing
- 💾 **Flexible State Persistence**: Support for memory, localStorage, and remote API storage
- ⚡ **Asynchronous Event Handling**: Nodes can wait for external events before continuing
- 🌐 **Frontend Compatible**: Designed to run in browser environments
- 🛡️ **Secure**: Built-in validation and security features
- 📝 **TypeScript Support**: Full TypeScript definitions included
- ⚙️ **Configurable**: Extensive configuration options for different use cases

## Installation

```bash
pnpm add flows
# or
npm install flows
# or
yarn add flows
```

## Quick Start

```typescript
import { createFlows, createWorkflow, StorageType } from 'flows';

// 1. Configure the workflow engine
const config = {
  storage: {
    type: StorageType.MEMORY, // or LOCAL_STORAGE, REMOTE
  },
  logging: {
    level: 'info',
  },
};

// 2. Create the workflow executor
const flows = createFlows(config);

// 3. Define your workflow
const workflow = createWorkflow('my-workflow', 'My First Workflow', [
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
]);

// 4. Execute the workflow
const result = await flows.startWorkflow(workflow);
console.log('Workflow completed:', result);
```

## Storage Options

### Memory Storage
Perfect for development and temporary workflows:

```typescript
const config = {
  storage: {
    type: StorageType.MEMORY,
  },
};
```

### LocalStorage
Persists workflows in the browser's localStorage:

```typescript
const config = {
  storage: {
    type: StorageType.LOCAL_STORAGE,
    config: {
      keyPrefix: 'my_app_flows_', // optional
    },
  },
};
```

### Remote API Storage
Persists workflows via HTTP API:

```typescript
const config = {
  storage: {
    type: StorageType.REMOTE,
    config: {
      baseUrl: 'https://api.example.com',
      apiKey: 'your-api-key', // optional
      timeout: 10000, // optional
      headers: { // optional
        'Custom-Header': 'value',
      },
    },
  },
};
```

## Event-Driven Workflows

Nodes can wait for asynchronous events:

```typescript
const workflow = createWorkflow('event-workflow', 'Event-Driven Workflow', [
  {
    id: 'wait-for-user',
    type: 'data',
    inputs: { prompt: 'Please confirm...' },
    dependencies: [],
    waitForEvents: ['user_confirmation'], // Wait for this event
  },
  {
    id: 'process-after-confirmation',
    type: 'data',
    inputs: { operation: 'process' },
    dependencies: ['wait-for-user'],
  },
]);

// Start the workflow
const executionPromise = flows.startWorkflow(workflow);

// Later, emit the event to continue execution
flows.emitEvent({
  id: 'conf_123',
  type: 'user_confirmation',
  data: { confirmed: true },
  timestamp: new Date(),
});

const result = await executionPromise;
```

## Node Types

### Built-in Node Types

- **`data`**: Pass-through nodes that output their inputs
- **`delay`**: Nodes that wait for a specified time

### Custom Node Executors

Create custom node executors for your specific needs:

```typescript
import { NodeExecutor, WorkflowNode } from 'flows';

class CustomNodeExecutor implements NodeExecutor {
  async execute(
    node: WorkflowNode,
    context: Record<string, unknown>,
    inputs: Record<string, unknown>
  ): Promise<unknown> {
    switch (node.type) {
      case 'http-request':
        return this.executeHttpRequest(node, inputs);
      case 'database-query':
        return this.executeDatabaseQuery(node, inputs);
      default:
        throw new Error(`Unknown node type: ${node.type}`);
    }
  }

  private async executeHttpRequest(node: WorkflowNode, inputs: Record<string, unknown>) {
    // Your HTTP request logic
  }

  private async executeDatabaseQuery(node: WorkflowNode, inputs: Record<string, unknown>) {
    // Your database query logic
  }
}

// Use custom executor
const flows = new WorkflowExecutor(storage, config, new CustomNodeExecutor());
```

## Error Handling and Retries

Configure retry behaviour for individual nodes:

```typescript
const nodeWithRetry = {
  id: 'unreliable-task',
  type: 'http-request',
  inputs: { url: 'https://api.example.com/data' },
  dependencies: [],
  retryConfig: {
    maxAttempts: 3,
    delay: 1000, // 1 second
    backoffMultiplier: 2, // Exponential backoff
    maxDelay: 10000, // Maximum delay between retries
  },
  timeout: 30000, // 30 second timeout
};
```

## Security Features

Configure security options:

```typescript
const config = {
  storage: { type: StorageType.MEMORY },
  security: {
    validateNodes: true,
    allowedNodeTypes: ['data', 'delay', 'http-request'], // Whitelist
    maxExecutionTime: 300000, // 5 minutes max per node
  },
};
```

## API Reference

### Core Classes

- **`WorkflowExecutor`**: Main workflow execution engine
- **`WorkflowEventSystem`**: Event handling system
- **Storage Adapters**: `MemoryStorageAdapter`, `LocalStorageAdapter`, `RemoteStorageAdapter`

### Utility Functions

- **`createFlows(config)`**: Factory function to create a configured workflow executor
- **`createWorkflow(id, name, nodes, options)`**: Helper to create workflow definitions
- **`createEvent(type, data, nodeId)`**: Helper to create workflow events

### Types

Full TypeScript definitions are included for all interfaces and types.

## Advanced Usage

### Workflow State Management

```typescript
// Get current workflow state
const state = await flows.getWorkflowState('workflow-id');

// Resume a paused workflow
const result = await flows.resumeWorkflow('workflow-id');

// List all workflows
const workflows = await flows.listWorkflows();

// Delete a workflow
await flows.deleteWorkflow('workflow-id');
```

### Event System

```typescript
const eventSystem = flows.getEventSystem();

// Listen for specific events
eventSystem.on('user_action', (event) => {
  console.log('User action received:', event);
});

// Wait for events programmatically
const event = await eventSystem.waitForEvent('payment_completed', 30000); // 30s timeout

// Check event history
const recentEvents = eventSystem.getEventHistory('user_action', new Date(Date.now() - 3600000));
```

## Contributing

Contributions are welcome! Please read our contributing guidelines and submit pull requests to our repository.

## Licence

This project is licensed under the ISC Licence - see the LICENSE file for details. 