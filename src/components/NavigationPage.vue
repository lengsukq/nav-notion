<template>
  <!-- 页面根容器，采用更现代的柔和背景色 -->
  <div class="min-h-screen bg-zinc-50 dark:bg-zinc-950 py-8 px-4 sm:px-6 lg:px-8">
    <div class="w-full max-w-7xl mx-auto space-y-12">

      <!-- 页面头部：标题、描述、搜索和设置 -->
      <header class="relative z-20 backdrop-blur-lg bg-white/50 dark:bg-zinc-900/50 border border-zinc-200/50 dark:border-zinc-800/50 rounded-3xl p-6 sm:p-8 shadow-lg transition-all duration-300">
        <div class="flex flex-col md:flex-row items-center justify-between gap-6">
          <!-- 标题和描述 -->
          <div class="text-center md:text-left">
            <h1 class="text-3xl md:text-4xl font-bold text-zinc-900 dark:text-zinc-100">{{ databaseInfo.title }}</h1>
            <p class="text-zinc-600 dark:text-zinc-400 text-base md:text-lg mt-2">{{ databaseInfo.description }}</p>
          </div>
          
          <!-- 搜索框和设置按钮 -->
          <div class="flex items-center gap-2 w-full md:w-auto">
            <div class="flex-grow">
              <SearchBox @search="handleSearch" />
            </div>
            <button
              @click="settingsStore.toggleSettings()"
              class="flex-shrink-0 bg-zinc-200/80 dark:bg-zinc-800/80 hover:bg-zinc-300/80 dark:hover:bg-zinc-700/80 text-zinc-700 dark:text-zinc-300 p-3 rounded-xl font-medium flex items-center justify-center shadow-sm transition-all duration-200 transform hover:scale-105 focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-500 dark:focus-visible:ring-offset-zinc-900"
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
      </header>

      <!-- 标签筛选区域 -->
      <div class="flex flex-wrap justify-center gap-2 p-4 backdrop-blur-md bg-white/30 dark:bg-zinc-900/30 border border-zinc-200/30 dark:border-zinc-800/30 rounded-2xl">
        <FilterTag
          v-for="tag in availableTags"
          :key="tag.name"
          :tag-name="tag.name"
          :tag-color="tag.color"
          :is-selected="selectedTags.includes(tag.name)"
          @tag-click="toggleTag"
        />
      </div>

      <!-- 初始加载状态 -->
      <div v-if="loading" class="flex justify-center items-center py-24">
        <div class="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-500"></div>
      </div>

      <!-- 错误状态 -->
      <div v-else-if="error" class="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-500/30 rounded-2xl p-8 text-center shadow-md mt-8 flex flex-col items-center gap-4">
        <!-- 警告图标 -->
        <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12 text-red-500 dark:text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
        <p class="text-red-700 dark:text-red-300 text-lg font-medium">{{ error }}</p>
        <button @click="fetchNotionData(selectedTags, null)" class="mt-4 px-6 py-2 font-semibold rounded-lg shadow-sm bg-blue-600 text-white hover:bg-blue-700 transition-colors duration-200">
          重试
        </button>
      </div>

      <!-- 导航卡片列表 -->
      <div v-else>
        <div :class="cardContainerClasses">
          <!-- 
            建议对 NavigationCard 组件本身也进行样式优化，
            使其具有圆角、阴影和过渡效果，以匹配整体风格。
            例如：bg-white dark:bg-zinc-900 rounded-2xl shadow-md hover:shadow-lg transition-all
          -->
          <NavigationCard
            v-for="(item, index) in processedLinks"
            :key="index"
            :name="item.name"
            :description="item.description"
            :tags="item.tags"
            :url="item.url"
            :icon="item.icon"
            :delay="`${index * 50}ms`"
            :size="cardSizeMode"
          />
        </div>
        
        <!-- 加载更多指示器 -->
        <div v-if="isFetchingMore" class="flex justify-center items-center py-6">
          <div class="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      </div>

      <!-- 设置模态框 -->
      <SettingsModal />
    </div>
  </div>
</template>

<script setup>
import SearchBox from './SearchBox.vue';
import SettingsModal from './SettingsModal.vue';
import NavigationCard from './NavigationCard.vue';
import FilterTag from './FilterTag.vue';
import { useSettingsStore } from '../store/settings';
import { storeToRefs } from 'pinia';
import { ref, onMounted, computed, watch, onUnmounted } from 'vue';

// --- 响应式状态定义 ---
const navigationLinks = ref([]); // 存储所有导航链接
const loading = ref(true);        // 初始数据加载状态
const error = ref(null);          // API请求错误信息
const databaseInfo = ref({ title: '导航中心', description: '正在从 Notion 加载...' });
const availableTags = ref([]);    // 所有可用标签
const selectedTags = ref([]);     // 用户选择的标签
const searchQuery = ref('');      // 搜索查询内容

// 分页状态
const nextCursor = ref(null);     // 用于下一页请求的游标
const hasMore = ref(false);       // 是否还有更多数据
const isFetchingMore = ref(false); // 是否正在加载更多数据

// 从 Pinia store 获取状态
const settingsStore = useSettingsStore();
const { cardSizeMode } = storeToRefs(settingsStore);

// --- 环境变量 ---
const NOTION_TOKEN = import.meta.env.VITE_APP_NOTION_TOKEN;
const NOTION_VERSION = import.meta.env.VITE_APP_NOTION_VERSION || '2022-06-28';
const NOTION_DATABASE_ID = import.meta.env.VITE_APP_NOTION_DATABASE_ID;
const PROXY_URL = import.meta.env.VITE_APP_PROXY_URL;

// --- 计算属性 ---

// 根据卡片大小设置动态计算网格布局的 class
const cardContainerClasses = computed(() => {
  const baseClasses = 'gap-4 sm:gap-6 mt-8';
  if (cardSizeMode.value === 'small') {
    return `grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 ${baseClasses}`;
  } else {
    return `grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 ${baseClasses}`;
  }
});

// 根据搜索条件过滤链接
const processedLinks = computed(() => {
  if (!searchQuery.value.trim()) {
    return navigationLinks.value;
  }
  const lowerCaseQuery = searchQuery.value.trim().toLowerCase();
  return navigationLinks.value.filter(link =>
    link.name.toLowerCase().includes(lowerCaseQuery) ||
    link.description.toLowerCase().includes(lowerCaseQuery)
  );
});

// --- 方法 ---

// 切换标签选中状态
const toggleTag = (tagName) => {
  let newSelectedTags;
  if (settingsStore.tagFilterMode === 'single') {
    newSelectedTags = selectedTags.value.includes(tagName) ? [] : [tagName];
  } else {
    newSelectedTags = selectedTags.value.includes(tagName)
      ? selectedTags.value.filter(tag => tag !== tagName)
      : [...selectedTags.value, tagName];
  }
  selectedTags.value = newSelectedTags;
  // 标签改变后，重置分页并从头获取数据
  fetchNotionData(selectedTags.value, null, settingsStore.tagFilterMode);
};

// 处理搜索框输入
const handleSearch = (query) => {
  searchQuery.value = query;
};

// 解析 Notion API 响应
const processNotionResponse = (data) => {
  if (!data || !Array.isArray(data.results)) return [];
  return data.results
    .filter(item => item.object === 'page' && item.properties)
    .map(item => {
      const { properties } = item;
      const name = properties['name']?.title?.[0]?.plain_text || '未命名';
      const url = properties['url']?.rich_text?.[0]?.text?.link?.url || properties['url']?.rich_text?.[0]?.plain_text || '#';
      const description = properties['description']?.rich_text?.[0]?.plain_text || '无描述';
      const icon = properties['icon']?.phone_number; // 确认 'icon' 字段类型是否正确
      const tags = properties['tag']?.multi_select?.map(tag => tag.name) || [];
      return { name, url, description, icon, tags };
    });
};

// 获取 Notion 数据库元数据（标题、描述、标签）
const fetchDatabaseMetadata = async () => {
  if (!NOTION_TOKEN || !NOTION_DATABASE_ID || !PROXY_URL) return;
  try {
    const response = await fetch(`${PROXY_URL}https://api.notion.com/v1/databases/${NOTION_DATABASE_ID}`, {
      method: 'GET',
      headers: { 'Authorization': `Bearer ${NOTION_TOKEN}`, 'Notion-Version': NOTION_VERSION },
    });
    if (!response.ok) throw new Error(`HTTP 错误! 状态: ${response.status}`);
    const data = await response.json();
    databaseInfo.value.title = data.title?.[0]?.plain_text || '导航中心';
    databaseInfo.value.description = data.description?.[0]?.plain_text || '一个从 Notion 数据库驱动的导航网站';
    if (data.properties?.tag?.type === 'multi_select') {
      availableTags.value = data.properties.tag.multi_select.options.map(option => ({
        name: option.name,
        color: option.color,
      }));
    }
  } catch (err) {
    console.error('获取 Notion 数据库元数据失败:', err);
    // 元数据获取失败不应阻塞主流程，可以保留默认值
  }
};

// 从 Notion 获取导航数据，支持过滤和分页
const fetchNotionData = async (tagsToFilter = [], startCursor = null, tagFilterMode = settingsStore.tagFilterMode) => {
  if (!NOTION_TOKEN || !NOTION_DATABASE_ID || !PROXY_URL) {
    error.value = '配置不完整，请检查 .env 文件中的 Notion API 相关设置。';
    loading.value = false;
    return;
  }

  // 设置加载状态
  if (startCursor) {
    isFetchingMore.value = true;
  } else {
    loading.value = true;
    error.value = null;
    navigationLinks.value = [];
    nextCursor.value = null;
    hasMore.value = false;
  }

  const body = {};
  if (tagsToFilter.length > 0) {
    const filterLogic = tagFilterMode === 'multiple' ? 'and' : 'or';
    body.filter = {
      [filterLogic]: tagsToFilter.map(tagName => ({
        property: 'tag',
        multi_select: { contains: tagName },
      })),
    };
  }
  if (startCursor) {
    body.start_cursor = startCursor;
  }

  try {
    const response = await fetch(`${PROXY_URL}https://api.notion.com/v1/databases/${NOTION_DATABASE_ID}/query`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${NOTION_TOKEN}`,
        'Notion-Version': NOTION_VERSION,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || `HTTP 错误! 状态: ${response.status}`);
    }

    const data = await response.json();
    const processed = processNotionResponse(data);
    
    navigationLinks.value = startCursor ? [...navigationLinks.value, ...processed] : processed;
    nextCursor.value = data.next_cursor;
    hasMore.value = data.has_more;

    // 如果过滤后没有结果，设置相应的提示信息
    if (navigationLinks.value.length === 0 && !hasMore.value) {
       if (tagsToFilter.length > 0) {
         error.value = `未找到符合所选标签的链接。`;
       } else if (!searchQuery.value) {
         error.value = `数据库为空或未能加载任何链接。`;
       }
    }

  } catch (err) {
    error.value = `数据加载失败: ${err.message}`;
    console.error('获取 Notion 数据时出错:', err);
  } finally {
    loading.value = false;
    isFetchingMore.value = false;
  }
};

// --- 无限滚动 ---
const handleScroll = () => {
  if (
    !isFetchingMore.value &&
    hasMore.value &&
    // 滚动到距离底部 200px 时触发加载
    window.innerHeight + window.scrollY >= document.body.offsetHeight - 200
  ) {
    fetchNotionData(selectedTags.value, nextCursor.value, settingsStore.tagFilterMode);
  }
};

// --- 生命周期钩子 ---
onMounted(() => {
  fetchDatabaseMetadata();
  fetchNotionData();
  window.addEventListener('scroll', handleScroll);
});

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll);
});

// --- 侦听器 ---

// 监听数据库标题变化，同步更新浏览器标签页标题
watch(
  () => databaseInfo.value.title,
  (newTitle) => {
    document.title = newTitle || '导航中心';
  },
  { immediate: true }
);

// 监听标签筛选模式变化，重置选择并重新加载数据
watch(
  () => settingsStore.tagFilterMode,
  () => {
    selectedTags.value = [];
    fetchNotionData([], null, settingsStore.tagFilterMode);
  }
);

// 当 `toggleTag` 方法内部已经调用 `fetchNotionData` 时，
// 下面的侦听器是多余的。保留注释以备将来参考。
// watch(selectedTags, () => {
//   fetchNotionData(selectedTags.value, null);
// }, { deep: true });
</script>

<style>
/* 全局样式，如果不在 App.vue 或 main.css 中定义 */
body {
  margin: 0;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol';
}

/* header 的背景和模糊效果 */
header {
  backdrop-filter: blur(15px);
  -webkit-backdrop-filter: blur(15px);
  background: rgba(255, 255, 255, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.3);
}

/* 确保设置按钮和搜索框有正确的 z-index */
.flex.items-center.justify-center.mb-6 {
  position: relative;
  z-index: 100;
}

</style>