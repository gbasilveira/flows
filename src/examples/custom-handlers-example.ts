/**
 * Example demonstrating custom node handlers
 * Shows how to create custom handlers for new node types
 */
import {
  createFlows,
  createWorkflow,
  StorageType,
  type FlowsConfig,
  type NodeExecutor,
  type WorkflowNode,
} from '../index.js';

// ================================
// 1. Create Custom Handlers
// ================================

/**
 * Custom handler for HTTP requests
 */
class HttpHandler {
  async execute(
    node: WorkflowNode,
    _context: Record<string, unknown>,
    inputs: Record<string, unknown>
  ): Promise<unknown> {
    const { method = 'GET', url } = { ...node.inputs, ...inputs };
    
    if (!url || typeof url !== 'string') {
      throw new Error('URL is required and must be a string');
    }
    
    console.log(`🌐 Making ${method} request to ${url}`);
    
    try {
      // Simulate HTTP request (in real app, use fetch)
      await new Promise(resolve => setTimeout(resolve, 500)); // Simulate network delay
      
      // Simulate different responses based on URL
      if (url.includes('/users/')) {
        return {
          id: '123',
          name: 'John Doe',
          email: 'john@example.com',
          status: 'active',
          requestedAt: new Date().toISOString(),
        };
      } else if (url.includes('/posts')) {
        return {
          posts: [
            { id: 1, title: 'Hello World', content: 'First post' },
            { id: 2, title: 'Custom Handlers', content: 'Using custom handlers in Flows' },
          ],
          total: 2,
          requestedAt: new Date().toISOString(),
        };
      }
      
      return {
        success: true,
        method,
        url,
        requestedAt: new Date().toISOString(),
      };
    } catch (error) {
      throw new Error(`HTTP request failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }
}

/**
 * Custom handler for email operations
 */
class EmailHandler {
  async execute(
    node: WorkflowNode,
    _context: Record<string, unknown>,
    inputs: Record<string, unknown>
  ): Promise<unknown> {
    const { to, subject, template } = { ...node.inputs, ...inputs };
    
    console.log(`📧 Sending email to ${to}: ${subject}`);
    
    // Simulate email sending
    await new Promise(resolve => setTimeout(resolve, 300));
    
    return {
      messageId: `msg_${Date.now()}_${Math.random().toString(36).slice(2, 11)}`,
      to,
      subject,
      template,
      status: 'sent',
      sentAt: new Date().toISOString(),
    };
  }
}

/**
 * Custom handler for validation operations
 */
class ValidationHandler {
  async execute(
    node: WorkflowNode,
    context: Record<string, unknown>,
    inputs: Record<string, unknown>
  ): Promise<unknown> {
    const { rules, strict = false } = { ...node.inputs, ...inputs };
    
    console.log(`✅ Validating data with rules: ${rules}`);
    
    // Get data from previous node (simulated)
    const dataToValidate = (context.userData || inputs) as Record<string, unknown>;
    
    // Simple validation logic
    const errors: string[] = [];
    
    if (rules === 'user-validation') {
      if (!dataToValidate.name || typeof dataToValidate.name !== 'string') {
        errors.push('Name is required and must be a string');
      }
      if (!dataToValidate.email || !String(dataToValidate.email).includes('@')) {
        errors.push('Valid email is required');
      }
      if (strict && (!dataToValidate.age || (dataToValidate.age as number) < 18)) {
        errors.push('Age must be 18 or older in strict mode');
      }
    }
    
    const isValid = errors.length === 0;
    
    if (!isValid && strict) {
      throw new Error(`Validation failed: ${errors.join(', ')}`);
    }
    
    return {
      valid: isValid,
      errors,
      rules,
      strict,
      validatedAt: new Date().toISOString(),
      data: dataToValidate,
    };
  }
}

// ================================
// 2. Create Custom Node Executor with Handlers
// ================================

class CustomNodeExecutor implements NodeExecutor {
  private httpHandler: HttpHandler;
  private emailHandler: EmailHandler;
  private validationHandler: ValidationHandler;

  constructor() {
    this.httpHandler = new HttpHandler();
    this.emailHandler = new EmailHandler();
    this.validationHandler = new ValidationHandler();
  }

  async execute(
    node: WorkflowNode,
    context: Record<string, unknown>,
    inputs: Record<string, unknown>
  ): Promise<unknown> {
    switch (node.type) {
      case 'http-request':
        return this.httpHandler.execute(node, context, inputs);
      
      case 'email':
        return this.emailHandler.execute(node, context, inputs);
      
      case 'validation':
        return this.validationHandler.execute(node, context, inputs);
      
      default:
        throw new Error(`Unknown node type: ${node.type}`);
    }
  }
}

// ================================
// 3. Create Workflow Using Custom Node Types
// ================================

const userOnboardingWorkflow = createWorkflow(
  'user-onboarding-custom',
  'User Onboarding with Custom Handlers',
  [
    // Fetch user data
    {
      id: 'fetch-user',
      type: 'http-request',
      name: 'Fetch User Data',
      inputs: {
        method: 'GET',
        url: '/api/users/123',
        headers: { 'Authorization': 'Bearer token123' }
      },
      dependencies: [],
    },
    
    // Validate user data
    {
      id: 'validate-user',
      type: 'validation',
      name: 'Validate User Data',
      inputs: {
        rules: 'user-validation',
        strict: true
      },
      dependencies: ['fetch-user'],
    },
    
    // Send welcome email
    {
      id: 'send-welcome',
      type: 'email',
      name: 'Send Welcome Email',
      inputs: {
        to: 'john@example.com',
        subject: 'Welcome to our platform!',
        template: 'welcome-template',
        data: { name: 'John Doe' }
      },
      dependencies: ['validate-user'],
    },
    
    // Fetch user posts
    {
      id: 'fetch-posts',
      type: 'http-request',
      name: 'Fetch User Posts',
      inputs: {
        method: 'GET',
        url: '/api/posts?userId=123'
      },
      dependencies: ['validate-user'], // Can run in parallel with email
    },
    
    // Send summary email
    {
      id: 'send-summary',
      type: 'email',
      name: 'Send Summary Email',
      inputs: {
        to: 'admin@example.com',
        subject: 'New user onboarded',
        template: 'admin-summary'
      },
      dependencies: ['send-welcome', 'fetch-posts'], // Wait for both to complete
    },
  ],
  {
    description: 'Complete user onboarding process using custom handlers',
    version: '1.0.0',
  }
);

// ================================
// 4. Usage Example
// ================================

export async function runCustomHandlersExample() {
  console.log('🎯 Starting Custom Handlers Example...\n');
  
  const config: FlowsConfig = {
    storage: {
      type: StorageType.MEMORY,
    },
    logging: {
      level: 'info',
    },
  };

  // Create flows with custom node executor
  const customExecutor = new CustomNodeExecutor();
  const flows = createFlows(config, customExecutor);

  const context = {
    userData: {
      id: '123',
      name: 'John Doe',
      email: 'john@example.com',
      age: 25,
    },
  };

  try {
    console.log('🚀 Starting user onboarding workflow...');
    const result = await flows.startWorkflow(userOnboardingWorkflow, context);
    
    console.log('\n✅ Workflow completed!');
    console.log('📊 Result:', {
      status: result.status,
      duration: `${result.duration}ms`,
      completedNodes: Object.keys(result.nodeResults).length,
    });
    
    console.log('\n📝 Node Results:');
    Object.entries(result.nodeResults).forEach(([nodeId, nodeResult]) => {
      console.log(`  ${nodeId}:`, nodeResult);
    });

    return result;

  } catch (error) {
    console.error('❌ Workflow failed:', error);
    throw error;
  } finally {
    // Clean up
    flows.dispose();
  }
}

// ================================
// 5. Main Execution Block
// ================================

async function main() {
  try {
    await runCustomHandlersExample();
    console.log('\n✨ Custom handlers example completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('\n💥 Custom handlers example failed:', error);
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

export { CustomNodeExecutor, HttpHandler, EmailHandler, ValidationHandler }; 