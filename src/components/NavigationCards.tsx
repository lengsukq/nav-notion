'use client'

import { Card, CardBody, CardHeader, Link, Chip, Button, Tooltip, Badge } from '@heroui/react'
import { ArrowUpRight } from 'lucide-react'
import { NavigationItem } from '@/lib/notion'

interface NavigationCardsProps {
  data: NavigationItem[]
}

export function NavigationCards({ data }: NavigationCardsProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6">
      {data.map(item => (
        <Card 
          key={item.id}
          isHoverable
          isPressable
          shadow="lg"
          classNames={{
            base: [
              "bg-gradient-to-br from-white/15 to-white/5",
              "backdrop-blur-lg",
              "border border-white/20",
              "hover:from-white/25 hover:to-white/10",
              "transition-all duration-300 ease-in-out",
              "hover:scale-[1.02] hover:shadow-2xl",
              "group"
            ],
            body: "p-6"
          }}
          onPress={() => window.open(item.url, '_blank', 'noopener,noreferrer')}
        >
          <CardHeader className="flex flex-row items-start justify-between pb-4">
            <div className="flex-1">
              <h3 className="text-lg font-bold text-white line-clamp-1 group-hover:text-purple-200 transition-colors text-left">
                {item.title}
              </h3>
              {item.category && (
                <Badge 
                  color="secondary" 
                  variant="flat" 
                  size="sm"
                  className="mt-1"
                >
                  {item.category}
                </Badge>
              )}
            </div>
            
            <Tooltip content="在新窗口打开" placement="top" color="secondary">
              <Button
                isIconOnly
                size="sm"
                variant="light"
                color="secondary"
                className="min-w-0 opacity-0 group-hover:opacity-100 transition-opacity ml-2"
                onPress={() => {
                  window.open(item.url, '_blank', 'noopener,noreferrer')
                }}
              >
                <ArrowUpRight className="w-4 h-4" />
              </Button>
            </Tooltip>
          </CardHeader>
          
          <CardBody className="pt-0">
            {item.description && (
              <p className="text-gray-300 text-sm mb-4 line-clamp-3 leading-relaxed">
                {item.description}
              </p>
            )}
            
            {item.tags && item.tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {item.tags.slice(0, 3).map(tag => (
                  <Chip
                    key={tag}
                    size="sm"
                    variant="flat"
                    color="secondary"
                    classNames={{
                      base: "bg-purple-500/10 hover:bg-purple-500/20 transition-colors",
                      content: "text-purple-300 text-xs font-medium"
                    }}
                  >
                    {tag}
                  </Chip>
                ))}
                {item.tags.length > 3 && (
                  <Chip
                    size="sm"
                    variant="flat"
                    color="default"
                    classNames={{
                      base: "bg-gray-500/10",
                      content: "text-gray-400 text-xs"
                    }}
                  >
                    +{item.tags.length - 3}
                  </Chip>
                )}
              </div>
            )}
            
            {item.createdTime && (
              <div className="mt-4 pt-4 border-t border-white/10">
                <p className="text-xs text-gray-400">
                  创建于 {new Date(item.createdTime).toLocaleDateString('zh-CN')}
                </p>
              </div>
            )}
          </CardBody>
        </Card>
      ))}
    </div>
  )
}