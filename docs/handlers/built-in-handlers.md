# Built-in Handlers Documentation

This document provides comprehensive documentation for all built-in handlers available in the Flows workflow system.

## Overview

Flows includes a rich set of built-in handlers that provide common workflow operations without requiring custom code. These handlers are categorised into:

- **Core Handlers**: Always available (`data`, `delay`, `subflow`)
- **Logical Operations**: Boolean logic operations (`logic-and`, `logic-or`, `logic-not`, `logic-xor`)
- **Mathematical Operations**: Arithmetic operations (`math-add`, `math-subtract`, `math-multiply`, `math-divide`, `math-power`, `math-modulo`)
- **String Operations**: Text manipulation (`string-concat`, `string-substring`, `string-replace`, `string-match`, `string-split`, `string-compare`, `string-length`, `string-case`)
- **Flow Control**: Workflow control (`condition`, `merge-all`, `merge-any`, `merge-majority`, `merge-count`)

## Core Handlers

### `data` - Data Pass-through Handler

**Purpose**: Passes data through the workflow, merging node inputs with runtime inputs.

**Usage**:
```typescript
{
  id: 'my-data',
  type: 'data',
  inputs: { message: 'Hello', status: 'active' },
  dependencies: [],
}
```

**Output**: Merged object containing both node inputs and runtime inputs.

---

### `delay` - Delay Handler

**Purpose**: Introduces a delay before continuing workflow execution.

**Configuration**:
- `delay` (number): Duration in milliseconds (default: 1000ms)

**Usage**:
```typescript
{
  id: 'wait-5-seconds',
  type: 'delay',
  inputs: { delay: 5000 },
  dependencies: ['previous-node'],
}
```

**Output**: 
```javascript
{
  delayed: true,
  duration: 5000,
  completedAt: "2023-12-07T10:30:00.000Z"
}
```

---

### `subflow` - Subflow Handler

**Purpose**: Executes another workflow as a sub-workflow.

**Requirements**: `enableSubflows: true` in NodeExecutor options.

**Configuration**:
- `workflowId` (WorkflowId): ID of the workflow to execute

**Usage**:
```typescript
{
  id: 'execute-subflow',
  type: 'subflow',
  inputs: { workflowId: 'sub-workflow-id' },
  dependencies: ['input-data'],
}
```

**Output**: Result from sub-workflow execution.

---

## Logical Operations

### `logic-and` - Boolean AND Operation

**Purpose**: Performs logical AND operation on multiple boolean values.

**Configuration**:
- `values` (unknown[]): Array of values to evaluate

**Usage**:
```typescript
{
  id: 'check-all-conditions',
  type: 'logic-and',
  inputs: { values: [true, true, false] },
  dependencies: [],
}
```

**Output**:
```javascript
{
  result: false,
  operation: 'and',
  inputValues: [true, true, false],
  evaluatedAt: "2023-12-07T10:30:00.000Z"
}
```

**Value Conversion Rules**:
- Booleans: Used as-is
- Numbers: `false` if 0 or NaN, otherwise `true`
- Strings: `false` if empty or "false", otherwise `true`
- Objects: `false` if empty, otherwise `true`
- null/undefined: `false`

---

### `logic-or` - Boolean OR Operation

**Purpose**: Performs logical OR operation on multiple boolean values.

**Configuration**: Same as `logic-and`

**Usage**:
```typescript
{
  id: 'check-any-condition',
  type: 'logic-or',
  inputs: { values: [false, false, true] },
  dependencies: [],
}
```

**Output**: Returns `true` if any value evaluates to `true`.

---

### `logic-not` - Boolean NOT Operation

**Purpose**: Performs logical NOT operation on a single boolean value.

**Configuration**:
- `values` (unknown[]): Array with exactly one value

**Usage**:
```typescript
{
  id: 'invert-condition',
  type: 'logic-not',
  inputs: { values: [false] },
  dependencies: [],
}
```

**Output**: Returns opposite boolean value.

---

### `logic-xor` - Boolean XOR Operation

**Purpose**: Performs logical XOR (exclusive or) operation on two boolean values.

**Configuration**:
- `values` (unknown[]): Array with exactly two values

**Usage**:
```typescript
{
  id: 'exclusive-check',
  type: 'logic-xor',
  inputs: { values: [true, false] },
  dependencies: [],
}
```

**Output**: Returns `true` if values are different, `false` if same.

---

## Mathematical Operations

### `math-add` - Addition Operation

**Purpose**: Adds multiple numeric values together.

**Configuration**:
- `values` (unknown[]): Array of numbers to add

**Usage**:
```typescript
{
  id: 'sum-values',
  type: 'math-add',
  inputs: { values: [10, 20, 30] },
  dependencies: [],
}
```

**Output**:
```javascript
{
  result: 60,
  operation: 'add',
  inputValues: [10, 20, 30],
  calculatedAt: "2023-12-07T10:30:00.000Z"
}
```

---

### `math-subtract` - Subtraction Operation

**Purpose**: Subtracts values from the first value sequentially.

**Configuration**:
- `values` (unknown[]): Array of numbers (minimum 2 required)

**Usage**:
```typescript
{
  id: 'subtract-values',
  type: 'math-subtract',
  inputs: { values: [100, 25, 10] }, // 100 - 25 - 10 = 65
  dependencies: [],
}
```

**Output**: Result of sequential subtraction.

---

### `math-multiply` - Multiplication Operation

**Purpose**: Multiplies multiple numeric values together.

**Configuration**:
- `values` (unknown[]): Array of numbers to multiply

**Usage**:
```typescript
{
  id: 'multiply-values',
  type: 'math-multiply',
  inputs: { values: [5, 4, 2] }, // 5 * 4 * 2 = 40
  dependencies: [],
}
```

**Output**: Product of all values.

---

### `math-divide` - Division Operation

**Purpose**: Divides first number by second number.

**Configuration**:
- `values` (unknown[]): Array with exactly 2 numbers [dividend, divisor]

**Usage**:
```typescript
{
  id: 'divide-values',
  type: 'math-divide',
  inputs: { values: [20, 4] }, // 20 / 4 = 5
  dependencies: [],
}
```

**Output**: Division result with zero-division protection.

---

### `math-power` - Exponentiation Operation

**Purpose**: Raises base to the power of exponent.

**Configuration**:
- `values` (unknown[]): Array with exactly 2 numbers [base, exponent]

**Usage**:
```typescript
{
  id: 'calculate-power',
  type: 'math-power',
  inputs: { values: [2, 8] }, // 2^8 = 256
  dependencies: [],
}
```

**Output**: Result of exponentiation.

---

### `math-modulo` - Modulo Operation

**Purpose**: Returns remainder after division.

**Configuration**:
- `values` (unknown[]): Array with exactly 2 numbers [dividend, divisor]

**Usage**:
```typescript
{
  id: 'get-remainder',
  type: 'math-modulo',
  inputs: { values: [17, 5] }, // 17 % 5 = 2
  dependencies: [],
}
```

**Output**: Remainder after division.

---

## String Operations

### `string-concat` - String Concatenation

**Purpose**: Joins multiple strings together with optional separator.

**Configuration**:
- `values` (unknown[]): Array of values to concatenate
- `separator` (string, optional): Separator between values (default: empty string)

**Usage**:
```typescript
{
  id: 'build-message',
  type: 'string-concat',
  inputs: { 
    values: ['Hello', 'Beautiful', 'World'],
    separator: ' '
  },
  dependencies: [],
}
```

**Output**:
```javascript
{
  result: "Hello Beautiful World",
  operation: 'concat',
  processedAt: "2023-12-07T10:30:00.000Z"
}
```

---

### `string-substring` - Substring Extraction

**Purpose**: Extracts part of a string using start and end positions.

**Configuration**:
- `text` (string): Source text
- `start` (number): Start position (default: 0)
- `end` (number, optional): End position

**Usage**:
```typescript
{
  id: 'extract-text',
  type: 'string-substring',
  inputs: { 
    text: 'Hello Beautiful World',
    start: 6,
    end: 15
  },
  dependencies: [],
}
```

**Output**: `"Beautiful"`

---

### `string-replace` - String Replacement

**Purpose**: Replaces text in a string with support for regex patterns.

**Configuration**:
- `text` (string): Source text
- `search` (string): Text or regex pattern to find
- `replacement` (string): Replacement text
- `useRegex` (boolean, optional): Whether to treat search as regex
- `global` (boolean, optional): Replace all occurrences

**Usage**:
```typescript
{
  id: 'replace-text',
  type: 'string-replace',
  inputs: { 
    text: 'Hello World, Hello Universe',
    search: 'Hello',
    replacement: 'Hi',
    global: true
  },
  dependencies: [],
}
```

**Output**: `"Hi World, Hi Universe"`

---

### `string-match` - Regex Matching

**Purpose**: Matches text against regex patterns and returns matches.

**Configuration**:
- `text` (string): Source text
- `pattern` (string): Regex pattern
- `flags` (string, optional): Regex flags (g, i, m, etc.)

**Usage**:
```typescript
{
  id: 'find-emails',
  type: 'string-match',
  inputs: { 
    text: 'Contact: user@example.com or admin@test.org',
    pattern: '[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}',
    flags: 'g'
  },
  dependencies: [],
}
```

**Output**:
```javascript
{
  result: {
    matches: ['user@example.com', 'admin@test.org'],
    found: true,
    matchCount: 2
  }
}
```

---

### `string-split` - String Splitting

**Purpose**: Splits a string into an array using a delimiter.

**Configuration**:
- `text` (string): Source text
- `delimiter` (string): Delimiter to split on
- `limit` (number, optional): Maximum number of splits

**Usage**:
```typescript
{
  id: 'split-csv',
  type: 'string-split',
  inputs: { 
    text: 'apple,banana,cherry,date',
    delimiter: ','
  },
  dependencies: [],
}
```

**Output**: `['apple', 'banana', 'cherry', 'date']`

---

### `string-compare` - String Comparison

**Purpose**: Compares two strings with optional case sensitivity.

**Configuration**:
- `text` (string): First string
- `compareWith` (string): Second string
- `caseSensitive` (boolean, optional): Case sensitive comparison (default: true)

**Usage**:
```typescript
{
  id: 'compare-strings',
  type: 'string-compare',
  inputs: { 
    text: 'Hello',
    compareWith: 'hello',
    caseSensitive: false
  },
  dependencies: [],
}
```

**Output**:
```javascript
{
  result: {
    result: 0,        // -1: less, 0: equal, 1: greater
    equal: true,
    comparison: 'equal to'
  }
}
```

---

### `string-length` - String Length

**Purpose**: Returns the length of a string.

**Configuration**:
- `text` (string): Source text

**Usage**:
```typescript
{
  id: 'get-length',
  type: 'string-length',
  inputs: { text: 'How long is this text?' },
  dependencies: [],
}
```

**Output**: `22`

---

### `string-case` - Case Transformation

**Purpose**: Transforms string case using different strategies.

**Configuration**:
- `text` (string): Source text
- `caseType` (string): Transformation type ('upper', 'lower', 'title', 'sentence')

**Usage**:
```typescript
{
  id: 'title-case',
  type: 'string-case',
  inputs: { 
    text: 'hello beautiful world',
    caseType: 'title'
  },
  dependencies: [],
}
```

**Output**: `"Hello Beautiful World"`

**Case Types**:
- `upper`: ALL UPPERCASE
- `lower`: all lowercase
- `title`: Title Case Each Word
- `sentence`: Sentence case with first letter capitalised

---

## Flow Control Operations

### `condition` - Conditional Execution

**Purpose**: Evaluates conditions and provides branching logic for workflows.

**Configuration**:
- `conditionType` (string): Type of condition ('simple', 'compare', 'exists', 'range')

#### Simple Condition
Tests basic truthfulness:
```typescript
{
  id: 'simple-check',
  type: 'condition',
  inputs: {
    conditionType: 'simple',
    condition: true,
    thenValue: 'Condition passed!',
    elseValue: 'Condition failed!'
  }
}
```

#### Compare Condition
Compares two values:
```typescript
{
  id: 'score-check',
  type: 'condition',
  inputs: {
    conditionType: 'compare',
    left: 85,
    right: 80,
    operator: '>=', // ===, !==, >, >=, <, <=, contains, starts_with, ends_with, matches
  }
}
```

#### Exists Condition
Checks value existence:
```typescript
{
  id: 'existence-check',
  type: 'condition',
  inputs: {
    conditionType: 'exists',
    checkValue: { name: 'Alice' },
    checkType: 'defined' // defined, empty, truthy
  }
}
```

#### Range Condition
Checks numeric ranges:
```typescript
{
  id: 'range-check',
  type: 'condition',
  inputs: {
    conditionType: 'range',
    value: 85,
    min: 70,
    max: 100,
    inclusive: true
  }
}
```

**Output**: Contains `conditionResult`, `branch` ('then'/'else'), and type-specific result data.

---

### `merge-all` - All Dependencies Strategy

**Purpose**: Waits for all dependencies to succeed before proceeding.

**Configuration**:
- `strict` (boolean, optional): Throw error if any dependency fails (default: true)
- `dependencyResults` (object): Results from dependency nodes

**Usage**:
```typescript
{
  id: 'wait-for-all',
  type: 'merge-all',
  inputs: {
    strict: false,
    dependencyResults: {
      'task-a': { status: 'completed' },
      'task-b': { status: 'completed' },
      'task-c': { status: 'completed' }
    }
  },
  dependencies: ['task-a', 'task-b', 'task-c']
}
```

**Output**:
```javascript
{
  result: {
    strategy: 'all',
    allSucceeded: true,
    dependencyCount: 3,
    successCount: 3,
    failureCount: 0
  }
}
```

---

### `merge-any` - Any Dependency Strategy

**Purpose**: Proceeds when any dependency succeeds.

**Configuration**: Same as `merge-all`

**Usage**: Same structure as `merge-all`

**Output**: Similar to `merge-all` but with `anySucceeded` and `firstSuccessful` properties.

---

### `merge-majority` - Majority Dependencies Strategy

**Purpose**: Proceeds when majority of dependencies succeed.

**Configuration**: Same as `merge-all`

**Usage**: Same structure as `merge-all`

**Output**: Similar to `merge-all` but with `majoritySucceeded` and `requiredSuccesses` properties.

---

### `merge-count` - Count Dependencies Strategy

**Purpose**: Proceeds when specific number of dependencies succeed.

**Configuration**:
- `requiredCount` (number): Required number of successful dependencies
- Other options same as `merge-all`

**Usage**:
```typescript
{
  id: 'wait-for-count',
  type: 'merge-count',
  inputs: {
    requiredCount: 2,
    strict: false,
    dependencyResults: {
      'task-a': { status: 'completed' },
      'task-b': { status: 'completed' },
      'task-c': { status: 'failed' }
    }
  },
  dependencies: ['task-a', 'task-b', 'task-c']
}
```

**Output**: Similar to `merge-all` but with `countMet` and `requiredCount` properties.

---

## Console Operations

Flows includes comprehensive console operation handlers for debugging, logging, and development purposes. These handlers provide various console operations that integrate seamlessly with workflow execution.

### Console Logging Operations

#### `console-log` - Console Log Operation

**Purpose**: Outputs messages to console.log with optional data and formatting.

**Configuration**:
- `message` (string): Message to log
- `data` (unknown): Optional data to log alongside message
- `options` (object): Optional formatting options
  - `timestamp` (boolean): Add timestamp prefix (default: false)
  - `prefix` (string): Custom prefix for the message

**Usage**:
```typescript
{
  id: 'log-user-info',
  type: 'console-log',
  inputs: {
    message: 'User registration started',
    data: { userId: '123', action: 'user-registration' },
    options: { timestamp: true, prefix: '[FLOWS]' }
  },
  dependencies: ['start'],
}
```

**Output**:
```javascript
{
  message: "[2023-12-07T10:30:00.000Z] [FLOWS] User registration started",
  data: { userId: '123', action: 'user-registration' },
  logged: true,
  operation: 'log',
  executedAt: "2023-12-07T10:30:00.000Z"
}
```

#### `console-error` - Console Error Operation

**Purpose**: Outputs error messages to console.error with optional data and formatting.

**Configuration**: Same as `console-log`

**Usage**:
```typescript
{
  id: 'log-error',
  type: 'console-error',
  inputs: {
    message: 'Invalid age format detected',
    data: { userId: '123', age: 'invalid-age' },
    options: { timestamp: true, prefix: '[ERROR]' }
  },
  dependencies: ['validate-data'],
}
```

**Output**:
```javascript
{
  message: "[2023-12-07T10:30:00.000Z] [ERROR] Invalid age format detected",
  data: { userId: '123', age: 'invalid-age' },
  error: true,
  operation: 'error',
  executedAt: "2023-12-07T10:30:00.000Z"
}
```

#### `console-warn` - Console Warning Operation

**Purpose**: Outputs warning messages to console.warn with optional data and formatting.

**Configuration**: Same as `console-log`

**Usage**:
```typescript
{
  id: 'log-warning',
  type: 'console-warn',
  inputs: {
    message: 'Email verification not completed',
    data: { userId: '123', email: 'john@example.com' },
    options: { timestamp: true, prefix: '[WARNING]' }
  },
  dependencies: ['check-email'],
}
```

#### `console-info` - Console Info Operation

**Purpose**: Outputs informational messages to console.info with optional data and formatting.

**Configuration**: Same as `console-log`

**Usage**:
```typescript
{
  id: 'log-success',
  type: 'console-info',
  inputs: {
    message: 'User registration completed successfully',
    data: { userId: '123', status: 'active' },
    options: { timestamp: true, prefix: '[SUCCESS]' }
  },
  dependencies: ['complete-registration'],
}
```

#### `console-debug` - Console Debug Operation

**Purpose**: Outputs debug messages to console.debug with optional data and formatting.

**Configuration**: Same as `console-log`

**Usage**:
```typescript
{
  id: 'log-debug',
  type: 'console-debug',
  inputs: {
    message: 'Processing user preferences',
    data: { preferences: ['dark-mode', 'notifications'] },
    options: { timestamp: true, prefix: '[DEBUG]' }
  },
  dependencies: ['load-preferences'],
}
```

### Console Table Operation

#### `console-table` - Console Table Operation

**Purpose**: Displays tabular data in the console using console.table.

**Configuration**:
- `data` (unknown): Data to display as table (required)
- `options` (object): Optional formatting options
  - `columns` (string[]): Specific columns to display

**Usage**:
```typescript
{
  id: 'log-user-table',
  type: 'console-table',
  inputs: {
    data: [
      { id: '123', name: 'John Doe', email: 'john@example.com', age: 30 },
      { id: '124', name: 'Jane Smith', email: 'jane@example.com', age: 28 }
    ],
    options: { columns: ['name', 'email', 'age'] }
  },
  dependencies: ['fetch-users'],
}
```

**Output**:
```javascript
{
  data: [...],
  columns: ['name', 'email', 'age'],
  table: true,
  rowCount: 2,
  operation: 'table',
  executedAt: "2023-12-07T10:30:00.000Z"
}
```

### Console Timing Operations

#### `console-time` - Console Time Operation

**Purpose**: Starts a timer for performance measurement using console.time.

**Configuration**:
- `message` (string): Timer label
- `options` (object): Optional configuration
  - `label` (string): Custom timer label

**Usage**:
```typescript
{
  id: 'start-timer',
  type: 'console-time',
  inputs: {
    message: 'workflow-execution',
    options: { label: 'workflow-execution' }
  },
  dependencies: [],
}
```

**Output**:
```javascript
{
  label: 'workflow-execution',
  timeStarted: true,
  startTime: "2023-12-07T10:30:00.000Z",
  operation: 'time',
  executedAt: "2023-12-07T10:30:00.000Z"
}
```

#### `console-timeend` - Console Time End Operation

**Purpose**: Ends a timer and displays elapsed time using console.timeEnd.

**Configuration**: Same as `console-time`

**Usage**:
```typescript
{
  id: 'end-timer',
  type: 'console-timeend',
  inputs: {
    message: 'workflow-execution',
    options: { label: 'workflow-execution' }
  },
  dependencies: ['process-data'],
}
```

**Output**:
```javascript
{
  label: 'workflow-execution',
  timeEnded: true,
  endTime: "2023-12-07T10:30:05.000Z",
  operation: 'timeend',
  executedAt: "2023-12-07T10:30:05.000Z"
}
```

### Console Grouping Operations

#### `console-group` - Console Group Operation

**Purpose**: Creates a collapsible group in the console using console.group.

**Configuration**:
- `message` (string): Group label
- `options` (object): Optional configuration
  - `collapsed` (boolean): Start group collapsed (default: false)

**Usage**:
```typescript
{
  id: 'start-group',
  type: 'console-group',
  inputs: {
    message: 'User Processing Workflow',
    options: { collapsed: false }
  },
  dependencies: [],
}
```

**Output**:
```javascript
{
  message: 'User Processing Workflow',
  groupStarted: true,
  collapsed: false,
  operation: 'group',
  executedAt: "2023-12-07T10:30:00.000Z"
}
```

#### `console-groupend` - Console Group End Operation

**Purpose**: Ends a console group using console.groupEnd.

**Configuration**: No specific configuration required

**Usage**:
```typescript
{
  id: 'end-group',
  type: 'console-groupend',
  inputs: {},
  dependencies: ['log-final-result'],
}
```

**Output**:
```javascript
{
  groupEnded: true,
  operation: 'groupend',
  executedAt: "2023-12-07T10:30:00.000Z"
}
```

### Console Utility Operations

#### `console-clear` - Console Clear Operation

**Purpose**: Clears the console using console.clear.

**Configuration**:
- `options` (object): Optional configuration
  - `preserve` (boolean): Preserve certain logs (default: false)

**Usage**:
```typescript
{
  id: 'clear-console',
  type: 'console-clear',
  inputs: {
    options: { preserve: false }
  },
  dependencies: ['log-trace'],
}
```

**Output**:
```javascript
{
  cleared: true,
  preserve: false,
  operation: 'clear',
  executedAt: "2023-12-07T10:30:00.000Z"
}
```

#### `console-trace` - Console Trace Operation

**Purpose**: Outputs a stack trace using console.trace.

**Configuration**:
- `message` (string): Trace label
- `options` (object): Optional configuration
  - `label` (string): Custom trace label

**Usage**:
```typescript
{
  id: 'log-trace',
  type: 'console-trace',
  inputs: {
    message: 'Workflow execution trace',
    options: { label: 'workflow-trace' }
  },
  dependencies: ['count-operations'],
}
```

**Output**:
```javascript
{
  label: 'workflow-trace',
  trace: true,
  stackTrace: "Error\n    at ...",
  operation: 'trace',
  executedAt: "2023-12-07T10:30:00.000Z"
}
```

#### `console-count` - Console Count Operation

**Purpose**: Counts the number of times this node is executed using console.count.

**Configuration**:
- `message` (string): Counter label
- `options` (object): Optional configuration
  - `label` (string): Custom counter label

**Usage**:
```typescript
{
  id: 'count-operations',
  type: 'console-count',
  inputs: {
    message: 'workflow-execution',
    options: { label: 'workflow-execution' }
  },
  dependencies: ['start-data'],
}
```

**Output**:
```javascript
{
  label: 'workflow-execution',
  count: true,
  operation: 'count',
  executedAt: "2023-12-07T10:30:00.000Z"
}
```

#### `console-countreset` - Console Count Reset Operation

**Purpose**: Resets a counter using console.countReset.

**Configuration**: Same as `console-count`

**Usage**:
```typescript
{
  id: 'reset-counter',
  type: 'console-countreset',
  inputs: {
    message: 'workflow-execution',
    options: { label: 'workflow-execution' }
  },
  dependencies: ['clear-console'],
}
```

**Output**:
```javascript
{
  label: 'workflow-execution',
  countReset: true,
  operation: 'countreset',
  executedAt: "2023-12-07T10:30:00.000Z"
}
```

### Using Console Plugins

#### Installing Console Plugins

```typescript
import { createFlows, DefaultNodeExecutor, allConsolePlugins } from 'flows';

// Enable all console operations
const executor = new DefaultNodeExecutor({
  plugins: allConsolePlugins,
});

const flows = createFlows(config, executor);
```

#### Selective Console Plugin Installation

```typescript
import { 
  consoleLoggingPlugins, 
  consoleTimingPlugins, 
  consoleGroupingPlugins, 
  consoleUtilityPlugins 
} from 'flows';

// Enable specific console categories
const executor = new DefaultNodeExecutor({
  plugins: [...consoleLoggingPlugins, ...consoleTimingPlugins],
});
```

#### Getting Console Plugin Information

```typescript
import { getConsolePluginsByCategory } from 'flows';

// Get console plugins by category
const loggingPlugins = getConsolePluginsByCategory('logging');
const timingPlugins = getConsolePluginsByCategory('timing');
const allConsolePlugins = getConsolePluginsByCategory('all');
```

---

## Using Built-in Handlers

### Installing Built-in Plugins

```typescript
import { createFlows, DefaultNodeExecutor, allBuiltInPlugins } from 'flows';

// Enable all built-in operations
const executor = new DefaultNodeExecutor({
  enableSubflows: false,
  plugins: allBuiltInPlugins,
});

const flows = createFlows(config, executor);
```

### Selective Plugin Installation

```typescript
import { 
  logicalPlugins, 
  mathPlugins, 
  stringPlugins, 
  flowControlPlugins 
} from 'flows';

// Enable specific categories
const executor = new DefaultNodeExecutor({
  plugins: [...logicalPlugins, ...mathPlugins],
});
```

### Getting Plugin Information

```typescript
import { getPluginMetadata, getPluginsByCategory } from 'flows';

// Get all plugin metadata
const metadata = getPluginMetadata();
console.log(metadata['logic-and']); // { name, description, version }

// Get plugins by category
const mathPlugins = getPluginsByCategory('math');
const allPlugins = getPluginsByCategory('all');
```

---

## Error Handling

All handlers include comprehensive error handling:

- **Validation Errors**: Invalid inputs, missing required fields
- **Type Conversion Errors**: Invalid number/boolean conversions
- **Operation Errors**: Division by zero, invalid regex patterns
- **Range Errors**: Array bounds, negative indices

Errors include descriptive messages indicating the specific issue and expected input format.

---

## Examples

See `src/examples/comprehensive-handlers-example.ts` for complete working examples of all handlers.

Run the example:
```bash
npx tsx src/examples/comprehensive-handlers-example.ts
``` 