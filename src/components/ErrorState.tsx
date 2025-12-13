'use client'

import { Card, CardBody, Button } from '@heroui/react'
import { AlertCircle, RefreshCw } from 'lucide-react'
import { Link } from '@heroui/react'

interface ErrorStateProps {
  error: string
  onRetry: () => void
}

export function ErrorState({ error, onRetry }: ErrorStateProps) {
  return (
    <Card className="mb-6 bg-gradient-to-r from-red-500/10 to-orange-500/10 backdrop-blur-sm border-red-400/30">
      <CardBody className="p-6">
        <div className="flex items-start gap-4">
          <div className="flex-shrink-0 w-10 h-10 bg-red-500/20 rounded-full flex items-center justify-center">
            <AlertCircle className="w-5 h-5 text-red-400" />
          </div>
          <div className="flex-1">
            <h3 className="text-xl font-semibold text-white mb-2">获取数据失败</h3>
            <p className="text-gray-300 mb-4">{error}</p>
            
            <div className="bg-black/20 rounded-lg p-4 mb-4">
              <p className="text-gray-300 mb-3">请检查以下配置：</p>
              <ul className="space-y-2">
                <li className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 bg-red-400 rounded-full mt-2 flex-shrink-0"></div>
                  <span className="text-gray-400 text-sm">确保已正确设置环境变量 NOTION_TOKEN 和 NOTION_DATABASE_ID</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 bg-red-400 rounded-full mt-2 flex-shrink-0"></div>
                  <span className="text-gray-400 text-sm">确认 Notion 集成有访问数据库的权限</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 bg-red-400 rounded-full mt-2 flex-shrink-0"></div>
                  <span className="text-gray-400 text-sm">检查数据库结构是否符合要求</span>
                </li>
              </ul>
            </div>
            
            <div className="flex items-center gap-3">
              <Button
                color="danger"
                variant="bordered"
                startContent={<RefreshCw className="w-4 h-4" />}
                onPress={onRetry}
              >
                重新加载
              </Button>
              
              <Button
                color="secondary"
                variant="flat"
                as={Link}
                href="/setup"
              >
                查看配置指南
              </Button>
            </div>
          </div>
        </div>
      </CardBody>
    </Card>
  )
}