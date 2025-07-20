import React, { useState } from 'react'
import {
  Card,
  CardHeader,
  CardPreview,
  Title3,
  Caption1,
  Button,
  Input,
  Label,
  Select,
  makeStyles,
  tokens,
  useTheme,
  TabList,
  Tab,
  TabValue,
} from '@fluentui/react-components'
import {
  CircleRegular,
  BranchRegular,
  CalculatorRegular,
  TextRegular,
  FlowRegular,
  CodeRegular,
  SearchRegular,
  AddRegular,
  SettingsRegular,
} from '@fluentui/react-icons'
import type { NodeCategory, NodeTypeDefinition } from '../../types'
import { useCategories, useNodeTypes } from '../../store'

const useStyles = makeStyles({
  root: {
    width: '280px',
    height: '100%',
    borderRight: `1px solid ${tokens.colorNeutralStroke2}`,
    backgroundColor: tokens.colorNeutralBackground1,
    display: 'flex',
    flexDirection: 'column',
  },
  header: {
    padding: '16px',
    borderBottom: `1px solid ${tokens.colorNeutralStroke2}`,
    backgroundColor: tokens.colorNeutralBackground2,
  },
  title: {
    margin: 0,
    fontSize: tokens.fontSizeBase500,
    fontWeight: tokens.fontWeightSemibold,
    color: tokens.colorNeutralForeground1,
  },
  subtitle: {
    margin: '4px 0 0 0',
    fontSize: tokens.fontSizeBase200,
    color: tokens.colorNeutralForeground3,
  },
  search: {
    marginTop: '12px',
  },
  content: {
    flex: 1,
    overflow: 'hidden',
    display: 'flex',
    flexDirection: 'column',
  },
  tabList: {
    borderBottom: `1px solid ${tokens.colorNeutralStroke2}`,
  },
  tabPanel: {
    flex: 1,
    overflow: 'auto',
    padding: '16px',
  },
  category: {
    marginBottom: '16px',
  },
  categoryHeader: {
    display: 'flex',
    alignItems: 'center',
    marginBottom: '8px',
    padding: '8px 12px',
    backgroundColor: tokens.colorNeutralBackground2,
    borderRadius: tokens.borderRadiusSmall,
  },
  categoryIcon: {
    width: '16px',
    height: '16px',
    marginRight: '8px',
  },
  categoryTitle: {
    fontSize: tokens.fontSizeBase300,
    fontWeight: tokens.fontWeightSemibold,
    color: tokens.colorNeutralForeground1,
  },
  categoryDescription: {
    fontSize: tokens.fontSizeBase100,
    color: tokens.colorNeutralForeground3,
    marginLeft: '24px',
  },
  nodeList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  nodeItem: {
    padding: '8px 12px',
    border: `1px solid ${tokens.colorNeutralStroke1}`,
    borderRadius: tokens.borderRadiusSmall,
    backgroundColor: tokens.colorNeutralBackground1,
    cursor: 'grab',
    transition: 'all 0.2s ease',
    '&:hover': {
      backgroundColor: tokens.colorNeutralBackground2,
      borderColor: tokens.colorNeutralStroke2,
      transform: 'translateY(-1px)',
      boxShadow: tokens.shadow4,
    },
    '&:active': {
      cursor: 'grabbing',
    },
  },
  nodeHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  nodeTitle: {
    fontSize: tokens.fontSizeBase200,
    fontWeight: tokens.fontWeightMedium,
    color: tokens.colorNeutralForeground1,
  },
  nodeType: {
    fontSize: tokens.fontSizeBase100,
    color: tokens.colorNeutralForeground3,
  },
  nodeDescription: {
    fontSize: tokens.fontSizeBase100,
    color: tokens.colorNeutralForeground3,
    marginTop: '4px',
  },
  emptyState: {
    textAlign: 'center',
    padding: '32px 16px',
    color: tokens.colorNeutralForeground3,
  },
  settings: {
    padding: '16px',
    borderTop: `1px solid ${tokens.colorNeutralStroke2}`,
    backgroundColor: tokens.colorNeutralBackground2,
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

export interface SidebarProps {
  onNodeDragStart?: (nodeType: NodeTypeDefinition, event: React.DragEvent) => void
  onNodeDragEnd?: (event: React.DragEvent) => void
}

export const Sidebar: React.FC<SidebarProps> = ({
  onNodeDragStart,
  onNodeDragEnd,
}) => {
  const styles = useStyles()
  const theme = useTheme()
  const categories = useCategories()
  const nodeTypes = useNodeTypes()
  
  const [selectedTab, setSelectedTab] = useState<TabValue>('nodes')
  const [searchTerm, setSearchTerm] = useState('')

  const filteredNodeTypes = nodeTypes.filter(nodeType =>
    nodeType.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    nodeType.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    nodeType.category.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const groupedNodeTypes = filteredNodeTypes.reduce((acc, nodeType) => {
    const category = categories.find(c => c.id === nodeType.category)
    if (category) {
      if (!acc[category.id]) {
        acc[category.id] = { category, nodeTypes: [] }
      }
      acc[category.id].nodeTypes.push(nodeType)
    }
    return acc
  }, {} as Record<string, { category: NodeCategory; nodeTypes: NodeTypeDefinition[] }>)

  const handleNodeDragStart = (nodeType: NodeTypeDefinition, event: React.DragEvent) => {
    event.dataTransfer.setData('application/reactflow', JSON.stringify({
      type: 'node',
      nodeType: nodeType.id,
      category: nodeType.category,
    }))
    event.dataTransfer.effectAllowed = 'move'
    onNodeDragStart?.(nodeType, event)
  }

  const handleNodeDragEnd = (event: React.DragEvent) => {
    onNodeDragEnd?.(event)
  }

  return (
    <div className={styles.root}>
      <div className={styles.header}>
        <Title3 className={styles.title}>Flows Editor</Title3>
        <Caption1 className={styles.subtitle}>Drag nodes to create workflows</Caption1>
        
        <div className={styles.search}>
          <Input
            size="small"
            placeholder="Search nodes..."
            value={searchTerm}
            onChange={(e, data) => setSearchTerm(data.value)}
            contentBefore={<SearchRegular />}
          />
        </div>
      </div>

      <div className={styles.content}>
        <TabList
          selectedValue={selectedTab}
          onTabSelect={(e, data) => setSelectedTab(data.value)}
          className={styles.tabList}
        >
          <Tab value="nodes">Nodes</Tab>
          <Tab value="settings">Settings</Tab>
        </TabList>

        {selectedTab === 'nodes' && (
          <div className={styles.tabPanel}>
            {Object.values(groupedNodeTypes).length === 0 ? (
              <div className={styles.emptyState}>
                <p>No nodes found</p>
                <p>Try adjusting your search terms</p>
              </div>
            ) : (
              Object.values(groupedNodeTypes)
                .sort((a, b) => a.category.order - b.category.order)
                .map(({ category, nodeTypes }) => (
                  <div key={category.id} className={styles.category}>
                    <div className={styles.categoryHeader}>
                      {React.createElement(categoryIcons[category.id as keyof typeof categoryIcons] || CircleRegular, {
                        className: styles.categoryIcon,
                        style: { color: categoryColors[category.id as keyof typeof categoryColors] || '#0078d4' }
                      })}
                      <div>
                        <div className={styles.categoryTitle}>{category.name}</div>
                        <div className={styles.categoryDescription}>{category.description}</div>
                      </div>
                    </div>
                    
                    <div className={styles.nodeList}>
                      {nodeTypes.map(nodeType => (
                        <div
                          key={nodeType.id}
                          className={styles.nodeItem}
                          draggable
                          onDragStart={(e) => handleNodeDragStart(nodeType, e)}
                          onDragEnd={handleNodeDragEnd}
                        >
                          <div className={styles.nodeHeader}>
                            <div className={styles.nodeTitle}>{nodeType.name}</div>
                            <div className={styles.nodeType}>{nodeType.type}</div>
                          </div>
                          <div className={styles.nodeDescription}>{nodeType.description}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))
            )}
          </div>
        )}

        {selectedTab === 'settings' && (
          <div className={styles.tabPanel}>
            <div className={styles.settings}>
              <Title3>Editor Settings</Title3>
              <p>Settings panel coming soon...</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
} 