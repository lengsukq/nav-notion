<template>
  <!-- HeroUI 页面头部：个人导航中心 -->
  <header class="navigation-header glass-effect rounded-3xl p-6 sm:p-8 shadow-xl transition-all duration-300 fade-in-up">
    <div class="flex flex-col md:flex-row items-center justify-between gap-6">
      <!-- 标题和描述 - 个人导航核心 -->
      <div class="text-center md:text-left">
        <div class="inline-flex items-center gap-3 mb-4">
          <div class="w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg" style="background: linear-gradient(to bottom right, var(--primary-color), var(--secondary-color))">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <span class="text-sm font-medium uppercase tracking-wide" style="color: var(--primary-color)">个人导航中心</span>
        </div>
        <h1 class="text-3xl md:text-4xl font-bold" style="background: linear-gradient(to right, var(--primary-color-dark), var(--secondary-color-dark)); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;">{{ databaseInfo.title }}</h1>
        <p class="text-gray-600 dark:text-gray-400 text-base md:text-lg mt-2 leading-relaxed">{{ databaseInfo.description }}</p>
      </div>
      
      <!-- 时间显示和搜索框区域 -->
      <div class="flex flex-col items-center md:items-end gap-4 w-full md:w-auto">
        <!-- 时间显示组件 -->
        <TimeDisplay />
        
        <!-- 搜索框和设置按钮 -->
        <div class="flex items-center gap-3 w-full">
          <div class="flex-grow">
            <SearchBox @search="$emit('search', $event)" />
          </div>
          <button
            @click="$emit('toggle-settings')"
            class="flex-shrink-0 bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white p-3 rounded-2xl font-medium flex items-center justify-center shadow-lg transition-all duration-300 transform hover:scale-105 hover:shadow-xl focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-indigo-500 dark:focus-visible:ring-offset-gray-900"
            aria-label="设置"
          >
            <!-- 设置图标 (齿轮) -->
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
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