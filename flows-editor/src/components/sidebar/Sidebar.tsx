import React, { useState, useRef, useEffect } from 'react'
import {
  Title3,
  Caption1,
  Input,
  makeStyles,
  tokens,
  TabList,
  Tab,
  TabValue,
  Button,
} from '@fluentui/react-components'
import {
  CircleRegular,
  BranchRegular,
  CalculatorRegular,
  TextTRegular,
  FlowRegular,
  CodeRegular,
  SearchRegular,
  ChevronLeftRegular,
  ChevronRightRegular,
} from '@fluentui/react-icons'
import type { NodeTypeDefinition } from '../../types'
import { useCategories, useNodeTypes } from '../../store'

const useStyles = makeStyles({
  root: {
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
  tabContainer: {
    position: 'relative',
    borderBottom: `1px solid ${tokens.colorNeutralStroke2}`,
    backgroundColor: tokens.colorNeutralBackground1,
  },
  tabList: {
    overflow: 'hidden',
    scrollBehavior: 'smooth',
    '&::-webkit-scrollbar': {
      display: 'none',
    },
    scrollbarWidth: 'none',
    msOverflowStyle: 'none',
  },
  scrollButton: {
    position: 'absolute',
    top: '50%',
    transform: 'translateY(-50%)',
    zIndex: 1,
    minWidth: '32px',
    height: '32px',
    padding: '4px',
    backgroundColor: tokens.colorNeutralBackground1,
    border: `1px solid ${tokens.colorNeutralStroke2}`,
    borderRadius: tokens.borderRadiusSmall,
    boxShadow: tokens.shadow4,
    '&:hover': {
      backgroundColor: tokens.colorNeutralBackground2,
    },
    '&:disabled': {
      opacity: 0.3,
      cursor: 'not-allowed',
    },
  },
  scrollButtonLeft: {
    left: '4px',
  },
  scrollButtonRight: {
    right: '4px',
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
  width?: number
}

/**
 * Sidebar Component with Intelligent Tab Navigation
 * 
 * Features:
 * - Automatic overflow detection for category tabs
 * - Scrollable tabs with navigation arrows
 * - Keyboard navigation (arrow keys)
 * - Touch/swipe support for mobile devices
 * - Auto-scroll to selected tab
 * - Responsive to window resizing
 * - Configurable sidebar width
 * 
 * @param onNodeDragStart - Callback when node drag starts
 * @param onNodeDragEnd - Callback when node drag ends
 * @param width - Sidebar width in pixels (default: 280)
 */
export const Sidebar: React.FC<SidebarProps> = ({
  onNodeDragStart,
  onNodeDragEnd,
  width = 280,
}) => {
  const styles = useStyles()
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedTab, setSelectedTab] = useState<TabValue>('all')
  const [showScrollButtons, setShowScrollButtons] = useState(false)
  const [canScrollLeft, setCanScrollLeft] = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(false)
  const [touchStartX, setTouchStartX] = useState<number | null>(null)
  
  const tabListRef = useRef<HTMLDivElement>(null)
  const categories = useCategories()
  const nodeTypes = useNodeTypes()

  // Check if scroll buttons are needed
  useEffect(() => {
    const checkScrollButtons = () => {
      if (tabListRef.current) {
        const { scrollLeft, scrollWidth, clientWidth } = tabListRef.current
        setCanScrollLeft(scrollLeft > 0)
        setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 1)
        setShowScrollButtons(scrollWidth > clientWidth)
      }
    }

    checkScrollButtons()
    window.addEventListener('resize', checkScrollButtons)
    return () => window.removeEventListener('resize', checkScrollButtons)
  }, [categories])

  // Auto-scroll to selected tab when it changes
  useEffect(() => {
    if (tabListRef.current && selectedTab !== 'all') {
      const tabElement = tabListRef.current.querySelector(`[data-value="${selectedTab}"]`) as HTMLElement
      if (tabElement) {
        const container = tabListRef.current
        const tabRect = tabElement.getBoundingClientRect()
        const containerRect = container.getBoundingClientRect()
        
        // Check if tab is outside visible area
        if (tabRect.left < containerRect.left || tabRect.right > containerRect.right) {
          tabElement.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' })
        }
      }
    }
  }, [selectedTab])

  const scrollTabs = (direction: 'left' | 'right') => {
    if (tabListRef.current) {
      const scrollAmount = 200 // Adjust scroll amount as needed
      const newScrollLeft = tabListRef.current.scrollLeft + (direction === 'left' ? -scrollAmount : scrollAmount)
      tabListRef.current.scrollTo({ left: newScrollLeft, behavior: 'smooth' })
    }
  }

  // Keyboard navigation
  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
      event.preventDefault()
      const currentIndex = categories.findIndex(cat => cat.id === selectedTab)
      const allTabs = ['all', ...categories.map(cat => cat.id)]
      const currentTabIndex = allTabs.indexOf(selectedTab as string)
      
      if (event.key === 'ArrowLeft' && currentTabIndex > 0) {
        setSelectedTab(allTabs[currentTabIndex - 1])
      } else if (event.key === 'ArrowRight' && currentTabIndex < allTabs.length - 1) {
        setSelectedTab(allTabs[currentTabIndex + 1])
      }
    }
  }

  // Touch/swipe support
  const handleTouchStart = (event: React.TouchEvent) => {
    setTouchStartX(event.touches[0].clientX)
  }

  const handleTouchEnd = (event: React.TouchEvent) => {
    if (touchStartX === null) return
    
    const touchEndX = event.changedTouches[0].clientX
    const diff = touchStartX - touchEndX
    const threshold = 50 // Minimum swipe distance
    
    if (Math.abs(diff) > threshold) {
      if (diff > 0) {
        // Swiped left - scroll right
        scrollTabs('right')
      } else {
        // Swiped right - scroll left
        scrollTabs('left')
      }
    }
    
    setTouchStartX(null)
  }

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
    <div className={styles.root} style={{ width: `${width}px` }}>
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
        {/* Scrollable Tabs */}
        <div className={styles.tabContainer}>
          {showScrollButtons && (
            <Button
              className={`${styles.scrollButton} ${styles.scrollButtonLeft}`}
              appearance="subtle"
              icon={<ChevronLeftRegular />}
              disabled={!canScrollLeft}
              onClick={() => scrollTabs('left')}
              title="Scroll left"
            />
          )}
          
          <TabList
            ref={tabListRef}
            className={styles.tabList}
            selectedValue={selectedTab}
            onTabSelect={(_, data) => setSelectedTab(data.value)}
            onScroll={() => {
              // Update scroll button states when scrolling
              if (tabListRef.current) {
                const { scrollLeft, scrollWidth, clientWidth } = tabListRef.current
                setCanScrollLeft(scrollLeft > 0)
                setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 1)
              }
            }}
            onKeyDown={handleKeyDown}
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
          >
            <Tab value="all">All</Tab>
            {categories.map(category => (
              <Tab key={category.id} value={category.id}>
                {category.name}
              </Tab>
            ))}
          </TabList>

          {showScrollButtons && (
            <Button
              className={`${styles.scrollButton} ${styles.scrollButtonRight}`}
              appearance="subtle"
              icon={<ChevronRightRegular />}
              disabled={!canScrollRight}
              onClick={() => scrollTabs('right')}
              title="Scroll right"
            />
          )}
        </div>

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