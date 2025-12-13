import { Client } from '@notionhq/client'

export interface NavigationItem {
  id: string
  title: string
  url: string
  description: string
  tags: string[]
  icon?: string
  category?: string
  priority: number
  createdTime: string
  lastEditedTime: string
}

export interface NotionDatabaseConfig {
  token: string
  databaseId: string
}

export class NotionService {
  private client: Client
  private databaseId: string

  constructor(config: NotionDatabaseConfig) {
    this.client = new Client({
      auth: config.token
    })
    this.databaseId = config.databaseId
  }

  async getNavigationItems(): Promise<NavigationItem[]> {
    try {
      console.log('NotionService - Starting database query:', {
        databaseId: this.databaseId,
        databaseIdLength: this.databaseId.length
      })

      const response = await this.client.databases.query({
        database_id: this.databaseId,
        sorts: [
          {
            property: 'name', // 按名称排序
            direction: 'ascending'
          }
        ]
      })

      console.log('NotionService - Database query successful, results count:', response.results.length)
      return response.results.map(page => this.transformPageToNavigationItem(page))
    } catch (error) {
      console.error('Error fetching Notion data:', error)
      if (error instanceof Error) {
        console.error('Error details:', {
          message: error.message,
          stack: error.stack?.substring(0, 500)
        })
        throw new Error(`Failed to fetch navigation items from Notion: ${error.message}`)
      }
      throw new Error('Failed to fetch navigation items from Notion')
    }
  }

  private transformPageToNavigationItem(page: any): NavigationItem {
    const properties = page.properties
    
    return {
      id: page.id,
      title: this.extractTitle(properties.name), // 原来是 'name' 而不是 'Title'
      url: this.extractUrl(properties.url), // 原来是 'url' 而不是 'URL'
      description: this.extractRichText(properties.description),
      tags: this.extractMultiSelect(properties.tag), // 原来是 'tag' 而不是 'Tags'
      icon: this.extractIcon(properties.icon),
      category: this.extractSelect(properties.category),
      priority: this.extractNumber(properties.priority),
      createdTime: page.created_time,
      lastEditedTime: page.last_edited_time
    }
  }

  private extractTitle(titleProperty: any): string {
    if (titleProperty?.type === 'title' && titleProperty.title?.[0]) {
      return titleProperty.title[0].plain_text
    }
    return 'Untitled'
  }

  private extractUrl(urlProperty: any): string {
    // Vue 项目中 url 是 rich_text 类型，不是 url 类型
    if (urlProperty?.type === 'rich_text' && urlProperty.rich_text?.[0]) {
      // 检查是否有链接
      const text = urlProperty.rich_text[0]
      if (text?.text?.link?.url) {
        return text.text.link.url
      }
      // 否则返回纯文本
      return text.plain_text || '#'
    }
    return '#'
  }

  private extractRichText(richTextProperty: any): string {
    if (richTextProperty?.type === 'rich_text' && richTextProperty.rich_text) {
      return richTextProperty.rich_text.map((item: any) => item.plain_text).join('')
    }
    return ''
  }

  private extractMultiSelect(multiSelectProperty: any): string[] {
    if (multiSelectProperty?.type === 'multi_select' && multiSelectProperty.multi_select) {
      return multiSelectProperty.multi_select.map((item: any) => item.name)
    }
    return []
  }

  private extractSelect(selectProperty: any): string {
    if (selectProperty?.type === 'select' && selectProperty.select) {
      return selectProperty.select.name
    }
    return ''
  }

  private extractNumber(numberProperty: any): number {
    if (numberProperty?.type === 'number' && typeof numberProperty.number === 'number') {
      return numberProperty.number
    }
    return 0
  }

  private extractIcon(iconProperty: any): string {
    if (iconProperty?.type === 'rich_text' && iconProperty.rich_text?.[0]) {
      return iconProperty.rich_text[0].plain_text
    }
    return '🌐'
  }
}