/**
 * 吸顶时的标题栏组件
 */
'use client'

import { useTheme } from '@/hooks/useTheme'
import { IconButton } from '@/components/IconButton'
import { Github, RefreshCw, Settings, Sun, Moon } from 'lucide-react'

interface StickyHeaderProps {
  title: string
  refreshing: boolean
  isSticky: boolean
  onRefresh: () => void
  onSettingsClick?: () => void
}

export function StickyHeader({
  title,
  refreshing,
  isSticky,
  onRefresh,
  onSettingsClick
}: StickyHeaderProps) {
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
      className={`flex items-center justify-between gap-2 sm:gap-3 mb-2 transition-all duration-500 ease-in-out overflow-hidden ${
        isSticky ? 'max-h-[100px] opacity-100 translate-y-0' : 'max-h-0 opacity-0 -translate-y-4 pointer-events-none'
      }`}
      style={{
        transitionProperty: 'max-height, opacity, transform',
        transitionTimingFunction: 'cubic-bezier(0.4, 0, 0.2, 1)'
      }}
    >
      {/* 标题 - 小屏幕隐藏 */}
      <h1 
        className="hidden sm:block font-bold text-lg sm:text-xl text-foreground bg-clip-text text-transparent truncate flex-1"
        style={{
          backgroundImage: `linear-gradient(to right, var(--primary-color-light), var(--secondary-color))`
        }}
      >
        {title}
      </h1>
      {/* 操作按钮组 - 小屏幕只显示核心按钮 */}
      <div className="flex items-center gap-1.5 sm:gap-2 ml-auto">
        {iconButtons.map((button) => (
          <div
            key={button.key}
            className={button.key === 'github' ? 'hidden sm:block' : ''}
          >
            <IconButton
              icon={button.icon}
              onPress={button.onPress}
              isLoading={button.isLoading}
              title={button.title}
              styleVariant={button.styleVariant}
              href={button.href}
              target={button.target}
              rel={button.rel}
            />
          </div>
        ))}
      </div>
    </div>
  )
}

