import React, { useMemo } from 'react'
import { Handle, Position, NodeProps } from 'reactflow'
import {
  Button,
  Text,
  Badge,
  makeStyles,
  tokens,
  mergeClasses,
} from '@fluentui/react-components'
import {
  // Core icons
  DatabaseRegular,
  ClockRegular,
  FlowRegular,
  // Logic icons
  BranchRegular,
  // Math icons
  CalculatorRegular,
  // String icons
  TextTRegular,
  // Flow control icons
  ArrowRoutingRegular,
  MergeRegular,
  // Console icons
  WindowConsoleRegular,
  ErrorCircleRegular,
  WarningRegular,
  InfoRegular,
  BugRegular,
  // Data primitive icons
  NumberSymbolRegular,
  ListRegular,
  CubeRegular,
  ToggleLeftRegular,
  CodeRegular,
  CheckmarkCircleRegular,
  ShieldRegular,
  // Settings icon
  SettingsRegular,
} from '@fluentui/react-icons'
import type { NodeData } from '../../types'

const useStyles = makeStyles({
  root: {
    minWidth: '180px',
    maxWidth: '240px',
    borderRadius: tokens.borderRadiusMedium,
    backgroundColor: tokens.colorNeutralBackground1,
    boxShadow: tokens.shadow4,
    transition: 'all 0.2s ease-in-out',
    position: 'relative',
    overflow: 'visible',
    cursor: 'pointer',
    '&:hover': {
      boxShadow: tokens.shadow8,
      transform: 'translateY(-2px)',
    },
  },
  selected: {
    boxShadow: tokens.shadow16,
    transform: 'translateY(-2px)',
  },
  // Category-specific styles
  coreNode: {
    border: `2px solid ${tokens.colorBrandStroke1}`,
  },
  logicNode: {
    border: `2px solid ${tokens.colorPaletteGreenBorder2}`,
  },
  mathNode: {
    border: `2px solid ${tokens.colorPaletteRedBorder2}`,
  },
  stringNode: {
    border: `2px solid ${tokens.colorPaletteDarkOrangeBorder2}`,
  },
  flowNode: {
    border: `2px solid ${tokens.colorNeutralStroke1}`,
  },
  consoleNode: {
    border: `2px solid ${tokens.colorNeutralStroke1}`,
  },
  numberNode: {
    border: `2px solid ${tokens.colorNeutralStroke1}`,
  },
  arrayNode: {
    border: `2px solid ${tokens.colorPaletteBerryBorder2}`,
  },
  objectNode: {
    border: `2px solid ${tokens.colorPaletteMarigoldBorder2}`,
  },
  booleanNode: {
    border: `2px solid ${tokens.colorNeutralStroke1}`,
  },
  jsonNode: {
    border: `2px solid ${tokens.colorNeutralStroke1}`,
  },
  typeCheckingNode: {
    border: `2px solid ${tokens.colorNeutralStroke1}`,
  },
  dataValidationNode: {
    border: `2px solid ${tokens.colorNeutralStroke1}`,
  },
  header: {
    padding: '12px 16px',
    borderTopLeftRadius: tokens.borderRadiusMedium,
    borderTopRightRadius: tokens.borderRadiusMedium,
    borderBottom: `1px solid ${tokens.colorNeutralStroke2}`,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    position: 'relative',
  },
  // Category-specific header backgrounds
  coreHeader: {
    backgroundColor: tokens.colorBrandBackground2,
  },
  logicHeader: {
    backgroundColor: tokens.colorPaletteGreenBackground2,
  },
  mathHeader: {
    backgroundColor: tokens.colorPaletteRedBackground2,
  },
  stringHeader: {
    backgroundColor: tokens.colorPaletteDarkOrangeBackground2,
  },
  flowHeader: {
    backgroundColor: tokens.colorNeutralBackground3,
  },
  consoleHeader: {
    backgroundColor: tokens.colorNeutralBackground3,
  },
  numberHeader: {
    backgroundColor: tokens.colorNeutralBackground3,
  },
  arrayHeader: {
    backgroundColor: tokens.colorPaletteBerryBackground2,
  },
  objectHeader: {
    backgroundColor: tokens.colorPaletteMarigoldBackground2,
  },
  booleanHeader: {
    backgroundColor: tokens.colorNeutralBackground3,
  },
  jsonHeader: {
    backgroundColor: tokens.colorNeutralBackground3,
  },
  typeCheckingHeader: {
    backgroundColor: tokens.colorNeutralBackground3,
  },
  dataValidationHeader: {
    backgroundColor: tokens.colorNeutralBackground3,
  },
  icon: {
    fontSize: '16px',
    color: tokens.colorNeutralForeground1,
  },
  title: {
    fontSize: tokens.fontSizeBase300,
    fontWeight: tokens.fontWeightSemibold,
    color: tokens.colorNeutralForeground1,
    lineHeight: '1.2',
    textAlign: 'center',
  },
  categoryBadge: {
    position: 'absolute',
    top: '4px',
    right: '4px',
    fontSize: '10px',
  },
  content: {
    padding: '12px 16px',
    minHeight: '60px',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    gap: '8px',
  },
  description: {
    fontSize: tokens.fontSizeBase200,
    color: tokens.colorNeutralForeground2,
    textAlign: 'center',
    lineHeight: '1.3',
  },
  ioSection: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    marginTop: '8px',
  },
  ioCount: {
    fontSize: tokens.fontSizeBase100,
    color: tokens.colorNeutralForeground3,
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
  },
  handle: {
    width: '12px',
    height: '12px',
    borderRadius: '50%',
    border: `2px solid ${tokens.colorNeutralBackground1}`,
    transition: 'all 0.2s ease',
    '&:hover': {
      transform: 'scale(1.2)',
    },
    '&.react-flow__handle-connecting': {
      transform: 'scale(1.3)',
    },
    '&.react-flow__handle-valid': {
      boxShadow: `0 0 0 2px ${tokens.colorPaletteGreenBackground2}`,
    },
  },
  inputHandle: {
    left: '-6px',
    backgroundColor: tokens.colorPaletteBlueForeground2,
  },
  outputHandle: {
    right: '-6px',
    backgroundColor: tokens.colorBrandForeground1,
  },
  configButton: {
    position: 'absolute',
    top: '4px',
    left: '4px',
    minHeight: '20px',
    minWidth: '20px',
    padding: '2px',
  },
})

export interface BaseNodeProps extends NodeProps<NodeData> {
  configurable?: boolean
  onConfigChange?: (nodeId: string, config: Record<string, any>) => void
}

export const BaseNode: React.FC<BaseNodeProps> = ({
  data,
  selected,
  configurable = false,
}) => {
  const styles = useStyles()

  // Get node category for styling
  const nodeCategory = data.category || determineCategory(data.type)

  // Get category-specific styles
  const getCategoryStyles = (category: string) => {
    switch (category) {
      case 'core': return { node: styles.coreNode, header: styles.coreHeader }
      case 'logic': return { node: styles.logicNode, header: styles.logicHeader }
      case 'math': return { node: styles.mathNode, header: styles.mathHeader }
      case 'string': return { node: styles.stringNode, header: styles.stringHeader }
      case 'flow': return { node: styles.flowNode, header: styles.flowHeader }
      case 'console': return { node: styles.consoleNode, header: styles.consoleHeader }
      case 'number': return { node: styles.numberNode, header: styles.numberHeader }
      case 'array': return { node: styles.arrayNode, header: styles.arrayHeader }
      case 'object': return { node: styles.objectNode, header: styles.objectHeader }
      case 'boolean': return { node: styles.booleanNode, header: styles.booleanHeader }
      case 'json': return { node: styles.jsonNode, header: styles.jsonHeader }
      case 'type-checking': return { node: styles.typeCheckingNode, header: styles.typeCheckingHeader }
      case 'data-validation': return { node: styles.dataValidationNode, header: styles.dataValidationHeader }
      default: return { node: styles.coreNode, header: styles.coreHeader }
    }
  }

  const categoryStyles = getCategoryStyles(nodeCategory)

  // Get node icon based on type
  const getNodeIcon = (nodeType: string) => {
    // Core nodes
    if (nodeType === 'data') return <DatabaseRegular className={styles.icon} />
    if (nodeType === 'delay') return <ClockRegular className={styles.icon} />
    if (nodeType === 'subflow') return <FlowRegular className={styles.icon} />
    
    // Logic nodes
    if (nodeType.startsWith('logic-')) return <BranchRegular className={styles.icon} />
    
    // Math nodes
    if (nodeType.startsWith('math-')) return <CalculatorRegular className={styles.icon} />
    
    // String nodes
    if (nodeType.startsWith('string-')) return <TextTRegular className={styles.icon} />
    
    // Flow control nodes
    if (nodeType === 'condition') return <ArrowRoutingRegular className={styles.icon} />
    if (nodeType.startsWith('merge-')) return <MergeRegular className={styles.icon} />
    
    // Console nodes
    if (nodeType === 'console-log') return <WindowConsoleRegular className={styles.icon} />
    if (nodeType === 'console-error') return <ErrorCircleRegular className={styles.icon} />
    if (nodeType === 'console-warn') return <WarningRegular className={styles.icon} />
    if (nodeType === 'console-info') return <InfoRegular className={styles.icon} />
    if (nodeType === 'console-debug') return <BugRegular className={styles.icon} />
    if (nodeType.startsWith('console-')) return <WindowConsoleRegular className={styles.icon} />
    
    // Data primitive nodes
    if (nodeType.startsWith('number-')) return <NumberSymbolRegular className={styles.icon} />
    if (nodeType.startsWith('array-')) return <ListRegular className={styles.icon} />
    if (nodeType.startsWith('object-')) return <CubeRegular className={styles.icon} />
    if (nodeType.startsWith('boolean-')) return <ToggleLeftRegular className={styles.icon} />
    if (nodeType.startsWith('json-')) return <CodeRegular className={styles.icon} />
    if (nodeType.startsWith('type-')) return <CheckmarkCircleRegular className={styles.icon} />
    if (nodeType.startsWith('data-')) return <ShieldRegular className={styles.icon} />
    
    // Default icon
    return <DatabaseRegular className={styles.icon} />
  }

  // Get friendly node name
  const getNodeDisplayName = (type: string) => {
    const names: Record<string, string> = {
      // Core
      'data': 'Data',
      'delay': 'Delay',
      'subflow': 'Subflow',
      // Logic
      'logic-and': 'AND',
      'logic-or': 'OR', 
      'logic-not': 'NOT',
      'logic-xor': 'XOR',
      // Math
      'math-add': 'Add',
      'math-subtract': 'Subtract',
      'math-multiply': 'Multiply',
      'math-divide': 'Divide',
      'math-power': 'Power',
      'math-modulo': 'Modulo',
      // String
      'string-concat': 'Join Text',
      'string-substring': 'Substring',
      'string-replace': 'Replace',
      'string-match': 'Match',
      'string-split': 'Split',
      'string-compare': 'Compare',
      'string-length': 'Length',
      'string-case': 'Change Case',
      // Flow
      'condition': 'Condition',
      'merge-all': 'Merge All',
      'merge-any': 'Merge Any',
      'merge-majority': 'Merge Majority',
      'merge-count': 'Merge Count',
      // Console
      'console-log': 'Log',
      'console-error': 'Error',
      'console-warn': 'Warning',
      'console-info': 'Info',
      'console-debug': 'Debug',
      'console-table': 'Table',
      'console-time': 'Timer Start',
      'console-timeend': 'Timer End',
      'console-group': 'Group Start',
      'console-groupend': 'Group End',
      'console-clear': 'Clear',
      'console-trace': 'Trace',
      'console-count': 'Count',
      'console-countreset': 'Reset Count',
      // Number operations
      'number-parse': 'Parse Number',
      'number-format': 'Format Number',
      'number-validate': 'Validate Number',
      'number-range': 'Number Range',
      'number-round': 'Round',
      'number-clamp': 'Clamp',
      // String operations
      'string-parse': 'Parse String',
      'string-validate': 'Validate String',
      'string-encode': 'Encode',
      'string-decode': 'Decode',
      'string-format': 'Format',
      'string-sanitize': 'Sanitize',
      // Array operations
      'array-create': 'Create Array',
      'array-filter': 'Filter',
      'array-map': 'Map',
      'array-reduce': 'Reduce',
      'array-sort': 'Sort',
      'array-flatten': 'Flatten',
      'array-unique': 'Unique',
      'array-chunk': 'Chunk',
      'array-slice': 'Slice',
      'array-join': 'Join',
      // Object operations
      'object-create': 'Create Object',
      'object-get': 'Get Property',
      'object-set': 'Set Property',
      'object-merge': 'Merge',
      'object-clone': 'Clone',
      'object-keys': 'Get Keys',
      'object-values': 'Get Values',
      'object-entries': 'Get Entries',
      'object-pick': 'Pick Properties',
      'object-omit': 'Omit Properties',
      'object-freeze': 'Freeze',
      // Boolean operations
      'boolean-parse': 'Parse Boolean',
      'boolean-validate': 'Validate Boolean',
      // JSON operations
      'json-parse': 'Parse JSON',
      'json-stringify': 'Stringify JSON',
      'json-validate': 'Validate JSON',
      'json-schema-validate': 'Schema Validate',
      // Type checking
      'type-check': 'Check Type',
      'type-convert': 'Convert Type',
      'type-validate': 'Validate Type',
      // Data validation
      'data-is-null': 'Is Null',
      'data-is-undefined': 'Is Undefined',
      'data-is-empty': 'Is Empty',
      'data-is-valid': 'Is Valid',
      'data-default': 'Default Value',
    }
    return names[type] || type
  }

  // Get node description
  const getNodeDescription = (type: string) => {
    const descriptions: Record<string, string> = {
      'data': 'Pass data through',
      'delay': 'Wait for duration',
      'subflow': 'Execute workflow',
      'logic-and': 'All inputs true',
      'logic-or': 'Any input true',
      'logic-not': 'Invert boolean',
      'logic-xor': 'Exclusive or',
      'math-add': 'Add numbers',
      'math-subtract': 'Subtract numbers',
      'math-multiply': 'Multiply numbers',
      'math-divide': 'Divide numbers',
      'math-power': 'Raise to power',
      'math-modulo': 'Remainder division',
      'string-concat': 'Join strings',
      'string-substring': 'Extract text portion',
      'string-replace': 'Replace text',
      'string-match': 'Match pattern',
      'string-split': 'Split into array',
      'string-compare': 'Compare strings',
      'string-length': 'Get text length',
      'string-case': 'Change text case',
      'condition': 'Conditional logic',
      'merge-all': 'Wait for all inputs',
      'merge-any': 'Wait for any input',
      'merge-majority': 'Wait for majority',
      'merge-count': 'Wait for count',
      'console-log': 'Log message',
      'console-error': 'Log error',
      'console-warn': 'Log warning',
      'console-info': 'Log information',
      'console-debug': 'Debug output',
    }
    return descriptions[type] || 'Process data'
  }

  // Get category badge color
  const getCategoryBadgeColor = (category: string) => {
    switch (category) {
      case 'core': return 'brand'
      case 'logic': return 'success'
      case 'math': return 'danger'
      case 'string': return 'warning'
      case 'flow': return 'severe'
      case 'console': return 'informative'
      default: return 'subtle'
    }
  }

  // Helper function to determine category from node type
  function determineCategory(nodeType: string): string {
    if (nodeType.startsWith('logic-')) return 'logic'
    if (nodeType.startsWith('math-')) return 'math'
    if (nodeType.startsWith('string-')) return 'string'
    if (nodeType.startsWith('console-')) return 'console'
    if (nodeType.startsWith('number-')) return 'number'
    if (nodeType.startsWith('array-')) return 'array'
    if (nodeType.startsWith('object-')) return 'object'
    if (nodeType.startsWith('boolean-')) return 'boolean'
    if (nodeType.startsWith('json-')) return 'json'
    if (nodeType.startsWith('type-')) return 'type-checking'
    if (nodeType.startsWith('data-')) return 'data-validation'
    if (nodeType === 'condition') return 'flow'
    if (nodeType.startsWith('merge-')) return 'flow'
    return 'core'
  }

  // Calculate input/output counts
  const inputCount = data.inputs ? Object.keys(data.inputs).length : 0
  const outputCount = data.outputs ? Object.keys(data.outputs).length : 0

  const inputHandles = useMemo(() => {
    if (!data.inputs) return []
    return Object.entries(data.inputs).map(([inputId], index) => ({
      id: inputId,
      type: 'target',
      position: Position.Left,
      style: { top: `${50 + index * 20}px` },
    }))
  }, [data.inputs])

  const outputHandles = useMemo(() => {
    if (!data.outputs) return []
    return Object.entries(data.outputs).map(([outputId], index) => ({
      id: outputId,
      type: 'source',
      position: Position.Right,
      style: { top: `${50 + index * 20}px` },
    }))
  }, [data.outputs])

  return (
    <div 
      className={mergeClasses(
        styles.root,
        categoryStyles.node,
        selected ? styles.selected : ''
      )}
    >
      {/* Input Handles */}
      {inputHandles.map((handle, index) => (
        <Handle
          key={`input-${handle.id}-${index}`}
          type="target"
          position={Position.Left}
          id={handle.id}
          className={mergeClasses(styles.handle, styles.inputHandle)}
          style={handle.style}
        />
      ))}

      {/* Output Handles */}
      {outputHandles.map((handle, index) => (
        <Handle
          key={`output-${handle.id}-${index}`}
          type="source"
          position={Position.Right}
          id={handle.id}
          className={mergeClasses(styles.handle, styles.outputHandle)}
          style={handle.style}
        />
      ))}

      {/* Configuration Button */}
      {configurable && (
        <Button
          appearance="subtle"
          size="small"
          className={styles.configButton}
          icon={<SettingsRegular />}
          onClick={(e) => {
            e.stopPropagation()
            // Handle configuration
          }}
        />
      )}

      {/* Category Badge */}
      <Badge 
        appearance="filled" 
        color={getCategoryBadgeColor(nodeCategory)}
        size="small"
        className={styles.categoryBadge}
      >
        {nodeCategory}
      </Badge>

      {/* Node Header */}
      <div className={mergeClasses(styles.header, categoryStyles.header)}>
        {getNodeIcon(data.type)}
        <Text className={styles.title}>{getNodeDisplayName(data.type)}</Text>
      </div>

      {/* Node Content */}
      <div className={styles.content}>
        <Text className={styles.description}>
          {getNodeDescription(data.type)}
        </Text>
        
        {/* I/O Section */}
        <div className={styles.ioSection}>
          <div className={styles.ioCount}>
            ← {inputCount}
          </div>
          <div className={styles.ioCount}>
            {outputCount} →
          </div>
        </div>
      </div>
    </div>
  )
} 