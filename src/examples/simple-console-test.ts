/**
 * Simple test for console plugins
 */
import {
  createFlows,
  createWorkflow,
  StorageType,
  DefaultNodeExecutor,
  allConsolePlugins,
} from '../index.js';

async function testConsolePlugins() {
  console.log('🧪 Testing Console Plugins...\n');

  const config = {
    storage: { type: StorageType.MEMORY },
    logging: { level: 'info' as const },
  };

  const executor = new DefaultNodeExecutor({
    plugins: allConsolePlugins,
  });

  const flows = createFlows(config, executor);

  const testWorkflow = createWorkflow('console-test', 'Console Test', [
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
      id: 'error-test',
      type: 'console-error',
      inputs: {
        message: 'Testing console error',
        data: { error: 'test error' },
        options: { timestamp: true, prefix: '[ERROR]' }
      },
      dependencies: ['log-test'],
    },
    {
      id: 'warn-test',
      type: 'console-warn',
      inputs: {
        message: 'Testing console warn',
        data: { warning: 'test warning' },
        options: { timestamp: true, prefix: '[WARN]' }
      },
      dependencies: ['error-test'],
    },
    {
      id: 'info-test',
      type: 'console-info',
      inputs: {
        message: 'Testing console info',
        data: { info: 'test info' },
        options: { timestamp: true, prefix: '[INFO]' }
      },
      dependencies: ['warn-test'],
    },
    {
      id: 'debug-test',
      type: 'console-debug',
      inputs: {
        message: 'Testing console debug',
        data: { debug: 'test debug' },
        options: { timestamp: true, prefix: '[DEBUG]' }
      },
      dependencies: ['info-test'],
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
      dependencies: ['debug-test'],
    },
  ]);

  try {
    const result = await flows.startWorkflow(testWorkflow);
    console.log('\n✅ Console plugins test completed successfully!');
    console.log('📊 Result:', result);
    return result;
  } catch (error) {
    console.error('❌ Console plugins test failed:', error);
    throw error;
  } finally {
    flows.dispose();
  }
}

// Run the test if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  testConsolePlugins()
    .then(() => {
      console.log('\n🎉 All console plugins working correctly!');
    })
    .catch(error => {
      console.error('❌ Console plugins test failed:', error);
      process.exit(1);
    });
} 