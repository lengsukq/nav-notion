'use client'

import { Card, CardBody, Spinner, Progress } from '@heroui/react'

interface LoadingStateProps {
  totalItems: number
  loadedItems: number
}

export function LoadingState({ totalItems, loadedItems }: LoadingStateProps) {
  const progress = totalItems > 0 ? (loadedItems / totalItems) * 100 : undefined

  return (
    <div className="min-h-screen bg-transparent flex items-center justify-center animate-gradient">
      <Card className="bg-white/10 backdrop-blur-xl border-white/20 p-8 shadow-2xl shadow-white/10 max-w-md w-full mx-4">
        <CardBody className="text-center">
          <div className="relative mb-8">
            <div className="w-20 h-20 mx-auto relative">
              <Spinner 
                size="lg" 
                color="primary" 
                className="absolute inset-0"
                classNames={{
                  circle1: "border-b-[var(--primary-color)]",
                  circle2: "border-b-[var(--secondary-color)]"
                }}
              />
              <div 
                className="absolute inset-0 rounded-full blur-xl opacity-30 animate-pulse"
                style={{
                  background: `linear-gradient(to right, var(--primary-color), var(--secondary-color))`
                }}
              ></div>
              <div 
                className="absolute inset-2 rounded-full blur-lg opacity-20 animate-ping"
                style={{
                  background: `linear-gradient(to right, var(--primary-color-light), var(--secondary-color))`
                }}
              ></div>
            </div>
          </div>
          
          <h2 
            className="text-3xl font-bold text-foreground mb-3 bg-clip-text text-transparent"
            style={{
              backgroundImage: `linear-gradient(to right, var(--primary-color-light), var(--secondary-color))`
            }}
          >
            正在加载导航数据...
          </h2>
          
          <p className="text-default-600 mb-6 text-lg">
            {totalItems > 0 ? `已加载 ${loadedItems} / ${totalItems} 个导航项目` : '正在从 Notion 获取您的导航数据'}
          </p>
          
          <div className="space-y-4">
            <div className="flex justify-center space-x-2">
              <div 
                className="w-3 h-3 rounded-full animate-bounce"
                style={{
                  background: `linear-gradient(to right, var(--primary-color), var(--secondary-color))`
                }}
              ></div>
              <div 
                className="w-3 h-3 rounded-full animate-bounce" 
                style={{
                  animationDelay: '0.1s',
                  background: `linear-gradient(to right, var(--primary-color), var(--secondary-color))`
                }}
              ></div>
              <div 
                className="w-3 h-3 rounded-full animate-bounce" 
                style={{
                  animationDelay: '0.2s',
                  background: `linear-gradient(to right, var(--primary-color), var(--secondary-color))`
                }}
              ></div>
            </div>
            
            {totalItems > 0 ? (
              <div className="space-y-3">
                <div className="flex justify-between text-sm text-default-600">
                  <span>加载进度</span>
                  <span>{Math.round(progress || 0)}%</span>
                </div>
                <Progress
                  value={progress}
                  className="max-w-md"
                  color="primary"
                  showValueLabel={false}
                  classNames={{
                    base: "bg-default-100/50",
                    indicator: "",
                    track: "bg-default-100/50"
                  }}
                  style={{
                    '--indicator-color': 'var(--primary-color)'
                  } as React.CSSProperties}
                />
                <div className="text-center text-xs text-default-500">
                  {loadedItems} / {totalItems} 个项目已加载
                </div>
              </div>
            ) : (
              <div className="space-y-2">
                <Progress 
                  isIndeterminate 
                  color="primary" 
                  className="max-w-sm"
                  classNames={{
                    indicator: ""
                  }}
                  style={{
                    '--indicator-color': 'var(--primary-color)'
                  } as React.CSSProperties}
                />
                <Progress 
                  isIndeterminate 
                  color="primary" 
                  className="max-w-sm"
                  classNames={{
                    indicator: ""
                  }}
                  style={{
                    '--indicator-color': 'var(--secondary-color)'
                  } as React.CSSProperties}
                />
                <Progress 
                  isIndeterminate 
                  color="primary" 
                  className="max-w-sm"
                  classNames={{
                    indicator: ""
                  }}
                  style={{
                    '--indicator-color': 'var(--primary-color-light)'
                  } as React.CSSProperties}
                />
              </div>
            )}
          </div>
          
          <div className="mt-6 text-default-500 text-sm">
            首次加载可能需要几秒钟时间
          </div>
        </CardBody>
      </Card>
    </div>
  )
}