'use client'

import { Clock } from 'lucide-react'
import { useState, useEffect } from 'react'
import { Chip } from '@heroui/react'

export function TimeDisplay() {
  const [time, setTime] = useState(new Date())

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date())
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  const timeString = time.toLocaleTimeString('zh-CN', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  })

  return (
    <Chip
      startContent={<Clock className="w-4 h-4" />}
      classNames={{
        base: "bg-white/10 backdrop-blur-sm border-white/20",
        content: "font-mono text-sm"
      }}
    >
      {timeString}
    </Chip>
  )
}