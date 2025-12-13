'use client'

import { Card, CardBody, Spinner, Progress } from '@heroui/react'

interface LoadingStateProps {
  totalItems: number
  loadedItems: number
}

export function LoadingState({ totalItems, loadedItems }: LoadingStateProps) {
  const progress = totalItems > 0 ? (loadedItems / totalItems) * 100 : undefined

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center animate-gradient">
      <Card className="bg-white/10 backdrop-blur-sm border-white/20 p-8 shadow-2xl max-w-md w-full mx-4">
        <CardBody className="text-center">
          <div className="relative mb-8">
            <div className="w-20 h-20 mx-auto relative">
              <Spinner size="lg" color="secondary" className="absolute inset-0" />
              <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full blur-xl opacity-30 animate-pulse"></div>
              <div className="absolute inset-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full blur-lg opacity-20 animate-ping"></div>
            </div>
          </div>
          
          <h2 className="text-3xl font-bold text-white mb-3 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
            正在加载导航数据...
          </h2>
          
          <p className="text-gray-300 mb-6 text-lg">
            {totalItems > 0 ? `已加载 ${loadedItems} / ${totalItems} 个导航项目` : '正在从 Notion 获取您的导航数据'}
          </p>
          
          <div className="space-y-4">
            <div className="flex justify-center space-x-2">
              <div className="w-3 h-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full animate-bounce"></div>
              <div className="w-3 h-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
              <div className="w-3 h-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
            </div>
            
            {totalItems > 0 ? (
              <div className="space-y-3">
                <div className="flex justify-between text-sm text-gray-400">
                  <span>加载进度</span>
                  <span>{Math.round(progress || 0)}%</span>
                </div>
                <Progress
                  value={progress}
                  className="max-w-md"
                  color="secondary"
                  showValueLabel={false}
                  classNames={{
                    base: "bg-white/10",
                    indicator: "bg-gradient-to-r from-purple-500 to-pink-500",
                    track: "bg-white/10"
                  }}
                />
                <div className="text-center text-xs text-gray-500">
                  {loadedItems} / {totalItems} 个项目已加载
                </div>
              </div>
            ) : (
              <div className="space-y-2">
                <Progress isIndeterminate color="secondary" className="max-w-sm" />
                <Progress isIndeterminate color="primary" className="max-w-sm" />
                <Progress isIndeterminate color="secondary" className="max-w-sm" />
              </div>
            )}
          </div>
          
          <div className="mt-6 text-gray-400 text-sm">
            首次加载可能需要几秒钟时间
          </div>
        </CardBody>
      </Card>
    </div>
  )
}