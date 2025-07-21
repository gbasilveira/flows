/**
 * Example demonstrating the plugin system for handlers
 * Shows how to create and register handler plugins
 */
import {
  createFlows,
  createWorkflow,
  StorageType,
  DefaultNodeExecutor,
  type FlowsConfig,
} from '../index.js';
import { PluginRegistry, type HandlerPlugin } from '../core/plugin-registry.js';

// ================================
// 1. Create Handler Plugins
// ================================

/**
 * HTTP Request Plugin
 */
const httpPlugin: HandlerPlugin = {
  nodeType: 'http-request',
  handler: {
    async execute(node, _context, inputs) {
      const { method = 'GET', url } = { ...node.inputs, ...inputs };
      
      if (!url || typeof url !== 'string') {
        throw new Error('URL is required and must be a string');
      }
      
      console.log(`🌐 [Plugin] Making ${method} request to ${url}`);
      
      // Simulate HTTP request
      await new Promise(resolve => setTimeout(resolve, 300));
      
      return {
        success: true,
        method,
        url,
        status: 200,
        data: { message: 'Plugin handled HTTP request successfully' },
        timestamp: new Date().toISOString(),
      };
    },
  },
  metadata: {
    name: 'HTTP Request Plugin',
    version: '1.0.0',
    description: 'Handles HTTP requests via plugin system',
    author: 'Flows Team',
  },
};

/**
 * Database Plugin
 */
const databasePlugin: HandlerPlugin = {
  nodeType: 'database',
  handler: {
    async execute(node, _context, inputs) {
      const { operation, table, data } = { ...node.inputs, ...inputs };
      
      console.log(`🗄️ [Plugin] Executing ${operation} on table: ${table}`);
      
      // Simulate database operation
      await new Promise(resolve => setTimeout(resolve, 200));
      
      switch (operation) {
        case 'insert':
          return {
            operation,
            table,
            insertedId: Math.floor(Math.random() * 1000),
            data,
            success: true,
            timestamp: new Date().toISOString(),
          };
          
        case 'select':
          return {
            operation,
            table,
            results: [
              { id: 1, name: 'John Doe', email: 'john@example.com' },
              { id: 2, name: 'Jane Smith', email: 'jane@example.com' },
            ],
            count: 2,
            success: true,
            timestamp: new Date().toISOString(),
          };
          
        default:
          return {
            operation,
            table,
            success: true,
            message: `${operation} operation completed`,
            timestamp: new Date().toISOString(),
          };
      }
    },
  },
  metadata: {
    name: 'Database Plugin',
    version: '1.0.0',
    description: 'Handles database operations via plugin system',
    author: 'Flows Team',
  },
};

/**
 * Notification Plugin (using helper function)
 */
const notificationPlugin = PluginRegistry.createPlugin(
  'notification',
  async (node, _context, inputs) => {
    const { type, recipient, channel = 'email' } = { ...node.inputs, ...inputs };
    
    console.log(`📧 [Plugin] Sending ${type} notification to ${recipient} via ${channel}`);
    
    // Simulate notification sending
    await new Promise(resolve => setTimeout(resolve, 150));
    
    return {
      type,
      recipient,
      channel,
      messageId: `msg_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
      status: 'sent',
      timestamp: new Date().toISOString(),
    };
  },
  {
    name: 'Notification Plugin',
    version: '1.0.0',
    description: 'Handles notifications via plugin system',
    author: 'Flows Team',
  }
);

// ================================
// 2. Create Workflow Using Plugin Node Types
// ================================

const pluginWorkflow = createWorkflow(
  'plugin-demo',
  'Plugin System Demonstration',
  [
    // Use built-in data node (always available)
    {
      id: 'start',
      type: 'data',
      name: 'Start Processing',
      inputs: { 
        userId: '123', 
        action: 'user-registration',
        timestamp: new Date().toISOString(),
      },
      dependencies: [],
    },
    
    // Use HTTP plugin
    {
      id: 'fetch-user-data',
      type: 'http-request',
      name: 'Fetch User Data',
      inputs: {
        method: 'GET',
        url: '/api/users/123',
        headers: { 'Authorization': 'Bearer token123' },
      },
      dependencies: ['start'],
    },
    
    // Use database plugin
    {
      id: 'save-user',
      type: 'database',
      name: 'Save User to Database',
      inputs: {
        operation: 'insert',
        table: 'users',
        data: { name: 'John Doe', email: 'john@example.com' },
      },
      dependencies: ['fetch-user-data'],
    },
    
    // Use built-in delay node
    {
      id: 'wait-for-processing',
      type: 'delay',
      name: 'Wait for Processing',
      inputs: { delay: 500 },
      dependencies: ['save-user'],
    },
    
    // Use notification plugin
    {
      id: 'send-welcome-email',
      type: 'notification',
      name: 'Send Welcome Email',
      inputs: {
        type: 'welcome',
        recipient: 'john@example.com',
        message: 'Welcome to our platform!',
        channel: 'email',
      },
      dependencies: ['wait-for-processing'],
    },
    
    // Use database plugin again
    {
      id: 'log-activity',
      type: 'database',
      name: 'Log User Activity',
      inputs: {
        operation: 'insert',
        table: 'activity_log',
        data: { userId: '123', action: 'welcome_email_sent' },
      },
      dependencies: ['send-welcome-email'],
    },
  ],
  {
    description: 'Demonstrates the plugin system with various handler plugins',
    version: '1.0.0',
  }
);

// ================================
// 3. Usage Example
// ================================

export async function runPluginSystemExample() {
  console.log('🎯 Starting Plugin System Example...\n');
  
  const config: FlowsConfig = {
    storage: {
      type: StorageType.MEMORY,
    },
    logging: {
      level: 'info',
    },
  };

  // Option 1: Register plugins during NodeExecutor creation
  const executor = new DefaultNodeExecutor({
    allowCustomHandlers: true,
    plugins: [httpPlugin, databasePlugin, notificationPlugin],
  });

  const flows = createFlows(config, executor);

  // Option 2: Register plugins after creation
  // executor.registerPlugin(additionalPlugin);

  console.log('📋 Available node types:', executor.getAvailableNodeTypes());
  console.log('🔌 Registered plugins:', executor.getRegisteredPlugins().map((p: HandlerPlugin) => ({
    nodeType: p.nodeType,
    name: p.metadata?.name,
    version: p.metadata?.version,
  })));

  try {
    console.log('\n🚀 Starting plugin demonstration workflow...');
    const result = await flows.startWorkflow(pluginWorkflow);
    
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
// 4. Advanced Plugin Management Example
// ================================

export async function runPluginManagementExample() {
  console.log('🔧 Plugin Management Example...\n');

  const executor = new DefaultNodeExecutor({
    allowCustomHandlers: true,
  });

  // Dynamically register plugins
  console.log('📦 Registering plugins dynamically...');
  executor.registerPlugin(httpPlugin);
  executor.registerPlugin(databasePlugin);
  
  console.log('Available types:', executor.getAvailableNodeTypes());
  
  // Try to register a plugin for a reserved type (should fail)
  try {
    const invalidPlugin = PluginRegistry.createPlugin('data', async () => ({}));
    executor.registerPlugin(invalidPlugin);
  } catch (error) {
    console.log('✅ Correctly prevented overriding built-in type:', (error as Error).message);
  }

  // Unregister a plugin
  console.log('🗑️ Unregistering database plugin...');
  executor.unregisterPlugin('database');
  console.log('Available types after unregistration:', executor.getAvailableNodeTypes());

  // Test with custom handlers disabled
  console.log('\n🚫 Testing with custom handlers disabled...');
  const restrictedExecutor = new DefaultNodeExecutor({
    allowCustomHandlers: false,
  });

  try {
    restrictedExecutor.registerPlugin(httpPlugin);
  } catch (error) {
    console.log('✅ Correctly prevented plugin registration when disabled:', (error as Error).message);
  }
}

// ================================
// 5. Main Execution Block
// ================================

async function main() {
  try {
    await runPluginSystemExample();
    console.log('\n' + '='.repeat(50));
    await runPluginManagementExample();
    console.log('\n✨ Plugin system examples completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('\n💥 Plugin system examples failed:', error);
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

export { httpPlugin, databasePlugin, notificationPlugin }; 