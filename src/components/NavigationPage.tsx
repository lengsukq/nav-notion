'use client'

import { useState, useEffect } from 'react'
import { Card, CardBody, CardHeader, Input, Button, Chip, Spinner, Alert, Link, Grid } from '@heroui/react'
import { Github, Search, Clock, ExternalLink, RefreshCw, HelpCircle, AlertCircle } from 'lucide-react'
import { NavigationItem } from '@/types'
import { loadCachedData, saveCachedData } from '@/lib/storage'

export function NavigationPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedTag, setSelectedTag] = useState('')
  const [navigationData, setNavigationData] = useState<NavigationItem[]>([])
  const [tags, setTags] = useState<string[]>([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [currentTime, setCurrentTime] = useState(new Date())

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  useEffect(() => {
    loadNavigationData()
  }, [])

  const loadNavigationData = async (useCache = true) => {
    try {
      setLoading(true)
      setError(null)

      // 尝试使用缓存
      if (useCache) {
        const cachedData = loadCachedData()
        if (cachedData && cachedData.data) {
          setNavigationData(cachedData.data)
          updateTags(cachedData.data)
          setLoading(false)
          return
        }
      }

      // 从 API 获取数据（使用环境变量）
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
      } else {
        throw new Error('No data received')
      }
    } catch (error) {
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
      setError(errorMessage)
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }

  const updateTags = (data: NavigationItem[]) => {
    const allTags = new Set<string>()
    data.forEach(item => {
      item.tags.forEach(tag => allTags.add(tag))
    })
    setTags(Array.from(allTags).sort())
  }

  const handleRefresh = async () => {
    setRefreshing(true)
    await loadNavigationData(false) // 强制刷新，不使用缓存
  }

  const filteredData = navigationData.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesTag = !selectedTag || item.tags.includes(selectedTag)
    return matchesSearch && matchesTag
  })

  const allTags = ['全部', ...tags]

  if (loading && navigationData.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center animate-gradient">
        <Card className="bg-white/10 backdrop-blur-sm border-white/20 p-8 shadow-2xl max-w-md w-full mx-4">
          <CardBody className="text-center">
            <div className="relative mb-8">
              <div className="w-20 h-20 mx-auto relative">
                <Spinner size="lg" color="secondary" className="absolute inset-0" />
                <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full blur-xl opacity-30 animate-pulse"></div>
                <div className="absolute inset-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full blur-lg opacity-20 animate-ping"></div>
              </div>
            </div>
            
            <h2 className="text-3xl font-bold text-white mb-3 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              正在加载导航数据...
            </h2>
            
            <p className="text-gray-300 mb-6 text-lg">正在从 Notion 获取您的导航数据</p>
            
            <div className="space-y-4">
              <div className="flex justify-center space-x-2">
                <div className="w-3 h-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full animate-bounce"></div>
                <div className="w-3 h-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                <div className="w-3 h-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
              </div>
              
              <div className="space-y-2">
                <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full animate-pulse" style={{width: '70%', animation: 'pulse 2s infinite'}}></div>
                </div>
                <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-blue-500 to-purple-600 rounded-full animate-pulse" style={{width: '50%', animation: 'pulse 2s infinite 0.5s'}}></div>
                </div>
                <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full animate-pulse" style={{width: '30%', animation: 'pulse 2s infinite 1s'}}></div>
                </div>
              </div>
            </div>
            
            <div className="mt-6 text-gray-400 text-sm">
              首次加载可能需要几秒钟时间
            </div>
          </CardBody>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Card className="bg-white/10 backdrop-blur-sm border-white/20 overflow-hidden">
            <CardBody className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg shadow-purple-500/25">
                    <span className="text-white font-bold text-xl">N</span>
                  </div>
                  <div>
                    <h1 className="text-4xl font-bold text-white bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                      导航管理
                    </h1>
                    <p className="text-gray-300 text-lg mt-1">基于 Notion 的导航管理系统</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <Button
                    isIconOnly
                    variant="flat"
                    color="secondary"
                    onPress={handleRefresh}
                    isLoading={refreshing}
                    className="text-gray-300"
                    size="lg"
                  >
                    <RefreshCw className="w-5 h-5" />
                  </Button>
                  
                  <Button
                    isIconOnly
                    variant="flat"
                    color="secondary"
                    as={Link}
                    href="https://github.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-300"
                    size="lg"
                  >
                    <Github className="w-5 h-5" />
                  </Button>
                  
                  <Button
                    isIconOnly
                    variant="flat"
                    color="secondary"
                    as={Link}
                    href="/setup"
                    className="text-gray-300"
                    size="lg"
                  >
                    <HelpCircle className="w-5 h-5" />
                  </Button>
                  
                  <Chip
                    startContent={<Clock className="w-4 h-4" />}
                    classNames={{
                      base: "bg-gradient-to-r from-purple-500/20 to-pink-500/20 backdrop-blur-sm border-purple-400/30",
                      content: "font-mono text-sm text-white"
                    }}
                    variant="bordered"
                  >
                    {currentTime.toLocaleTimeString('zh-CN', {
                      hour: '2-digit',
                      minute: '2-digit',
                      second: '2-digit'
                    })}
                  </Chip>
                </div>
              </div>
              
              {/* Stats Bar */}
              <div className="mt-6 pt-6 border-t border-white/10">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-6">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                      <span className="text-gray-300 text-sm">系统正常</span>
                    </div>
                    <div className="text-gray-400 text-sm">
                      共 <span className="text-white font-medium">{navigationData.length}</span> 个导航
                    </div>
                    <div className="text-gray-400 text-sm">
                      <span className="text-white font-medium">{tags.length}</span> 个标签
                    </div>
                  </div>
                  
                  {filteredData.length !== navigationData.length && (
                    <div className="text-gray-400 text-sm">
                      显示 <span className="text-white font-medium">{filteredData.length}</span> 个结果
                    </div>
                  )}
                </div>
              </div>
            </CardBody>
          </Card>
        </div>

        {/* Error Alert */}
        {error && (
          <Card className="mb-6 bg-gradient-to-r from-red-500/10 to-orange-500/10 backdrop-blur-sm border-red-400/30">
            <CardBody className="p-6">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-10 h-10 bg-red-500/20 rounded-full flex items-center justify-center">
                  <AlertCircle className="w-5 h-5 text-red-400" />
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-semibold text-white mb-2">获取数据失败</h3>
                  <p className="text-gray-300 mb-4">{error}</p>
                  
                  <div className="bg-black/20 rounded-lg p-4 mb-4">
                    <p className="text-gray-300 mb-3">请检查以下配置：</p>
                    <ul className="space-y-2">
                      <li className="flex items-start gap-2">
                        <div className="w-1.5 h-1.5 bg-red-400 rounded-full mt-2 flex-shrink-0"></div>
                        <span className="text-gray-400 text-sm">确保已正确设置环境变量 NOTION_TOKEN 和 NOTION_DATABASE_ID</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <div className="w-1.5 h-1.5 bg-red-400 rounded-full mt-2 flex-shrink-0"></div>
                        <span className="text-gray-400 text-sm">确认 Notion 集成有访问数据库的权限</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <div className="w-1.5 h-1.5 bg-red-400 rounded-full mt-2 flex-shrink-0"></div>
                        <span className="text-gray-400 text-sm">检查数据库结构是否符合要求</span>
                      </li>
                    </ul>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <Button
                      color="danger"
                      variant="bordered"
                      startContent={<RefreshCw className="w-4 h-4" />}
                      onPress={handleRefresh}
                    >
                      重新加载
                    </Button>
                    
                    <Button
                      color="secondary"
                      variant="flat"
                      as={Link}
                      href="/setup"
                    >
                      查看配置指南
                    </Button>
                  </div>
                </div>
              </div>
            </CardBody>
          </Card>
        )}

        {/* Search and Filters */}
        <Card className="mb-6 bg-white/10 backdrop-blur-sm border-white/20">
          <CardBody>
            <div className="flex flex-col gap-6">
              <Input
                placeholder="搜索导航..."
                value={searchTerm}
                onValueChange={setSearchTerm}
                startContent={
                  <Search className="w-5 h-5 text-gray-400" />
                }
                endContent={
                  searchTerm && (
                    <Button
                      isIconOnly
                      size="sm"
                      variant="light"
                      onPress={() => setSearchTerm('')}
                      className="text-gray-400 hover:text-white"
                    >
                      ×
                    </Button>
                  )
                }
                classNames={{
                  input: 'text-white placeholder:text-gray-400 text-lg',
                  inputWrapper: 'bg-white/10 border-white/20 hover:bg-white/15 focus-within:bg-white/15 transition-colors duration-200'
                }}
                size="lg"
              />
              
              <div className="flex flex-col gap-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-white font-medium">标签筛选</h3>
                  {selectedTag && (
                    <Button
                      size="sm"
                      color="secondary"
                      variant="flat"
                      onPress={() => setSelectedTag('')}
                      className="text-xs"
                    >
                      清除
                    </Button>
                  )}
                </div>
                
                <div className="flex flex-wrap gap-2">
                  {allTags.map(tag => (
                    <Chip
                      key={tag}
                      onClick={() => setSelectedTag(tag === '全部' ? '' : tag)}
                      color={selectedTag === tag || (tag === '全部' && !selectedTag) ? 'secondary' : 'default'}
                      variant={selectedTag === tag || (tag === '全部' && !selectedTag) ? 'solid' : 'bordered'}
                      className="cursor-pointer transition-all duration-200 hover:scale-105"
                      classNames={{
                        base: selectedTag === tag || (tag === '全部' && !selectedTag) 
                          ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white border-transparent" 
                          : "bg-white/10 text-gray-300 border-white/20 hover:bg-white/20"
                      }}
                    >
                      {tag}
                    </Chip>
                  ))}
                </div>
              </div>
            </div>
          </CardBody>
        </Card>

        {/* Navigation Cards */}
        {filteredData.length === 0 && !loading ? (
          <Card className="bg-white/10 backdrop-blur-sm border-white/20">
            <CardBody className="text-center py-12">
              <div className="flex flex-col items-center gap-4">
                <div className="w-16 h-16 bg-gradient-to-r from-gray-600 to-gray-700 rounded-full flex items-center justify-center">
                  <Search className="w-8 h-8 text-gray-300" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-white mb-2">没有找到匹配的导航项目</h3>
                  <p className="text-gray-400">尝试调整搜索关键词或筛选标签</p>
                </div>
                <Button
                  color="secondary"
                  variant="bordered"
                  onPress={() => {
                    setSearchTerm('')
                    setSelectedTag('')
                  }}
                >
                  清除筛选条件
                </Button>
              </div>
            </CardBody>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredData.map(item => (
              <Card 
                key={item.id} 
                className="bg-white/10 backdrop-blur-sm border-white/20 hover:bg-white/20 transition-all duration-300 cursor-pointer group hover:shadow-xl hover:shadow-purple-500/20 hover:scale-[1.02] hover:border-purple-400/30 p-4"
                isPressable
                as={Link}
                href={item.url}
                target="_blank"
                rel="noopener noreferrer"
              >
                <div className="flex flex-col h-full">
                  <div className="flex items-start justify-between mb-3">
                    <div className="text-4xl group-hover:scale-110 transition-transform duration-300">
                      {item.icon || '🌐'}
                    </div>
                    <Button
                      isIconOnly
                      size="sm"
                      variant="light"
                      className="text-gray-400 group-hover:text-white opacity-0 group-hover:opacity-100 transition-all duration-300"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </Button>
                  </div>
                  
                  <h3 className="text-xl font-bold text-white mb-2 group-hover:text-purple-300 transition-colors duration-300">
                    {item.title}
                  </h3>
                  
                  <p className="text-gray-300 text-sm mb-4 line-clamp-2">
                    {item.description}
                  </p>
                  
                  <div className="flex flex-wrap gap-1 mb-3">
                    {item.tags.map(tag => (
                      <Chip 
                        key={tag} 
                        size="sm" 
                        variant="flat" 
                        color="secondary"
                        classNames={{
                          base: "bg-purple-500/20 text-purple-300 border-purple-500/30"
                        }}
                      >
                        {tag}
                      </Chip>
                    ))}
                  </div>
                  
                  {item.category && (
                    <div className="mt-auto">
                      <Chip 
                        size="sm" 
                        variant="flat" 
                        color="primary"
                        startContent={
                          <div className="w-2 h-2 bg-blue-400 rounded-full" />
                        }
                        classNames={{
                          base: "bg-blue-500/20 text-blue-300 border-blue-500/30"
                        }}
                      >
                        {item.category}
                      </Chip>
                    </div>
                  )}
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}