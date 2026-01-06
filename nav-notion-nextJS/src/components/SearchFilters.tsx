'use client'

import { useState, useEffect, useRef, useCallback, useMemo } from 'react'
import { Card, CardBody, Button, Chip, Input, Dropdown, DropdownTrigger, DropdownMenu, DropdownItem } from '@heroui/react'
import { Pagination } from '@heroui/react'
import { Search, ChevronDown, X, Clock } from 'lucide-react'

// 搜索引擎配置类型
interface SearchEngineConfig {
  name: string
  shortName: string
  icon?: string
  type: 'external' | 'event'
  url?: string
  eventName?: string
}

// 搜索引擎配置
const SEARCH_CONFIG: Record<string, SearchEngineConfig> = {
  bing: { name: 'Bing', shortName: 'Bing', type: 'external', url: 'https://www.bing.com/search?q=' },
  google: { name: 'Google', shortName: 'Google', type: 'external', url: 'https://www.google.com/search?q=' },
  yahoo: { name: 'Yahoo', shortName: 'Yahoo', type: 'external', url: 'https://search.yahoo.com/search?p=' },
  duck: { name: 'Duck', shortName: 'Duck', type: 'external', url: 'https://duckduckgo.com/?q=' },
  baidu: { name: '百度', shortName: '百度', type: 'external', url: 'https://www.baidu.com/s?wd=' },
  mieta: { name: '密塔', shortName: '密塔', type: 'external', url: 'https://metaso.cn/?q=' },
  notion: { name: 'Notion', shortName: 'Notion', type: 'event', eventName: 'search' }
}

interface SearchFiltersProps {
  selectedTag: string
  tags: string[]
  filteredCount: number
  originalCount: number
  currentPage: number
  totalPages: number
  itemsPerPage: number
  onTagChange: (tag: string) => void
  onClearFilters: () => void
  onPageChange: (page: number) => void
  onSearch?: (query: string) => void
}

export function SearchFilters({
  selectedTag,
  tags,
  filteredCount,
  originalCount,
  currentPage,
  totalPages,
  itemsPerPage,
  onTagChange,
  onClearFilters,
  onPageChange,
  onSearch
}: SearchFiltersProps) {
  const allTags = ['全部', ...tags]

  // 搜索相关状态
  const [searchQuery, setSearchQuery] = useState('')
  const [isFocused, setIsFocused] = useState(false)
  const [selectedEngine, setSelectedEngine] = useState<string>('bing')
  const [showHistory, setShowHistory] = useState(false)
  const [searchHistory, setSearchHistory] = useState<string[]>([])
  const [isEngineDropdownOpen, setIsEngineDropdownOpen] = useState(false)
  
  const inputRef = useRef<HTMLInputElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const historyRef = useRef<HTMLDivElement>(null)
  const searchContainerRef = useRef<HTMLDivElement>(null)

  // 当前搜索引擎
  const currentEngine = useMemo(() => {
    return SEARCH_CONFIG[selectedEngine] || SEARCH_CONFIG.bing
  }, [selectedEngine])

  // 加载搜索引擎偏好
  useEffect(() => {
    const saved = localStorage.getItem('preferredSearchEngine')
    if (saved && SEARCH_CONFIG[saved]) {
      setSelectedEngine(saved)
    }
  }, [])

  // 加载搜索历史
  useEffect(() => {
    try {
      const history = JSON.parse(localStorage.getItem('searchHistory') || '[]')
      setSearchHistory(Array.isArray(history) ? history : [])
    } catch (e) {
      setSearchHistory([])
    }
  }, [])

  // 保存搜索历史
  const saveHistory = useCallback((query: string) => {
    if (!query || !query.trim()) return
    const next = [query, ...searchHistory.filter(h => h !== query)].slice(0, 10)
    setSearchHistory(next)
    localStorage.setItem('searchHistory', JSON.stringify(next))
  }, [searchHistory])

  // 过滤历史记录
  const filteredHistory = useMemo(() => {
    const q = searchQuery.trim().toLowerCase()
    if (!q) return searchHistory
    return searchHistory.filter(item => item.toLowerCase().includes(q))
  }, [searchQuery, searchHistory])

  // 选择搜索引擎
  const handleSelectEngine = useCallback((key: string) => {
    setSelectedEngine(key)
    localStorage.setItem('preferredSearchEngine', key)
    setIsEngineDropdownOpen(false)
  }, [])

  // 执行搜索
  const executeSearch = useCallback(() => {
    const query = searchQuery.trim()
    if (!query) return

    const config = currentEngine

    if (config.type === 'event' && config.eventName === 'search' && onSearch) {
      onSearch(query)
      saveHistory(query)
    } else if (config.type === 'external' && config.url) {
      window.open(config.url + encodeURIComponent(query), '_blank')
      saveHistory(query)
    }

    // 重置 UI 状态
    setSearchQuery('')
    setShowHistory(false)
    if (inputRef.current) {
      inputRef.current.blur()
    }
  }, [searchQuery, currentEngine, onSearch, saveHistory])

  // 选择历史记录
  const selectHistory = useCallback((item: string) => {
    setSearchQuery(item)
    // 延迟执行搜索，确保状态更新
    setTimeout(() => {
      const config = currentEngine
      if (config.type === 'event' && config.eventName === 'search' && onSearch) {
        onSearch(item)
      } else if (config.type === 'external' && config.url) {
        window.open(config.url + encodeURIComponent(item), '_blank')
      }
      saveHistory(item)
      setSearchQuery('')
      setShowHistory(false)
    }, 0)
  }, [currentEngine, onSearch, saveHistory])

  // 清除历史记录
  const clearHistory = useCallback(() => {
    setSearchHistory([])
    localStorage.removeItem('searchHistory')
    setShowHistory(false)
  }, [])

  // 处理输入框焦点
  const handleFocus = useCallback(() => {
    setIsFocused(true)
    setShowHistory(true)
  }, [])

  const handleBlur = useCallback(() => {
    setIsFocused(false)
    // 延迟关闭以允许点击历史项
    setTimeout(() => {
      if (!isEngineDropdownOpen) {
        setShowHistory(false)
      }
    }, 150)
  }, [isEngineDropdownOpen])

  // 处理键盘事件
  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      executeSearch()
    }
  }, [executeSearch])

  // 点击外部关闭历史记录
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(event.target as Node)) {
        if (!isEngineDropdownOpen) {
          setShowHistory(false)
        }
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isEngineDropdownOpen])

  const shouldShowHistory = showHistory && (filteredHistory.length > 0 || searchQuery)

  return (
    <div className="sticky top-2 md:top-4 z-40 mb-4 md:mb-6">
      <Card className="bg-white/10 backdrop-blur-xl border-white/20 shadow-2xl shadow-white/10">
        <CardBody className="p-3 md:p-4">
          {/* 搜索框 */}
          <div 
            ref={searchContainerRef}
            className={`
              flex items-center gap-2 md:gap-3 mb-3 md:mb-4
              bg-white/10 dark:bg-white/5 backdrop-blur-xl backdrop-saturate-150
              border border-white/20 dark:border-white/10
              rounded-2xl md:rounded-3xl p-2 md:p-3
              shadow-xl transition-all duration-500
              ${isFocused ? 'bg-white/15 dark:bg-white/10 shadow-[0_12px_40px_rgba(var(--primary-color-rgb),0.25)] border-[var(--primary-color)]/40 scale-[1.01]' : 'hover:scale-[1.005]'}
            `}
          >
            {/* 搜索引擎选择器 */}
            <Dropdown
              isOpen={isEngineDropdownOpen}
              onOpenChange={setIsEngineDropdownOpen}
              placement="bottom-start"
            >
              <DropdownTrigger>
                <Button
                  variant="flat"
                  className="bg-white/20 dark:bg-white/10 backdrop-blur-md border border-white/30 dark:border-white/20 min-w-fit px-2 md:px-3 h-8 md:h-9 rounded-xl md:rounded-2xl font-semibold text-xs text-foreground hover:bg-white/30 dark:hover:bg-white/15 transition-all duration-300"
                >
                  <span className="hidden sm:inline">{currentEngine.name}</span>
                  <span className="sm:hidden">{currentEngine.shortName}</span>
                  <ChevronDown className={`w-3 h-3 ml-1 transition-transform duration-300 ${isEngineDropdownOpen ? 'rotate-180' : ''}`} />
                </Button>
              </DropdownTrigger>
              <DropdownMenu
                aria-label="搜索引擎选择"
                onAction={(key) => handleSelectEngine(key as string)}
                classNames={{
                  base: 'bg-white/90 dark:bg-default-100/90 backdrop-blur-xl border border-default-200 rounded-xl shadow-lg min-w-[120px]'
                }}
              >
                {Object.entries(SEARCH_CONFIG).map(([key, config]) => (
                  <DropdownItem
                    key={key}
                    className={selectedEngine === key ? 'bg-primary/10 text-primary font-semibold' : 'text-foreground hover:bg-primary/10 data-[hover=true]:text-primary'}
                  >
                    {config.name}
                  </DropdownItem>
                ))}
              </DropdownMenu>
            </Dropdown>

            {/* 搜索输入框 */}
            <div className="flex-1 relative">
              <Input
                ref={inputRef}
                value={searchQuery}
                onValueChange={setSearchQuery}
                onFocus={handleFocus}
                onBlur={handleBlur}
                onKeyDown={handleKeyDown}
                placeholder="搜索..."
                endContent={
                  searchQuery && (
                    <Button
                      isIconOnly
                      size="sm"
                      variant="light"
                      onPress={() => setSearchQuery('')}
                      className="text-default-500 hover:text-primary min-w-5 w-5 h-5"
                    >
                      <X className="w-3 h-3" />
                    </Button>
                  )
                }
                classNames={{
                  input: 'text-foreground placeholder:text-default-500 text-xs md:text-sm',
                  inputWrapper: 'bg-transparent border-none shadow-none hover:bg-transparent focus-within:bg-transparent h-8 md:h-9'
                }}
                size="sm"
              />

              {/* 搜索历史下拉 */}
              {shouldShowHistory && (
                <div 
                  ref={historyRef}
                  className="absolute top-full left-0 right-0 mt-2 bg-white/90 dark:bg-default-100/90 backdrop-blur-xl border border-default-200 rounded-xl shadow-lg z-50 overflow-hidden"
                >
                  {filteredHistory.length > 0 ? (
                    <>
                      <div className="flex items-center justify-between px-4 py-2 border-b border-default-200">
                        <span className="text-xs text-default-600 dark:text-default-500">搜索历史</span>
                        <Button
                          size="sm"
                          variant="light"
                          onPress={clearHistory}
                          className="text-xs h-5 text-primary hover:text-secondary"
                        >
                          清除
                        </Button>
                      </div>
                      <div className="max-h-[200px] overflow-y-auto">
                        {filteredHistory.map((item, index) => (
                          <div
                            key={index}
                            onClick={() => selectHistory(item)}
                            className="px-4 py-2 cursor-pointer text-sm text-foreground hover:bg-primary/10 hover:text-primary transition-all duration-200 flex items-center gap-2"
                          >
                            <Clock className="w-4 h-4 text-default-400" />
                            {item}
                          </div>
                        ))}
                      </div>
                    </>
                  ) : (
                    <div className="px-4 py-3 text-center text-sm text-default-500">
                      {searchQuery ? `搜索 "${searchQuery}"` : '暂无搜索历史'}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* 搜索按钮 */}
            <Button
              isIconOnly
              variant="flat"
              color="primary"
              onPress={executeSearch}
              className="bg-primary/10 hover:bg-primary/20 text-primary border border-primary/20 h-8 md:h-9 w-8 md:w-9 rounded-xl md:rounded-2xl transition-all duration-300 hover:scale-110"
              size="sm"
              style={{
                backgroundColor: 'rgba(var(--primary-color-rgb), 0.1)'
              }}
            >
              <Search className="w-4 h-4" style={{ color: 'var(--primary-color)' }} />
            </Button>
          </div>

          {/* 标签筛选区域 */}
          <div className="w-full">
              <div className="flex flex-col gap-2 md:gap-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 md:gap-3">
                    <h3 className="text-foreground font-medium text-xs md:text-sm">标签筛选</h3>
                    <Chip
                      size="sm"
                      variant="flat"
                      className="text-xs h-5"
                    >
                      {tags.length} 个
                    </Chip>
                  </div>
                  {selectedTag && (
                    <Button
                      size="sm"
                      color="primary"
                      variant="solid"
                      onPress={onClearFilters}
                      className="text-xs h-6 md:h-7 px-1.5 md:px-2"
                      style={{
                        backgroundColor: 'var(--primary-color)',
                        color: 'white'
                      }}
                    >
                      清除
                    </Button>
                  )}
                </div>
                
                {/* 标签云 */}
                <div className="flex flex-wrap gap-1 md:gap-1.5">
                  {allTags.map((tag, index) => {
                    const isActive = selectedTag === tag || (tag === '全部' && !selectedTag)
                    return (
                      <Chip
                        key={tag}
                        onClick={() => onTagChange(tag === '全部' ? '' : tag)}
                        color={isActive ? 'secondary' : 'default'}
                        variant={isActive ? 'solid' : 'bordered'}
                        className={`cursor-pointer transition-all duration-300 hover:scale-105 text-xs ${
                          isActive 
                            ? 'text-white border-transparent shadow-lg' 
                            : 'bg-default-100/30 text-default-700 border-default-200 hover:bg-default-100/50 hover:border-default-300'
                        }`}
                        style={isActive ? {
                          background: `linear-gradient(to right, var(--primary-color), var(--secondary-color))`,
                          boxShadow: `0 10px 15px -3px rgba(var(--primary-color-rgb), 0.25)`,
                          animationDelay: `${index * 50}ms`
                        } : {
                          animationDelay: `${index * 50}ms`
                        }}
                        size="sm"
                      >
                        {tag}
                      </Chip>
                    )
                  })}
                </div>
              </div>
          </div>
          

          {/* 分页组件 */}
          {totalPages > 1 && (
            <div className="flex justify-center mt-4 pt-3 border-t border-default-200">
              <Pagination
                total={totalPages}
                page={currentPage}
                onChange={onPageChange}
                showControls
                showShadow={false}
                color="primary"
                size="sm"
                classNames={{
                  item: [
                    "bg-default-100/50 text-default-700 border-default-200",
                    "hover:bg-default-100 hover:text-foreground hover:border-primary",
                    "data-[active=true]:text-white data-[active=true]:border-transparent",
                    "transition-all duration-200"
                  ].join(" "),
                  cursor: "[&>span]:bg-gradient-to-r [&>span]:from-[var(--primary-color)] [&>span]:to-[var(--secondary-color)]",
                  prev: "bg-default-100/30 text-default-600 hover:bg-default-100/50 hover:border-primary hover:text-primary border-default-200",
                  next: "bg-default-100/30 text-default-600 hover:bg-default-100/50 hover:border-primary hover:text-primary border-default-200"
                }}
              />
            </div>
          )}
        </CardBody>
      </Card>
    </div>
  )
}