import type {
  StorageAdapter,
  WorkflowId,
  WorkflowState,
} from '../types/index.js';

/**
 * LocalStorage adapter for browser environments
 * Persists workflow state in the browser's localStorage
 */
export class LocalStorageAdapter implements StorageAdapter {
  private readonly keyPrefix: string;

  constructor(keyPrefix = 'flows_workflow_') {
    this.keyPrefix = keyPrefix;
    
    // Check if localStorage is available
    if (typeof localStorage === 'undefined') {
      throw new Error(
        'LocalStorage is not available in this environment. Use MemoryStorageAdapter or RemoteStorageAdapter instead.'
      );
    }
  }

  private getStorageKey(workflowId: WorkflowId): string {
    return `${this.keyPrefix}${workflowId}`;
  }

  private getIndexKey(): string {
    return `${this.keyPrefix}index`;
  }

  async save(workflowId: WorkflowId, state: WorkflowState): Promise<void> {
    try {
      const serialized = JSON.stringify(state);
      const storageKey = this.getStorageKey(workflowId);
      
      localStorage.setItem(storageKey, serialized);
      
      // Update the index of workflow IDs
      await this.updateIndex(workflowId, true);
    } catch (error) {
      if (error instanceof Error && error.name === 'QuotaExceededError') {
        throw new Error('LocalStorage quota exceeded. Cannot save workflow state.');
      }
      throw error;
    }
  }

  async load(workflowId: WorkflowId): Promise<WorkflowState | null> {
    const storageKey = this.getStorageKey(workflowId);
    const serialized = localStorage.getItem(storageKey);
    
    if (!serialized) return null;

    try {
      const state = JSON.parse(serialized);
      
      // Restore Date objects
      if (state.startedAt) state.startedAt = new Date(state.startedAt);
      if (state.completedAt) state.completedAt = new Date(state.completedAt);

      // Restore Date objects in nodes
      Object.values(state.nodes || {}).forEach((node: any) => {
        if (node.startedAt) node.startedAt = new Date(node.startedAt);
        if (node.completedAt) node.completedAt = new Date(node.completedAt);
      });

      // Restore Date objects in events
      (state.events || []).forEach((event: any) => {
        event.timestamp = new Date(event.timestamp);
      });

      return state;
    } catch (error) {
      console.error(`Failed to parse workflow state for ${workflowId}:`, error);
      return null;
    }
  }

  async delete(workflowId: WorkflowId): Promise<void> {
    const storageKey = this.getStorageKey(workflowId);
    localStorage.removeItem(storageKey);
    
    // Update the index
    await this.updateIndex(workflowId, false);
  }

  async list(): Promise<WorkflowId[]> {
    const indexKey = this.getIndexKey();
    const indexData = localStorage.getItem(indexKey);
    
    if (!indexData) return [];

    try {
      return JSON.parse(indexData);
    } catch {
      // If index is corrupted, rebuild it
      return this.rebuildIndex();
    }
  }

  /**
   * Update the index of workflow IDs
   */
  private async updateIndex(workflowId: WorkflowId, add: boolean): Promise<void> {
    const currentIds = await this.list();
    
    if (add && !currentIds.includes(workflowId)) {
      currentIds.push(workflowId);
    } else if (!add) {
      const index = currentIds.indexOf(workflowId);
      if (index > -1) {
        currentIds.splice(index, 1);
      }
    }

    const indexKey = this.getIndexKey();
    localStorage.setItem(indexKey, JSON.stringify(currentIds));
  }

  /**
   * Rebuild the index by scanning all localStorage keys
   */
  private rebuildIndex(): WorkflowId[] {
    const workflowIds: WorkflowId[] = [];
    
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key?.startsWith(this.keyPrefix) && key !== this.getIndexKey()) {
        const workflowId = key.replace(this.keyPrefix, '');
        workflowIds.push(workflowId);
      }
    }

    // Save the rebuilt index
    const indexKey = this.getIndexKey();
    localStorage.setItem(indexKey, JSON.stringify(workflowIds));
    
    return workflowIds;
  }

  /**
   * Clear all workflow data from localStorage
   */
  clear(): void {
    const keys = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key?.startsWith(this.keyPrefix)) {
        keys.push(key);
      }
    }
    
    keys.forEach(key => localStorage.removeItem(key));
  }
} 