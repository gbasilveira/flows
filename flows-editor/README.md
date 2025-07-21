# Flows Editor

A professional, React Flow-based visual editor for the Flows workflow library. Built with FluentUI for a clean, modern interface and designed for both development and production use.

## 🎯 What We Built

This is a comprehensive React Flow-based editor for the Flows library with the following features:

### ✅ Completed Features

- **Professional UI**: Clean, modern interface built with FluentUI
- **Configurable Architecture**: Extensive configuration options for customisation
- **Plugin System**: Extensible plugin architecture for custom node types
- **Drag & Drop**: ✅ **FULLY FUNCTIONAL** - Intuitive drag-and-drop workflow creation with all handlers
- **Real-time Validation**: Live workflow validation and error detection
- **Visual Feedback**: Rich visual indicators and status updates
- **Production Ready**: Built for enterprise use with comprehensive error handling
- **Complete Flows Integration**: Full integration with all flows library handlers and plugins
- **Intelligent Tab Navigation**: Auto-centering tabs with keyboard and touch support

### 🎯 Drag & Drop Functionality

The editor now features **complete drag and drop functionality** for all node types:

#### **How It Works**
1. **Drag from Sidebar**: Click and drag any node type from the sidebar palette
2. **Drop on Canvas**: Drop the node anywhere on the ReactFlow canvas
3. **Automatic Positioning**: Nodes are positioned at the exact drop location
4. **Visual Feedback**: Smooth drag animations and visual indicators
5. **Node Creation**: Nodes are created with proper inputs/outputs based on their type

#### **Supported Node Types**
All node types from the flows library are now draggable and functional:

**Core Nodes**:
- **`data`** - Pass-through data nodes with configurable inputs
- **`delay`** - Wait nodes with duration configuration
- **`subflow`** - Execute other workflows with workflow ID input

**Logical Operations**:
- **`logic-and`** - Boolean AND operation on multiple values
- **`logic-or`** - Boolean OR operation on multiple values
- **`logic-not`** - Boolean NOT operation on a single value
- **`logic-xor`** - Boolean XOR operation on two values

**Mathematical Operations**:
- **`math-add`** - Addition of multiple numbers
- **`math-subtract`** - Subtraction with multiple operands
- **`math-multiply`** - Multiplication of multiple numbers
- **`math-divide`** - Division of two numbers (with zero-division protection)
- **`math-power`** - Exponentiation (base^exponent)
- **`math-modulo`** - Modulo operation (remainder after division)

**String Manipulation**:
- **`string-concat`** - Concatenate multiple strings with optional separator
- **`string-substring`** - Extract substring using start/end positions
- **`string-replace`** - Replace text with regex support and global options
- **`string-match`** - Match text against regex patterns
- **`string-split`** - Split string into array using delimiter
- **`string-compare`** - Compare strings with case-sensitivity options
- **`string-length`** - Get string length
- **`string-case`** - Transform case (upper, lower, title, sentence)

**Flow Control**:
- **`condition`** - Conditional execution with multiple condition types
- **`merge-all`** - Wait for all dependencies to succeed before proceeding
- **`merge-any`** - Proceed when any dependency succeeds
- **`merge-majority`** - Proceed when majority of dependencies succeed
- **`merge-count`** - Proceed when specific number of dependencies succeed

**Console Operations**:
- **`console-log`** - Output messages to console.log
- **`console-error`** - Output error messages to console.error
- **`console-warn`** - Output warning messages to console.warn
- **`console-info`** - Output informational messages to console.info
- **`console-debug`** - Output debug messages to console.debug
- **`console-table`** - Display tabular data in the console
- **`console-time`** - Start a timer for performance measurement
- **`console-timeend`** - End a timer and display elapsed time
- **`console-group`** - Create a collapsible group in the console
- **`console-groupend`** - End a console group
- **`console-clear`** - Clear the console
- **`console-trace`** - Output a stack trace
- **`console-count`** - Count the number of times this node is executed
- **`console-countreset`** - Reset a counter

**Data Primitive Operations**:
- **`number-parse`** - Convert values to numbers with fallback support
- **`number-format`** - Format numbers using locale and options
- **`number-validate`** - Validate numbers with range and constraint checks
- **`number-range`** - Generate number ranges with step support
- **`number-round`** - Round numbers using various methods and precision
- **`number-clamp`** - Clamp numbers to specified min/max ranges
- **`string-parse`** - Convert values to strings with encoding support
- **`string-validate`** - Validate strings with length and pattern checks
- **`string-encode`** - Encode strings using various encoding methods
- **`string-decode`** - Decode strings using various encoding methods
- **`string-format`** - Format strings using template substitution
- **`string-sanitize`** - Sanitize strings by removing HTML, scripts, and normalizing whitespace
- **`array-create`** - Create arrays with specified length, fill values, or initial values
- **`array-filter`** - Filter arrays based on various conditions
- **`array-map`** - Transform array elements using various operations
- **`array-reduce`** - Reduce arrays using various aggregation operations
- **`array-sort`** - Sort arrays with direction and key-based sorting
- **`array-flatten`** - Flatten nested arrays to specified depth
- **`array-unique`** - Remove duplicate values from arrays
- **`array-chunk`** - Split arrays into chunks of specified size
- **`array-slice`** - Extract portions of arrays using start/end indices
- **`array-join`** - Join array elements into strings with separators
- **`object-create`** - Create objects from properties or entries
- **`object-get`** - Get object properties using dot notation paths
- **`object-set`** - Set object properties using dot notation paths
- **`object-merge`** - Merge multiple objects with shallow or deep merging
- **`object-clone`** - Clone objects with shallow or deep copying
- **`object-keys`** - Get array of object keys
- **`object-values`** - Get array of object values
- **`object-entries`** - Get array of object key-value pairs
- **`object-pick`** - Create new object with selected properties
- **`object-omit`** - Create new object without specified properties
- **`object-freeze`** - Freeze objects to prevent modification
- **`boolean-parse`** - Convert values to booleans with fallback support
- **`boolean-validate`** - Validate boolean values and conversions
- **`json-parse`** - Parse JSON strings with fallback support
- **`json-stringify`** - Convert values to JSON strings with formatting
- **`json-validate`** - Validate JSON strings for syntax correctness
- **`json-schema-validate`** - Validate JSON against schemas
- **`type-check`** - Determine the type of values
- **`type-convert`** - Convert values between different types
- **`type-validate`** - Validate values against expected types
- **`data-is-null`** - Check if values are null
- **`data-is-undefined`** - Check if values are undefined
- **`data-is-empty`** - Check if values are empty (null, undefined, empty string, empty array, empty object)
- **`data-is-valid`** - Validate data based on various criteria
- **`data-default`** - Provide default values when data is invalid or missing

#### **Node Configuration**
Each node type is created with appropriate default inputs and outputs:
- **Inputs**: Pre-configured based on the node type requirements
- **Outputs**: Properly typed for downstream connections
- **Configuration**: Expandable configuration panels for complex nodes
- **Visual Feedback**: Clear icons and labels for each node type

#### **Connection System**
When nodes are connected, they automatically reflect the flows library execution model:
- **Dependencies**: Connections create proper workflow dependencies
- **Data Flow**: Input/output handles match the flows library data flow
- **Validation**: Real-time validation of connections and data types
- **Execution Order**: Visual representation of execution order

### 🏗️ Architecture

```
flows-editor/
├── src/
│   ├── components/
│   │   ├── Editor.tsx          # Main editor component with drag & drop
│   │   ├── nodes/
│   │   │   └── BaseNode.tsx    # Base node component with type-specific rendering
│   │   └── sidebar/
│   │       └── Sidebar.tsx     # Node palette sidebar with draggable items
│   ├── store/
│   │   └── index.ts            # Zustand store with immer
│   ├── types/
│   │   └── index.ts            # TypeScript types with all node definitions
│   ├── utils/
│   │   ├── workflow-converter.ts # Conversion utilities with node creation
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
- Elastically centers the selected tab at the most optimal position within the visible area
- Precise positioning with scroll boundary detection to prevent over-scrolling
- Smooth scrolling animation with elastic threshold (2px sensitivity)
- Responsive re-centering when window is resized
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