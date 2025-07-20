import React, { useState } from 'react'
import {
  Title3,
  Caption1,
  Input,
  makeStyles,
  tokens,
  TabList,
  Tab,
  TabValue,
} from '@fluentui/react-components'
import {
  CircleRegular,
  BranchRegular,
  CalculatorRegular,
  TextTRegular,
  FlowRegular,
  CodeRegular,
  SearchRegular,
} from '@fluentui/react-icons'
import type { NodeTypeDefinition } from '../../types'
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
  nodeType: {
    padding: '8px 12px',
    margin: '4px 0',
    backgroundColor: tokens.colorNeutralBackground1,
    border: `1px solid ${tokens.colorNeutralStroke2}`,
    borderRadius: tokens.borderRadiusSmall,
    cursor: 'grab',
    transition: 'all 0.2s ease',
    '&:hover': {
      backgroundColor: tokens.colorNeutralBackground2,
      border: `1px solid ${tokens.colorBrandStroke1}`,
    },
  },
  nodeTypeDragging: {
    opacity: 0.5,
    cursor: 'grabbing',
  },
  nodeTypeHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  nodeTypeTitle: {
    fontSize: tokens.fontSizeBase200,
    fontWeight: tokens.fontWeightMedium,
    color: tokens.colorNeutralForeground1,
  },
  nodeTypeDescription: {
    fontSize: tokens.fontSizeBase100,
    color: tokens.colorNeutralForeground3,
    marginTop: '4px',
  },
  nodeTypeIcon: {
    width: '14px',
    height: '14px',
    marginRight: '6px',
  },
  emptyState: {
    textAlign: 'center',
    padding: '32px 16px',
    color: tokens.colorNeutralForeground3,
  },
})

export interface SidebarProps {
  onNodeDragStart?: (nodeType: NodeTypeDefinition, event: React.DragEvent) => void
  onNodeDragEnd?: (event: React.DragEvent) => void
}

export const Sidebar: React.FC<SidebarProps> = ({
  onNodeDragStart,
  onNodeDragEnd,
}) => {
  const styles = useStyles()
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedTab, setSelectedTab] = useState<TabValue>('all')
  
  const categories = useCategories()
  const nodeTypes = useNodeTypes()

  const getCategoryIcon = (categoryId: string) => {
    switch (categoryId) {
      case 'core':
        return <CircleRegular className={styles.categoryIcon} />
      case 'logic':
        return <BranchRegular className={styles.categoryIcon} />
      case 'math':
        return <CalculatorRegular className={styles.categoryIcon} />
      case 'string':
        return <TextTRegular className={styles.categoryIcon} />
      case 'flow':
        return <FlowRegular className={styles.categoryIcon} />
      case 'custom':
        return <CodeRegular className={styles.categoryIcon} />
      default:
        return <CircleRegular className={styles.categoryIcon} />
    }
  }

  const handleNodeDragStart = (nodeType: NodeTypeDefinition, event: React.DragEvent) => {
    event.dataTransfer.setData('application/reactflow', JSON.stringify(nodeType))
    event.dataTransfer.effectAllowed = 'move'
    onNodeDragStart?.(nodeType, event)
  }

  const handleNodeDragEnd = (event: React.DragEvent) => {
    onNodeDragEnd?.(event)
  }

  const filteredNodeTypes = nodeTypes.filter(nodeType => {
    const matchesSearch = nodeType.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         nodeType.description?.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesTab = selectedTab === 'all' || nodeType.category === selectedTab
    return matchesSearch && matchesTab
  })

  const filteredCategories = categories.filter(category => {
    return category.id === selectedTab || selectedTab === 'all'
  })

  return (
    <div className={styles.root}>
      {/* Header */}
      <div className={styles.header}>
        <Title3 className={styles.title}>Node Palette</Title3>
        <Caption1 className={styles.subtitle}>Drag nodes to create your workflow</Caption1>
        
        {/* Search */}
        <Input
          className={styles.search}
          placeholder="Search nodes..."
          contentBefore={<SearchRegular />}
          value={searchTerm}
          onChange={(_, data) => setSearchTerm(data.value)}
        />
      </div>

      {/* Content */}
      <div className={styles.content}>
        {/* Tabs */}
        <TabList
          className={styles.tabList}
          selectedValue={selectedTab}
          onTabSelect={(_, data) => setSelectedTab(data.value)}
        >
          <Tab value="all">All</Tab>
          {categories.map(category => (
            <Tab key={category.id} value={category.id}>
              {category.name}
            </Tab>
          ))}
        </TabList>

        {/* Tab Panels */}
        <div className={styles.tabPanel}>
          {filteredCategories.map(category => (
            <div key={category.id} className={styles.category}>
              <div className={styles.categoryHeader}>
                {getCategoryIcon(category.id)}
                <div>
                  <div className={styles.categoryTitle}>{category.name}</div>
                  <div className={styles.categoryDescription}>{category.description}</div>
                </div>
              </div>
              
              {filteredNodeTypes
                .filter(nodeType => nodeType.category === category.id)
                .map(nodeType => (
                  <div
                    key={nodeType.id}
                    className={styles.nodeType}
                    draggable
                    onDragStart={(event) => handleNodeDragStart(nodeType, event)}
                    onDragEnd={handleNodeDragEnd}
                  >
                    <div className={styles.nodeTypeHeader}>
                      <div style={{ display: 'flex', alignItems: 'center' }}>
                        {getCategoryIcon(nodeType.category)}
                        <span className={styles.nodeTypeTitle}>{nodeType.name}</span>
                      </div>
                    </div>
                    {nodeType.description && (
                      <div className={styles.nodeTypeDescription}>
                        {nodeType.description}
                      </div>
                    )}
                  </div>
                ))}
            </div>
          ))}
          
          {filteredNodeTypes.length === 0 && (
            <div className={styles.emptyState}>
              <p>No nodes found matching your search.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
} 