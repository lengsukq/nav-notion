/**
 * 搜索引擎配置
 */
import type { SearchEngineConfig } from './types'

export const SEARCH_CONFIG: Record<string, SearchEngineConfig> = {
  bing: { name: 'Bing', shortName: 'Bing', type: 'external', url: 'https://www.bing.com/search?q=' },
  google: { name: 'Google', shortName: 'Google', type: 'external', url: 'https://www.google.com/search?q=' },
  yahoo: { name: 'Yahoo', shortName: 'Yahoo', type: 'external', url: 'https://search.yahoo.com/search?p=' },
  duck: { name: 'Duck', shortName: 'Duck', type: 'external', url: 'https://duckduckgo.com/?q=' },
  baidu: { name: '百度', shortName: '百度', type: 'external', url: 'https://www.baidu.com/s?wd=' },
  mieta: { name: '密塔', shortName: '密塔', type: 'external', url: 'https://metaso.cn/?q=' },
  notion: { name: 'Notion', shortName: 'Notion', type: 'event', eventName: 'search' }
}

