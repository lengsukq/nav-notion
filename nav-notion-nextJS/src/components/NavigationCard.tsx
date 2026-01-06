'use client'

import { Card, CardBody, Chip } from '@heroui/react'
import { Link } from '@heroui/react'
import { NavigationItem } from '@/lib/notion'
import { theme, glassStyle } from '@/lib/theme'

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
      className={`group relative overflow-hidden p-0 cursor-pointer transition-all duration-500 ease-out animate-fade-in ${theme.classes.rounded.card}`}
      classNames={{ base: theme.classes.rounded.card }}
      style={{
        animationDelay: `${index * 30}ms`,
        ...glassStyle,
        boxShadow: '0 4px 30px rgba(0, 0, 0, 0.05)',
        willChange: 'transform',
        transform: 'translateZ(0)'
      } as React.CSSProperties}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-4px) translateZ(0)'
        e.currentTarget.style.boxShadow = `
          0 20px 40px -5px rgba(var(--primary-color-rgb), 0.2),
          0 10px 20px -5px rgba(var(--primary-color-rgb), 0.1)
        `
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0) translateZ(0)'
        e.currentTarget.style.boxShadow = '0 4px 30px rgba(0, 0, 0, 0.05)'
      }}
      isPressable
      as={Link}
      href={item.url}
      target="_blank"
      rel="noopener noreferrer"
    >
      {/* 背景光效层 */}
      <div 
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"
        style={{
          background: `radial-gradient(circle at 50% 0%, rgba(var(--primary-color-rgb), 0.15), transparent 70%)`
        }}
      />
      
      {/* 边框高光 - 使用伪元素方法实现圆角渐变边框 */}
      <div 
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
        style={{
          borderRadius: 'inherit'
        }}
      >
        <div 
          className="absolute inset-0"
          style={{
            borderRadius: 'inherit',
            padding: '1px',
            background: `linear-gradient(135deg, var(--primary-color), var(--secondary-color))`,
            WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
            WebkitMaskComposite: 'xor',
            mask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
            maskComposite: 'exclude'
          } as React.CSSProperties & { WebkitMask: string; WebkitMaskComposite: string; mask: string; maskComposite: string }}
        />
      </div>
      
      <CardBody className="relative z-10 h-full flex flex-col p-2 sm:p-3 md:p-4 min-h-[120px] sm:min-h-[150px] md:min-h-[180px]">
        {/* 标题区域 */}
        <div className="flex-1 min-h-0 mb-1 sm:mb-1.5">
          <div className="flex items-start justify-between gap-1.5 sm:gap-2">
            <h3 className="text-xs sm:text-sm md:text-base lg:text-lg font-bold leading-tight line-clamp-2 text-foreground transition-all duration-300 flex-1 min-w-0">
              {item.title}
            </h3>
            {/* 状态指示器 */}
            <div className="flex items-center gap-0.5 shrink-0 mt-0.5">
              <div 
                className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full animate-pulse shadow-lg"
                style={{
                  backgroundColor: 'var(--primary-color)',
                  boxShadow: '0 0 6px rgba(var(--primary-color-rgb), 0.6)'
                }}
              />
            </div>
          </div>
          
          {/* 装饰线 - 仅中等屏幕及以上显示 */}
          <div 
            className="hidden sm:block w-5 sm:w-6 md:w-8 h-0.5 rounded-full transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 mt-1 sm:mt-1.5"
            style={{
              background: `linear-gradient(to right, var(--primary-color), var(--secondary-color))`
            }}
          />
        </div>
        
        {/* 描述区域 - 小屏幕隐藏，中等屏幕显示1行，大屏幕显示2行 */}
        <p className="hidden sm:block text-[10px] sm:text-xs md:text-sm text-default-600 leading-snug line-clamp-1 md:line-clamp-2 mb-1.5 sm:mb-2 flex-shrink-0">
          {item.description}
        </p>
        
        {/* 标签区域 - 响应式显示数量 */}
        <div className="mt-auto pt-1 sm:pt-1.5 flex flex-wrap gap-1 shrink-0">
          {/* 移动端显示1个，平板显示2个，桌面显示3个 */}
          {item.tags.map((tag, index) => {
            const isVisibleMobile = index === 0
            const isVisibleTablet = index < 2
            const isVisibleDesktop = index < 3
            
            return (
              <Chip
                key={tag}
                size="sm"
                variant="flat"
                color="primary"
                className={`text-[9px] sm:text-[10px] md:text-xs h-3.5 sm:h-4 md:h-5 px-1 sm:px-1.5 md:px-2 border border-primary/30 bg-primary/10 hover:bg-primary/20 hover:border-primary/50 transition-all duration-300 hover:scale-105 ${
                  isVisibleMobile ? 'inline-flex' : 'hidden'
                } ${isVisibleTablet ? 'sm:inline-flex' : 'sm:hidden'} ${isVisibleDesktop ? 'lg:inline-flex' : 'lg:hidden'}`}
              >
                {tag}
              </Chip>
            )
          })}
          {/* 数量提示 */}
          {item.tags.length > 1 && (
            <Chip
              size="sm"
              variant="flat"
              color="default"
              className="text-[9px] sm:text-[10px] md:text-xs h-3.5 sm:h-4 md:h-5 px-1 sm:px-1.5 md:px-2 text-default-500 bg-default-100/30 border border-default-200 sm:hidden"
            >
              +{item.tags.length - 1}
            </Chip>
          )}
          {item.tags.length > 2 && (
            <Chip
              size="sm"
              variant="flat"
              color="default"
              className="text-[9px] sm:text-[10px] md:text-xs h-3.5 sm:h-4 md:h-5 px-1 sm:px-1.5 md:px-2 text-default-500 bg-default-100/30 border border-default-200 hidden sm:inline-flex lg:hidden"
            >
              +{item.tags.length - 2}
            </Chip>
          )}
          {item.tags.length > 3 && (
            <Chip
              size="sm"
              variant="flat"
              color="default"
              className="text-[9px] sm:text-[10px] md:text-xs h-3.5 sm:h-4 md:h-5 px-1 sm:px-1.5 md:px-2 text-default-500 bg-default-100/30 border border-default-200 hidden lg:inline-flex"
            >
              +{item.tags.length - 3}
            </Chip>
          )}
        </div>
      </CardBody>
    </Card>
  )
}