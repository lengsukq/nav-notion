/**
 * 标签筛选组件
 */
'use client'

import { Chip, Button } from '@heroui/react'
import { theme as themeConfig } from '@/lib/theme'

interface TagFilterProps {
  selectedTag: string
  tags: string[]
  isSticky: boolean
  onTagChange: (tag: string) => void
  onClearFilters: () => void
}

export function TagFilter({
  selectedTag,
  tags,
  isSticky,
  onTagChange,
  onClearFilters
}: TagFilterProps) {
  const allTags = ['全部', ...tags]

  return (
    <div className={`${isSticky ? 'lg:flex-1' : 'w-full'} transition-all duration-500 ease-in-out`}>
      <div className={`${themeConfig.classes.card} ${themeConfig.classes.glassBg} border border-white/20 dark:border-white/10 rounded-2xl md:rounded-3xl ${isSticky ? 'p-1.5 md:p-2' : 'p-2 md:p-3'} shadow-xl transition-all duration-500 ease-in-out w-full`}>
        <div className="flex flex-col gap-1.5 md:gap-2">
          {!isSticky && (
            <div className="flex items-center justify-between gap-2 md:gap-3">
              <div className="flex items-center gap-2 md:gap-3">
                <h3 className="text-foreground font-medium text-xs md:text-sm">标签筛选</h3>
                <Chip
                  size="sm"
                  variant="flat"
                  className="text-xs h-5"
                >
                  {tags.length} 个
                </Chip>
              </div>
              {selectedTag && (
                <Button
                  size="sm"
                  color="primary"
                  variant="solid"
                  onPress={onClearFilters}
                  className="text-xs h-6 md:h-7 px-1.5 md:px-2 shrink-0"
                  style={{
                    backgroundColor: 'var(--primary-color)',
                    color: 'white'
                  }}
                >
                  清除
                </Button>
              )}
            </div>
          )}
          
          {/* 标签云 */}
          <div className={`flex flex-wrap gap-1 md:gap-1.5 ${isSticky ? 'justify-center lg:justify-start' : ''}`}>
            {allTags.map((tag, index) => {
              const isActive = selectedTag === tag || (tag === '全部' && !selectedTag)
              return (
                <Chip
                  key={tag}
                  onClick={() => onTagChange(tag === '全部' ? '' : tag)}
                  color={isActive ? 'secondary' : 'default'}
                  variant={isActive ? 'solid' : 'bordered'}
                  className={`cursor-pointer transition-all duration-300 hover:scale-105 text-xs ${
                    isActive 
                      ? 'text-white border-transparent shadow-lg' 
                      : 'bg-default-100/30 text-default-700 border-default-200 hover:bg-default-100/50 hover:border-default-300'
                  }`}
                  style={isActive ? {
                    background: `linear-gradient(to right, var(--primary-color), var(--secondary-color))`,
                    boxShadow: `0 10px 15px -3px rgba(var(--primary-color-rgb), 0.25)`,
                    animationDelay: `${index * 50}ms`
                  } : {
                    animationDelay: `${index * 50}ms`
                  }}
                  size="sm"
                >
                  {tag}
                </Chip>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}

