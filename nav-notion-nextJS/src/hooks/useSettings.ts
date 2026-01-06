'use client'

import { useState, useEffect, useCallback } from 'react'
import { Settings, TagFilterMode } from '@/types'
import { loadSettings, saveSettings } from '@/lib/storage'

export function useSettings() {
  const [settings, setSettings] = useState<Settings>(loadSettings())
  const [isSettingsOpen, setIsSettingsOpen] = useState(false)

  // 应用主题色到 CSS 变量
  const applyThemeColors = useCallback((themeColor: string, secondaryColor: string) => {
    if (typeof document === 'undefined') return

    // 设置主色
    document.documentElement.style.setProperty('--primary-color', themeColor)
    const primaryLight = lightenColor(themeColor, 0.2)
    const primaryDark = darkenColor(themeColor, 0.2)
    document.documentElement.style.setProperty('--primary-color-light', primaryLight)
    document.documentElement.style.setProperty('--primary-color-dark', primaryDark)
    const primaryRgb = hexToRgb(themeColor)
    if (primaryRgb) {
      document.documentElement.style.setProperty('--primary-color-rgb', `${primaryRgb.r}, ${primaryRgb.g}, ${primaryRgb.b}`)
    }

    // 设置次色
    document.documentElement.style.setProperty('--secondary-color', secondaryColor)
    const secondaryLight = lightenColor(secondaryColor, 0.2)
    const secondaryDark = darkenColor(secondaryColor, 0.2)
    document.documentElement.style.setProperty('--secondary-color-light', secondaryLight)
    document.documentElement.style.setProperty('--secondary-color-dark', secondaryDark)
    const secondaryRgb = hexToRgb(secondaryColor)
    if (secondaryRgb) {
      document.documentElement.style.setProperty('--secondary-color-rgb', `${secondaryRgb.r}, ${secondaryRgb.g}, ${secondaryRgb.b}`)
    }
  }, [])

  // 初始化时应用主题色
  useEffect(() => {
    applyThemeColors(settings.themeColor, settings.secondaryColor)
  }, [settings.themeColor, settings.secondaryColor, applyThemeColors])

  const updateSettings = useCallback((updates: Partial<Settings>) => {
    setSettings(prev => {
      const newSettings = { ...prev, ...updates }
      saveSettings(newSettings)
      
      // 如果更新了颜色，立即应用
      if (updates.themeColor || updates.secondaryColor) {
        applyThemeColors(
          updates.themeColor || newSettings.themeColor,
          updates.secondaryColor || newSettings.secondaryColor
        )
      }
      
      return newSettings
    })
  }, [applyThemeColors])

  const setThemeColor = useCallback((color: string) => {
    updateSettings({ themeColor: color })
  }, [updateSettings])

  const setSecondaryColor = useCallback((color: string) => {
    updateSettings({ secondaryColor: color })
  }, [updateSettings])

  const setTagFilterMode = useCallback((mode: TagFilterMode) => {
    updateSettings({ tagFilterMode: mode })
  }, [updateSettings])

  const setCacheExpiryTime = useCallback((hours: number) => {
    updateSettings({ cacheExpiryTime: hours })
  }, [updateSettings])

  const resetSettings = useCallback(() => {
    const defaultSettings: Settings = {
      notionToken: settings.notionToken,
      databaseId: settings.databaseId,
      theme: 'dark',
      autoRefresh: true,
      refreshInterval: 300000,
      themeColor: '#3B82F6',
      secondaryColor: '#d1d1d1',
      tagFilterMode: 'single',
      cacheExpiryTime: 24
    }
    setSettings(defaultSettings)
    saveSettings(defaultSettings)
    applyThemeColors(defaultSettings.themeColor, defaultSettings.secondaryColor)
  }, [settings.notionToken, settings.databaseId, applyThemeColors])

  const toggleSettings = useCallback(() => {
    setIsSettingsOpen(prev => !prev)
  }, [])

  return {
    settings,
    isSettingsOpen,
    setIsSettingsOpen,
    toggleSettings,
    updateSettings,
    setThemeColor,
    setSecondaryColor,
    setTagFilterMode,
    setCacheExpiryTime,
    resetSettings
  }
}

// 颜色工具函数
function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
  if (!result) return null
  return {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  }
}

function lightenColor(color: string, percent: number): string {
  const rgb = hexToRgb(color)
  if (!rgb) return color
  
  const r = Math.min(255, Math.round(rgb.r * (1 + percent)))
  const g = Math.min(255, Math.round(rgb.g * (1 + percent)))
  const b = Math.min(255, Math.round(rgb.b * (1 + percent)))
  
  return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`
}

function darkenColor(color: string, percent: number): string {
  const rgb = hexToRgb(color)
  if (!rgb) return color
  
  const r = Math.max(0, Math.round(rgb.r * (1 - percent)))
  const g = Math.max(0, Math.round(rgb.g * (1 - percent)))
  const b = Math.max(0, Math.round(rgb.b * (1 - percent)))
  
  return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`
}

