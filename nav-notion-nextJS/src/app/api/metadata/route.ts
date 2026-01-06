import { NextRequest, NextResponse } from 'next/server'
import { NotionService } from '@/lib/notion'

export async function GET(request: NextRequest) {
  try {
    const token = process.env.NOTION_TOKEN
    const databaseId = process.env.NOTION_DATABASE_ID

    if (!token || !databaseId) {
      return NextResponse.json(
        { 
          error: '环境变量配置错误',
          details: '请确保设置了 NOTION_TOKEN 和 NOTION_DATABASE_ID 环境变量'
        },
        { status: 500 }
      )
    }

    const notionService = new NotionService({ token, databaseId })
    const metadata = await notionService.getDatabaseMetadata()

    const response = NextResponse.json({
      data: metadata,
      timestamp: new Date().toISOString()
    })

    // 设置缓存头
    response.headers.set('Cache-Control', 's-maxage=300, stale-while-revalidate=600')
    
    return response
  } catch (error) {
    console.error('Metadata API Error:', error)
    
    let errorMessage = '获取元数据失败'
    let statusCode = 500
    
    if (error instanceof Error) {
      if (error.message.includes('unauthorized')) {
        errorMessage = 'Notion Token 无效或权限不足'
        statusCode = 401
      } else if (error.message.includes('object_not_found')) {
        errorMessage = '数据库不存在或无法访问'
        statusCode = 404
      } else {
        errorMessage = error.message
      }
    }
    
    return NextResponse.json(
      { 
        error: errorMessage,
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: statusCode }
    )
  }
}

