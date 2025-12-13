'use client'

import { useState, useEffect, useCallback } from 'react'
import { NavigationItem } from '@/lib/notion'
import { loadCachedData, saveCachedData } from '@/lib/storage'

export interface UseNavigationDataReturn {
  navigationData: NavigationItem[]
  tags: string[]
  loading: boolean
  refreshing: boolean
  error: string | null
  currentTime: Date
  loadingProgress: number
  totalItems: number
  filteredData: NavigationItem[]
  searchTerm: string
  selectedTag: string
  handleRefresh: () => Promise<void>
  setSearchTerm: (term: string) => void
  setSelectedTag: (tag: string) => void
  clearFilters: () => void
}

export function useNavigationData(): UseNavigationDataReturn {
  const [navigationData, setNavigationData] = useState<NavigationItem[]>([])
  const [tags, setTags] = useState<string[]>([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [currentTime, setCurrentTime] = useState(new Date())
  const [loadingProgress, setLoadingProgress] = useState(0)
  const [totalItems, setTotalItems] = useState(0)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedTag, setSelectedTag] = useState('')

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  useEffect(() => {
    loadNavigationData()
  }, [])

  const updateTags = useCallback((data: NavigationItem[]) => {
    const allTags = new Set<string>()
    data.forEach(item => {
      item.tags.forEach(tag => allTags.add(tag))
    })
    setTags(Array.from(allTags).sort())
  }, [])

  const handleError = useCallback((error: unknown): string => {
    console.error('Error loading navigation data:', error)
    console.error('Error details:', error instanceof Error ? {
      message: error.message,
      stack: error.stack?.substring(0, 1000)
    } : error)
    
    let errorMessage = '加载数据失败'
    if (error instanceof Error) {
      if (error.message.includes('Failed to fetch')) {
        errorMessage = '网络请求失败，请检查网络连接'
      } else if (error.message.includes('Failed to fetch navigation items from Notion')) {
        errorMessage = '无法从 Notion 获取数据，请检查数据库配置'
      } else {
        errorMessage = error.message
      }
    }
    return errorMessage
  }, [])

  const loadNavigationData = useCallback(async (useCache = true) => {
    try {
      setLoading(true)
      setError(null)
      setLoadingProgress(0)

      if (useCache) {
        const cachedData = loadCachedData()
        if (cachedData && cachedData.data) {
          setNavigationData(cachedData.data)
          updateTags(cachedData.data)
          setLoading(false)
          return
        }
      }

      const response = await fetch('/api/navigation')

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to fetch navigation data')
      }

      const result = await response.json()
      
      if (result.data) {
        setNavigationData(result.data)
        updateTags(result.data)
        saveCachedData(result)
        setTotalItems(result.count)
        setLoadingProgress(100)
      } else {
        throw new Error('No data received')
      }
    } catch (error) {
      setError(handleError(error))
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }, [updateTags, handleError])

  const handleRefresh = useCallback(async () => {
    setRefreshing(true)
    await loadNavigationData(false)
  }, [loadNavigationData])

  const clearFilters = useCallback(() => {
    setSearchTerm('')
    setSelectedTag('')
  }, [])

  const filteredData = navigationData.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesTag = !selectedTag || item.tags.includes(selectedTag)
    return matchesSearch && matchesTag
  })

  return {
    navigationData,
    tags,
    loading,
    refreshing,
    error,
    currentTime,
    loadingProgress,
    totalItems,
    filteredData,
    searchTerm,
    selectedTag,
    handleRefresh,
    setSearchTerm,
    setSelectedTag,
    clearFilters
  }
}