---
layout: home

hero:
  name: "Flows"
  text: "DAG Workflow Executor"
  tagline: "A stateful, secure, JavaScript-embedded DAG workflow executor designed for frontend applications"
  image:
    src: /logo.svg
    alt: Flows
  actions:
    - theme: brand
      text: Get Started
      link: /guide/getting-started
    - theme: alt
      text: View on GitHub
      link: https://github.com/your-org/flows

features:
  - icon: 🔄
    title: DAG Workflow Execution
    details: Execute complex workflows with dependencies and parallel processing capabilities.
    
  - icon: 💾
    title: Flexible State Persistence
    details: Support for memory, localStorage, and remote API storage with seamless switching.
    
  - icon: ⚡
    title: Asynchronous Event Handling
    details: Nodes can wait for external events before continuing, enabling reactive workflows.
    
  - icon: 🌐
    title: Frontend Compatible
    details: Designed specifically to run in browser environments with zero backend dependencies.
    
  - icon: 🛡️
    title: Secure by Design
    details: Built-in validation, security features, and configurable node type restrictions.
    
  - icon: 📝
    title: TypeScript Support
    details: Full TypeScript definitions included with excellent IDE support and type safety.
    
  - icon: ⚙️
    title: Highly Configurable
    details: Extensive configuration options for storage, security, logging, and failure handling.
    
  - icon: 🚨
    title: Enterprise-Grade Failure Handling
    details: Circuit breaker, dead letter queue, poison message detection, and graceful degradation.
    
  - icon: 📊
    title: Real-time Monitoring
    details: Comprehensive failure metrics, alerting capabilities, and performance tracking.
    
  - icon: 🔧
    title: Production Ready
    details: Battle-tested reliability patterns with enterprise-grade monitoring and alerting.
---

## Quick Example

```typescript
import { createFlows, createWorkflow, StorageType } from 'flows';

// Configure the workflow engine
const config = {
  storage: {
    type: StorageType.MEMORY,
  },
  logging: {
    level: 'info',
  },
};

// Create the workflow executor
const flows = createFlows(config);

// Define your workflow
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

// Execute the workflow
const result = await flows.startWorkflow(workflow);
console.log('Workflow completed:', result);
```

## Why Flows?

Flows addresses the unique challenges of building complex, stateful workflows in frontend applications:

- **No Backend Required**: Run sophisticated workflows entirely in the browser
- **State Persistence**: Workflows survive page reloads and can be resumed
- **Event-Driven**: React to user interactions, API responses, or external events
- **Failure Resilience**: Comprehensive error handling and recovery strategies
- **Developer Experience**: TypeScript support, great tooling, and clear APIs

## What Makes It Different?

Unlike server-side workflow engines, Flows is built specifically for frontend applications:

- **Lightweight**: Small bundle size optimised for browsers
- **Storage Flexibility**: Works with localStorage, remote APIs, or in-memory
- **Frontend Events**: Seamlessly integrate with DOM events, user interactions
- **Security**: Browser-friendly security model with configurable restrictions
- **Performance**: Optimised for UI responsiveness and user experience

## Enterprise Features

Flows includes enterprise-grade features typically found only in server-side solutions:

- **Circuit Breaker Pattern**: Prevent cascading failures
- **Dead Letter Queue**: Handle and retry failed operations
- **Poison Message Detection**: Automatically quarantine problematic workflows
- **Real-time Monitoring**: Comprehensive metrics and alerting
- **Graceful Degradation**: Continue operating with reduced functionality

## Get Started in Minutes

1. **Install**: `npm install flows`
2. **Configure**: Choose your storage and options
3. **Create**: Define your workflow with simple JavaScript objects
4. **Execute**: Start your workflow and handle results

[Get Started →](/guide/getting-started)

## Community & Support

- 🐛 [Report Issues](https://github.com/your-org/flows/issues)
- 💬 [Join Discussions](https://github.com/your-org/flows/discussions)
- 📖 [Read the Docs](/guide/getting-started)
- ⭐ [Star on GitHub](https://github.com/your-org/flows) 