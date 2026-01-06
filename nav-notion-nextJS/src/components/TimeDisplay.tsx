'use client'

import { useState, useEffect } from 'react'
import { Clock } from 'lucide-react'
import { theme as themeConfig } from '@/lib/theme'

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

  const sizeClasses = {
    sm: {
      icon: 'w-3 h-3',
      time: 'text-xs',
      date: 'text-[10px]',
      container: 'px-2 py-1 gap-1.5'
    },
    md: {
      icon: 'w-4 h-4',
      time: 'text-sm',
      date: 'text-xs',
      container: 'px-3 py-1.5 gap-2'
    },
    lg: {
      icon: 'w-5 h-5 sm:w-6 sm:h-6',
      time: 'text-base sm:text-lg md:text-xl font-semibold',
      date: 'text-xs sm:text-sm',
      container: 'px-4 py-2 sm:px-5 sm:py-2.5 gap-2 sm:gap-3'
    }
  }

  const classes = sizeClasses[size]

  return (
    <div 
      className={`
        flex items-center ${classes.container}
        ${themeConfig.classes.card} ${themeConfig.classes.rounded.medium}
        backdrop-blur-md border border-white/30 dark:border-white/20
        shadow-lg transition-all duration-300 hover:shadow-xl
      `}
      style={{
        background: `
          linear-gradient(145deg, 
            rgba(255, 255, 255, 0.25) 0%, 
            rgba(255, 255, 255, 0.15) 100%
          ),
          linear-gradient(to bottom right, 
            rgba(var(--primary-color-rgb), 0.1), 
            rgba(var(--secondary-color-rgb), 0.05)
          )
        `,
        borderColor: 'rgba(var(--primary-color-rgb), 0.2)',
        boxShadow: `
          0 8px 32px rgba(var(--primary-color-rgb), 0.15),
          0 4px 16px rgba(var(--primary-color-rgb), 0.1)
        `
      }}
    >
      <Clock 
        className={`${classes.icon} text-primary`}
        style={{ color: 'var(--primary-color)' }}
      />
      <div className="flex flex-col items-start">
        <div 
          className={`${classes.time} font-mono tracking-wider text-foreground`}
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
          <div className={`${classes.date} text-default-600 font-medium`}>
            {formatDate()}
          </div>
        )}
      </div>
    </div>
  )
}

