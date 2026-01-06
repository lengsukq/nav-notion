'use client'

import { 
  Modal, 
  ModalContent, 
  ModalHeader, 
  ModalBody, 
  ModalFooter, 
  Button, 
  Input,
  Card,
  CardBody,
  Divider,
  Chip
} from '@heroui/react'
import { Settings, X, Palette, Database, RotateCcw, ChevronDown, ChevronUp } from 'lucide-react'
import { useSettings } from '@/hooks/useSettings'
import { useState, useCallback } from 'react'

const PRESET_COLORS = [
  { name: '蓝色', color: '#3B82F6' },
  { name: '绿色', color: '#10B981' },
  { name: '琥珀色', color: '#F59E0B' },
  { name: '红色', color: '#EF4444' },
  { name: '紫色', color: '#8B5CF6' },
  { name: '粉色', color: '#EC4899' },
  { name: '青色', color: '#06B6D4' },
  { name: '灰色', color: '#6B7280' },
  { name: '靛蓝', color: '#6366F1' },
  { name: '玫瑰', color: '#F43F5E' },
  { name: '橙色', color: '#F97316' },
  { name: '黄色', color: '#EAB308' },
  { name: '青绿', color: '#14B8A6' },
  { name: '天蓝', color: '#0EA5E9' },
  { name: '深紫', color: '#7C3AED' },
  { name: '深灰', color: '#475569' }
]

const RECOMMENDED_COLOR_PAIRS = [
  { name: '经典蓝紫', primary: '#3B82F6', secondary: '#8B5CF6' },
  { name: '清新蓝青', primary: '#3B82F6', secondary: '#06B6D4' },
  { name: '活力粉紫', primary: '#EC4899', secondary: '#8B5CF6' },
  { name: '自然绿青', primary: '#10B981', secondary: '#06B6D4' },
  { name: '温暖橙粉', primary: '#F59E0B', secondary: '#EC4899' },
  { name: '优雅紫灰', primary: '#8B5CF6', secondary: '#6B7280' },
  { name: '清新蓝绿', primary: '#3B82F6', secondary: '#10B981' },
  { name: '柔和粉灰', primary: '#EC4899', secondary: '#6B7280' },
  { name: '深海蓝', primary: '#0EA5E9', secondary: '#06B6D4' },
  { name: '森林绿', primary: '#10B981', secondary: '#14B8A6' },
  { name: '日落橙', primary: '#F97316', secondary: '#F59E0B' },
  { name: '玫瑰金', primary: '#EC4899', secondary: '#F43F5E' },
  { name: '靛紫', primary: '#6366F1', secondary: '#7C3AED' },
  { name: '青绿', primary: '#14B8A6', secondary: '#10B981' },
  { name: '粉橙', primary: '#EC4899', secondary: '#F97316' },
  { name: '蓝灰', primary: '#3B82F6', secondary: '#475569' }
]

interface SettingsModalProps {
  isOpen: boolean
  onClose: () => void
}

export function SettingsModal({ isOpen, onClose }: SettingsModalProps) {
  const {
    settings,
    setThemeColor,
    setSecondaryColor,
    setCacheExpiryTime,
    resetSettings
  } = useSettings()

  const [applyToSecondary, setApplyToSecondary] = useState(false)
  const [isPairsExpanded, setIsPairsExpanded] = useState(false)
  const [isColorsExpanded, setIsColorsExpanded] = useState(false)

  const applyColor = useCallback((color: string) => {
    if (applyToSecondary) {
      setSecondaryColor(color)
    } else {
      setThemeColor(color)
    }
  }, [applyToSecondary, setThemeColor, setSecondaryColor])

  const applyColorPair = useCallback((primary: string, secondary: string) => {
    setThemeColor(primary)
    setSecondaryColor(secondary)
  }, [setThemeColor, setSecondaryColor])

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="2xl"
      scrollBehavior="inside"
      classNames={{
        base: 'bg-white/10 dark:bg-white/5 backdrop-blur-xl backdrop-saturate-150 border border-white/20 dark:border-white/10 shadow-2xl',
        backdrop: 'bg-white/10 backdrop-blur-sm',
        header: 'border-b border-white/10 dark:border-white/5',
        footer: 'border-t border-white/10 dark:border-white/5',
        body: 'py-6 overflow-y-auto'
      }}
    >
      <ModalContent>
        {() => (
          <>
            <ModalHeader className="flex items-center gap-2 text-foreground">
              <Settings className="w-5 h-5 text-primary" />
              <span className="text-xl font-semibold">设置</span>
            </ModalHeader>
            <ModalBody className="gap-6 text-foreground">

              {/* 主题色设置 */}
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Palette className="w-4 h-4 text-primary" />
                  <h4 className="text-sm font-semibold text-foreground">主题色调色板</h4>
                </div>
                
                <div className="space-y-2">
                  {/* 主色和次色紧凑布局 */}
                  <div className="grid grid-cols-2 gap-2">
                    {/* 主色 */}
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs text-default-600 w-8 flex-shrink-0">主色</span>
                      <input
                        type="color"
                        value={settings.themeColor}
                        onChange={(e) => setThemeColor(e.target.value)}
                        className="w-7 h-7 rounded cursor-pointer transition-all duration-200 hover:scale-105 border border-default-300"
                        style={{
                          WebkitAppearance: 'none',
                          MozAppearance: 'none',
                          appearance: 'none',
                          backgroundColor: 'transparent'
                        }}
                      />
                      <Input
                        type="text"
                        value={settings.themeColor}
                        onValueChange={setThemeColor}
                        placeholder="#RRGGBB"
                        size="sm"
                        classNames={{
                          input: 'text-xs font-mono text-foreground',
                          inputWrapper: 'h-7 flex-1'
                        }}
                      />
                    </div>

                    {/* 次色 */}
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs text-default-600 w-8 flex-shrink-0">次色</span>
                      <input
                        type="color"
                        value={settings.secondaryColor}
                        onChange={(e) => setSecondaryColor(e.target.value)}
                        className="w-7 h-7 rounded cursor-pointer transition-all duration-200 hover:scale-105 border border-default-300"
                        style={{
                          WebkitAppearance: 'none',
                          MozAppearance: 'none',
                          appearance: 'none',
                          backgroundColor: 'transparent'
                        }}
                      />
                      <Input
                        type="text"
                        value={settings.secondaryColor}
                        onValueChange={setSecondaryColor}
                        placeholder="#RRGGBB"
                        size="sm"
                        classNames={{
                          input: 'text-xs font-mono text-foreground',
                          inputWrapper: 'h-7 flex-1'
                        }}
                      />
                    </div>
                  </div>

                  <Divider className="bg-default-200" />

                  {/* 推荐颜色组合 */}
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <p className="text-xs text-default-500 font-medium">推荐组合</p>
                      <Button
                        isIconOnly
                        size="sm"
                        variant="light"
                        onPress={() => setIsPairsExpanded(!isPairsExpanded)}
                        className="h-5 w-5 min-w-5"
                      >
                        {isPairsExpanded ? (
                          <ChevronUp className="w-3 h-3" />
                        ) : (
                          <ChevronDown className="w-3 h-3" />
                        )}
                      </Button>
                    </div>
                    <div className="grid grid-cols-4 gap-1.5">
                      {RECOMMENDED_COLOR_PAIRS.slice(0, isPairsExpanded ? RECOMMENDED_COLOR_PAIRS.length : 4).map((pair) => {
                        const isActive = settings.themeColor === pair.primary && settings.secondaryColor === pair.secondary
                        return (
                          <Button
                            key={pair.name}
                            onPress={() => applyColorPair(pair.primary, pair.secondary)}
                            className={`h-12 p-1 relative overflow-hidden transition-all duration-200 hover:scale-105 ${
                              isActive ? 'ring-2 ring-primary ring-offset-1' : ''
                            }`}
                            variant="flat"
                            style={{
                              background: `linear-gradient(135deg, ${pair.primary}, ${pair.secondary})`
                            }}
                          >
                            <div className="absolute inset-0 bg-black/10 opacity-0 hover:opacity-100 transition-opacity" />
                            <div className="relative z-10 flex flex-col items-center justify-center w-full h-full">
                              <span className="text-white text-[10px] font-medium drop-shadow-md leading-tight">{pair.name}</span>
                              <div className="flex gap-0.5 mt-0.5">
                                <div 
                                  className="w-2 h-2 rounded-full border border-white/30"
                                  style={{ backgroundColor: pair.primary }}
                                />
                                <div 
                                  className="w-2 h-2 rounded-full border border-white/30"
                                  style={{ backgroundColor: pair.secondary }}
                                />
                              </div>
                            </div>
                            {isActive && (
                              <div className="absolute top-0.5 right-0.5 w-3 h-3 bg-white rounded-full flex items-center justify-center shadow-sm">
                                <div className="w-1.5 h-1.5 bg-primary rounded-full" />
                              </div>
                            )}
                          </Button>
                        )
                      })}
                    </div>
                  </div>

                  <Divider className="bg-default-200" />

                  {/* 预设颜色快速选择 */}
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <p className="text-xs text-default-500 font-medium">单色选择</p>
                        <Button
                          size="sm"
                          variant={applyToSecondary ? 'solid' : 'flat'}
                          color={applyToSecondary ? 'secondary' : 'primary'}
                          onPress={() => setApplyToSecondary(!applyToSecondary)}
                          className="h-5 text-[10px] min-w-16 px-2"
                        >
                          {applyToSecondary ? '次色' : '主色'}
                        </Button>
                      </div>
                      <Button
                        isIconOnly
                        size="sm"
                        variant="light"
                        onPress={() => setIsColorsExpanded(!isColorsExpanded)}
                        className="h-5 w-5 min-w-5"
                      >
                        {isColorsExpanded ? (
                          <ChevronUp className="w-3 h-3" />
                        ) : (
                          <ChevronDown className="w-3 h-3" />
                        )}
                      </Button>
                    </div>
                    <div className="grid grid-cols-8 gap-1">
                      {PRESET_COLORS.slice(0, isColorsExpanded ? PRESET_COLORS.length : 8).map((preset) => {
                        const isActive = (applyToSecondary ? settings.secondaryColor : settings.themeColor) === preset.color
                        return (
                          <Button
                            key={preset.color}
                            isIconOnly
                            onPress={() => applyColor(preset.color)}
                            style={{ backgroundColor: preset.color }}
                            className={`w-7 h-7 rounded transition-all duration-200 hover:scale-110 ${
                              isActive ? 'ring-2 ring-primary ring-offset-0.5' : ''
                            }`}
                            variant="flat"
                            title={preset.name}
                            size="sm"
                          />
                        )
                      })}
                    </div>
                  </div>
                </div>
              </div>

              <Divider />

              {/* 缓存设置 */}
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <Database className="w-4 h-4 text-primary" />
                  <h4 className="text-base font-semibold text-foreground">数据缓存设置</h4>
                </div>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-default-600">缓存过期时间</span>
                    <div className="flex items-center gap-2">
                      <Input
                        type="number"
                        min="0"
                        max="720"
                        value={settings.cacheExpiryTime.toString()}
                        onValueChange={(value) => setCacheExpiryTime(parseInt(value) || 0)}
                        size="sm"
                        classNames={{
                          input: 'text-xs w-16 text-center text-foreground',
                          inputWrapper: 'h-9 w-20 bg-white/10 border-white/20'
                        }}
                      />
                      <span className="text-sm text-default-500">小时</span>
                    </div>
                  </div>
                  
                  <Divider className="bg-white/10" />
                  
                  {/* 快速选择按钮 */}
                  <div className="flex flex-wrap gap-2">
                    {[
                      { label: '不缓存', value: 0 },
                      { label: '1天', value: 24 },
                      { label: '1周', value: 168 },
                      { label: '1月', value: 720 }
                    ].map((option) => (
                      <Button
                        key={option.value}
                        size="sm"
                        variant={settings.cacheExpiryTime === option.value ? 'solid' : 'flat'}
                        color={settings.cacheExpiryTime === option.value ? 'primary' : 'default'}
                        onPress={() => setCacheExpiryTime(option.value)}
                      >
                        {option.label}
                      </Button>
                    ))}
                  </div>
                  
                  <p className="text-xs text-default-500">
                    设置为0表示不使用缓存，缓存首页数据可减少API调用，提高加载速度
                  </p>
                </div>
              </div>
            </ModalBody>
            <ModalFooter>
              <Button
                color="danger"
                variant="light"
                onPress={resetSettings}
                startContent={<RotateCcw className="w-4 h-4" />}
              >
                重置为默认设置
              </Button>
              <Button
                color="primary"
                variant="solid"
                onPress={onClose}
                startContent={<X className="w-4 h-4" />}
              >
                关闭设置
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  )
}

