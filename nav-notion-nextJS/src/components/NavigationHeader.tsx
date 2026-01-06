'use client'

import { Card, CardBody, Button, Chip, Avatar, Dropdown } from '@heroui/react'
import { DropdownMenu, DropdownItem, DropdownTrigger } from '@heroui/react'
import { Github, RefreshCw, Clock, MoreVertical, Settings, Sun, Moon } from 'lucide-react'
import { Link } from '@heroui/react'
import { useTheme } from '@/hooks/useTheme'
import { theme as themeConfig } from '@/lib/theme'

interface NavigationHeaderProps {
  currentTime: Date
  refreshing: boolean
  totalCount: number
  tagCount: number
  filteredCount: number
  originalCount: number
  currentPage: number
  totalPages: number
  itemsPerPage: number
  onRefresh: () => void
  onSettingsClick?: () => void
}

export function NavigationHeader({
  currentTime,
  refreshing,
  totalCount,
  tagCount,
  filteredCount,
  originalCount,
  currentPage,
  totalPages,
  itemsPerPage,
  onRefresh,
  onSettingsClick
}: NavigationHeaderProps) {
  const { theme, toggleTheme } = useTheme()

  return (
    <Card className={`${themeConfig.classes.card} ${themeConfig.classes.rounded.card} overflow-hidden`} classNames={{ base: themeConfig.classes.rounded.card }}>
      <CardBody className="p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3 sm:gap-4">
            <Avatar
              name="N"
              size="sm"
              style={{
                background: `linear-gradient(to right, var(--primary-color), var(--secondary-color))`,
                boxShadow: `0 10px 15px -3px rgba(var(--primary-color-rgb), 0.25)`
              }}
            />
            <div className="min-w-0">
              <h1 
                className="text-xl sm:text-2xl lg:text-3xl xl:text-4xl font-bold text-foreground bg-clip-text text-transparent truncate"
                style={{
                  backgroundImage: `linear-gradient(to right, var(--primary-color-light), var(--secondary-color))`
                }}
              >
                导航管理
              </h1>
              <p className="text-default-600 text-xs sm:text-sm lg:text-base xl:text-lg mt-1 hidden sm:block">基于 Notion 的导航管理系统</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2 sm:gap-3">
            <Button
              isIconOnly
              variant="flat"
              color="primary"
              onPress={onRefresh}
              isLoading={refreshing}
              size="sm"
              className="text-primary"
              style={{
                backgroundColor: 'rgba(var(--primary-color-rgb), 0.1)'
              }}
            >
              <RefreshCw className="w-4 h-4 sm:w-5 sm:h-5" />
            </Button>
            
            <Button
              isIconOnly
              variant="flat"
              color="primary"
              onPress={toggleTheme}
              size="sm"
              title={theme === 'light' ? '切换到深色模式' : '切换到浅色模式'}
              className="text-primary"
              style={{
                backgroundColor: 'rgba(var(--primary-color-rgb), 0.1)'
              }}
            >
              {theme === 'light' ? (
                <Moon className="w-4 h-4 sm:w-5 sm:h-5" />
              ) : (
                <Sun className="w-4 h-4 sm:w-5 sm:h-5" />
              )}
            </Button>
            
            {onSettingsClick && (
              <Button
                isIconOnly
                variant="flat"
                color="primary"
                onPress={onSettingsClick}
                className="settings-button text-primary"
                size="sm"
                style={{
                  backgroundColor: 'rgba(var(--primary-color-rgb), 0.1)'
                }}
              >
                <Settings className="w-4 h-4 sm:w-5 sm:h-5" />
              </Button>
            )}
            
            <Dropdown>
              <DropdownTrigger>
                <Button
                  isIconOnly
                  variant="flat"
                  color="primary"
                  size="sm"
                  className="text-primary"
                  style={{
                    backgroundColor: 'rgba(var(--primary-color-rgb), 0.1)'
                  }}
                >
                  <MoreVertical className="w-4 h-4 sm:w-5 sm:h-5" />
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
                  href="https://github.com/lengsukq/nav-notion/tree/nextjs-migration"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  查看 GitHub
                </DropdownItem>
              </DropdownMenu>
            </Dropdown>
            
            <Chip
              startContent={<Clock className="w-4 h-4" />}
              classNames={{
                base: "backdrop-blur-sm",
                content: "font-mono text-sm text-foreground"
              }}
              style={{
                background: `linear-gradient(to right, rgba(var(--primary-color-rgb), 0.2), rgba(var(--secondary-color-rgb), 0.2))`,
                borderColor: `rgba(var(--primary-color-rgb), 0.3)`
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
        <div className="mt-4 sm:mt-6 pt-4 sm:pt-6 border-t border-white/10">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-0">
            <div className="flex flex-wrap items-center gap-3 sm:gap-6">
              <Chip
                size="sm"
                variant="flat"
                color="success"
                startContent={
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                }
                className="text-xs sm:text-sm"
              >
                系统正常
              </Chip>
              <Chip
                size="sm"
                variant="flat"
                className="text-xs sm:text-sm"
              >
                共 <span className="text-foreground font-medium">{totalCount}</span> 个导航
              </Chip>
              <Chip
                size="sm"
                variant="flat"
                className="text-xs sm:text-sm"
              >
                <span className="text-foreground font-medium">{tagCount}</span> 个标签
              </Chip>
              {totalPages > 1 && (
                <Chip
                  size="sm"
                  variant="flat"
                  className="text-xs sm:text-sm"
                >
                  第 <span className="text-foreground font-medium">{currentPage}</span> / <span className="text-foreground font-medium">{totalPages}</span> 页
                </Chip>
              )}
            </div>
            
            {filteredCount !== originalCount && (
              <Chip
                size="sm"
                variant="flat"
                className="text-xs sm:text-sm"
              >
                显示 <span className="text-foreground font-medium">{filteredCount}</span> 个结果
              </Chip>
            )}
          </div>
        </div>
      </CardBody>
    </Card>
  )
}