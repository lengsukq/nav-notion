import { NextRequest, NextResponse } from 'next/server'
import { NotionService } from '@/lib/notion'

export async function GET(request: NextRequest) {
  try {
    // 从环境变量获取配置
    const token = process.env.NOTION_TOKEN
    const databaseId = process.env.NOTION_DATABASE_ID

    console.log('API Route - Environment check:', { 
      hasToken: !!token, 
      hasDatabaseId: !!databaseId,
      tokenLength: token?.length,
      databaseIdLength: databaseId?.length,
      tokenPrefix: token?.substring(0, 10),
      databaseIdPrefix: databaseId?.substring(0, 10)
    })

    if (!token || !databaseId) {
      return NextResponse.json(
        { 
          error: '环境变量配置错误',
          details: '请确保设置了 NOTION_TOKEN 和 NOTION_DATABASE_ID 环境变量',
          debug: {
            hasToken: !!token,
            hasDatabaseId: !!databaseId
          }
        },
        { status: 500 }
      )
    }

    const notionService = new NotionService({ token, databaseId })
    const navigationItems = await notionService.getNavigationItems()

    const response = NextResponse.json({
      data: navigationItems,
      count: navigationItems.length,
      timestamp: new Date().toISOString()
    })

    // 设置缓存头
    response.headers.set('Cache-Control', 's-maxage=60, stale-while-revalidate=300')
    
    return response
  } catch (error) {
    console.error('API Error:', error)
    console.error('API Error Stack:', error instanceof Error ? error.stack : 'No stack trace')
    
    let errorMessage = '获取导航数据失败'
    let statusCode = 500
    
    if (error instanceof Error) {
      if (error.message.includes('unauthorized')) {
        errorMessage = 'Notion Token 无效或权限不足'
        statusCode = 401
      } else if (error.message.includes('object_not_found')) {
        errorMessage = '数据库不存在或无法访问'
        statusCode = 404
      } else if (error.message.includes('validation')) {
        errorMessage = '请求参数验证失败'
        statusCode = 400
      } else if (error.message.includes('ENOTFOUND')) {
        errorMessage = '网络连接失败，请检查网络设置'
        statusCode = 503
      } else if (error.message.includes('ECONNREFUSED')) {
        errorMessage = '连接被拒绝，服务可能不可用'
        statusCode = 503
      } else {
        errorMessage = error.message
      }
    }
    
    return NextResponse.json(
      { 
        error: errorMessage,
        details: error instanceof Error ? error.message : 'Unknown error',
        debug: error instanceof Error ? {
          message: error.message,
          stack: error.stack?.split('\n').slice(0, 5).join('\n')
        } : 'Unknown error'
      },
      { status: statusCode }
    )
  }
}