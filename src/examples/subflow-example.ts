/**
 * Example demonstrating subflow functionality
 * Shows how workflows can call other workflows as modular components
 */
import {
  createFlows,
  createWorkflow,
  StorageType,
  type FlowsConfig,
} from '../index.js';
import { EnhancedNodeExecutor } from '../core/enhanced-node-executor.js';
import { 
  createSubflowNode, 
  createWorkflowModule,
} from '../utils/subflow-utils.js';

// ================================
// 1. Create Reusable Workflow Modules
// ================================

// User validation module
const userValidationModule = createWorkflowModule(
  'user-validation',
  'User Validation Module',
  [
    {
      id: 'check-user-exists',
      type: 'data',
      name: 'Check User Exists',
      inputs: { operation: 'user-exists-check' },
      dependencies: [],
    },
    {
      id: 'validate-permissions',
      type: 'data',
      name: 'Validate User Permissions',
      inputs: { operation: 'permission-check' },
      dependencies: ['check-user-exists'],
    },
    {
      id: 'get-user-profile',
      type: 'data',
      name: 'Get User Profile',
      inputs: { operation: 'profile-fetch' },
      dependencies: ['validate-permissions'],
    },
  ],
  {
    description: 'Validates user existence, permissions, and fetches profile',
    inputs: ['userId', 'requiredPermissions'],
    outputs: ['userProfile', 'validationStatus'],
  }
);

// Payment processing module
const paymentModule = createWorkflowModule(
  'payment-processing',
  'Payment Processing Module',
  [
    {
      id: 'validate-payment-details',
      type: 'data',
      name: 'Validate Payment Details',
      inputs: { operation: 'payment-validation' },
      dependencies: [],
    },
    {
      id: 'process-payment',
      type: 'data',
      name: 'Process Payment',
      inputs: { operation: 'charge-card' },
      dependencies: ['validate-payment-details'],
    },
    {
      id: 'send-receipt',
      type: 'data',
      name: 'Send Receipt',
      inputs: { operation: 'email-receipt' },
      dependencies: ['process-payment'],
    },
  ],
  {
    description: 'Handles payment validation, processing, and receipt',
    inputs: ['amount', 'paymentMethod', 'customerEmail'],
    outputs: ['transactionId', 'receiptUrl'],
  }
);

// Notification module
const notificationModule = createWorkflowModule(
  'notifications',
  'Notification Module',
  [
    {
      id: 'format-message',
      type: 'data',
      name: 'Format Notification Message',
      inputs: { operation: 'format-message' },
      dependencies: [],
    },
    {
      id: 'send-email',
      type: 'data',
      name: 'Send Email Notification',
      inputs: { operation: 'send-email' },
      dependencies: ['format-message'],
    },
    {
      id: 'send-sms',
      type: 'data',
      name: 'Send SMS Notification',
      inputs: { operation: 'send-sms' },
      dependencies: ['format-message'],
    },
    {
      id: 'log-notification',
      type: 'data',
      name: 'Log Notification Sent',
      inputs: { operation: 'log-activity' },
      dependencies: ['send-email', 'send-sms'],
    },
  ],
  {
    description: 'Sends multi-channel notifications',
    inputs: ['message', 'channels', 'recipient'],
    outputs: ['deliveryStatus', 'logId'],
  }
);

// ================================
// 2. Create Main Workflow That Uses Modules
// ================================

const ecommerceOrderWorkflow = createWorkflow(
  'ecommerce-order',
  'E-commerce Order Processing',
  [
    // Start with basic order data
    {
      id: 'receive-order',
      type: 'data',
      name: 'Receive Order',
      inputs: { operation: 'order-received' },
      dependencies: [],
    },

    // Call user validation subflow
    createSubflowNode(
      'validate-user',
      userValidationModule,
      { requiredPermissions: ['purchase'] },
      ['receive-order'],
      {
        name: 'Validate Customer',
        description: 'Validate customer exists and has purchase permissions',
        timeout: 30000,
      }
    ),

    // Call payment processing subflow
    createSubflowNode(
      'process-payment',
      paymentModule,
      {}, // Payment details will come from context
      ['validate-user'],
      {
        name: 'Process Payment',
        description: 'Handle payment validation and processing',
        timeout: 60000,
      }
    ),

    // Update inventory (regular node)
    {
      id: 'update-inventory',
      type: 'data',
      name: 'Update Inventory',
      inputs: { operation: 'inventory-update' },
      dependencies: ['process-payment'],
    },

    // Send notifications using subflow
    createSubflowNode(
      'send-notifications',
      notificationModule,
      { 
        channels: ['email', 'sms'],
        message: 'Your order has been processed successfully!',
      },
      ['update-inventory'],
      {
        name: 'Send Order Notifications',
        description: 'Notify customer of successful order',
      }
    ),

    // Final confirmation
    {
      id: 'complete-order',
      type: 'data',
      name: 'Complete Order',
      inputs: { operation: 'order-completed', status: 'success' },
      dependencies: ['send-notifications'],
    },
  ],
  {
    description: 'Complete e-commerce order processing using modular subflows',
    version: '1.0.0',
  }
);

// ================================
// 3. Complex Example: Recursive Subflows
// ================================

// Recursive workflow for hierarchical data processing
const dataProcessingModule = createWorkflowModule(
  'recursive-data-processor',
  'Recursive Data Processing Module',
  [
    {
      id: 'check-data-structure',
      type: 'data',
      name: 'Check Data Structure',
      inputs: { operation: 'structure-check' },
      dependencies: [],
    },
    {
      id: 'process-current-level',
      type: 'data',
      name: 'Process Current Level',
      inputs: { operation: 'level-processing' },
      dependencies: ['check-data-structure'],
    },
    // This could call itself recursively for nested data
    createSubflowNode(
      'process-children',
      'recursive-data-processor', // Reference by ID for recursion
      { processChildren: true },
      ['process-current-level'],
      {
        name: 'Process Child Data',
        description: 'Recursively process child data structures',
        maxDepth: 10, // Limit recursion depth
      }
    ),
    {
      id: 'aggregate-results',
      type: 'data',
      name: 'Aggregate Results',
      inputs: { operation: 'result-aggregation' },
      dependencies: ['process-children'],
    },
  ],
  {
    description: 'Recursively processes hierarchical data structures',
    inputs: ['dataStructure', 'processingOptions'],
    outputs: ['processedData', 'statistics'],
  }
);

// ================================
// 4. Usage Example
// ================================

export async function runSubflowExample() {
  // Create standard flows instance
  const config: FlowsConfig = {
    storage: {
      type: StorageType.MEMORY,
    },
    logging: {
      level: 'info',
    },
  };

  const flows = createFlows(config);

  // Create enhanced executor with subflow support
  const enhancedExecutor = new EnhancedNodeExecutor(flows);
  
  // Register workflow modules
  enhancedExecutor.registerSubflow(userValidationModule);
  enhancedExecutor.registerSubflow(paymentModule);
  enhancedExecutor.registerSubflow(notificationModule);
  enhancedExecutor.registerSubflow(dataProcessingModule);

  // Note: In a real implementation, we'd need to modify createFlows 
  // to accept a custom nodeExecutor parameter

  console.log('📋 Registered subflow modules:', 
    enhancedExecutor.getRegisteredSubflows().map(w => w.name)
  );

  // Execute the main e-commerce workflow
  console.log('🚀 Starting e-commerce order processing...');
  
  const orderContext = {
    userId: 'user123',
    amount: 99.99,
    paymentMethod: 'card',
    customerEmail: 'customer@example.com',
    items: ['item1', 'item2'],
    __subflow_execution_context: {
      callStack: [],
      maxDepth: 5,
      parentWorkflowId: 'ecommerce-order',
      parentNodeId: 'root',
    },
  };

  try {
    const result = await flows.startWorkflow(ecommerceOrderWorkflow, orderContext);
    
    console.log('✅ Order processing completed!');
    console.log('📊 Result:', {
      status: result.status,
      duration: `${result.duration}ms`,
      completedNodes: Object.keys(result.nodeResults).length,
    });
    
    // Show results from each module
    Object.entries(result.nodeResults).forEach(([nodeId, nodeResult]) => {
      console.log(`  ${nodeId}:`, nodeResult);
    });

    return result;

  } catch (error) {
    console.error('❌ Order processing failed:', error);
    throw error;
  } finally {
    // Clean up
    flows.dispose();
  }
}

// ================================
// 5. Main Execution Block
// ================================

// This block will run when the file is executed directly
async function main() {
  console.log('🎯 Starting Subflow Example...\n');
  
  try {
    await runSubflowExample();
    console.log('\n✨ Subflow example completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('\n💥 Subflow example failed:', error);
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

// Export for use
export {
  userValidationModule,
  paymentModule,
  notificationModule,
  ecommerceOrderWorkflow,
  dataProcessingModule,
};