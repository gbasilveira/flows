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
- 🚨 **Comprehensive Failure Handling**: Circuit breaker, dead letter queue, poison message detection, and graceful degradation
- 📊 **Real-time Monitoring**: Failure metrics, alerting, and performance tracking
- 🔧 **Enterprise-Ready**: Production-grade reliability patterns

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

## Running Examples

The project includes comprehensive examples in the `src/examples/` directory. You can run them in two ways:

### Method 1: Using tsx (Recommended)

The quickest way to run the examples directly from TypeScript:

```bash
# Run the subflow example
npx tsx src/examples/subflow-example.ts

# Run the simple workflow example  
npx tsx src/examples/simple-workflow.ts

# Run the failure handling examples
npx tsx src/examples/failure-examples.ts
```

### Method 2: Using TypeScript Compiler

Compile and run the examples using `tsc`:

```bash
# Compile the example
npx tsc src/examples/subflow-example.ts --outDir dist-temp --module commonjs --target es2020 --moduleResolution node --esModuleInterop --skipLibCheck

# Run the compiled JavaScript
node dist-temp/examples/subflow-example.js

# Clean up
rm -rf dist-temp
```

### Available Examples

- **`subflow-example.ts`**: Demonstrates modular workflows using subflows
- **`simple-workflow.ts`**: Basic workflow execution patterns
- **`failure-examples.ts`**: Comprehensive failure handling strategies

Each example includes detailed comments explaining the concepts and can be run independently.

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

## Comprehensive Failure Handling

Flows provides enterprise-grade failure handling with multiple strategies to ensure reliable workflow execution in production environments.

### Failure Strategies

Choose from six different failure handling strategies:

#### 1. Fail Fast
Stop immediately on the first failure:

```typescript
const config = {
  storage: { type: StorageType.MEMORY },
  failureHandling: {
    strategy: FailureStrategy.FAIL_FAST,
  },
};
```

#### 2. Retry and Fail
Retry failed operations, then fail the workflow:

```typescript
const nodeWithRetry = {
  id: 'api-call',
  type: 'http-request',
  inputs: { url: 'https://api.example.com/data' },
  dependencies: [],
  retryConfig: {
    maxAttempts: 3,
    delay: 1000,
    backoffMultiplier: 2, // Exponential backoff
    maxDelay: 10000,
    jitter: true, // Add randomization to delays
    retryableErrors: ['timeout', '503', '502'],
    nonRetryableErrors: ['401', '403', '404'],
  },
  failureHandling: {
    strategy: FailureStrategy.RETRY_AND_FAIL,
  },
};
```

#### 3. Retry and Dead Letter Queue
Retry failed operations, then route to dead letter queue for later processing:

```typescript
const config = {
  storage: { type: StorageType.MEMORY },
  failureHandling: {
    strategy: FailureStrategy.RETRY_AND_DLQ,
    deadLetter: {
      enabled: true,
      maxRetries: 3,
      retentionPeriod: 3600000, // 1 hour
      handler: (node, error, attempts) => {
        console.log(`Node ${node.id} sent to DLQ after ${attempts} attempts`);
      },
    },
  },
};
```

#### 4. Retry and Skip
Retry failed operations, then skip and continue with the workflow:

```typescript
const config = {
  storage: { type: StorageType.MEMORY },
  failureHandling: {
    strategy: FailureStrategy.RETRY_AND_SKIP,
  },
};
```

#### 5. Circuit Breaker Pattern
Protect against cascading failures with circuit breaker:

```typescript
const config = {
  storage: { type: StorageType.MEMORY },
  failureHandling: {
    strategy: FailureStrategy.CIRCUIT_BREAKER,
    circuitBreaker: {
      failureThreshold: 5,      // Open after 5 failures
      timeWindow: 60000,        // Within 1 minute
      recoveryTimeout: 30000,   // Wait 30s before half-open
      successThreshold: 3,      // Close after 3 successes
    },
  },
};
```

#### 6. Graceful Degradation
Continue with reduced functionality and fallback results:

```typescript
const config = {
  storage: { type: StorageType.MEMORY },
  failureHandling: {
    strategy: FailureStrategy.GRACEFUL_DEGRADATION,
    gracefulDegradationConfig: {
      continueOnNodeFailure: true,
      skipDependentNodes: false,
      fallbackResults: {
        'user-preferences': { theme: 'default', language: 'en' },
        'recommendations': { items: [] },
      },
    },
  },
};
```

### Dead Letter Queue Management

Access and manage failed items:

```typescript
// Get dead letter queue items
const dlqItems = flows.getDeadLetterQueue('workflow-id');

// Retry a specific item
const success = await flows.retryDeadLetterItem('workflow-id', 'item-id');

// Custom DLQ handler
const config = {
  failureHandling: {
    strategy: FailureStrategy.RETRY_AND_DLQ,
    deadLetter: {
      enabled: true,
      handler: (node, error, attempts) => {
        // Send to external queue system
        sendToExternalQueue({
          nodeId: node.id,
          error,
          attempts,
          timestamp: new Date(),
        });
      },
    },
  },
};
```

### Failure Monitoring and Alerting

Real-time monitoring with configurable alerts:

```typescript
const config = {
  storage: { type: StorageType.MEMORY },
  failureHandling: {
    strategy: FailureStrategy.CIRCUIT_BREAKER,
    monitoring: {
      enabled: true,
      failureRateThreshold: 25,        // Alert if >25% failure rate
      alertingEnabled: true,
      metricsCollectionInterval: 30000, // Collect every 30s
      retentionPeriod: 2592000000,     // Keep for 30 days
      alertHandler: (alert) => {
        switch (alert.alertType) {
          case 'HIGH_FAILURE_RATE':
            sendSlackAlert(`⚠️ High failure rate: ${alert.message}`);
            break;
          case 'CIRCUIT_OPEN':
            sendPageDutyAlert(`🚨 Circuit breaker opened: ${alert.message}`);
            break;
          case 'POISON_MESSAGE':
            sendEmailAlert(`☠️ Poison message detected: ${alert.message}`);
            break;
        }
      },
    },
  },
};
```

### Poison Message Detection

Automatically detect and handle messages that consistently fail:

```typescript
const config = {
  storage: { type: StorageType.MEMORY },
  failureHandling: {
    strategy: FailureStrategy.RETRY_AND_DLQ,
    poisonMessageThreshold: 5, // Mark as poison after 5 attempts
    monitoring: {
      enabled: true,
      alertingEnabled: true,
      alertHandler: (alert) => {
        if (alert.alertType === 'POISON_MESSAGE') {
          // Quarantine the message
          quarantineMessage(alert.workflowId, alert.nodeId);
        }
      },
    },
  },
};
```

### Failure Metrics

Access detailed failure metrics for monitoring and debugging:

```typescript
// Get metrics for specific workflow/node
const metrics = flows.getFailureMetrics('workflow-id', 'node-id');

console.log('Failure Rate:', metrics[0].failureRate);
console.log('Total Executions:', metrics[0].totalExecutions);
console.log('Failures by Type:', metrics[0].failuresByType);
console.log('Circuit Breaker Opens:', metrics[0].circuitOpenCount);
console.log('Dead Letter Items:', metrics[0].deadLetterCount);
```

### Node-Level Configuration

Override global settings for individual nodes:

```typescript
const workflow = createWorkflow('mixed-strategies', 'Mixed Strategies Example', [
  {
    id: 'critical-payment',
    type: 'payment-service',
    inputs: { amount: 100 },
    dependencies: [],
    failureHandling: {
      strategy: FailureStrategy.FAIL_FAST, // Critical - must succeed
    },
  },
  {
    id: 'optional-analytics',
    type: 'analytics-service',
    inputs: { event: 'payment_completed' },
    dependencies: ['critical-payment'],
    failureHandling: {
      strategy: FailureStrategy.RETRY_AND_SKIP, // Optional - can skip
    },
  },
  {
    id: 'user-notification',
    type: 'email-service',
    inputs: { template: 'payment-confirmation' },
    dependencies: ['critical-payment'],
    failureHandling: {
      strategy: FailureStrategy.RETRY_AND_DLQ, // Important - retry later
      deadLetter: { enabled: true, maxRetries: 5 },
    },
  },
]);
```

### Enterprise Configuration Example

Complete production-ready configuration:

```typescript
const config: FlowsConfig = {
  storage: { 
    type: StorageType.REMOTE,
    config: {
      baseUrl: 'https://api.company.com',
      apiKey: process.env.API_KEY,
      timeout: 10000,
    },
  },
  failureHandling: {
    strategy: FailureStrategy.CIRCUIT_BREAKER,
    circuitBreaker: {
      failureThreshold: 5,
      timeWindow: 300000,      // 5 minutes
      recoveryTimeout: 120000, // 2 minutes  
      successThreshold: 3,
    },
    deadLetter: {
      enabled: true,
      maxRetries: 3,
      retentionPeriod: 86400000, // 24 hours
      storage: 'persistent',
    },
    monitoring: {
      enabled: true,
      failureRateThreshold: 10,
      alertingEnabled: true,
      metricsCollectionInterval: 30000,
      retentionPeriod: 2592000000, // 30 days
      alertHandler: integrateWithPagerDuty,
    },
    poisonMessageThreshold: 8,
  },
  security: {
    validateNodes: true,
    allowedNodeTypes: ['http-request', 'database-query', 'cache-lookup'],
    maxExecutionTime: 300000,
  },
  logging: {
    level: 'info',
    handler: (message, level) => {
      logger.log(level, message);
    },
  },
};
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
- **`FailureManager`**: Comprehensive failure handling and monitoring
- **Storage Adapters**: `MemoryStorageAdapter`, `LocalStorageAdapter`, `RemoteStorageAdapter`

### Utility Functions

- **`createFlows(config)`**: Factory function to create a configured workflow executor
- **`createWorkflow(id, name, nodes, options)`**: Helper to create workflow definitions
- **`createEvent(type, data, nodeId)`**: Helper to create workflow events

### Failure Handling Methods

#### WorkflowExecutor Methods
- **`getFailureMetrics(workflowId, nodeId?)`**: Get failure metrics for monitoring
- **`getDeadLetterQueue(workflowId)`**: Access dead letter queue items
- **`retryDeadLetterItem(workflowId, itemId)`**: Retry a specific failed item
- **`dispose()`**: Clean up resources and stop monitoring

#### FailureManager Methods
- **`shouldExecuteNode(node, nodeState, workflowState)`**: Check if node can execute
- **`handleNodeFailure(node, nodeState, workflowState, error)`**: Process node failures
- **`handleNodeSuccess(node, nodeState, workflowState)`**: Process node successes
- **`calculateRetryDelay(baseDelay, attempt, backoffMultiplier, maxDelay, useJitter)`**: Calculate retry delays

### Configuration Types

#### FailureHandlingConfig
```typescript
interface FailureHandlingConfig {
  strategy: FailureStrategy;
  circuitBreaker?: CircuitBreakerConfig;
  deadLetter?: DeadLetterConfig;
  monitoring?: FailureMonitoringConfig;
  poisonMessageThreshold?: number;
  gracefulDegradationConfig?: {
    continueOnNodeFailure?: boolean;
    skipDependentNodes?: boolean;
    fallbackResults?: Record<NodeId, unknown>;
  };
}
```

#### Enhanced RetryConfig
```typescript
interface RetryConfig {
  maxAttempts: number;
  delay: number;
  backoffMultiplier?: number;
  maxDelay?: number;
  retryableErrors?: string[];     // Specific errors to retry
  nonRetryableErrors?: string[];  // Errors that should not be retried
  jitter?: boolean;              // Add randomization to delays
}
```

### Enums

#### FailureStrategy
```typescript
enum FailureStrategy {
  FAIL_FAST = 'fail_fast',
  RETRY_AND_FAIL = 'retry_and_fail',
  RETRY_AND_DLQ = 'retry_and_dlq',
  RETRY_AND_SKIP = 'retry_and_skip',
  CIRCUIT_BREAKER = 'circuit_breaker',
  GRACEFUL_DEGRADATION = 'graceful_degradation',
}
```

#### FailureType
```typescript
enum FailureType {
  TRANSIENT = 'transient',       // Network, timeout errors
  PERMANENT = 'permanent',       // Validation, logic errors
  POISON = 'poison',            // Consistently failing messages
  DEPENDENCY = 'dependency',     // External service failures
  RESOURCE = 'resource',        // Memory, quota limitations
  SECURITY = 'security',        // Authentication, permissions
}
```

#### CircuitState
```typescript
enum CircuitState {
  CLOSED = 'closed',         // Normal operation
  OPEN = 'open',            // Circuit is open, requests fail fast
  HALF_OPEN = 'half_open',  // Testing if service recovered
}
```

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