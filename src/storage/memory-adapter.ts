import type {
  StorageAdapter,
  WorkflowId,
  WorkflowState,
} from '../types/index.js';

/**
 * In-memory storage adapter
 * Suitable for temporary workflows or development
 */
export class MemoryStorageAdapter implements StorageAdapter {
  private storage: Map<WorkflowId, WorkflowState> = new Map();

  async save(workflowId: WorkflowId, state: WorkflowState): Promise<void> {
    // Deep clone to prevent external mutations
    const clonedState = JSON.parse(JSON.stringify(state));
    
    // Restore Date objects
    if (clonedState.startedAt) {
      clonedState.startedAt = new Date(clonedState.startedAt);
    }
    if (clonedState.completedAt) {
      clonedState.completedAt = new Date(clonedState.completedAt);
    }

    // Restore Date objects in nodes
    Object.values(clonedState.nodes).forEach((node: any) => {
      if (node.startedAt) node.startedAt = new Date(node.startedAt);
      if (node.completedAt) node.completedAt = new Date(node.completedAt);
    });

    // Restore Date objects in events
    clonedState.events.forEach((event: any) => {
      event.timestamp = new Date(event.timestamp);
    });

    this.storage.set(workflowId, clonedState);
  }

  async load(workflowId: WorkflowId): Promise<WorkflowState | null> {
    const state = this.storage.get(workflowId);
    if (!state) return null;

    // Deep clone to prevent external mutations
    return JSON.parse(JSON.stringify(state));
  }

  async delete(workflowId: WorkflowId): Promise<void> {
    this.storage.delete(workflowId);
  }

  async list(): Promise<WorkflowId[]> {
    return Array.from(this.storage.keys());
  }

  /**
   * Clear all stored workflows (useful for testing)
   */
  clear(): void {
    this.storage.clear();
  }

  /**
   * Get the number of stored workflows
   */
  size(): number {
    return this.storage.size;
  }
} 