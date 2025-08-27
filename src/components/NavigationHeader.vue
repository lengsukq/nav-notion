<template>
  <!-- HeroUI 页面头部：个人导航中心 -->
  <header class="navigation-header glass-effect rounded-3xl p-6 sm:p-8 shadow-xl transition-all duration-300 fade-in-up relative">
    <!-- HeroUI 装饰性背景元素 -->
    <div class="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-indigo-400/10 to-transparent rounded-full blur-2xl pointer-events-none" style="clip-path: inset(0);"></div>
    <div class="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-purple-400/10 to-transparent rounded-full blur-2xl pointer-events-none" style="clip-path: inset(0);"></div>
    
    <div class="flex flex-col md:flex-row items-center justify-between gap-6 relative z-10">
      <!-- 标题和描述 - 个人导航核心 -->
      <div class="text-center md:text-left">
        <div class="inline-flex items-center gap-4 mb-6">
          <!-- 增强的图标容器 -->
          <div class="relative">
            <div class="w-16 h-16 rounded-3xl flex items-center justify-center shadow-2xl backdrop-blur-sm border border-white/20 relative overflow-hidden" style="background: linear-gradient(135deg, var(--primary-color), var(--secondary-color))">
              <!-- 内部光效 -->
              <div class="absolute inset-0 bg-gradient-to-tr from-white/20 to-transparent"></div>
              <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-white relative z-10" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <!-- 围绕图标的装饰圆环 -->
            <div class="absolute -inset-2 rounded-full border-2 border-dashed border-indigo-300/30 animate-spin" style="animation-duration: 10s;"></div>
          </div>
          <!-- 改进的标签设计 -->
          <div class="flex flex-col">
            <span class="text-xs font-semibold uppercase tracking-wider mb-1 px-3 py-1 rounded-full bg-gradient-to-r from-indigo-100 to-purple-100 text-indigo-700 border border-indigo-200/50">个人导航中心</span>
            <span class="text-xs text-gray-500 dark:text-gray-400">Personal Navigation Hub</span>
          </div>
        </div>
        <h1 class="text-3xl md:text-5xl font-bold mb-3 leading-tight" style="background: linear-gradient(135deg, var(--primary-color-dark), var(--secondary-color-dark), var(--accent-color)); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;">{{ databaseInfo.title }}</h1>
        <p class="text-gray-600 dark:text-gray-400 text-base md:text-lg leading-relaxed max-w-2xl">{{ databaseInfo.description }}</p>
      </div>
      
      <!-- 时间显示和搜索框区域 -->
      <div class="flex flex-col items-center md:items-end gap-6 w-full md:w-auto">
        <!-- 增强的时间显示组件容器 -->
        <div class="flex items-center gap-4 px-4 py-2 rounded-2xl bg-white/20 backdrop-blur-sm border border-white/30 shadow-lg">
          <TimeDisplay />
          <!-- 在线状态指示器 -->
          <div class="flex items-center gap-2">
            <div class="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            <span class="text-xs text-gray-600 dark:text-gray-400 font-medium">在线</span>
          </div>
        </div>
        
        <!-- 搜索框和设置按钮 -->
        <div class="flex items-center gap-4 w-full">
          <div class="flex-grow">
            <SearchBox @search="$emit('search', $event)" />
          </div>
          <button
            @click="$emit('toggle-settings')"
            class="flex-shrink-0 relative group bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white p-4 rounded-2xl font-medium flex items-center justify-center shadow-lg transition-all duration-300 transform hover:scale-105 hover:shadow-xl focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-indigo-500 dark:focus-visible:ring-offset-gray-900 overflow-hidden"
            aria-label="设置"
          >
            <!-- 按钮内部光效 -->
            <div class="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
            <!-- 设置图标 (齿轮) -->
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 relative z-10 group-hover:rotate-90 transition-transform duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </button>
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
/* 组件特定的样式可以在这里添加 */
</style>