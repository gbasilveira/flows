import type { WorkflowNode } from '../../types/index.js';

/**
 * Handler for conditional execution node types
 * Evaluates conditions and provides branching logic for workflows
 */
export class ConditionHandler {
  async execute(
    node: WorkflowNode,
    _context: Record<string, unknown>,
    inputs: Record<string, unknown>
  ): Promise<unknown> {
    const condition = this.evaluateCondition(node, inputs);
    const conditionType = node.inputs.conditionType as string || 'simple';
    
    let result: unknown;
    
    switch (conditionType.toLowerCase()) {
      case 'simple':
        result = this.handleSimpleCondition(node, inputs, condition);
        break;
      case 'compare':
        result = this.handleCompareCondition(node, inputs);
        break;
      case 'exists':
        result = this.handleExistsCondition(node, inputs);
        break;
      case 'range':
        result = this.handleRangeCondition(node, inputs);
        break;
      default:
        throw new Error(`Unsupported condition type: ${conditionType}. Supported types: simple, compare, exists, range`);
    }
    
    return {
      conditionResult: condition,
      conditionType,
      branch: condition ? 'then' : 'else',
      evaluatedAt: new Date().toISOString(),
      result,
      ...inputs
    };
  }
  
  /**
   * Evaluate the main condition based on condition type
   */
  private evaluateCondition(node: WorkflowNode, inputs: Record<string, unknown>): boolean {
    const conditionType = node.inputs.conditionType as string || 'simple';
    
    switch (conditionType.toLowerCase()) {
      case 'simple':
        return this.evaluateSimpleCondition(node, inputs);
      case 'compare':
        return this.evaluateCompareCondition(node, inputs);
      case 'exists':
        return this.evaluateExistsCondition(node, inputs);
      case 'range':
        return this.evaluateRangeCondition(node, inputs);
      default:
        throw new Error(`Unsupported condition type: ${conditionType}`);
    }
  }
  
  /**
   * Evaluate simple boolean condition
   */
  private evaluateSimpleCondition(node: WorkflowNode, inputs: Record<string, unknown>): boolean {
    const nodeValue = node.inputs.condition;
    const inputValue = inputs.condition;
    const value = inputValue !== undefined ? inputValue : nodeValue;
    
    return this.toBooleanValue(value);
  }
  
  /**
   * Evaluate comparison condition
   */
  private evaluateCompareCondition(node: WorkflowNode, inputs: Record<string, unknown>): boolean {
    const left = inputs.left !== undefined ? inputs.left : node.inputs.left;
    const right = inputs.right !== undefined ? inputs.right : node.inputs.right;
    const operator = node.inputs.operator as string;
    
    if (left === undefined || right === undefined) {
      throw new Error('Both left and right values are required for comparison');
    }
    
    return this.performComparison(left, right, operator);
  }
  
  /**
   * Evaluate existence condition
   */
  private evaluateExistsCondition(node: WorkflowNode, inputs: Record<string, unknown>): boolean {
    const checkValue = inputs.checkValue !== undefined ? inputs.checkValue : node.inputs.checkValue;
    const checkType = node.inputs.checkType as string || 'defined';
    
    switch (checkType.toLowerCase()) {
      case 'defined':
        return checkValue !== undefined && checkValue !== null;
      case 'empty':
        if (checkValue === undefined || checkValue === null) return true;
        if (typeof checkValue === 'string') return checkValue.length === 0;
        if (Array.isArray(checkValue)) return checkValue.length === 0;
        if (typeof checkValue === 'object') return Object.keys(checkValue).length === 0;
        return false;
      case 'truthy':
        return this.toBooleanValue(checkValue);
      default:
        throw new Error(`Unsupported check type: ${checkType}. Supported types: defined, empty, truthy`);
    }
  }
  
  /**
   * Evaluate range condition
   */
  private evaluateRangeCondition(node: WorkflowNode, inputs: Record<string, unknown>): boolean {
    const value = inputs.value !== undefined ? inputs.value : node.inputs.value;
    const min = node.inputs.min as number;
    const max = node.inputs.max as number;
    const inclusive = node.inputs.inclusive as boolean ?? true;
    
    if (typeof value !== 'number') {
      throw new Error('Value must be a number for range condition');
    }
    
    if (min === undefined && max === undefined) {
      throw new Error('At least one of min or max must be specified for range condition');
    }
    
    let result = true;
    
    if (min !== undefined) {
      result = result && (inclusive ? value >= min : value > min);
    }
    
    if (max !== undefined) {
      result = result && (inclusive ? value <= max : value < max);
    }
    
    return result;
  }
  
  /**
   * Perform comparison between two values
   */
  private performComparison(left: unknown, right: unknown, operator: string): boolean {
    switch (operator) {
      case '===':
      case 'equals':
        return left === right;
      case '!==':
      case 'not_equals':
        return left !== right;
      case '>':
      case 'greater_than':
        return (left as number) > (right as number);
      case '>=':
      case 'greater_than_or_equal':
        return (left as number) >= (right as number);
      case '<':
      case 'less_than':
        return (left as number) < (right as number);
      case '<=':
      case 'less_than_or_equal':
        return (left as number) <= (right as number);
      case 'contains':
        return String(left).includes(String(right));
      case 'starts_with':
        return String(left).startsWith(String(right));
      case 'ends_with':
        return String(left).endsWith(String(right));
      case 'matches':
        return new RegExp(String(right)).test(String(left));
      default:
        throw new Error(`Unsupported comparison operator: ${operator}`);
    }
  }
  
  /**
   * Handle simple condition result
   */
  private handleSimpleCondition(node: WorkflowNode, inputs: Record<string, unknown>, condition: boolean): unknown {
    if (condition) {
      return node.inputs.thenValue !== undefined ? node.inputs.thenValue : inputs.thenValue || true;
    } else {
      return node.inputs.elseValue !== undefined ? node.inputs.elseValue : inputs.elseValue || false;
    }
  }
  
  /**
   * Handle comparison condition result
   */
  private handleCompareCondition(node: WorkflowNode, inputs: Record<string, unknown>): {
    passed: boolean;
    operator: string;
    leftValue: unknown;
    rightValue: unknown;
  } {
    const left = inputs.left !== undefined ? inputs.left : node.inputs.left;
    const right = inputs.right !== undefined ? inputs.right : node.inputs.right;
    const operator = node.inputs.operator as string;
    const passed = this.performComparison(left, right, operator);
    
    return {
      passed,
      operator,
      leftValue: left,
      rightValue: right
    };
  }
  
  /**
   * Handle existence condition result
   */
  private handleExistsCondition(node: WorkflowNode, inputs: Record<string, unknown>): {
    exists: boolean;
    checkType: string;
    checkedValue: unknown;
  } {
    const checkValue = inputs.checkValue !== undefined ? inputs.checkValue : node.inputs.checkValue;
    const checkType = node.inputs.checkType as string || 'defined';
    const exists = this.evaluateExistsCondition(node, inputs);
    
    return {
      exists,
      checkType,
      checkedValue: checkValue
    };
  }
  
  /**
   * Handle range condition result
   */
  private handleRangeCondition(node: WorkflowNode, inputs: Record<string, unknown>): {
    inRange: boolean;
    value: number;
    min?: number;
    max?: number;
    inclusive: boolean;
  } {
    const value = inputs.value !== undefined ? inputs.value : node.inputs.value;
    const min = node.inputs.min as number;
    const max = node.inputs.max as number;
    const inclusive = node.inputs.inclusive as boolean ?? true;
    const inRange = this.evaluateRangeCondition(node, inputs);
    
    return {
      inRange,
      value: value as number,
      min,
      max,
      inclusive
    };
  }
  
  /**
   * Convert value to boolean following JavaScript truthiness rules
   */
  private toBooleanValue(value: unknown): boolean {
    if (typeof value === 'boolean') return value;
    if (typeof value === 'number') return value !== 0 && !Number.isNaN(value);
    if (typeof value === 'string') return value.length > 0 && value.toLowerCase() !== 'false';
    if (value === null || value === undefined) return false;
    if (typeof value === 'object' && value !== null) return Object.keys(value).length > 0;
    return Boolean(value);
  }
} 