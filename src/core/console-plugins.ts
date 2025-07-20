import { type HandlerPlugin } from './plugin-registry.js';
import { ConsoleHandler } from './handlers/index.js';

/**
 * Console plugins collection providing comprehensive console operation handlers
 * These plugins extend the core functionality with various console operations
 * for logging, debugging, and development purposes
 */

// ================================
// Console Logging Plugins
// ================================

export const consoleLogPlugin: HandlerPlugin = {
  nodeType: 'console-log',
  handler: {
    async execute(node, context, inputs) {
      const handler = new ConsoleHandler();
      return handler.execute({ ...node, inputs: { ...node.inputs, operation: 'log' }}, context, inputs);
    }
  },
  metadata: {
    name: 'Console Log Plugin',
    version: '1.0.0',
    description: 'Outputs messages to console.log with optional data and formatting',
    author: 'Flows Team'
  }
};

export const consoleErrorPlugin: HandlerPlugin = {
  nodeType: 'console-error',
  handler: {
    async execute(node, context, inputs) {
      const handler = new ConsoleHandler();
      return handler.execute({ ...node, inputs: { ...node.inputs, operation: 'error' }}, context, inputs);
    }
  },
  metadata: {
    name: 'Console Error Plugin',
    version: '1.0.0',
    description: 'Outputs error messages to console.error with optional data and formatting',
    author: 'Flows Team'
  }
};

export const consoleWarnPlugin: HandlerPlugin = {
  nodeType: 'console-warn',
  handler: {
    async execute(node, context, inputs) {
      const handler = new ConsoleHandler();
      return handler.execute({ ...node, inputs: { ...node.inputs, operation: 'warn' }}, context, inputs);
    }
  },
  metadata: {
    name: 'Console Warn Plugin',
    version: '1.0.0',
    description: 'Outputs warning messages to console.warn with optional data and formatting',
    author: 'Flows Team'
  }
};

export const consoleInfoPlugin: HandlerPlugin = {
  nodeType: 'console-info',
  handler: {
    async execute(node, context, inputs) {
      const handler = new ConsoleHandler();
      return handler.execute({ ...node, inputs: { ...node.inputs, operation: 'info' }}, context, inputs);
    }
  },
  metadata: {
    name: 'Console Info Plugin',
    version: '1.0.0',
    description: 'Outputs informational messages to console.info with optional data and formatting',
    author: 'Flows Team'
  }
};

export const consoleDebugPlugin: HandlerPlugin = {
  nodeType: 'console-debug',
  handler: {
    async execute(node, context, inputs) {
      const handler = new ConsoleHandler();
      return handler.execute({ ...node, inputs: { ...node.inputs, operation: 'debug' }}, context, inputs);
    }
  },
  metadata: {
    name: 'Console Debug Plugin',
    version: '1.0.0',
    description: 'Outputs debug messages to console.debug with optional data and formatting',
    author: 'Flows Team'
  }
};

// ================================
// Console Table Plugin
// ================================

export const consoleTablePlugin: HandlerPlugin = {
  nodeType: 'console-table',
  handler: {
    async execute(node, context, inputs) {
      const handler = new ConsoleHandler();
      return handler.execute({ ...node, inputs: { ...node.inputs, operation: 'table' }}, context, inputs);
    }
  },
  metadata: {
    name: 'Console Table Plugin',
    version: '1.0.0',
    description: 'Displays tabular data in the console using console.table',
    author: 'Flows Team'
  }
};

// ================================
// Console Timing Plugins
// ================================

export const consoleTimePlugin: HandlerPlugin = {
  nodeType: 'console-time',
  handler: {
    async execute(node, context, inputs) {
      const handler = new ConsoleHandler();
      return handler.execute({ ...node, inputs: { ...node.inputs, operation: 'time' }}, context, inputs);
    }
  },
  metadata: {
    name: 'Console Time Plugin',
    version: '1.0.0',
    description: 'Starts a timer for performance measurement using console.time',
    author: 'Flows Team'
  }
};

export const consoleTimeEndPlugin: HandlerPlugin = {
  nodeType: 'console-timeend',
  handler: {
    async execute(node, context, inputs) {
      const handler = new ConsoleHandler();
      return handler.execute({ ...node, inputs: { ...node.inputs, operation: 'timeend' }}, context, inputs);
    }
  },
  metadata: {
    name: 'Console Time End Plugin',
    version: '1.0.0',
    description: 'Ends a timer and displays elapsed time using console.timeEnd',
    author: 'Flows Team'
  }
};

// ================================
// Console Grouping Plugins
// ================================

export const consoleGroupPlugin: HandlerPlugin = {
  nodeType: 'console-group',
  handler: {
    async execute(node, context, inputs) {
      const handler = new ConsoleHandler();
      return handler.execute({ ...node, inputs: { ...node.inputs, operation: 'group' }}, context, inputs);
    }
  },
  metadata: {
    name: 'Console Group Plugin',
    version: '1.0.0',
    description: 'Creates a collapsible group in the console using console.group',
    author: 'Flows Team'
  }
};

export const consoleGroupEndPlugin: HandlerPlugin = {
  nodeType: 'console-groupend',
  handler: {
    async execute(node, context, inputs) {
      const handler = new ConsoleHandler();
      return handler.execute({ ...node, inputs: { ...node.inputs, operation: 'groupend' }}, context, inputs);
    }
  },
  metadata: {
    name: 'Console Group End Plugin',
    version: '1.0.0',
    description: 'Ends a console group using console.groupEnd',
    author: 'Flows Team'
  }
};

// ================================
// Console Utility Plugins
// ================================

export const consoleClearPlugin: HandlerPlugin = {
  nodeType: 'console-clear',
  handler: {
    async execute(node, context, inputs) {
      const handler = new ConsoleHandler();
      return handler.execute({ ...node, inputs: { ...node.inputs, operation: 'clear' }}, context, inputs);
    }
  },
  metadata: {
    name: 'Console Clear Plugin',
    version: '1.0.0',
    description: 'Clears the console using console.clear',
    author: 'Flows Team'
  }
};

export const consoleTracePlugin: HandlerPlugin = {
  nodeType: 'console-trace',
  handler: {
    async execute(node, context, inputs) {
      const handler = new ConsoleHandler();
      return handler.execute({ ...node, inputs: { ...node.inputs, operation: 'trace' }}, context, inputs);
    }
  },
  metadata: {
    name: 'Console Trace Plugin',
    version: '1.0.0',
    description: 'Outputs a stack trace using console.trace',
    author: 'Flows Team'
  }
};

export const consoleCountPlugin: HandlerPlugin = {
  nodeType: 'console-count',
  handler: {
    async execute(node, context, inputs) {
      const handler = new ConsoleHandler();
      return handler.execute({ ...node, inputs: { ...node.inputs, operation: 'count' }}, context, inputs);
    }
  },
  metadata: {
    name: 'Console Count Plugin',
    version: '1.0.0',
    description: 'Counts the number of times this node is executed using console.count',
    author: 'Flows Team'
  }
};

export const consoleCountResetPlugin: HandlerPlugin = {
  nodeType: 'console-countreset',
  handler: {
    async execute(node, context, inputs) {
      const handler = new ConsoleHandler();
      return handler.execute({ ...node, inputs: { ...node.inputs, operation: 'countreset' }}, context, inputs);
    }
  },
  metadata: {
    name: 'Console Count Reset Plugin',
    version: '1.0.0',
    description: 'Resets a counter using console.countReset',
    author: 'Flows Team'
  }
};

// ================================
// Plugin Collections
// ================================

/**
 * Collection of all console logging plugins
 */
export const consoleLoggingPlugins: HandlerPlugin[] = [
  consoleLogPlugin,
  consoleErrorPlugin,
  consoleWarnPlugin,
  consoleInfoPlugin,
  consoleDebugPlugin
];

/**
 * Collection of all console timing plugins
 */
export const consoleTimingPlugins: HandlerPlugin[] = [
  consoleTimePlugin,
  consoleTimeEndPlugin
];

/**
 * Collection of all console grouping plugins
 */
export const consoleGroupingPlugins: HandlerPlugin[] = [
  consoleGroupPlugin,
  consoleGroupEndPlugin
];

/**
 * Collection of all console utility plugins
 */
export const consoleUtilityPlugins: HandlerPlugin[] = [
  consoleTablePlugin,
  consoleClearPlugin,
  consoleTracePlugin,
  consoleCountPlugin,
  consoleCountResetPlugin
];

/**
 * Collection of all console plugins
 */
export const allConsolePlugins: HandlerPlugin[] = [
  ...consoleLoggingPlugins,
  ...consoleTimingPlugins,
  ...consoleGroupingPlugins,
  ...consoleUtilityPlugins
];

/**
 * Utility function to get console plugins by category
 */
export function getConsolePluginsByCategory(category: 'logging' | 'timing' | 'grouping' | 'utility' | 'all'): HandlerPlugin[] {
  switch (category) {
    case 'logging':
      return consoleLoggingPlugins;
    case 'timing':
      return consoleTimingPlugins;
    case 'grouping':
      return consoleGroupingPlugins;
    case 'utility':
      return consoleUtilityPlugins;
    case 'all':
      return allConsolePlugins;
    default:
      throw new Error(`Unknown console plugin category: ${category}`);
  }
} 