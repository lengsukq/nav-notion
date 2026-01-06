/**
 * 滚动监听 Hook - 检测是否吸顶
 * 使用状态锁定机制和更大的滞后区间，彻底避免在阈值附近频繁切换导致动画抖动
 */
import { useState, useEffect, useRef } from 'react'

// 滚动阈值配置（像素）
const SCROLL_THRESHOLD_ON = 180  // 触发吸顶的阈值
const SCROLL_THRESHOLD_OFF = 80  // 取消吸顶的阈值（滞后机制，避免抖动）
const STATE_LOCK_DURATION = 300  // 状态锁定持续时间（毫秒），防止频繁切换
const SCROLL_DELTA_THRESHOLD = 5 // 滚动变化阈值（像素），小于此值忽略

export function useSticky() {
  const [isSticky, setIsSticky] = useState(false)
  const headerRef = useRef<HTMLDivElement>(null)
  const currentStateRef = useRef<boolean>(false)
  const rafIdRef = useRef<number | null>(null)
  const lastScrollYRef = useRef<number>(0)
  const stateLockRef = useRef<boolean>(false) // 状态锁定标志
  const stateChangeTimeRef = useRef<number>(0) // 上次状态改变的时间

  useEffect(() => {
    const updateStickyState = (scrollY: number) => {
      // 如果状态被锁定，且锁定时间未到，直接返回
      const now = Date.now()
      if (stateLockRef.current && (now - stateChangeTimeRef.current) < STATE_LOCK_DURATION) {
        return
      }

      let newStickyState = false
      
      // 使用滞后机制：不同的阈值来触发和取消状态
      if (currentStateRef.current) {
        // 当前是吸顶状态：只有当滚动距离小于取消阈值时才取消
        newStickyState = scrollY >= SCROLL_THRESHOLD_OFF
      } else {
        // 当前不是吸顶状态：只有当滚动距离超过触发阈值时才触发
        newStickyState = scrollY >= SCROLL_THRESHOLD_ON
      }
      
      // 只有当状态真正改变时才更新
      if (newStickyState !== currentStateRef.current) {
        // 锁定状态，防止频繁切换
        stateLockRef.current = true
        stateChangeTimeRef.current = now
        currentStateRef.current = newStickyState
        
        // 立即更新状态（不使用防抖，因为已经有锁定机制）
        setIsSticky(newStickyState)
        
        // 在锁定时间后解除锁定
        setTimeout(() => {
          stateLockRef.current = false
        }, STATE_LOCK_DURATION)
      }
    }

    const handleScroll = () => {
      // 取消之前的 RAF
      if (rafIdRef.current) {
        cancelAnimationFrame(rafIdRef.current)
      }

      // 使用 RAF 节流
      rafIdRef.current = requestAnimationFrame(() => {
        const scrollY = window.scrollY || window.pageYOffset
        
        // 只在滚动距离有明显变化时才更新（减少微小抖动）
        const scrollDelta = Math.abs(scrollY - lastScrollYRef.current)
        if (scrollDelta >= SCROLL_DELTA_THRESHOLD || scrollY === 0) {
          lastScrollYRef.current = scrollY
          updateStickyState(scrollY)
        }
        
        rafIdRef.current = null
      })
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    
    // 初始检查
    const initialScrollY = window.scrollY || window.pageYOffset
    lastScrollYRef.current = initialScrollY
    updateStickyState(initialScrollY)

    return () => {
      window.removeEventListener('scroll', handleScroll)
      if (rafIdRef.current) {
        cancelAnimationFrame(rafIdRef.current)
      }
    }
  }, [])

  return { isSticky, headerRef }
}

