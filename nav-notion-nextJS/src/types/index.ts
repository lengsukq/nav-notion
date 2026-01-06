import { NavigationItem } from '@/lib/notion'

export interface NavigationState {
  items: NavigationItem[]
  filteredItems: NavigationItem[]
  tags: string[]
  categories: string[]
  searchTerm: string
  selectedTag: string
  selectedCategory: string
  loading: boolean
  error: string | null
}

export type TagFilterMode = 'single' | 'multiple'

export interface Settings {
  notionToken: string
  databaseId: string
  theme: 'light' | 'dark' | 'auto'
  autoRefresh: boolean
  refreshInterval: number
  // 新增设置项
  themeColor: string
  secondaryColor: string
  tagFilterMode: TagFilterMode
  cacheExpiryTime: number // 缓存过期时间（小时），0 表示不缓存
}

export interface ApiResponse<T> {
  data: T
  count: number
  timestamp: string
  error?: string
}