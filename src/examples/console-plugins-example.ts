/**
 * Example demonstrating the console plugins for debugging and logging
 * Shows how to use various console operations in workflows
 */
import {
  createFlows,
  createWorkflow,
  StorageType,
  DefaultNodeExecutor,
  type FlowsConfig,
  type WorkflowNode,
  // Console plugins
  allConsolePlugins,
  consoleLogPlugin,
  consoleErrorPlugin,
  consoleWarnPlugin,
  consoleInfoPlugin,
  consoleDebugPlugin,
  consoleTablePlugin,
  consoleTimePlugin,
  consoleTimeEndPlugin,
  consoleGroupPlugin,
  consoleGroupEndPlugin,
  consoleClearPlugin,
  consoleTracePlugin,
  consoleCountPlugin,
  consoleCountResetPlugin,
} from '../index.js';

// ================================
// 1. Console Logging Example
// ================================

const consoleLoggingWorkflow = createWorkflow(
  'console-logging-demo',
  'Console Logging Demonstration',
  [
    // Start with some data
    {
      id: 'start',
      type: 'data',
      name: 'Start Processing',
      inputs: { 
        userId: '123', 
        action: 'user-registration',
        timestamp: new Date().toISOString(),
        userData: {
          name: 'John Doe',
          email: 'john@example.com',
          age: 30,
          preferences: ['dark-mode', 'notifications']
        }
      },
      dependencies: [],
    },
    
    // Log basic information
    {
      id: 'log-user-info',
      type: 'console-log',
      name: 'Log User Information',
      inputs: {
        message: 'User registration started',
        data: { userId: '123', action: 'user-registration' },
        options: { timestamp: true, prefix: '[FLOWS]' }
      },
      dependencies: ['start'],
    },
    
    // Log user data as table
    {
      id: 'log-user-table',
      type: 'console-table',
      name: 'Display User Data Table',
      inputs: {
        data: [
          { id: '123', name: 'John Doe', email: 'john@example.com', age: 30 },
          { id: '124', name: 'Jane Smith', email: 'jane@example.com', age: 28 },
          { id: '125', name: 'Bob Johnson', email: 'bob@example.com', age: 35 }
        ],
        options: { columns: ['name', 'email', 'age'] }
      },
      dependencies: ['log-user-info'],
    },
    
    // Log warning for missing email verification
    {
      id: 'log-warning',
      type: 'console-warn',
      name: 'Log Warning',
      inputs: {
        message: 'Email verification not completed',
        data: { userId: '123', email: 'john@example.com' },
        options: { timestamp: true, prefix: '[WARNING]' }
      },
      dependencies: ['log-user-table'],
    },
    
    // Log debug information
    {
      id: 'log-debug',
      type: 'console-debug',
      name: 'Log Debug Info',
      inputs: {
        message: 'Processing user preferences',
        data: { preferences: ['dark-mode', 'notifications'] },
        options: { timestamp: true, prefix: '[DEBUG]' }
      },
      dependencies: ['log-warning'],
    },
    
    // Log success information
    {
      id: 'log-success',
      type: 'console-info',
      name: 'Log Success Info',
      inputs: {
        message: 'User registration completed successfully',
        data: { userId: '123', status: 'active', createdAt: new Date().toISOString() },
        options: { timestamp: true, prefix: '[SUCCESS]' }
      },
      dependencies: ['log-debug'],
    },
  ],
  {
    description: 'Demonstrates various console logging operations',
    version: '1.0.0',
  }
);

// ================================
// 2. Console Timing Example
// ================================

const consoleTimingWorkflow = createWorkflow(
  'console-timing-demo',
  'Console Timing Demonstration',
  [
    // Start timing
    {
      id: 'start-timer',
      type: 'console-time',
      name: 'Start Performance Timer',
      inputs: {
        message: 'workflow-execution',
        options: { label: 'workflow-execution' }
      },
      dependencies: [],
    },
    
    // Simulate some work
    {
      id: 'simulate-work',
      type: 'data',
      name: 'Simulate Work',
      inputs: { 
        operation: 'data-processing',
        items: [1, 2, 3, 4, 5]
      },
      dependencies: ['start-timer'],
    },
    
    // Log progress
    {
      id: 'log-progress',
      type: 'console-log',
      name: 'Log Progress',
      inputs: {
        message: 'Processing data items',
        data: { items: [1, 2, 3, 4, 5], processed: 3 },
        options: { timestamp: true }
      },
      dependencies: ['simulate-work'],
    },
    
    // End timing
    {
      id: 'end-timer',
      type: 'console-timeend',
      name: 'End Performance Timer',
      inputs: {
        message: 'workflow-execution',
        options: { label: 'workflow-execution' }
      },
      dependencies: ['log-progress'],
    },
  ],
  {
    description: 'Demonstrates console timing operations',
    version: '1.0.0',
  }
);

// ================================
// 3. Console Grouping Example
// ================================

const consoleGroupingWorkflow = createWorkflow(
  'console-grouping-demo',
  'Console Grouping Demonstration',
  [
    // Start group
    {
      id: 'start-group',
      type: 'console-group',
      name: 'Start User Processing Group',
      inputs: {
        message: 'User Processing Workflow',
        options: { collapsed: false }
      },
      dependencies: [],
    },
    
    // Log user data
    {
      id: 'log-user-data',
      type: 'console-log',
      name: 'Log User Data',
      inputs: {
        message: 'Processing user data',
        data: { name: 'John Doe', email: 'john@example.com' }
      },
      dependencies: ['start-group'],
    },
    
    // Start nested group
    {
      id: 'start-nested-group',
      type: 'console-group',
      name: 'Start Validation Group',
      inputs: {
        message: 'Data Validation',
        options: { collapsed: true }
      },
      dependencies: ['log-user-data'],
    },
    
    // Log validation results
    {
      id: 'log-validation',
      type: 'console-log',
      name: 'Log Validation Results',
      inputs: {
        message: 'Validation completed',
        data: { 
          emailValid: true, 
          nameValid: true, 
          ageValid: true 
        }
      },
      dependencies: ['start-nested-group'],
    },
    
    // End nested group
    {
      id: 'end-nested-group',
      type: 'console-groupend',
      name: 'End Validation Group',
      inputs: {},
      dependencies: ['log-validation'],
    },
    
    // Log final result
    {
      id: 'log-final-result',
      type: 'console-log',
      name: 'Log Final Result',
      inputs: {
        message: 'User processing completed',
        data: { status: 'success', userId: '123' }
      },
      dependencies: ['end-nested-group'],
    },
    
    // End main group
    {
      id: 'end-group',
      type: 'console-groupend',
      name: 'End User Processing Group',
      inputs: {},
      dependencies: ['log-final-result'],
    },
  ],
  {
    description: 'Demonstrates console grouping operations',
    version: '1.0.0',
  }
);

// ================================
// 4. Console Utility Example
// ================================

const consoleUtilityWorkflow = createWorkflow(
  'console-utility-demo',
  'Console Utility Demonstration',
  [
    // Start with data
    {
      id: 'start-data',
      type: 'data',
      name: 'Start with Data',
      inputs: { 
        items: ['apple', 'banana', 'cherry'],
        count: 0
      },
      dependencies: [],
    },
    
    // Count operations
    {
      id: 'count-operations',
      type: 'console-count',
      name: 'Count Operations',
      inputs: {
        message: 'workflow-execution',
        options: { label: 'workflow-execution' }
      },
      dependencies: ['start-data'],
    },
    
    // Log trace
    {
      id: 'log-trace',
      type: 'console-trace',
      name: 'Log Stack Trace',
      inputs: {
        message: 'Workflow execution trace',
        options: { label: 'workflow-trace' }
      },
      dependencies: ['count-operations'],
    },
    
    // Clear console (optional)
    {
      id: 'clear-console',
      type: 'console-clear',
      name: 'Clear Console',
      inputs: {
        options: { preserve: false }
      },
      dependencies: ['log-trace'],
    },
    
    // Reset counter
    {
      id: 'reset-counter',
      type: 'console-countreset',
      name: 'Reset Counter',
      inputs: {
        message: 'workflow-execution',
        options: { label: 'workflow-execution' }
      },
      dependencies: ['clear-console'],
    },
  ],
  {
    description: 'Demonstrates console utility operations',
    version: '1.0.0',
  }
);

// ================================
// 5. Error Handling Example
// ================================

const consoleErrorWorkflow = createWorkflow(
  'console-error-demo',
  'Console Error Demonstration',
  [
    // Start processing
    {
      id: 'start-processing',
      type: 'data',
      name: 'Start Processing',
      inputs: { 
        userId: '123',
        data: { name: 'John', age: 'invalid-age' }
      },
      dependencies: [],
    },
    
    // Log error for invalid age
    {
      id: 'log-error',
      type: 'console-error',
      name: 'Log Error',
      inputs: {
        message: 'Invalid age format detected',
        data: { 
          userId: '123', 
          age: 'invalid-age',
          expectedFormat: 'number'
        },
        options: { timestamp: true, prefix: '[ERROR]' }
      },
      dependencies: ['start-processing'],
    },
    
    // Log warning about data validation
    {
      id: 'log-warning',
      type: 'console-warn',
      name: 'Log Warning',
      inputs: {
        message: 'Data validation failed',
        data: { 
          field: 'age',
          value: 'invalid-age',
          action: 'using-default-value'
        },
        options: { timestamp: true, prefix: '[WARNING]' }
      },
      dependencies: ['log-error'],
    },
    
    // Continue with corrected data
    {
      id: 'continue-processing',
      type: 'console-log',
      name: 'Continue Processing',
      inputs: {
        message: 'Processing with corrected data',
        data: { 
          userId: '123',
          age: 25, // corrected value
          status: 'processing'
        },
        options: { timestamp: true, prefix: '[INFO]' }
      },
      dependencies: ['log-warning'],
    },
  ],
  {
    description: 'Demonstrates console error handling',
    version: '1.0.0',
  }
);

// ================================
// 6. Usage Example
// ================================

export async function runConsolePluginsExample() {
  console.log('🎯 Starting Console Plugins Example...\n');
  
  const config: FlowsConfig = {
    storage: {
      type: StorageType.MEMORY,
    },
    logging: {
      level: 'info',
    },
  };

  // Create executor with console plugins
  const executor = new DefaultNodeExecutor({
    allowCustomHandlers: true,
    plugins: allConsolePlugins,
  });

  const flows = createFlows(config, executor);

  console.log('📋 Available node types:', executor.getAvailableNodeTypes());
  console.log('🔌 Registered console plugins:', executor.getRegisteredPlugins().filter(p => p.nodeType.startsWith('console-')).map(p => ({
    nodeType: p.nodeType,
    name: p.metadata?.name,
    version: p.metadata?.version,
  })));

  try {
    // Run logging example
    console.log('\n🚀 Running Console Logging Example...');
    const loggingResult = await flows.startWorkflow(consoleLoggingWorkflow);
    console.log('✅ Logging workflow completed!');
    
    // Run timing example
    console.log('\n⏱️ Running Console Timing Example...');
    const timingResult = await flows.startWorkflow(consoleTimingWorkflow);
    console.log('✅ Timing workflow completed!');
    
    // Run grouping example
    console.log('\n📁 Running Console Grouping Example...');
    const groupingResult = await flows.startWorkflow(consoleGroupingWorkflow);
    console.log('✅ Grouping workflow completed!');
    
    // Run utility example
    console.log('\n🔧 Running Console Utility Example...');
    const utilityResult = await flows.startWorkflow(consoleUtilityWorkflow);
    console.log('✅ Utility workflow completed!');
    
    // Run error example
    console.log('\n❌ Running Console Error Example...');
    const errorResult = await flows.startWorkflow(consoleErrorWorkflow);
    console.log('✅ Error workflow completed!');

    return {
      logging: loggingResult,
      timing: timingResult,
      grouping: groupingResult,
      utility: utilityResult,
      error: errorResult,
    };

  } catch (error) {
    console.error('❌ Console plugins example failed:', error);
    throw error;
  } finally {
    // Clean up
    flows.dispose();
  }
}

// ================================
// 7. Advanced Console Plugin Management Example
// ================================

export async function runConsolePluginManagementExample() {
  console.log('🔧 Console Plugin Management Example...\n');

  const executor = new DefaultNodeExecutor({
    allowCustomHandlers: true,
  });

  // Dynamically register console plugins
  console.log('📦 Registering console plugins dynamically...');
  executor.registerPlugin(consoleLogPlugin);
  executor.registerPlugin(consoleErrorPlugin);
  executor.registerPlugin(consoleTablePlugin);
  executor.registerPlugin(consoleTimePlugin);
  executor.registerPlugin(consoleTimeEndPlugin);
  
  console.log('Available console types:', executor.getAvailableNodeTypes().filter(type => type.startsWith('console-')));
  
  // Test with specific console operations
  const testWorkflow = createWorkflow(
    'console-test',
    'Console Test',
    [
      {
        id: 'start',
        type: 'data',
        inputs: { message: 'Hello Console!' },
        dependencies: [],
      },
      {
        id: 'log-test',
        type: 'console-log',
        inputs: {
          message: 'Testing console log',
          data: { test: true, timestamp: new Date().toISOString() },
          options: { timestamp: true, prefix: '[TEST]' }
        },
        dependencies: ['start'],
      },
      {
        id: 'table-test',
        type: 'console-table',
        inputs: {
          data: [
            { id: 1, name: 'Test 1', status: 'active' },
            { id: 2, name: 'Test 2', status: 'inactive' }
          ],
          options: { columns: ['name', 'status'] }
        },
        dependencies: ['log-test'],
      },
    ]
  );

  const flows = createFlows({ storage: { type: StorageType.MEMORY } }, executor);
  
  try {
    const result = await flows.startWorkflow(testWorkflow);
    console.log('✅ Console test workflow completed!');
    return result;
  } catch (error) {
    console.error('❌ Console test failed:', error);
    throw error;
  } finally {
    flows.dispose();
  }
} 

// ================================
// 8. Main Execution
// ================================

// Run the example if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  runConsolePluginsExample()
    .then(result => {
      console.log('\n🎉 Console plugins example completed successfully!');
      console.log('📊 Results summary:', {
        workflows: Object.keys(result).length,
        status: 'success'
      });
    })
    .catch(error => {
      console.error('❌ Console plugins example failed:', error);
      process.exit(1);
    });
} 