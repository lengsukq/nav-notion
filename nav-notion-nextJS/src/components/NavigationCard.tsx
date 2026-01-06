'use client'

import { Card, CardBody, Chip } from '@heroui/react'
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
      className="group relative overflow-hidden p-0 cursor-pointer transition-all duration-500 ease-out animate-fade-in"
      style={{
        animationDelay: `${index * 30}ms`,
        backdropFilter: 'blur(20px) saturate(150%)',
        background: `
          linear-gradient(145deg, rgba(255, 255, 255, 0.25) 0%, rgba(255, 255, 255, 0.08) 100%),
          linear-gradient(to bottom right, rgba(var(--primary-color-rgb), 0.03), transparent)
        `,
        borderColor: 'rgba(255, 255, 255, 0.3)',
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
      
      <CardBody className="relative z-10 h-full flex flex-col p-4 md:p-5 min-h-[200px]">
        {/* 标题区域 */}
        <div className="flex-1 min-h-0 mb-2">
          <div className="flex items-start justify-between gap-2">
            <h3 className="text-base md:text-lg lg:text-xl font-bold leading-tight line-clamp-2 text-foreground transition-all duration-300">
              {item.title}
            </h3>
            {/* 状态指示器 */}
            <div className="flex items-center gap-1 shrink-0 mt-0.5">
              <div 
                className="w-2 h-2 rounded-full animate-pulse shadow-lg"
                style={{
                  backgroundColor: 'var(--primary-color)',
                  boxShadow: '0 0 8px rgba(var(--primary-color-rgb), 0.6)'
                }}
              />
            </div>
          </div>
          
          {/* 装饰线 */}
          <div 
            className="w-8 h-0.5 rounded-full transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 mt-2"
            style={{
              background: `linear-gradient(to right, var(--primary-color), var(--secondary-color))`
            }}
          />
        </div>
        
        {/* 描述区域 */}
        <p className="text-xs md:text-sm text-default-600 leading-relaxed line-clamp-2 mb-3 flex-shrink-0">
          {item.description}
        </p>
        
        {/* 标签区域 */}
        <div className="mt-auto pt-2 flex flex-wrap gap-1.5 shrink-0">
          {item.tags.slice(0, 3).map((tag) => (
            <Chip
              key={tag}
              size="sm"
              variant="flat"
              color="primary"
              className="text-[10px] md:text-xs h-5 px-2 border border-primary/30 bg-primary/10 hover:bg-primary/20 hover:border-primary/50 transition-all duration-300 hover:scale-105"
            >
              {tag}
            </Chip>
          ))}
          {item.tags.length > 3 && (
            <Chip
              size="sm"
              variant="flat"
              color="default"
              className="text-[10px] md:text-xs h-5 px-2 text-default-500 bg-default-100/30 border border-default-200"
            >
              +{item.tags.length - 3}
            </Chip>
          )}
        </div>
      </CardBody>
    </Card>
  )
}