/**
 * 主题配置
 * 统一管理圆角、毛玻璃效果等样式变量
 */

export const theme = {
  // 圆角配置
  borderRadius: {
    // 卡片圆角
    card: '2xl', // 对应 rounded-2xl (1rem / 16px)
    // 小元素圆角
    small: 'xl', // 对应 rounded-xl (0.75rem / 12px)
    // 中等元素圆角
    medium: '2xl', // 对应 rounded-2xl (1rem / 16px)
    // 大元素圆角
    large: '3xl', // 对应 rounded-3xl (1.5rem / 24px)
  },

  // 毛玻璃效果配置
  glass: {
    // 模糊强度
    blur: '12px',
    // 饱和度
    saturate: '150%',
    // 背景透明度
    background: {
      light: 'rgba(255, 255, 255, 0.4)',
      lightSecondary: 'rgba(255, 255, 255, 0.15)',
      dark: 'rgba(255, 255, 255, 0.1)',
      darkSecondary: 'rgba(255, 255, 255, 0.05)',
    },
    // 边框透明度
    border: {
      light: 'rgba(255, 255, 255, 0.3)',
      dark: 'rgba(255, 255, 255, 0.2)',
    },
  },

  // Tailwind 类名映射（用于 className）
  classes: {
    // 卡片样式
    card: 'bg-white/10 backdrop-blur-xl border-white/20',
    // 毛玻璃背景
    glassBg: 'backdrop-blur-xl backdrop-saturate-150',
    // 圆角类名（统一使用 rounded-2xl）
    rounded: {
      card: 'rounded-2xl', // 统一卡片圆角：16px
      small: 'rounded-xl', // 小元素圆角：12px
      medium: 'rounded-2xl', // 中等元素圆角：16px
      large: 'rounded-3xl', // 大元素圆角：24px
    },
  },
} as const

// 内联样式配置（用于 style 属性）
export const glassStyle = {
  backdropFilter: `blur(${theme.glass.blur}) saturate(${theme.glass.saturate})`,
  background: `
    linear-gradient(145deg, ${theme.glass.background.light} 0%, ${theme.glass.background.lightSecondary} 100%),
    linear-gradient(to bottom right, rgba(var(--primary-color-rgb), 0.03), transparent)
  `,
  borderColor: theme.glass.border.light,
} as const

