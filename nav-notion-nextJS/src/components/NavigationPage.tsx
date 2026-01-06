'use client'

import { useState, useEffect } from 'react'
import { useNavigationData } from '@/hooks/useNavigationData'
import { useSettings } from '@/hooks/useSettings'
import { useBackground } from '@/hooks/useBackground'
import { NavigationHeaderWithFilters } from '@/components/NavigationHeaderWithFilters'
import { NavigationCard } from '@/components/NavigationCard'
import { LoadingState } from '@/components/LoadingState'
import { ErrorState } from '@/components/ErrorState'
import { EmptyState } from '@/components/EmptyState'
import { SettingsModal } from '@/components/SettingsModal'

export function NavigationPage() {
  const {
    navigationData,
    tags,
    loading,
    refreshing,
    error,
    currentTime,
    totalItems,
    filteredData,
    searchTerm,
    selectedTag,
    handleRefresh,
    setSearchTerm,
    setSelectedTag,
    clearFilters
  } = useNavigationData()

  const { isSettingsOpen, setIsSettingsOpen, toggleSettings } = useSettings()
  const { setBackground } = useBackground()

  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 50
  const [databaseTitle, setDatabaseTitle] = useState('导航管理')
  const [databaseDescription, setDatabaseDescription] = useState('基于 Notion 的导航管理系统')

  // 获取并设置元数据（标题、描述、背景图）
  useEffect(() => {
    const loadMetadata = async () => {
      try {
        const response = await fetch('/api/metadata')
        if (response.ok) {
          const result = await response.json()
          if (result.data) {
            if (result.data.title) {
              setDatabaseTitle(result.data.title)
              document.title = result.data.title
            }
            if (result.data.description) {
              setDatabaseDescription(result.data.description)
            }
            if (result.data.backgroundImageUrl) {
              setBackground(result.data.backgroundImageUrl)
            }
          }
        }
      } catch (error) {
        console.error('Failed to load metadata:', error)
      }
    }

    loadMetadata()
  }, [setBackground])

  const totalPages = Math.ceil(filteredData.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const currentPageData = filteredData.slice(startIndex, endIndex)

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
  }

  useEffect(() => {
    setCurrentPage(1)
  }, [searchTerm, selectedTag])

  if (loading && navigationData.length === 0) {
    return (
      <LoadingState 
        totalItems={totalItems} 
        loadedItems={navigationData.length} 
      />
    )
  }

  return (
    <div className="min-h-screen bg-transparent p-4 relative">
      <div className="max-w-7xl mx-auto">
        {/* Error Alert */}
        {error && (
          <div className="mb-4">
            <ErrorState error={error} onRetry={handleRefresh} />
          </div>
        )}

        {/* Header with Filters - 融合的头部和筛选栏 */}
        <NavigationHeaderWithFilters
          title={databaseTitle}
          description={databaseDescription}
          currentTime={currentTime}
          refreshing={refreshing}
          selectedTag={selectedTag}
          tags={tags}
          filteredCount={filteredData.length}
          originalCount={navigationData.length}
          currentPage={currentPage}
          totalPages={totalPages}
          itemsPerPage={itemsPerPage}
          totalCount={navigationData.length}
          tagCount={tags.length}
          onRefresh={handleRefresh}
          onSettingsClick={toggleSettings}
          onTagChange={setSelectedTag}
          onClearFilters={clearFilters}
          onPageChange={handlePageChange}
          onSearch={setSearchTerm}
        />

        {/* Navigation Cards */}
        {currentPageData.length === 0 && !loading ? (
          <EmptyState onClearFilters={clearFilters} />
        ) : (
          <>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-2 sm:gap-3 md:gap-4">
              {currentPageData.map((item, index) => (
                <NavigationCard 
                  key={item.id} 
                  item={item} 
                  index={startIndex + index}
                />
              ))}
            </div>
          </>
        )}
      </div>
      
      {/* Settings Modal */}
      <SettingsModal 
        isOpen={isSettingsOpen} 
        onClose={() => setIsSettingsOpen(false)}
      />
    </div>
  )
}