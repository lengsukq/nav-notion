<template>
  <!-- HeroUI 页面根容器 - 个人导航核心模块 -->
  <div class="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 py-8 px-4 sm:px-6 lg:px-8">
    <div class="w-full max-w-7xl mx-auto space-y-12">

      <!-- HeroUI 页面头部：个人导航中心 -->
      <header class="relative z-20 glass-effect rounded-3xl p-6 sm:p-8 shadow-xl transition-all duration-300 fade-in-up">
        <div class="flex flex-col md:flex-row items-center justify-between gap-6">
          <!-- 标题和描述 - 个人导航核心 -->
          <div class="text-center md:text-left">
            <div class="inline-flex items-center gap-3 mb-4">
              <div class="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <span class="text-sm font-medium text-indigo-600 dark:text-indigo-400 uppercase tracking-wide">个人导航中心</span>
            </div>
            <h1 class="text-3xl md:text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">{{ databaseInfo.title }}</h1>
            <p class="text-gray-600 dark:text-gray-400 text-base md:text-lg mt-2 leading-relaxed">{{ databaseInfo.description }}</p>
          </div>
          
          <!-- 搜索框和设置按钮 -->
          <div class="flex items-center gap-3 w-full md:w-auto">
            <div class="flex-grow">
              <SearchBox @search="handleSearch" />
            </div>
            <button
              @click="settingsStore.toggleSettings()"
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
      </header>

      <!-- HeroUI 标签筛选区域 -->
      <div class="flex flex-wrap justify-center gap-3 p-6 glass-effect rounded-2xl shadow-lg fade-in-up">
        <FilterTag
          v-for="tag in availableTags"
          :key="tag.name"
          :tag-name="tag.name"
          :tag-color="tag.color"
          :is-selected="selectedTags.includes(tag.name)"
          @tag-click="toggleTag"
        />
      </div>

      <!-- HeroUI 初始加载状态 -->
      <div v-if="loading" class="flex justify-center items-center py-24 fade-in-up">
        <div class="relative">
          <div class="animate-spin rounded-full h-16 w-16 border-4 border-transparent border-t-indigo-500 border-b-purple-500 shadow-lg"></div>
          <div class="absolute inset-0 rounded-full h-16 w-16 border-4 border-transparent border-t-indigo-300 border-b-purple-300 animate-pulse"></div>
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
          <button @click="fetchNotionData(selectedTags, null)" class="px-6 py-3 bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white font-semibold rounded-2xl shadow-lg transition-all duration-300 transform hover:scale-105 hover:shadow-xl">
            重新加载
          </button>
        </div>
      </div>

      <!-- HeroUI 导航卡片列表 - 个人导航核心功能 -->
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
            <div class="animate-spin rounded-full h-10 w-10 border-3 border-transparent border-t-indigo-400 border-b-purple-400 shadow-md"></div>
            <div class="absolute inset-0 rounded-full h-10 w-10 border-3 border-transparent border-t-indigo-200 border-b-purple-200 animate-pulse"></div>
          </div>
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
    // 设置小页面布局中显示2-3列内容
    // 对于所有屏幕，至少显示2列
    // 对于大屏幕及以上，显示3列
    return `grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 ${baseClasses}`;
  } else {
    // 大卡模式保持原有布局，确保描述信息清晰展示
    return `grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 ${baseClasses}`;
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
      // 确保description字段能够正确获取
      const description = properties['description']?.rich_text?.[0]?.plain_text || '无描述';
      // 修正icon字段的获取方式
      const icon = item.icon?.type === 'external' ? item.icon.external.url : (item.icon?.type === 'file' ? item.icon.file.url : null);
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

    // 获取背景图片并应用到页面
    const backgroundImageUrl = data.cover?.file?.url || data.cover?.external?.url || null;
    if (backgroundImageUrl) {
      applyBackgroundImage(backgroundImageUrl);
    }

    if (data.properties?.tag?.type === 'multi_select') {
      availableTags.value = data.properties.tag.multi_select.options.map(option => ({
        name: option.name,
        color: option.color,
      }));
      
      // 设置默认标签为主页
      const homeTag = availableTags.value.find(tag => tag.name === '主页');
      if (homeTag) {
        selectedTags.value = ['主页'];
        // 自动触发数据获取
        setTimeout(() => {
          fetchNotionData(selectedTags.value, null, settingsStore.tagFilterMode);
        }, 100);
      }
    }
  } catch (err) {
    console.error('获取 Notion 数据库元数据失败:', err);
    // 元数据获取失败不应阻塞主流程，可以保留默认值
  }
};

// 应用背景图片到页面
const applyBackgroundImage = (imageUrl) => {
  const body = document.body;
  if (imageUrl && imageUrl.trim() !== '') {
    body.style.backgroundImage = `url(${imageUrl})`;
    body.style.backgroundSize = 'cover';
    body.style.backgroundPosition = 'center';
    body.style.backgroundRepeat = 'no-repeat';
    body.style.backgroundAttachment = 'fixed';
  } else {
    body.style.backgroundImage = '';
    body.style.backgroundSize = '';
    body.style.backgroundPosition = '';
    body.style.backgroundRepeat = '';
    body.style.backgroundAttachment = '';
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