# Flows

A stateful, secure, JavaScript-embedded DAG (Directed Acyclic Graph) workflow executor designed for frontend applications.

## 📚 Documentation

**Complete documentation is available at: [Flows Documentation](./docs/)**

- 🚀 **[Quick Start](./docs/guide/quick-start.md)** - Get up and running in minutes
- 📖 **[User Guide](./docs/guide/introduction.md)** - Comprehensive guides and tutorials  
- 🔧 **[API Reference](./docs/api/core.md)** - Complete API documentation
- 💡 **[Examples](./docs/examples/)** - Real-world examples and patterns

### Running the Documentation

```bash
# Install documentation dependencies
pnpm docs:install

# Start development server
pnpm docs:dev

# Build for production
pnpm docs:build
```

The documentation includes:
- Interactive examples you can run locally
- Comprehensive API reference
- Real-world use cases and patterns
- Production deployment guides
- Enterprise configuration examples

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

**👉 For more detailed examples and tutorials, see our [comprehensive documentation](./docs/)**

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

# Run the comprehensive handlers example (NEW!)
npx tsx src/examples/comprehensive-handlers-example.ts
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
- **`custom-handlers-example.ts`**: Creating custom node handlers for new node types
- **`plugin-system-example.ts`**: Using the plugin system for extensible node handlers
- **`comprehensive-handlers-example.ts`**: ✨ **NEW!** Demonstrates all built-in handlers (logical, math, string, conditional, merge operations)

Each example includes detailed comments explaining the concepts and can be run independently.

**📚 For detailed example documentation and explanations, visit [Examples Documentation](./docs/examples/)**

## Key Concepts

### DAG Workflow Execution
Flows uses Directed Acyclic Graphs to represent workflows, ensuring:
- **Predictable execution order** through dependencies
- **Parallel processing** of independent nodes  
- **No circular dependencies** preventing infinite loops
- **Visual workflow representation** for easy understanding

### Node Executors

Node Executors define how different node types are processed. Flows provides a unified executor with flexible configuration:

**DefaultNodeExecutor** - Unified executor for all workflows:
```typescript
import { createFlows, DefaultNodeExecutor } from 'flows';

// Basic usage (subflows disabled by default in createFlows)
const flows = createFlows(config);

// Manual setup with custom options
const executor = new DefaultNodeExecutor({
  enableSubflows: false,  // Lightweight mode
  customExecutor: myCustomExecutor,
});
const flows = createFlows(config, executor);
```

**With Subflow Support** - Enable advanced workflow composition:
```typescript
import { createFlowsWithSubflows } from 'flows/utils/subflow-utils';

// Option 1: Utility function (recommended)
const flows = createFlowsWithSubflows({
  ...config,
  subflow: {
    maxDepth: 5,
    preregisteredWorkflows: [subWorkflow1, subWorkflow2],
  },
});

// Option 2: Manual setup
const executor = new DefaultNodeExecutor({
  enableSubflows: true,
  maxSubflowDepth: 5,
});
const flows = createFlows(config, executor);
```

**Built-in Node Types & Handlers**:

#### Core Handlers (Always Available)
- **`data`** - Pass-through nodes that merge inputs (handled by `DataHandler`)
- **`delay`** - Nodes that wait for a specified duration (handled by `DelayHandler`)
- **`subflow`** - Nodes that execute other workflows (handled by `SubflowHandler`, requires `enableSubflows: true`)

#### ✨ Built-in Operation Handlers (via Plugins)

**Logical Operations**:
- **`logic-and`** - Boolean AND operation on multiple values
- **`logic-or`** - Boolean OR operation on multiple values  
- **`logic-not`** - Boolean NOT operation on a single value
- **`logic-xor`** - Boolean XOR operation on two values

**Mathematical Operations**:
- **`math-add`** - Addition of multiple numbers
- **`math-subtract`** - Subtraction with multiple operands
- **`math-multiply`** - Multiplication of multiple numbers
- **`math-divide`** - Division of two numbers (with zero-division protection)
- **`math-power`** - Exponentiation (base^exponent)
- **`math-modulo`** - Modulo operation (remainder after division)

**String Manipulation**:
- **`string-concat`** - Concatenate multiple strings with optional separator
- **`string-substring`** - Extract substring using start/end positions
- **`string-replace`** - Replace text with regex support and global options
- **`string-match`** - Match text against regex patterns
- **`string-split`** - Split string into array using delimiter
- **`string-compare`** - Compare strings with case-sensitivity options
- **`string-length`** - Get string length
- **`string-case`** - Transform case (upper, lower, title, sentence)

**Flow Control**:
- **`condition`** - Conditional execution with multiple condition types:
  - `simple` - Basic boolean evaluation
  - `compare` - Value comparison with operators (===, >, <, contains, etc.)
  - `exists` - Check if values are defined, empty, or truthy
  - `range` - Check if numbers fall within specified ranges
- **`merge-all`** - Wait for all dependencies to succeed before proceeding
- **`merge-any`** - Proceed when any dependency succeeds
- **`merge-majority`** - Proceed when majority of dependencies succeed
- **`merge-count`** - Proceed when specific number of dependencies succeed

**Console Operations**:
- **`console-log`** - Output messages to console.log with optional data and formatting
- **`console-error`** - Output error messages to console.error with optional data and formatting
- **`console-warn`** - Output warning messages to console.warn with optional data and formatting
- **`console-info`** - Output informational messages to console.info with optional data and formatting
- **`console-debug`** - Output debug messages to console.debug with optional data and formatting
- **`console-table`** - Display tabular data in the console using console.table
- **`console-time`** - Start a timer for performance measurement using console.time
- **`console-timeend`** - End a timer and display elapsed time using console.timeEnd
- **`console-group`** - Create a collapsible group in the console using console.group
- **`console-groupend`** - End a console group using console.groupEnd
- **`console-clear`** - Clear the console using console.clear
- **`console-trace`** - Output a stack trace using console.trace
- **`console-count`** - Count the number of times this node is executed using console.count
- **`console-countreset`** - Reset a counter using console.countReset

**Using Built-in Operations**:
```typescript
import { createFlows, DefaultNodeExecutor, allBuiltInPlugins } from 'flows';

// Enable all built-in operations
const executor = new DefaultNodeExecutor({
  enableSubflows: false,
  plugins: allBuiltInPlugins, // Includes all logical, math, string, flow control, and console handlers
});

const flows = createFlows(config, executor);

// Or enable specific categories
import { logicalPlugins, mathPlugins, stringPlugins, flowControlPlugins, allConsolePlugins } from 'flows';

const executor = new DefaultNodeExecutor({
  plugins: [...logicalPlugins, ...mathPlugins, ...stringPlugins, ...allConsolePlugins],
});
```

**Example Usage**:
```typescript
const workflow = createWorkflow('calculation-example', 'Mathematical Workflow', [
  {
    id: 'input-numbers',
    type: 'data',
    inputs: { values: [10, 20, 30] },
    dependencies: [],
  },
  {
    id: 'log-start',
    type: 'console-log',
    inputs: { 
      message: 'Starting calculation',
      data: { values: [10, 20, 30] },
      options: { timestamp: true, prefix: '[CALC]' }
    },
    dependencies: ['input-numbers'],
  },
  {
    id: 'sum-values',
    type: 'math-add',
    inputs: { values: [10, 20, 30] }, // Result: 60
    dependencies: ['log-start'],
  },
  {
    id: 'log-result',
    type: 'console-info',
    inputs: { 
      message: 'Calculation completed',
      data: { result: 60 },
      options: { timestamp: true, prefix: '[RESULT]' }
    },
    dependencies: ['sum-values'],
  },
  {
    id: 'format-result',
    type: 'string-concat',
    inputs: { 
      values: ['Total: £', '60'],
      separator: ''
    }, // Result: 'Total: £60'
    dependencies: ['log-result'],
  },
  {
    id: 'check-threshold',
    type: 'condition',
    inputs: {
      conditionType: 'compare',
      left: 60,
      right: 50,
      operator: '>',
      thenValue: 'High value',
      elseValue: 'Normal value'
    }, // Result: 'High value'
    dependencies: ['format-result'],
  },
]);
```

**Handler Architecture**:
```typescript
// Core handlers are always available
const executor = new DefaultNodeExecutor({
  enableSubflows: true,
  maxSubflowDepth: 5,
});

// Plugin system for extensibility
import { PluginRegistry, type HandlerPlugin } from 'flows';

// Create plugins for custom node types
const httpPlugin: HandlerPlugin = {
  nodeType: 'http-request',
  handler: {
    async execute(node, context, inputs) {
      const response = await fetch(node.inputs.url, {
        method: node.inputs.method || 'GET',
        headers: node.inputs.headers,
      });
      return response.json();
    },
  },
  metadata: {
    name: 'HTTP Request Plugin',
    version: '1.0.0',
  },
};

// Register plugins during creation or after
const executor = new DefaultNodeExecutor({
  plugins: [httpPlugin, ...allBuiltInPlugins],
  allowCustomHandlers: true, // default: true
});

// Or register dynamically
executor.registerPlugin(httpPlugin);
```

**Plugin System Benefits**:
- ✅ **Core handlers always available** - `data` and `delay` never need configuration
- ✅ **Built-in operations** - Rich set of logical, math, string, and flow control operations
- ✅ **Extensible** - Add custom node types without modifying core code
- ✅ **Secure** - Cannot override built-in handlers
- ✅ **Configurable** - Can disable custom handlers entirely
- ✅ **Metadata support** - Plugins include version and description info

**Custom Node Executors**:
```typescript
class MyCustomExecutor implements NodeExecutor {
  async execute(node, context, inputs) {
    switch (node.type) {
      case 'http-request':
        return this.makeHttpRequest(node, inputs);
      case 'email':
        return this.sendEmail(node, inputs);
      default:
        throw new Error(`Unknown node type: ${node.type}`);
    }
  }
}

const executor = new DefaultNodeExecutor({
  customExecutor: new MyCustomExecutor(),
});
const flows = createFlows(config, executor);
```

**🔧 For complete node executor guide, see [Node Executors Documentation](./docs/guide/node-executors.md)**

### Storage Options

Choose the storage option that fits your needs:

**Memory Storage** - Fast, for development:
```typescript
const config = {
  storage: { type: StorageType.MEMORY },
};
```

**LocalStorage** - Persists in browser:
```typescript
const config = {
  storage: {
    type: StorageType.LOCAL_STORAGE,
    config: { keyPrefix: 'my_app_flows_' }
  },
};
```

**Remote API Storage** - Server-side persistence:
```typescript
const config = {
  storage: {
    type: StorageType.REMOTE,
    config: {
      baseUrl: 'https://api.example.com',
      apiKey: 'your-api-key',
    }
  },
};
```

**🔧 For complete storage configuration guide, see [Storage Documentation](./docs/guide/storage.md)**

### Event-Driven Workflows

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

**⚡ For complete event system guide, see [Events Documentation](./docs/guide/events.md)**

### Enterprise-Grade Failure Handling

Flows provides multiple failure handling strategies:

#### Circuit Breaker Pattern
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

#### Dead Letter Queue
```typescript
const config = {
  failureHandling: {
    strategy: FailureStrategy.RETRY_AND_DLQ,
    deadLetter: {
      enabled: true,
      maxRetries: 3,
      retentionPeriod: 3600000, // 1 hour
    },
  },
};
```

**🛡️ For comprehensive failure handling guide, see [Failure Handling Documentation](./docs/guide/failure-handling.md)**

## Development & Contributing

### Building the Project

```bash
# Install dependencies
pnpm install

# Build the library
pnpm build

# Run tests
pnpm test

# Lint code
pnpm lint

# Format code  
pnpm format
```

### Documentation Development

```bash
# Install docs dependencies
pnpm docs:install

# Start docs dev server
pnpm docs:dev

# Build documentation
pnpm docs:build

# Preview docs build
pnpm docs:preview
```

### Testing

```bash
# Run all tests
pnpm test

# Run tests with UI
pnpm test:ui

# Type checking
pnpm type-check
```

## API Overview

### Core Classes
- **`WorkflowExecutor`**: Main workflow execution engine
- **`WorkflowEventSystem`**: Event handling system
- **`FailureManager`**: Comprehensive failure handling and monitoring
- **Storage Adapters**: `MemoryStorageAdapter`, `LocalStorageAdapter`, `RemoteStorageAdapter`

### Utility Functions
- **`createFlows(config)`**: Factory function to create a configured workflow executor
- **`createWorkflow(id, name, nodes, options)`**: Helper to create workflow definitions
- **`createEvent(type, data, nodeId)`**: Helper to create workflow events

**🔧 For complete API documentation, see [API Reference](./docs/api/core.md)**

## Use Cases

Flows is perfect for:

✅ **Multi-step user processes** (onboarding, checkout, forms)  
✅ **Complex business workflows** (approval processes, data validation)  
✅ **Event-driven applications** (real-time updates, user interactions)  
✅ **Applications requiring persistence** (survive page reloads, resume later)  
✅ **Enterprise applications** (requiring monitoring, failure handling)  
✅ **Microservice orchestration** (coordinating frontend API calls)  
✅ **Data processing pipelines** (ETL, calculations, transformations)
✅ **Form wizards with conditional logic** (dynamic step progression)
✅ **Content management workflows** (approval chains, publishing)

## Why Choose Flows?

### Frontend-First Design
Unlike server-side workflow engines, Flows is built specifically for frontend applications:

- **Lightweight**: Small bundle size optimised for browsers
- **Zero Backend Dependencies**: Run sophisticated workflows entirely in the browser
- **State Persistence**: Workflows survive page reloads and can be resumed
- **Event Integration**: Seamlessly integrate with DOM events and user interactions

### Enterprise Features
- **Circuit Breaker Pattern**: Prevent cascading failures
- **Dead Letter Queue**: Handle and retry failed operations automatically  
- **Poison Message Detection**: Automatically quarantine problematic workflows
- **Real-time Monitoring**: Comprehensive metrics and alerting
- **Graceful Degradation**: Continue operating with reduced functionality

### Developer Experience
- **TypeScript Support**: Full type definitions and IDE support
- **Declarative Workflows**: Define workflows as simple JavaScript objects
- **Rich Built-in Operations**: Logical, mathematical, string, and flow control operations out of the box
- **Extensible Plugin System**: Add custom node types easily
- **Comprehensive Documentation**: Guides, examples, and API reference
- **Testable**: Easy to unit test individual nodes and workflows

**📖 For complete feature documentation and guides, visit [Flows Documentation](./docs/)**

## Contributing

Contributions are welcome! Please read our [contributing guidelines](./docs/CONTRIBUTING.md) and submit pull requests to our repository.

## Licence

This project is licensed under the ISC Licence - see the [LICENSE](./LICENSE) file for details.

---

**📚 Ready to get started? Check out the [complete documentation](./docs/) for guides, examples, and API reference!** 