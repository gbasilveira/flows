import React from 'react'
import { Handle, Position, NodeProps } from 'reactflow'
import {
  Card,
  CardHeader,
  CardPreview,
  Title3,
  Caption1,
  Badge,
  Button,
  Input,
  Label,
  Textarea,
  Select,
  Checkbox,
  Slider,
  makeStyles,
  tokens,
  useTheme,
} from '@fluentui/react-components'
import {
  CircleRegular,
  DatabaseRegular,
  BranchRegular,
  CalculatorRegular,
  TextRegular,
  FlowRegular,
  CodeRegular,
  SettingsRegular,
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
    backgroundColor: tokens.colorBrandBackground1,
    border: `2px solid ${tokens.colorBrandStroke1}`,
  },
})

const categoryIcons = {
  core: CircleRegular,
  logic: BranchRegular,
  math: CalculatorRegular,
  string: TextRegular,
  flow: FlowRegular,
  custom: CodeRegular,
}

const categoryColors = {
  core: '#0078d4',
  logic: '#107c10',
  math: '#d13438',
  string: '#ff8c00',
  flow: '#5c2d91',
  custom: '#6b69d6',
}

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
  const theme = useTheme()
  const [isConfigExpanded, setIsConfigExpanded] = React.useState(false)

  const IconComponent = categoryIcons[data.category as keyof typeof categoryIcons] || CircleRegular
  const categoryColor = categoryColors[data.category as keyof typeof categoryColors] || '#0078d4'

  const handleConfigChange = (key: string, value: any) => {
    const newConfig = { ...data.config, [key]: value }
    onConfigChange?.(id, newConfig)
  }

  const renderConfigInput = (input: any) => {
    switch (input.type) {
      case 'string':
        return (
          <Input
            size="small"
            value={data.config?.[input.id] || input.defaultValue || ''}
            onChange={(e, data) => handleConfigChange(input.id, data.value)}
            placeholder={input.description}
          />
        )
      case 'number':
        return (
          <Input
            type="number"
            size="small"
            value={data.config?.[input.id] || input.defaultValue || 0}
            onChange={(e, data) => handleConfigChange(input.id, Number(data.value))}
            placeholder={input.description}
          />
        )
      case 'boolean':
        return (
          <Checkbox
            checked={data.config?.[input.id] ?? input.defaultValue ?? false}
            onChange={(e, data) => handleConfigChange(input.id, data.checked)}
            label={input.description}
          />
        )
      case 'select':
        return (
          <Select
            size="small"
            value={data.config?.[input.id] || input.defaultValue}
            onChange={(e, data) => handleConfigChange(input.id, data.value)}
          >
            {input.options?.map((option: any) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </Select>
        )
      default:
        return null
    }
  }

  return (
    <Card
      className={`${styles.root} ${selected ? styles.selected : ''}`}
      style={{ borderColor: selected ? categoryColor : undefined }}
    >
      <Handle
        type="target"
        position={Position.Top}
        className={styles.handle}
      />
      
      <CardHeader className={styles.header}>
        <CardPreview>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <IconComponent className={styles.icon} style={{ color: categoryColor }} />
              <div>
                <Title3 className={styles.title}>{data.label}</Title3>
                <Caption1 className={styles.category}>{data.category}</Caption1>
              </div>
            </div>
            <Badge appearance="filled" color="brand">
              {data.type}
            </Badge>
          </div>
        </CardPreview>
      </CardHeader>

      <div className={styles.content}>
        {configurable && (
          <div className={styles.configSection}>
            <Button
              appearance="subtle"
              size="small"
              icon={isConfigExpanded ? <ChevronUpRegular /> : <ChevronDownRegular />}
              onClick={() => setIsConfigExpanded(!isConfigExpanded)}
              className={styles.expandButton}
            >
              Configuration
            </Button>
            
            {isConfigExpanded && (
              <div style={{ marginTop: '8px' }}>
                {/* Configuration inputs would go here based on node type */}
                <div className={styles.configItem}>
                  <Label className={styles.configLabel}>Node ID</Label>
                  <Input
                    size="small"
                    value={id}
                    readOnly
                    className={styles.configInput}
                  />
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      <Handle
        type="source"
        position={Position.Bottom}
        className={styles.handle}
      />
    </Card>
  )
} 