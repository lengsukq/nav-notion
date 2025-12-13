'use client'

import { useState, useEffect } from 'react'
import { Card, CardBody, CardHeader, Input, Button, Chip, Spinner, Alert, Link } from '@heroui/react'
import { Github, Search, Clock, ExternalLink, RefreshCw, HelpCircle, AlertCircle } from 'lucide-react'
import { NavigationItem } from '@/lib/notion'
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
  const [loadingProgress, setLoadingProgress] = useState(0)
  const [totalItems, setTotalItems] = useState(0)

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
      setLoadingProgress(0)

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
        setTotalItems(result.count)
        setLoadingProgress(100)
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
            
            <p className="text-gray-300 mb-6 text-lg">
              {totalItems > 0 ? `已加载 ${navigationData.length} / ${totalItems} 个导航项目` : '正在从 Notion 获取您的导航数据'}
            </p>
            
            <div className="space-y-4">
              <div className="flex justify-center space-x-2">
                <div className="w-3 h-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full animate-bounce"></div>
                <div className="w-3 h-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                <div className="w-3 h-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
              </div>
              
              {/* 进度条 */}
              {totalItems > 0 && (
                <div className="space-y-3">
                  <div className="flex justify-between text-sm text-gray-400">
                    <span>加载进度</span>
                    <span>{Math.round((navigationData.length / totalItems) * 100)}%</span>
                  </div>
                  <div className="h-3 bg-white/10 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full transition-all duration-500 ease-out"
                      style={{width: `${(navigationData.length / totalItems) * 100}%`}}
                    ></div>
                  </div>
                  <div className="text-center text-xs text-gray-500">
                    {navigationData.length} / {totalItems} 个项目已加载
                  </div>
                </div>
              )}
              
              {/* 动画加载条 */}
              {totalItems === 0 && (
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
              )}
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

        {/* Search and Filters - Sticky */}
        <div className="sticky top-2 md:top-4 z-50 mb-4 md:mb-6">
          <Card className="bg-white/10 backdrop-blur-xl border-white/20 shadow-2xl shadow-black/20 mx-2 md:mx-0">
            <CardBody className="p-3 md:p-4">
              {/* 桌面端：水平布局，移动端：垂直布局 */}
              <div className="flex flex-col lg:flex-row gap-3 md:gap-4">
                {/* 左侧：搜索输入框 */}
                <div className="w-full lg:w-1/3">
                  <div className="relative">
                    <Input
                      placeholder="搜索导航..."
                      value={searchTerm}
                      onValueChange={setSearchTerm}
                      startContent={
                        <Search className="w-4 h-4 md:w-5 md:h-5 text-gray-400" />
                      }
                      endContent={
                        searchTerm && (
                          <Button
                            isIconOnly
                            size="sm"
                            variant="light"
                            onPress={() => setSearchTerm('')}
                            className="text-gray-400 hover:text-white min-w-7 w-7 h-7 md:min-w-8 md:w-8 md:h-8"
                          >
                            ×
                          </Button>
                        )
                      }
                      classNames={{
                        input: 'text-white placeholder:text-gray-400 text-sm md:text-base',
                        inputWrapper: 'bg-white/10 border-white/20 hover:bg-white/15 focus-within:bg-white/15 focus-within:border-purple-400/50 transition-all duration-200 h-10 md:h-12'
                      }}
                      size="lg"
                    />
                    {/* 搜索框光效 */}
                    {searchTerm && (
                      <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-lg blur-xl -z-10 animate-pulse"></div>
                    )}
                  </div>
                </div>
                
                {/* 右侧：标签筛选区域 */}
                <div className="flex-1">
                  <div className="flex flex-col gap-2 md:gap-3">
                    {/* 标签标题和统计 */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 md:gap-3">
                        <h3 className="text-white font-medium text-xs md:text-sm">标签筛选</h3>
                        <span className="text-xs text-gray-400 bg-white/10 px-2 py-0.5 rounded-full">
                          {allTags.length - 1} 个
                        </span>
                      </div>
                      {selectedTag && (
                        <Button
                          size="sm"
                          color="secondary"
                          variant="flat"
                          onPress={() => setSelectedTag('')}
                          className="text-xs bg-white/5 hover:bg-white/10 border-white/20 h-6 md:h-7 px-1.5 md:px-2"
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
                            onClick={() => setSelectedTag(tag === '全部' ? '' : tag)}
                            color={isActive ? 'secondary' : 'default'}
                            variant={isActive ? 'solid' : 'bordered'}
                            className={`cursor-pointer transition-all duration-300 hover:scale-105 text-xs ${
                              isActive 
                                ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white border-transparent shadow-lg shadow-purple-500/25' 
                                : 'bg-white/5 text-gray-300 border-white/10 hover:bg-white/10 hover:border-white/20'
                            }`}
                            style={{
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
              </div>
              
              {/* 筛选结果统计 - 始终显示 */}
              <div className="flex items-center justify-between pt-2 md:pt-3 mt-3 md:mt-4 border-t border-white/10">
                <span className="text-xs md:text-sm text-gray-400">
                   {filteredData.length !== navigationData.length ? '筛选结果' : '共 ' + (allTags.length - 1) + ' 个标签'}
                 </span>
                <div className="flex items-center gap-2">
                  {filteredData.length !== navigationData.length && (
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                  )}
                  <span className="text-xs md:text-sm text-white font-medium">
                    {filteredData.length !== navigationData.length 
                      ? `${filteredData.length} / ${navigationData.length}`
                      : `共 ${navigationData.length} 个导航`
                    }
                  </span>
                </div>
              </div>
            </CardBody>
          </Card>
        </div>

        {/* Navigation Cards */}
        {filteredData.length === 0 && !loading ? (
          <Card className="bg-white/5 backdrop-blur-xl border-white/10 shadow-2xl">
            <CardBody className="text-center py-16">
              <div className="flex flex-col items-center gap-6">
                <div className="relative">
                  <div className="w-24 h-24 bg-gradient-to-br from-gray-600 to-gray-700 rounded-2xl flex items-center justify-center shadow-xl">
                    <Search className="w-12 h-12 text-gray-300" />
                  </div>
                  <div className="absolute -inset-4 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-2xl blur-xl opacity-50 animate-pulse"></div>
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-white mb-3 bg-gradient-to-r from-gray-300 to-gray-400 bg-clip-text text-transparent">没有找到匹配的导航项目</h3>
                  <p className="text-gray-400 text-lg">尝试调整搜索关键词或筛选标签</p>
                </div>
                <Button
                  color="secondary"
                  variant="bordered"
                  size="lg"
                  onPress={() => {
                    setSearchTerm('')
                    setSelectedTag('')
                  }}
                  className="bg-white/5 border-white/20 text-white hover:bg-white/10 hover:border-white/30 transition-all duration-300"
                >
                  清除筛选条件
                </Button>
              </div>
            </CardBody>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {filteredData.map((item, index) => (
              <Card 
                key={item.id} 
                className="group relative bg-white/[0.02] backdrop-blur-xl border border-white/10 hover:border-white/20 transition-all duration-500 cursor-pointer overflow-hidden p-0 hover:shadow-2xl hover:shadow-purple-500/10 hover:-translate-y-2"
                isPressable
                as={Link}
                href={item.url}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  animationDelay: `${index * 50}ms`
                }}
              >
                {/* 动态背景光效 */}
                <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 via-transparent to-pink-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                
                {/* 动态渐变边框 */}
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-purple-500/20 via-pink-500/20 to-purple-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-sm -z-10"></div>
                
                <CardBody className="relative p-6 h-full flex flex-col">
                  {/* 头部区域 - 图标和状态 */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="relative">
                      <div className="w-16 h-16 bg-gradient-to-br from-white/10 to-white/5 rounded-2xl flex items-center justify-center shadow-lg backdrop-blur-sm border border-white/10 group-hover:scale-110 transition-transform duration-300">
                        <span className="text-3xl">{item.icon || '🌐'}</span>
                      </div>
                      {/* 图标光晕效果 */}
                      <div className="absolute -inset-2 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-2xl blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      {/* 状态指示器 */}
                      <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse shadow-lg shadow-green-400/50"></div>
                      <Button
                        isIconOnly
                        size="sm"
                        variant="light"
                        className="text-gray-400 group-hover:text-white opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-white/10"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                  
                  {/* 标题区域 */}
                  <div className="mb-3">
                    <h3 className="text-xl font-bold text-white mb-1 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-purple-300 group-hover:to-pink-300 group-hover:bg-clip-text transition-all duration-300">
                      {item.title}
                    </h3>
                    <div className="w-8 h-0.5 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></div>
                  </div>
                  
                  {/* 描述区域 */}
                  <p className="text-gray-300 text-sm mb-4 line-clamp-2 leading-relaxed">
                    {item.description}
                  </p>
                  
                  {/* 标签区域 */}
                  <div className="mt-auto">
                    <div className="flex flex-wrap gap-2">
                      {item.tags.slice(0, 3).map(tag => (
                        <span
                          key={tag}
                          className="px-3 py-1 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 rounded-full text-xs text-gray-300 hover:text-white transition-all duration-200 hover:scale-105"
                        >
                          {tag}
                        </span>
                      ))}
                      {item.tags.length > 3 && (
                        <span className="px-3 py-1 bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/20 rounded-full text-xs text-purple-300">
                          +{item.tags.length - 3}
                        </span>
                      )}
                    </div>
                  </div>
                  
                  {/* 悬停时的额外信息 */}
                  <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="flex items-center justify-between text-xs text-gray-400">
                      <span>点击访问</span>
                      <span className="flex items-center gap-1">
                        <div className="w-1 h-1 bg-green-400 rounded-full animate-pulse"></div>
                        在线
                      </span>
                    </div>
                  </div>
                </CardBody>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}