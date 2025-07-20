import type {
  StorageAdapter,
  WorkflowId,
  WorkflowState,
} from '../types/index.js';

export interface RemoteStorageConfig {
  baseUrl: string;
  apiKey?: string;
  timeout?: number;
  headers?: Record<string, string>;
}

interface ProcessedRemoteStorageConfig {
  baseUrl: string;
  apiKey?: string;
  timeout: number;
  headers: Record<string, string>;
}

/**
 * Remote API storage adapter
 * Persists workflow state via HTTP API
 */
export class RemoteStorageAdapter implements StorageAdapter {
  private config: ProcessedRemoteStorageConfig;

  constructor(config: RemoteStorageConfig) {
    this.config = {
      timeout: 10000,
      headers: {},
      ...config,
    };

    if (!this.config.baseUrl) {
      throw new Error('Remote storage adapter requires a baseUrl');
    }

    // Ensure baseUrl doesn't end with a slash
    this.config.baseUrl = this.config.baseUrl.replace(/\/$/, '');
  }

  private async request(
    method: string,
    path: string,
    body?: unknown
  ): Promise<Response> {
    const url = `${this.config.baseUrl}${path}`;
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...this.config.headers,
    };

    if (this.config.apiKey) {
      headers.Authorization = `Bearer ${this.config.apiKey}`;
    }

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.config.timeout);

    try {
      const response = await fetch(url, {
        method,
        headers,
        body: body ? JSON.stringify(body) : undefined,
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(
          `HTTP ${response.status}: ${response.statusText}`
        );
      }

      return response;
    } catch (error) {
      clearTimeout(timeoutId);
      
      if (error instanceof Error && error.name === 'AbortError') {
        throw new Error(`Request timeout after ${this.config.timeout}ms`);
      }
      
      throw error;
    }
  }

  async save(workflowId: WorkflowId, state: WorkflowState): Promise<void> {
    await this.request('PUT', `/workflows/${encodeURIComponent(workflowId)}`, state);
  }

  async load(workflowId: WorkflowId): Promise<WorkflowState | null> {
    try {
      const response = await this.request('GET', `/workflows/${encodeURIComponent(workflowId)}`);
      const state = await response.json();
      
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
      if (error instanceof Error && error.message.includes('HTTP 404')) {
        return null;
      }
      throw error;
    }
  }

  async delete(workflowId: WorkflowId): Promise<void> {
    try {
      await this.request('DELETE', `/workflows/${encodeURIComponent(workflowId)}`);
    } catch (error) {
      // Ignore 404 errors when deleting
      if (error instanceof Error && !error.message.includes('HTTP 404')) {
        throw error;
      }
    }
  }

  async list(): Promise<WorkflowId[]> {
    const response = await this.request('GET', '/workflows');
    const data = await response.json();
    
    // Expect the API to return either an array of IDs or an object with an 'ids' property
    if (Array.isArray(data)) {
      return data;
    }
    
    if (data.ids && Array.isArray(data.ids)) {
      return data.ids;
    }
    
    if (data.workflows && Array.isArray(data.workflows)) {
      return data.workflows.map((w: any) => w.id);
    }

    throw new Error('Invalid response format from remote storage API');
  }

  /**
   * Test the connection to the remote storage API
   */
  async testConnection(): Promise<boolean> {
    try {
      await this.request('GET', '/health');
      return true;
    } catch {
      return false;
    }
  }
} 