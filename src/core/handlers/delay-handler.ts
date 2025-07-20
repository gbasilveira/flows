import type { WorkflowNode } from '../../types/index.js';

/**
 * Handler for 'delay' node types
 * Delay nodes wait for a specified duration before completing
 */
export class DelayHandler {
  async execute(
    node: WorkflowNode,
    _context: Record<string, unknown>,
    inputs: Record<string, unknown>
  ): Promise<unknown> {
    // Get delay duration from node inputs or default to 1000ms
    const delayMs = (node.inputs.delay as number) || 1000;
    
    // Wait for the specified duration
    await new Promise(resolve => setTimeout(resolve, delayMs));
    
    return { 
      delayed: true, 
      duration: delayMs,
      completedAt: new Date().toISOString(),
      ...inputs
    };
  }
} 