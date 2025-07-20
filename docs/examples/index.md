# Examples

Welcome to the Flows examples collection! This section contains comprehensive, runnable examples that demonstrate various features and patterns for building workflows with Flows.

## Overview

Each example is designed to be:
- **Executable**: Run directly with `npx tsx` or compile and run
- **Educational**: Clearly commented and documented
- **Practical**: Based on real-world use cases
- **Progressive**: Building from simple to advanced concepts

## Quick Start with Examples

### Running Examples

Choose your preferred method:

::: code-group

```bash [tsx (Recommended)]
# Clone or download the project
git clone https://github.com/your-org/flows.git
cd flows

# Install dependencies
pnpm install

# Run any example directly
npx tsx src/examples/simple-workflow.ts
npx tsx src/examples/subflow-example.ts
npx tsx src/examples/failure-examples.ts
```

```bash [TypeScript Compiler]
# Compile and run
npx tsc src/examples/simple-workflow.ts --outDir dist-temp --module commonjs --target es2020 --moduleResolution node --esModuleInterop --skipLibCheck

# Execute
node dist-temp/examples/simple-workflow.js

# Clean up
rm -rf dist-temp
```

:::

## Available Examples

### 🚀 [Simple Workflow](./simple-workflow.md)

**Perfect for**: First-time users, basic workflow concepts

```typescript
// Basic workflow with dependencies and events
const workflow = createWorkflow('simple', 'Simple Example', [
  { id: 'start', type: 'data', inputs: { message: 'Hello!' }, dependencies: [] },
  { id: 'process', type: 'data', inputs: { processed: true }, dependencies: ['start'] },
]);
```

**What you'll learn**:
- Creating basic workflows
- Node dependencies
- Event handling
- Workflow execution

**Run it**: `npx tsx src/examples/simple-workflow.ts`

---

### 🧩 [Subflow Patterns](./subflow-patterns.md)

**Perfect for**: Modular design, reusable components

```typescript
// Modular workflows with subflows
const userValidation = createSubflow('user-validation', [
  { id: 'validate-email', type: 'validation' },
  { id: 'check-exists', type: 'database-check' },
]);

const mainWorkflow = createWorkflow('registration', 'User Registration', [
  { id: 'validate', type: 'subflow', subflow: userValidation },
  { id: 'create-user', type: 'database-create', dependencies: ['validate'] },
]);
```

**What you'll learn**:
- Modular workflow design
- Reusable subflows
- Complex workflow composition
- Enterprise patterns

**Run it**: `npx tsx src/examples/subflow-example.ts`

---

### 🛡️ [Failure Handling](./failure-handling.md)

**Perfect for**: Production resilience, error handling

```typescript
// Enterprise-grade failure handling
const config = {
  failureHandling: {
    strategy: FailureStrategy.CIRCUIT_BREAKER,
    deadLetter: { enabled: true },
    monitoring: { alertingEnabled: true },
  },
};
```

**What you'll learn**:
- Six failure handling strategies
- Circuit breaker patterns
- Dead letter queues
- Monitoring and alerting
- Poison message detection

**Run it**: `npx tsx src/examples/failure-examples.ts`

---

### ⚡ [Event-Driven Workflows](./event-driven.md)

**Perfect for**: Reactive applications, user interactions

```typescript
// Event-driven workflow patterns
const workflow = createWorkflow('interactive', 'Interactive Process', [
  {
    id: 'wait-for-user',
    type: 'user-input',
    waitForEvents: ['user-action'],
    dependencies: [],
  },
  {
    id: 'process-action',
    type: 'process-user-action',
    dependencies: ['wait-for-user'],
  },
]);
```

**What you'll learn**:
- Event-driven architecture
- User interaction patterns
- Real-time workflows
- Event system integration

---

### 🔧 [Custom Node Executors](./custom-executors.md)

**Perfect for**: Extending Flows, custom business logic

```typescript
class CustomExecutor implements NodeExecutor {
  async execute(node, context, inputs) {
    switch (node.type) {
      case 'payment-processing':
        return this.processPayment(inputs);
      case 'email-service':
        return this.sendEmail(inputs);
      default:
        throw new Error(`Unknown node type: ${node.type}`);
    }
  }
}
```

**What you'll learn**:
- Creating custom node types
- Implementing business logic
- Integration patterns
- Advanced executor techniques

---

### 🏢 [Enterprise Patterns](./enterprise.md)

**Perfect for**: Production applications, scalability

```typescript
// Enterprise configuration example
const enterpriseConfig = {
  storage: { type: StorageType.REMOTE },
  failureHandling: {
    strategy: FailureStrategy.CIRCUIT_BREAKER,
    monitoring: { enabled: true },
  },
  security: { validateNodes: true },
};
```

**What you'll learn**:
- Production configuration
- Monitoring and metrics
- Security best practices
- Scalability patterns
- Performance optimization

## Example Categories

### By Complexity Level

#### 🌱 **Beginner**
- [Simple Workflow](./simple-workflow.md) - Basic concepts
- Basic event handling
- Simple node types

#### 🌿 **Intermediate**  
- [Event-Driven Workflows](./event-driven.md) - Reactive patterns
- [Custom Node Executors](./custom-executors.md) - Extensibility
- Storage configuration

#### 🌳 **Advanced**
- [Subflow Patterns](./subflow-patterns.md) - Modular design
- [Failure Handling](./failure-handling.md) - Production resilience
- [Enterprise Patterns](./enterprise.md) - Scalable architecture

### By Use Case

#### 📱 **Frontend Applications**
- User onboarding flows
- Form validation workflows
- UI state management
- Progressive enhancement

#### 🛒 **E-commerce**
- Checkout processes
- Order fulfillment
- Payment workflows
- Inventory management

#### 👥 **User Management**
- Registration processes
- Authentication flows
- Profile management
- Permission workflows

#### 📊 **Data Processing**
- ETL pipelines
- Validation workflows
- Aggregation processes
- Report generation

#### 🔗 **Integration**
- API orchestration
- Service coordination
- Event processing
- Message routing

## Interactive Learning Path

### 1. **Start Here** (5 minutes)
```bash
npx tsx src/examples/simple-workflow.ts
```
Learn basic workflow creation and execution.

### 2. **Add Complexity** (10 minutes)
```bash
npx tsx src/examples/event-driven.ts
```
Understand event-driven patterns.

### 3. **Build Resilience** (15 minutes)
```bash
npx tsx src/examples/failure-examples.ts
```
Master failure handling strategies.

### 4. **Go Modular** (20 minutes)
```bash
npx tsx src/examples/subflow-example.ts
```
Design modular, reusable workflows.

### 5. **Production Ready** (30 minutes)
```bash
npx tsx src/examples/enterprise.ts
```
Configure for production deployment.

## Example Structure

Each example follows a consistent structure:

```typescript
/**
 * Example: [Name]
 * 
 * Description: Brief description of what this example demonstrates
 * 
 * Key Features:
 * - Feature 1
 * - Feature 2
 * - Feature 3
 */

// ================================
// 1. Imports and Setup
// ================================
import { createFlows, createWorkflow } from '../index.js';

// ================================
// 2. Configuration
// ================================
const config = {
  // Example-specific configuration
};

// ================================
// 3. Workflow Definitions
// ================================
const workflow = createWorkflow(/* ... */);

// ================================
// 4. Custom Components (if needed)
// ================================
class CustomExecutor implements NodeExecutor {
  // Custom implementation
}

// ================================
// 5. Example Execution Function
// ================================
export async function runExampleName() {
  // Main example logic
}

// ================================
// 6. Main Execution (for direct running)
// ================================
async function main() {
  console.log('🎯 Starting [Example Name]...');
  
  try {
    await runExampleName();
    console.log('✨ Example completed successfully!');
  } catch (error) {
    console.error('💥 Example failed:', error);
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}
```

## Common Patterns

### Sequential Processing
```typescript
const sequential = [
  { id: 'step1', dependencies: [] },
  { id: 'step2', dependencies: ['step1'] },
  { id: 'step3', dependencies: ['step2'] },
];
```

### Parallel Processing
```typescript
const parallel = [
  { id: 'start', dependencies: [] },
  { id: 'task-a', dependencies: ['start'] },
  { id: 'task-b', dependencies: ['start'] },
  { id: 'task-c', dependencies: ['start'] },
  { id: 'combine', dependencies: ['task-a', 'task-b', 'task-c'] },
];
```

### Conditional Execution
```typescript
const conditional = [
  { id: 'check', type: 'condition', dependencies: [] },
  { id: 'path-a', dependencies: ['check'], condition: 'success' },
  { id: 'path-b', dependencies: ['check'], condition: 'failure' },
];
```

### Event-Driven Processing
```typescript
const eventDriven = [
  { id: 'wait', waitForEvents: ['user-action'], dependencies: [] },
  { id: 'react', dependencies: ['wait'] },
];
```

## Testing Examples

### Unit Testing Workflows
```typescript
import { describe, it, expect } from 'vitest';
import { runExampleName } from './example';

describe('Example Workflow', () => {
  it('should complete successfully', async () => {
    const result = await runExampleName();
    expect(result.status).toBe('completed');
  });

  it('should handle errors gracefully', async () => {
    // Test error scenarios
  });
});
```

### Integration Testing
```typescript
// Test with real storage and events
const integrationTest = async () => {
  const flows = createFlows({
    storage: { type: StorageType.LOCAL_STORAGE },
  });

  // Test complete workflow lifecycle
};
```

## Best Practices from Examples

### 1. **Error Handling**
Always include proper error handling in your examples:

```typescript
try {
  const result = await flows.startWorkflow(workflow);
  console.log('✅ Success:', result);
} catch (error) {
  console.error('❌ Failed:', error);
  throw error;
}
```

### 2. **Logging**
Use consistent, informative logging:

```typescript
console.log('🚀 Starting workflow...');
console.log('⏳ Processing data...');
console.log('✨ Completed successfully!');
```

### 3. **Configuration**
Make examples configurable:

```typescript
const config = {
  storage: { 
    type: process.env.STORAGE_TYPE || StorageType.MEMORY 
  },
  logging: { 
    level: process.env.LOG_LEVEL || 'info' 
  },
};
```

### 4. **Documentation**
Document your workflows:

```typescript
const workflow = createWorkflow(
  'user-onboarding',
  'Complete User Onboarding Process',
  nodes,
  {
    description: 'Handles user registration, validation, and welcome sequence',
    version: '2.1.0',
    author: 'Development Team',
  }
);
```

## Contributing Examples

Want to contribute your own examples? Here's how:

### 1. **Choose a Focus**
Pick a specific use case or feature to demonstrate.

### 2. **Follow the Structure**
Use the established example structure and patterns.

### 3. **Test Thoroughly**
Ensure your example runs in both `tsx` and compiled modes.

### 4. **Document Well**
Add comprehensive comments and documentation.

### 5. **Submit a PR**
Include your example in the documentation and link it here.

## Example Ideas

Looking for inspiration? Try building examples for:

- **Authentication Workflows**: Login, registration, password reset
- **E-commerce**: Shopping cart, checkout, order processing
- **Content Management**: Publishing workflows, approval processes
- **Data Pipelines**: ETL processes, data validation, transformation
- **Notification Systems**: Email campaigns, push notifications
- **File Processing**: Upload, validation, transformation, storage
- **API Integration**: Third-party service orchestration
- **Monitoring**: Health checks, metrics collection, alerting

## Getting Help

If you need help with examples:

- 📖 Check the [core concepts guide](../guide/core-concepts.md)
- 🐛 [Report issues](https://github.com/your-org/flows/issues)
- 💬 [Join discussions](https://github.com/your-org/flows/discussions)
- 💡 [Request new examples](https://github.com/your-org/flows/issues/new?template=example-request.md)

---

**Ready to explore?** Start with the [Simple Workflow](./simple-workflow.md) example, or jump directly to the [use case](#by-use-case) that interests you most! 🚀 