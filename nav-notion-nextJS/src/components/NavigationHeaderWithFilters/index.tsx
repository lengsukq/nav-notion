/**
 * 导航头部和筛选栏融合组件
 * 主组件 - 组合所有子组件
 */
'use client'

import { useState, useEffect, useRef } from 'react'
import { Card, CardBody, Pagination } from '@heroui/react'
import { theme as themeConfig } from '@/lib/theme'
import { useSticky } from './useSticky'
import { useSearch } from './useSearch'
import { HeaderTop } from './HeaderTop'
import { StickyHeader } from './StickyHeader'
import { SearchSection } from './SearchSection'
import { TagFilter } from './TagFilter'
import type { NavigationHeaderWithFiltersProps } from './types'

export function NavigationHeaderWithFilters({
  title = '导航管理',
  description = '基于 Notion 的导航管理系统',
  currentTime,
  refreshing,
  selectedTag,
  tags,
  filteredCount,
  originalCount,
  currentPage,
  totalPages,
  itemsPerPage,
  totalCount,
  tagCount,
  onRefresh,
  onSettingsClick,
  onTagChange,
  onClearFilters,
  onPageChange,
  onSearch
}: NavigationHeaderWithFiltersProps) {
  const { isSticky, headerRef } = useSticky()
  const searchState = useSearch({ onSearch })
  const placeholderRef = useRef<HTMLDivElement>(null)
  const [headerHeight, setHeaderHeight] = useState<number>(0)

  // 监听 header 高度变化
  useEffect(() => {
    if (!headerRef.current) return

    const updateHeight = () => {
      if (headerRef.current) {
        // 使用 getBoundingClientRect 获取更准确的高度
        const rect = headerRef.current.getBoundingClientRect()
        const height = rect.height
        // 根据吸顶状态添加不同的安全边距
        // 吸顶状态时添加更多高度，确保第一行书签可见
        const extraHeight = isSticky ? 150 : 8 // 吸顶时增加150px，非吸顶时8px
        setHeaderHeight(height + extraHeight)
      }
    }

    // 初始设置高度 - 使用多个时机确保准确
    const initTimer1 = setTimeout(updateHeight, 0)
    const initTimer2 = setTimeout(updateHeight, 100)
    const initTimer3 = setTimeout(updateHeight, 300)

    // 使用 ResizeObserver 监听高度变化
    const resizeObserver = new ResizeObserver(() => {
      // 使用 requestAnimationFrame 确保在下一帧更新
      requestAnimationFrame(updateHeight)
    })

    resizeObserver.observe(headerRef.current)

    // 监听 isSticky 变化，多次更新以确保动画完成
    const timers: NodeJS.Timeout[] = []
    if (isSticky !== undefined) {
      timers.push(setTimeout(updateHeight, 100))
      timers.push(setTimeout(updateHeight, 300))
      timers.push(setTimeout(updateHeight, 600)) // 稍大于动画时长
    }

    return () => {
      resizeObserver.disconnect()
      clearTimeout(initTimer1)
      clearTimeout(initTimer2)
      clearTimeout(initTimer3)
      timers.forEach(timer => clearTimeout(timer))
    }
  }, [isSticky])

  return (
    <>
      {/* 占位元素 - 高度与 header 同步 */}
      {headerHeight > 0 && (
        <div 
          ref={placeholderRef}
          className="mb-4 md:mb-6 transition-all duration-500 ease-in-out"
          style={{
            height: `${headerHeight}px`,
            minHeight: isSticky ? '350px' : '100px', // 吸顶时最小高度更大，确保第一行书签可见
            transitionProperty: 'height, min-height',
            transitionTimingFunction: 'cubic-bezier(0.4, 0, 0.2, 1)'
          }}
        />
      )}
      
      {/* Fixed Header */}
      <div 
        ref={headerRef}
        className="fixed top-0 left-0 right-0 z-50 will-change-transform"
        style={{
          transform: 'translateZ(0)', // 启用硬件加速
        }}
      >
      <Card className={`${themeConfig.classes.card} ${themeConfig.classes.rounded.card} overflow-hidden shadow-2xl shadow-white/10 mx-4 md:mx-6`} classNames={{ base: themeConfig.classes.rounded.card }}>
        <CardBody className={`transition-all duration-500 ease-in-out ${isSticky ? 'p-2 md:p-2.5' : 'p-4 sm:p-6 md:p-8'}`}>
          {/* 顶部区域 */}
          <HeaderTop
            title={title}
            description={description}
            currentTime={currentTime}
            refreshing={refreshing}
            isSticky={isSticky}
            onRefresh={onRefresh}
            onSettingsClick={onSettingsClick}
            totalCount={totalCount}
            tagCount={tagCount}
            currentPage={currentPage}
            totalPages={totalPages}
            filteredCount={filteredCount}
            originalCount={originalCount}
          />

          {/* 吸顶时的标题栏 */}
          <StickyHeader
            title={title}
            refreshing={refreshing}
            isSticky={isSticky}
            onRefresh={onRefresh}
            onSettingsClick={onSettingsClick}
          />

          {/* 搜索框和标签筛选 */}
          <div className={`transition-all duration-500 ease-in-out ${isSticky ? 'mb-2' : 'mb-3 md:mb-4'}`}>
            <div className={`flex flex-col ${isSticky ? 'lg:flex-row' : ''} gap-2 md:gap-3 items-stretch ${isSticky ? 'lg:items-center' : ''} transition-all duration-500 ease-in-out`}>
              <SearchSection isSticky={isSticky} searchState={searchState} />
              <TagFilter
                selectedTag={selectedTag}
                tags={tags}
                isSticky={isSticky}
                onTagChange={onTagChange}
                onClearFilters={onClearFilters}
              />
            </div>
          </div>

          {/* 分页组件 */}
          {totalPages > 1 && (
            <div 
              className={`flex justify-center transition-all duration-500 ease-in-out ${
                isSticky 
                  ? 'mt-2 pt-2 border-t border-default-200/50' 
                  : 'mt-4 pt-3 border-t border-default-200'
              }`}
              style={{
                transitionProperty: 'margin-top, padding-top, border-color',
                transitionTimingFunction: 'cubic-bezier(0.4, 0, 0.2, 1)'
              }}
            >
              <Pagination
                total={totalPages}
                page={currentPage}
                onChange={onPageChange}
                showControls
                showShadow={false}
                color="primary"
                size={isSticky ? "sm" : "sm"}
                classNames={{
                  item: [
                    "bg-default-100/50 text-default-700 border-default-200",
                    "hover:bg-default-100 hover:text-foreground hover:border-primary",
                    "data-[active=true]:text-white data-[active=true]:border-transparent",
                    "transition-all duration-200"
                  ].join(" "),
                  cursor: "[&>span]:bg-gradient-to-r [&>span]:from-[var(--primary-color)] [&>span]:to-[var(--secondary-color)]",
                  prev: "bg-default-100/30 text-default-600 hover:bg-default-100/50 hover:border-primary border-default-200 hover:text-primary",
                  next: "bg-default-100/30 text-default-600 hover:bg-default-100/50 hover:border-primary border-default-200 hover:text-primary"
                }}
              />
            </div>
          )}
        </CardBody>
      </Card>
      </div>
    </>
  )
}

