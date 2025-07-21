import React from 'react'
import { Handle, Position, NodeProps } from 'reactflow'
import {
  Title3,
  Caption1,
  Button,
  Input,
  Label,
  Checkbox,
  makeStyles,
  tokens,
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
} from '@fluentui/react-icons'
import type { NodeData } from '../../types'

const useStyles = makeStyles({
  root: {
    minWidth: '200px',
    maxWidth: '300px',
    border: `1px solid ${tokens.colorNeutralStroke1}`,
    borderRadius: tokens.borderRadiusMedium,
    backgroundColor: tokens.colorNeutralBackground1,
    boxShadow: tokens.shadow4,
    transition: 'all 0.2s ease',
    '&:hover': {
      boxShadow: tokens.shadow8,
      transform: 'translateY(-2px)',
    },
  },
  selected: {
    border: `2px solid ${tokens.colorBrandStroke1}`,
    boxShadow: tokens.shadow8,
  },
  header: {
    padding: '8px 12px',
    borderBottom: `1px solid ${tokens.colorNeutralStroke2}`,
    backgroundColor: tokens.colorNeutralBackground2,
  },
  content: {
    padding: '12px',
  },
  icon: {
    width: '16px',
    height: '16px',
    marginRight: '8px',
  },
  title: {
    margin: 0,
    fontSize: tokens.fontSizeBase300,
    fontWeight: tokens.fontWeightSemibold,
    color: tokens.colorNeutralForeground1,
  },
  category: {
    fontSize: tokens.fontSizeBase100,
    color: tokens.colorNeutralForeground3,
  },
  configSection: {
    marginTop: '8px',
    paddingTop: '8px',
    borderTop: `1px solid ${tokens.colorNeutralStroke2}`,
  },
  configItem: {
    marginBottom: '8px',
  },
  configLabel: {
    fontSize: tokens.fontSizeBase100,
    fontWeight: tokens.fontWeightMedium,
    color: tokens.colorNeutralForeground2,
    marginBottom: '4px',
  },
  configInput: {
    width: '100%',
  },
  expandButton: {
    minHeight: 'auto',
    padding: '4px 8px',
    fontSize: tokens.fontSizeBase100,
  },
  handle: {
    width: '8px',
    height: '8px',
    backgroundColor: tokens.colorBrandBackground,
    border: `2px solid ${tokens.colorNeutralBackground1}`,
  },
  inputHandle: {
    left: '-4px',
  },
  outputHandle: {
    right: '-4px',
  },
  configToggle: {
    backgroundColor: tokens.colorBrandBackground,
  },
  nodeType: {
    fontSize: tokens.fontSizeBase100,
    color: tokens.colorNeutralForeground3,
    fontStyle: 'italic',
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
    // Convert node type to display name
    switch (type) {
      case 'data':
        return 'Data'
      case 'delay':
        return 'Delay'
      case 'subflow':
        return 'Subflow'
      case 'logic-and':
        return 'AND'
      case 'logic-or':
        return 'OR'
      case 'logic-not':
        return 'NOT'
      case 'logic-xor':
        return 'XOR'
      case 'math-add':
        return 'Add'
      case 'math-subtract':
        return 'Subtract'
      case 'math-multiply':
        return 'Multiply'
      case 'math-divide':
        return 'Divide'
      case 'math-power':
        return 'Power'
      case 'math-modulo':
        return 'Modulo'
      case 'string-concat':
        return 'Concatenate'
      case 'string-substring':
        return 'Substring'
      case 'string-replace':
        return 'Replace'
      case 'string-match':
        return 'Match'
      case 'string-split':
        return 'Split'
      case 'string-compare':
        return 'Compare'
      case 'string-length':
        return 'Length'
      case 'string-case':
        return 'Case Transform'
      case 'condition':
        return 'Condition'
      case 'merge-all':
        return 'Merge All'
      case 'merge-any':
        return 'Merge Any'
      case 'merge-majority':
        return 'Merge Majority'
      case 'merge-count':
        return 'Merge Count'
      case 'console-log':
        return 'Console Log'
      case 'console-error':
        return 'Console Error'
      case 'console-warn':
        return 'Console Warn'
      case 'console-info':
        return 'Console Info'
      case 'console-debug':
        return 'Console Debug'
      case 'console-table':
        return 'Console Table'
      case 'console-time':
        return 'Console Time'
      case 'console-timeend':
        return 'Console Time End'
      case 'console-group':
        return 'Console Group'
      case 'console-groupend':
        return 'Console Group End'
      case 'console-clear':
        return 'Console Clear'
      case 'console-trace':
        return 'Console Trace'
      case 'console-count':
        return 'Console Count'
      case 'console-countreset':
        return 'Console Count Reset'
      default:
        return type
    }
  }

  return (
    <div className={`${styles.root} ${selected ? styles.selected : ''}`}>
      {/* Input Handles */}
      {data.inputs && Object.entries(data.inputs).map(([inputId, _inputData], index: number) => (
        <Handle
          key={`input-${index}`}
          type="target"
          position={Position.Left}
          id={inputId}
          className={`${styles.handle} ${styles.inputHandle}`}
          style={{ top: `${20 + index * 20}px` }}
        />
      ))}

      {/* Node Header */}
      <div className={styles.header}>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          {getNodeIcon(data.type, data.category)}
          <div>
            <Title3 className={styles.title}>{getNodeDisplayName(data.type)}</Title3>
            <Caption1 className={styles.category}>{data.category}</Caption1>
          </div>
        </div>
      </div>

      {/* Node Content */}
      <div className={styles.content}>
        <p className={styles.nodeType}>Type: {data.type}</p>
        
        {/* Configuration Section */}
        {configurable && data.config && Object.keys(data.config).length > 0 && (
          <div className={styles.configSection}>
            <Button
              appearance="subtle"
              size="small"
              onClick={() => setIsConfigExpanded(!isConfigExpanded)}
              className={styles.expandButton}
            >
              {isConfigExpanded ? (
                <>
                  <ChevronUpRegular />
                  Hide Config
                </>
              ) : (
                <>
                  <ChevronDownRegular />
                  Show Config
                </>
              )}
            </Button>
            
            {isConfigExpanded && (
              <div>
                {Object.entries(data.config).map(([key, value]) => (
                  <div key={key} className={styles.configItem}>
                    <Label className={styles.configLabel}>{key}</Label>
                    {typeof value === 'boolean' ? (
                      <Checkbox
                        checked={value}
                        onChange={(_, data) => handleConfigChange(key, data.checked)}
                      />
                    ) : typeof value === 'number' ? (
                      <Input
                        type="number"
                        value={value.toString()}
                        onChange={(_, data) => handleConfigChange(key, Number(data.value))}
                      />
                    ) : (
                      <Input
                        value={value.toString()}
                        onChange={(_, data) => handleConfigChange(key, data.value)}
                      />
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Output Handles */}
      {data.outputs && Object.entries(data.outputs).map(([outputId, _outputData], index: number) => (
        <Handle
          key={`output-${index}`}
          type="source"
          position={Position.Right}
          id={outputId}
          className={`${styles.handle} ${styles.outputHandle}`}
          style={{ top: `${20 + index * 20}px` }}
        />
      ))}
    </div>
  )
} 