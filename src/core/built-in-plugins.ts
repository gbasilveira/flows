import { type HandlerPlugin } from './plugin-registry.js';
import { 
  LogicalHandler, 
  MathHandler, 
  StringHandler, 
  ConditionHandler, 
  MergeHandler 
} from './handlers/index.js';

/**
 * Built-in plugins collection providing comprehensive operation handlers
 * These plugins extend the core functionality with logical, mathematical,
 * string manipulation, conditional, and flow control operations
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
    description: 'Performs division operation on two numeric values',
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
    description: 'Performs exponentiation operation (base^exponent)',
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
    description: 'Performs modulo operation (remainder after division)',
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
    description: 'Concatenates multiple string values with optional separator',
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
    description: 'Extracts a substring from text using start and end positions',
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
    description: 'Replaces text in a string with support for regex patterns',
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
    description: 'Matches text against regex patterns and returns matches',
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
    description: 'Splits a string into an array using a delimiter',
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
    description: 'Compares two strings with optional case sensitivity',
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
    description: 'Transforms string case (upper, lower, title, sentence)',
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
    description: 'Evaluates conditions and provides branching logic for workflows',
    author: 'Flows Team'
  }
};

export const mergeAllPlugin: HandlerPlugin = {
  nodeType: 'merge-all',
  handler: {
    async execute(node, context, inputs) {
      const handler = new MergeHandler();
      return handler.execute({ ...node, inputs: { ...node.inputs, strategy: 'all' }}, context, inputs);
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
      return handler.execute({ ...node, inputs: { ...node.inputs, strategy: 'any' }}, context, inputs);
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
      return handler.execute({ ...node, inputs: { ...node.inputs, strategy: 'majority' }}, context, inputs);
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
      return handler.execute({ ...node, inputs: { ...node.inputs, strategy: 'count' }}, context, inputs);
    }
  },
  metadata: {
    name: 'Merge Count Plugin',
    version: '1.0.0',
    description: 'Proceeds when a specific number of dependencies succeed',
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
 * Collection of all built-in plugins
 */
export const allBuiltInPlugins: HandlerPlugin[] = [
  ...logicalPlugins,
  ...mathPlugins,
  ...stringPlugins,
  ...flowControlPlugins
];

/**
 * Utility function to get plugins by category
 */
export function getPluginsByCategory(category: 'logical' | 'math' | 'string' | 'flow-control' | 'all'): HandlerPlugin[] {
  switch (category) {
    case 'logical':
      return logicalPlugins;
    case 'math':
      return mathPlugins;
    case 'string':
      return stringPlugins;
    case 'flow-control':
      return flowControlPlugins;
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