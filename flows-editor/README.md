# Flows Editor

A professional, React Flow-based visual editor for the Flows workflow library. Built with FluentUI for a clean, modern interface and designed for both development and production use.

## 🎯 What We Built

This is a comprehensive React Flow-based editor for the Flows library with the following features:

### ✅ Completed Features

- **Professional UI**: Clean, modern interface built with FluentUI
- **Configurable Architecture**: Extensive configuration options for customisation
- **Plugin System**: Extensible plugin architecture for custom node types
- **Drag & Drop**: ✅ **FULLY FUNCTIONAL** - Intuitive drag-and-drop workflow creation with all handlers
- **Node Manipulation Panel**: ✅ **NEW!** - Dedicated panel for detailed node configuration and input management
- **Enhanced Input System**: ✅ **NEW!** - Support for both static and dynamic input data
- **Real-time Validation**: Live workflow validation and error detection
- **Visual Feedback**: Rich visual indicators and status updates
- **Production Ready**: Built for enterprise use with comprehensive error handling
- **Complete Flows Integration**: Full integration with all flows library handlers and plugins
- **Intelligent Tab Navigation**: Auto-centering tabs with keyboard and touch support

### 🎯 Node Manipulation Panel

The editor now features a **comprehensive node manipulation panel** that provides:

#### **Key Features**
- **Node Information**: Display node ID, type, and description
- **Input Configuration**: Detailed configuration of all node inputs with type-specific controls
- **Static vs Dynamic Inputs**: Toggle between manual input and edge-connected input for each field
- **Output Information**: Clear display of node outputs and their types
- **Advanced Configuration**: Access to all configurable node properties
- **Save & Delete**: Node management actions

#### **Input Handling System**
Each input field supports two modes:

**Static Mode**: 
- ✅ Manual data entry with type-specific controls
- ✅ String inputs (text fields, textareas for long content)
- ✅ Number inputs with validation
- ✅ Boolean inputs with toggle switches
- ✅ Array inputs with JSON editor
- ✅ Object inputs with JSON editor
- ✅ Select dropdowns for enumerated values

**Dynamic Mode**:
- ✅ Edge-connected inputs from other nodes
- ✅ Visual indication when expecting connections
- ✅ Seamless switching between modes

#### **Type-Specific Controls**
- **Strings**: Text inputs, textareas for long content, dropdowns for enums
- **Numbers**: Number inputs with validation
- **Booleans**: Toggle switches with labels
- **Arrays**: JSON editors with syntax validation
- **Objects**: JSON editors with formatting
- **Enums**: Dropdown selectors with predefined options

### 🎯 Complete Handler Coverage

The editor supports **ALL** node types from the flows library:

#### **Core Nodes (Always Available)**
- **`data`** - Pass-through data nodes with configurable inputs
- **`delay`** - Wait nodes with duration configuration
- **`subflow`** - Execute other workflows with workflow ID input

#### **Logical Operations**
- **`logic-and`** - Boolean AND operation on multiple values
- **`logic-or`** - Boolean OR operation on multiple values
- **`logic-not`** - Boolean NOT operation on a single value
- **`logic-xor`** - Boolean XOR operation on two values

#### **Mathematical Operations**
- **`math-add`** - Addition of multiple numbers
- **`math-subtract`** - Subtraction with multiple operands
- **`math-multiply`** - Multiplication of multiple numbers
- **`math-divide`** - Division of two numbers (with zero-division protection)
- **`math-power`** - Exponentiation (base^exponent)
- **`math-modulo`** - Modulo operation (remainder after division)

#### **String Manipulation**
- **`string-concat`** - Concatenate multiple strings with optional separator
- **`string-substring`** - Extract substring using start/end positions
- **`string-replace`** - Replace text with regex support and global options
- **`string-match`** - Match text against regex patterns
- **`string-split`** - Split string into array using delimiter
- **`string-compare`** - Compare strings with case-sensitivity options
- **`string-length`** - Get string length
- **`string-case`** - Transform case (upper, lower, title, sentence)

#### **Flow Control**
- **`condition`** - Conditional execution with multiple condition types
- **`merge-all`** - Wait for all dependencies to succeed before proceeding
- **`merge-any`** - Proceed when any dependency succeeds
- **`merge-majority`** - Proceed when majority of dependencies succeed
- **`merge-count`** - Proceed when specific number of dependencies succeed

#### **Console Operations**
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

#### **Data Primitive Operations**
- **Number Operations**: Parse, format, validate, range, round, clamp
- **String Operations**: Parse, validate, encode, decode, format, sanitize  
- **Array Operations**: Create, filter, map, reduce, sort, flatten, unique, chunk, slice, join
- **Object Operations**: Create, get, set, merge, clone, keys, values, entries, pick, omit, freeze
- **Boolean Operations**: Parse, validate
- **JSON Operations**: Parse, stringify, validate, schema validation
- **Type Checking**: Check, convert, validate types
- **Data Validation**: Check null/undefined/empty, validate data, provide defaults

### 🏗️ Architecture

```
flows-editor/
├── src/
│   ├── components/
│   │   ├── Editor.tsx                      # Main editor with panel integration
│   │   ├── NodeManipulationPanel.tsx      # ✨ NEW! Node configuration panel
│   │   ├── nodes/
│   │   │   └── BaseNode.tsx               # Enhanced base node component
│   │   └── sidebar/
│   │       └── Sidebar.tsx                # Node palette sidebar with draggable items
│   ├── store/
│   │   └── index.ts                       # Enhanced Zustand store with panel state
│   ├── types/
│   │   └── index.ts                       # Complete type definitions for all handlers
│   ├── utils/
│   │   ├── workflow-converter.ts          # Enhanced conversion utilities  
│   │   ├── plugin-registry.ts             # Complete plugin system
│   │   └── flows-integration.ts           # Full flows library integration
│   ├── demo/
│   │   ├── App.tsx                        # Full demo application
│   │   ├── SimpleDemo.tsx                 # Simple demo
│   │   ├── ComprehensiveExample.tsx       # Complete example with all handlers
│   │   └── main.tsx                       # Demo entry point
│   └── index.ts                           # Main exports
├── package.json                            # Dependencies and scripts
├── vite.config.ts                         # Build configuration
└── README.md                              # This file
```

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
  enabledCategories: ['core', 'logic', 'math', 'string', 'flow', 'console', 'number', 'array', 'object', 'boolean', 'json', 'type-checking', 'data-validation'],
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

## 🎯 Using the Node Manipulation Panel

### Opening the Panel

Click the **"Node Settings"** button in the toolbar to open the manipulation panel. Select any node to configure its properties.

### Configuring Node Inputs

1. **Select a Node**: Click on any node in the canvas
2. **Open Input Configuration**: The panel automatically shows input configuration
3. **Choose Input Mode**: 
   - **Static**: Enter values manually using type-appropriate controls
   - **Dynamic**: Connect edges from other nodes
4. **Configure Values**: Use the provided controls based on input type:
   - Text inputs for strings
   - Number inputs for numeric values  
   - Toggle switches for booleans
   - JSON editors for arrays and objects
   - Dropdowns for enumerated values

### Example: Configuring a Math Node

```tsx
// 1. Drag a "math-add" node from the sidebar
// 2. Select the node and open the manipulation panel
// 3. In "Input Configuration", set the mode for "values":
//    - Static: Enter JSON array like [10, 20, 30]
//    - Dynamic: Connect edges from other nodes
// 4. Save the configuration
```

### Advanced Configuration

Access advanced node-specific settings in the "Advanced Configuration" section:
- Conditional logic parameters
- String manipulation options  
- Array and object operation settings
- Validation rules and constraints

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

### Testing the Features

1. **Drag & Drop**: Drag nodes from sidebar to canvas
2. **Node Configuration**: Select nodes and use the settings panel
3. **Input Modes**: Switch between static and dynamic input modes
4. **Workflow Execution**: Use the Execute button to run workflows
5. **Real-time Updates**: See immediate feedback as you build workflows

## 🎨 Customisation

### Editor Configuration

```tsx
const config: EditorConfig = {
  ui: {
    sidebarWidth: 350,           // Wider sidebar for more node types
    minimapEnabled: true,        // Show workflow minimap
    backgroundColor: '#f8f9fa',   // Custom background colour
  },
  features: {
    dragAndDrop: true,          // Enable drag & drop
    validation: true,           // Real-time validation  
    minimap: true,              // Show minimap
    subflows: true,             // Enable subworkflows
  },
  enabledCategories: [          // Choose which node types to show
    'core', 'logic', 'math', 'string', 'flow', 
    'console', 'number', 'array', 'object'
  ],
}
```

### Custom Node Types

Extend the editor with your own node types by creating plugins:

```tsx
const customPlugin: PluginManifest = {
  id: 'my-custom-nodes',
  name: 'My Custom Operations',
  version: '1.0.0',
  description: 'Custom business logic nodes',
  author: 'Your Name',
  categories: [
    {
      id: 'business',
      name: 'Business Logic',
      description: 'Business-specific operations',
      icon: 'Building',
      color: '#8b5cf6',
      order: 15,
    }
  ],
  nodeTypes: [
    {
      id: 'validate-customer',
      name: 'Validate Customer',
      description: 'Validate customer data against business rules',
      category: 'business',
      icon: 'PersonCheck',
      color: '#8b5cf6',
      inputs: [
        { id: 'customerData', name: 'Customer Data', type: 'object', required: true }
      ],
      outputs: [
        { id: 'isValid', name: 'Is Valid', type: 'boolean' },
        { id: 'errors', name: 'Validation Errors', type: 'array' }
      ],
      configurable: true,
    }
  ],
}

// Use in editor
const config = {
  plugins: [customPlugin],
  enabledCategories: ['core', 'business'],
}
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

### Node Manipulation Panel

The panel automatically handles:
- ✅ **Type Detection**: Automatic input control selection based on data types
- ✅ **Validation**: Real-time validation of input values
- ✅ **State Persistence**: Input configurations are saved with the workflow
- ✅ **Error Handling**: Clear error messages for invalid inputs
- ✅ **Accessibility**: Full keyboard navigation and screen reader support

## 🎯 Key Benefits

### For Developers
- **Complete Coverage**: Every flows library handler has a UI counterpart
- **Type Safety**: Full TypeScript support with proper type definitions
- **Extensible**: Easy to add custom node types and categories
- **Professional UI**: FluentUI provides consistent, accessible interface
- **Production Ready**: Built for enterprise applications

### For Users  
- **Intuitive**: Drag and drop workflow creation
- **Flexible**: Choose static values or dynamic connections for each input
- **Visual**: Clear indication of node types, connections, and data flow
- **Powerful**: Access to all flows library capabilities through the UI
- **Reliable**: Real-time validation and error detection

## 🚀 What's New in This Version

### ✨ Major Features Added
1. **Node Manipulation Panel**: Comprehensive node configuration interface
2. **Enhanced Input System**: Static vs dynamic input mode selection  
3. **Type-Specific Controls**: Appropriate UI controls for each data type
4. **Complete Handler Coverage**: UI support for all 80+ flows library handlers
5. **State Management**: Integrated panel state with global store
6. **Improved UX**: Better visual feedback and interaction patterns

### 🔧 Technical Improvements
- Enhanced store with panel state management
- Improved type definitions with complete coverage
- Better error handling and validation
- Optimized performance with proper state selectors
- Clean architecture with separation of concerns

---

**🎯 Ready to build powerful workflows visually? The Flows Editor now provides complete coverage of all flows library capabilities with an intuitive, professional interface!**