<template>
  <!-- 重构的HeroUI卡片 - 现代化设计 -->
  <article 
    class="hero-card hero-fade-in h-full group relative overflow-hidden cursor-pointer" 
    :class="cardClasses"
    :style="{ animationDelay: delay }"
    @click="goToUrl" 
    @keydown.enter="goToUrl"
    role="button"
    tabindex="0"
    :aria-label="`访问 ${name}`"
  >
    <!-- 动态背景装饰层 -->
    <div class="absolute inset-0 hero-card-bg"></div>
    
    <!-- 悬浮光效层 -->
    <div class="absolute inset-0 hero-card-glow opacity-0 group-hover:opacity-100 transition-all duration-700"></div>
    
    <!-- 顶部发光条 -->
    <div class="absolute top-0 left-0 w-full h-px hero-card-top-glow transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500"></div>
    
    <!-- 卡片内容区域 -->
    <div class="hero-card-content relative z-10 h-full">
      <!-- 大卡片布局 -->
      <div v-if="size === 'large'" class="hero-large-card">
        <!-- 头部区域 -->
        <div class="hero-card-header">
          <!-- 图标容器 -->
          <div class="hero-icon-container group-hover:scale-110 transition-transform duration-300">
            <div class="hero-icon-bg"></div>
            <img v-if="icon" :src="icon.trim()" :alt="name" class="hero-icon-image">
            <span v-else class="hero-icon-text">{{ name.charAt(0) }}</span>
          </div>
          
          <!-- 标题 -->
          <h3 class="hero-card-title" :title="name">{{ name }}</h3>
        </div>
        
        <!-- 描述 -->
        <p class="hero-card-description" :title="description">{{ description }}</p>
        
        <!-- 标签区域 -->
        <div v-if="tags.length > 0" class="hero-card-tags">
          <span v-for="(tag, tagIndex) in displayTags" :key="tagIndex" class="hero-tag">
            {{ tag }}
          </span>
          <span v-if="tags.length > 3" class="hero-tag-more">+{{ tags.length - 3 }}</span>
        </div>
      </div>

      <!-- 小卡片布局 -->
      <div v-else class="hero-small-card">
        <!-- 图标 -->
        <div class="hero-small-icon-container group-hover:scale-110 transition-transform duration-300">
          <div class="hero-small-icon-bg"></div>
          <img v-if="icon" :src="icon.trim()" :alt="name" class="hero-small-icon-image">
          <span v-else class="hero-small-icon-text">{{ name.charAt(0) }}</span>
        </div>
        
        <!-- 标题 -->
        <h3 class="hero-small-card-title">{{ name }}</h3>
      </div>
    </div>
    
    <!-- 卡片边框高光 -->
    <div class="absolute inset-0 hero-card-border opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
  </article>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  name: { type: String, required: true },
  description: { type: String, required: true, default: '' },
  icon: { type: String, required: false, default: null },
  tags: { type: Array, required: false, default: () => [] },
  url: { type: String, required: true },
  delay: { type: String, required: true }, // e.g., '0.2s'
  size: { type: String, required: true, validator: value => ['small', 'large'].includes(value) }
});

const cardClasses = computed(() => ({
  'hero-card-small': props.size === 'small',
  'hero-card-large': props.size === 'large',
}));

// 显示标签（最多3个）
const displayTags = computed(() => {
  return props.tags.slice(0, 3);
});

// 实现点击跳转的函数
const goToUrl = () => {
  if (props.url) {
    window.open(props.url, '_blank', 'noopener,noreferrer');
  }
};
</script>

<style scoped>
@import "tailwindcss";

/* ========== HeroUI 卡片核心样式 ========== */

/* 基础卡片容器 - 增强毛玻璃效果 */
.hero-card {
  @apply rounded-3xl transition-all duration-500 ease-out border block;
  position: relative;
  min-height: 100px;
  width: 100%;
  
  /* 增强的毛玻璃效果 */
  backdrop-filter: blur(32px) saturate(180%);
  -webkit-backdrop-filter: blur(32px) saturate(180%);
  
  /* 多层背景增强玻璃质感 - 使用主题色变量 */
  background: 
    linear-gradient(135deg, rgba(255, 255, 255, 0.25) 0%, rgba(255, 255, 255, 0.05) 100%),
    linear-gradient(225deg, rgba(var(--primary-color-rgb), 0.1) 0%, rgba(var(--secondary-color-rgb), 0.05) 50%, rgba(var(--accent-color-rgb), 0.03) 100%);
  
  border: 1px solid rgba(255, 255, 255, 0.3);
  
  /* 增强的阴影系统 - 使用主题色变量 */
  box-shadow: 
    0 8px 32px rgba(var(--primary-color-rgb), 0.15),
    0 4px 16px rgba(var(--secondary-color-rgb), 0.1),
    0 2px 8px rgba(var(--accent-color-rgb), 0.08),
    inset 0 1px 0 rgba(255, 255, 255, 0.2),
    inset 0 -1px 0 rgba(255, 255, 255, 0.1);
}

/* 卡片背景层 */
.hero-card-bg {
  background: linear-gradient(
    135deg,
    rgba(255, 255, 255, 0.15) 0%,
    rgba(255, 255, 255, 0.05) 100%
  );
  border-radius: inherit;
}

/* 卡片悬浮光效 - 使用主题色变量 */
.hero-card-glow {
  background: radial-gradient(
    circle at center,
    rgba(var(--primary-color-rgb), 0.15) 0%,
    rgba(var(--secondary-color-rgb), 0.08) 50%,
    transparent 100%
  );
  border-radius: inherit;
}

/* 顶部发光条 - 使用主题色变量 */
.hero-card-top-glow {
  background: linear-gradient(
    90deg,
    transparent 0%,
    rgba(var(--primary-color-rgb), 0.6) 20%,
    rgba(var(--secondary-color-rgb), 0.6) 50%,
    rgba(var(--accent-color-rgb), 0.6) 80%,
    transparent 100%
  );
  height: 2px;
  border-radius: 1px;
}

/* 卡片边框高光 - 使用主题色变量 */
.hero-card-border {
  border: 1px solid;
  border-image: linear-gradient(
    135deg,
    rgba(var(--primary-color-rgb), 0.4),
    rgba(var(--secondary-color-rgb), 0.3),
    rgba(var(--accent-color-rgb), 0.2)
  ) 1;
  border-radius: inherit;
}

/* 卡片悬浮效果 - 增强毛玻璃 */
.hero-card:hover {
  transform: translateY(-8px) scale(1.02);
  
  /* 悬浮时增强毛玻璃效果 */
  backdrop-filter: blur(40px) saturate(200%) brightness(110%);
  -webkit-backdrop-filter: blur(40px) saturate(200%) brightness(110%);
  
  /* 悬浮时的多层背景 - 使用主题色变量 */
  background: 
    linear-gradient(135deg, rgba(255, 255, 255, 0.35) 0%, rgba(255, 255, 255, 0.15) 100%),
    linear-gradient(225deg, rgba(var(--primary-color-rgb), 0.15) 0%, rgba(var(--secondary-color-rgb), 0.08) 50%, rgba(var(--accent-color-rgb), 0.05) 100%);
  
  /* 增强的悬浮阴影 - 使用主题色变量 */
  box-shadow: 
    0 32px 64px rgba(var(--primary-color-rgb), 0.25),
    0 16px 32px rgba(var(--secondary-color-rgb), 0.2),
    0 8px 16px rgba(var(--accent-color-rgb), 0.15),
    0 4px 8px rgba(var(--primary-color-rgb), 0.1),
    inset 0 2px 0 rgba(255, 255, 255, 0.3),
    inset 0 -1px 0 rgba(255, 255, 255, 0.15);
    
  border-color: rgba(var(--primary-color-rgb), 0.5);
}

/* 焦点状态 */
.hero-card:focus-visible {
  outline: none;
  ring: 2px solid var(--primary-color);
  ring-offset: 2px;
  ring-offset-color: rgba(255, 255, 255, 0.1);
}

/* ========== 内容区域样式 ========== */

.hero-card-content {
  @apply p-6 flex flex-col justify-start;
  min-height: inherit;
  position: relative;
  z-index: 1;
}

/* ========== 大卡片样式 ========== */

.hero-card-large {
  @apply min-h-[160px] max-h-[200px];
  /* 大卡片专用内边距和间距 - 平衡尺寸 */
  .hero-card-content {
    @apply p-6;
  }
}

.hero-large-card {
  @apply flex flex-col h-full;
  gap: 1rem; /* 平衡的间距控制 */
}

.hero-card-header {
  @apply flex items-start gap-3;
  /* 头部区域优化 - 紧凑间距 */
  flex-shrink: 0;
}

/* 大卡片图标容器 - 紧凑设计 */
.hero-icon-container {
  @apply relative flex items-center justify-center rounded-2xl transition-all duration-300;
  width: 3rem; /* 48px - 适中的图标容器 */
  height: 3rem;
  flex-shrink: 0; /* 防止压缩 */
  
  /* 图标容器毛玻璃效果 */
  backdrop-filter: blur(16px) saturate(150%);
  -webkit-backdrop-filter: blur(16px) saturate(150%);
  
  /* 增强立体感的阴影系统 */
  box-shadow: 
    0 8px 25px rgba(var(--primary-color-rgb), 0.25),
    0 4px 12px rgba(var(--secondary-color-rgb), 0.15),
    0 2px 6px rgba(var(--accent-color-rgb), 0.1),
    inset 0 2px 0 rgba(255, 255, 255, 0.4),
    inset 0 -1px 0 rgba(255, 255, 255, 0.2);
    
  border: 1px solid rgba(255, 255, 255, 0.35);
}

.hero-icon-bg {
  @apply absolute inset-0 rounded-2xl;
  background: linear-gradient(135deg, var(--primary-color) 0%, var(--accent-color) 100%);
  /* 添加微妙的内部光效 */
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.3);
}

.hero-icon-image {
  @apply w-6 h-6 object-contain relative z-10;
  filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.1));
}

.hero-icon-text {
  @apply text-white font-bold text-lg relative z-10;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
}

/* 大卡片标题 - 优化长标题处理 */
.hero-card-title {
  @apply text-xl font-bold leading-tight;
  @apply overflow-hidden;
  flex: 1; /* 充分利用空间 */
  line-height: 1.3;
  max-height: 3.3rem; /* 允许2行显示 */
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  
  background: linear-gradient(135deg, var(--gray-900), var(--gray-700));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  transition: all 0.3s ease;
}

.hero-card:hover .hero-card-title {
  background: linear-gradient(135deg, var(--primary-color), var(--accent-color));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  transform: translateY(-1px); /* 微妙的悬浮效果 */
}

/* 大卡片描述 - 平衡可读性 */
.hero-card-description {
  @apply text-sm text-gray-600 dark:text-gray-300 leading-relaxed;
  @apply overflow-hidden;
  flex: 1; /* 自适应高度 */
  min-height: 3.2rem; /* 平衡高度 */
  max-height: 3.2rem; /* 固定高度避免错乱 */
  line-height: 1.4;
  opacity: 0.9;
  transition: opacity 0.3s ease;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}

.hero-card:hover .hero-card-description {
  opacity: 1;
}

/* 标签区域 - 优化布局 */
.hero-card-tags {
  @apply flex flex-wrap gap-2 items-center;
  flex-shrink: 0; /* 防止标签被压缩 */
  margin-top: auto; /* 推到底部 */
}

.hero-tag {
  @apply px-2.5 py-1 text-xs font-semibold rounded-full;
  @apply transition-all duration-300 transform hover:scale-105;
  
  /* 标签毛玻璃效果 */
  backdrop-filter: blur(8px) saturate(120%);
  -webkit-backdrop-filter: blur(8px) saturate(120%);
  
  background: linear-gradient(135deg, 
    rgba(var(--primary-color-rgb), 0.15) 0%, 
    rgba(var(--secondary-color-rgb), 0.12) 100%
  );
  color: var(--primary-color);
  border: 1px solid rgba(var(--primary-color-rgb), 0.3);
  box-shadow: 
    0 2px 4px rgba(var(--primary-color-rgb), 0.1),
    inset 0 1px 0 rgba(255, 255, 255, 0.2);
}

.hero-tag-more {
  @apply px-2 py-1 text-xs font-medium rounded-full;
  @apply text-gray-500 dark:text-gray-400;
  background: rgba(107, 114, 128, 0.1);
  border: 1px solid rgba(107, 114, 128, 0.2);
}

/* ========== 小卡片样式 ========== */

.hero-card-small {
  @apply h-[100px] min-h-[100px] max-h-[100px];
  /* 小卡片专用内边距 */
  .hero-card-content {
    @apply p-4;
  }
}

.hero-small-card {
  @apply flex flex-col items-center justify-center h-full;
  gap: 0.75rem; /* 精确的间距控制 */
}

/* 小卡片图标容器 - 优化设计 */
.hero-small-icon-container {
  @apply relative flex items-center justify-center rounded-2xl transition-all duration-300;
  width: 2.75rem; /* 44px - 更合适的小图标尺寸 */
  height: 2.75rem;
  flex-shrink: 0;
  
  /* 小图标容器毛玻璃效果 */
  backdrop-filter: blur(12px) saturate(140%);
  -webkit-backdrop-filter: blur(12px) saturate(140%);
  
  /* 精致的阴影效果 */
  box-shadow: 
    0 6px 16px rgba(var(--primary-color-rgb), 0.2),
    0 3px 8px rgba(var(--secondary-color-rgb), 0.12),
    0 1px 4px rgba(var(--accent-color-rgb), 0.08),
    inset 0 1px 0 rgba(255, 255, 255, 0.35),
    inset 0 -1px 0 rgba(255, 255, 255, 0.2);
    
  border: 1px solid rgba(255, 255, 255, 0.3);
}

.hero-small-icon-bg {
  @apply absolute inset-0 rounded-2xl;
  background: linear-gradient(135deg, var(--primary-color) 0%, var(--accent-color) 100%);
  /* 添加微妙的内部光效 */
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.25);
}

.hero-small-icon-image {
  @apply w-5 h-5 object-contain relative z-10;
  filter: drop-shadow(0 1px 2px rgba(0, 0, 0, 0.1));
}

.hero-small-icon-text {
  @apply text-white font-bold text-base relative z-10;
  text-shadow: 0 1px 3px rgba(0, 0, 0, 0.3);
}

/* 小卡片标题 - 优化可读性 */
.hero-small-card-title {
  @apply text-sm font-bold text-center;
  @apply overflow-hidden text-ellipsis line-clamp-2 max-w-full;
  line-height: 1.3;
  max-height: 2.6rem;
  width: 100%;
  
  /* 使用渐变文字效果 */
  background: linear-gradient(135deg, var(--gray-900), var(--gray-700));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  transition: all 0.3s ease;
}

.hero-card:hover .hero-small-card-title {
  background: linear-gradient(135deg, var(--primary-color), var(--accent-color));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  transform: translateY(-1px);
}

/* ========== 深色模式适配 ========== */

/* 深色模式毛玻璃效果 */
.dark .hero-card {
  /* 深色模式增强毛玻璃 */
  backdrop-filter: blur(32px) saturate(150%) brightness(90%);
  -webkit-backdrop-filter: blur(32px) saturate(150%) brightness(90%);
  
  /* 深色模式多层背景 - 使用主题色变量 */
  background: 
    linear-gradient(135deg, rgba(30, 41, 59, 0.7) 0%, rgba(15, 23, 42, 0.5) 100%),
    linear-gradient(225deg, rgba(var(--secondary-color-rgb), 0.1) 0%, rgba(var(--accent-color-rgb), 0.05) 50%, rgba(var(--primary-color-rgb), 0.03) 100%);
  
  border-color: rgba(255, 255, 255, 0.15);
  
  box-shadow: 
    0 8px 32px rgba(0, 0, 0, 0.5),
    0 4px 16px rgba(var(--secondary-color-rgb), 0.15),
    0 2px 8px rgba(var(--accent-color-rgb), 0.1),
    inset 0 1px 0 rgba(255, 255, 255, 0.1),
    inset 0 -1px 0 rgba(255, 255, 255, 0.05);
}

.dark .hero-card-bg {
  background: linear-gradient(
    135deg,
    rgba(30, 41, 59, 0.4) 0%,
    rgba(15, 23, 42, 0.2) 100%
  );
}

.dark .hero-card:hover {
  /* 深色模式悬浮时毛玻璃增强 */
  backdrop-filter: blur(40px) saturate(180%) brightness(110%);
  -webkit-backdrop-filter: blur(40px) saturate(180%) brightness(110%);
  
  /* 深色模式悬浮背景 - 使用主题色变量 */
  background: 
    linear-gradient(135deg, rgba(30, 41, 59, 0.8) 0%, rgba(15, 23, 42, 0.6) 100%),
    linear-gradient(225deg, rgba(var(--secondary-color-rgb), 0.15) 0%, rgba(var(--accent-color-rgb), 0.08) 50%, rgba(var(--primary-color-rgb), 0.05) 100%);
  
  box-shadow: 
    0 32px 64px rgba(0, 0, 0, 0.7),
    0 16px 32px rgba(var(--secondary-color-rgb), 0.25),
    0 8px 16px rgba(var(--accent-color-rgb), 0.2),
    0 4px 8px rgba(var(--primary-color-rgb), 0.15),
    inset 0 2px 0 rgba(255, 255, 255, 0.15),
    inset 0 -1px 0 rgba(255, 255, 255, 0.08);
    
  border-color: rgba(var(--secondary-color-rgb), 0.5);
}

.dark .hero-tag {
  background: linear-gradient(135deg, 
    rgba(168, 85, 247, 0.15) 0%, 
    rgba(236, 72, 153, 0.15) 100%
  );
  color: var(--primary-color-light);
  border-color: rgba(168, 85, 247, 0.3);
}

/* ========== 响应式设计 ========== */

/* 大屏幕优化 */
@media (min-width: 1280px) {
  .hero-card-large {
    @apply min-h-[150px] max-h-[190px];
  }
  
  .hero-card-large .hero-card-content {
    @apply p-5;
  }
  
  .hero-large-card {
    gap: 0.875rem;
  }
  
  .hero-card-title {
    @apply text-lg;
    max-height: 3rem;
  }
  
  .hero-card-description {
    @apply text-sm;
    min-height: 2.8rem;
    max-height: 2.8rem;
  }
  
  .hero-icon-container {
    width: 2.75rem;
    height: 2.75rem;
  }
  
  .hero-icon-image {
    @apply w-5 h-5;
  }
  
  .hero-icon-text {
    @apply text-base;
  }
}

/* 平板尺寸优化 */
@media (max-width: 768px) {
  .hero-card-large .hero-card-content {
    @apply p-5;
  }
  
  .hero-card-small .hero-card-content {
    @apply p-3;
  }
  
  .hero-large-card {
    gap: 0.875rem;
  }
  
  .hero-card-large {
    @apply min-h-[145px] max-h-[185px];
  }
  
  .hero-card-title {
    @apply text-lg;
    max-height: 3rem;
  }
  
  .hero-card-description {
    @apply text-sm;
    min-height: 2.8rem;
    max-height: 2.8rem;
  }
  
  .hero-icon-container {
    width: 2.75rem;
    height: 2.75rem;
  }
  
  .hero-icon-image {
    @apply w-5 h-5;
  }
  
  .hero-card-small {
    @apply h-[85px] min-h-[85px] max-h-[85px];
  }
  
  .hero-small-card {
    gap: 0.5rem;
  }
  
  .hero-small-icon-container {
    width: 2.25rem;
    height: 2.25rem;
  }
  
  .hero-small-icon-image {
    @apply w-4 h-4;
  }
  
  .hero-tag {
    @apply px-2 py-0.5 text-xs;
  }
}

@media (max-width: 480px) {
  .hero-card-content {
    @apply p-3;
  }
  
  .hero-card-large {
    @apply min-h-[120px] max-h-[160px];
  }
  
  .hero-card-title {
    @apply text-base;
  }
  
  .hero-card-description {
    @apply text-xs mb-2;
    height: 2.4rem;
  }
  
  .hero-icon-container {
    @apply w-8 h-8;
  }
  
  .hero-icon-image {
    @apply w-4 h-4;
  }
  
  .hero-card-small {
    @apply h-[70px] min-h-[70px] max-h-[70px];
  }
  
  .hero-small-card {
    @apply gap-1;
  }
  
  .hero-small-icon-container {
    @apply w-6 h-6;
  }
  
  .hero-small-icon-image {
    @apply w-3 h-3;
  }
  
  .hero-small-card-title {
    @apply text-xs;
    max-height: 1.8rem;
  }
  
  .hero-tag {
    @apply px-1.5 py-0.5 text-xs;
  }
}

/* ========== 动画增强 ========== */

.hero-card {
  animation-fill-mode: backwards;
  
  /* 确保毛玻璃效果在所有浏览器中正常工作 */
  -webkit-transform: translateZ(0);
  transform: translateZ(0);
  will-change: transform, backdrop-filter;
}

/* 自定义卡片进入动画 */
.hero-fade-in {
  opacity: 0;
  animation: heroFadeInUp 0.6s ease-out forwards;
}

/* 自定义卡片动画确保兼容性 */
@keyframes heroFadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.hero-card:hover .hero-icon-container {
  box-shadow: 
    0 12px 24px rgba(99, 102, 241, 0.3),
    inset 0 2px 0 rgba(255, 255, 255, 0.4);
}

.hero-card:hover .hero-tag {
  box-shadow: 0 4px 8px rgba(99, 102, 241, 0.2);
}

.hero-card:active {
  transform: translateY(-4px) scale(1.01);
  transition-duration: 0.1s;
}
</style>