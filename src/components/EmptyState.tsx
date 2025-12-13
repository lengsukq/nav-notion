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
            <div className="w-24 h-24 bg-gradient-to-br from-gray-600 to-gray-700 rounded-2xl flex items-center justify-center shadow-xl">
              <Search className="w-12 h-12 text-gray-300" />
            </div>
            <div className="absolute -inset-4 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-2xl blur-xl opacity-50 animate-pulse"></div>
          </div>
          <div>
            <h3 className="text-2xl font-bold text-white mb-3 bg-gradient-to-r from-gray-300 to-gray-400 bg-clip-text text-transparent">没有找到匹配的导航项目</h3>
            <p className="text-gray-400 text-lg">尝试调整搜索关键词或筛选标签</p>
          </div>
          <Button
            color="secondary"
            variant="bordered"
            size="lg"
            onPress={onClearFilters}
            className="bg-white/5 border-white/20 text-white hover:bg-white/10 hover:border-white/30 transition-all duration-300"
          >
            清除筛选条件
          </Button>
        </div>
      </CardBody>
    </Card>
  )
}