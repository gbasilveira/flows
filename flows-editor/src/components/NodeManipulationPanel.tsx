import React, { useState, useCallback } from 'react'
import {
  Text,
  Input,
  Textarea,
  Dropdown,
  Option,
  Button,
  Label,
  Field,
  Accordion,
  AccordionItem,
  AccordionHeader,
  AccordionPanel,
  Switch,
  makeStyles,
  tokens,
} from '@fluentui/react-components'
import {
  SettingsRegular,
  DataUsageRegular,
  PlugConnectedRegular,
  DismissRegular,
  SaveRegular,
  DeleteRegular,
} from '@fluentui/react-icons'
import { useEditorStore } from '../store'
import { getNodeType } from '../utils/plugin-registry'

const useStyles = makeStyles({
  root: {
    width: '350px',
    height: '100%',
    borderLeft: `1px solid ${tokens.colorNeutralStroke2}`,
    backgroundColor: tokens.colorNeutralBackground1,
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
  },
  header: {
    padding: '16px',
    borderBottom: `1px solid ${tokens.colorNeutralStroke2}`,
    backgroundColor: tokens.colorNeutralBackground2,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexShrink: 0,
  },
  title: {
    fontSize: tokens.fontSizeBase500,
    fontWeight: tokens.fontWeightSemibold,
    color: tokens.colorNeutralForeground1,
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  content: {
    flex: 1,
    overflow: 'auto',
    padding: '16px',
  },
  section: {
    marginBottom: '24px',
  },
  sectionTitle: {
    fontSize: tokens.fontSizeBase400,
    fontWeight: tokens.fontWeightSemibold,
    color: tokens.colorNeutralForeground1,
    marginBottom: '12px',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  inputGroup: {
    marginBottom: '16px',
  },
  inputRow: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: '8px',
  },
  inputLabel: {
    fontSize: tokens.fontSizeBase300,
    fontWeight: tokens.fontWeightMedium,
    color: tokens.colorNeutralForeground2,
  },
  inputDescription: {
    fontSize: tokens.fontSizeBase200,
    color: tokens.colorNeutralForeground3,
    marginBottom: '8px',
  },
  modeToggle: {
    padding: '4px 8px',
    fontSize: tokens.fontSizeBase200,
    borderRadius: tokens.borderRadiusSmall,
    backgroundColor: tokens.colorNeutralBackground3,
    border: `1px solid ${tokens.colorNeutralStroke2}`,
    cursor: 'pointer',
    '&:hover': {
      backgroundColor: tokens.colorNeutralBackground2,
    },
    '&.active': {
      backgroundColor: tokens.colorBrandBackground,
      color: tokens.colorNeutralForegroundOnBrand,
      border: `1px solid ${tokens.colorBrandStroke1}`,
    },
  },
  outputGroup: {
    marginBottom: '16px',
  },
  outputItem: {
    padding: '8px',
    backgroundColor: tokens.colorNeutralBackground2,
    borderRadius: tokens.borderRadiusSmall,
    marginBottom: '8px',
  },
  outputName: {
    fontSize: tokens.fontSizeBase300,
    fontWeight: tokens.fontWeightMedium,
    color: tokens.colorNeutralForeground1,
  },
  outputType: {
    fontSize: tokens.fontSizeBase200,
    color: tokens.colorNeutralForeground2,
    textTransform: 'uppercase',
  },
  configField: {
    marginBottom: '16px',
  },
  actions: {
    padding: '16px',
    borderTop: `1px solid ${tokens.colorNeutralStroke2}`,
    backgroundColor: tokens.colorNeutralBackground2,
    display: 'flex',
    gap: '12px',
    flexShrink: 0,
  },
  noSelection: {
    textAlign: 'center',
    color: tokens.colorNeutralForeground3,
    padding: '32px 16px',
  },
})

interface NodeManipulationPanelProps {
  isOpen: boolean
  onClose: () => void
}

type InputMode = 'static' | 'dynamic'

interface InputConfig {
  mode: InputMode
  staticValue: any
  isConnected: boolean
}

export const NodeManipulationPanel: React.FC<NodeManipulationPanelProps> = ({
  isOpen,
  onClose,
}) => {
  const styles = useStyles()
  const { selectedNodes, nodes, updateNode, removeNode } = useEditorStore()
  const [inputConfigs, setInputConfigs] = useState<Record<string, InputConfig>>({})

  // Get the currently selected node
  const selectedNode = selectedNodes.length === 1 
    ? nodes.find(n => n.id === selectedNodes[0]) 
    : null

  // Get node type definition
  const nodeTypeDef = selectedNode ? getNodeType(selectedNode.data.type) : null

  const handleInputModeChange = useCallback((inputId: string, mode: InputMode) => {
    setInputConfigs(prev => ({
      ...prev,
      [inputId]: {
        ...prev[inputId],
        mode,
      }
    }))
  }, [])

  const handleStaticValueChange = useCallback((inputId: string, value: any) => {
    if (!selectedNode) return

    setInputConfigs(prev => ({
      ...prev,
      [inputId]: {
        ...prev[inputId],
        staticValue: value,
      }
    }))

    // Update the node's input data
    updateNode(selectedNode.id, {
      data: {
        ...selectedNode.data,
        inputs: {
          ...selectedNode.data.inputs,
          [inputId]: value,
        }
      }
    })
  }, [selectedNode, updateNode])

  const handleConfigChange = useCallback((key: string, value: any) => {
    if (!selectedNode) return

    updateNode(selectedNode.id, {
      data: {
        ...selectedNode.data,
        config: {
          ...selectedNode.data.config,
          [key]: value,
        }
      }
    })
  }, [selectedNode, updateNode])

  const handleDeleteNode = useCallback(() => {
    if (!selectedNode) return
    removeNode(selectedNode.id)
    onClose()
  }, [selectedNode, removeNode, onClose])

  const renderInputField = useCallback((inputDef: any, inputId: string) => {
    const config = inputConfigs[inputId] || { mode: 'static', staticValue: inputDef.defaultValue, isConnected: false }
    const currentValue = selectedNode?.data.inputs?.[inputId] ?? inputDef.defaultValue

    const renderValueInput = () => {
      switch (inputDef.type) {
        case 'string':
          if (inputDef.options) {
            return (
              <Dropdown
                value={currentValue?.toString() ?? ''}
                onOptionSelect={(_, data) => handleStaticValueChange(inputId, data.optionValue)}
                placeholder={`Select ${inputDef.name}...`}
              >
                {inputDef.options.map((option: any) => (
                  <Option key={option.value} value={option.value}>
                    {option.label}
                  </Option>
                ))}
              </Dropdown>
            )
          }
          return currentValue?.length > 50 ? (
            <Textarea
              value={currentValue?.toString() || ''}
              onChange={(_, data) => handleStaticValueChange(inputId, data.value)}
              placeholder={`Enter ${inputDef.name}...`}
              rows={3}
            />
          ) : (
            <Input
              value={currentValue?.toString() || ''}
              onChange={(_, data) => handleStaticValueChange(inputId, data.value)}
              placeholder={`Enter ${inputDef.name}...`}
            />
          )

        case 'number':
          return (
            <Input
              type="number"
              value={currentValue?.toString() || ''}
              onChange={(_, data) => handleStaticValueChange(inputId, Number(data.value) || 0)}
              placeholder={`Enter ${inputDef.name}...`}
            />
          )

        case 'boolean':
          return (
            <Switch
              checked={Boolean(currentValue)}
              onChange={(_, data) => handleStaticValueChange(inputId, data.checked)}
              label={inputDef.name}
            />
          )

        case 'array':
          try {
            const arrayValue = Array.isArray(currentValue) 
              ? JSON.stringify(currentValue, null, 2)
              : currentValue?.toString() || '[]'
            return (
              <Textarea
                value={arrayValue}
                onChange={(_, data) => {
                  try {
                    const parsed = JSON.parse(data.value)
                    handleStaticValueChange(inputId, parsed)
                  } catch {
                    // Keep as string until valid JSON
                  }
                }}
                placeholder={`Enter ${inputDef.name} as JSON array...`}
                rows={4}
              />
            )
          } catch {
            return (
              <Input
                value={currentValue?.toString() || ''}
                onChange={(_, data) => handleStaticValueChange(inputId, data.value)}
                placeholder={`Enter ${inputDef.name}...`}
              />
            )
          }

        case 'object':
          try {
            const objectValue = typeof currentValue === 'object' && currentValue !== null
              ? JSON.stringify(currentValue, null, 2)
              : currentValue?.toString() || '{}'
            return (
              <Textarea
                value={objectValue}
                onChange={(_, data) => {
                  try {
                    const parsed = JSON.parse(data.value)
                    handleStaticValueChange(inputId, parsed)
                  } catch {
                    // Keep as string until valid JSON
                  }
                }}
                placeholder={`Enter ${inputDef.name} as JSON object...`}
                rows={4}
              />
            )
          } catch {
            return (
              <Input
                value={currentValue?.toString() || ''}
                onChange={(_, data) => handleStaticValueChange(inputId, data.value)}
                placeholder={`Enter ${inputDef.name}...`}
              />
            )
          }

        default:
          return (
            <Input
              value={currentValue?.toString() || ''}
              onChange={(_, data) => handleStaticValueChange(inputId, data.value)}
              placeholder={`Enter ${inputDef.name}...`}
            />
          )
      }
    }

    return (
      <div className={styles.inputGroup} key={inputId}>
        <div className={styles.inputRow}>
          <Label className={styles.inputLabel}>
            {inputDef.name}
            {inputDef.required && ' *'}
          </Label>
          <div style={{ display: 'flex', gap: '4px' }}>
            <button
              className={`${styles.modeToggle} ${config.mode === 'static' ? 'active' : ''}`}
              onClick={() => handleInputModeChange(inputId, 'static')}
              title="Static value - set manually"
            >
              Static
            </button>
            <button
              className={`${styles.modeToggle} ${config.mode === 'dynamic' ? 'active' : ''}`}
              onClick={() => handleInputModeChange(inputId, 'dynamic')}
              title="Dynamic value - from edge connection"
            >
              Dynamic
            </button>
          </div>
        </div>
        
        {inputDef.description && (
          <div className={styles.inputDescription}>{inputDef.description}</div>
        )}

        {config.mode === 'static' ? (
          <Field>
            {renderValueInput()}
          </Field>
        ) : (
          <div style={{ 
            padding: '12px', 
            backgroundColor: tokens.colorNeutralBackground3,
            borderRadius: tokens.borderRadiusSmall,
            border: `1px dashed ${tokens.colorNeutralStroke2}`,
            textAlign: 'center',
            color: tokens.colorNeutralForeground3,
          }}>
            <PlugConnectedRegular style={{ marginBottom: '4px' }} />
            <div>Connect an edge to provide this value</div>
          </div>
        )}
      </div>
    )
  }, [inputConfigs, selectedNode, handleStaticValueChange, handleInputModeChange, styles])

  const renderConfigField = useCallback((key: string, value: any, fieldDef?: any) => {
    const fieldType = fieldDef?.type || typeof value

    switch (fieldType) {
      case 'boolean':
        return (
          <Switch
            checked={Boolean(value)}
            onChange={(_, data) => handleConfigChange(key, data.checked)}
            label={key}
          />
        )
        
      case 'number':
        return (
          <Input
            type="number"
            value={value?.toString() || ''}
            onChange={(_, data) => handleConfigChange(key, Number(data.value) || 0)}
            placeholder={`Enter ${key}...`}
          />
        )
        
      case 'string':
        if (fieldDef?.options) {
          return (
            <Dropdown
              value={value?.toString()}
              onOptionSelect={(_, data) => handleConfigChange(key, data.optionValue)}
              placeholder={`Select ${key}...`}
            >
              {fieldDef.options.map((option: any) => (
                <Option key={option.value} value={option.value}>
                  {option.label}
                </Option>
              ))}
            </Dropdown>
          )
        }
        
        return value?.length > 50 ? (
          <Textarea
            value={value?.toString() || ''}
            onChange={(_, data) => handleConfigChange(key, data.value)}
            placeholder={`Enter ${key}...`}
            rows={3}
          />
        ) : (
          <Input
            value={value?.toString() || ''}
            onChange={(_, data) => handleConfigChange(key, data.value)}
            placeholder={`Enter ${key}...`}
          />
        )
        
      default:
        return (
          <Textarea
            value={typeof value === 'object' ? JSON.stringify(value, null, 2) : value?.toString() || ''}
            onChange={(_, data) => {
              try {
                const parsed = JSON.parse(data.value)
                handleConfigChange(key, parsed)
              } catch {
                handleConfigChange(key, data.value)
              }
            }}
            placeholder={`Enter ${key} as JSON...`}
            rows={3}
          />
        )
    }
  }, [handleConfigChange])

  if (!isOpen) return null

  if (!selectedNode) {
    return (
      <div className={styles.root}>
        <div className={styles.header}>
          <Text className={styles.title}>
            <SettingsRegular />
            Node Settings
          </Text>
          <Button
            appearance="subtle"
            icon={<DismissRegular />}
            onClick={onClose}
            title="Close panel"
          />
        </div>
        <div className={styles.noSelection}>
          <Text>Select a node to configure its settings</Text>
        </div>
      </div>
    )
  }

  return (
    <div className={styles.root}>
      <div className={styles.header}>
        <Text className={styles.title}>
          <SettingsRegular />
          {nodeTypeDef?.name || selectedNode.data.type}
        </Text>
        <Button
          appearance="subtle"
          icon={<DismissRegular />}
          onClick={onClose}
          title="Close panel"
        />
      </div>

      <div className={styles.content}>
        <Accordion multiple>
          {/* Node Information */}
          <AccordionItem value="info">
            <AccordionHeader>Node Information</AccordionHeader>
            <AccordionPanel>
              <div className={styles.section}>
                <Field label="Node ID">
                  <Input value={selectedNode.id} disabled />
                </Field>
                <Field label="Node Type">
                  <Input value={selectedNode.data.type} disabled />
                </Field>
                {nodeTypeDef?.description && (
                  <Field label="Description">
                    <Text>{nodeTypeDef.description}</Text>
                  </Field>
                )}
              </div>
            </AccordionPanel>
          </AccordionItem>

          {/* Input Configuration */}
          {nodeTypeDef?.inputs && nodeTypeDef.inputs.length > 0 && (
            <AccordionItem value="inputs">
              <AccordionHeader>
                <DataUsageRegular style={{ marginRight: '8px' }} />
                Input Configuration
              </AccordionHeader>
              <AccordionPanel>
                <div className={styles.section}>
                  {nodeTypeDef.inputs.map((inputDef) =>
                    renderInputField(inputDef, inputDef.id)
                  )}
                </div>
              </AccordionPanel>
            </AccordionItem>
          )}

          {/* Output Information */}
          {nodeTypeDef?.outputs && nodeTypeDef.outputs.length > 0 && (
            <AccordionItem value="outputs">
              <AccordionHeader>Outputs</AccordionHeader>
              <AccordionPanel>
                <div className={styles.section}>
                  {nodeTypeDef.outputs.map((outputDef) => (
                    <div key={outputDef.id} className={styles.outputItem}>
                      <div className={styles.outputName}>{outputDef.name}</div>
                      <div className={styles.outputType}>{outputDef.type}</div>
                      {outputDef.description && (
                        <div className={styles.inputDescription}>
                          {outputDef.description}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </AccordionPanel>
            </AccordionItem>
          )}

          {/* Advanced Configuration */}
          {nodeTypeDef?.configurable && selectedNode.data.config && (
            <AccordionItem value="config">
              <AccordionHeader>Advanced Configuration</AccordionHeader>
              <AccordionPanel>
                <div className={styles.section}>
                  {Object.entries(selectedNode.data.config).map(([key, value]) => (
                    <Field key={key} label={key} className={styles.configField}>
                      {renderConfigField(key, value)}
                    </Field>
                  ))}
                </div>
              </AccordionPanel>
            </AccordionItem>
          )}
        </Accordion>
      </div>

      <div className={styles.actions}>
        <Button
          appearance="primary"
          icon={<SaveRegular />}
          onClick={() => {
            // Save node configuration
            console.log('Node configuration saved')
          }}
        >
          Save
        </Button>
        <Button
          appearance="secondary"
          icon={<DeleteRegular />}
          onClick={handleDeleteNode}
        >
          Delete
        </Button>
      </div>
    </div>
  )
} 