<template>
  <!-- HeroUI 页面头部：个人导航中心 -->
  <header class="navigation-header glass-effect rounded-3xl p-4 sm:p-6 md:p-8 shadow-xl transition-all duration-300 fade-in-up relative">
    <!-- HeroUI 装饰性背景元素 - 在小屏幕上隐藏 -->
    <div class="hidden md:block absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-indigo-400/10 to-transparent rounded-full blur-2xl pointer-events-none" style="clip-path: inset(0);"></div>
    <div class="hidden md:block absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-purple-400/10 to-transparent rounded-full blur-2xl pointer-events-none" style="clip-path: inset(0);"></div>
    
    <div class="flex flex-col md:flex-row items-center justify-between gap-4 md:gap-6 relative z-10">
      <!-- 标题和描述 - 个人导航核心 - 在超小屏幕上隐藏 -->
      <div class="header-title-section text-center md:text-left">
        <div class="inline-flex items-center gap-3 sm:gap-4 mb-4 sm:mb-6">
          <!-- 增强的图标容器 -->
          <div class="relative">
            <div class="w-12 h-12 sm:w-16 sm:h-16 rounded-2xl sm:rounded-3xl flex items-center justify-center shadow-2xl backdrop-blur-sm border border-white/20 relative overflow-hidden" style="background: linear-gradient(135deg, var(--primary-color), var(--secondary-color))">
              <!-- 内部光效 -->
              <div class="absolute inset-0 bg-gradient-to-tr from-white/20 to-transparent"></div>
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 sm:h-8 sm:w-8 text-white relative z-10" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <!-- 围绕图标的装饰圆环 - 在小屏幕上隐藏 -->
            <div class="hidden sm:block absolute -inset-2 rounded-full border-2 border-dashed animate-spin" style="animation-duration: 10s; border-color: rgba(var(--primary-color-rgb), 0.3);"></div>
          </div>
          <!-- 改进的标签设计 - 在小屏幕上简化 -->
          <div class="flex flex-col">
            <span class="text-xs font-semibold uppercase tracking-wider mb-1 px-2 py-1 sm:px-3 rounded-full bg-gradient-to-r from-indigo-100 to-purple-100 text-indigo-700 border border-indigo-200/50">个人导航</span>
            <span class="hidden sm:block text-xs text-gray-500 dark:text-gray-400">Personal Navigation Hub</span>
          </div>
        </div>
        <h1 class="text-2xl sm:text-3xl md:text-5xl font-bold mb-2 sm:mb-3 leading-tight" style="background: linear-gradient(135deg, var(--primary-color-dark), var(--secondary-color-dark), var(--accent-color)); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;">{{ databaseInfo.title }}</h1>
        <p class="hidden sm:block text-gray-600 dark:text-gray-400 text-sm sm:text-base md:text-lg leading-relaxed max-w-2xl">{{ databaseInfo.description }}</p>
      </div>
      
      <!-- 时间显示和搜索框区域 -->
      <div class="flex flex-col items-center md:items-end gap-4 md:gap-6 w-full md:w-auto">
        <!-- 增强的时间显示组件容器 - 在超小屏幕上隐藏 -->
        <div class="header-time-section flex items-center gap-2 sm:gap-4 px-3 py-2 sm:px-4 rounded-xl sm:rounded-2xl bg-white/20 backdrop-blur-sm border border-white/30 shadow-lg">
          <TimeDisplay />
          <!-- 在线状态指示器 - 在小屏幕上隐藏文字 -->
          <div class="flex items-center gap-2">
            <div class="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            <span class="hidden sm:block text-xs text-gray-600 dark:text-gray-400 font-medium">在线</span>
          </div>
        </div>
        
        <!-- 搜索框（已集成设置按钮） -->
        <div class="flex items-center w-full">
          <div class="flex-grow">
            <SearchBox @search="$emit('search', $event)" @toggle-settings="$emit('toggle-settings')" />
          </div>
        </div>
      </div>
    </div>
  </header>
</template>

<script setup>
import SearchBox from './SearchBox.vue';
import TimeDisplay from './TimeDisplay.vue';

// 定义组件的props
defineProps({
  databaseInfo: {
    type: Object,
    required: true,
    default: () => ({ title: '导航中心', description: '正在从 Notion 加载...' })
  }
});

// 定义组件的事件
defineEmits(['search', 'toggle-settings']);
</script>

<style scoped>
@import "tailwindcss";

/* ========== 响应式布局优化 ========== */

/* 移动端特殊优化 */
@media (max-width: 640px) {
  .navigation-header {
    /* 进一步减少内边距 */
    @apply p-3;
  }
  
  /* 标题区域在移动端的优化 */
  .navigation-header h1 {
    /* 确保标题在小屏幕上不会过大 */
    line-height: 1.2;
  }
  
  /* 时间显示容器在移动端的优化 */
  .navigation-header .flex.items-center.gap-2 {
    /* 进一步减小间距 */
    gap: 0.5rem;
  }
  
  /* 搜索框和设置按钮容器在移动端的优化 */
  .navigation-header .flex.items-center.gap-3 {
    gap: 0.75rem;
  }
}

/* 中等小屏幕优化 */
@media (max-width: 480px) {
  .navigation-header {
    @apply p-2 rounded-2xl;
  }
  
  /* 主容器在超小屏幕上的间距调整 */
  .navigation-header > div {
    gap: 1rem;
  }
  
  /* 图标容器在超小屏幕上进一步缩小 */
  .navigation-header .w-12.h-12 {
    @apply w-10 h-10;
  }
  
  /* 标签在超小屏幕上的优化 */
  .navigation-header span {
    @apply text-xs px-2 py-0.5;
  }
  
  /* 时间显示容器在超小屏幕上的优化 */
  .navigation-header .px-3.py-2 {
    @apply px-2 py-1;
  }
  
  /* 设置按钮在超小屏幕上的优化 */
  .navigation-header .p-3 {
    @apply p-2;
  }
}

/* 横屏移动设备优化 */
@media (max-width: 896px) and (max-height: 414px) and (orientation: landscape) {
  .navigation-header {
    @apply p-3;
  }
  
  /* 在横屏时将标题和控制区域保持在一行 */
  .navigation-header > div {
    @apply flex-row items-center;
    gap: 1.5rem;
  }
  
  /* 隐藏描述文本以节省空间 */
  .navigation-header p {
    @apply hidden;
  }
  
  /* 简化图标区域 */
  .navigation-header .mb-4 {
    @apply mb-2;
  }
}

/* 小尺寸屏幕优化 - 只保留搜索和设置按钮 */
@media (max-width: 450px) {
  /* 隐藏标题区域 */
  .header-title-section {
    display: none;
  }
  
  /* 隐藏时间显示区域 */
  .header-time-section {
    display: none;
  }
  
  /* header布局调整为单行 */
  .navigation-header > div {
    flex-direction: row;
    align-items: center;
    justify-content: center;
    gap: 0;
  }
  
  /* 搜索区域占满宽度 */
  .navigation-header .flex.flex-col.items-center {
    flex-direction: row;
    width: 100%;
    gap: 0;
  }
  
  /* 小尺寸屏幕下简化header样式 - 移除双层边框效果 */
  .navigation-header {
    padding: 0.375rem;
    border-radius: 1rem;
    /* 移除毛玻璃背景，让搜索框成为主要视觉元素 */
    background: transparent;
    backdrop-filter: none;
    -webkit-backdrop-filter: none;
    box-shadow: none;
    border: none;
  }
}

/* 确保所有交互元素在小屏幕上有足够的触摸目标 */
@media (max-width: 640px) {
  .navigation-header button {
    min-width: 44px;
    min-height: 44px;
  }
}
</style>