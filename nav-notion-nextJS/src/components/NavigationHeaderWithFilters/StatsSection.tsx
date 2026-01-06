/**
 * 统计信息组件
 */
'use client'

import { Chip } from '@heroui/react'

interface StatsSectionProps {
  isSticky: boolean
  totalCount: number
  tagCount: number
  currentPage: number
  totalPages: number
  filteredCount: number
  originalCount: number
}

export function StatsSection({
  isSticky,
  totalCount,
  tagCount,
  currentPage,
  totalPages,
  filteredCount,
  originalCount
}: StatsSectionProps) {
  return (
    <div 
      className={`w-full transition-all duration-500 ease-in-out overflow-hidden ${
        isSticky ? 'max-h-0 opacity-0 -translate-y-4 pointer-events-none' : 'max-h-[200px] opacity-100 translate-y-0'
      }`}
      style={{
        transitionProperty: 'max-height, opacity, transform',
        transitionTimingFunction: 'cubic-bezier(0.4, 0, 0.2, 1)'
      }}
    >
      <div className="flex flex-col lg:flex-row lg:items-start gap-3 md:gap-4">
        <div className="flex-1 min-w-0"></div>
        {/* 右侧：统计信息 */}
        <div className="lg:shrink-0 lg:ml-4">
          <div className="flex flex-wrap items-center gap-1.5 md:gap-2 lg:flex-col lg:items-end lg:gap-2">
            <Chip
              size="sm"
              variant="flat"
              color="success"
              startContent={
                <div className="w-1.5 h-1.5 md:w-2 md:h-2 bg-green-400 rounded-full animate-pulse" />
              }
              className="text-[10px] md:text-xs h-4 md:h-5"
            >
              系统正常
            </Chip>
            <Chip
              size="sm"
              variant="flat"
              className="text-[10px] md:text-xs h-4 md:h-5"
            >
              共 <span className="text-foreground font-medium">{totalCount}</span> 个导航
            </Chip>
            <Chip
              size="sm"
              variant="flat"
              className="text-[10px] md:text-xs h-4 md:h-5"
            >
              <span className="text-foreground font-medium">{tagCount}</span> 个标签
            </Chip>
            {totalPages > 1 && (
              <Chip
                size="sm"
                variant="flat"
                className="text-[10px] md:text-xs h-4 md:h-5"
              >
                第 <span className="text-foreground font-medium">{currentPage}</span> / <span className="text-foreground font-medium">{totalPages}</span> 页
              </Chip>
            )}
            {filteredCount !== originalCount && (
              <Chip
                size="sm"
                variant="flat"
                className="text-[10px] md:text-xs h-4 md:h-5"
              >
                显示 <span className="text-foreground font-medium">{filteredCount}</span> 个结果
              </Chip>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

