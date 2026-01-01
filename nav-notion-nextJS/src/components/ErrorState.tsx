'use client'

import { Alert, Button } from '@heroui/react'
import { RefreshCw, AlertCircle } from 'lucide-react'
import { Link } from '@heroui/react'

interface ErrorStateProps {
  error: string
  onRetry: () => void
}

export function ErrorState({ error, onRetry }: ErrorStateProps) {
  return (
    <Alert
      color="danger"
      variant="bordered"
      title="获取数据失败"
      description={error}
      className="mb-6"
      icon={<AlertCircle className="w-5 h-5" />}
    >
      <div className="mt-4 space-y-2">
        <p className="text-gray-300 text-sm">请检查以下配置：</p>
        <ul className="space-y-1 ml-4">
          <li className="text-gray-400 text-xs">• 确保已正确设置环境变量 NOTION_TOKEN 和 NOTION_DATABASE_ID</li>
          <li className="text-gray-400 text-xs">• 确认 Notion 集成有访问数据库的权限</li>
          <li className="text-gray-400 text-xs">• 检查数据库结构是否符合要求</li>
        </ul>
        
        <div className="flex items-center gap-3 mt-4">
          <Button
            color="danger"
            variant="bordered"
            startContent={<RefreshCw className="w-4 h-4" />}
            onPress={onRetry}
            size="sm"
          >
            重新加载
          </Button>
          
          <Button
            color="secondary"
            variant="flat"
            as={Link}
            href="/setup"
            size="sm"
          >
            查看配置指南
          </Button>
        </div>
      </div>
    </Alert>
  )
}