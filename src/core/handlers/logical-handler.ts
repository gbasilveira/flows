import type { WorkflowNode } from '../../types/index.js';

/**
 * Handler for logical operation node types
 * Supports boolean logic operations: AND, OR, NOT, XOR
 */
export class LogicalHandler {
  async execute(
    node: WorkflowNode,
    _context: Record<string, unknown>,
    inputs: Record<string, unknown>
  ): Promise<unknown> {
    const operation = node.inputs.operation as string;
    const values = this.extractValues(node, inputs);
    
    let result: boolean;
    
    switch (operation?.toLowerCase()) {
      case 'and':
        result = this.performAnd(values);
        break;
      case 'or':
        result = this.performOr(values);
        break;
      case 'not':
        result = this.performNot(values);
        break;
      case 'xor':
        result = this.performXor(values);
        break;
      default:
        throw new Error(`Unsupported logical operation: ${operation}. Supported operations: and, or, not, xor`);
    }
    
    return {
      result,
      operation,
      inputValues: values,
      evaluatedAt: new Date().toISOString(),
      ...inputs
    };
  }
  
  /**
   * Extract boolean values from node inputs and runtime inputs
   */
  private extractValues(node: WorkflowNode, inputs: Record<string, unknown>): boolean[] {
    const nodeValues = node.inputs.values as unknown[];
    const inputValues = inputs.values as unknown[];
    const allValues = [...(nodeValues || []), ...(inputValues || [])];
    
    if (allValues.length === 0) {
      throw new Error('No values provided for logical operation');
    }
    
    return allValues.map(value => this.toBooleanValue(value));
  }
  
  /**
   * Convert value to boolean following JavaScript truthiness rules
   */
  private toBooleanValue(value: unknown): boolean {
    if (typeof value === 'boolean') return value;
    if (typeof value === 'number') return value !== 0 && !Number.isNaN(value);
    if (typeof value === 'string') return value.length > 0 && value.toLowerCase() !== 'false';
    if (value === null || value === undefined) return false;
    if (typeof value === 'object') return Object.keys(value).length > 0;
    return Boolean(value);
  }
  
  /**
   * Perform logical AND operation
   */
  private performAnd(values: boolean[]): boolean {
    return values.every(value => value === true);
  }
  
  /**
   * Perform logical OR operation
   */
  private performOr(values: boolean[]): boolean {
    return values.some(value => value === true);
  }
  
  /**
   * Perform logical NOT operation
   */
  private performNot(values: boolean[]): boolean {
    if (values.length !== 1) {
      throw new Error('NOT operation requires exactly one value');
    }
    return !values[0];
  }
  
  /**
   * Perform logical XOR operation
   */
  private performXor(values: boolean[]): boolean {
    if (values.length !== 2) {
      throw new Error('XOR operation requires exactly two values');
    }
    return values[0] !== values[1];
  }
} 