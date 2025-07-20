import type { WorkflowNode } from '../../types/index.js';

/**
 * Handler for 'data' node types
 * Data nodes pass through and merge their inputs with runtime inputs
 */
export class DataHandler {
  async execute(
    node: WorkflowNode,
    _context: Record<string, unknown>,
    inputs: Record<string, unknown>
  ): Promise<unknown> {
    // Data nodes pass through their inputs merged with runtime inputs
    return { ...node.inputs, ...inputs };
  }
} 