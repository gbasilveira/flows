import type { WorkflowNode } from '../../types/index.js';

/**
 * Handler for string manipulation node types
 * Supports string operations: concat, substring, replace, match, split, compare, length, case
 */
export class StringHandler {
  async execute(
    node: WorkflowNode,
    _context: Record<string, unknown>,
    inputs: Record<string, unknown>
  ): Promise<unknown> {
    const operation = node.inputs.operation as string;
    
    let result: unknown;
    
    switch (operation?.toLowerCase()) {
      case 'concat':
        result = this.performConcat(node, inputs);
        break;
      case 'substring':
        result = this.performSubstring(node, inputs);
        break;
      case 'replace':
        result = this.performReplace(node, inputs);
        break;
      case 'match':
        result = this.performMatch(node, inputs);
        break;
      case 'split':
        result = this.performSplit(node, inputs);
        break;
      case 'compare':
        result = this.performCompare(node, inputs);
        break;
      case 'length':
        result = this.performLength(node, inputs);
        break;
      case 'case':
        result = this.performCase(node, inputs);
        break;
      default:
        throw new Error(`Unsupported string operation: ${operation}. Supported operations: concat, substring, replace, match, split, compare, length, case`);
    }
    
    return {
      result,
      operation,
      processedAt: new Date().toISOString(),
      ...inputs
    };
  }
  
  /**
   * Convert value to string
   */
  private toString(value: unknown): string {
    if (value === null || value === undefined) return '';
    return String(value);
  }
  
  /**
   * Get the primary string value from inputs
   */
  private getPrimaryString(node: WorkflowNode, inputs: Record<string, unknown>): string {
    const nodeText = node.inputs.text;
    const inputText = inputs.text;
    const text = inputText || nodeText;
    
    if (text === undefined || text === null) {
      throw new Error('No text provided for string operation');
    }
    
    return this.toString(text);
  }
  
  /**
   * Perform string concatenation
   */
  private performConcat(node: WorkflowNode, inputs: Record<string, unknown>): string {
    const nodeValues = node.inputs.values as unknown[];
    const inputValues = inputs.values as unknown[];
    const allValues = [...(nodeValues || []), ...(inputValues || [])];
    
    if (allValues.length === 0) {
      throw new Error('No values provided for concatenation');
    }
    
    const separator = node.inputs.separator as string || '';
    return allValues.map(value => this.toString(value)).join(separator);
  }
  
  /**
   * Perform substring extraction
   */
  private performSubstring(node: WorkflowNode, inputs: Record<string, unknown>): string {
    const text = this.getPrimaryString(node, inputs);
    const start = (node.inputs.start as number) || 0;
    const end = node.inputs.end as number;
    
    if (start < 0) {
      throw new Error('Start index cannot be negative');
    }
    
    if (end !== undefined) {
      if (end < start) {
        throw new Error('End index cannot be less than start index');
      }
      return text.substring(start, end);
    }
    
    return text.substring(start);
  }
  
  /**
   * Perform string replacement
   */
  private performReplace(node: WorkflowNode, inputs: Record<string, unknown>): string {
    const text = this.getPrimaryString(node, inputs);
    const search = node.inputs.search as string;
    const replacement = this.toString(node.inputs.replacement);
    const useRegex = node.inputs.useRegex as boolean || false;
    const globalReplace = node.inputs.global as boolean || false;
    
    if (!search && search !== '') {
      throw new Error('Search value is required for replace operation');
    }
    
    if (useRegex) {
      const flags = globalReplace ? 'g' : '';
      const regex = new RegExp(search, flags);
      return text.replace(regex, replacement);
    }
    
    if (globalReplace) {
      return text.split(search).join(replacement);
    }
    
    return text.replace(search, replacement);
  }
  
  /**
   * Perform regex matching
   */
  private performMatch(node: WorkflowNode, inputs: Record<string, unknown>): {
    matches: string[];
    found: boolean;
    matchCount: number;
  } {
    const text = this.getPrimaryString(node, inputs);
    const pattern = node.inputs.pattern as string;
    const flags = node.inputs.flags as string || '';
    
    if (!pattern) {
      throw new Error('Pattern is required for match operation');
    }
    
    try {
      const regex = new RegExp(pattern, flags);
      const matches = text.match(regex);
      
      return {
        matches: matches || [],
        found: matches !== null,
        matchCount: matches ? matches.length : 0
      };
    } catch (error) {
      throw new Error(`Invalid regex pattern: ${pattern}`);
    }
  }
  
  /**
   * Perform string splitting
   */
  private performSplit(node: WorkflowNode, inputs: Record<string, unknown>): string[] {
    const text = this.getPrimaryString(node, inputs);
    const delimiter = node.inputs.delimiter as string;
    const limit = node.inputs.limit as number;
    
    if (delimiter === undefined || delimiter === null) {
      throw new Error('Delimiter is required for split operation');
    }
    
    if (limit !== undefined && limit < 0) {
      throw new Error('Limit cannot be negative');
    }
    
    return text.split(delimiter, limit);
  }
  
  /**
   * Perform string comparison
   */
  private performCompare(node: WorkflowNode, inputs: Record<string, unknown>): {
    result: number;
    equal: boolean;
    comparison: string;
  } {
    const text1 = this.getPrimaryString(node, inputs);
    const text2 = this.toString(node.inputs.compareWith);
    const caseSensitive = node.inputs.caseSensitive as boolean ?? true;
    
    const str1 = caseSensitive ? text1 : text1.toLowerCase();
    const str2 = caseSensitive ? text2 : text2.toLowerCase();
    
    let result: number;
    let comparison: string;
    
    if (str1 < str2) {
      result = -1;
      comparison = 'less than';
    } else if (str1 > str2) {
      result = 1;
      comparison = 'greater than';
    } else {
      result = 0;
      comparison = 'equal to';
    }
    
    return {
      result,
      equal: result === 0,
      comparison
    };
  }
  
  /**
   * Get string length
   */
  private performLength(node: WorkflowNode, inputs: Record<string, unknown>): number {
    const text = this.getPrimaryString(node, inputs);
    return text.length;
  }
  
  /**
   * Perform case transformation
   */
  private performCase(node: WorkflowNode, inputs: Record<string, unknown>): string {
    const text = this.getPrimaryString(node, inputs);
    const caseType = node.inputs.caseType as string;
    
    switch (caseType?.toLowerCase()) {
      case 'upper':
        return text.toUpperCase();
      case 'lower':
        return text.toLowerCase();
      case 'title':
        return text.replace(/\w\S*/g, (txt) => 
          txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
        );
      case 'sentence':
        return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
      default:
        throw new Error(`Unsupported case type: ${caseType}. Supported types: upper, lower, title, sentence`);
    }
  }
} 