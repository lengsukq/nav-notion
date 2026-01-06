'use client'

import { useEffect } from 'react'

export function ThemeProvider() {
  useEffect(() => {
    // 在客户端设置初始主题
    const savedTheme = localStorage.getItem('theme') || 'light'
    document.documentElement.classList.remove('light', 'dark')
    document.documentElement.classList.add(savedTheme)
  }, [])

  return null
}

