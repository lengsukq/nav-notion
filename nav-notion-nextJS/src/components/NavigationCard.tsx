'use client'

import { Card, CardBody } from '@heroui/react'
import { Link } from '@heroui/react'
import { NavigationItem } from '@/lib/notion'

interface NavigationCardProps {
  item: NavigationItem
  index: number
}

export function NavigationCard({ 
  item, 
  index
}: NavigationCardProps) {
  
  return (
    <Card 
      key={item.id} 
      className="group relative bg-white/[0.02] backdrop-blur-xl border border-white/10 hover:border-white/20 transition-all duration-300 cursor-pointer overflow-hidden p-0 hover:shadow-xl hover:-translate-y-1"
      style={{
        animationDelay: `${index * 30}ms`,
        '--hover-shadow-color': 'rgba(var(--primary-color-rgb), 0.1)'
      } as React.CSSProperties & { '--hover-shadow-color': string }}
      onMouseEnter={(e) => {
        e.currentTarget.style.boxShadow = `0 20px 25px -5px rgba(var(--primary-color-rgb), 0.1), 0 10px 10px -5px rgba(var(--primary-color-rgb), 0.04)`
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.boxShadow = ''
      }}
      isPressable
      as={Link}
      href={item.url}
      target="_blank"
      rel="noopener noreferrer"
    >
      {/* 动态背景光效 */}
      <div 
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        style={{
          background: `linear-gradient(to bottom right, rgba(var(--primary-color-rgb), 0.05), transparent, rgba(var(--secondary-color-rgb), 0.05))`
        }}
      ></div>
      
      <CardBody className="relative h-full flex flex-col p-3 md:p-4 lg:p-5">
        {/* 标题和状态 */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between">
            <h3 className="text-sm md:text-base lg:text-lg font-bold text-foreground line-clamp-2 transition-all duration-300">
              {item.title}
            </h3>
            <div className="flex items-center gap-1 ml-2">
              {/* 状态指示器 */}
              <div className="w-1.5 h-1.5 md:w-2 md:h-2 bg-green-400 rounded-full animate-pulse shadow-lg shadow-green-400/50"></div>
            </div>
          </div>
          
          {/* 装饰线 - 仅桌面端 */}
          <div 
            className="hidden lg:block w-6 h-0.5 rounded-full transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 mt-1"
            style={{
              background: `linear-gradient(to right, var(--primary-color), var(--secondary-color))`
            }}
          ></div>
        </div>
        
        {/* 描述区域 */}
        <p className="hidden md:block text-xs lg:text-sm text-default-600 mt-2 lg:mt-3 leading-relaxed line-clamp-1 lg:line-clamp-2">
          {item.description}
        </p>
        
        {/* 标签区域 - 仅桌面端 */}
        <div className="hidden lg:block mt-auto">
          <div className="flex flex-wrap gap-1">
            {item.tags.slice(0, 2).map(tag => (
              <span
                key={tag}
                className="text-xs text-default-500 hover:text-foreground transition-colors duration-200"
              >
                {tag}
              </span>
            ))}
            {item.tags.length > 2 && (
              <span className="text-xs text-default-500">
                +{item.tags.length - 2}
              </span>
            )}
          </div>
        </div>
        
        {/* 移动端简单标签 */}
        <div className="block lg:hidden mt-2">
          <div className="flex items-center gap-1">
            {item.tags.slice(0, 1).map(tag => (
              <span
                key={tag}
                className="text-xs text-default-500"
              >
                {tag}
              </span>
            ))}
            {item.tags.length > 1 && (
              <span className="text-xs text-default-500">
                +{item.tags.length - 1}
              </span>
            )}
          </div>
        </div>

      </CardBody>
    </Card>
  )
}