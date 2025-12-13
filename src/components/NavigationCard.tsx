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
      className="group relative bg-white/[0.02] backdrop-blur-xl border border-white/10 hover:border-white/20 transition-all duration-300 cursor-pointer overflow-hidden p-0 hover:shadow-xl hover:shadow-purple-500/10 hover:-translate-y-1"
      isPressable
      as={Link}
      href={item.url}
      target="_blank"
      rel="noopener noreferrer"
      style={{
        animationDelay: `${index * 30}ms`
      }}
    >
      {/* 动态背景光效 */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 via-transparent to-pink-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      
      <CardBody className="relative p-3 md:p-4 lg:p-5 h-full flex flex-col">
        {/* 标题和状态 */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between">
            <h3 className="text-sm md:text-base lg:text-lg font-bold text-white line-clamp-2 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-purple-300 group-hover:to-pink-300 group-hover:bg-clip-text transition-all duration-300">
              {item.title}
            </h3>
            <div className="flex items-center gap-1 ml-2">
              {/* 状态指示器 */}
              <div className="w-1.5 h-1.5 md:w-2 md:h-2 bg-green-400 rounded-full animate-pulse shadow-lg shadow-green-400/50"></div>
            </div>
          </div>
          
          {/* 装饰线 - 仅桌面端 */}
          <div className="hidden lg:block w-6 h-0.5 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 mt-1"></div>
        </div>
        
        {/* 描述区域 - 仅桌面端 */}
        <p className="hidden md:block text-gray-300 text-xs lg:text-sm mt-2 lg:mt-3 line-clamp-1 lg:line-clamp-2 leading-relaxed">
          {item.description}
        </p>
        
        {/* 标签区域 - 仅桌面端 */}
        <div className="hidden lg:block mt-auto">
          <div className="flex flex-wrap gap-1">
            {item.tags.slice(0, 2).map(tag => (
              <span
                key={tag}
                className="px-2 py-0.5 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 rounded text-xs text-gray-300 hover:text-white transition-all duration-200 hover:scale-105"
              >
                {tag}
              </span>
            ))}
            {item.tags.length > 2 && (
              <span className="px-2 py-0.5 bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/20 rounded text-xs text-purple-300">
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
                className="px-1.5 py-0.5 bg-white/10 border border-white/10 rounded text-xs text-gray-300"
              >
                {tag}
              </span>
            ))}
            {item.tags.length > 1 && (
              <span className="text-xs text-gray-400">
                +{item.tags.length - 1}
              </span>
            )}
          </div>
        </div>

      </CardBody>
    </Card>
  )
}