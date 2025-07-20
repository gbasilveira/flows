# Installation

This guide will help you install and set up Flows in your project. Flows supports all major package managers and can be integrated into any JavaScript or TypeScript project.

## Prerequisites

- **Node.js**: Version 16.0.0 or higher
- **JavaScript Environment**: Browser or Node.js runtime
- **Package Manager**: npm, yarn, or pnpm

## Package Installation

Choose your preferred package manager:

::: code-group

```bash [pnpm]
pnpm add flows
```

```bash [npm]
npm install flows
```

```bash [yarn]
yarn add flows
```

```bash [bun]
bun add flows
```

:::

## Verify Installation

Create a simple test file to verify the installation:

```typescript
// test-flows.ts
import { createFlows, StorageType } from 'flows';

console.log('✅ Flows imported successfully!');

const flows = createFlows({
  storage: { type: StorageType.MEMORY }
});

console.log('✅ Flows instance created successfully!');
```

Run the test:

```bash
npx tsx test-flows.ts
# or
node --loader ts-node/esm test-flows.ts
```

## TypeScript Configuration

If you're using TypeScript, ensure your `tsconfig.json` includes proper configuration:

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "lib": ["ES2020", "DOM"],
    "module": "ESNext",
    "moduleResolution": "node",
    "esModuleInterop": true,
    "allowSyntheticDefaultImports": true,
    "skipLibCheck": true,
    "strict": true
  }
}
```

### Type Definitions

Flows includes comprehensive TypeScript definitions. You'll get full type support for:

```typescript
import type { 
  FlowsConfig, 
  WorkflowNode, 
  WorkflowDefinition,
  FailureStrategy,
  StorageType 
} from 'flows';
```

## Framework Integration

### React

```typescript
// hooks/useFlows.ts
import { createFlows, type FlowsConfig } from 'flows';
import { useMemo } from 'react';

export function useFlows(config: FlowsConfig) {
  return useMemo(() => createFlows(config), [config]);
}

// components/WorkflowRunner.tsx
import { useFlows } from '../hooks/useFlows';
import { StorageType } from 'flows';

export function WorkflowRunner() {
  const flows = useFlows({
    storage: { type: StorageType.LOCAL_STORAGE }
  });

  // Use flows in your component...
}
```

### Vue 3

```typescript
// composables/useFlows.ts
import { createFlows, type FlowsConfig } from 'flows';
import { readonly, shallowRef } from 'vue';

export function useFlows(config: FlowsConfig) {
  const flows = shallowRef(createFlows(config));
  
  return {
    flows: readonly(flows)
  };
}
```

### Angular

```typescript
// services/flows.service.ts
import { Injectable } from '@angular/core';
import { createFlows, type FlowsConfig, StorageType } from 'flows';

@Injectable({
  providedIn: 'root'
})
export class FlowsService {
  private flows = createFlows({
    storage: { type: StorageType.LOCAL_STORAGE }
  });

  getFlows() {
    return this.flows;
  }
}
```

### Svelte

```typescript
// stores/flows.ts
import { createFlows, StorageType } from 'flows';
import { writable } from 'svelte/store';

const flows = createFlows({
  storage: { type: StorageType.LOCAL_STORAGE }
});

export const flowsStore = writable(flows);
```

## Bundle Size Considerations

Flows is designed to be lightweight and tree-shakeable:

- **Core bundle**: ~15KB minified + gzipped
- **With all features**: ~45KB minified + gzipped
- **Tree-shakeable**: Only import what you use

### Optimising Bundle Size

Import only the modules you need:

```typescript
// Instead of importing everything
import { createFlows, createWorkflow, StorageType } from 'flows';

// Import specific modules when bundle size matters
import { WorkflowExecutor } from 'flows/core';
import { MemoryStorageAdapter } from 'flows/storage';
```

## Development vs Production

### Development Setup

For development, use memory storage for faster iteration:

```typescript
const config = {
  storage: { type: StorageType.MEMORY },
  logging: { level: 'debug' },
  security: { validateNodes: true },
};
```

### Production Setup

For production, use persistent storage and monitoring:

```typescript
const config = {
  storage: { 
    type: StorageType.REMOTE,
    config: {
      baseUrl: process.env.FLOWS_API_URL,
      apiKey: process.env.FLOWS_API_KEY,
    }
  },
  logging: { level: 'info' },
  security: { 
    validateNodes: true,
    maxExecutionTime: 30000 
  },
  failureHandling: {
    strategy: FailureStrategy.CIRCUIT_BREAKER,
    monitoring: { enabled: true }
  },
};
```

## Environment Variables

Set up environment variables for different configurations:

```bash
# .env.development
FLOWS_STORAGE_TYPE=memory
FLOWS_LOG_LEVEL=debug

# .env.production  
FLOWS_STORAGE_TYPE=remote
FLOWS_API_URL=https://api.yourservice.com
FLOWS_API_KEY=your-api-key
FLOWS_LOG_LEVEL=info
```

```typescript
// config/flows.config.ts
import { StorageType, type FlowsConfig } from 'flows';

export const flowsConfig: FlowsConfig = {
  storage: {
    type: process.env.FLOWS_STORAGE_TYPE as StorageType || StorageType.MEMORY,
    config: {
      baseUrl: process.env.FLOWS_API_URL,
      apiKey: process.env.FLOWS_API_KEY,
    }
  },
  logging: {
    level: process.env.FLOWS_LOG_LEVEL as any || 'info'
  }
};
```

## Common Issues & Solutions

### ESM vs CommonJS

If you encounter module resolution issues:

```typescript
// For CommonJS environments
const { createFlows } = require('flows');

// For ESM environments  
import { createFlows } from 'flows';
```

### Bundle Tool Configuration

#### Webpack

```javascript
// webpack.config.js
module.exports = {
  resolve: {
    alias: {
      'flows': 'flows/dist/index.mjs'
    }
  }
};
```

#### Vite

```javascript
// vite.config.js
export default {
  resolve: {
    alias: {
      'flows': 'flows/dist/index.mjs'
    }
  }
};
```

#### Rollup

```javascript
// rollup.config.js
import resolve from '@rollup/plugin-node-resolve';

export default {
  plugins: [
    resolve({
      preferBuiltins: false,
      browser: true
    })
  ]
};
```

### Browser Compatibility

Flows supports modern browsers with the following features:

- **ES2020**: Native support preferred
- **Promises**: Required for async operations  
- **localStorage**: Required for LOCAL_STORAGE persistence
- **fetch**: Required for REMOTE storage

For older browsers, include polyfills:

```html
<!-- Polyfills for older browsers -->
<script src="https://polyfill.io/v3/polyfill.min.js?features=es2020,fetch,promise"></script>
```

## CDN Installation

For quick prototyping or simple projects:

```html
<!-- ESM CDN -->
<script type="module">
  import { createFlows, StorageType } from 'https://cdn.skypack.dev/flows';
  
  const flows = createFlows({
    storage: { type: StorageType.MEMORY }
  });
</script>

<!-- or with unpkg -->
<script type="module">
  import { createFlows } from 'https://unpkg.com/flows/dist/index.mjs';
</script>
```

## Next Steps

Now that Flows is installed, you're ready to:

1. **[Quick Start](./quick-start.md)** - Create your first workflow
2. **[Core Concepts](./core-concepts.md)** - Understand the fundamental concepts  
3. **[Configuration Guide](./storage.md)** - Set up storage and other options

## Getting Help

If you encounter installation issues:

- 📖 Check the [troubleshooting guide](./troubleshooting.md)
- 🐛 [Report an issue](https://github.com/your-org/flows/issues)
- 💬 [Join the discussion](https://github.com/your-org/flows/discussions)

---

**Installation complete!** 🎉 Let's build your [first workflow](./quick-start.md)! 