/**
 * 搜索框组件
 */
'use client'

import { Button, Input, Dropdown, DropdownTrigger, DropdownMenu, DropdownItem } from '@heroui/react'
import { Search, ChevronDown, X, Clock } from 'lucide-react'
import { theme as themeConfig } from '@/lib/theme'
import { SEARCH_CONFIG } from './searchConfig'
import type { UseSearchReturn } from './useSearch'

interface SearchSectionProps {
  isSticky: boolean
  searchState: UseSearchReturn
}

export function SearchSection({ isSticky, searchState }: SearchSectionProps) {
  const {
    searchQuery,
    setSearchQuery,
    isFocused,
    selectedEngine,
    currentEngine,
    showHistory,
    filteredHistory,
    isEngineDropdownOpen,
    setIsEngineDropdownOpen,
    inputRef,
    containerRef,
    historyRef,
    searchContainerRef,
    handleSelectEngine,
    executeSearch,
    selectHistory,
    clearHistory,
    handleFocus,
    handleBlur,
    handleKeyDown
  } = searchState

  return (
    <div className={`${isSticky ? 'lg:flex-1' : 'w-full'} transition-all duration-300`}>
      <div 
        ref={searchContainerRef}
        className={`
          flex items-center gap-2 md:gap-3 w-full
          ${themeConfig.classes.card} ${themeConfig.classes.glassBg}
          border border-white/20 dark:border-white/10
          rounded-2xl md:rounded-3xl transition-all duration-500
          ${isSticky ? 'p-1.5 md:p-2' : 'p-2 md:p-3'}
          shadow-xl
          ${isFocused ? 'bg-white/15 dark:bg-white/10 shadow-[0_12px_40px_rgba(var(--primary-color-rgb),0.25)] border-[var(--primary-color)]/40 scale-[1.01]' : 'hover:scale-[1.005]'}
        `}
      >
        {/* 搜索引擎选择器 - 小屏幕吸顶时隐藏 */}
        <div className={isSticky ? 'hidden sm:block' : ''}>
          <Dropdown
            isOpen={isEngineDropdownOpen}
            onOpenChange={setIsEngineDropdownOpen}
            placement="bottom-start"
          >
            <DropdownTrigger>
              <Button
                variant="flat"
                className="bg-white/20 dark:bg-white/10 backdrop-blur-md border border-white/30 dark:border-white/20 min-w-fit px-2 md:px-3 h-8 md:h-9 rounded-xl md:rounded-2xl font-semibold text-xs text-foreground hover:bg-white/30 dark:hover:bg-white/15 transition-all duration-300"
              >
                <span className="hidden sm:inline">{currentEngine.name}</span>
                <span className="sm:hidden">{currentEngine.shortName}</span>
                <ChevronDown className={`w-3 h-3 ml-1 transition-transform duration-300 ${isEngineDropdownOpen ? 'rotate-180' : ''}`} />
              </Button>
            </DropdownTrigger>
            <DropdownMenu
              aria-label="搜索引擎选择"
              onAction={(key) => handleSelectEngine(key as string)}
              classNames={{
                base: 'bg-white/90 dark:bg-default-100/90 backdrop-blur-xl border border-default-200 rounded-xl shadow-lg min-w-[120px]'
              }}
            >
              {Object.entries(SEARCH_CONFIG).map(([key, config]) => (
                <DropdownItem
                  key={key}
                  className={selectedEngine === key ? 'bg-primary/10 text-primary font-semibold' : 'text-foreground hover:bg-primary/10 data-[hover=true]:text-primary'}
                >
                  {config.name}
                </DropdownItem>
              ))}
            </DropdownMenu>
          </Dropdown>
        </div>

        {/* 搜索输入框 */}
        <div className="flex-1 relative" ref={containerRef}>
          <Input
            ref={inputRef}
            value={searchQuery}
            onValueChange={setSearchQuery}
            onFocus={handleFocus}
            onBlur={handleBlur}
            onKeyDown={handleKeyDown}
            placeholder="搜索..."
            endContent={
              searchQuery && (
                <Button
                  isIconOnly
                  size="sm"
                  variant="light"
                  onPress={() => setSearchQuery('')}
                  className="text-default-500 hover:text-primary min-w-5 w-5 h-5"
                >
                  <X className="w-3 h-3" />
                </Button>
              )
            }
            classNames={{
              input: 'text-foreground placeholder:text-default-500 text-xs md:text-sm',
              inputWrapper: 'bg-transparent border-none shadow-none hover:bg-transparent focus-within:bg-transparent h-8 md:h-9'
            }}
            size="sm"
          />

          {/* 搜索历史下拉 */}
          {showHistory && (
            <div 
              ref={historyRef}
              className="absolute top-full left-0 right-0 mt-2 bg-white/90 dark:bg-default-100/90 backdrop-blur-xl border border-default-200 rounded-xl shadow-lg z-50 overflow-hidden"
            >
              {filteredHistory.length > 0 ? (
                <>
                  <div className="flex items-center justify-between px-4 py-2 border-b border-default-200">
                    <span className="text-xs text-default-600 dark:text-default-500">搜索历史</span>
                    <Button
                      size="sm"
                      variant="light"
                      onPress={clearHistory}
                      className="text-xs h-5 text-primary hover:text-secondary"
                    >
                      清除
                    </Button>
                  </div>
                  <div className="max-h-[200px] overflow-y-auto">
                    {filteredHistory.map((item, index) => (
                      <div
                        key={index}
                        onClick={() => selectHistory(item)}
                        className="px-4 py-2 cursor-pointer text-sm text-foreground hover:bg-primary/10 hover:text-primary transition-all duration-200 flex items-center gap-2"
                      >
                        <Clock className="w-4 h-4 text-default-400" />
                        {item}
                      </div>
                    ))}
                  </div>
                </>
              ) : (
                <div className="px-4 py-3 text-center text-sm text-default-500">
                  {searchQuery ? `搜索 "${searchQuery}"` : '暂无搜索历史'}
                </div>
              )}
            </div>
          )}
        </div>

        {/* 搜索按钮 */}
        <Button
          isIconOnly
          variant="flat"
          color="primary"
          onPress={executeSearch}
          className="bg-primary/10 hover:bg-primary/20 text-primary border border-primary/20 h-8 md:h-9 w-8 md:w-9 rounded-xl md:rounded-2xl transition-all duration-300 hover:scale-110"
          size="sm"
          style={{
            backgroundColor: 'rgba(var(--primary-color-rgb), 0.1)'
          }}
        >
          <Search className="w-4 h-4" style={{ color: 'var(--primary-color)' }} />
        </Button>
      </div>
    </div>
  )
}

