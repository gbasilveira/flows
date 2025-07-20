import type { WorkflowNode } from '../../types/index.js';

/**
 * Handler for merge operation node types
 * Supports merge strategies: ALL (wait for all dependencies), ANY (proceed when any succeeds)
 */
export class MergeHandler {
  async execute(
    node: WorkflowNode,
    context: Record<string, unknown>,
    inputs: Record<string, unknown>
  ): Promise<unknown> {
    const strategy = node.inputs.strategy as string || 'all';
    
    let result: unknown;
    
    switch (strategy.toLowerCase()) {
      case 'all':
        result = this.handleAllStrategy(node, context, inputs);
        break;
      case 'any':
        result = this.handleAnyStrategy(node, context, inputs);
        break;
      case 'majority':
        result = this.handleMajorityStrategy(node, context, inputs);
        break;
      case 'count':
        result = this.handleCountStrategy(node, context, inputs);
        break;
      default:
        throw new Error(`Unsupported merge strategy: ${strategy}. Supported strategies: all, any, majority, count`);
    }
    
    return {
      mergeStrategy: strategy,
      mergedAt: new Date().toISOString(),
      result,
      ...inputs
    };
  }
  
  /**
   * Handle ALL merge strategy - all dependencies must succeed
   */
  private handleAllStrategy(
    node: WorkflowNode, 
    context: Record<string, unknown>, 
    inputs: Record<string, unknown>
  ): {
    strategy: string;
    allSucceeded: boolean;
    dependencyCount: number;
    successCount: number;
    failureCount: number;
    dependencyResults: Record<string, unknown>;
  } {
    const dependencyResults = this.extractDependencyResults(context, inputs);
    const dependencies = Object.keys(dependencyResults);
    const successes = dependencies.filter(dep => this.isSuccess(dependencyResults[dep]));
    const failures = dependencies.filter(dep => !this.isSuccess(dependencyResults[dep]));
    
    const allSucceeded = failures.length === 0;
    
    if (!allSucceeded && node.inputs.strict !== false) {
      throw new Error(`ALL merge strategy failed: ${failures.length} of ${dependencies.length} dependencies failed. Failed dependencies: ${failures.join(', ')}`);
    }
    
    return {
      strategy: 'all',
      allSucceeded,
      dependencyCount: dependencies.length,
      successCount: successes.length,
      failureCount: failures.length,
      dependencyResults
    };
  }
  
  /**
   * Handle ANY merge strategy - at least one dependency must succeed
   */
  private handleAnyStrategy(
    node: WorkflowNode, 
    context: Record<string, unknown>, 
    inputs: Record<string, unknown>
  ): {
    strategy: string;
    anySucceeded: boolean;
    dependencyCount: number;
    successCount: number;
    failureCount: number;
    firstSuccessful?: string;
    dependencyResults: Record<string, unknown>;
  } {
    const dependencyResults = this.extractDependencyResults(context, inputs);
    const dependencies = Object.keys(dependencyResults);
    const successes = dependencies.filter(dep => this.isSuccess(dependencyResults[dep]));
    const failures = dependencies.filter(dep => !this.isSuccess(dependencyResults[dep]));
    
    const anySucceeded = successes.length > 0;
    
    if (!anySucceeded && node.inputs.strict !== false) {
      throw new Error(`ANY merge strategy failed: all ${dependencies.length} dependencies failed`);
    }
    
    return {
      strategy: 'any',
      anySucceeded,
      dependencyCount: dependencies.length,
      successCount: successes.length,
      failureCount: failures.length,
      firstSuccessful: successes[0],
      dependencyResults
    };
  }
  
  /**
   * Handle MAJORITY merge strategy - more than half must succeed
   */
  private handleMajorityStrategy(
    node: WorkflowNode, 
    context: Record<string, unknown>, 
    inputs: Record<string, unknown>
  ): {
    strategy: string;
    majoritySucceeded: boolean;
    dependencyCount: number;
    successCount: number;
    failureCount: number;
    requiredSuccesses: number;
    dependencyResults: Record<string, unknown>;
  } {
    const dependencyResults = this.extractDependencyResults(context, inputs);
    const dependencies = Object.keys(dependencyResults);
    const successes = dependencies.filter(dep => this.isSuccess(dependencyResults[dep]));
    const failures = dependencies.filter(dep => !this.isSuccess(dependencyResults[dep]));
    
    const requiredSuccesses = Math.floor(dependencies.length / 2) + 1;
    const majoritySucceeded = successes.length >= requiredSuccesses;
    
    if (!majoritySucceeded && node.inputs.strict !== false) {
      throw new Error(`MAJORITY merge strategy failed: ${successes.length} of ${dependencies.length} succeeded, but ${requiredSuccesses} required`);
    }
    
    return {
      strategy: 'majority',
      majoritySucceeded,
      dependencyCount: dependencies.length,
      successCount: successes.length,
      failureCount: failures.length,
      requiredSuccesses,
      dependencyResults
    };
  }
  
  /**
   * Handle COUNT merge strategy - specific number must succeed
   */
  private handleCountStrategy(
    node: WorkflowNode, 
    context: Record<string, unknown>, 
    inputs: Record<string, unknown>
  ): {
    strategy: string;
    countMet: boolean;
    dependencyCount: number;
    successCount: number;
    failureCount: number;
    requiredCount: number;
    dependencyResults: Record<string, unknown>;
  } {
    const requiredCount = node.inputs.requiredCount as number;
    
    if (typeof requiredCount !== 'number' || requiredCount < 0) {
      throw new Error('COUNT merge strategy requires a valid requiredCount (non-negative number)');
    }
    
    const dependencyResults = this.extractDependencyResults(context, inputs);
    const dependencies = Object.keys(dependencyResults);
    const successes = dependencies.filter(dep => this.isSuccess(dependencyResults[dep]));
    const failures = dependencies.filter(dep => !this.isSuccess(dependencyResults[dep]));
    
    const countMet = successes.length >= requiredCount;
    
    if (!countMet && node.inputs.strict !== false) {
      throw new Error(`COUNT merge strategy failed: ${successes.length} of ${dependencies.length} succeeded, but ${requiredCount} required`);
    }
    
    return {
      strategy: 'count',
      countMet,
      dependencyCount: dependencies.length,
      successCount: successes.length,
      failureCount: failures.length,
      requiredCount,
      dependencyResults
    };
  }
  
  /**
   * Extract dependency results from context and inputs
   */
  private extractDependencyResults(context: Record<string, unknown>, inputs: Record<string, unknown>): Record<string, unknown> {
    const contextResults = context.dependencyResults as Record<string, unknown> || {};
    const inputResults = inputs.dependencyResults as Record<string, unknown> || {};
    
    // Merge context and input results, with inputs taking precedence
    const dependencyResults = { ...contextResults, ...inputResults };
    
    // Also check for individual dependency results passed as separate properties
    Object.keys(inputs).forEach(key => {
      if (key.startsWith('dep_') || key.startsWith('dependency_')) {
        dependencyResults[key] = inputs[key];
      }
    });
    
    if (Object.keys(dependencyResults).length === 0) {
      throw new Error('No dependency results found for merge operation');
    }
    
    return dependencyResults;
  }
  
  /**
   * Determine if a dependency result represents success
   */
  private isSuccess(result: unknown): boolean {
    if (result === null || result === undefined) return false;
    
    // Check for explicit success indicators
    if (typeof result === 'object' && result !== null) {
      const obj = result as Record<string, unknown>;
      
      // Check for common success patterns
      if ('success' in obj) return Boolean(obj.success);
      if ('status' in obj) {
        const status = String(obj.status).toLowerCase();
        return status === 'success' || status === 'completed' || status === 'ok';
      }
      if ('error' in obj) return !obj.error;
      if ('failed' in obj) return !obj.failed;
    }
    
    // Check for boolean values
    if (typeof result === 'boolean') return result;
    
    // Check for string status values
    if (typeof result === 'string') {
      const status = result.toLowerCase();
      return status === 'success' || status === 'completed' || status === 'ok' || status === 'true';
    }
    
    // Check for number status codes (200-299 range typically indicates success)
    if (typeof result === 'number') {
      return result >= 200 && result < 300;
    }
    
    // Default: truthy values are considered success
    return Boolean(result);
  }
} 