# Flows Editor

A professional, React Flow-based visual editor for the Flows workflow library. Built with FluentUI for a clean, modern interface and designed for both development and production use.

## 🎯 What We Built

This is a comprehensive React Flow-based editor for the Flows library with the following features:

### ✅ Completed Features

- **Professional UI**: Clean, modern interface built with FluentUI
- **Configurable Architecture**: Extensive configuration options for customisation
- **Plugin System**: Extensible plugin architecture for custom node types
- **Drag & Drop**: Intuitive drag-and-drop workflow creation
- **Real-time Validation**: Live workflow validation and error detection
- **Visual Feedback**: Rich visual indicators and status updates
- **Production Ready**: Built for enterprise use with comprehensive error handling
- **Complete Flows Integration**: Full integration with all flows library handlers and plugins
- **Intelligent Tab Navigation**: Auto-centering tabs with keyboard and touch support

### 🏗️ Architecture

```
flows-editor/
├── src/
│   ├── components/
│   │   ├── Editor.tsx          # Main editor component
│   │   ├── nodes/
│   │   │   └── BaseNode.tsx    # Base node component
│   │   └── sidebar/
│   │       └── Sidebar.tsx     # Node palette sidebar
│   ├── store/
│   │   └── index.ts            # Zustand store with immer
│   ├── types/
│   │   └── index.ts            # TypeScript types
│   ├── utils/
│   │   ├── workflow-converter.ts # Conversion utilities
│   │   ├── plugin-registry.ts  # Plugin system
│   │   └── flows-integration.ts # Flows library integration
│   ├── demo/
│   │   ├── App.tsx             # Full demo application
│   │   ├── SimpleDemo.tsx      # Simple demo
│   │   ├── ComprehensiveExample.tsx # Complete example with all handlers
│   │   └── main.tsx            # Demo entry point
│   └── index.ts                # Main exports
├── package.json                 # Dependencies and scripts
├── vite.config.ts              # Build configuration
└── README.md                   # This file
```

### 🎨 Design System

- **FluentUI Integration**: Uses Microsoft's FluentUI for consistent, professional styling
- **Vertical Layout**: Top-down design with sidebar, main canvas, and status bar
- **Responsive Design**: Adapts to different screen sizes
- **Theme Support**: Light/dark theme support (configurable)
- **Professional Styling**: Clean, modern interface with proper spacing and typography
- **Intelligent Tab Navigation**: Smart scrollable tabs that automatically handle category overflow with navigation arrows, keyboard shortcuts, and touch/swipe support

### 🎯 Intelligent Tab Navigation

The editor features smart auto-centering tabs that provide optimal UX:

#### **Auto-centering Behavior**
- Automatically centers the selected tab in the visible area
- Smooth scrolling animation when switching between tabs
- Only scrolls when necessary (within 10px tolerance)
- Natural, intuitive behavior that users expect

#### **Multiple Navigation Methods**
- **Click Navigation**: Click any tab to select and auto-center it
- **Keyboard Navigation**: Use arrow keys to navigate between tabs
- **Touch/Swipe Support**: Swipe left/right on touch devices to switch tabs
- **Auto-centering**: Selected tab is always centered for optimal visibility

#### **Smart Features**
- **Smooth Animations**: Smooth scrolling behavior for better UX
- **Touch-friendly**: Optimised for mobile and tablet devices
- **Accessible**: Full keyboard navigation support
- **Responsive**: Adapts to window resizing and configuration changes

#### **Configuration**
```typescript
const config: EditorConfig = {
  ui: {
    sidebarWidth: 320, // Adjust width to control tab space
    // ... other UI options
  },
  // ... other config options
}
```

### 🔧 Configuration System

The editor accepts a comprehensive configuration object that fully integrates with the flows library:

```typescript
interface EditorConfig {
  // Core settings
  theme?: 'light' | 'dark' | 'auto'
  layout?: 'vertical' | 'horizontal'
  
  // Plugin configuration
  plugins?: PluginManifest[]
  enabledCategories?: string[]
  customCategories?: NodeCategory[]
  
  // UI customization
  ui?: UIConfig
  
  // Workflow engine configuration - Full flows library integration
  flowsConfig?: FlowsConfig
  
  // Editor features
  features?: EditorFeatures
}
```

### 📦 Complete Plugin System

The editor includes a comprehensive plugin system that integrates with all flows library handlers:

```typescript
// Built-in plugin with all flows library handlers
const builtInPlugin: PluginManifest = {
  id: 'flows-built-in',
  name: 'Flows Built-in Operations',
  version: '1.0.0',
  description: 'Complete set of logical, mathematical, string, and flow control operations',
  author: 'Flows Team',
  categories: DEFAULT_CATEGORIES,
  nodeTypes: DEFAULT_NODE_TYPES,
}
```

### 🎯 Complete Node Type Support

The editor supports ALL node types from the flows library:

#### Core Nodes (Always Available)
- **`data`** - Pass-through data nodes that merge inputs
- **`delay`** - Nodes that wait for a specified duration
- **`subflow`** - Nodes that execute other workflows

#### Logical Operations
- **`logic-and`** - Boolean AND operation on multiple values
- **`logic-or`** - Boolean OR operation on multiple values
- **`logic-not`** - Boolean NOT operation on a single value
- **`logic-xor`** - Boolean XOR operation on two values

#### Mathematical Operations
- **`math-add`** - Addition of multiple numbers
- **`math-subtract`** - Subtraction with multiple operands
- **`math-multiply`** - Multiplication of multiple numbers
- **`math-divide`** - Division of two numbers (with zero-division protection)
- **`math-power`** - Exponentiation (base^exponent)
- **`math-modulo`** - Modulo operation (remainder after division)

#### String Manipulation
- **`string-concat`** - Concatenate multiple strings with optional separator
- **`string-substring`** - Extract substring using start/end positions
- **`string-replace`** - Replace text with regex support and global options
- **`string-match`** - Match text against regex patterns
- **`string-split`** - Split string into array using delimiter
- **`string-compare`** - Compare strings with case-sensitivity options
- **`string-length`** - Get string length
- **`string-case`** - Transform case (upper, lower, title, sentence)

#### Flow Control
- **`condition`** - Conditional execution with multiple condition types:
  - `simple` - Basic boolean evaluation
  - `compare` - Value comparison with operators (===, >, <, contains, etc.)
  - `exists` - Check if values are defined, empty, or truthy
  - `range` - Check if numbers fall within specified ranges
- **`merge-all`** - Wait for all dependencies to succeed before proceeding
- **`merge-any`** - Proceed when any dependency succeeds
- **`merge-majority`** - Proceed when majority of dependencies succeed
- **`merge-count`** - Proceed when specific number of dependencies succeed

#### Console Operations
- **`console-log`** - Output messages to console.log with optional data and formatting
- **`console-error`** - Output error messages to console.error with optional data and formatting
- **`console-warn`** - Output warning messages to console.warn with optional data and formatting
- **`console-info`** - Output informational messages to console.info with optional data and formatting
- **`console-debug`** - Output debug messages to console.debug with optional data and formatting
- **`console-table`** - Display tabular data in the console using console.table
- **`console-time`** - Start a timer for performance measurement using console.time
- **`console-timeend`** - End a timer and display elapsed time using console.timeEnd
- **`console-group`** - Create a collapsible group in the console using console.group
- **`console-groupend`** - End a console group using console.groupEnd
- **`console-clear`** - Clear the console using console.clear
- **`console-trace`** - Output a stack trace using console.trace
- **`console-count`** - Count the number of times this node is executed using console.count
- **`console-countreset`** - Reset a counter using console.countReset

## 🚀 Quick Start

### Installation

```bash
# Install the editor package
npm install @flows/editor

# Or with yarn
yarn add @flows/editor

# Or with pnpm
pnpm add @flows/editor
```

### Basic Usage

```tsx
import React from 'react'
import { Editor, EditorConfig } from '@flows/editor'

const config: EditorConfig = {
  theme: 'light',
  layout: 'vertical',
  enabledCategories: ['core', 'logic', 'math', 'string', 'flow', 'console'],
  ui: {
    sidebarWidth: 280,
    minimapEnabled: true,
  },
  flowsConfig: {
    storage: { type: 'memory' },
    logging: { level: 'info' },
    failureHandling: {
      strategy: 'retry',
      config: { maxRetries: 3, retryDelay: 1000 }
    },
  },
  features: {
    dragAndDrop: true,
    validation: true,
    minimap: true,
    subflows: true,
    customHandlers: true,
  },
}

function App() {
  const handleWorkflowChange = (workflow) => {
    console.log('Workflow changed:', workflow)
  }

  const handleWorkflowExecute = (workflow) => {
    console.log('Executing workflow:', workflow)
  }

  return (
    <Editor
      config={config}
      onWorkflowChange={handleWorkflowChange}
      onWorkflowExecute={handleWorkflowExecute}
    />
  )
}
```

### Comprehensive Example

For a complete example showing all handlers and plugins:

```tsx
import { ComprehensiveExample } from '@flows/editor'

function App() {
  return <ComprehensiveExample />
}
```

## 🛠️ Development

### Running the Demo

```bash
# Install dependencies
pnpm install

# Start development server
pnpm dev

# Build for production
pnpm build

# Preview build
pnpm preview
```

### Project Structure

The project is organized for maximum maintainability:

- **Components**: Reusable UI components with FluentUI styling
- **Store**: Zustand state management with immer for immutable updates
- **Types**: Comprehensive TypeScript definitions
- **Utils**: Utility functions for workflow conversion, plugin system, and flows integration
- **Demo**: Example applications showing usage patterns

### State Management

Uses Zustand with immer for efficient state management:

```typescript
// Core state
const { nodes, edges, workflow } = useEditorStore()

// Selection state
const { selectedNodes, selectedEdges } = useEditorStore()

// Editor state
const { isDirty, isExecuting } = useEditorStore()

// Plugin state
const { nodeTypes, categories } = useEditorStore()

// Optimised selectors
const nodes = useNodes()
const edges = useEdges()
const selectedNodes = useSelectedNodes()
const isDirty = useIsDirty()
const nodeTypes = useNodeTypes()
```

## 🎨 Customisation

### Styling

The editor uses FluentUI's design system. Customise the appearance:

```tsx
const config: EditorConfig = {
  ui: {
    sidebarWidth: 300,
    toolbarHeight: 70,
    backgroundColor: '#f8f9fa',
    nodeColors: {
      'data': '#0078d4',
      'logic-and': '#107c10',
      'math-add': '#d13438',
      'string-concat': '#ff8c00',
      'condition': '#5c2d91',
    },
    edgeColors: {
      'default': '#0078d4',
    },
  },
}
```

### Custom Node Types

Create custom node types by extending the base node:

```tsx
import { BaseNode, BaseNodeProps } from '@flows/editor'

const CustomNode: React.FC<BaseNodeProps> = (props) => {
  return (
    <BaseNode
      {...props}
      configurable={true}
      onConfigChange={(nodeId, config) => {
        // Handle configuration changes
      }}
    />
  )
}
```

### Event Handling

Handle editor events for integration:

```tsx
<Editor
  onWorkflowChange={(workflow) => {
    // Workflow structure changed
  }}
  onWorkflowExecute={(workflow) => {
    // Workflow execution started
  }}
  onWorkflowSave={(workflow) => {
    // Save workflow to storage
  }}
  onWorkflowLoad={(workflow) => {
    // Load workflow from storage
  }}
/>
```

## 🔧 API Reference

### Editor Component

```tsx
interface EditorProps {
  config?: EditorConfig
  onWorkflowChange?: (workflow: Workflow) => void
  onWorkflowExecute?: (workflow: Workflow) => void
  onWorkflowSave?: (workflow: Workflow) => void
  onWorkflowLoad?: (workflow: Workflow) => void
}
```