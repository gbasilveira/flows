/**
 * Comprehensive example demonstrating all new handler types:
 * - Logical operations (AND, OR, NOT, XOR)
 * - Mathematical operations (add, subtract, multiply, divide, power, modulo)  
 * - String manipulation (concat, substring, replace, match, split, compare, length, case)
 * - Conditional execution (if/then/else logic)
 * - Merge operations (ALL, ANY, MAJORITY, COUNT)
 */
import {
  createFlows,
  createWorkflow,
  StorageType,
  DefaultNodeExecutor,
  type FlowsConfig,
} from '../index.js';
import { allBuiltInPlugins, getPluginMetadata } from '../core/built-in-plugins.js';

// ================================
// Example Workflows
// ================================

/**
 * Workflow demonstrating logical operations
 */
const logicalOperationsWorkflow = createWorkflow(
  'logical-operations-demo',
  'Logical Operations Demonstration',
  [
    {
      id: 'input-data',
      type: 'data',
      name: 'Input Data',
      inputs: { 
        value1: true, 
        value2: false, 
        value3: true,
        numbers: [5, 0, 10, -3]
      },
      dependencies: [],
    },
    
    {
      id: 'logic-and',
      type: 'logic-and',
      name: 'AND Operation',
      inputs: { 
        values: [true, true, false]  // Expected: false
      },
      dependencies: ['input-data'],
    },
    
    {
      id: 'logic-or', 
      type: 'logic-or',
      name: 'OR Operation', 
      inputs: {
        values: [false, false, true]  // Expected: true
      },
      dependencies: ['input-data'],
    },
    
    {
      id: 'logic-not',
      type: 'logic-not',
      name: 'NOT Operation',
      inputs: {
        values: [false]  // Expected: true
      },
      dependencies: ['input-data'],
    },
    
    {
      id: 'logic-xor',
      type: 'logic-xor', 
      name: 'XOR Operation',
      inputs: {
        values: [true, false]  // Expected: true
      },
      dependencies: ['input-data'],
    },
  ],
  {
    description: 'Demonstrates boolean logic operations',
    version: '1.0.0',
  }
);

/**
 * Workflow demonstrating mathematical operations
 */
const mathOperationsWorkflow = createWorkflow(
  'math-operations-demo',
  'Mathematical Operations Demonstration',
  [
    {
      id: 'numbers-input',
      type: 'data',
      name: 'Numbers Input',
      inputs: {
        numbers: [10, 5, 2],
        dividend: 20,
        divisor: 4,
        base: 2,
        exponent: 8
      },
      dependencies: [],
    },
    
    {
      id: 'math-add',
      type: 'math-add',
      name: 'Addition',
      inputs: {
        values: [10, 20, 30]  // Expected: 60
      },
      dependencies: ['numbers-input'],
    },
    
    {
      id: 'math-subtract',
      type: 'math-subtract',
      name: 'Subtraction',
      inputs: {
        values: [100, 25, 10]  // Expected: 65 (100 - 25 - 10)
      },
      dependencies: ['numbers-input'],
    },
    
    {
      id: 'math-multiply',
      type: 'math-multiply',
      name: 'Multiplication',
      inputs: {
        values: [5, 4, 2]  // Expected: 40
      },
      dependencies: ['numbers-input'],
    },
    
    {
      id: 'math-divide',
      type: 'math-divide',
      name: 'Division',
      inputs: {
        values: [20, 4]  // Expected: 5
      },
      dependencies: ['numbers-input'],
    },
    
    {
      id: 'math-power',
      type: 'math-power',
      name: 'Exponentiation',
      inputs: {
        values: [2, 8]  // Expected: 256
      },
      dependencies: ['numbers-input'],
    },
    
    {
      id: 'math-modulo',
      type: 'math-modulo',
      name: 'Modulo',
      inputs: {
        values: [17, 5]  // Expected: 2
      },
      dependencies: ['numbers-input'],
    },
  ],
  {
    description: 'Demonstrates mathematical operations',
    version: '1.0.0',
  }
);

/**
 * Workflow demonstrating string operations
 */
const stringOperationsWorkflow = createWorkflow(
  'string-operations-demo',
  'String Operations Demonstration',
  [
    {
      id: 'text-input',
      type: 'data',
      name: 'Text Input',
      inputs: {
        text1: 'Hello',
        text2: 'World',
        email: 'user@example.com',
        sentence: 'the quick brown fox jumps over the lazy dog'
      },
      dependencies: [],
    },
    
    {
      id: 'string-concat',
      type: 'string-concat',
      name: 'String Concatenation',
      inputs: {
        values: ['Hello', ' ', 'Beautiful', ' ', 'World'],
        separator: ''
      },
      dependencies: ['text-input'],
    },
    
    {
      id: 'string-substring',
      type: 'string-substring', 
      name: 'Substring Extraction',
      inputs: {
        text: 'Hello Beautiful World',
        start: 6,
        end: 15
      },
      dependencies: ['string-concat'],
    },
    
    {
      id: 'string-replace',
      type: 'string-replace',
      name: 'String Replace',
      inputs: {
        text: 'Hello World, Hello Universe',
        search: 'Hello',
        replacement: 'Hi',
        global: true
      },
      dependencies: ['text-input'],
    },
    
    {
      id: 'string-match',
      type: 'string-match',
      name: 'Regex Match',
      inputs: {
        text: 'Contact: user@example.com or admin@test.org',
        pattern: '[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}',
        flags: 'g'
      },
      dependencies: ['text-input'],
    },
    
    {
      id: 'string-split',
      type: 'string-split',
      name: 'String Split',
      inputs: {
        text: 'apple,banana,cherry,date',
        delimiter: ','
      },
      dependencies: ['text-input'],
    },
    
    {
      id: 'string-length',
      type: 'string-length',
      name: 'String Length',
      inputs: {
        text: 'How long is this text?'
      },
      dependencies: ['text-input'],
    },
    
    {
      id: 'string-case',
      type: 'string-case',
      name: 'Case Transformation',
      inputs: {
        text: 'hello beautiful world',
        caseType: 'title'
      },
      dependencies: ['text-input'],
    },
  ],
  {
    description: 'Demonstrates string manipulation operations',
    version: '1.0.0',
  }
);

/**
 * Workflow demonstrating conditional execution
 */
const conditionalWorkflow = createWorkflow(
  'conditional-demo',
  'Conditional Execution Demonstration', 
  [
    {
      id: 'condition-input',
      type: 'data',
      name: 'Condition Input',
      inputs: {
        score: 85,
        user: { name: 'Alice', active: true },
        values: [10, 20, 30]
      },
      dependencies: [],
    },
    
    {
      id: 'simple-condition',
      type: 'condition',
      name: 'Simple Condition',
      inputs: {
        conditionType: 'simple',
        condition: true,
        thenValue: 'Condition passed!',
        elseValue: 'Condition failed!'
      },
      dependencies: ['condition-input'],
    },
    
    {
      id: 'compare-condition',
      type: 'condition',
      name: 'Compare Condition', 
      inputs: {
        conditionType: 'compare',
        left: 85,
        right: 80,
        operator: '>=',
        thenValue: 'Score is sufficient',
        elseValue: 'Score is too low'
      },
      dependencies: ['condition-input'],
    },
    
    {
      id: 'exists-condition',
      type: 'condition',
      name: 'Exists Condition',
      inputs: {
        conditionType: 'exists',
        checkValue: { name: 'Alice', active: true },
        checkType: 'defined'
      },
      dependencies: ['condition-input'],
    },
    
    {
      id: 'range-condition',
      type: 'condition',
      name: 'Range Condition',
      inputs: {
        conditionType: 'range',
        value: 85,
        min: 70,
        max: 100,
        inclusive: true
      },
      dependencies: ['condition-input'],
    },
  ],
  {
    description: 'Demonstrates conditional execution patterns',
    version: '1.0.0',
  }
);

/**
 * Workflow demonstrating merge operations
 */
const mergeOperationsWorkflow = createWorkflow(
  'merge-operations-demo',
  'Merge Operations Demonstration',
  [
    // Create multiple parallel tasks
    {
      id: 'task-a',
      type: 'data',
      name: 'Task A',
      inputs: { result: 'Success A', status: 'completed' },
      dependencies: [],
    },
    
    {
      id: 'task-b',
      type: 'data', 
      name: 'Task B',
      inputs: { result: 'Success B', status: 'completed' },
      dependencies: [],
    },
    
    {
      id: 'task-c',
      type: 'data',
      name: 'Task C', 
      inputs: { result: 'Success C', status: 'completed' },
      dependencies: [],
    },
    
    {
      id: 'task-d',
      type: 'data',
      name: 'Task D',
      inputs: { result: 'Failure D', status: 'failed' },
      dependencies: [],
    },
    
    // Merge all - requires all to succeed
    {
      id: 'merge-all',
      type: 'merge-all',
      name: 'Merge All Dependencies',
      inputs: {
        strict: false,  // Don't fail if some dependencies fail
        dependencyResults: {
          'task-a': { status: 'completed' },
          'task-b': { status: 'completed' },
          'task-c': { status: 'completed' },
        }
      },
      dependencies: ['task-a', 'task-b', 'task-c'],
    },
    
    // Merge any - requires at least one to succeed
    {
      id: 'merge-any',
      type: 'merge-any',
      name: 'Merge Any Dependencies',
      inputs: {
        strict: false,
        dependencyResults: {
          'task-a': { status: 'completed' },
          'task-b': { status: 'completed' }, 
          'task-d': { status: 'failed' },
        }
      },
      dependencies: ['task-a', 'task-b', 'task-d'],
    },
    
    // Merge majority - requires majority to succeed
    {
      id: 'merge-majority',
      type: 'merge-majority', 
      name: 'Merge Majority Dependencies',
      inputs: {
        strict: false,
        dependencyResults: {
          'task-a': { status: 'completed' },
          'task-b': { status: 'completed' },
          'task-c': { status: 'completed' },
          'task-d': { status: 'failed' },
        }
      },
      dependencies: ['task-a', 'task-b', 'task-c', 'task-d'],
    },
    
    // Merge count - requires specific number to succeed
    {
      id: 'merge-count',
      type: 'merge-count',
      name: 'Merge Count Dependencies',
      inputs: {
        requiredCount: 2,
        strict: false,
        dependencyResults: {
          'task-a': { status: 'completed' },
          'task-b': { status: 'completed' },
          'task-d': { status: 'failed' },
        }
      },
      dependencies: ['task-a', 'task-b', 'task-d'],
    },
  ],
  {
    description: 'Demonstrates merge strategies for workflow control',
    version: '1.0.0',
  }
);

// ================================
// Example Execution Functions
// ================================

export async function runLogicalOperationsExample() {
  console.log('🧠 Running Logical Operations Example...\n');
  
  const config: FlowsConfig = {
    storage: { type: StorageType.MEMORY },
    logging: { level: 'info' },
  };

  const executor = new DefaultNodeExecutor({
    enableSubflows: false,
    plugins: allBuiltInPlugins.filter(p => p.nodeType.startsWith('logic-')),
  });
  
  const flows = createFlows(config, executor);

  try {
    const result = await flows.startWorkflow(logicalOperationsWorkflow);
    
    console.log('✅ Logical Operations Workflow completed!');
    console.log('📊 Results:');
    Object.entries(result.nodeResults).forEach(([nodeId, nodeResult]) => {
      console.log(`  ${nodeId}:`, (nodeResult as any)?.result || nodeResult);
    });
    
    return result;
  } catch (error) {
    console.error('❌ Logical Operations Workflow failed:', error);
    throw error;
  } finally {
    flows.dispose();
  }
}

export async function runMathOperationsExample() {
  console.log('🧮 Running Mathematical Operations Example...\n');
  
  const config: FlowsConfig = {
    storage: { type: StorageType.MEMORY },
    logging: { level: 'info' },
  };

  const executor = new DefaultNodeExecutor({
    enableSubflows: false,
    plugins: allBuiltInPlugins.filter(p => p.nodeType.startsWith('math-')),
  });
  
  const flows = createFlows(config, executor);

  try {
    const result = await flows.startWorkflow(mathOperationsWorkflow);
    
    console.log('✅ Math Operations Workflow completed!');
    console.log('📊 Results:');
    Object.entries(result.nodeResults).forEach(([nodeId, nodeResult]) => {
      console.log(`  ${nodeId}:`, (nodeResult as any)?.result || nodeResult);
    });
    
    return result;
  } catch (error) {
    console.error('❌ Math Operations Workflow failed:', error);
    throw error;
  } finally {
    flows.dispose();
  }
}

export async function runStringOperationsExample() {
  console.log('📝 Running String Operations Example...\n');
  
  const config: FlowsConfig = {
    storage: { type: StorageType.MEMORY },
    logging: { level: 'info' },
  };

  const executor = new DefaultNodeExecutor({
    enableSubflows: false,
    plugins: allBuiltInPlugins.filter(p => p.nodeType.startsWith('string-')),
  });
  
  const flows = createFlows(config, executor);

  try {
    const result = await flows.startWorkflow(stringOperationsWorkflow);
    
    console.log('✅ String Operations Workflow completed!');
    console.log('📊 Results:');
    Object.entries(result.nodeResults).forEach(([nodeId, nodeResult]) => {
      console.log(`  ${nodeId}:`, (nodeResult as any)?.result || nodeResult);
    });
    
    return result;
  } catch (error) {
    console.error('❌ String Operations Workflow failed:', error);
    throw error;
  } finally {
    flows.dispose();
  }
}

export async function runConditionalExample() {
  console.log('🔀 Running Conditional Execution Example...\n');
  
  const config: FlowsConfig = {
    storage: { type: StorageType.MEMORY },
    logging: { level: 'info' },
  };

  const executor = new DefaultNodeExecutor({
    enableSubflows: false,
    plugins: allBuiltInPlugins.filter(p => p.nodeType === 'condition'),
  });
  
  const flows = createFlows(config, executor);

  try {
    const result = await flows.startWorkflow(conditionalWorkflow);
    
    console.log('✅ Conditional Workflow completed!');
    console.log('📊 Results:');
    Object.entries(result.nodeResults).forEach(([nodeId, nodeResult]) => {
      const resultData = nodeResult as any;
      console.log(`  ${nodeId}:`, {
        conditionResult: resultData.conditionResult,
        branch: resultData.branch,
        result: resultData.result
      });
    });
    
    return result;
  } catch (error) {
    console.error('❌ Conditional Workflow failed:', error);
    throw error;
  } finally {
    flows.dispose();
  }
}

export async function runMergeOperationsExample() {
  console.log('🔗 Running Merge Operations Example...\n');
  
  const config: FlowsConfig = {
    storage: { type: StorageType.MEMORY },
    logging: { level: 'info' },
  };

  const executor = new DefaultNodeExecutor({
    enableSubflows: false,
    plugins: allBuiltInPlugins.filter(p => p.nodeType.startsWith('merge-')),
  });
  
  const flows = createFlows(config, executor);

  try {
    const result = await flows.startWorkflow(mergeOperationsWorkflow);
    
    console.log('✅ Merge Operations Workflow completed!');
    console.log('📊 Results:');
    Object.entries(result.nodeResults).forEach(([nodeId, nodeResult]) => {
      if (nodeId.startsWith('merge-')) {
        const resultData = nodeResult as any;
        console.log(`  ${nodeId}:`, {
          strategy: resultData.mergeStrategy,
          successCount: resultData.result?.successCount || 'N/A',
          dependencyCount: resultData.result?.dependencyCount || 'N/A'
        });
      }
    });
    
    return result;
  } catch (error) {
    console.error('❌ Merge Operations Workflow failed:', error);
    throw error;
  } finally {
    flows.dispose();
  }
}

export async function runAllHandlersExample() {
  console.log('🚀 Running Comprehensive Handlers Example...\n');
  
  const config: FlowsConfig = {
    storage: { type: StorageType.MEMORY },
    logging: { level: 'info' },
  };

  const executor = new DefaultNodeExecutor({
    enableSubflows: false,
    plugins: allBuiltInPlugins,
  });
  
  const flows = createFlows(config, executor);

  console.log('📋 Available Node Types:');
  const availableTypes = executor.getAvailableNodeTypes();
  const metadata = getPluginMetadata();
  
  availableTypes.forEach(nodeType => {
    const meta = metadata[nodeType];
    if (meta) {
      console.log(`  📦 ${nodeType}: ${meta.description}`);
    }
  });
  
  console.log('\n🎯 Executing individual examples...\n');
  
  try {
    await runLogicalOperationsExample();
    console.log('\n' + '─'.repeat(50) + '\n');
    
    await runMathOperationsExample();
    console.log('\n' + '─'.repeat(50) + '\n');
    
    await runStringOperationsExample();
    console.log('\n' + '─'.repeat(50) + '\n');
    
    await runConditionalExample();
    console.log('\n' + '─'.repeat(50) + '\n');
    
    await runMergeOperationsExample();
    
    console.log('\n✨ All handler examples completed successfully!');
    
  } catch (error) {
    console.error('💥 Comprehensive handlers example failed:', error);
    throw error;
  } finally {
    flows.dispose();
  }
}

// ================================
// Main Execution Block
// ================================

async function main() {
  try {
    await runAllHandlersExample();
    console.log('\n🎉 Comprehensive handlers demonstration completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('\n💥 Comprehensive handlers demonstration failed:', error);
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