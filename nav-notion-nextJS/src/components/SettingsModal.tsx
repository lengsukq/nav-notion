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
  Divider
} from '@heroui/react'
import { Settings, X, Palette, Database, RotateCcw } from 'lucide-react'
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
  { name: '灰色', color: '#6B7280' }
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

  const applyColor = useCallback((color: string) => {
    if (applyToSecondary) {
      setSecondaryColor(color)
    } else {
      setThemeColor(color)
    }
  }, [applyToSecondary, setThemeColor, setSecondaryColor])

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="2xl"
      scrollBehavior="inside"
      classNames={{
        base: 'bg-white/10 dark:bg-white/5 backdrop-blur-xl backdrop-saturate-150 border border-white/20 dark:border-white/10 shadow-2xl',
        backdrop: 'bg-black/50 backdrop-blur-sm',
        header: 'border-b border-white/10 dark:border-white/5',
        footer: 'border-t border-white/10 dark:border-white/5',
        body: 'py-6 overflow-y-auto'
      }}
    >
      <ModalContent>
        {() => (
          <>
            <ModalHeader className="flex items-center gap-2 text-white">
              <Settings className="w-5 h-5 text-primary" />
              <span className="text-xl font-semibold">设置</span>
            </ModalHeader>
            <ModalBody className="gap-6 text-white">

              {/* 主题色设置 */}
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <Palette className="w-4 h-4 text-primary" />
                  <h4 className="text-base font-semibold text-white">主题色调色板</h4>
                </div>
                
                <div className="space-y-4">
                  {/* 主色 */}
                  <div className="flex items-center gap-3">
                    <span className="text-sm text-white/80 w-12 flex-shrink-0">主色</span>
                    <input
                      type="color"
                      value={settings.themeColor}
                      onChange={(e) => setThemeColor(e.target.value)}
                      className="w-10 h-10 rounded-full cursor-pointer transition-all duration-300 hover:scale-110 border-2 border-white/30"
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
                        input: 'text-xs text-white',
                        inputWrapper: 'h-9 bg-white/10 border-white/20'
                      }}
                    />
                  </div>

                  {/* 次色 */}
                  <div className="flex items-center gap-3">
                    <span className="text-sm text-white/80 w-12 flex-shrink-0">次色</span>
                    <input
                      type="color"
                      value={settings.secondaryColor}
                      onChange={(e) => setSecondaryColor(e.target.value)}
                      className="w-10 h-10 rounded-full cursor-pointer transition-all duration-300 hover:scale-110 border-2 border-white/30"
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
                        input: 'text-xs text-white',
                        inputWrapper: 'h-9 bg-white/10 border-white/20'
                      }}
                    />
                  </div>

                  <Divider className="bg-white/10" />

                  {/* 预设颜色 */}
                  <div className="space-y-3">
                    <p className="text-xs text-white/70 font-medium">快速选择</p>
                    <div className="grid grid-cols-8 gap-2">
                      {PRESET_COLORS.map((preset) => (
                        <Button
                          key={preset.color}
                          isIconOnly
                          onPress={() => applyColor(preset.color)}
                          style={{ backgroundColor: preset.color }}
                          className="w-10 h-10 rounded-full hover:scale-110 transition-all duration-200"
                          variant="flat"
                          title={preset.name}
                        />
                      ))}
                    </div>
                    <div className="flex items-center justify-between">
                      <p className="text-xs text-white/70">
                        点击色块应用到{applyToSecondary ? '次主题色' : '主题色'}
                      </p>
                      <Button
                        size="sm"
                        variant={applyToSecondary ? 'solid' : 'flat'}
                        color={applyToSecondary ? 'secondary' : 'default'}
                        onPress={() => setApplyToSecondary(!applyToSecondary)}
                      >
                        {applyToSecondary ? '切换到主色' : '切换到次色'}
                      </Button>
                    </div>
                  </div>
                </div>
              </div>

              <Divider />

              {/* 缓存设置 */}
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <Database className="w-4 h-4 text-primary" />
                  <h4 className="text-base font-semibold text-white">数据缓存设置</h4>
                </div>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-white/80">缓存过期时间</span>
                    <div className="flex items-center gap-2">
                      <Input
                        type="number"
                        min="0"
                        max="720"
                        value={settings.cacheExpiryTime.toString()}
                        onValueChange={(value) => setCacheExpiryTime(parseInt(value) || 0)}
                        size="sm"
                        classNames={{
                          input: 'text-xs w-16 text-center text-white',
                          inputWrapper: 'h-9 w-20 bg-white/10 border-white/20'
                        }}
                      />
                      <span className="text-sm text-white/70">小时</span>
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
                  
                  <p className="text-xs text-white/70">
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

