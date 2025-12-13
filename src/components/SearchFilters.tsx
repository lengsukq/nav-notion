'use client'

import { Card, CardBody, Input, Button, Chip } from '@heroui/react'
import { Search } from 'lucide-react'

interface SearchFiltersProps {
  searchTerm: string
  selectedTag: string
  tags: string[]
  filteredCount: number
  originalCount: number
  onSearchChange: (term: string) => void
  onTagChange: (tag: string) => void
  onClearFilters: () => void
}

export function SearchFilters({
  searchTerm,
  selectedTag,
  tags,
  filteredCount,
  originalCount,
  onSearchChange,
  onTagChange,
  onClearFilters
}: SearchFiltersProps) {
  const allTags = ['全部', ...tags]

  return (
    <div className="sticky top-2 md:top-4 z-50 mb-4 md:mb-6">
      <Card className="bg-white/10 backdrop-blur-xl border-white/20 shadow-2xl shadow-black/20 mx-2 md:mx-0">
        <CardBody className="p-3 md:p-4">
          <div className="flex flex-col lg:flex-row gap-3 md:gap-4">
            {/* 搜索输入框 */}
            <div className="w-full lg:w-1/3">
              <div className="relative">
                <Input
                  placeholder="搜索导航..."
                  value={searchTerm}
                  onValueChange={onSearchChange}
                  startContent={
                    <Search className="w-4 h-4 md:w-5 md:h-5 text-gray-400" />
                  }
                  endContent={
                    searchTerm && (
                      <Button
                        isIconOnly
                        size="sm"
                        variant="light"
                        onPress={() => onSearchChange('')}
                        className="text-gray-400 hover:text-white min-w-7 w-7 h-7 md:min-w-8 md:w-8 md:h-8"
                      >
                        ×
                      </Button>
                    )
                  }
                  classNames={{
                    input: 'text-white placeholder:text-gray-400 text-sm md:text-base',
                    inputWrapper: 'bg-white/10 border-white/20 hover:bg-white/15 focus-within:bg-white/15 focus-within:border-purple-400/50 transition-all duration-200 h-10 md:h-12'
                  }}
                  size="lg"
                />
                {searchTerm && (
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-lg blur-xl -z-10 animate-pulse"></div>
                )}
              </div>
            </div>
            
            {/* 标签筛选区域 */}
            <div className="flex-1">
              <div className="flex flex-col gap-2 md:gap-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 md:gap-3">
                    <h3 className="text-white font-medium text-xs md:text-sm">标签筛选</h3>
                    <span className="text-xs text-gray-400 bg-white/10 px-2 py-0.5 rounded-full">
                      {tags.length} 个
                    </span>
                  </div>
                  {selectedTag && (
                    <Button
                      size="sm"
                      color="secondary"
                      variant="flat"
                      onPress={onClearFilters}
                      className="text-xs bg-white/5 hover:bg-white/10 border-white/20 h-6 md:h-7 px-1.5 md:px-2"
                    >
                      清除
                    </Button>
                  )}
                </div>
                
                {/* 标签云 */}
                <div className="flex flex-wrap gap-1 md:gap-1.5">
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
                            ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white border-transparent shadow-lg shadow-purple-500/25' 
                            : 'bg-white/5 text-gray-300 border-white/10 hover:bg-white/10 hover:border-white/20'
                        }`}
                        style={{
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
          
          {/* 筛选结果统计 */}
          <div className="flex items-center justify-between pt-2 md:pt-3 mt-3 md:mt-4 border-t border-white/10">
            <span className="text-xs md:text-sm text-gray-400">
              {filteredCount !== originalCount ? '筛选结果' : `共 ${tags.length} 个标签`}
            </span>
            <div className="flex items-center gap-2">
              {filteredCount !== originalCount && (
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              )}
              <span className="text-xs md:text-sm text-white font-medium">
                {filteredCount !== originalCount 
                  ? `${filteredCount} / ${originalCount}`
                  : `共 ${originalCount} 个导航`
                }
              </span>
            </div>
          </div>
        </CardBody>
      </Card>
    </div>
  )
}