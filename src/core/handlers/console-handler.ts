import type { WorkflowNode } from '../../types/index.js';

/**
 * Handler for console operation node types
 * Provides various console operations: log, error, warn, info, debug, table, time, clear
 */
export class ConsoleHandler {
  async execute(
    node: WorkflowNode,
    _context: Record<string, unknown>,
    inputs: Record<string, unknown>
  ): Promise<unknown> {
    const operation = node.inputs.operation as string;
    const message = this.extractMessage(node, inputs);
    const data = this.extractData(node, inputs);
    const options = this.extractOptions(node, inputs);
    
    let result: unknown;
    
    switch (operation?.toLowerCase()) {
      case 'log':
        result = this.performLog(message, data, options);
        break;
      case 'error':
        result = this.performError(message, data, options);
        break;
      case 'warn':
        result = this.performWarn(message, data, options);
        break;
      case 'info':
        result = this.performInfo(message, data, options);
        break;
      case 'debug':
        result = this.performDebug(message, data, options);
        break;
      case 'table':
        result = this.performTable(data, options);
        break;
      case 'time':
        result = this.performTime(message, options);
        break;
      case 'timeend':
        result = this.performTimeEnd(message, options);
        break;
      case 'clear':
        result = this.performClear(options);
        break;
      case 'group':
        result = this.performGroup(message, options);
        break;
      case 'groupend':
        result = this.performGroupEnd(options);
        break;
      case 'trace':
        result = this.performTrace(message, options);
        break;
      case 'count':
        result = this.performCount(message, options);
        break;
      case 'countreset':
        result = this.performCountReset(message, options);
        break;
      default:
        throw new Error(`Unsupported console operation: ${operation}. Supported operations: log, error, warn, info, debug, table, time, timeend, clear, group, groupend, trace, count, countreset`);
    }
    
    return {
      result,
      operation,
      message,
      data,
      options,
      executedAt: new Date().toISOString(),
      ...inputs
    };
  }
  
  /**
   * Extract message from node inputs and runtime inputs
   */
  private extractMessage(node: WorkflowNode, inputs: Record<string, unknown>): string {
    const nodeMessage = node.inputs.message as string;
    const inputMessage = inputs.message as string;
    return inputMessage || nodeMessage || 'Console operation executed';
  }
  
  /**
   * Extract data from node inputs and runtime inputs
   */
  private extractData(node: WorkflowNode, inputs: Record<string, unknown>): unknown {
    const nodeData = node.inputs.data;
    const inputData = inputs.data;
    return inputData !== undefined ? inputData : nodeData;
  }
  
  /**
   * Extract options from node inputs and runtime inputs
   */
  private extractOptions(node: WorkflowNode, inputs: Record<string, unknown>): Record<string, unknown> {
    const nodeOptions = node.inputs.options as Record<string, unknown>;
    const inputOptions = inputs.options as Record<string, unknown>;
    return { ...nodeOptions, ...inputOptions };
  }
  
  /**
   * Perform console.log operation
   */
  private performLog(message: string, data?: unknown, options?: Record<string, unknown>): unknown {
    const timestamp = options?.timestamp ? `[${new Date().toISOString()}] ` : '';
    const prefix = options?.prefix ? `${options.prefix} ` : '';
    const fullMessage = `${timestamp}${prefix}${message}`;
    
    if (data !== undefined) {
      console.log(fullMessage, data);
      return { message: fullMessage, data, logged: true };
    } else {
      console.log(fullMessage);
      return { message: fullMessage, logged: true };
    }
  }
  
  /**
   * Perform console.error operation
   */
  private performError(message: string, data?: unknown, options?: Record<string, unknown>): unknown {
    const timestamp = options?.timestamp ? `[${new Date().toISOString()}] ` : '';
    const prefix = options?.prefix ? `${options.prefix} ` : '';
    const fullMessage = `${timestamp}${prefix}${message}`;
    
    if (data !== undefined) {
      console.error(fullMessage, data);
      return { message: fullMessage, data, error: true };
    } else {
      console.error(fullMessage);
      return { message: fullMessage, error: true };
    }
  }
  
  /**
   * Perform console.warn operation
   */
  private performWarn(message: string, data?: unknown, options?: Record<string, unknown>): unknown {
    const timestamp = options?.timestamp ? `[${new Date().toISOString()}] ` : '';
    const prefix = options?.prefix ? `${options.prefix} ` : '';
    const fullMessage = `${timestamp}${prefix}${message}`;
    
    if (data !== undefined) {
      console.warn(fullMessage, data);
      return { message: fullMessage, data, warning: true };
    } else {
      console.warn(fullMessage);
      return { message: fullMessage, warning: true };
    }
  }
  
  /**
   * Perform console.info operation
   */
  private performInfo(message: string, data?: unknown, options?: Record<string, unknown>): unknown {
    const timestamp = options?.timestamp ? `[${new Date().toISOString()}] ` : '';
    const prefix = options?.prefix ? `${options.prefix} ` : '';
    const fullMessage = `${timestamp}${prefix}${message}`;
    
    if (data !== undefined) {
      console.info(fullMessage, data);
      return { message: fullMessage, data, info: true };
    } else {
      console.info(fullMessage);
      return { message: fullMessage, info: true };
    }
  }
  
  /**
   * Perform console.debug operation
   */
  private performDebug(message: string, data?: unknown, options?: Record<string, unknown>): unknown {
    const timestamp = options?.timestamp ? `[${new Date().toISOString()}] ` : '';
    const prefix = options?.prefix ? `${options.prefix} ` : '';
    const fullMessage = `${timestamp}${prefix}${message}`;
    
    if (data !== undefined) {
      console.debug(fullMessage, data);
      return { message: fullMessage, data, debug: true };
    } else {
      console.debug(fullMessage);
      return { message: fullMessage, debug: true };
    }
  }
  
  /**
   * Perform console.table operation
   */
  private performTable(data: unknown, options?: Record<string, unknown>): unknown {
    if (data === undefined) {
      throw new Error('Data is required for table operation');
    }
    
    const columns = options?.columns as string[];
    console.table(data, columns);
    
    return { 
      data, 
      columns, 
      table: true,
      rowCount: Array.isArray(data) ? data.length : 1
    };
  }
  
  /**
   * Perform console.time operation
   */
  private performTime(message: string, options?: Record<string, unknown>): unknown {
    const label = options?.label as string || message;
    console.time(label);
    
    return { 
      label, 
      timeStarted: true,
      startTime: new Date().toISOString()
    };
  }
  
  /**
   * Perform console.timeEnd operation
   */
  private performTimeEnd(message: string, options?: Record<string, unknown>): unknown {
    const label = options?.label as string || message;
    console.timeEnd(label);
    
    return { 
      label, 
      timeEnded: true,
      endTime: new Date().toISOString()
    };
  }
  
  /**
   * Perform console.clear operation
   */
  private performClear(options?: Record<string, unknown>): unknown {
    const preserve = options?.preserve as boolean || false;
    
    if (preserve) {
      // In a real implementation, you might want to preserve certain logs
      console.log('Console clear requested (preserve mode)');
      return { cleared: false, preserve: true };
    } else {
      console.clear();
      return { cleared: true, preserve: false };
    }
  }
  
  /**
   * Perform console.group operation
   */
  private performGroup(message: string, options?: Record<string, unknown>): unknown {
    const collapsed = options?.collapsed as boolean || false;
    
    if (collapsed) {
      console.groupCollapsed(message);
      return { message, groupStarted: true, collapsed: true };
    } else {
      console.group(message);
      return { message, groupStarted: true, collapsed: false };
    }
  }
  
  /**
   * Perform console.groupEnd operation
   */
  private performGroupEnd(options?: Record<string, unknown>): unknown {
    console.groupEnd();
    return { groupEnded: true };
  }
  
  /**
   * Perform console.trace operation
   */
  private performTrace(message: string, options?: Record<string, unknown>): unknown {
    const label = options?.label as string || message;
    console.trace(label);
    
    return { 
      label, 
      trace: true,
      stackTrace: new Error().stack
    };
  }
  
  /**
   * Perform console.count operation
   */
  private performCount(message: string, options?: Record<string, unknown>): unknown {
    const label = options?.label as string || message;
    console.count(label);
    
    return { 
      label, 
      count: true
    };
  }
  
  /**
   * Perform console.countReset operation
   */
  private performCountReset(message: string, options?: Record<string, unknown>): unknown {
    const label = options?.label as string || message;
    console.countReset(label);
    
    return { 
      label, 
      countReset: true
    };
  }
} 