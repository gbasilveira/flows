import type { WorkflowNode } from '../../types/index.js';

/**
 * Handler for mathematical operation node types
 * Supports arithmetic operations: add, subtract, multiply, divide, power, modulo
 */
export class MathHandler {
  async execute(
    node: WorkflowNode,
    _context: Record<string, unknown>,
    inputs: Record<string, unknown>
  ): Promise<unknown> {
    const operation = node.inputs.operation as string;
    const values = this.extractNumbers(node, inputs);
    
    let result: number;
    
    switch (operation?.toLowerCase()) {
      case 'add':
        result = this.performAdd(values);
        break;
      case 'subtract':
        result = this.performSubtract(values);
        break;
      case 'multiply':
        result = this.performMultiply(values);
        break;
      case 'divide':
        result = this.performDivide(values);
        break;
      case 'power':
        result = this.performPower(values);
        break;
      case 'modulo':
        result = this.performModulo(values);
        break;
      default:
        throw new Error(`Unsupported math operation: ${operation}. Supported operations: add, subtract, multiply, divide, power, modulo`);
    }
    
    return {
      result,
      operation,
      inputValues: values,
      calculatedAt: new Date().toISOString(),
      ...inputs
    };
  }
  
  /**
   * Extract numeric values from node inputs and runtime inputs
   */
  private extractNumbers(node: WorkflowNode, inputs: Record<string, unknown>): number[] {
    const nodeValues = node.inputs.values as unknown[];
    const inputValues = inputs.values as unknown[];
    const allValues = [...(nodeValues || []), ...(inputValues || [])];
    
    if (allValues.length === 0) {
      throw new Error('No values provided for math operation');
    }
    
    return allValues.map(value => this.toNumber(value));
  }
  
  /**
   * Convert value to number with validation
   */
  private toNumber(value: unknown): number {
    if (typeof value === 'number') {
      if (Number.isNaN(value)) throw new Error('NaN is not a valid number for math operations');
      if (!Number.isFinite(value)) throw new Error('Infinite values are not supported');
      return value;
    }
    
    if (typeof value === 'string') {
      const parsed = parseFloat(value);
      if (Number.isNaN(parsed)) throw new Error(`Cannot convert "${value}" to number`);
      return parsed;
    }
    
    if (typeof value === 'boolean') {
      return value ? 1 : 0;
    }
    
    throw new Error(`Cannot convert ${typeof value} to number`);
  }
  
  /**
   * Perform addition operation
   */
  private performAdd(values: number[]): number {
    return values.reduce((sum, value) => sum + value, 0);
  }
  
  /**
   * Perform subtraction operation
   */
  private performSubtract(values: number[]): number {
    if (values.length < 2) {
      throw new Error('Subtraction requires at least 2 values');
    }
    return values.reduce((result, value, index) => 
      index === 0 ? value : result - value
    );
  }
  
  /**
   * Perform multiplication operation
   */
  private performMultiply(values: number[]): number {
    return values.reduce((product, value) => product * value, 1);
  }
  
  /**
   * Perform division operation
   */
  private performDivide(values: number[]): number {
    if (values.length !== 2) {
      throw new Error('Division requires exactly 2 values');
    }
    
    const [dividend, divisor] = values;
    if (divisor === 0) {
      throw new Error('Division by zero is not allowed');
    }
    
    return dividend / divisor;
  }
  
  /**
   * Perform power operation (exponentiation)
   */
  private performPower(values: number[]): number {
    if (values.length !== 2) {
      throw new Error('Power operation requires exactly 2 values (base, exponent)');
    }
    
    const [base, exponent] = values;
    const result = Math.pow(base, exponent);
    
    if (!Number.isFinite(result)) {
      throw new Error('Power operation resulted in an infinite value');
    }
    
    return result;
  }
  
  /**
   * Perform modulo operation
   */
  private performModulo(values: number[]): number {
    if (values.length !== 2) {
      throw new Error('Modulo operation requires exactly 2 values');
    }
    
    const [dividend, divisor] = values;
    if (divisor === 0) {
      throw new Error('Modulo by zero is not allowed');
    }
    
    return dividend % divisor;
  }
} 