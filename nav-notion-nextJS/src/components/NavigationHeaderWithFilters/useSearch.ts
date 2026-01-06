/**
 * 搜索功能 Hook
 */
import { useState, useEffect, useRef, useCallback, useMemo } from 'react'
import { SEARCH_CONFIG } from './searchConfig'

interface UseSearchOptions {
  onSearch?: (query: string) => void
}

export interface UseSearchReturn {
  searchQuery: string
  setSearchQuery: (query: string) => void
  isFocused: boolean
  selectedEngine: string
  currentEngine: typeof SEARCH_CONFIG[string]
  showHistory: boolean
  filteredHistory: string[]
  isEngineDropdownOpen: boolean
  setIsEngineDropdownOpen: (open: boolean) => void
  inputRef: React.RefObject<HTMLInputElement | null>
  containerRef: React.RefObject<HTMLDivElement | null>
  historyRef: React.RefObject<HTMLDivElement | null>
  searchContainerRef: React.RefObject<HTMLDivElement | null>
  handleSelectEngine: (key: string) => void
  executeSearch: () => void
  selectHistory: (item: string) => void
  clearHistory: () => void
  handleFocus: () => void
  handleBlur: () => void
  handleKeyDown: (e: React.KeyboardEvent) => void
}

export function useSearch({ onSearch }: UseSearchOptions = {}) {
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

    setSearchQuery('')
    setShowHistory(false)
    if (inputRef.current) {
      inputRef.current.blur()
    }
  }, [searchQuery, currentEngine, onSearch, saveHistory])

  // 选择历史记录
  const selectHistory = useCallback((item: string) => {
    setSearchQuery(item)
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
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
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

  const shouldShowHistory = Boolean(showHistory && (filteredHistory.length > 0 || searchQuery))

  return {
    searchQuery,
    setSearchQuery,
    isFocused,
    selectedEngine,
    currentEngine,
    showHistory: shouldShowHistory,
    filteredHistory,
    isEngineDropdownOpen,
    setIsEngineDropdownOpen,
    inputRef,
    containerRef,
    historyRef,
    searchContainerRef,
    handleSelectEngine,
    executeSearch,
    selectHistory,
    clearHistory,
    handleFocus,
    handleBlur,
    handleKeyDown
  }
}

