import { NavigationState, Settings } from '@/types'

const STORAGE_KEYS = {
  SETTINGS: 'nav_notion_settings',
  NAVIGATION_DATA: 'nav_notion_data',
  CACHE_TIMESTAMP: 'nav_notion_cache_timestamp',
  LOADING_STATE: 'nav_notion_loading_state'
} as const

export function loadSettings(): Settings {
  if (typeof window === 'undefined') {
    return {
      notionToken: '',
      databaseId: '',
      theme: 'dark',
      autoRefresh: true,
      refreshInterval: 300000 // 5 minutes
    }
  }

  try {
    const stored = localStorage.getItem(STORAGE_KEYS.SETTINGS)
    if (stored) {
      return JSON.parse(stored)
    }
  } catch (error) {
    console.error('Error loading settings:', error)
  }

  return {
    notionToken: '',
    databaseId: '',
    theme: 'dark',
    autoRefresh: true,
    refreshInterval: 300000
  }
}

export function saveSettings(settings: Settings): void {
  if (typeof window === 'undefined') return

  try {
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings))
  } catch (error) {
    console.error('Error saving settings:', error)
  }
}

export function loadCachedData() {
  if (typeof window === 'undefined') return null

  try {
    const data = localStorage.getItem(STORAGE_KEYS.NAVIGATION_DATA)
    const timestamp = localStorage.getItem(STORAGE_KEYS.CACHE_TIMESTAMP)
    
    if (data && timestamp) {
      const cacheTime = parseInt(timestamp)
      const now = Date.now()
      const cacheAge = now - cacheTime
      
      // Cache is valid for 5 minutes
      if (cacheAge < 300000) {
        return JSON.parse(data)
      }
    }
  } catch (error) {
    console.error('Error loading cached data:', error)
  }

  return null
}

export function saveCachedData(data: any): void {
  if (typeof window === 'undefined') return

  try {
    localStorage.setItem(STORAGE_KEYS.NAVIGATION_DATA, JSON.stringify(data))
    localStorage.setItem(STORAGE_KEYS.CACHE_TIMESTAMP, Date.now().toString())
  } catch (error) {
    console.error('Error saving cached data:', error)
  }
}

export function clearCache(): void {
  if (typeof window === 'undefined') return

  try {
    localStorage.removeItem(STORAGE_KEYS.NAVIGATION_DATA)
    localStorage.removeItem(STORAGE_KEYS.CACHE_TIMESTAMP)
    localStorage.removeItem(STORAGE_KEYS.LOADING_STATE)
  } catch (error) {
    console.error('Error clearing cache:', error)
  }
}

export interface LoadingState {
  isLoading: boolean
  progress: number
  totalItems: number
  loadedItems: number
  startTime: number
}

export function saveLoadingState(state: LoadingState): void {
  if (typeof window === 'undefined') return

  try {
    localStorage.setItem(STORAGE_KEYS.LOADING_STATE, JSON.stringify(state))
  } catch (error) {
    console.error('Error saving loading state:', error)
  }
}

export function loadLoadingState(): LoadingState | null {
  if (typeof window === 'undefined') return null

  try {
    const stored = localStorage.getItem(STORAGE_KEYS.LOADING_STATE)
    if (stored) {
      return JSON.parse(stored)
    }
  } catch (error) {
    console.error('Error loading loading state:', error)
  }

  return null
}