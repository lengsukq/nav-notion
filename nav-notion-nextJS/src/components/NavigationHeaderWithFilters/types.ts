/**
 * 类型定义
 */

export interface SearchEngineConfig {
  name: string
  shortName: string
  icon?: string
  type: 'external' | 'event'
  url?: string
  eventName?: string
}

export interface NavigationHeaderWithFiltersProps {
  title?: string
  description?: string
  currentTime: Date
  refreshing: boolean
  selectedTag: string
  tags: string[]
  filteredCount: number
  originalCount: number
  currentPage: number
  totalPages: number
  itemsPerPage: number
  totalCount: number
  tagCount: number
  onRefresh: () => void
  onSettingsClick?: () => void
  onTagChange: (tag: string) => void
  onClearFilters: () => void
  onPageChange: (page: number) => void
  onSearch?: (query: string) => void
}

