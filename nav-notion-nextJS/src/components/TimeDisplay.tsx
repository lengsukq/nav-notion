'use client'

import { useState, useEffect } from 'react'
import { Clock } from 'lucide-react'
import { theme as themeConfig, glassStyle } from '@/lib/theme'

interface TimeDisplayProps {
  currentTime: Date
  showDate?: boolean
  size?: 'sm' | 'md' | 'lg'
}

export function TimeDisplay({ 
  currentTime, 
  showDate = true,
  size = 'lg'
}: TimeDisplayProps) {
  const [time, setTime] = useState(currentTime)

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date())
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  const formatTime = () => {
    const hours = String(time.getHours()).padStart(2, '0')
    const minutes = String(time.getMinutes()).padStart(2, '0')
    const seconds = String(time.getSeconds()).padStart(2, '0')
    return `${hours}:${minutes}:${seconds}`
  }

  const formatDate = () => {
    const year = time.getFullYear()
    const month = String(time.getMonth() + 1).padStart(2, '0')
    const day = String(time.getDate()).padStart(2, '0')
    return `${year}-${month}-${day}`
  }

  // 响应式尺寸配置 - 根据屏幕大小自适应
  const sizeClasses = {
    sm: {
      icon: 'w-3 h-3',
      time: 'text-[10px]',
      date: 'text-[8px]',
      container: 'px-2 py-1 gap-1',
      gap: 'gap-1'
    },
    md: {
      icon: 'w-4 h-4',
      time: 'text-xs sm:text-sm',
      date: 'text-[10px] sm:text-xs',
      container: 'px-2.5 py-1.5 sm:px-3 sm:py-2 gap-1.5 sm:gap-2',
      gap: 'gap-1.5 sm:gap-2'
    },
    lg: {
      // 图标：小屏4x4，中屏5x5，大屏6x6
      icon: 'w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6',
      // 时间：小屏sm，中屏base，大屏lg/xl，超大屏2xl
      time: 'text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl font-semibold',
      // 日期：小屏隐藏或极小，中屏xs，大屏sm
      date: 'text-[10px] sm:text-xs md:text-sm',
      // 容器：小屏紧凑，中屏适中，大屏宽松
      container: 'px-2.5 py-1.5 sm:px-3 sm:py-2 md:px-4 md:py-2.5 lg:px-5 lg:py-3 gap-1.5 sm:gap-2 md:gap-3',
      gap: 'gap-1.5 sm:gap-2 md:gap-3'
    }
  }

  const classes = sizeClasses[size]

  return (
    <div 
      className={`
        flex items-center ${classes.container}
        ${themeConfig.classes.card} ${themeConfig.classes.glassBg}
        ${themeConfig.classes.rounded.card}
        border border-white/20 dark:border-white/10
        shadow-xl transition-all duration-300
        hover:shadow-[0_12px_40px_rgba(var(--primary-color-rgb),0.15)]
        hover:border-[var(--primary-color)]/30
        hover:scale-[1.02]
      `}
      style={glassStyle}
    >
      <Clock 
        className={`${classes.icon} shrink-0`}
        style={{ color: 'var(--primary-color)' }}
      />
      <div className={`flex flex-col items-start ${classes.gap} min-w-0`}>
        <div 
          className={`${classes.time} font-mono tracking-wider leading-tight`}
          style={{
            background: `linear-gradient(to right, var(--primary-color), var(--secondary-color))`,
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text'
          }}
        >
          {formatTime()}
        </div>
        {showDate && (
          <div className={`${classes.date} text-default-600 font-medium leading-tight hidden sm:block`}>
            {formatDate()}
          </div>
        )}
      </div>
    </div>
  )
}

