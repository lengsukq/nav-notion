'use client'

import { useEffect, useCallback } from 'react'

export function useBackground() {
  const setBackground = useCallback((imageUrl: string | null) => {
    if (typeof document === 'undefined') return

    // 移除现有的背景层
    const existingLayer = document.getElementById('dynamic-background-layer')
    if (existingLayer) {
      existingLayer.remove()
      document.body.classList.remove('has-dynamic-bg')
    }

    // 如果有新的背景图 URL，创建新的背景层
    if (imageUrl?.trim()) {
      const div = document.createElement('div')
      div.id = 'dynamic-background-layer'
      div.className = 'fixed inset-0 w-screen h-screen -z-50 opacity-70 pointer-events-none bg-cover bg-center bg-no-repeat bg-fixed'
      div.style.backgroundImage = `url("${imageUrl}")`
      document.body.appendChild(div)
      document.body.classList.add('has-dynamic-bg')
    }
  }, [])

  useEffect(() => {
    // 组件卸载时清理背景
    return () => {
      const existingLayer = document.getElementById('dynamic-background-layer')
      if (existingLayer) {
        existingLayer.remove()
        document.body.classList.remove('has-dynamic-bg')
      }
    }
  }, [])

  return { setBackground }
}

