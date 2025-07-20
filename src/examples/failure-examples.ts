/**
 * Comprehensive examples of failure handling strategies in Flows
 */

import { 
  createFlows, 
  createWorkflow, 
  StorageType,
  FailureStrategy,
  type FlowsConfig,
  type FailureAlert,
} from '../index.js';

// Example 1: Fail Fast Strategy
export async function failFastExample() {
  const config: FlowsConfig = {
    storage: { type: StorageType.MEMORY },
    failureHandling: {
      strategy: FailureStrategy.FAIL_FAST,
    },
    logging: { level: 'info' },
  };

  const flows = createFlows(config);

  const workflow = createWorkflow('fail-fast-example', 'Fail Fast Example', [
    {
      id: 'unreliable-task',
      type: 'http-request',
      inputs: { url: 'https://httpstat.us/500' }, // Always returns 500
      dependencies: [],
    },
    {
      id: 'dependent-task',
      type: 'data',
      inputs: { message: 'This will never execute' },
      dependencies: ['unreliable-task'],
    },
  ]);

  try {
    const result = await flows.startWorkflow(workflow);
    console.log('Fail Fast Result:', result);
  } catch (error) {
    console.log('Expected failure:', error);
  }
}

// Example 2: Retry and DLQ Strategy
export async function retryAndDlqExample() {
  const config: FlowsConfig = {
    storage: { type: StorageType.MEMORY },
    failureHandling: {
      strategy: FailureStrategy.RETRY_AND_DLQ,
      deadLetter: {
        enabled: true,
        maxRetries: 3,
        retentionPeriod: 3600000, // 1 hour
        handler: (node, error, attempts) => {
          console.log(`Node ${node.id} sent to DLQ after ${attempts} attempts: ${error}`);
        },
      },
      monitoring: {
        enabled: true,
        alertingEnabled: true,
        failureRateThreshold: 30,
        alertHandler: (alert: FailureAlert) => {
          console.log('ALERT:', alert);
        },
      },
    },
  };

  const flows = createFlows(config);

  const workflow = createWorkflow('retry-dlq-example', 'Retry and DLQ Example', [
    {
      id: 'flaky-api-call',
      type: 'http-request',
      inputs: { url: 'https://httpstat.us/503' },
      dependencies: [],
      retryConfig: {
        maxAttempts: 3,
        delay: 1000,
        backoffMultiplier: 2,
        maxDelay: 5000,
        jitter: true,
        retryableErrors: ['503', 'timeout', 'network'],
        nonRetryableErrors: ['401', '403'],
      },
    },
    {
      id: 'process-result',
      type: 'data',
      inputs: { processed: true },
      dependencies: ['flaky-api-call'],
    },
  ]);

  const result = await flows.startWorkflow(workflow);
  console.log('Result:', result);

  // Check dead letter queue
  const dlqItems = flows.getDeadLetterQueue('retry-dlq-example');
  console.log('Dead Letter Queue Items:', dlqItems);

  // Get failure metrics
  const metrics = flows.getFailureMetrics('retry-dlq-example');
  console.log('Failure Metrics:', metrics);
}

// Example 3: Circuit Breaker Strategy
export async function circuitBreakerExample() {
  const config: FlowsConfig = {
    storage: { type: StorageType.MEMORY },
    failureHandling: {
      strategy: FailureStrategy.CIRCUIT_BREAKER,
      circuitBreaker: {
        failureThreshold: 3,
        timeWindow: 60000, // 1 minute
        recoveryTimeout: 30000, // 30 seconds
        successThreshold: 2,
      },
      monitoring: {
        enabled: true,
        alertingEnabled: true,
        alertHandler: (alert: FailureAlert) => {
          if (alert.alertType === 'CIRCUIT_OPEN') {
            console.log('🚨 Circuit breaker opened!', alert.message);
          }
        },
      },
    },
  };

  const flows = createFlows(config);

  // Simulate multiple workflow executions to trigger circuit breaker
  for (let i = 0; i < 5; i++) {
    const workflow = createWorkflow(`circuit-test-${i}`, 'Circuit Breaker Test', [
      {
        id: 'external-service',
        type: 'http-request',
        inputs: { url: 'https://httpstat.us/500' },
        dependencies: [],
        retryConfig: {
          maxAttempts: 2,
          delay: 500,
        },
      },
    ]);

    try {
      const result = await flows.startWorkflow(workflow);
      console.log(`Execution ${i} result:`, result.status);
    } catch (error) {
      console.log(`Execution ${i} failed:`, error);
    }

    // Small delay between executions
    await new Promise(resolve => setTimeout(resolve, 1000));
  }
}

// Example 4: Graceful Degradation Strategy
export async function gracefulDegradationExample() {
  const config: FlowsConfig = {
    storage: { type: StorageType.MEMORY },
    failureHandling: {
      strategy: FailureStrategy.GRACEFUL_DEGRADATION,
      gracefulDegradationConfig: {
        continueOnNodeFailure: true,
        skipDependentNodes: false, // Don't skip dependents, use fallbacks
        fallbackResults: {
          'user-preferences': { theme: 'default', language: 'en' },
          'recommendation-engine': { recommendations: [] },
        },
      },
    },
  };

  const flows = createFlows(config);

  const workflow = createWorkflow('graceful-degradation-example', 'Graceful Degradation', [
    {
      id: 'user-data',
      type: 'database-query',
      inputs: { query: 'SELECT * FROM users WHERE id = 1' },
      dependencies: [],
    },
    {
      id: 'user-preferences',
      type: 'external-api',
      inputs: { endpoint: '/preferences' },
      dependencies: ['user-data'],
      timeout: 2000, // Short timeout to simulate failure
    },
    {
      id: 'recommendation-engine',
      type: 'ml-service',
      inputs: { userId: 1 },
      dependencies: ['user-data'],
      timeout: 1000, // Will likely timeout
    },
    {
      id: 'render-page',
      type: 'template',
      inputs: { template: 'user-dashboard' },
      dependencies: ['user-data', 'user-preferences', 'recommendation-engine'],
    },
  ]);

  const result = await flows.startWorkflow(workflow);
  console.log('Graceful Degradation Result:', result);
  console.log('Node Results:', result.nodeResults);
}

// Example 5: Node-Level Failure Configuration
export async function nodeLevelConfigExample() {
  const config: FlowsConfig = {
    storage: { type: StorageType.MEMORY },
    // Global strategy is retry and fail
    failureHandling: {
      strategy: FailureStrategy.RETRY_AND_FAIL,
    },
  };

  const flows = createFlows(config);

  const workflow = createWorkflow('node-level-config', 'Node-Level Configuration', [
    {
      id: 'critical-payment',
      type: 'payment-processor',
      inputs: { amount: 100, currency: 'USD' },
      dependencies: [],
      // Override global strategy for this critical node
      failureHandling: {
        strategy: FailureStrategy.FAIL_FAST, // Must succeed immediately
      },
      retryConfig: {
        maxAttempts: 1, // No retries for payments
        delay: 0,
      },
    },
    {
      id: 'send-notification',
      type: 'email-service',
      inputs: { template: 'payment-confirmation' },
      dependencies: ['critical-payment'],
      // Different strategy for non-critical operations
      failureHandling: {
        strategy: FailureStrategy.RETRY_AND_SKIP, // Can skip if fails
      },
      retryConfig: {
        maxAttempts: 3,
        delay: 2000,
        backoffMultiplier: 1.5,
      },
    },
    {
      id: 'update-analytics',
      type: 'analytics-service',
      inputs: { event: 'payment_completed' },
      dependencies: ['critical-payment'],
      // Use DLQ for analytics (can be processed later)
      failureHandling: {
        strategy: FailureStrategy.RETRY_AND_DLQ,
        deadLetter: {
          enabled: true,
          maxRetries: 2,
        },
      },
    },
  ]);

  const result = await flows.startWorkflow(workflow);
  console.log('Node-Level Config Result:', result);
}

// Example 6: Poison Message Detection
export async function poisonMessageExample() {
  const config: FlowsConfig = {
    storage: { type: StorageType.MEMORY },
    failureHandling: {
      strategy: FailureStrategy.RETRY_AND_DLQ,
      poisonMessageThreshold: 5, // Mark as poison after 5 attempts
      deadLetter: {
        enabled: true,
        handler: (node, error, attempts) => {
          console.log(`⚠️ Potential poison message in node ${node.id} (${attempts} attempts)`);
        },
      },
      monitoring: {
        enabled: true,
        alertingEnabled: true,
        alertHandler: (alert: FailureAlert) => {
          if (alert.alertType === 'POISON_MESSAGE') {
            console.log('☠️ Poison message detected:', alert.message);
          }
        },
      },
    },
  };

  const flows = createFlows(config);

  const workflow = createWorkflow('poison-message-test', 'Poison Message Detection', [
    {
      id: 'malformed-processor',
      type: 'data-processor',
      inputs: { data: 'invalid-json-{malformed}' },
      dependencies: [],
      retryConfig: {
        maxAttempts: 10, // High retry count to trigger poison detection
        delay: 100,
      },
    },
  ]);

  const result = await flows.startWorkflow(workflow);
  console.log('Poison Message Result:', result);
}

// Example 7: Complete Enterprise Configuration
export async function enterpriseConfigExample() {
  const config: FlowsConfig = {
    storage: { 
      type: StorageType.REMOTE,
      config: {
        baseUrl: 'https://api.company.com',
        apiKey: 'your-api-key',
        timeout: 10000,
      },
    },
    failureHandling: {
      strategy: FailureStrategy.CIRCUIT_BREAKER,
      circuitBreaker: {
        failureThreshold: 5,
        timeWindow: 300000, // 5 minutes
        recoveryTimeout: 120000, // 2 minutes
        successThreshold: 3,
        monitoringWindow: 600000, // 10 minutes
      },
      deadLetter: {
        enabled: true,
        maxRetries: 3,
        retentionPeriod: 86400000, // 24 hours
        storage: 'persistent',
        handler: (node, error, attempts) => {
          // Send to monitoring system
          console.log(`DLQ: ${node.id} failed ${attempts} times: ${error}`);
        },
      },
      monitoring: {
        enabled: true,
        failureRateThreshold: 10, // Alert if >10% failure rate
        alertingEnabled: true,
        metricsCollectionInterval: 30000, // 30 seconds
        retentionPeriod: 2592000000, // 30 days
        alertHandler: (alert: FailureAlert) => {
          // Integration with alerting service (PagerDuty, Slack, etc.)
          switch (alert.alertType) {
            case 'HIGH_FAILURE_RATE':
              console.log('📊 High failure rate alert:', alert);
              break;
            case 'CIRCUIT_OPEN':
              console.log('🚨 Circuit breaker alert:', alert);
              break;
            case 'POISON_MESSAGE':
              console.log('☠️ Poison message alert:', alert);
              break;
            case 'DLQ_THRESHOLD':
              console.log('📬 DLQ threshold alert:', alert);
              break;
          }
        },
      },
      poisonMessageThreshold: 8,
      gracefulDegradationConfig: {
        continueOnNodeFailure: true,
        skipDependentNodes: true,
        fallbackResults: {
          'user-service': { id: 0, name: 'Anonymous' },
          'cache-service': {},
        },
      },
    },
    security: {
      validateNodes: true,
      allowedNodeTypes: ['http-request', 'database-query', 'cache-lookup', 'email-send'],
      maxExecutionTime: 300000, // 5 minutes max per node
    },
    logging: {
      level: 'info',
      handler: (message, level) => {
        console.log(`[${level.toUpperCase()}] ${message}`);
      },
    },
  };

  const flows = createFlows(config);
  console.log('Enterprise configuration ready!');
  
  // Clean up resources when done
  // flows.dispose();
}

// Run examples
export async function runAllExamples() {
  console.log('🚀 Running failure handling examples...\n');

  console.log('1. Fail Fast Example:');
  await failFastExample();

  console.log('\n2. Retry and DLQ Example:');
  await retryAndDlqExample();

  console.log('\n3. Circuit Breaker Example:');
  await circuitBreakerExample();

  console.log('\n4. Graceful Degradation Example:');
  await gracefulDegradationExample();

  console.log('\n5. Node-Level Configuration Example:');
  await nodeLevelConfigExample();

  console.log('\n6. Poison Message Example:');
  await poisonMessageExample();

  console.log('\n7. Enterprise Configuration Example:');
  await enterpriseConfigExample();

  console.log('\n✅ All examples completed!');
}

// ================================
// Main Execution Block
// ================================

// This block will run when the file is executed directly
async function main() {
  console.log('🎯 Starting Failure Handling Examples...\n');
  
  try {
    await runAllExamples();
    console.log('\n✨ Failure handling examples completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('\n💥 Failure handling examples failed:', error);
    process.exit(1);
  }
}

// Check if this file is being run directly
if (require.main === module) {
  main().catch((error) => {
    console.error('Unhandled error:', error);
    process.exit(1);
  });
} 