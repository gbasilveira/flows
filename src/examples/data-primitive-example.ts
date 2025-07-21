/**
 * Comprehensive example demonstrating all data primitive handlers:
 * - Number operations (parse, format, validate, range, round, clamp)
 * - String operations (parse, validate, encode, decode, format, sanitize)
 * - Array operations (create, filter, map, reduce, sort, flatten, unique, chunk, slice, join)
 * - Object operations (create, get, set, merge, clone, keys, values, entries, pick, omit, freeze)
 * - Boolean operations (parse, validate)
 * - JSON operations (parse, stringify, validate, schema-validate)
 * - Type checking operations (check, convert, validate)
 * - Data validation operations (is-null, is-undefined, is-empty, is-valid, default)
 */
import {
  createFlows,
  createWorkflow,
  StorageType,
  DefaultNodeExecutor,
  type FlowsConfig,
} from '../index.js';
import { dataPrimitivePlugins, getPluginMetadata } from '../core/built-in-plugins.js';

// ================================
// Example Workflows
// ================================

/**
 * Workflow demonstrating number operations
 */
const numberOperationsWorkflow = createWorkflow(
  'number-operations-demo',
  'Number Operations Demonstration',
  [
    {
      id: 'input-data',
      type: 'data',
      name: 'Input Data',
      inputs: { 
        stringNumber: '42.5',
        booleanValue: true,
        invalidNumber: 'not-a-number',
        largeNumber: 1234567.89,
        rangeStart: 1,
        rangeEnd: 10,
        rangeStep: 2,
        valueToRound: 3.14159,
        valueToClamp: 15,
        minValue: 0,
        maxValue: 10
      },
      dependencies: [],
    },
    
    {
      id: 'parse-number',
      type: 'number-parse',
      name: 'Parse Number',
      inputs: { 
        value: '42.5',
        fallback: 0
      },
      dependencies: ['input-data'],
    },
    
    {
      id: 'format-number',
      type: 'number-format',
      name: 'Format Number',
      inputs: { 
        value: 1234567.89,
        locale: 'en-GB',
        options: { style: 'currency', currency: 'GBP' }
      },
      dependencies: ['input-data'],
    },
    
    {
      id: 'validate-number',
      type: 'number-validate',
      name: 'Validate Number',
      inputs: { 
        value: 42,
        min: 0,
        max: 100,
        allowNaN: false,
        allowInfinity: false
      },
      dependencies: ['input-data'],
    },
    
    {
      id: 'number-range',
      type: 'number-range',
      name: 'Number Range',
      inputs: { 
        start: 1,
        end: 10,
        step: 2
      },
      dependencies: ['input-data'],
    },
    
    {
      id: 'round-number',
      type: 'number-round',
      name: 'Round Number',
      inputs: { 
        value: 3.14159,
        method: 'round',
        precision: 2
      },
      dependencies: ['input-data'],
    },
    
    {
      id: 'clamp-number',
      type: 'number-clamp',
      name: 'Clamp Number',
      inputs: { 
        value: 15,
        min: 0,
        max: 10
      },
      dependencies: ['input-data'],
    },
  ],
  {
    description: 'Demonstrates number manipulation operations',
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
      id: 'input-data',
      type: 'data',
      name: 'Input Data',
      inputs: { 
        numberValue: 42,
        booleanValue: true,
        htmlString: '<p>Hello <script>alert("xss")</script> World!</p>',
        templateString: 'Hello {name}, you are {age} years old',
        templateValues: { name: 'Alice', age: 30 }
      },
      dependencies: [],
    },
    
    {
      id: 'parse-string',
      type: 'string-parse',
      name: 'Parse String',
      inputs: { 
        value: 42
      },
      dependencies: ['input-data'],
    },
    
    {
      id: 'validate-string',
      type: 'string-validate',
      name: 'Validate String',
      inputs: { 
        value: 'test@example.com',
        minLength: 5,
        maxLength: 50,
        pattern: '^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$',
        allowEmpty: false
      },
      dependencies: ['input-data'],
    },
    
    {
      id: 'encode-string',
      type: 'string-encode',
      name: 'Encode String',
      inputs: { 
        value: 'Hello World!',
        encoding: 'base64'
      },
      dependencies: ['input-data'],
    },
    
    {
      id: 'decode-string',
      type: 'string-decode',
      name: 'Decode String',
      inputs: { 
        value: 'SGVsbG8gV29ybGQh',
        encoding: 'base64'
      },
      dependencies: ['input-data'],
    },
    
    {
      id: 'format-string',
      type: 'string-format',
      name: 'Format String',
      inputs: { 
        template: 'Hello {name}, you are {age} years old',
        values: { name: 'Alice', age: 30 }
      },
      dependencies: ['input-data'],
    },
    
    {
      id: 'sanitize-string',
      type: 'string-sanitize',
      name: 'Sanitize String',
      inputs: { 
        value: '<p>Hello <script>alert("xss")</script> World!</p>',
        removeHtml: true,
        removeScripts: true,
        normalizeWhitespace: true
      },
      dependencies: ['input-data'],
    },
  ],
  {
    description: 'Demonstrates string manipulation operations',
    version: '1.0.0',
  }
);

/**
 * Workflow demonstrating array operations
 */
const arrayOperationsWorkflow = createWorkflow(
  'array-operations-demo',
  'Array Operations Demonstration',
  [
    {
      id: 'input-data',
      type: 'data',
      name: 'Input Data',
      inputs: { 
        numbers: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
        mixedArray: [1, 'hello', true, null, undefined, 2, 'world', false],
        nestedArray: [[1, 2], [3, 4], [5, 6]],
        objects: [
          { id: 1, name: 'Alice', age: 30 },
          { id: 2, name: 'Bob', age: 25 },
          { id: 3, name: 'Charlie', age: 35 }
        ]
      },
      dependencies: [],
    },
    
    {
      id: 'create-array',
      type: 'array-create',
      name: 'Create Array',
      inputs: { 
        length: 5,
        fillValue: 'default'
      },
      dependencies: ['input-data'],
    },
    
    {
      id: 'filter-array',
      type: 'array-filter',
      name: 'Filter Array',
      inputs: { 
        array: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
        condition: 'truthy'
      },
      dependencies: ['input-data'],
    },
    
    {
      id: 'map-array',
      type: 'array-map',
      name: 'Map Array',
      inputs: { 
        array: [1, 2, 3, 4, 5],
        operation: 'toString'
      },
      dependencies: ['input-data'],
    },
    
    {
      id: 'reduce-array',
      type: 'array-reduce',
      name: 'Reduce Array',
      inputs: { 
        array: [1, 2, 3, 4, 5],
        operation: 'sum',
        initialValue: 0
      },
      dependencies: ['input-data'],
    },
    
    {
      id: 'sort-array',
      type: 'array-sort',
      name: 'Sort Array',
      inputs: { 
        array: [3, 1, 4, 1, 5, 9, 2, 6],
        direction: 'asc'
      },
      dependencies: ['input-data'],
    },
    
    {
      id: 'flatten-array',
      type: 'array-flatten',
      name: 'Flatten Array',
      inputs: { 
        array: [[1, 2], [3, 4], [5, 6]],
        depth: 1
      },
      dependencies: ['input-data'],
    },
    
    {
      id: 'unique-array',
      type: 'array-unique',
      name: 'Unique Array',
      inputs: { 
        array: [1, 2, 2, 3, 3, 3, 4, 4, 4, 4]
      },
      dependencies: ['input-data'],
    },
    
    {
      id: 'chunk-array',
      type: 'array-chunk',
      name: 'Chunk Array',
      inputs: { 
        array: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
        size: 3
      },
      dependencies: ['input-data'],
    },
    
    {
      id: 'slice-array',
      type: 'array-slice',
      name: 'Slice Array',
      inputs: { 
        array: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
        start: 2,
        end: 7
      },
      dependencies: ['input-data'],
    },
    
    {
      id: 'join-array',
      type: 'array-join',
      name: 'Join Array',
      inputs: { 
        array: ['Hello', 'World', '!'],
        separator: ' '
      },
      dependencies: ['input-data'],
    },
  ],
  {
    description: 'Demonstrates array manipulation operations',
    version: '1.0.0',
  }
);

/**
 * Workflow demonstrating object operations
 */
const objectOperationsWorkflow = createWorkflow(
  'object-operations-demo',
  'Object Operations Demonstration',
  [
    {
      id: 'input-data',
      type: 'data',
      name: 'Input Data',
      inputs: { 
        user: { id: 1, name: 'Alice', age: 30, email: 'alice@example.com' },
        settings: { theme: 'dark', language: 'en' },
        permissions: { read: true, write: false, admin: false }
      },
      dependencies: [],
    },
    
    {
      id: 'create-object',
      type: 'object-create',
      name: 'Create Object',
      inputs: { 
        properties: { name: 'John', age: 25, city: 'London' }
      },
      dependencies: ['input-data'],
    },
    
    {
      id: 'get-object-property',
      type: 'object-get',
      name: 'Get Object Property',
      inputs: { 
        object: { user: { profile: { name: 'Alice' } } },
        path: 'user.profile.name',
        defaultValue: 'Unknown'
      },
      dependencies: ['input-data'],
    },
    
    {
      id: 'set-object-property',
      type: 'object-set',
      name: 'Set Object Property',
      inputs: { 
        object: { user: { name: 'Alice' } },
        path: 'user.age',
        value: 31
      },
      dependencies: ['input-data'],
    },
    
    {
      id: 'merge-objects',
      type: 'object-merge',
      name: 'Merge Objects',
      inputs: { 
        objects: [
          { name: 'Alice', age: 30 },
          { city: 'London', country: 'UK' },
          { email: 'alice@example.com' }
        ],
        deep: true
      },
      dependencies: ['input-data'],
    },
    
    {
      id: 'clone-object',
      type: 'object-clone',
      name: 'Clone Object',
      inputs: { 
        object: { user: { name: 'Alice', settings: { theme: 'dark' } } },
        deep: true
      },
      dependencies: ['input-data'],
    },
    
    {
      id: 'object-keys',
      type: 'object-keys',
      name: 'Object Keys',
      inputs: { 
        object: { id: 1, name: 'Alice', age: 30, email: 'alice@example.com' }
      },
      dependencies: ['input-data'],
    },
    
    {
      id: 'object-values',
      type: 'object-values',
      name: 'Object Values',
      inputs: { 
        object: { id: 1, name: 'Alice', age: 30, email: 'alice@example.com' }
      },
      dependencies: ['input-data'],
    },
    
    {
      id: 'object-entries',
      type: 'object-entries',
      name: 'Object Entries',
      inputs: { 
        object: { id: 1, name: 'Alice', age: 30, email: 'alice@example.com' }
      },
      dependencies: ['input-data'],
    },
    
    {
      id: 'pick-object-properties',
      type: 'object-pick',
      name: 'Pick Object Properties',
      inputs: { 
        object: { id: 1, name: 'Alice', age: 30, email: 'alice@example.com' },
        keys: ['name', 'email']
      },
      dependencies: ['input-data'],
    },
    
    {
      id: 'omit-object-properties',
      type: 'object-omit',
      name: 'Omit Object Properties',
      inputs: { 
        object: { id: 1, name: 'Alice', age: 30, email: 'alice@example.com' },
        keys: ['id', 'age']
      },
      dependencies: ['input-data'],
    },
    
    {
      id: 'freeze-object',
      type: 'object-freeze',
      name: 'Freeze Object',
      inputs: { 
        object: { name: 'Alice', age: 30 },
        deep: true
      },
      dependencies: ['input-data'],
    },
  ],
  {
    description: 'Demonstrates object manipulation operations',
    version: '1.0.0',
  }
);

/**
 * Workflow demonstrating boolean operations
 */
const booleanOperationsWorkflow = createWorkflow(
  'boolean-operations-demo',
  'Boolean Operations Demonstration',
  [
    {
      id: 'input-data',
      type: 'data',
      name: 'Input Data',
      inputs: { 
        stringTrue: 'true',
        stringFalse: 'false',
        numberOne: 1,
        numberZero: 0,
        stringYes: 'yes',
        stringNo: 'no'
      },
      dependencies: [],
    },
    
    {
      id: 'parse-boolean',
      type: 'boolean-parse',
      name: 'Parse Boolean',
      inputs: { 
        value: 'true',
        fallback: false
      },
      dependencies: ['input-data'],
    },
    
    {
      id: 'validate-boolean',
      type: 'boolean-validate',
      name: 'Validate Boolean',
      inputs: { 
        value: 'yes'
      },
      dependencies: ['input-data'],
    },
  ],
  {
    description: 'Demonstrates boolean manipulation operations',
    version: '1.0.0',
  }
);

/**
 * Workflow demonstrating JSON operations
 */
const jsonOperationsWorkflow = createWorkflow(
  'json-operations-demo',
  'JSON Operations Demonstration',
  [
    {
      id: 'input-data',
      type: 'data',
      name: 'Input Data',
      inputs: { 
        jsonString: '{"name":"Alice","age":30,"city":"London"}',
        invalidJson: '{"name":"Alice","age":30,}',
        complexObject: { user: { name: 'Alice', settings: { theme: 'dark' } } }
      },
      dependencies: [],
    },
    
    {
      id: 'parse-json',
      type: 'json-parse',
      name: 'Parse JSON',
      inputs: { 
        value: '{"name":"Alice","age":30,"city":"London"}',
        fallback: {}
      },
      dependencies: ['input-data'],
    },
    
    {
      id: 'stringify-json',
      type: 'json-stringify',
      name: 'Stringify JSON',
      inputs: { 
        value: { name: 'Alice', age: 30, city: 'London' },
        space: 2
      },
      dependencies: ['input-data'],
    },
    
    {
      id: 'validate-json',
      type: 'json-validate',
      name: 'Validate JSON',
      inputs: { 
        value: '{"name":"Alice","age":30,"city":"London"}'
      },
      dependencies: ['input-data'],
    },
    
    {
      id: 'schema-validate-json',
      type: 'json-schema-validate',
      name: 'Schema Validate JSON',
      inputs: { 
        value: { name: 'Alice', age: 30 },
        schema: { type: 'object', properties: { name: { type: 'string' }, age: { type: 'number' } } }
      },
      dependencies: ['input-data'],
    },
  ],
  {
    description: 'Demonstrates JSON manipulation operations',
    version: '1.0.0',
  }
);

/**
 * Workflow demonstrating type checking operations
 */
const typeCheckingWorkflow = createWorkflow(
  'type-checking-demo',
  'Type Checking Demonstration',
  [
    {
      id: 'input-data',
      type: 'data',
      name: 'Input Data',
      inputs: { 
        stringValue: 'Hello',
        numberValue: 42,
        booleanValue: true,
        arrayValue: [1, 2, 3],
        objectValue: { name: 'Alice' },
        nullValue: null,
        undefinedValue: undefined
      },
      dependencies: [],
    },
    
    {
      id: 'check-type',
      type: 'type-check',
      name: 'Check Type',
      inputs: { 
        value: 'Hello'
      },
      dependencies: ['input-data'],
    },
    
    {
      id: 'convert-type',
      type: 'type-convert',
      name: 'Convert Type',
      inputs: { 
        value: 42,
        targetType: 'string'
      },
      dependencies: ['input-data'],
    },
    
    {
      id: 'validate-type',
      type: 'type-validate',
      name: 'Validate Type',
      inputs: { 
        value: 'Hello',
        expectedType: 'string'
      },
      dependencies: ['input-data'],
    },
  ],
  {
    description: 'Demonstrates type checking operations',
    version: '1.0.0',
  }
);

/**
 * Workflow demonstrating data validation operations
 */
const dataValidationWorkflow = createWorkflow(
  'data-validation-demo',
  'Data Validation Demonstration',
  [
    {
      id: 'input-data',
      type: 'data',
      name: 'Input Data',
      inputs: { 
        nullValue: null,
        undefinedValue: undefined,
        emptyString: '',
        emptyArray: [],
        emptyObject: {},
        validValue: 'Hello World',
        falsyValue: 0
      },
      dependencies: [],
    },
    
    {
      id: 'is-null',
      type: 'data-is-null',
      name: 'Is Null',
      inputs: { 
        value: null
      },
      dependencies: ['input-data'],
    },
    
    {
      id: 'is-undefined',
      type: 'data-is-undefined',
      name: 'Is Undefined',
      inputs: { 
        value: undefined
      },
      dependencies: ['input-data'],
    },
    
    {
      id: 'is-empty',
      type: 'data-is-empty',
      name: 'Is Empty',
      inputs: { 
        value: ''
      },
      dependencies: ['input-data'],
    },
    
    {
      id: 'is-valid',
      type: 'data-is-valid',
      name: 'Is Valid',
      inputs: { 
        value: 'Hello World',
        criteria: 'not-empty'
      },
      dependencies: ['input-data'],
    },
    
    {
      id: 'data-default',
      type: 'data-default',
      name: 'Data Default',
      inputs: { 
        value: null,
        defaultValue: 'Default Value',
        fallbackIf: 'null-undefined'
      },
      dependencies: ['input-data'],
    },
  ],
  {
    description: 'Demonstrates data validation operations',
    version: '1.0.0',
  }
);

// ================================
// Example Execution Functions
// ================================

async function runNumberOperationsExample() {
  console.log('🔢 Running Number Operations Example...\n');
  
  const config: FlowsConfig = {
    storage: { type: StorageType.MEMORY },
    logging: { level: 'info' },
  };

  const executor = new DefaultNodeExecutor({
    enableSubflows: false,
    plugins: dataPrimitivePlugins,
  });
  
  const flows = createFlows(config, executor);

  try {
    const result = await flows.startWorkflow(numberOperationsWorkflow);
    console.log('✅ Number operations completed successfully!');
    console.log('📊 Results:', JSON.stringify(result, null, 2));
  } catch (error) {
    console.error('💥 Number operations failed:', error);
    throw error;
  } finally {
    flows.dispose();
  }
}

async function runStringOperationsExample() {
  console.log('📝 Running String Operations Example...\n');
  
  const config: FlowsConfig = {
    storage: { type: StorageType.MEMORY },
    logging: { level: 'info' },
  };

  const executor = new DefaultNodeExecutor({
    enableSubflows: false,
    plugins: dataPrimitivePlugins,
  });
  
  const flows = createFlows(config, executor);

  try {
    const result = await flows.startWorkflow(stringOperationsWorkflow);
    console.log('✅ String operations completed successfully!');
    console.log('📊 Results:', JSON.stringify(result, null, 2));
  } catch (error) {
    console.error('💥 String operations failed:', error);
    throw error;
  } finally {
    flows.dispose();
  }
}

async function runArrayOperationsExample() {
  console.log('📦 Running Array Operations Example...\n');
  
  const config: FlowsConfig = {
    storage: { type: StorageType.MEMORY },
    logging: { level: 'info' },
  };

  const executor = new DefaultNodeExecutor({
    enableSubflows: false,
    plugins: dataPrimitivePlugins,
  });
  
  const flows = createFlows(config, executor);

  try {
    const result = await flows.startWorkflow(arrayOperationsWorkflow);
    console.log('✅ Array operations completed successfully!');
    console.log('📊 Results:', JSON.stringify(result, null, 2));
  } catch (error) {
    console.error('💥 Array operations failed:', error);
    throw error;
  } finally {
    flows.dispose();
  }
}

async function runObjectOperationsExample() {
  console.log('🏗️ Running Object Operations Example...\n');
  
  const config: FlowsConfig = {
    storage: { type: StorageType.MEMORY },
    logging: { level: 'info' },
  };

  const executor = new DefaultNodeExecutor({
    enableSubflows: false,
    plugins: dataPrimitivePlugins,
  });
  
  const flows = createFlows(config, executor);

  try {
    const result = await flows.startWorkflow(objectOperationsWorkflow);
    console.log('✅ Object operations completed successfully!');
    console.log('📊 Results:', JSON.stringify(result, null, 2));
  } catch (error) {
    console.error('💥 Object operations failed:', error);
    throw error;
  } finally {
    flows.dispose();
  }
}

async function runBooleanOperationsExample() {
  console.log('🔘 Running Boolean Operations Example...\n');
  
  const config: FlowsConfig = {
    storage: { type: StorageType.MEMORY },
    logging: { level: 'info' },
  };

  const executor = new DefaultNodeExecutor({
    enableSubflows: false,
    plugins: dataPrimitivePlugins,
  });
  
  const flows = createFlows(config, executor);

  try {
    const result = await flows.startWorkflow(booleanOperationsWorkflow);
    console.log('✅ Boolean operations completed successfully!');
    console.log('📊 Results:', JSON.stringify(result, null, 2));
  } catch (error) {
    console.error('💥 Boolean operations failed:', error);
    throw error;
  } finally {
    flows.dispose();
  }
}

async function runJsonOperationsExample() {
  console.log('📄 Running JSON Operations Example...\n');
  
  const config: FlowsConfig = {
    storage: { type: StorageType.MEMORY },
    logging: { level: 'info' },
  };

  const executor = new DefaultNodeExecutor({
    enableSubflows: false,
    plugins: dataPrimitivePlugins,
  });
  
  const flows = createFlows(config, executor);

  try {
    const result = await flows.startWorkflow(jsonOperationsWorkflow);
    console.log('✅ JSON operations completed successfully!');
    console.log('📊 Results:', JSON.stringify(result, null, 2));
  } catch (error) {
    console.error('💥 JSON operations failed:', error);
    throw error;
  } finally {
    flows.dispose();
  }
}

async function runTypeCheckingExample() {
  console.log('🔍 Running Type Checking Example...\n');
  
  const config: FlowsConfig = {
    storage: { type: StorageType.MEMORY },
    logging: { level: 'info' },
  };

  const executor = new DefaultNodeExecutor({
    enableSubflows: false,
    plugins: dataPrimitivePlugins,
  });
  
  const flows = createFlows(config, executor);

  try {
    const result = await flows.startWorkflow(typeCheckingWorkflow);
    console.log('✅ Type checking completed successfully!');
    console.log('📊 Results:', JSON.stringify(result, null, 2));
  } catch (error) {
    console.error('💥 Type checking failed:', error);
    throw error;
  } finally {
    flows.dispose();
  }
}

async function runDataValidationExample() {
  console.log('✅ Running Data Validation Example...\n');
  
  const config: FlowsConfig = {
    storage: { type: StorageType.MEMORY },
    logging: { level: 'info' },
  };

  const executor = new DefaultNodeExecutor({
    enableSubflows: false,
    plugins: dataPrimitivePlugins,
  });
  
  const flows = createFlows(config, executor);

  try {
    const result = await flows.startWorkflow(dataValidationWorkflow);
    console.log('✅ Data validation completed successfully!');
    console.log('📊 Results:', JSON.stringify(result, null, 2));
  } catch (error) {
    console.error('💥 Data validation failed:', error);
    throw error;
  } finally {
    flows.dispose();
  }
}

export async function runDataPrimitiveExample() {
  console.log('🚀 Running Data Primitive Handlers Example...\n');
  
  const config: FlowsConfig = {
    storage: { type: StorageType.MEMORY },
    logging: { level: 'info' },
  };

  const executor = new DefaultNodeExecutor({
    enableSubflows: false,
    plugins: dataPrimitivePlugins,
  });
  
  const flows = createFlows(config, executor);

  console.log('📋 Available Data Primitive Node Types:');
  const availableTypes = executor.getAvailableNodeTypes();
  const metadata = getPluginMetadata();
  
  availableTypes.forEach(nodeType => {
    if (nodeType.includes('-') && !nodeType.startsWith('logic-') && !nodeType.startsWith('math-') && !nodeType.startsWith('string-') && !nodeType.startsWith('condition') && !nodeType.startsWith('merge-')) {
      const meta = metadata[nodeType];
      if (meta) {
        console.log(`  📦 ${nodeType}: ${meta.description}`);
      }
    }
  });
  
  console.log('\n🎯 Executing individual examples...\n');
  
  try {
    await runNumberOperationsExample();
    console.log('\n' + '─'.repeat(50) + '\n');
    
    await runStringOperationsExample();
    console.log('\n' + '─'.repeat(50) + '\n');
    
    await runArrayOperationsExample();
    console.log('\n' + '─'.repeat(50) + '\n');
    
    await runObjectOperationsExample();
    console.log('\n' + '─'.repeat(50) + '\n');
    
    await runBooleanOperationsExample();
    console.log('\n' + '─'.repeat(50) + '\n');
    
    await runJsonOperationsExample();
    console.log('\n' + '─'.repeat(50) + '\n');
    
    await runTypeCheckingExample();
    console.log('\n' + '─'.repeat(50) + '\n');
    
    await runDataValidationExample();
    
    console.log('\n✨ All data primitive handler examples completed successfully!');
    
  } catch (error) {
    console.error('💥 Data primitive handlers example failed:', error);
    throw error;
  } finally {
    flows.dispose();
  }
} 