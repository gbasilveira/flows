import React, { useMemo } from 'react'
import { Handle, Position, NodeProps } from 'reactflow'
import {
  Button,
  Input,
  Label,
  Textarea,
  Checkbox,
  Text,
  makeStyles,
  tokens,
} from '@fluentui/react-components'
import {
  ChevronDownRegular,
  ChevronUpRegular,
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
    position: 'relative',
    overflow: 'visible',
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
    textAlign: 'center',
  },
  title: {
    margin: 0,
    fontSize: tokens.fontSizeBase500,
    fontWeight: tokens.fontWeightSemibold,
    color: tokens.colorNeutralForeground1,
    lineHeight: '1.2',
  },
  content: {
    padding: '16px',
    minHeight: '80px',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
  },
  ioSection: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    minHeight: '60px',
  },
  inputsContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
    alignItems: 'flex-start',
  },
  outputsContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
    alignItems: 'flex-end',
  },
  ioItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    fontSize: tokens.fontSizeBase200,
    color: tokens.colorNeutralForeground2,
    minHeight: '20px',
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
    '&.react-flow__handle-connecting': {
      backgroundColor: tokens.colorBrandBackgroundPressed,
    },
    '&.react-flow__handle-valid': {
      backgroundColor: tokens.colorPaletteGreenBackground2,
    },
  },
  inputHandle: {
    left: '-6px',
  },
  outputHandle: {
    right: '-6px',
  },
  settingsSection: {
    marginTop: '12px',
    paddingTop: '12px',
    borderTop: `1px solid ${tokens.colorNeutralStroke2}`,
  },
  settingsItem: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: '8px',
  },
  settingsLabel: {
    fontSize: tokens.fontSizeBase200,
    color: tokens.colorNeutralForeground2,
    flex: 1,
  },
  settingsInput: {
    width: '60px',
  },
  expandButton: {
    minHeight: 'auto',
    padding: '6px 12px',
    fontSize: tokens.fontSizeBase200,
    width: '100%',
    justifyContent: 'space-between',
  },
  configItem: {
    marginBottom: '8px',
  },
  configLabel: {
    fontSize: tokens.fontSizeBase200,
    fontWeight: tokens.fontWeightMedium,
    color: tokens.colorNeutralForeground2,
    marginBottom: '4px',
    display: 'block',
  },
  configInput: {
    width: '100%',
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
      // Data Primitive node types
      case 'number-parse':
        return 'Parse Number'
      case 'number-format':
        return 'Format Number'
      case 'number-validate':
        return 'Validate Number'
      case 'number-range':
        return 'Number Range'
      case 'number-round':
        return 'Round Number'
      case 'number-clamp':
        return 'Clamp Number'
      case 'string-parse':
        return 'Parse String'
      case 'string-validate':
        return 'Validate String'
      case 'string-encode':
        return 'Encode String'
      case 'string-decode':
        return 'Decode String'
      case 'string-format':
        return 'Format String'
      case 'string-sanitize':
        return 'Sanitize String'
      case 'array-create':
        return 'Create Array'
      case 'array-filter':
        return 'Filter Array'
      case 'array-map':
        return 'Map Array'
      case 'array-reduce':
        return 'Reduce Array'
      case 'array-sort':
        return 'Sort Array'
      case 'array-flatten':
        return 'Flatten Array'
      case 'array-unique':
        return 'Unique Array'
      case 'array-chunk':
        return 'Chunk Array'
      case 'array-slice':
        return 'Slice Array'
      case 'array-join':
        return 'Join Array'
      case 'object-create':
        return 'Create Object'
      case 'object-get':
        return 'Get Object Property'
      case 'object-set':
        return 'Set Object Property'
      case 'object-merge':
        return 'Merge Objects'
      case 'object-clone':
        return 'Clone Object'
      case 'object-keys':
        return 'Get Object Keys'
      case 'object-values':
        return 'Get Object Values'
      case 'object-entries':
        return 'Get Object Entries'
      case 'object-pick':
        return 'Pick Object Properties'
      case 'object-omit':
        return 'Omit Object Properties'
      case 'object-freeze':
        return 'Freeze Object'
      case 'boolean-parse':
        return 'Parse Boolean'
      case 'boolean-validate':
        return 'Validate Boolean'
      case 'json-parse':
        return 'Parse JSON'
      case 'json-stringify':
        return 'Stringify JSON'
      case 'json-validate':
        return 'Validate JSON'
      case 'json-schema-validate':
        return 'Validate JSON Schema'
      case 'type-check':
        return 'Check Type'
      case 'type-convert':
        return 'Convert Type'
      case 'type-validate':
        return 'Validate Type'
      case 'data-is-null':
        return 'Is Null'
      case 'data-is-undefined':
        return 'Is Undefined'
      case 'data-is-empty':
        return 'Is Empty'
      case 'data-is-valid':
        return 'Is Valid'
      case 'data-default':
        return 'Default Value'
      default:
        return type
    }
  }

  const inputHandles = useMemo(() => {
    if (!data.inputs) return []
    return Object.entries(data.inputs).map(([inputId], index) => ({
      id: inputId,
      type: 'target',
      position: Position.Left,
      style: { top: `${60 + index * 32}px` },
    }))
  }, [data.inputs])

  const outputHandles = useMemo(() => {
    if (!data.outputs) return []
    return Object.entries(data.outputs).map(([outputId], index) => ({
      id: outputId,
      type: 'source',
      position: Position.Right,
      style: { top: `${60 + index * 32}px` },
    }))
  }, [data.outputs])

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

  return (
    <div className={`${styles.root} ${selected ? styles.selected : ''}`}>
      {/* Input Handles */}
      {inputHandles.map((handle, index) => (
        <Handle
          key={`input-handle-${handle.id}-${index}`}
          type="target"
          position={Position.Left}
          id={handle.id}
          className={`${styles.handle} ${styles.inputHandle}`}
          style={handle.style}
        />
      ))}

      {/* Node Header */}
      <div className={styles.header}>
        <Text className={styles.title}>{getNodeDisplayName(data.type)}</Text>
      </div>

      {/* Node Content */}
      <div className={styles.content}>
        {/* Inputs and Outputs Section */}
        <div className={styles.ioSection}>
          {/* Inputs */}
          <div className={styles.inputsContainer}>
            {inputHandles.map((handle, index) => (
              <div key={`input-label-${handle.id}-${index}`} className={styles.ioItem}>
                <span>{handle.id}</span>
              </div>
            ))}
          </div>

          {/* Outputs */}
          <div className={styles.outputsContainer}>
            {outputHandles.map((handle, index) => (
              <div key={`output-label-${handle.id}-${index}`} className={styles.ioItem}>
                <span>{handle.id}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Settings Section */}
        {configurable && data.config && Object.keys(data.config).length > 0 && (
          <div className={styles.settingsSection}>
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
                  <div key={`config-${key}-${id}`} className={styles.configItem}>
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
        <Handle
          key={`output-handle-${handle.id}-${index}`}
          type="source"
          position={Position.Right}
          id={handle.id}
          className={`${styles.handle} ${styles.outputHandle}`}
          style={handle.style}
        />
      ))}
    </div>
  )
} 