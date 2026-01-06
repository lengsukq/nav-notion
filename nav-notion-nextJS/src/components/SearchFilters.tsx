'use client'

import { Card, CardBody, Input, Button, Chip } from '@heroui/react'
import { Pagination } from '@heroui/react'
import { Search } from 'lucide-react'

interface SearchFiltersProps {
  searchTerm: string
  selectedTag: string
  tags: string[]
  filteredCount: number
  originalCount: number
  currentPage: number
  totalPages: number
  itemsPerPage: number
  onSearchChange: (term: string) => void
  onTagChange: (tag: string) => void
  onClearFilters: () => void
  onPageChange: (page: number) => void
}

export function SearchFilters({
  searchTerm,
  selectedTag,
  tags,
  filteredCount,
  originalCount,
  currentPage,
  totalPages,
  itemsPerPage,
  onSearchChange,
  onTagChange,
  onClearFilters,
  onPageChange
}: SearchFiltersProps) {
  const allTags = ['全部', ...tags]

  return (
    <div className="sticky top-2 md:top-4 z-50 mb-4 md:mb-6">
      <Card className="bg-white/10 backdrop-blur-xl border-white/20 shadow-2xl shadow-black/20">
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
                    inputWrapper: 'bg-white/10 border-white/20 hover:bg-white/15 focus-within:bg-white/15 transition-all duration-200 h-10 md:h-12 [&:focus-within]:border-[var(--primary-color)]'
                  }}
                  size="lg"
                />
                {searchTerm && (
                  <div 
                    className="absolute inset-0 rounded-lg blur-xl -z-10 animate-pulse"
                    style={{
                      background: `linear-gradient(to right, rgba(var(--primary-color-rgb), 0.1), rgba(var(--secondary-color-rgb), 0.1))`
                    }}
                  ></div>
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
                            ? 'text-white border-transparent shadow-lg' 
                            : 'bg-white/5 text-gray-300 border-white/10 hover:bg-white/10 hover:border-white/20'
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
          


          {/* 分页组件 */}
          {totalPages > 1 && (
            <div className="flex justify-center mt-4 pt-3 border-t border-white/10">
              <Pagination
                total={totalPages}
                page={currentPage}
                onChange={onPageChange}
                showControls
                showShadow={false}
                color="secondary"
                size="sm"
                classNames={{
                  item: [
                    "bg-white/10 text-gray-300 border-white/20",
                    "hover:bg-white/15 hover:text-white hover:border-white/30",
                    "data-[active=true]:text-white data-[active=true]:border-transparent",
                    "transition-all duration-200"
                  ].join(" "),
                  cursor: "[&>span]:bg-gradient-to-r [&>span]:from-[var(--primary-color)] [&>span]:to-[var(--secondary-color)]",
                  prev: "bg-white/5 text-gray-300 hover:bg-white/10 border-white/20",
                  next: "bg-white/5 text-gray-300 hover:bg-white/10 border-white/20"
                }}
              />
            </div>
          )}
        </CardBody>
      </Card>
    </div>
  )
}