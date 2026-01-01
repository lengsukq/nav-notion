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

export interface Settings {
  notionToken: string
  databaseId: string
  theme: 'light' | 'dark' | 'auto'
  autoRefresh: boolean
  refreshInterval: number
}

export interface ApiResponse<T> {
  data: T
  count: number
  timestamp: string
  error?: string
}