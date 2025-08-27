<template>
  <!-- HeroUI 导航卡片列表 - 个人导航核心功能 -->
  <div class="navigation-cards">
    <!-- HeroUI 初始加载状态 -->
    <div v-if="loading" class="flex justify-center items-center py-24 fade-in-up">
      <div class="relative">
        <div class="animate-spin rounded-full h-16 w-16 border-4 border-transparent shadow-lg" style="border-top-color: var(--primary-color); border-bottom-color: var(--secondary-color);"></div>
        <div class="absolute inset-0 rounded-full h-16 w-16 border-4 border-transparent animate-pulse" style="border-top-color: var(--primary-color-light); border-bottom-color: var(--secondary-color-light);"></div>
      </div>
    </div>

    <!-- HeroUI 错误状态 -->
    <div v-else-if="error" class="gradient-border p-1 rounded-3xl shadow-xl mt-8 fade-in-up">
      <div class="bg-white dark:bg-gray-800 rounded-3xl p-8 text-center flex flex-col items-center gap-6">
        <!-- 错误图标 -->
        <div class="w-16 h-16 bg-gradient-to-br from-red-400 to-red-600 rounded-2xl flex items-center justify-center shadow-lg">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>
        <div>
          <h3 class="text-xl font-bold text-gray-900 dark:text-white mb-2">加载失败</h3>
          <p class="text-gray-600 dark:text-gray-400">{{ error }}</p>
        </div>
        <button 
          @click="$emit('retry')" 
          class="px-6 py-3 bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white font-semibold rounded-2xl shadow-lg transition-all duration-300 transform hover:scale-105 hover:shadow-xl"
        >
          重新加载
        </button>
      </div>
    </div>

    <!-- HeroUI 导航卡片列表 -->
    <div v-else>
      <div :class="cardContainerClasses" class="fade-in-up">
        <NavigationCard
          v-for="(item, index) in processedLinks"
          :key="index"
          :name="item.name"
          :description="item.description"
          :tags="item.tags"
          :url="item.url"
          :icon="item.icon"
          :delay="`${index * 100}ms`"
          :size="cardSizeMode"
        />
      </div>
      
      <!-- HeroUI 加载更多指示器 -->
      <div v-if="isFetchingMore" class="flex justify-center items-center py-8">
        <div class="relative">
          <div class="animate-spin rounded-full h-10 w-10 border-3 border-transparent shadow-md" style="border-top-color: var(--primary-color); border-bottom-color: var(--secondary-color);"></div>
          <div class="absolute inset-0 rounded-full h-10 w-10 border-3 border-transparent animate-pulse" style="border-top-color: var(--primary-color-light); border-bottom-color: var(--secondary-color-light);"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import NavigationCard from './NavigationCard.vue';
import { computed } from 'vue';

// 定义组件的props
const props = defineProps({
  loading: {
    type: Boolean,
    required: true,
    default: false
  },
  error: {
    type: String,
    required: false,
    default: null
  },
  navigationLinks: {
    type: Array,
    required: true,
    default: () => []
  },
  searchQuery: {
    type: String,
    required: true,
    default: ''
  },
  cardSizeMode: {
    type: String,
    required: true,
    default: 'large'
  },
  isFetchingMore: {
    type: Boolean,
    required: true,
    default: false
  }
});

// 定义组件的事件
defineEmits(['retry']);

// 根据卡片大小设置动态计算网格布局的 class
const cardContainerClasses = computed(() => {
  const baseClasses = 'gap-3 sm:gap-4 mt-8';
  if (props.cardSizeMode === 'small') {
    // 小卡模式显示更多列：手机3列，平板4列，桌面5-6列，大屏幕7-8列
    return `grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-7 2xl:grid-cols-8 ${baseClasses}`;
  } else {
    // 大卡模式平衡布局：确保内容清晰且充分利用空间
    return `grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 ${baseClasses}`;
  }
});

// 根据搜索条件过滤链接
const processedLinks = computed(() => {
  if (!props.searchQuery.trim()) {
    return props.navigationLinks;
  }
  const lowerCaseQuery = props.searchQuery.trim().toLowerCase();
  return props.navigationLinks.filter(link =>
    link.name.toLowerCase().includes(lowerCaseQuery) ||
    link.description.toLowerCase().includes(lowerCaseQuery)
  );
});
</script>

<style scoped>
/* 组件特定的样式可以在这里添加 */
</style>