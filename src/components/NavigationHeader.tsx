'use client'

import { Card, CardBody, Button, Chip, Avatar, Dropdown } from '@heroui/react'
import { DropdownMenu, DropdownItem, DropdownTrigger } from '@heroui/react'
import { Github, RefreshCw, HelpCircle, Clock, MoreVertical, Settings, Info } from 'lucide-react'
import { Link } from '@heroui/react'

interface NavigationHeaderProps {
  currentTime: Date
  refreshing: boolean
  totalCount: number
  tagCount: number
  filteredCount: number
  originalCount: number
  onRefresh: () => void
  onShowSettings?: () => void
  onShowAbout?: () => void
}

export function NavigationHeader({
  currentTime,
  refreshing,
  totalCount,
  tagCount,
  filteredCount,
  originalCount,
  onRefresh,
  onShowSettings,
  onShowAbout
}: NavigationHeaderProps) {
  return (
    <Card className="bg-white/10 backdrop-blur-sm border-white/20 overflow-hidden">
      <CardBody className="p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Avatar
              name="N"
              size="lg"
              classNames={{
                base: "bg-gradient-to-r from-blue-500 to-purple-600 shadow-lg shadow-purple-500/25"
              }}
            />
            <div>
              <h1 className="text-4xl font-bold text-white bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                导航管理
              </h1>
              <p className="text-gray-300 text-lg mt-1">基于 Notion 的导航管理系统</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <Button
              isIconOnly
              variant="flat"
              color="secondary"
              onPress={onRefresh}
              isLoading={refreshing}
              className="text-gray-300"
              size="lg"
            >
              <RefreshCw className="w-5 h-5" />
            </Button>
            
            <Dropdown>
              <DropdownTrigger>
                <Button
                  isIconOnly
                  variant="flat"
                  color="secondary"
                  className="text-gray-300"
                  size="lg"
                >
                  <MoreVertical className="w-5 h-5" />
                </Button>
              </DropdownTrigger>
              <DropdownMenu 
                aria-label="操作菜单"
                variant="flat"
              >
                <DropdownItem
                  key="github"
                  startContent={<Github className="w-4 h-4" />}
                  as={Link}
                  href="https://github.com"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  查看 GitHub
                </DropdownItem>
                <DropdownItem
                  key="setup"
                  startContent={<HelpCircle className="w-4 h-4" />}
                  as={Link}
                  href="/setup"
                >
                  配置指南
                </DropdownItem>
                <DropdownItem
                  key="settings"
                  startContent={<Settings className="w-4 h-4" />}
                  onPress={() => onShowSettings?.()}
                  className={!onShowSettings ? 'hidden' : ''}
                >
                  设置
                </DropdownItem>
                <DropdownItem
                  key="about"
                  startContent={<Info className="w-4 h-4" />}
                  onPress={() => onShowAbout?.()}
                  className={!onShowAbout ? 'hidden' : ''}
                >
                  关于
                </DropdownItem>
              </DropdownMenu>
            </Dropdown>
            
            <Chip
              startContent={<Clock className="w-4 h-4" />}
              classNames={{
                base: "bg-gradient-to-r from-purple-500/20 to-pink-500/20 backdrop-blur-sm border-purple-400/30",
                content: "font-mono text-sm text-white"
              }}
              variant="bordered"
            >
              {currentTime.toLocaleTimeString('zh-CN', {
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit'
              })}
            </Chip>
          </div>
        </div>
        
        {/* Stats Bar */}
        <div className="mt-6 pt-6 border-t border-white/10">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                <span className="text-gray-300 text-sm">系统正常</span>
              </div>
              <div className="text-gray-400 text-sm">
                共 <span className="text-white font-medium">{totalCount}</span> 个导航
              </div>
              <div className="text-gray-400 text-sm">
                <span className="text-white font-medium">{tagCount}</span> 个标签
              </div>
            </div>
            
            {filteredCount !== originalCount && (
              <div className="text-gray-400 text-sm">
                显示 <span className="text-white font-medium">{filteredCount}</span> 个结果
              </div>
            )}
          </div>
        </div>
      </CardBody>
    </Card>
  )
}