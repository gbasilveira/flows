import type {
  WorkflowNode,
  NodeState,
  WorkflowState,
  CircuitBreakerState,
  CircuitBreakerConfig,
  DeadLetterItem,
  FailureMetrics,
  FailureAlert,
  FailureHandlingConfig,
  NodeId,
  WorkflowId,
} from '../types/index.js';

import {
  FailureStrategy,
  FailureType,
  CircuitState,
  ExecutionStatus,
} from '../types/index.js';

/**
 * Comprehensive failure handling manager
 * Implements circuit breaker, dead letter queue, failure monitoring, and various strategies
 */
export class FailureManager {
  private circuitBreakers: Map<string, CircuitBreakerState> = new Map();
  private deadLetterQueue: Map<WorkflowId, DeadLetterItem[]> = new Map();
  private failureMetrics: Map<string, FailureMetrics> = new Map();
  private poisonMessages: Set<string> = new Set();
  private monitoringIntervals: Map<string, NodeJS.Timeout> = new Map();

  constructor(private globalConfig?: FailureHandlingConfig) {
    if (globalConfig?.monitoring?.enabled) {
      this.startMonitoring();
    }
  }

  /**
   * Determine if a node should execute based on failure handling rules
   */
  shouldExecuteNode(
    node: WorkflowNode,
    nodeState: NodeState,
    workflowState: WorkflowState
  ): { canExecute: boolean; reason?: string } {
    const config = this.getEffectiveConfig(node, workflowState);

    // Check if message is poisoned
    const messageKey = this.getMessageKey(workflowState.id, node.id);
    if (this.poisonMessages.has(messageKey)) {
      return { canExecute: false, reason: 'Poison message detected' };
    }

    // Check circuit breaker state
    if (config.strategy === FailureStrategy.CIRCUIT_BREAKER && config.circuitBreaker) {
      const circuitState = this.getCircuitBreakerState(workflowState.id, node.id);
      if (circuitState.state === CircuitState.OPEN) {
        if (!this.shouldAttemptHalfOpen(circuitState, config.circuitBreaker)) {
          nodeState.status = ExecutionStatus.CIRCUIT_OPEN;
          return { canExecute: false, reason: 'Circuit breaker is open' };
        } else {
          // Transition to half-open
          circuitState.state = CircuitState.HALF_OPEN;
          this.updateCircuitBreakerState(workflowState.id, node.id, circuitState);
        }
      }
    }

    return { canExecute: true };
  }

  /**
   * Handle node execution failure
   */
  async handleNodeFailure(
    node: WorkflowNode,
    nodeState: NodeState,
    workflowState: WorkflowState,
    error: Error
  ): Promise<{ shouldRetry: boolean; shouldContinue: boolean }> {
    const config = this.getEffectiveConfig(node, workflowState);
    const failureType = this.classifyFailure(error, node);
    
    // Update metrics
    this.updateFailureMetrics(workflowState.id, node.id, failureType);
    
    nodeState.failureType = failureType;
    nodeState.lastFailureTime = new Date();
    nodeState.consecutiveFailures = (nodeState.consecutiveFailures || 0) + 1;

    // Check for poison message
    const poisonThreshold = config.poisonMessageThreshold || 10;
    if (nodeState.attempts >= poisonThreshold) {
      this.markAsPoisonMessage(workflowState.id, node.id);
      nodeState.isPoisonMessage = true;
      this.sendAlert(workflowState.id, node.id, 'POISON_MESSAGE', 
        `Node ${node.id} marked as poison after ${nodeState.attempts} attempts`);
    }

    // Handle based on strategy
    switch (config.strategy) {
      case FailureStrategy.FAIL_FAST:
        return { shouldRetry: false, shouldContinue: false };

      case FailureStrategy.RETRY_AND_FAIL:
        return await this.handleRetryAndFail(node, nodeState, error);

      case FailureStrategy.RETRY_AND_DLQ:
        return await this.handleRetryAndDLQ(node, nodeState, workflowState, error, config);

      case FailureStrategy.RETRY_AND_SKIP:
        return await this.handleRetryAndSkip(node, nodeState, error);

      case FailureStrategy.CIRCUIT_BREAKER:
        return await this.handleCircuitBreaker(node, nodeState, workflowState, error, config);

      case FailureStrategy.GRACEFUL_DEGRADATION:
        return await this.handleGracefulDegradation(node, nodeState, workflowState, error, config);

      default:
        return { shouldRetry: false, shouldContinue: false };
    }
  }

  /**
   * Handle node execution success
   */
  handleNodeSuccess(
    node: WorkflowNode,
    nodeState: NodeState,
    workflowState: WorkflowState
  ): void {
    // Reset failure counters
    nodeState.consecutiveFailures = 0;
    nodeState.lastFailureTime = undefined;

    // Update circuit breaker state
    const config = this.getEffectiveConfig(node, workflowState);
    if (config.strategy === FailureStrategy.CIRCUIT_BREAKER && config.circuitBreaker) {
      const circuitState = this.getCircuitBreakerState(workflowState.id, node.id);
      
      if (circuitState.state === CircuitState.HALF_OPEN) {
        circuitState.consecutiveSuccesses = (circuitState.consecutiveSuccesses || 0) + 1;
        const successThreshold = config.circuitBreaker.successThreshold || 3;
        
        if (circuitState.consecutiveSuccesses >= successThreshold) {
          // Close the circuit
          circuitState.state = CircuitState.CLOSED;
          circuitState.failureCount = 0;
          circuitState.consecutiveSuccesses = 0;
          circuitState.lastSuccessTime = new Date();
        }
      } else if (circuitState.state === CircuitState.CLOSED) {
        circuitState.lastSuccessTime = new Date();
        circuitState.failureCount = Math.max(0, circuitState.failureCount - 1); // Slowly recover
      }

      this.updateCircuitBreakerState(workflowState.id, node.id, circuitState);
    }

    // Update success metrics
    this.updateSuccessMetrics(workflowState.id, node.id);
  }

  /**
   * Get dead letter queue items for a workflow
   */
  getDeadLetterQueue(workflowId: WorkflowId): DeadLetterItem[] {
    return this.deadLetterQueue.get(workflowId) || [];
  }

  /**
   * Retry a dead letter queue item
   */
  retryDeadLetterItem(workflowId: WorkflowId, itemId: string): DeadLetterItem | null {
    const dlq = this.deadLetterQueue.get(workflowId);
    if (!dlq) return null;

    const itemIndex = dlq.findIndex(item => item.id === itemId);
    if (itemIndex === -1) return null;

    const item = dlq[itemIndex];
    if (!item.canRetry) return null;

    // Remove from DLQ and reset for retry
    dlq.splice(itemIndex, 1);
    item.retryCount++;

    return item;
  }

  /**
   * Get failure metrics for a node
   */
  getFailureMetrics(workflowId: WorkflowId, nodeId?: NodeId): FailureMetrics[] {
    const results: FailureMetrics[] = [];
    
    for (const [key, metrics] of this.failureMetrics) {
      if (key.startsWith(`${workflowId}:`)) {
        if (!nodeId || key === `${workflowId}:${nodeId}`) {
          results.push(metrics);
        }
      }
    }

    return results;
  }

  /**
   * Calculate retry delay with jitter and backoff
   */
  calculateRetryDelay(
    baseDelay: number,
    attempt: number,
    backoffMultiplier: number = 2,
    maxDelay: number = 30000,
    useJitter: boolean = false
  ): number {
    let delay = baseDelay * Math.pow(backoffMultiplier, attempt - 1);
    delay = Math.min(delay, maxDelay);

    if (useJitter) {
      // Add ±25% jitter
      const jitterRange = delay * 0.25;
      delay += (Math.random() * jitterRange * 2) - jitterRange;
    }

    return Math.max(delay, 0);
  }

  // Private methods

  private getEffectiveConfig(node: WorkflowNode, workflowState: WorkflowState): FailureHandlingConfig {
    // Node-level config takes precedence over workflow-level, then global
    return {
      ...this.globalConfig,
      ...workflowState.definition.failureHandling,
      ...node.failureHandling,
    } as FailureHandlingConfig;
  }

  private classifyFailure(error: Error, _node: WorkflowNode): FailureType {
    const message = error.message.toLowerCase();
    
    // Security errors
    if (message.includes('unauthorized') || message.includes('forbidden') || 
        message.includes('authentication') || message.includes('permission')) {
      return FailureType.SECURITY;
    }

    // Resource errors
    if (message.includes('memory') || message.includes('disk') || 
        message.includes('quota') || message.includes('rate limit')) {
      return FailureType.RESOURCE;
    }

    // Network/timeout errors (transient)
    if (message.includes('timeout') || message.includes('network') || 
        message.includes('connection') || message.includes('econnrefused') ||
        message.includes('enotfound') || message.includes('socket')) {
      return FailureType.TRANSIENT;
    }

    // Dependency errors
    if (message.includes('service unavailable') || message.includes('bad gateway') ||
        message.includes('gateway timeout') || message.includes('connection refused')) {
      return FailureType.DEPENDENCY;
    }

    // Validation errors (permanent)
    if (message.includes('validation') || message.includes('invalid') || 
        message.includes('malformed') || message.includes('schema')) {
      return FailureType.PERMANENT;
    }

    // Default to transient for unknown errors
    return FailureType.TRANSIENT;
  }

  private async handleRetryAndFail(
    node: WorkflowNode,
    nodeState: NodeState,
    error: Error
  ): Promise<{ shouldRetry: boolean; shouldContinue: boolean }> {
    if (!node.retryConfig) {
      return { shouldRetry: false, shouldContinue: false };
    }

    const shouldRetry = this.shouldRetryError(error, node.retryConfig) && 
                       nodeState.attempts < node.retryConfig.maxAttempts;

    return { shouldRetry, shouldContinue: !shouldRetry };
  }

  private async handleRetryAndDLQ(
    node: WorkflowNode,
    nodeState: NodeState,
    workflowState: WorkflowState,
    error: Error,
    config: FailureHandlingConfig
  ): Promise<{ shouldRetry: boolean; shouldContinue: boolean }> {
    const maxRetries = node.retryConfig?.maxAttempts || 3;
    
    if (nodeState.attempts < maxRetries && this.shouldRetryError(error, node.retryConfig)) {
      return { shouldRetry: true, shouldContinue: false };
    }

    // Send to dead letter queue
    if (config.deadLetter?.enabled) {
      await this.sendToDeadLetterQueue(node, nodeState, workflowState, error);
      nodeState.deadLettered = true;
      nodeState.status = ExecutionStatus.DEAD_LETTERED;
    }

    return { shouldRetry: false, shouldContinue: true };
  }

  private async handleRetryAndSkip(
    node: WorkflowNode,
    nodeState: NodeState,
    error: Error
  ): Promise<{ shouldRetry: boolean; shouldContinue: boolean }> {
    if (!node.retryConfig) {
      nodeState.status = ExecutionStatus.SKIPPED;
      return { shouldRetry: false, shouldContinue: true };
    }

    const shouldRetry = this.shouldRetryError(error, node.retryConfig) && 
                       nodeState.attempts < node.retryConfig.maxAttempts;

    if (!shouldRetry) {
      nodeState.status = ExecutionStatus.SKIPPED;
    }

    return { shouldRetry, shouldContinue: true };
  }

  private async handleCircuitBreaker(
    node: WorkflowNode,
    nodeState: NodeState,
    workflowState: WorkflowState,
    error: Error,
    config: FailureHandlingConfig
  ): Promise<{ shouldRetry: boolean; shouldContinue: boolean }> {
    if (!config.circuitBreaker) {
      return { shouldRetry: false, shouldContinue: false };
    }

    const circuitState = this.getCircuitBreakerState(workflowState.id, node.id);
    circuitState.failureCount++;
    circuitState.lastFailureTime = new Date();

    // Check if we should open the circuit
    if (circuitState.state === CircuitState.CLOSED && 
        circuitState.failureCount >= config.circuitBreaker.failureThreshold) {
      circuitState.state = CircuitState.OPEN;
      circuitState.nextAttemptTime = new Date(Date.now() + config.circuitBreaker.recoveryTimeout);
      
      this.sendAlert(workflowState.id, node.id, 'CIRCUIT_OPEN', 
        `Circuit breaker opened after ${circuitState.failureCount} failures`);
    } else if (circuitState.state === CircuitState.HALF_OPEN) {
      // Failed in half-open, go back to open
      circuitState.state = CircuitState.OPEN;
      circuitState.nextAttemptTime = new Date(Date.now() + config.circuitBreaker.recoveryTimeout);
      circuitState.consecutiveSuccesses = 0;
    }

    this.updateCircuitBreakerState(workflowState.id, node.id, circuitState);

    // Try standard retry logic first
    const shouldRetry = this.shouldRetryError(error, node.retryConfig) && 
                       nodeState.attempts < (node.retryConfig?.maxAttempts || 3);

    return { shouldRetry, shouldContinue: false };
  }

  private async handleGracefulDegradation(
    node: WorkflowNode,
    nodeState: NodeState,
    workflowState: WorkflowState,
    error: Error,
    config: FailureHandlingConfig
  ): Promise<{ shouldRetry: boolean; shouldContinue: boolean }> {
    const gracefulConfig = config.gracefulDegradationConfig;
    
    // Try retry first
    if (node.retryConfig && nodeState.attempts < node.retryConfig.maxAttempts && 
        this.shouldRetryError(error, node.retryConfig)) {
      return { shouldRetry: true, shouldContinue: false };
    }

    // Apply fallback result if configured
    if (gracefulConfig?.fallbackResults?.[node.id]) {
      nodeState.result = gracefulConfig.fallbackResults[node.id];
      nodeState.status = ExecutionStatus.COMPLETED;
      return { shouldRetry: false, shouldContinue: true };
    }

    // Continue execution if configured
    if (gracefulConfig?.continueOnNodeFailure) {
      nodeState.status = ExecutionStatus.SKIPPED;
      
      // Skip dependent nodes if configured
      if (gracefulConfig.skipDependentNodes) {
        this.markDependentNodesAsSkipped(node, workflowState);
      }
      
      return { shouldRetry: false, shouldContinue: true };
    }

    return { shouldRetry: false, shouldContinue: false };
  }

  private shouldRetryError(error: Error, retryConfig?: any): boolean {
    if (!retryConfig) return true;

    const message = error.message;

    // Check non-retryable errors first
    if (retryConfig.nonRetryableErrors) {
      for (const pattern of retryConfig.nonRetryableErrors) {
        if (message.includes(pattern)) {
          return false;
        }
      }
    }

    // If retryable errors are specified, only retry those
    if (retryConfig.retryableErrors && retryConfig.retryableErrors.length > 0) {
      return retryConfig.retryableErrors.some((pattern: string) => message.includes(pattern));
    }

    // Default: retry transient errors, don't retry permanent ones
    const failureType = this.classifyFailure(error, {} as WorkflowNode);
    return failureType === FailureType.TRANSIENT || failureType === FailureType.DEPENDENCY;
  }

  private async sendToDeadLetterQueue(
    node: WorkflowNode,
    nodeState: NodeState,
    workflowState: WorkflowState,
    error: Error
  ): Promise<void> {
    const dlqItem: DeadLetterItem = {
      id: `${workflowState.id}-${node.id}-${Date.now()}`,
      workflowId: workflowState.id,
      nodeId: node.id,
      originalNode: node,
      error: error.message,
      failureType: nodeState.failureType || FailureType.TRANSIENT,
      attempts: nodeState.attempts,
      timestamp: new Date(),
      retryCount: 0,
      canRetry: true,
    };

    let dlq = this.deadLetterQueue.get(workflowState.id);
    if (!dlq) {
      dlq = [];
      this.deadLetterQueue.set(workflowState.id, dlq);
    }

    dlq.push(dlqItem);

    // Call custom handler if provided
    const config = this.getEffectiveConfig(node, workflowState);
    if (config.deadLetter?.handler) {
      config.deadLetter.handler(node, error.message, nodeState.attempts);
    }
  }

  private getCircuitBreakerState(workflowId: WorkflowId, nodeId: NodeId): CircuitBreakerState {
    const key = `${workflowId}:${nodeId}`;
    let state = this.circuitBreakers.get(key);
    
    if (!state) {
      state = {
        state: CircuitState.CLOSED,
        failureCount: 0,
        consecutiveSuccesses: 0,
      };
      this.circuitBreakers.set(key, state);
    }

    return state;
  }

  private updateCircuitBreakerState(workflowId: WorkflowId, nodeId: NodeId, state: CircuitBreakerState): void {
    const key = `${workflowId}:${nodeId}`;
    this.circuitBreakers.set(key, state);
  }

  private shouldAttemptHalfOpen(state: CircuitBreakerState, _config: CircuitBreakerConfig): boolean {
    if (!state.nextAttemptTime) return true;
    return Date.now() >= state.nextAttemptTime.getTime();
  }

  private markAsPoisonMessage(workflowId: WorkflowId, nodeId: NodeId): void {
    const key = this.getMessageKey(workflowId, nodeId);
    this.poisonMessages.add(key);
  }

  private getMessageKey(workflowId: WorkflowId, nodeId: NodeId): string {
    return `${workflowId}:${nodeId}`;
  }

  private markDependentNodesAsSkipped(node: WorkflowNode, workflowState: WorkflowState): void {
    const toSkip = new Set<NodeId>();
    const queue = [node.id];

    while (queue.length > 0) {
      const currentId = queue.shift()!;
      
      // Find nodes that depend on this one
      for (const otherNode of workflowState.definition.nodes) {
        if (otherNode.dependencies.includes(currentId) && !toSkip.has(otherNode.id)) {
          toSkip.add(otherNode.id);
          queue.push(otherNode.id);
        }
      }
    }

    // Mark nodes as skipped
    for (const nodeId of toSkip) {
      const nodeState = workflowState.nodes[nodeId];
      if (nodeState && nodeState.status === ExecutionStatus.PENDING) {
        nodeState.status = ExecutionStatus.SKIPPED;
      }
    }
  }

  private updateFailureMetrics(workflowId: WorkflowId, nodeId: NodeId, failureType: FailureType): void {
    const key = `${workflowId}:${nodeId}`;
    let metrics = this.failureMetrics.get(key);

    if (!metrics) {
      metrics = {
        workflowId,
        nodeId: nodeId,
        totalExecutions: 0,
        totalFailures: 0,
        failureRate: 0,
        failuresByType: {
          [FailureType.TRANSIENT]: 0,
          [FailureType.PERMANENT]: 0,
          [FailureType.POISON]: 0,
          [FailureType.DEPENDENCY]: 0,
          [FailureType.RESOURCE]: 0,
          [FailureType.SECURITY]: 0,
        },
        averageRetryAttempts: 0,
        poisonMessageCount: 0,
        circuitOpenCount: 0,
        deadLetterCount: 0,
      };
    }

    metrics.totalExecutions++;
    metrics.totalFailures++;
    metrics.failuresByType[failureType]++;
    metrics.failureRate = (metrics.totalFailures / metrics.totalExecutions) * 100;
    metrics.lastFailureTime = new Date();

    if (failureType === FailureType.POISON) {
      metrics.poisonMessageCount++;
    }

    this.failureMetrics.set(key, metrics);
  }

  private updateSuccessMetrics(workflowId: WorkflowId, nodeId: NodeId): void {
    const key = `${workflowId}:${nodeId}`;
    let metrics = this.failureMetrics.get(key);

    if (!metrics) {
      metrics = {
        workflowId,
        nodeId: nodeId,
        totalExecutions: 0,
        totalFailures: 0,
        failureRate: 0,
        failuresByType: {
          [FailureType.TRANSIENT]: 0,
          [FailureType.PERMANENT]: 0,
          [FailureType.POISON]: 0,
          [FailureType.DEPENDENCY]: 0,
          [FailureType.RESOURCE]: 0,
          [FailureType.SECURITY]: 0,
        },
        averageRetryAttempts: 0,
        poisonMessageCount: 0,
        circuitOpenCount: 0,
        deadLetterCount: 0,
      };
    }

    metrics.totalExecutions++;
    metrics.failureRate = (metrics.totalFailures / metrics.totalExecutions) * 100;

    this.failureMetrics.set(key, metrics);
  }

  private sendAlert(workflowId: WorkflowId, nodeId: NodeId | undefined, alertType: FailureAlert['alertType'], message: string): void {
    if (!this.globalConfig?.monitoring?.alertingEnabled) return;

    const alert: FailureAlert = {
      workflowId,
      nodeId,
      alertType,
      message,
      timestamp: new Date(),
    };

    if (this.globalConfig?.monitoring?.alertHandler) {
      try {
        this.globalConfig.monitoring.alertHandler(alert);
      } catch (error) {
        console.error('Error in alert handler:', error);
      }
    }
  }

  private startMonitoring(): void {
    const config = this.globalConfig?.monitoring;
    if (!config?.enabled) return;

    const interval = config.metricsCollectionInterval || 60000; // 1 minute default

    const monitoringInterval = setInterval(() => {
      this.checkFailureRates();
      this.cleanupOldMetrics();
    }, interval);

    this.monitoringIntervals.set('global', monitoringInterval);
  }

  private checkFailureRates(): void {
    const config = this.globalConfig?.monitoring;
    if (!config?.enabled || !config.alertingEnabled) return;

    const threshold = config.failureRateThreshold || 50; // 50% default

    for (const [_key, metrics] of this.failureMetrics) {
      if (metrics.failureRate > threshold) {
        this.sendAlert(
          metrics.workflowId,
          metrics.nodeId,
          'HIGH_FAILURE_RATE',
          `High failure rate detected: ${metrics.failureRate.toFixed(2)}% (threshold: ${threshold}%)`
        );
      }
    }
  }

  private cleanupOldMetrics(): void {
    const config = this.globalConfig?.monitoring;
    if (!config?.retentionPeriod) return;

    const cutoff = new Date(Date.now() - config.retentionPeriod);

    for (const [key, metrics] of this.failureMetrics) {
      if (metrics.lastFailureTime && metrics.lastFailureTime < cutoff) {
        this.failureMetrics.delete(key);
      }
    }
  }

  /**
   * Cleanup resources
   */
  dispose(): void {
    for (const [_key, interval] of this.monitoringIntervals) {
      clearInterval(interval);
    }
    this.monitoringIntervals.clear();
  }
} 