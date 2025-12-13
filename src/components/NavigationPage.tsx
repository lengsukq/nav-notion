'use client'

import { useNavigationData } from '@/hooks/useNavigationData'
import { NavigationHeader } from '@/components/NavigationHeader'
import { SearchFilters } from '@/components/SearchFilters'
import { NavigationCard } from '@/components/NavigationCard'
import { LoadingState } from '@/components/LoadingState'
import { ErrorState } from '@/components/ErrorState'
import { EmptyState } from '@/components/EmptyState'

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

  if (loading && navigationData.length === 0) {
    return (
      <LoadingState 
        totalItems={totalItems} 
        loadedItems={navigationData.length} 
      />
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <NavigationHeader
            currentTime={currentTime}
            refreshing={refreshing}
            totalCount={navigationData.length}
            tagCount={tags.length}
            filteredCount={filteredData.length}
            originalCount={navigationData.length}
            onRefresh={handleRefresh}
          />
        </div>

        {/* Error Alert */}
        {error && (
          <ErrorState error={error} onRetry={handleRefresh} />
        )}

        {/* Search and Filters */}
        <SearchFilters
          searchTerm={searchTerm}
          selectedTag={selectedTag}
          tags={tags}
          filteredCount={filteredData.length}
          originalCount={navigationData.length}
          onSearchChange={setSearchTerm}
          onTagChange={setSelectedTag}
          onClearFilters={clearFilters}
        />

        {/* Navigation Cards */}
        {filteredData.length === 0 && !loading ? (
          <EmptyState onClearFilters={clearFilters} />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-3 md:gap-4 lg:gap-6">
            {filteredData.map((item, index) => (
              <NavigationCard key={item.id} item={item} index={index} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}