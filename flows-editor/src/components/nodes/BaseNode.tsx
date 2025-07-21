import React from 'react'
import { Handle, Position, NodeProps } from 'reactflow'
import {
  Title3,
  Caption1,
  Button,
  Input,
  Label,
  Checkbox,
  Select,
  makeStyles,
  tokens,
  Textarea,
} from '@fluentui/react-components'
import {
  CircleRegular,
  BranchRegular,
  CalculatorRegular,
  TextTRegular,
  FlowRegular,
  CodeRegular,
  ChevronDownRegular,
  ChevronUpRegular,
  DatabaseRegular,
  ClockRegular,
  DocumentRegular,
  SettingsRegular,
} from '@fluentui/react-icons'
import type { NodeData } from '../../types'

const useStyles = makeStyles({
  root: {
    minWidth: '180px',
    maxWidth: '280px',
    border: `2px solid ${tokens.colorNeutralStroke1}`,
    borderRadius: tokens.borderRadiusMedium,
    backgroundColor: tokens.colorNeutralBackground1,
    boxShadow: tokens.shadow4,
    transition: 'all 0.2s ease',
    position: 'relative',
    '&:hover': {
      boxShadow: tokens.shadow8,
      transform: 'translateY(-1px)',
    },
  },
  selected: {
    border: `2px solid ${tokens.colorBrandStroke1}`,
    boxShadow: tokens.shadow8,
  },
  header: {
    padding: '12px 16px',
    borderBottom: `1px solid ${tokens.colorNeutralStroke2}`,
    backgroundColor: tokens.colorNeutralBackground2,
    borderTopLeftRadius: tokens.borderRadiusMedium,
    borderTopRightRadius: tokens.borderRadiusMedium,
  },
  content: {
    padding: '16px',
  },
  icon: {
    width: '20px',
    height: '20px',
    marginRight: '12px',
    color: tokens.colorBrandForeground1,
  },
  title: {
    margin: 0,
    fontSize: tokens.fontSizeBase400,
    fontWeight: tokens.fontWeightSemibold,
    color: tokens.colorNeutralForeground1,
    lineHeight: '1.2',
  },
  description: {
    fontSize: tokens.fontSizeBase200,
    color: tokens.colorNeutralForeground3,
    marginTop: '4px',
    lineHeight: '1.3',
  },
  configSection: {
    marginTop: '12px',
    paddingTop: '12px',
    borderTop: `1px solid ${tokens.colorNeutralStroke2}`,
  },
  configItem: {
    marginBottom: '12px',
  },
  configLabel: {
    fontSize: tokens.fontSizeBase200,
    fontWeight: tokens.fontWeightMedium,
    color: tokens.colorNeutralForeground2,
    marginBottom: '6px',
    display: 'block',
  },
  configInput: {
    width: '100%',
  },
  expandButton: {
    minHeight: 'auto',
    padding: '6px 12px',
    fontSize: tokens.fontSizeBase200,
    width: '100%',
    justifyContent: 'space-between',
  },
  handle: {
    width: '12px',
    height: '12px',
    backgroundColor: tokens.colorBrandBackground,
    border: `2px solid ${tokens.colorNeutralBackground1}`,
    borderRadius: '50%',
    transition: 'all 0.2s ease',
    '&:hover': {
      backgroundColor: tokens.colorBrandBackgroundHover,
      transform: 'scale(1.2)',
    },
  },
  inputHandle: {
    left: '-6px',
  },
  outputHandle: {
    right: '-6px',
  },
  handleLabel: {
    position: 'absolute',
    fontSize: tokens.fontSizeBase100,
    color: tokens.colorNeutralForeground3,
    backgroundColor: tokens.colorNeutralBackground1,
    padding: '2px 6px',
    borderRadius: tokens.borderRadiusSmall,
    whiteSpace: 'nowrap',
    pointerEvents: 'none',
    zIndex: 10,
  },
  inputHandleLabel: {
    left: '8px',
  },
  outputHandleLabel: {
    right: '8px',
  },
  configToggle: {
    backgroundColor: tokens.colorBrandBackground,
  },
  statusIndicator: {
    position: 'absolute',
    top: '8px',
    right: '8px',
    width: '8px',
    height: '8px',
    borderRadius: '50%',
    backgroundColor: tokens.colorNeutralForeground3,
  },
  statusRunning: {
    backgroundColor: tokens.colorPaletteBlueBackground2,
  },
  statusCompleted: {
    backgroundColor: tokens.colorPaletteGreenBackground2,
  },
  statusError: {
    backgroundColor: tokens.colorPaletteRedBackground2,
  },
})

export interface BaseNodeProps extends NodeProps<NodeData> {
  configurable?: boolean
  onConfigChange?: (nodeId: string, config: Record<string, any>) => void
}

export const BaseNode: React.FC<BaseNodeProps> = ({
  id,
  data,
  selected,
  configurable = false,
  onConfigChange,
}) => {
  const styles = useStyles()
  const [isConfigExpanded, setIsConfigExpanded] = React.useState(false)

  const handleConfigChange = (key: string, value: any) => {
    if (onConfigChange) {
      onConfigChange(id, { [key]: value })
    }
  }

  const getNodeIcon = (type: string, category: string) => {
    // Handle specific node types first
    switch (type) {
      case 'data':
        return <DatabaseRegular className={styles.icon} />
      case 'delay':
        return <ClockRegular className={styles.icon} />
      case 'subflow':
        return <FlowRegular className={styles.icon} />
      case 'console-log':
      case 'console-error':
      case 'console-warn':
      case 'console-info':
      case 'console-debug':
      case 'console-table':
      case 'console-time':
      case 'console-timeend':
      case 'console-group':
      case 'console-groupend':
      case 'console-clear':
      case 'console-trace':
      case 'console-count':
      case 'console-countreset':
        return <DocumentRegular className={styles.icon} />
      default:
        // Fall back to category-based icons
        switch (category) {
          case 'core':
            return <CircleRegular className={styles.icon} />
          case 'logic':
            return <BranchRegular className={styles.icon} />
          case 'math':
            return <CalculatorRegular className={styles.icon} />
          case 'string':
            return <TextTRegular className={styles.icon} />
          case 'flow':
            return <FlowRegular className={styles.icon} />
          case 'custom':
            return <CodeRegular className={styles.icon} />
          default:
            return <CircleRegular className={styles.icon} />
        }
    }
  }

  const getNodeDisplayName = (type: string) => {
    // Convert node type to user-friendly display name
    switch (type) {
      case 'data':
        return 'Data Node'
      case 'delay':
        return 'Delay'
      case 'subflow':
        return 'Subflow'
      case 'logic-and':
        return 'AND Gate'
      case 'logic-or':
        return 'OR Gate'
      case 'logic-not':
        return 'NOT Gate'
      case 'logic-xor':
        return 'XOR Gate'
      case 'math-add':
        return 'Add Numbers'
      case 'math-subtract':
        return 'Subtract Numbers'
      case 'math-multiply':
        return 'Multiply Numbers'
      case 'math-divide':
        return 'Divide Numbers'
      case 'math-power':
        return 'Power'
      case 'math-modulo':
        return 'Modulo'
      case 'string-concat':
        return 'Join Text'
      case 'string-substring':
        return 'Extract Text'
      case 'string-replace':
        return 'Replace Text'
      case 'string-match':
        return 'Match Pattern'
      case 'string-split':
        return 'Split Text'
      case 'string-compare':
        return 'Compare Text'
      case 'string-length':
        return 'Text Length'
      case 'string-case':
        return 'Change Case'
      case 'condition':
        return 'Condition'
      case 'merge-all':
        return 'Wait for All'
      case 'merge-any':
        return 'Wait for Any'
      case 'merge-majority':
        return 'Wait for Majority'
      case 'merge-count':
        return 'Wait for Count'
      case 'console-log':
        return 'Log Message'
      case 'console-error':
        return 'Log Error'
      case 'console-warn':
        return 'Log Warning'
      case 'console-info':
        return 'Log Info'
      case 'console-debug':
        return 'Log Debug'
      case 'console-table':
        return 'Log Table'
      case 'console-time':
        return 'Start Timer'
      case 'console-timeend':
        return 'End Timer'
      case 'console-group':
        return 'Start Group'
      case 'console-groupend':
        return 'End Group'
      case 'console-clear':
        return 'Clear Console'
      case 'console-trace':
        return 'Log Trace'
      case 'console-count':
        return 'Count Calls'
      case 'console-countreset':
        return 'Reset Counter'
      default:
        return type
    }
  }

  const getNodeDescription = (type: string) => {
    // Provide helpful descriptions for each node type
    switch (type) {
      case 'data':
        return 'Passes data through the workflow'
      case 'delay':
        return 'Waits for a specified duration'
      case 'subflow':
        return 'Executes another workflow'
      case 'logic-and':
        return 'Returns true if all inputs are true'
      case 'logic-or':
        return 'Returns true if any input is true'
      case 'logic-not':
        return 'Inverts the input value'
      case 'logic-xor':
        return 'Returns true if exactly one input is true'
      case 'math-add':
        return 'Adds multiple numbers together'
      case 'math-subtract':
        return 'Subtracts numbers from each other'
      case 'math-multiply':
        return 'Multiplies multiple numbers'
      case 'math-divide':
        return 'Divides the first number by the second'
      case 'math-power':
        return 'Raises a number to a power'
      case 'math-modulo':
        return 'Returns the remainder after division'
      case 'string-concat':
        return 'Joins multiple text strings together'
      case 'string-substring':
        return 'Extracts a portion of text'
      case 'string-replace':
        return 'Replaces text with new content'
      case 'string-match':
        return 'Checks if text matches a pattern'
      case 'string-split':
        return 'Splits text into an array'
      case 'string-compare':
        return 'Compares two text strings'
      case 'string-length':
        return 'Counts characters in text'
      case 'string-case':
        return 'Changes text to upper/lower case'
      case 'condition':
        return 'Makes decisions based on conditions'
      case 'merge-all':
        return 'Waits for all dependencies to complete'
      case 'merge-any':
        return 'Proceeds when any dependency completes'
      case 'merge-majority':
        return 'Proceeds when most dependencies complete'
      case 'merge-count':
        return 'Proceeds when specific number complete'
      case 'console-log':
        return 'Outputs a message to console'
      case 'console-error':
        return 'Outputs an error message'
      case 'console-warn':
        return 'Outputs a warning message'
      case 'console-info':
        return 'Outputs an info message'
      case 'console-debug':
        return 'Outputs a debug message'
      case 'console-table':
        return 'Displays data as a table'
      case 'console-time':
        return 'Starts a performance timer'
      case 'console-timeend':
        return 'Ends a performance timer'
      case 'console-group':
        return 'Starts a console group'
      case 'console-groupend':
        return 'Ends a console group'
      case 'console-clear':
        return 'Clears the console'
      case 'console-trace':
        return 'Outputs a stack trace'
      case 'console-count':
        return 'Counts function calls'
      case 'console-countreset':
        return 'Resets a counter'
      default:
        return 'Custom node type'
    }
  }

  const getInputHandles = () => {
    if (!data.inputs) return []
    
    return Object.entries(data.inputs).map(([inputId, inputData], index) => ({
      id: inputId,
      label: inputId,
      position: { top: `${20 + index * 30}px` }
    }))
  }

  const getOutputHandles = () => {
    if (!data.outputs) return []
    
    return Object.entries(data.outputs).map(([outputId, outputData], index) => ({
      id: outputId,
      label: outputId,
      position: { top: `${20 + index * 30}px` }
    }))
  }

  const renderConfigField = (key: string, value: any) => {
    const fieldType = typeof value
    
    switch (fieldType) {
      case 'boolean':
        return (
          <Checkbox
            checked={value}
            onChange={(_, data) => handleConfigChange(key, data.checked)}
            label={key}
          />
        )
      case 'number':
        return (
          <Input
            type="number"
            value={value.toString()}
            onChange={(_, data) => handleConfigChange(key, Number(data.value))}
            placeholder={`Enter ${key}...`}
          />
        )
      case 'string':
        if (value.length > 50) {
          return (
            <Textarea
              value={value.toString()}
              onChange={(_, data) => handleConfigChange(key, data.value)}
              placeholder={`Enter ${key}...`}
              rows={3}
            />
          )
        }
        return (
          <Input
            value={value.toString()}
            onChange={(_, data) => handleConfigChange(key, data.value)}
            placeholder={`Enter ${key}...`}
          />
        )
      default:
        return (
          <Input
            value={JSON.stringify(value)}
            onChange={(_, data) => {
              try {
                const parsed = JSON.parse(data.value)
                handleConfigChange(key, parsed)
              } catch {
                handleConfigChange(key, data.value)
              }
            }}
            placeholder={`Enter ${key}...`}
          />
        )
    }
  }

  const getStatusClass = (status?: string) => {
    if (!status) return ''
    switch (status) {
      case 'running':
        return styles.statusRunning
      case 'completed':
        return styles.statusCompleted
      case 'failed':
        return styles.statusError
      default:
        return ''
    }
  }

  const inputHandles = getInputHandles()
  const outputHandles = getOutputHandles()

  return (
    <div className={`${styles.root} ${selected ? styles.selected : ''}`}>
      {/* Status Indicator */}
      <div className={`${styles.statusIndicator} ${getStatusClass(data.status)}`} />
      
      {/* Input Handles */}
      {inputHandles.map((handle, index) => (
        <div key={`input-${index}`} style={{ position: 'relative' }}>
          <Handle
            type="target"
            position={Position.Left}
            id={handle.id}
            className={`${styles.handle} ${styles.inputHandle}`}
            style={handle.position}
          />
          <div 
            className={`${styles.handleLabel} ${styles.inputHandleLabel}`}
            style={handle.position}
          >
            {handle.label}
          </div>
        </div>
      ))}

      {/* Node Header */}
      <div className={styles.header}>
        <div style={{ display: 'flex', alignItems: 'flex-start' }}>
          {getNodeIcon(data.type, data.category)}
          <div style={{ flex: 1 }}>
            <Title3 className={styles.title}>{getNodeDisplayName(data.type)}</Title3>
            <Caption1 className={styles.description}>{getNodeDescription(data.type)}</Caption1>
          </div>
        </div>
      </div>

      {/* Node Content */}
      <div className={styles.content}>
        {/* Configuration Section */}
        {configurable && data.config && Object.keys(data.config).length > 0 && (
          <div className={styles.configSection}>
            <Button
              appearance="subtle"
              size="small"
              onClick={() => setIsConfigExpanded(!isConfigExpanded)}
              className={styles.expandButton}
              icon={isConfigExpanded ? <ChevronUpRegular /> : <ChevronDownRegular />}
            >
              {isConfigExpanded ? 'Hide Settings' : 'Show Settings'}
            </Button>
            
            {isConfigExpanded && (
              <div style={{ marginTop: '12px' }}>
                {Object.entries(data.config).map(([key, value]) => (
                  <div key={key} className={styles.configItem}>
                    <Label className={styles.configLabel}>{key}</Label>
                    {renderConfigField(key, value)}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Output Handles */}
      {outputHandles.map((handle, index) => (
        <div key={`output-${index}`} style={{ position: 'relative' }}>
          <Handle
            type="source"
            position={Position.Right}
            id={handle.id}
            className={`${styles.handle} ${styles.outputHandle}`}
            style={handle.position}
          />
          <div 
            className={`${styles.handleLabel} ${styles.outputHandleLabel}`}
            style={handle.position}
          >
            {handle.label}
          </div>
        </div>
      ))}
    </div>
  )
} 