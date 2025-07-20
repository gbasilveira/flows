# Flows Examples

This directory contains comprehensive examples demonstrating various features and capabilities of the Flows workflow engine. Each example is designed to be executable standalone and showcases different aspects of the library.

## Available Examples

### 1. Simple Workflow (`simple-workflow.ts`)

**Purpose**: Demonstrates basic workflow creation, execution, and event handling.

**Key Features**:
- Basic node types (`data`, `delay`)
- Event-driven workflow execution
- Asynchronous event handling
- Simple workflow state management

**What it demonstrates**:
- Creating a workflow with dependencies
- Using delay nodes for timing
- Waiting for external events
- Event emission and handling

**Run it**:
```bash
npx tsx src/examples/simple-workflow.ts
# or
npx tsc src/examples/simple-workflow.ts --outDir dist-temp --module commonjs --target es2020 --moduleResolution node --esModuleInterop --skipLibCheck && node dist-temp/examples/simple-workflow.js
```

### 2. Subflow Example (`subflow-example.ts`)

**Purpose**: Showcases modular workflow design using subflows for reusable workflow components.

**Key Features**:
- Modular workflow design
- Subflow creation and registration
- Workflow composition
- Enhanced node executor
- Recursive workflow patterns

**What it demonstrates**:
- Creating reusable workflow modules
- User validation workflows
- Payment processing workflows
- Notification systems
- E-commerce order processing pipeline
- Recursive data processing

**Run it**:
```bash
npx tsx src/examples/subflow-example.ts
# or
npx tsc src/examples/subflow-example.ts --outDir dist-temp --module commonjs --target es2020 --moduleResolution node --esModuleInterop --skipLibCheck && node dist-temp/examples/subflow-example.js
```

### 3. Failure Handling Examples (`failure-examples.ts`)

**Purpose**: Comprehensive demonstration of enterprise-grade failure handling strategies.

**Key Features**:
- Six different failure strategies
- Circuit breaker patterns
- Dead letter queue management
- Poison message detection
- Real-time monitoring and alerting
- Node-level configuration overrides

**What it demonstrates**:
- Fail fast strategy
- Retry and DLQ patterns
- Circuit breaker implementation
- Graceful degradation
- Enterprise configuration
- Failure metrics and monitoring

**Run it**:
```bash
npx tsx src/examples/failure-examples.ts
# or
npx tsc src/examples/failure-examples.ts --outDir dist-temp --module commonjs --target es2020 --moduleResolution node --esModuleInterop --skipLibCheck && node dist-temp/examples/failure-examples.js
```

## Example Standards and Guidelines

When creating new examples, follow these established patterns and standards:

### File Structure

```typescript
/**
 * Brief description of what this example demonstrates
 */
import {
  // Import required types and functions from '../index.js'
} from '../index.js';

// ================================
// 1. Configuration Section
// ================================
// Define FlowsConfig and any setup

// ================================
// 2. Workflow Definitions
// ================================
// Define your workflows, nodes, and related functions

// ================================
// 3. Example Functions
// ================================
// Create specific example functions that can be exported

export async function runExampleName() {
  // Your example logic here
}

// ================================
// 4. Main Execution Block (REQUIRED)
// ================================

// This block will run when the file is executed directly
async function main() {
  console.log('🎯 Starting [Example Name]...\n');
  
  try {
    await runExampleName();
    console.log('\n✨ [Example name] completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('\n💥 [Example name] failed:', error);
    process.exit(1);
  }
}

// Check if this file is being run directly
if (require.main === module) {
  main().catch((error) => {
    console.error('Unhandled error:', error);
    process.exit(1);
  });
}
```

### Import Standards

- Always import from `'../index.js'` (not `.ts`)
- Use TypeScript `type` imports for types: `type FlowsConfig`
- Import only what you need to keep examples focused

### Naming Conventions

- **Files**: Use kebab-case: `my-feature-example.ts`
- **Functions**: Use camelCase: `runMyFeatureExample()`
- **Workflows**: Use kebab-case IDs: `'my-feature-workflow'`
- **Nodes**: Use kebab-case IDs: `'process-data'`

### Console Output Standards

- Use emojis for visual appeal and clarity
- Start messages: `🎯 Starting [Example Name]...`
- Success messages: `✨ [Example name] completed successfully!`
- Error messages: `💥 [Example name] failed:`
- Section headers: Use emojis like `📋`, `🚀`, `⚡`, `🔧`

### Error Handling

All examples must include:

```typescript
async function main() {
  console.log('🎯 Starting [Example Name]...\n');
  
  try {
    await runExampleName();
    console.log('\n✨ [Example name] completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('\n💥 [Example name] failed:', error);
    process.exit(1);
  }
}

if (require.main === module) {
  main().catch((error) => {
    console.error('Unhandled error:', error);
    process.exit(1);
  });
}
```

### Documentation Requirements

Each example file should include:

1. **Header comment**: Brief description of the example's purpose
2. **Section comments**: Clear section dividers using `// ================================`
3. **Function documentation**: JSDoc comments for exported functions
4. **Inline comments**: Explain complex logic or important concepts

### Testing Requirements

Before submitting a new example:

1. **Test with tsx**: `npx tsx src/examples/your-example.ts`
2. **Test with tsc**: Compile and run the JavaScript version
3. **Verify error handling**: Test failure scenarios
4. **Check output**: Ensure console output is clear and helpful

### Example Categories

Organise examples into these categories:

- **Basic**: Simple workflow patterns (`simple-workflow.ts`)
- **Advanced**: Complex patterns like subflows (`subflow-example.ts`)
- **Enterprise**: Production features (`failure-examples.ts`)
- **Integration**: External service examples
- **Performance**: Optimisation and monitoring examples

### Configuration Patterns

Use consistent configuration patterns:

```typescript
const config: FlowsConfig = {
  storage: {
    type: StorageType.MEMORY, // Use MEMORY for examples unless testing persistence
  },
  logging: {
    level: 'info',
  },
  // Add other configuration as needed for the example
};
```

### Workflow Patterns

Follow these patterns for workflow creation:

```typescript
const workflow = createWorkflow(
  'example-workflow-id',
  'Human Readable Workflow Name',
  nodes,
  {
    description: 'Clear description of what this workflow does',
    version: '1.0.0',
  }
);
```

### Node Patterns

Create nodes with clear, descriptive properties:

```typescript
{
  id: 'descriptive-node-id',
  type: 'node-type',
  name: 'Human Readable Node Name',
  inputs: { /* clear input structure */ },
  dependencies: ['parent-node-id'],
  // Add other properties as needed
}
```

## Running Examples

### Method 1: Using tsx (Recommended)

```bash
npx tsx src/examples/[example-name].ts
```

**Advantages**:
- Faster execution
- No compilation step
- Better development experience

### Method 2: Using TypeScript Compiler

```bash
npx tsc src/examples/[example-name].ts --outDir dist-temp --module commonjs --target es2020 --moduleResolution node --esModuleInterop --skipLibCheck
node dist-temp/examples/[example-name].js
rm -rf dist-temp
```

**Advantages**:
- Tests TypeScript compilation
- Produces distributable JavaScript
- Validates import/export compatibility

## Contributing New Examples

1. **Choose a focus**: Pick a specific feature or use case
2. **Follow the standards**: Use the established file structure and patterns
3. **Test thoroughly**: Verify both execution methods work
4. **Document clearly**: Add comprehensive comments and documentation
5. **Update this README**: Add your example to the "Available Examples" section

### Example Ideas

Consider creating examples for:

- **Database Integration**: Connecting to databases
- **HTTP API Workflows**: REST API integration patterns
- **Real-time Processing**: WebSocket and streaming data
- **Batch Processing**: Large dataset processing
- **Microservices**: Service orchestration patterns
- **Authentication**: User authentication workflows
- **File Processing**: File upload and processing workflows
- **Monitoring**: Custom metrics and alerting
- **Testing**: Workflow testing patterns

## Best Practices

1. **Keep examples focused**: Each example should demonstrate one main concept
2. **Make them realistic**: Use real-world scenarios when possible
3. **Include error scenarios**: Show how failures are handled
4. **Provide context**: Explain why certain patterns are used
5. **Use meaningful data**: Avoid generic "foo", "bar" examples
6. **Show progression**: Start simple, then show advanced features
7. **Clean up resources**: Properly dispose of resources when needed

## Getting Help

If you need help creating examples:

1. Review existing examples for patterns
2. Check the main project README for API documentation
3. Look at the source code in `src/` for implementation details
4. Create an issue for questions or suggestions

---

**Note**: All examples are designed to work standalone and demonstrate specific aspects of the Flows library. They use mock data and simulated scenarios to focus on the workflow patterns rather than external dependencies. 