'use client'

import { Card, CardBody, Button } from '@heroui/react'
import { Search } from 'lucide-react'

interface EmptyStateProps {
  onClearFilters: () => void
}

export function EmptyState({ onClearFilters }: EmptyStateProps) {
  return (
    <Card className="bg-white/5 backdrop-blur-xl border-white/10 shadow-2xl">
      <CardBody className="text-center py-16">
        <div className="flex flex-col items-center gap-6">
          <div className="relative">
            <div 
              className="w-24 h-24 rounded-2xl flex items-center justify-center shadow-xl backdrop-blur-sm border border-white/20"
              style={{
                background: `linear-gradient(to bottom right, rgba(var(--primary-color-rgb), 0.1), rgba(var(--secondary-color-rgb), 0.1))`
              }}
            >
              <Search className="w-12 h-12 text-default-600" />
            </div>
            <div 
              className="absolute -inset-4 rounded-2xl blur-xl opacity-50 animate-pulse"
              style={{
                background: `linear-gradient(to right, rgba(var(--primary-color-rgb), 0.2), rgba(var(--secondary-color-rgb), 0.2))`
              }}
            ></div>
          </div>
          <div>
            <h3 
              className="text-2xl font-bold text-foreground mb-3 bg-clip-text text-transparent"
              style={{
                backgroundImage: `linear-gradient(to right, var(--primary-color-light), var(--secondary-color))`
              }}
            >
              没有找到匹配的导航项目
            </h3>
            <p className="text-default-500 text-lg">尝试调整搜索关键词或筛选标签</p>
          </div>
          <Button
            color="primary"
            variant="flat"
            size="lg"
            onPress={onClearFilters}
          >
            清除筛选条件
          </Button>
        </div>
      </CardBody>
    </Card>
  )
}