import type {
  EventListener,
  EventType,
  WorkflowEvent,
} from '../types/index.js';

/**
 * Event system for handling asynchronous workflow events
 * Allows nodes to wait for external events before continuing execution
 */
export class WorkflowEventSystem implements EventListener {
  private listeners: Map<EventType, Set<(event: WorkflowEvent) => void>> = new Map();
  private eventHistory: WorkflowEvent[] = [];
  private maxHistorySize: number;

  constructor(maxHistorySize = 1000) {
    this.maxHistorySize = maxHistorySize;
  }

  /**
   * Register an event listener
   */
  on(eventType: EventType, callback: (event: WorkflowEvent) => void): void {
    if (!this.listeners.has(eventType)) {
      this.listeners.set(eventType, new Set());
    }
    
    this.listeners.get(eventType)!.add(callback);
  }

  /**
   * Unregister an event listener
   */
  off(eventType: EventType, callback: (event: WorkflowEvent) => void): void {
    const listeners = this.listeners.get(eventType);
    if (listeners) {
      listeners.delete(callback);
      if (listeners.size === 0) {
        this.listeners.delete(eventType);
      }
    }
  }

  /**
   * Emit an event to all registered listeners
   */
  emit(event: WorkflowEvent): void {
    // Add to history
    this.eventHistory.push(event);
    if (this.eventHistory.length > this.maxHistorySize) {
      this.eventHistory = this.eventHistory.slice(-this.maxHistorySize);
    }

    // Notify listeners
    const listeners = this.listeners.get(event.type);
    if (listeners) {
      listeners.forEach(callback => {
        try {
          callback(event);
        } catch (error) {
          console.error(`Error in event listener for ${event.type}:`, error);
        }
      });
    }
  }

  /**
   * Wait for a specific event type, with optional timeout
   */
  waitForEvent(
    eventType: EventType,
    timeout?: number,
    predicate?: (event: WorkflowEvent) => boolean
  ): Promise<WorkflowEvent> {
    return new Promise((resolve, reject) => {
      let timeoutId: NodeJS.Timeout | undefined;
      
      const handleEvent = (event: WorkflowEvent) => {
        if (!predicate || predicate(event)) {
          this.off(eventType, handleEvent);
          if (timeoutId) clearTimeout(timeoutId);
          resolve(event);
        }
      };

      this.on(eventType, handleEvent);

      if (timeout && timeout > 0) {
        timeoutId = setTimeout(() => {
          this.off(eventType, handleEvent);
          reject(new Error(`Timeout waiting for event: ${eventType}`));
        }, timeout);
      }
    });
  }

  /**
   * Wait for any of multiple event types
   */
  waitForAnyEvent(
    eventTypes: EventType[],
    timeout?: number,
    predicate?: (event: WorkflowEvent) => boolean
  ): Promise<WorkflowEvent> {
    return new Promise((resolve, reject) => {
      let timeoutId: NodeJS.Timeout | undefined;
      const handlers: Array<(event: WorkflowEvent) => void> = [];

      const cleanup = () => {
        eventTypes.forEach((eventType, index) => {
          this.off(eventType, handlers[index]);
        });
        if (timeoutId) clearTimeout(timeoutId);
      };

      const handleEvent = (event: WorkflowEvent) => {
        if (!predicate || predicate(event)) {
          cleanup();
          resolve(event);
        }
      };

      // Register handlers for each event type
      eventTypes.forEach(eventType => {
        const handler = (event: WorkflowEvent) => handleEvent(event);
        handlers.push(handler);
        this.on(eventType, handler);
      });

      if (timeout && timeout > 0) {
        timeoutId = setTimeout(() => {
          cleanup();
          reject(new Error(`Timeout waiting for events: ${eventTypes.join(', ')}`));
        }, timeout);
      }
    });
  }

  /**
   * Check if an event matching the criteria has already occurred
   */
  hasEventOccurred(
    eventType: EventType,
    predicate?: (event: WorkflowEvent) => boolean,
    since?: Date
  ): WorkflowEvent | null {
    const relevantEvents = this.eventHistory.filter(event => {
      if (event.type !== eventType) return false;
      if (since && event.timestamp < since) return false;
      if (predicate && !predicate(event)) return false;
      return true;
    });

    return relevantEvents.length > 0 ? relevantEvents[relevantEvents.length - 1] : null;
  }

  /**
   * Get event history, optionally filtered by type or time range
   */
  getEventHistory(
    eventType?: EventType,
    since?: Date,
    until?: Date
  ): WorkflowEvent[] {
    return this.eventHistory.filter(event => {
      if (eventType && event.type !== eventType) return false;
      if (since && event.timestamp < since) return false;
      if (until && event.timestamp > until) return false;
      return true;
    });
  }

  /**
   * Clear event history
   */
  clearHistory(): void {
    this.eventHistory = [];
  }

  /**
   * Get the number of registered listeners for each event type
   */
  getListenerCounts(): Record<EventType, number> {
    const counts: Record<EventType, number> = {};
    this.listeners.forEach((listeners, eventType) => {
      counts[eventType] = listeners.size;
    });
    return counts;
  }
} 