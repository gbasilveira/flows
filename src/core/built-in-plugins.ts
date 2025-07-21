import { type HandlerPlugin } from './plugin-registry.js';
import { 
  LogicalHandler, 
  MathHandler, 
  StringHandler, 
  ConditionHandler, 
  MergeHandler,
  DataPrimitiveHandler
} from './handlers/index.js';
import { allConsolePlugins } from './console-plugins.js';

/**
 * Built-in plugins collection providing comprehensive operation handlers
 * These plugins extend the core functionality with logical, mathematical,
 * string manipulation, conditional, flow control, and data primitive operations
 */

// ================================
// Logical Operation Plugins
// ================================

export const logicalAndPlugin: HandlerPlugin = {
  nodeType: 'logic-and',
  handler: {
    async execute(node, context, inputs) {
      const handler = new LogicalHandler();
      return handler.execute({ ...node, inputs: { ...node.inputs, operation: 'and' }}, context, inputs);
    }
  },
  metadata: {
    name: 'Logical AND Plugin',
    version: '1.0.0',
    description: 'Performs logical AND operation on boolean values',
    author: 'Flows Team'
  }
};

export const logicalOrPlugin: HandlerPlugin = {
  nodeType: 'logic-or',
  handler: {
    async execute(node, context, inputs) {
      const handler = new LogicalHandler();
      return handler.execute({ ...node, inputs: { ...node.inputs, operation: 'or' }}, context, inputs);
    }
  },
  metadata: {
    name: 'Logical OR Plugin',
    version: '1.0.0',
    description: 'Performs logical OR operation on boolean values',
    author: 'Flows Team'
  }
};

export const logicalNotPlugin: HandlerPlugin = {
  nodeType: 'logic-not',
  handler: {
    async execute(node, context, inputs) {
      const handler = new LogicalHandler();
      return handler.execute({ ...node, inputs: { ...node.inputs, operation: 'not' }}, context, inputs);
    }
  },
  metadata: {
    name: 'Logical NOT Plugin',
    version: '1.0.0',
    description: 'Performs logical NOT operation on a boolean value',
    author: 'Flows Team'
  }
};

export const logicalXorPlugin: HandlerPlugin = {
  nodeType: 'logic-xor',
  handler: {
    async execute(node, context, inputs) {
      const handler = new LogicalHandler();
      return handler.execute({ ...node, inputs: { ...node.inputs, operation: 'xor' }}, context, inputs);
    }
  },
  metadata: {
    name: 'Logical XOR Plugin',
    version: '1.0.0',
    description: 'Performs logical XOR operation on two boolean values',
    author: 'Flows Team'
  }
};

// ================================
// Mathematical Operation Plugins
// ================================

export const mathAddPlugin: HandlerPlugin = {
  nodeType: 'math-add',
  handler: {
    async execute(node, context, inputs) {
      const handler = new MathHandler();
      return handler.execute({ ...node, inputs: { ...node.inputs, operation: 'add' }}, context, inputs);
    }
  },
  metadata: {
    name: 'Math Addition Plugin',
    version: '1.0.0',
    description: 'Performs addition operation on numeric values',
    author: 'Flows Team'
  }
};

export const mathSubtractPlugin: HandlerPlugin = {
  nodeType: 'math-subtract',
  handler: {
    async execute(node, context, inputs) {
      const handler = new MathHandler();
      return handler.execute({ ...node, inputs: { ...node.inputs, operation: 'subtract' }}, context, inputs);
    }
  },
  metadata: {
    name: 'Math Subtraction Plugin',
    version: '1.0.0',
    description: 'Performs subtraction operation on numeric values',
    author: 'Flows Team'
  }
};

export const mathMultiplyPlugin: HandlerPlugin = {
  nodeType: 'math-multiply',
  handler: {
    async execute(node, context, inputs) {
      const handler = new MathHandler();
      return handler.execute({ ...node, inputs: { ...node.inputs, operation: 'multiply' }}, context, inputs);
    }
  },
  metadata: {
    name: 'Math Multiplication Plugin',
    version: '1.0.0',
    description: 'Performs multiplication operation on numeric values',
    author: 'Flows Team'
  }
};

export const mathDividePlugin: HandlerPlugin = {
  nodeType: 'math-divide',
  handler: {
    async execute(node, context, inputs) {
      const handler = new MathHandler();
      return handler.execute({ ...node, inputs: { ...node.inputs, operation: 'divide' }}, context, inputs);
    }
  },
  metadata: {
    name: 'Math Division Plugin',
    version: '1.0.0',
    description: 'Performs division operation on numeric values',
    author: 'Flows Team'
  }
};

export const mathPowerPlugin: HandlerPlugin = {
  nodeType: 'math-power',
  handler: {
    async execute(node, context, inputs) {
      const handler = new MathHandler();
      return handler.execute({ ...node, inputs: { ...node.inputs, operation: 'power' }}, context, inputs);
    }
  },
  metadata: {
    name: 'Math Power Plugin',
    version: '1.0.0',
    description: 'Performs exponentiation operation on numeric values',
    author: 'Flows Team'
  }
};

export const mathModuloPlugin: HandlerPlugin = {
  nodeType: 'math-modulo',
  handler: {
    async execute(node, context, inputs) {
      const handler = new MathHandler();
      return handler.execute({ ...node, inputs: { ...node.inputs, operation: 'modulo' }}, context, inputs);
    }
  },
  metadata: {
    name: 'Math Modulo Plugin',
    version: '1.0.0',
    description: 'Performs modulo operation on numeric values',
    author: 'Flows Team'
  }
};

// ================================
// String Operation Plugins
// ================================

export const stringConcatPlugin: HandlerPlugin = {
  nodeType: 'string-concat',
  handler: {
    async execute(node, context, inputs) {
      const handler = new StringHandler();
      return handler.execute({ ...node, inputs: { ...node.inputs, operation: 'concat' }}, context, inputs);
    }
  },
  metadata: {
    name: 'String Concatenation Plugin',
    version: '1.0.0',
    description: 'Concatenates multiple strings with optional separator',
    author: 'Flows Team'
  }
};

export const stringSubstringPlugin: HandlerPlugin = {
  nodeType: 'string-substring',
  handler: {
    async execute(node, context, inputs) {
      const handler = new StringHandler();
      return handler.execute({ ...node, inputs: { ...node.inputs, operation: 'substring' }}, context, inputs);
    }
  },
  metadata: {
    name: 'String Substring Plugin',
    version: '1.0.0',
    description: 'Extracts substring using start/end positions',
    author: 'Flows Team'
  }
};

export const stringReplacePlugin: HandlerPlugin = {
  nodeType: 'string-replace',
  handler: {
    async execute(node, context, inputs) {
      const handler = new StringHandler();
      return handler.execute({ ...node, inputs: { ...node.inputs, operation: 'replace' }}, context, inputs);
    }
  },
  metadata: {
    name: 'String Replace Plugin',
    version: '1.0.0',
    description: 'Replaces text with regex support and global options',
    author: 'Flows Team'
  }
};

export const stringMatchPlugin: HandlerPlugin = {
  nodeType: 'string-match',
  handler: {
    async execute(node, context, inputs) {
      const handler = new StringHandler();
      return handler.execute({ ...node, inputs: { ...node.inputs, operation: 'match' }}, context, inputs);
    }
  },
  metadata: {
    name: 'String Match Plugin',
    version: '1.0.0',
    description: 'Matches text against regex patterns',
    author: 'Flows Team'
  }
};

export const stringSplitPlugin: HandlerPlugin = {
  nodeType: 'string-split',
  handler: {
    async execute(node, context, inputs) {
      const handler = new StringHandler();
      return handler.execute({ ...node, inputs: { ...node.inputs, operation: 'split' }}, context, inputs);
    }
  },
  metadata: {
    name: 'String Split Plugin',
    version: '1.0.0',
    description: 'Splits string into array using delimiter',
    author: 'Flows Team'
  }
};

export const stringComparePlugin: HandlerPlugin = {
  nodeType: 'string-compare',
  handler: {
    async execute(node, context, inputs) {
      const handler = new StringHandler();
      return handler.execute({ ...node, inputs: { ...node.inputs, operation: 'compare' }}, context, inputs);
    }
  },
  metadata: {
    name: 'String Compare Plugin',
    version: '1.0.0',
    description: 'Compares strings with case-sensitivity options',
    author: 'Flows Team'
  }
};

export const stringLengthPlugin: HandlerPlugin = {
  nodeType: 'string-length',
  handler: {
    async execute(node, context, inputs) {
      const handler = new StringHandler();
      return handler.execute({ ...node, inputs: { ...node.inputs, operation: 'length' }}, context, inputs);
    }
  },
  metadata: {
    name: 'String Length Plugin',
    version: '1.0.0',
    description: 'Returns the length of a string',
    author: 'Flows Team'
  }
};

export const stringCasePlugin: HandlerPlugin = {
  nodeType: 'string-case',
  handler: {
    async execute(node, context, inputs) {
      const handler = new StringHandler();
      return handler.execute({ ...node, inputs: { ...node.inputs, operation: 'case' }}, context, inputs);
    }
  },
  metadata: {
    name: 'String Case Plugin',
    version: '1.0.0',
    description: 'Transforms string case using different strategies',
    author: 'Flows Team'
  }
};

// ================================
// Flow Control Plugins
// ================================

export const conditionPlugin: HandlerPlugin = {
  nodeType: 'condition',
  handler: {
    async execute(node, context, inputs) {
      const handler = new ConditionHandler();
      return handler.execute(node, context, inputs);
    }
  },
  metadata: {
    name: 'Condition Plugin',
    version: '1.0.0',
    description: 'Evaluates conditions and provides branching logic',
    author: 'Flows Team'
  }
};

export const mergeAllPlugin: HandlerPlugin = {
  nodeType: 'merge-all',
  handler: {
    async execute(node, context, inputs) {
      const handler = new MergeHandler();
      return handler.execute({ ...node, inputs: { ...node.inputs, operation: 'all' }}, context, inputs);
    }
  },
  metadata: {
    name: 'Merge All Plugin',
    version: '1.0.0',
    description: 'Waits for all dependencies to succeed before proceeding',
    author: 'Flows Team'
  }
};

export const mergeAnyPlugin: HandlerPlugin = {
  nodeType: 'merge-any',
  handler: {
    async execute(node, context, inputs) {
      const handler = new MergeHandler();
      return handler.execute({ ...node, inputs: { ...node.inputs, operation: 'any' }}, context, inputs);
    }
  },
  metadata: {
    name: 'Merge Any Plugin',
    version: '1.0.0',
    description: 'Proceeds when any dependency succeeds',
    author: 'Flows Team'
  }
};

export const mergeMajorityPlugin: HandlerPlugin = {
  nodeType: 'merge-majority',
  handler: {
    async execute(node, context, inputs) {
      const handler = new MergeHandler();
      return handler.execute({ ...node, inputs: { ...node.inputs, operation: 'majority' }}, context, inputs);
    }
  },
  metadata: {
    name: 'Merge Majority Plugin',
    version: '1.0.0',
    description: 'Proceeds when majority of dependencies succeed',
    author: 'Flows Team'
  }
};

export const mergeCountPlugin: HandlerPlugin = {
  nodeType: 'merge-count',
  handler: {
    async execute(node, context, inputs) {
      const handler = new MergeHandler();
      return handler.execute({ ...node, inputs: { ...node.inputs, operation: 'count' }}, context, inputs);
    }
  },
  metadata: {
    name: 'Merge Count Plugin',
    version: '1.0.0',
    description: 'Proceeds when specific number of dependencies succeed',
    author: 'Flows Team'
  }
};

// ================================
// Data Primitive Operation Plugins
// ================================

// Number Operations
export const numberParsePlugin: HandlerPlugin = {
  nodeType: 'number-parse',
  handler: {
    async execute(node, context, inputs) {
      const handler = new DataPrimitiveHandler();
      return handler.execute({ ...node, inputs: { ...node.inputs, operation: 'number-parse' }}, context, inputs);
    }
  },
  metadata: {
    name: 'Number Parse Plugin',
    version: '1.0.0',
    description: 'Converts values to numbers with fallback support',
    author: 'Flows Team'
  }
};

export const numberFormatPlugin: HandlerPlugin = {
  nodeType: 'number-format',
  handler: {
    async execute(node, context, inputs) {
      const handler = new DataPrimitiveHandler();
      return handler.execute({ ...node, inputs: { ...node.inputs, operation: 'number-format' }}, context, inputs);
    }
  },
  metadata: {
    name: 'Number Format Plugin',
    version: '1.0.0',
    description: 'Formats numbers using locale and options',
    author: 'Flows Team'
  }
};

export const numberValidatePlugin: HandlerPlugin = {
  nodeType: 'number-validate',
  handler: {
    async execute(node, context, inputs) {
      const handler = new DataPrimitiveHandler();
      return handler.execute({ ...node, inputs: { ...node.inputs, operation: 'number-validate' }}, context, inputs);
    }
  },
  metadata: {
    name: 'Number Validate Plugin',
    version: '1.0.0',
    description: 'Validates numbers with range and constraint checks',
    author: 'Flows Team'
  }
};

export const numberRangePlugin: HandlerPlugin = {
  nodeType: 'number-range',
  handler: {
    async execute(node, context, inputs) {
      const handler = new DataPrimitiveHandler();
      return handler.execute({ ...node, inputs: { ...node.inputs, operation: 'number-range' }}, context, inputs);
    }
  },
  metadata: {
    name: 'Number Range Plugin',
    version: '1.0.0',
    description: 'Generates number ranges with step support',
    author: 'Flows Team'
  }
};

export const numberRoundPlugin: HandlerPlugin = {
  nodeType: 'number-round',
  handler: {
    async execute(node, context, inputs) {
      const handler = new DataPrimitiveHandler();
      return handler.execute({ ...node, inputs: { ...node.inputs, operation: 'number-round' }}, context, inputs);
    }
  },
  metadata: {
    name: 'Number Round Plugin',
    version: '1.0.0',
    description: 'Rounds numbers using various methods and precision',
    author: 'Flows Team'
  }
};

export const numberClampPlugin: HandlerPlugin = {
  nodeType: 'number-clamp',
  handler: {
    async execute(node, context, inputs) {
      const handler = new DataPrimitiveHandler();
      return handler.execute({ ...node, inputs: { ...node.inputs, operation: 'number-clamp' }}, context, inputs);
    }
  },
  metadata: {
    name: 'Number Clamp Plugin',
    version: '1.0.0',
    description: 'Clamps numbers to specified min/max ranges',
    author: 'Flows Team'
  }
};

// String Operations
export const stringParsePlugin: HandlerPlugin = {
  nodeType: 'string-parse',
  handler: {
    async execute(node, context, inputs) {
      const handler = new DataPrimitiveHandler();
      return handler.execute({ ...node, inputs: { ...node.inputs, operation: 'string-parse' }}, context, inputs);
    }
  },
  metadata: {
    name: 'String Parse Plugin',
    version: '1.0.0',
    description: 'Converts values to strings with encoding support',
    author: 'Flows Team'
  }
};

export const stringValidatePlugin: HandlerPlugin = {
  nodeType: 'string-validate',
  handler: {
    async execute(node, context, inputs) {
      const handler = new DataPrimitiveHandler();
      return handler.execute({ ...node, inputs: { ...node.inputs, operation: 'string-validate' }}, context, inputs);
    }
  },
  metadata: {
    name: 'String Validate Plugin',
    version: '1.0.0',
    description: 'Validates strings with length and pattern checks',
    author: 'Flows Team'
  }
};

export const stringEncodePlugin: HandlerPlugin = {
  nodeType: 'string-encode',
  handler: {
    async execute(node, context, inputs) {
      const handler = new DataPrimitiveHandler();
      return handler.execute({ ...node, inputs: { ...node.inputs, operation: 'string-encode' }}, context, inputs);
    }
  },
  metadata: {
    name: 'String Encode Plugin',
    version: '1.0.0',
    description: 'Encodes strings using various encoding methods',
    author: 'Flows Team'
  }
};

export const stringDecodePlugin: HandlerPlugin = {
  nodeType: 'string-decode',
  handler: {
    async execute(node, context, inputs) {
      const handler = new DataPrimitiveHandler();
      return handler.execute({ ...node, inputs: { ...node.inputs, operation: 'string-decode' }}, context, inputs);
    }
  },
  metadata: {
    name: 'String Decode Plugin',
    version: '1.0.0',
    description: 'Decodes strings using various encoding methods',
    author: 'Flows Team'
  }
};

export const stringFormatPlugin: HandlerPlugin = {
  nodeType: 'string-format',
  handler: {
    async execute(node, context, inputs) {
      const handler = new DataPrimitiveHandler();
      return handler.execute({ ...node, inputs: { ...node.inputs, operation: 'string-format' }}, context, inputs);
    }
  },
  metadata: {
    name: 'String Format Plugin',
    version: '1.0.0',
    description: 'Formats strings using template substitution',
    author: 'Flows Team'
  }
};

export const stringSanitizePlugin: HandlerPlugin = {
  nodeType: 'string-sanitize',
  handler: {
    async execute(node, context, inputs) {
      const handler = new DataPrimitiveHandler();
      return handler.execute({ ...node, inputs: { ...node.inputs, operation: 'string-sanitize' }}, context, inputs);
    }
  },
  metadata: {
    name: 'String Sanitize Plugin',
    version: '1.0.0',
    description: 'Sanitizes strings by removing HTML, scripts, and normalizing whitespace',
    author: 'Flows Team'
  }
};

// Array Operations
export const arrayCreatePlugin: HandlerPlugin = {
  nodeType: 'array-create',
  handler: {
    async execute(node, context, inputs) {
      const handler = new DataPrimitiveHandler();
      return handler.execute({ ...node, inputs: { ...node.inputs, operation: 'array-create' }}, context, inputs);
    }
  },
  metadata: {
    name: 'Array Create Plugin',
    version: '1.0.0',
    description: 'Creates arrays with specified length, fill values, or initial values',
    author: 'Flows Team'
  }
};

export const arrayFilterPlugin: HandlerPlugin = {
  nodeType: 'array-filter',
  handler: {
    async execute(node, context, inputs) {
      const handler = new DataPrimitiveHandler();
      return handler.execute({ ...node, inputs: { ...node.inputs, operation: 'array-filter' }}, context, inputs);
    }
  },
  metadata: {
    name: 'Array Filter Plugin',
    version: '1.0.0',
    description: 'Filters arrays based on various conditions',
    author: 'Flows Team'
  }
};

export const arrayMapPlugin: HandlerPlugin = {
  nodeType: 'array-map',
  handler: {
    async execute(node, context, inputs) {
      const handler = new DataPrimitiveHandler();
      return handler.execute({ ...node, inputs: { ...node.inputs, operation: 'array-map' }}, context, inputs);
    }
  },
  metadata: {
    name: 'Array Map Plugin',
    version: '1.0.0',
    description: 'Transforms array elements using various operations',
    author: 'Flows Team'
  }
};

export const arrayReducePlugin: HandlerPlugin = {
  nodeType: 'array-reduce',
  handler: {
    async execute(node, context, inputs) {
      const handler = new DataPrimitiveHandler();
      return handler.execute({ ...node, inputs: { ...node.inputs, operation: 'array-reduce' }}, context, inputs);
    }
  },
  metadata: {
    name: 'Array Reduce Plugin',
    version: '1.0.0',
    description: 'Reduces arrays using various aggregation operations',
    author: 'Flows Team'
  }
};

export const arraySortPlugin: HandlerPlugin = {
  nodeType: 'array-sort',
  handler: {
    async execute(node, context, inputs) {
      const handler = new DataPrimitiveHandler();
      return handler.execute({ ...node, inputs: { ...node.inputs, operation: 'array-sort' }}, context, inputs);
    }
  },
  metadata: {
    name: 'Array Sort Plugin',
    version: '1.0.0',
    description: 'Sorts arrays with direction and key-based sorting',
    author: 'Flows Team'
  }
};

export const arrayFlattenPlugin: HandlerPlugin = {
  nodeType: 'array-flatten',
  handler: {
    async execute(node, context, inputs) {
      const handler = new DataPrimitiveHandler();
      return handler.execute({ ...node, inputs: { ...node.inputs, operation: 'array-flatten' }}, context, inputs);
    }
  },
  metadata: {
    name: 'Array Flatten Plugin',
    version: '1.0.0',
    description: 'Flattens nested arrays to specified depth',
    author: 'Flows Team'
  }
};

export const arrayUniquePlugin: HandlerPlugin = {
  nodeType: 'array-unique',
  handler: {
    async execute(node, context, inputs) {
      const handler = new DataPrimitiveHandler();
      return handler.execute({ ...node, inputs: { ...node.inputs, operation: 'array-unique' }}, context, inputs);
    }
  },
  metadata: {
    name: 'Array Unique Plugin',
    version: '1.0.0',
    description: 'Removes duplicate values from arrays',
    author: 'Flows Team'
  }
};

export const arrayChunkPlugin: HandlerPlugin = {
  nodeType: 'array-chunk',
  handler: {
    async execute(node, context, inputs) {
      const handler = new DataPrimitiveHandler();
      return handler.execute({ ...node, inputs: { ...node.inputs, operation: 'array-chunk' }}, context, inputs);
    }
  },
  metadata: {
    name: 'Array Chunk Plugin',
    version: '1.0.0',
    description: 'Splits arrays into chunks of specified size',
    author: 'Flows Team'
  }
};

export const arraySlicePlugin: HandlerPlugin = {
  nodeType: 'array-slice',
  handler: {
    async execute(node, context, inputs) {
      const handler = new DataPrimitiveHandler();
      return handler.execute({ ...node, inputs: { ...node.inputs, operation: 'array-slice' }}, context, inputs);
    }
  },
  metadata: {
    name: 'Array Slice Plugin',
    version: '1.0.0',
    description: 'Extracts portions of arrays using start/end indices',
    author: 'Flows Team'
  }
};

export const arrayJoinPlugin: HandlerPlugin = {
  nodeType: 'array-join',
  handler: {
    async execute(node, context, inputs) {
      const handler = new DataPrimitiveHandler();
      return handler.execute({ ...node, inputs: { ...node.inputs, operation: 'array-join' }}, context, inputs);
    }
  },
  metadata: {
    name: 'Array Join Plugin',
    version: '1.0.0',
    description: 'Joins array elements into strings with separators',
    author: 'Flows Team'
  }
};

// Object Operations
export const objectCreatePlugin: HandlerPlugin = {
  nodeType: 'object-create',
  handler: {
    async execute(node, context, inputs) {
      const handler = new DataPrimitiveHandler();
      return handler.execute({ ...node, inputs: { ...node.inputs, operation: 'object-create' }}, context, inputs);
    }
  },
  metadata: {
    name: 'Object Create Plugin',
    version: '1.0.0',
    description: 'Creates objects from properties or entries',
    author: 'Flows Team'
  }
};

export const objectGetPlugin: HandlerPlugin = {
  nodeType: 'object-get',
  handler: {
    async execute(node, context, inputs) {
      const handler = new DataPrimitiveHandler();
      return handler.execute({ ...node, inputs: { ...node.inputs, operation: 'object-get' }}, context, inputs);
    }
  },
  metadata: {
    name: 'Object Get Plugin',
    version: '1.0.0',
    description: 'Gets object properties using dot notation paths',
    author: 'Flows Team'
  }
};

export const objectSetPlugin: HandlerPlugin = {
  nodeType: 'object-set',
  handler: {
    async execute(node, context, inputs) {
      const handler = new DataPrimitiveHandler();
      return handler.execute({ ...node, inputs: { ...node.inputs, operation: 'object-set' }}, context, inputs);
    }
  },
  metadata: {
    name: 'Object Set Plugin',
    version: '1.0.0',
    description: 'Sets object properties using dot notation paths',
    author: 'Flows Team'
  }
};

export const objectMergePlugin: HandlerPlugin = {
  nodeType: 'object-merge',
  handler: {
    async execute(node, context, inputs) {
      const handler = new DataPrimitiveHandler();
      return handler.execute({ ...node, inputs: { ...node.inputs, operation: 'object-merge' }}, context, inputs);
    }
  },
  metadata: {
    name: 'Object Merge Plugin',
    version: '1.0.0',
    description: 'Merges multiple objects with shallow or deep merging',
    author: 'Flows Team'
  }
};

export const objectClonePlugin: HandlerPlugin = {
  nodeType: 'object-clone',
  handler: {
    async execute(node, context, inputs) {
      const handler = new DataPrimitiveHandler();
      return handler.execute({ ...node, inputs: { ...node.inputs, operation: 'object-clone' }}, context, inputs);
    }
  },
  metadata: {
    name: 'Object Clone Plugin',
    version: '1.0.0',
    description: 'Clones objects with shallow or deep copying',
    author: 'Flows Team'
  }
};

export const objectKeysPlugin: HandlerPlugin = {
  nodeType: 'object-keys',
  handler: {
    async execute(node, context, inputs) {
      const handler = new DataPrimitiveHandler();
      return handler.execute({ ...node, inputs: { ...node.inputs, operation: 'object-keys' }}, context, inputs);
    }
  },
  metadata: {
    name: 'Object Keys Plugin',
    version: '1.0.0',
    description: 'Gets array of object keys',
    author: 'Flows Team'
  }
};

export const objectValuesPlugin: HandlerPlugin = {
  nodeType: 'object-values',
  handler: {
    async execute(node, context, inputs) {
      const handler = new DataPrimitiveHandler();
      return handler.execute({ ...node, inputs: { ...node.inputs, operation: 'object-values' }}, context, inputs);
    }
  },
  metadata: {
    name: 'Object Values Plugin',
    version: '1.0.0',
    description: 'Gets array of object values',
    author: 'Flows Team'
  }
};

export const objectEntriesPlugin: HandlerPlugin = {
  nodeType: 'object-entries',
  handler: {
    async execute(node, context, inputs) {
      const handler = new DataPrimitiveHandler();
      return handler.execute({ ...node, inputs: { ...node.inputs, operation: 'object-entries' }}, context, inputs);
    }
  },
  metadata: {
    name: 'Object Entries Plugin',
    version: '1.0.0',
    description: 'Gets array of object key-value pairs',
    author: 'Flows Team'
  }
};

export const objectPickPlugin: HandlerPlugin = {
  nodeType: 'object-pick',
  handler: {
    async execute(node, context, inputs) {
      const handler = new DataPrimitiveHandler();
      return handler.execute({ ...node, inputs: { ...node.inputs, operation: 'object-pick' }}, context, inputs);
    }
  },
  metadata: {
    name: 'Object Pick Plugin',
    version: '1.0.0',
    description: 'Creates new object with selected properties',
    author: 'Flows Team'
  }
};

export const objectOmitPlugin: HandlerPlugin = {
  nodeType: 'object-omit',
  handler: {
    async execute(node, context, inputs) {
      const handler = new DataPrimitiveHandler();
      return handler.execute({ ...node, inputs: { ...node.inputs, operation: 'object-omit' }}, context, inputs);
    }
  },
  metadata: {
    name: 'Object Omit Plugin',
    version: '1.0.0',
    description: 'Creates new object without specified properties',
    author: 'Flows Team'
  }
};

export const objectFreezePlugin: HandlerPlugin = {
  nodeType: 'object-freeze',
  handler: {
    async execute(node, context, inputs) {
      const handler = new DataPrimitiveHandler();
      return handler.execute({ ...node, inputs: { ...node.inputs, operation: 'object-freeze' }}, context, inputs);
    }
  },
  metadata: {
    name: 'Object Freeze Plugin',
    version: '1.0.0',
    description: 'Freezes objects to prevent modification',
    author: 'Flows Team'
  }
};

// Boolean Operations
export const booleanParsePlugin: HandlerPlugin = {
  nodeType: 'boolean-parse',
  handler: {
    async execute(node, context, inputs) {
      const handler = new DataPrimitiveHandler();
      return handler.execute({ ...node, inputs: { ...node.inputs, operation: 'boolean-parse' }}, context, inputs);
    }
  },
  metadata: {
    name: 'Boolean Parse Plugin',
    version: '1.0.0',
    description: 'Converts values to booleans with fallback support',
    author: 'Flows Team'
  }
};

export const booleanValidatePlugin: HandlerPlugin = {
  nodeType: 'boolean-validate',
  handler: {
    async execute(node, context, inputs) {
      const handler = new DataPrimitiveHandler();
      return handler.execute({ ...node, inputs: { ...node.inputs, operation: 'boolean-validate' }}, context, inputs);
    }
  },
  metadata: {
    name: 'Boolean Validate Plugin',
    version: '1.0.0',
    description: 'Validates boolean values and conversions',
    author: 'Flows Team'
  }
};

// JSON Operations
export const jsonParsePlugin: HandlerPlugin = {
  nodeType: 'json-parse',
  handler: {
    async execute(node, context, inputs) {
      const handler = new DataPrimitiveHandler();
      return handler.execute({ ...node, inputs: { ...node.inputs, operation: 'json-parse' }}, context, inputs);
    }
  },
  metadata: {
    name: 'JSON Parse Plugin',
    version: '1.0.0',
    description: 'Parses JSON strings with fallback support',
    author: 'Flows Team'
  }
};

export const jsonStringifyPlugin: HandlerPlugin = {
  nodeType: 'json-stringify',
  handler: {
    async execute(node, context, inputs) {
      const handler = new DataPrimitiveHandler();
      return handler.execute({ ...node, inputs: { ...node.inputs, operation: 'json-stringify' }}, context, inputs);
    }
  },
  metadata: {
    name: 'JSON Stringify Plugin',
    version: '1.0.0',
    description: 'Converts values to JSON strings with formatting',
    author: 'Flows Team'
  }
};

export const jsonValidatePlugin: HandlerPlugin = {
  nodeType: 'json-validate',
  handler: {
    async execute(node, context, inputs) {
      const handler = new DataPrimitiveHandler();
      return handler.execute({ ...node, inputs: { ...node.inputs, operation: 'json-validate' }}, context, inputs);
    }
  },
  metadata: {
    name: 'JSON Validate Plugin',
    version: '1.0.0',
    description: 'Validates JSON strings for syntax correctness',
    author: 'Flows Team'
  }
};

export const jsonSchemaValidatePlugin: HandlerPlugin = {
  nodeType: 'json-schema-validate',
  handler: {
    async execute(node, context, inputs) {
      const handler = new DataPrimitiveHandler();
      return handler.execute({ ...node, inputs: { ...node.inputs, operation: 'json-schema-validate' }}, context, inputs);
    }
  },
  metadata: {
    name: 'JSON Schema Validate Plugin',
    version: '1.0.0',
    description: 'Validates JSON against schemas',
    author: 'Flows Team'
  }
};

// Type Checking Operations
export const typeCheckPlugin: HandlerPlugin = {
  nodeType: 'type-check',
  handler: {
    async execute(node, context, inputs) {
      const handler = new DataPrimitiveHandler();
      return handler.execute({ ...node, inputs: { ...node.inputs, operation: 'type-check' }}, context, inputs);
    }
  },
  metadata: {
    name: 'Type Check Plugin',
    version: '1.0.0',
    description: 'Determines the type of values',
    author: 'Flows Team'
  }
};

export const typeConvertPlugin: HandlerPlugin = {
  nodeType: 'type-convert',
  handler: {
    async execute(node, context, inputs) {
      const handler = new DataPrimitiveHandler();
      return handler.execute({ ...node, inputs: { ...node.inputs, operation: 'type-convert' }}, context, inputs);
    }
  },
  metadata: {
    name: 'Type Convert Plugin',
    version: '1.0.0',
    description: 'Converts values between different types',
    author: 'Flows Team'
  }
};

export const typeValidatePlugin: HandlerPlugin = {
  nodeType: 'type-validate',
  handler: {
    async execute(node, context, inputs) {
      const handler = new DataPrimitiveHandler();
      return handler.execute({ ...node, inputs: { ...node.inputs, operation: 'type-validate' }}, context, inputs);
    }
  },
  metadata: {
    name: 'Type Validate Plugin',
    version: '1.0.0',
    description: 'Validates values against expected types',
    author: 'Flows Team'
  }
};

// Data Validation Operations
export const dataIsNullPlugin: HandlerPlugin = {
  nodeType: 'data-is-null',
  handler: {
    async execute(node, context, inputs) {
      const handler = new DataPrimitiveHandler();
      return handler.execute({ ...node, inputs: { ...node.inputs, operation: 'data-is-null' }}, context, inputs);
    }
  },
  metadata: {
    name: 'Data Is Null Plugin',
    version: '1.0.0',
    description: 'Checks if values are null',
    author: 'Flows Team'
  }
};

export const dataIsUndefinedPlugin: HandlerPlugin = {
  nodeType: 'data-is-undefined',
  handler: {
    async execute(node, context, inputs) {
      const handler = new DataPrimitiveHandler();
      return handler.execute({ ...node, inputs: { ...node.inputs, operation: 'data-is-undefined' }}, context, inputs);
    }
  },
  metadata: {
    name: 'Data Is Undefined Plugin',
    version: '1.0.0',
    description: 'Checks if values are undefined',
    author: 'Flows Team'
  }
};

export const dataIsEmptyPlugin: HandlerPlugin = {
  nodeType: 'data-is-empty',
  handler: {
    async execute(node, context, inputs) {
      const handler = new DataPrimitiveHandler();
      return handler.execute({ ...node, inputs: { ...node.inputs, operation: 'data-is-empty' }}, context, inputs);
    }
  },
  metadata: {
    name: 'Data Is Empty Plugin',
    version: '1.0.0',
    description: 'Checks if values are empty (null, undefined, empty string, empty array, empty object)',
    author: 'Flows Team'
  }
};

export const dataIsValidPlugin: HandlerPlugin = {
  nodeType: 'data-is-valid',
  handler: {
    async execute(node, context, inputs) {
      const handler = new DataPrimitiveHandler();
      return handler.execute({ ...node, inputs: { ...node.inputs, operation: 'data-is-valid' }}, context, inputs);
    }
  },
  metadata: {
    name: 'Data Is Valid Plugin',
    version: '1.0.0',
    description: 'Validates data based on various criteria',
    author: 'Flows Team'
  }
};

export const dataDefaultPlugin: HandlerPlugin = {
  nodeType: 'data-default',
  handler: {
    async execute(node, context, inputs) {
      const handler = new DataPrimitiveHandler();
      return handler.execute({ ...node, inputs: { ...node.inputs, operation: 'data-default' }}, context, inputs);
    }
  },
  metadata: {
    name: 'Data Default Plugin',
    version: '1.0.0',
    description: 'Provides default values when data is invalid or missing',
    author: 'Flows Team'
  }
};

// ================================
// Plugin Collections
// ================================

/**
 * Collection of all logical operation plugins
 */
export const logicalPlugins: HandlerPlugin[] = [
  logicalAndPlugin,
  logicalOrPlugin,
  logicalNotPlugin,
  logicalXorPlugin
];

/**
 * Collection of all mathematical operation plugins
 */
export const mathPlugins: HandlerPlugin[] = [
  mathAddPlugin,
  mathSubtractPlugin,
  mathMultiplyPlugin,
  mathDividePlugin,
  mathPowerPlugin,
  mathModuloPlugin
];

/**
 * Collection of all string operation plugins
 */
export const stringPlugins: HandlerPlugin[] = [
  stringConcatPlugin,
  stringSubstringPlugin,
  stringReplacePlugin,
  stringMatchPlugin,
  stringSplitPlugin,
  stringComparePlugin,
  stringLengthPlugin,
  stringCasePlugin
];

/**
 * Collection of all flow control plugins
 */
export const flowControlPlugins: HandlerPlugin[] = [
  conditionPlugin,
  mergeAllPlugin,
  mergeAnyPlugin,
  mergeMajorityPlugin,
  mergeCountPlugin
];

/**
 * Collection of all number operation plugins
 */
export const numberPlugins: HandlerPlugin[] = [
  numberParsePlugin,
  numberFormatPlugin,
  numberValidatePlugin,
  numberRangePlugin,
  numberRoundPlugin,
  numberClampPlugin
];

/**
 * Collection of all data primitive string operation plugins
 */
export const dataPrimitiveStringPlugins: HandlerPlugin[] = [
  stringParsePlugin,
  stringValidatePlugin,
  stringEncodePlugin,
  stringDecodePlugin,
  stringFormatPlugin,
  stringSanitizePlugin
];

/**
 * Collection of all array operation plugins
 */
export const arrayPlugins: HandlerPlugin[] = [
  arrayCreatePlugin,
  arrayFilterPlugin,
  arrayMapPlugin,
  arrayReducePlugin,
  arraySortPlugin,
  arrayFlattenPlugin,
  arrayUniquePlugin,
  arrayChunkPlugin,
  arraySlicePlugin,
  arrayJoinPlugin
];

/**
 * Collection of all object operation plugins
 */
export const objectPlugins: HandlerPlugin[] = [
  objectCreatePlugin,
  objectGetPlugin,
  objectSetPlugin,
  objectMergePlugin,
  objectClonePlugin,
  objectKeysPlugin,
  objectValuesPlugin,
  objectEntriesPlugin,
  objectPickPlugin,
  objectOmitPlugin,
  objectFreezePlugin
];

/**
 * Collection of all boolean operation plugins
 */
export const booleanPlugins: HandlerPlugin[] = [
  booleanParsePlugin,
  booleanValidatePlugin
];

/**
 * Collection of all JSON operation plugins
 */
export const jsonPlugins: HandlerPlugin[] = [
  jsonParsePlugin,
  jsonStringifyPlugin,
  jsonValidatePlugin,
  jsonSchemaValidatePlugin
];

/**
 * Collection of all type checking operation plugins
 */
export const typeCheckingPlugins: HandlerPlugin[] = [
  typeCheckPlugin,
  typeConvertPlugin,
  typeValidatePlugin
];

/**
 * Collection of all data validation operation plugins
 */
export const dataValidationPlugins: HandlerPlugin[] = [
  dataIsNullPlugin,
  dataIsUndefinedPlugin,
  dataIsEmptyPlugin,
  dataIsValidPlugin,
  dataDefaultPlugin
];

/**
 * Collection of all data primitive operation plugins
 */
export const dataPrimitivePlugins: HandlerPlugin[] = [
  ...numberPlugins,
  ...dataPrimitiveStringPlugins,
  ...arrayPlugins,
  ...objectPlugins,
  ...booleanPlugins,
  ...jsonPlugins,
  ...typeCheckingPlugins,
  ...dataValidationPlugins
];

/**
 * Collection of all built-in plugins
 */
export const allBuiltInPlugins: HandlerPlugin[] = [
  ...logicalPlugins,
  ...mathPlugins,
  ...stringPlugins,
  ...flowControlPlugins,
  ...dataPrimitivePlugins,
  ...allConsolePlugins
];

/**
 * Utility function to get plugins by category
 */
export function getPluginsByCategory(category: 'logical' | 'math' | 'string' | 'flow-control' | 'data-primitive' | 'number' | 'array' | 'object' | 'boolean' | 'json' | 'type-checking' | 'data-validation' | 'console' | 'all'): HandlerPlugin[] {
  switch (category) {
    case 'logical':
      return logicalPlugins;
    case 'math':
      return mathPlugins;
    case 'string':
      return stringPlugins;
    case 'flow-control':
      return flowControlPlugins;
    case 'data-primitive':
      return dataPrimitivePlugins;
    case 'number':
      return numberPlugins;
    case 'array':
      return arrayPlugins;
    case 'object':
      return objectPlugins;
    case 'boolean':
      return booleanPlugins;
    case 'json':
      return jsonPlugins;
    case 'type-checking':
      return typeCheckingPlugins;
    case 'data-validation':
      return dataValidationPlugins;
    case 'console':
      return allConsolePlugins;
    case 'all':
      return allBuiltInPlugins;
    default:
      throw new Error(`Unknown plugin category: ${category}`);
  }
}

/**
 * Utility function to get plugin metadata
 */
export function getPluginMetadata(): Record<string, { name: string; description: string; version: string }> {
  const metadata: Record<string, { name: string; description: string; version: string }> = {};
  
  allBuiltInPlugins.forEach(plugin => {
    metadata[plugin.nodeType] = {
      name: plugin.metadata?.name || plugin.nodeType,
      description: plugin.metadata?.description || 'No description available',
      version: plugin.metadata?.version || '1.0.0'
    };
  });
  
  return metadata;
} 