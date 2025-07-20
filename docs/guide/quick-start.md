# Quick Start

Get up and running with Flows in just a few minutes! This guide will walk you through creating and executing your first workflow.

## 30-Second Setup

Let's create a simple workflow that processes user data:

```typescript
import { createFlows, createWorkflow, StorageType } from 'flows';

// 1. Create a workflow executor
const flows = createFlows({
  storage: { type: StorageType.MEMORY },
  logging: { level: 'info' },
});

// 2. Define your workflow
const workflow = createWorkflow('data-processing', 'Process User Data', [
  {
    id: 'validate',
    type: 'data',
    inputs: { data: { name: 'John', email: 'john@example.com' } },
    dependencies: [],
  },
  {
    id: 'process',
    type: 'data', 
    inputs: { processed: true },
    dependencies: ['validate'],
  },
  {
    id: 'notify',
    type: 'data',
    inputs: { message: 'Processing complete!' },
    dependencies: ['process'],
  },
]);

// 3. Execute the workflow
const result = await flows.startWorkflow(workflow);
console.log('✅ Workflow completed:', result);
```

That's it! You've created and executed your first workflow. Let's break down what happened and build something more realistic.

## Understanding the Basic Structure

Every Flows workflow has three essential parts:

### 1. Configuration
```typescript
const config = {
  storage: { type: StorageType.MEMORY }, // Where to store workflow state
  logging: { level: 'info' },             // How much to log
};
```

### 2. Workflow Definition
```typescript
const workflow = createWorkflow(id, name, nodes, options);
```

### 3. Execution
```typescript
const result = await flows.startWorkflow(workflow);
```

## Building a Real-World Example

Let's create a more practical example: a user registration workflow.

### Step 1: Set Up the Configuration

```typescript
import { createFlows, createWorkflow, StorageType } from 'flows';

const flows = createFlows({
  storage: { 
    type: StorageType.LOCAL_STORAGE, // Persist across browser sessions
    config: { keyPrefix: 'my_app_' }
  },
  logging: { level: 'debug' },
  security: { validateNodes: true },
});
```

### Step 2: Define the Registration Workflow

```typescript
const registrationWorkflow = createWorkflow(
  'user-registration',
  'User Registration Process',
  [
    // Step 1: Collect user information
    {
      id: 'collect-info',
      type: 'user-input',
      name: 'Collect User Information',
      inputs: { 
        fields: ['name', 'email', 'password'],
        validation: { required: true }
      },
      dependencies: [],
      waitForEvents: ['form-submitted'], // Wait for user to submit form
    },

    // Step 2: Validate the information
    {
      id: 'validate-info',
      type: 'validation',
      name: 'Validate User Data',
      inputs: {
        rules: {
          email: 'email',
          password: { minLength: 8 },
          name: { required: true }
        }
      },
      dependencies: ['collect-info'],
      timeout: 5000, // 5 second timeout
    },

    // Step 3: Check if user already exists
    {
      id: 'check-existing',
      type: 'api-request',
      name: 'Check Existing User',
      inputs: {
        method: 'POST',
        url: '/api/users/check',
        body: { email: '${validate-info.email}' } // Reference previous node output
      },
      dependencies: ['validate-info'],
      retryConfig: {
        maxAttempts: 3,
        delay: 1000,
        backoffMultiplier: 2,
      },
    },

    // Step 4: Create user account
    {
      id: 'create-account',
      type: 'api-request',
      name: 'Create User Account',
      inputs: {
        method: 'POST',
        url: '/api/users/create',
        body: { 
          name: '${validate-info.name}',
          email: '${validate-info.email}',
          password: '${validate-info.password}'
        }
      },
      dependencies: ['check-existing'],
    },

    // Step 5: Send welcome email
    {
      id: 'send-welcome',
      type: 'email-service',
      name: 'Send Welcome Email',
      inputs: {
        template: 'welcome',
        to: '${validate-info.email}',
        variables: { name: '${validate-info.name}' }
      },
      dependencies: ['create-account'],
      // This node can fail without stopping the workflow
      failureHandling: { 
        strategy: 'retry-and-skip',
        maxRetries: 2 
      },
    },

    // Step 6: Log successful registration
    {
      id: 'log-success',
      type: 'analytics',
      name: 'Track Registration',
      inputs: {
        event: 'user-registered',
        userId: '${create-account.userId}',
        metadata: { source: 'web' }
      },
      dependencies: ['create-account'], // Doesn't depend on email
    },
  ],
  {
    description: 'Complete user registration with validation and notifications',
    version: '1.0.0',
    timeout: 300000, // 5 minute overall timeout
  }
);
```

### Step 3: Create Custom Node Executor

Since we're using custom node types, we need to define how they work:

```typescript
import { NodeExecutor, WorkflowNode } from 'flows';

class RegistrationNodeExecutor implements NodeExecutor {
  async execute(
    node: WorkflowNode,
    context: Record<string, unknown>,
    inputs: Record<string, unknown>
  ): Promise<unknown> {
    
    switch (node.type) {
      case 'user-input':
        // In a real app, this would show a form and wait for input
        return this.handleUserInput(node, inputs);
        
      case 'validation':
        return this.validateData(node, inputs, context);
        
      case 'api-request':
        return this.makeApiRequest(node, inputs);
        
      case 'email-service':
        return this.sendEmail(node, inputs);
        
      case 'analytics':
        return this.trackEvent(node, inputs);
        
      default:
        // Fall back to built-in data node
        return inputs;
    }
  }

  private async handleUserInput(node: WorkflowNode, inputs: any) {
    // Simulate user input collection
    console.log('📝 Collecting user input for:', inputs.fields);
    
    // In a real app, you'd integrate with your form system
    return {
      name: 'Jane Doe',
      email: 'jane@example.com',
      password: 'securePassword123'
    };
  }

  private async validateData(node: WorkflowNode, inputs: any, context: any) {
    const { rules } = inputs;
    const userData = context['collect-info']; // Get data from previous node
    
    console.log('✅ Validating user data...');
    
    // Simple validation logic
    if (!userData.email.includes('@')) {
      throw new Error('Invalid email format');
    }
    
    if (userData.password.length < 8) {
      throw new Error('Password too short');
    }
    
    return {
      ...userData,
      valid: true,
      timestamp: new Date().toISOString()
    };
  }

  private async makeApiRequest(node: WorkflowNode, inputs: any) {
    const { method, url, body } = inputs;
    
    console.log(`🌐 Making ${method} request to ${url}`);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    if (url.includes('/check')) {
      return { exists: false, available: true };
    } else if (url.includes('/create')) {
      return { 
        userId: 'user_' + Math.random().toString(36).substr(2, 9),
        created: true,
        timestamp: new Date().toISOString()
      };
    }
  }

  private async sendEmail(node: WorkflowNode, inputs: any) {
    console.log('📧 Sending email to:', inputs.to);
    
    // Simulate email sending
    await new Promise(resolve => setTimeout(resolve, 500));
    
    return {
      sent: true,
      messageId: 'msg_' + Math.random().toString(36).substr(2, 9)
    };
  }

  private async trackEvent(node: WorkflowNode, inputs: any) {
    console.log('📊 Tracking event:', inputs.event);
    
    return {
      tracked: true,
      eventId: 'evt_' + Math.random().toString(36).substr(2, 9)
    };
  }
}
```

### Step 4: Execute the Workflow

```typescript
async function runRegistration() {
  // Create flows instance with custom executor
  const flows = createFlows({
    storage: { type: StorageType.LOCAL_STORAGE },
    logging: { level: 'info' },
  }, new RegistrationNodeExecutor());

  try {
    console.log('🚀 Starting user registration workflow...');
    
    // Start the workflow
    const executionPromise = flows.startWorkflow(registrationWorkflow);
    
    // Simulate user form submission after a delay
    setTimeout(() => {
      flows.emitEvent({
        id: 'form-submit-001',
        type: 'form-submitted',
        data: { source: 'registration-form' },
        timestamp: new Date(),
      });
    }, 2000);
    
    // Wait for completion
    const result = await executionPromise;
    
    console.log('✨ Registration completed successfully!');
    console.log('Result:', result);
    
    return result;
    
  } catch (error) {
    console.error('💥 Registration failed:', error);
    throw error;
  }
}

// Run the workflow
runRegistration();
```

## Adding Error Handling

Let's enhance our workflow with sophisticated error handling:

```typescript
const enhancedConfig = {
  storage: { type: StorageType.LOCAL_STORAGE },
  logging: { level: 'info' },
  failureHandling: {
    strategy: FailureStrategy.RETRY_AND_DLQ,
    deadLetter: {
      enabled: true,
      maxRetries: 3,
      retentionPeriod: 3600000, // 1 hour
    },
    monitoring: {
      enabled: true,
      alertingEnabled: true,
      alertHandler: (alert) => {
        console.log('🚨 Alert:', alert.message);
      },
    },
  },
};

const flows = createFlows(enhancedConfig, new RegistrationNodeExecutor());
```

## Working with Events

Flows shines with event-driven workflows. Here's how to handle events:

```typescript
// Listen for specific events
flows.getEventSystem().on('user-action', (event) => {
  console.log('User performed action:', event);
});

// Emit events from your application
flows.emitEvent({
  id: 'user-click-001',
  type: 'user-action',
  data: { action: 'click', element: 'submit-button' },
  timestamp: new Date(),
});

// Wait for events in workflows
const eventWaitingWorkflow = createWorkflow('event-demo', 'Event Demo', [
  {
    id: 'wait-for-approval',
    type: 'data',
    inputs: { status: 'pending' },
    dependencies: [],
    waitForEvents: ['manager-approval'], // Workflow pauses here
  },
  {
    id: 'process-approval',
    type: 'data',
    inputs: { status: 'approved' },
    dependencies: ['wait-for-approval'],
  },
]);
```

## Monitoring Workflow State

Keep track of your workflows:

```typescript
// Get current workflow state
const workflowState = await flows.getWorkflowState('user-registration');
console.log('Current state:', workflowState);

// List all workflows
const allWorkflows = await flows.listWorkflows();
console.log('All workflows:', allWorkflows);

// Resume a workflow (useful after page reload)
if (workflowState?.status === 'paused') {
  const result = await flows.resumeWorkflow('user-registration');
}

// Get execution history
const events = flows.getEventSystem().getEventHistory(
  'workflow-completed',
  new Date(Date.now() - 24 * 60 * 60 * 1000) // Last 24 hours
);
```

## Best Practices for Getting Started

### 1. Start Simple
Begin with memory storage and basic node types:

```typescript
const simpleConfig = {
  storage: { type: StorageType.MEMORY },
  logging: { level: 'debug' },
};
```

### 2. Use Meaningful IDs and Names
```typescript
// Good
{ id: 'validate-user-email', name: 'Validate User Email Address' }

// Avoid
{ id: 'node1', name: 'Step 1' }
```

### 3. Handle Failures Gracefully
```typescript
{
  id: 'send-notification',
  type: 'email',
  // ... other properties
  failureHandling: {
    strategy: 'retry-and-skip', // Don't fail the whole workflow
    maxRetries: 2,
  },
}
```

### 4. Use Timeouts
```typescript
{
  id: 'api-call',
  type: 'http-request',
  timeout: 10000, // 10 seconds
  // ... other properties
}
```

### 5. Structure Your Workflows
```typescript
// Group related workflows
const workflows = {
  user: {
    registration: createWorkflow(/* ... */),
    onboarding: createWorkflow(/* ... */),
    profileUpdate: createWorkflow(/* ... */),
  },
  payment: {
    checkout: createWorkflow(/* ... */),
    refund: createWorkflow(/* ... */),
  },
};
```

## Common Patterns

### Sequential Processing
```typescript
[
  { id: 'step1', dependencies: [] },
  { id: 'step2', dependencies: ['step1'] },
  { id: 'step3', dependencies: ['step2'] },
]
```

### Parallel Processing
```typescript
[
  { id: 'start', dependencies: [] },
  { id: 'parallel-a', dependencies: ['start'] },
  { id: 'parallel-b', dependencies: ['start'] },
  { id: 'parallel-c', dependencies: ['start'] },
  { id: 'combine', dependencies: ['parallel-a', 'parallel-b', 'parallel-c'] },
]
```

### Conditional Execution
```typescript
{
  id: 'conditional-node',
  type: 'conditional',
  inputs: { 
    condition: '${previous-node.success} === true',
    thenNode: 'success-path',
    elseNode: 'failure-path'
  },
  dependencies: ['previous-node'],
}
```

## Next Steps

You're now ready to explore more advanced features:

1. **[Core Concepts](./core-concepts.md)** - Deep dive into Flows concepts
2. **[Storage Options](./storage.md)** - Choose the right storage for your needs
3. **[Event System](./events.md)** - Master event-driven workflows
4. **[Failure Handling](./failure-handling.md)** - Build resilient workflows
5. **[Examples](../examples/)** - See real-world examples

## Interactive Playground

Want to experiment? Try our interactive examples:

```bash
# Clone the repository
git clone https://github.com/your-org/flows.git
cd flows

# Run the interactive examples
pnpm install
npx tsx src/examples/simple-workflow.ts
npx tsx src/examples/subflow-example.ts
```

---

**Congratulations!** 🎉 You've built your first Flows workflow. Ready to explore the [core concepts](./core-concepts.md) and build more sophisticated workflows? 