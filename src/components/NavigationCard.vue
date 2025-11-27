<template>
  <!-- 
    Refactoring Note: 
    1. 将布局类 (Layout) 移至 Template，样式表仅保留特效。
    2. 合并了 click 和 keydown 事件处理。
  -->
  <article 
    class="hero-card group relative flex flex-col overflow-hidden rounded-3xl border cursor-pointer transition-all duration-500 ease-out" 
    :class="containerClasses"
    :style="{ animationDelay: delay }"
    @click="handleNavigation" 
    @keydown.enter.prevent="handleNavigation"
    role="button"
    tabindex="0"
    :aria-label="`访问 ${name}`"
  >
    <!-- 背景与光效层 (Visual Effects Layer) -->
    <div class="absolute inset-0 hero-card-bg pointer-events-none"></div>
    <div class="absolute inset-0 hero-card-glow opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"></div>
    <div class="absolute top-0 left-0 w-full h-px hero-card-top-glow transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 pointer-events-none"></div>
    
    <!-- 内容区域 -->
    <div class="relative z-10 flex flex-col h-full p-3 md:p-6 transition-all">
      
      <!-- 统一的头部/图标区域 (DRY Optimization) -->
      <header :class="headerClasses">
        <!-- 图标容器：通过动态 Class 控制大小，避免 DOM 重复 -->
        <div 
          class="relative flex items-center justify-center rounded-xl transition-all duration-300 group-hover:scale-110 shadow-lg border border-white/20 overflow-hidden"
          :class="iconSizeClasses"
        >
          <!-- 图标背景 -->
          <div class="absolute inset-0 bg-gradient-to-br from-[var(--primary-color)] to-[var(--accent-color)] opacity-90"></div>
          
          <!-- 图标内容 -->
          <img 
            v-if="processedIcon" 
            :src="processedIcon" 
            :alt="name" 
            class="relative z-10 object-contain drop-shadow-sm transition-transform"
            :class="isSmall ? 'w-4 h-4 md:w-5 md:h-5' : 'w-5 h-5'"
          >
          <span v-else class="relative z-10 text-white font-bold text-base shadow-black/20 drop-shadow-md">
            {{ initialLetter }}
          </span>
        </div>

        <!-- 标题 -->
        <h3 
          class="font-bold leading-tight bg-clip-text text-transparent bg-gradient-to-br from-gray-900 to-gray-700 dark:from-gray-100 dark:to-gray-300 group-hover:from-[var(--primary-color)] group-hover:to-[var(--accent-color)] transition-all duration-300"
          :class="titleClasses"
          :title="name"
        >
          {{ name }}
        </h3>
      </header>

      <!-- 描述与标签 (仅大卡片显示) -->
      <template v-if="!isSmall && !isMedium">
        <p class="mt-4 text-sm text-gray-600 dark:text-gray-300 leading-relaxed line-clamp-2" :title="description">
          {{ description }}
        </p>
        
        <!-- 标签区域 -->
        <div v-if="hasTags" class="mt-auto pt-4 flex flex-wrap gap-2 items-center">
          <span 
            v-for="(tag, index) in displayTags" 
            :key="`tag-${index}`" 
            class="hero-tag px-2.5 py-1 text-xs font-semibold rounded-full border border-[var(--primary-color)]/30 text-[var(--primary-color)] bg-[var(--primary-color)]/10 backdrop-blur-md"
          >
            {{ tag }}
          </span>
          <span v-if="remainingTagsCount > 0" class="px-2 py-1 text-xs font-medium rounded-full text-gray-500 bg-gray-500/10 border border-gray-500/20">
            +{{ remainingTagsCount }}
          </span>
        </div>
      </template>
    </div>
    
    <!-- 边框高光 -->
    <div class="absolute inset-0 border border-transparent hero-border-gradient opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none rounded-3xl"></div>
  </article>
</template>

<script setup lang="ts">
import { computed } from 'vue';

// 定义Props接口
interface Props {
  name: string;
  description: string;
  icon?: string | null;
  tags?: string[];
  url: string;
  delay?: string;
  size?: 'small' | 'medium' | 'large';
}

const props = withDefaults(defineProps<Props>(), {
  description: '',
  icon: null,
  tags: () => [],
  delay: '0s',
  size: 'large'
});

// Logic Simplification: Internal state helpers
const isSmall = computed(() => props.size === 'small');
const isMedium = computed(() => props.size === 'medium');
const processedIcon = computed(() => props.icon?.trim());
const initialLetter = computed(() => props.name.charAt(0).toUpperCase());
const hasTags = computed(() => props.tags && props.tags.length > 0);

// Data Transformation (View Logic)
const displayTags = computed(() => props.tags.slice(0, 3));
const remainingTagsCount = computed(() => Math.max(0, props.tags.length - 3));

// Navigation Logic
const handleNavigation = (): void => {
  if (!props.url) return;
  // 安全性：确保 noopener 防止新页面访问 window.opener
  window.open(props.url, '_blank', 'noopener,noreferrer');
};

/* --- Dynamic Classes (Moving logic out of template) --- */

const containerClasses = computed(() => ({
  'h-[110px] md:h-[120px]': isSmall.value,
  'h-[140px] md:h-[160px]': isMedium.value,
  'h-full min-h-[200px]': !isSmall.value && !isMedium.value,
  'hero-fade-in': true
}));

const headerClasses = computed(() => isSmall.value 
  ? 'flex flex-col items-center justify-center gap-2 h-full' 
  : 'flex items-center gap-3'
);

const iconSizeClasses = computed(() => isSmall.value
  ? 'w-9 h-9 md:w-10 md:h-10' // Small card icon
  : isMedium.value
  ? 'w-10 h-10 md:w-11 md:h-11' // Medium card icon  
  : 'w-11 h-11 shrink-0'      // Large card icon
);

const titleClasses = computed(() => isSmall.value
  ? 'text-sm font-semibold text-center line-clamp-2 w-full px-1'
  : isMedium.value
  ? 'text-base font-bold line-clamp-1 flex-1'
  : 'text-lg font-bold line-clamp-1 flex-1'
);
</script>

<style scoped>
/* 
  Refactoring Note:
  移除了大量 hard-coded 的布局 CSS，改为 Tailwind Utility Classes。
  保留 CSS 仅用于定义复杂的 Glassmorphism 效果和动画。
*/

/* 核心变量定义 - 作用域限制在组件内 */
.hero-card {
  /* 基础玻璃质感 */
  backdrop-filter: blur(40px) saturate(200%) brightness(105%);
  background: 
    linear-gradient(135deg, rgba(255, 255, 255, 0.35) 0%, rgba(255, 255, 255, 0.15) 100%),
    linear-gradient(225deg, rgba(var(--primary-color-rgb), 0.12) 0%, rgba(var(--secondary-color-rgb), 0.08) 50%, rgba(var(--accent-color-rgb), 0.05) 100%);
  border-color: rgba(255, 255, 255, 0.4);
  box-shadow: 
    0 10px 30px -10px rgba(var(--primary-color-rgb), 0.2),
    inset 0 1px 0 rgba(255, 255, 255, 0.3);
    
  /* 性能优化: 提示浏览器提升层级 */
  will-change: transform, box-shadow;
  transform: translateZ(0); 
}

/* 悬停状态 - 统一处理 */
.hero-card:hover {
  transform: translateY(-6px) scale(1.01);
  box-shadow: 
    0 20px 40px -10px rgba(var(--primary-color-rgb), 0.3),
    inset 0 1px 0 rgba(255, 255, 255, 0.5);
  border-color: rgba(var(--primary-color-rgb), 0.5);
}

/* 暗色模式适配 */
:global(.dark) .hero-card {
  background: 
    linear-gradient(135deg, rgba(30, 41, 59, 0.7) 0%, rgba(15, 23, 42, 0.5) 100%),
    linear-gradient(225deg, rgba(var(--secondary-color-rgb), 0.1) 0%, rgba(var(--primary-color-rgb), 0.05) 100%);
  border-color: rgba(255, 255, 255, 0.1);
  box-shadow: 0 10px 30px -10px rgba(0, 0, 0, 0.5);
}

:global(.dark) .hero-card:hover {
  background: 
    linear-gradient(135deg, rgba(30, 41, 59, 0.85) 0%, rgba(15, 23, 42, 0.65) 100%);
  border-color: rgba(var(--primary-color-rgb), 0.4);
}

/* 装饰性元素 */
.hero-card-glow {
  background: radial-gradient(circle at center, rgba(var(--primary-color-rgb), 0.15), transparent 70%);
}

.hero-card-top-glow {
  background: linear-gradient(90deg, transparent, rgba(var(--primary-color-rgb), 0.6), transparent);
}

.hero-border-gradient {
  /* 使用 mask 实现渐变边框，性能优于 border-image */
  -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
  mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
  -webkit-mask-composite: xor;
  mask-composite: exclude;
  background: linear-gradient(135deg, rgba(var(--primary-color-rgb), 0.5), rgba(var(--accent-color-rgb), 0.3));
}

/* 动画定义 */
.hero-fade-in {
  animation: heroFadeInUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) backwards;
}

@keyframes heroFadeInUp {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>