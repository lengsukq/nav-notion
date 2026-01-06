/**
 * 顶部区域组件 - 标题、描述、时间、操作按钮
 */
'use client'

import { Avatar, Chip } from '@heroui/react'
import { useTheme } from '@/hooks/useTheme'
import { IconButton } from '@/components/IconButton'
import { TimeDisplay } from '@/components/TimeDisplay'
import { theme as themeConfig, glassStyle } from '@/lib/theme'
import { Github, RefreshCw, Settings, Sun, Moon } from 'lucide-react'

interface HeaderTopProps {
  title: string
  description: string
  currentTime: Date
  refreshing: boolean
  isSticky: boolean
  onRefresh: () => void
  onSettingsClick?: () => void
  totalCount?: number
  tagCount?: number
  currentPage?: number
  totalPages?: number
  filteredCount?: number
  originalCount?: number
}

export function HeaderTop({
  title,
  description,
  currentTime,
  refreshing,
  isSticky,
  onRefresh,
  onSettingsClick,
  totalCount = 0,
  tagCount = 0,
  currentPage = 1,
  totalPages = 1,
  filteredCount = 0,
  originalCount = 0
}: HeaderTopProps) {
  const { theme, toggleTheme } = useTheme()

  // 图标按钮配置
  const iconButtons = [
    {
      key: 'refresh',
      icon: <RefreshCw className="w-4 h-4 sm:w-5 sm:h-5" />,
      onPress: onRefresh,
      isLoading: refreshing,
      styleVariant: 'default' as const
    },
    {
      key: 'theme',
      icon: theme === 'light' ? (
        <Moon className="w-4 h-4 sm:w-5 sm:h-5" />
      ) : (
        <Sun className="w-4 h-4 sm:w-5 sm:h-5" />
      ),
      onPress: toggleTheme,
      title: theme === 'light' ? '切换到深色模式' : '切换到浅色模式',
      styleVariant: 'default' as const
    },
    ...(onSettingsClick ? [{
      key: 'settings',
      icon: <Settings className="w-4 h-4 sm:w-5 sm:h-5" />,
      onPress: onSettingsClick,
      styleVariant: 'settings' as const
    }] : []),
    {
      key: 'github',
      icon: <Github className="w-4 h-4 sm:w-5 sm:h-5" />,
      href: 'https://github.com/lengsukq',
      target: '_blank',
      rel: 'noopener noreferrer',
      styleVariant: 'default' as const
    }
  ] as Array<{
    key: string
    icon: React.ReactNode
    onPress?: () => void
    isLoading?: boolean
    title?: string
    styleVariant?: 'default' | 'settings'
    href?: string
    target?: string
    rel?: string
  }>

  return (
    <div 
      className={`flex flex-col lg:flex-row lg:items-center justify-between gap-4 sm:gap-6 transition-all duration-500 ease-in-out overflow-hidden ${
        isSticky ? 'mb-0 max-h-0 opacity-0 -translate-y-4 pointer-events-none' : 'mb-4 md:mb-6 max-h-[500px] opacity-100 translate-y-0'
      }`}
      style={{
        transitionProperty: 'max-height, opacity, transform, margin-bottom',
        transitionTimingFunction: 'cubic-bezier(0.4, 0, 0.2, 1)'
      }}
    >
      {/* 左侧：标题和描述 */}
      <div className="flex items-center gap-3 sm:gap-4 md:gap-5 flex-1 min-w-0">
        <Avatar
          name="N"
          size="md"
          className="shrink-0 w-12 h-12"
          style={{
            background: `linear-gradient(to right, var(--primary-color), var(--secondary-color))`,
            boxShadow: `0 10px 15px -3px rgba(var(--primary-color-rgb), 0.25)`
          }}
        />
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-3 sm:gap-4 flex-wrap">
            <h1 
              className="font-bold text-2xl sm:text-3xl md:text-4xl lg:text-5xl text-foreground bg-clip-text text-transparent truncate leading-tight"
              style={{
                backgroundImage: `linear-gradient(to right, var(--primary-color-light), var(--secondary-color))`
              }}
            >
              {title}
            </h1>
            {/* 统计信息 - 横向排列在标题右侧 */}
            <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
              <Chip
                size="sm"
                variant="flat"
                className="text-[10px] sm:text-xs h-5 sm:h-6"
              >
                共 <span className="text-foreground font-medium">{totalCount}</span> 个导航
              </Chip>
              <Chip
                size="sm"
                variant="flat"
                className="text-[10px] sm:text-xs h-5 sm:h-6"
              >
                <span className="text-foreground font-medium">{tagCount}</span> 个标签
              </Chip>
              {totalPages > 1 && (
                <Chip
                  size="sm"
                  variant="flat"
                  className="text-[10px] sm:text-xs h-5 sm:h-6"
                >
                  第 <span className="text-foreground font-medium">{currentPage}</span> / <span className="text-foreground font-medium">{totalPages}</span> 页
                </Chip>
              )}
              {filteredCount !== originalCount && (
                <Chip
                  size="sm"
                  variant="flat"
                  className="text-[10px] sm:text-xs h-5 sm:h-6"
                >
                  显示 <span className="text-foreground font-medium">{filteredCount}</span> 个结果
                </Chip>
              )}
            </div>
          </div>
          <p className="text-default-600 mt-1.5 sm:mt-2 leading-relaxed hidden sm:block text-sm sm:text-base md:text-lg lg:text-xl">
            {description}
          </p>
        </div>
      </div>
      
      {/* 右侧：时间显示和操作按钮 */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-3 md:gap-4 shrink-0">
        {/* 时间显示和在线状态组合 */}
        <div className="flex items-center gap-2 sm:gap-3 w-full sm:w-auto">
          <TimeDisplay currentTime={currentTime} size="lg" />
          {/* 在线状态指示器 - 使用与时间组件一致的样式 */}
          <div 
            className={`
              flex items-center gap-1.5 sm:gap-2 
              px-2 py-1.5 sm:px-3 sm:py-2 
              ${themeConfig.classes.rounded.card}
              ${themeConfig.classes.card} ${themeConfig.classes.glassBg}
              border border-white/20 dark:border-white/10
              shadow-xl transition-all duration-300
              hover:shadow-[0_12px_40px_rgba(var(--primary-color-rgb),0.15)]
              hover:border-[var(--primary-color)]/30
              hover:scale-[1.02]
            `}
            style={glassStyle}
          >
            <div className="w-2 h-2 sm:w-2.5 sm:h-2.5 bg-green-400 rounded-full animate-pulse shadow-lg shadow-green-400/50 shrink-0" />
            <span className="hidden sm:inline text-xs sm:text-sm md:text-base text-default-600 font-medium whitespace-nowrap">在线</span>
          </div>
        </div>
        
        {/* 操作按钮组 */}
        <div className="flex items-center gap-2 sm:gap-3 w-full sm:w-auto justify-start sm:justify-end">
          {iconButtons.map((button) => (
            <IconButton
              key={button.key}
              icon={button.icon}
              onPress={button.onPress}
              isLoading={button.isLoading}
              title={button.title}
              styleVariant={button.styleVariant}
              href={button.href}
              target={button.target}
              rel={button.rel}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

