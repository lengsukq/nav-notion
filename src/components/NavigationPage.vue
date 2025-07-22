<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-200 to-purple-300 dark:from-gray-800 dark:to-gray-900 py-12 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
    <div class="w-full max-w-7xl">

      <!-- 页面头部区域 -->
      <header class="text-center mb-12 backdrop-blur-sm bg-white/30 dark:bg-gray-900/30 rounded-3xl p-6 shadow-xl relative">
        <h1 class="text-4xl font-extrabold text-gray-900 dark:text-white mb-2 drop-shadow-lg">{{ databaseInfo.title }}</h1>
        <p class="text-gray-700 dark:text-gray-300 text-lg">{{ databaseInfo.description }}</p>
      </header>

      <!-- 标签筛选区域 -->
      <div class="flex flex-wrap justify-center gap-2 mb-8 p-4 bg-white/20 dark:bg-gray-800/20 rounded-2xl">
        <FilterTag
          v-for="tag in availableTags"
          :key="tag.name"
          :tag-name="tag.name"
          :tag-color="tag.color"
          :is-selected="selectedTags.includes(tag.name)"
          @tag-click="toggleTag"
        />
      </div>

      <!-- 设置按钮和搜索框区域 -->
      <div class="flex items-center justify-center mb-6">
        <button
          @click="settingsStore.toggleSettings()"
          class="bg-white/50 dark:bg-gray-800/50 text-gray-700 dark:text-gray-300 p-2 rounded-full text-sm font-medium transition-all duration-300 hover:shadow-lg flex items-center space-x-1 z-index-100 mr-2"
          aria-label="设置"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
        </button>
        <SearchBox @search="handleSearch" />
      </div>

      <!-- 初始加载状态 -->
      <div v-if="loading" class="flex justify-center items-center h-64 mt-8">
        <div class="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-500 dark:border-blue-400"></div>
      </div>

      <!-- 错误状态 -->
      <div v-else-if="error" class="bg-red-100 dark:bg-red-900 border border-red-300 dark:border-red-700 rounded-3xl p-8 text-center shadow-lg mt-8">
        <p class="text-red-700 dark:text-red-300 text-lg">{{ error }}</p>
        <button @click="fetchNotionData(selectedTags, null)" class="mt-6 px-6 py-3 bg-blue-600 dark:bg-blue-700 text-white font-semibold rounded-full shadow-md hover:bg-blue-700 dark:hover:bg-blue-800 transition-all duration-300 ease-in-out transform hover:-translate-y-1 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50">
          重试
        </button>
      </div>

      <!-- 导航卡片列表 -->
      <div v-else>
        <!-- 列表容器 -->
        <div :class="cardContainerClasses">
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

        <!-- 加载更多数据的指示器，仅在非初始加载且有更多数据时显示 -->
        <div v-if="isFetchingMore" class="flex justify-center items-center py-4">
          <div class="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500 dark:border-blue-400"></div>
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

// --- 状态管理 ---
const navigationLinks = ref([]); // 存储所有导航链接数据
const loading = ref(true);        // 初始加载状态，用于显示大的加载动画
const error = ref(null);          // 存储可能发生的错误信息
const databaseInfo = ref({ title: '导航中心', description: '从 Notion 数据库获取的链接集合' }); // 数据库的标题和描述
const availableTags = ref([]);    // Notion 数据库中可用的所有标签
const selectedTags = ref([]);     // 当前用户选中的标签
const searchQuery = ref('');      // 当前搜索框中的查询文本

// 分页状态
const nextCursor = ref(null);     // Notion API 返回的下一页的 cursor
const hasMore = ref(false);       // Notion API 返回的标识是否还有更多数据
const isFetchingMore = ref(false); // 用于控制在加载更多数据时显示小的加载指示器

// Pinia Store
const settingsStore = useSettingsStore();
const { cardSizeMode } = storeToRefs(settingsStore); // 获取卡片大小的设置

// --- 环境变量 ---
const NOTION_TOKEN = import.meta.env.VITE_APP_NOTION_TOKEN;
const NOTION_VERSION = import.meta.env.VITE_APP_NOTION_VERSION || '2022-06-28';
const NOTION_DATABASE_ID = import.meta.env.VITE_APP_NOTION_DATABASE_ID;
const PROXY_URL = import.meta.env.VITE_APP_PROXY_URL; // 用于代理 Notion API 请求

// --- 计算属性 ---

// 根据卡片大小动态生成 grid 布局的 CSS 类
const cardContainerClasses = computed(() => {
  const baseClasses = 'gap-4 mt-8'; // 基础间距和外边距
  if (cardSizeMode.value === 'small') {
    // 小尺寸卡片：在不同屏幕尺寸下显示不同列数
    return `grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 ${baseClasses}`;
  } else { // large
    // 大尺寸卡片：在不同屏幕尺寸下显示不同列数
    return `grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 ${baseClasses}`;
  }
});

// 处理搜索和过滤逻辑，返回最终要显示的链接列表
const processedLinks = computed(() => {
  let filtered = navigationLinks.value; // 从所有链接开始

  // 如果有搜索查询，则进行过滤
  if (searchQuery.value.trim()) {
    const lowerCaseQuery = searchQuery.value.trim().toLowerCase();
    filtered = filtered.filter(link =>
      link.name.toLowerCase().includes(lowerCaseQuery) ||
      link.description.toLowerCase().includes(lowerCaseQuery)
    );
  }
  return filtered;
});

// --- 方法 ---

// 切换标签的选中状态，并根据选中的标签重新请求数据
const toggleTag = (tagName) => {
  let newSelectedTags;
  if (selectedTags.value.includes(tagName)) {
    // 如果标签已选中，则移除
    newSelectedTags = selectedTags.value.filter(tag => tag !== tagName);
  } else {
    // 否则，添加新标签
    newSelectedTags = [...selectedTags.value, tagName];
  }
  selectedTags.value = newSelectedTags;
  // 当标签改变时，需要重置分页并从头开始加载数据
  fetchNotionData(selectedTags.value, null);
};

// 更新搜索查询文本
const handleSearch = (query) => {
  searchQuery.value = query;
};

// 解析 Notion API 返回的数据库查询结果，提取所需信息
const processNotionResponse = (data) => {
  if (!data || !Array.isArray(data.results)) {
    return [];
  }
  return data.results
    .filter(item => item.object === 'page' && item.properties) // 确保是 page 类型且有 properties
    .map(item => {
      const properties = item.properties;
      const name = properties['name']?.title?.[0]?.plain_text || '未命名'; // 获取名字，如果不存在则设为 '未命名'
      const url = properties['url']?.rich_text?.[0]?.text?.link?.url || properties['url']?.rich_text?.[0]?.plain_text || '#'; // 获取 URL
      const description = properties['description']?.rich_text?.[0]?.plain_text || '无描述'; // 获取描述
      const icon = properties['icon']?.phone_number; // 获取图标（根据你的 Notion 结构，这里需要确认 'icon' 字段的正确类型）
      let tags = [];
      // 提取 multi_select 类型的标签
      if (properties['tag'] && properties['tag'].type === 'multi_select') {
        tags = properties['tag'].multi_select.map(tag => tag.name);
      }
      return { name, url, description, icon, tags };
    });
};

// 获取 Notion 数据库的元数据（标题、描述、标签列表）
const fetchDatabaseMetadata = async () => {
  if (!NOTION_TOKEN || !NOTION_DATABASE_ID || !PROXY_URL) {
    console.warn('Notion 凭证配置不完整，跳过元数据获取。');
    return;
  }
  try {
    const response = await fetch(`${PROXY_URL}https://api.notion.com/v1/databases/${NOTION_DATABASE_ID}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${NOTION_TOKEN}`,
        'Notion-Version': NOTION_VERSION,
      },
    });
    if (!response.ok) throw new Error(`HTTP 错误! 状态: ${response.status}`);
    const data = await response.json();

    // 设置数据库标题和描述
    databaseInfo.value.title = data.title?.[0]?.plain_text || 'nav-notion';
    databaseInfo.value.description = data.description?.[0]?.plain_text || 'nav-notion';

    // 提取可用的标签选项
    if (data.properties?.tag?.type === 'multi_select') {
      availableTags.value = data.properties.tag.multi_select.options.map(option => ({
        name: option.name,
        color: option.color // Notion 返回的标签颜色
      }));
    }
  } catch (err) {
    console.error('获取 Notion 数据库元数据失败:', err);
  }
};

// 获取 Notion 数据库的链接数据，支持标签过滤和分页
const fetchNotionData = async (tagsToFilter = [], startCursor = null) => {
  // 检查 Notion API 配置是否完整
  if (!NOTION_TOKEN || !NOTION_DATABASE_ID || !PROXY_URL) {
    error.value = '请检查 .env 文件中是否已配置 Notion API Token, Database ID 和 Proxy URL。';
    loading.value = false; // 即使配置不全，也要关闭初始加载
    return;
  }

  // 设置加载状态
  if (startCursor) {
    isFetchingMore.value = true; // 正在加载更多数据
  } else {
    loading.value = true;         // 初始加载或因标签切换而重新加载
    error.value = null;
    navigationLinks.value = [];     // 清空之前的数据
    nextCursor.value = null;      // 重置 cursor
    hasMore.value = false;        // 重置 hasMore 标志
  }

  const requestOptions = {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${NOTION_TOKEN}`,
      'Notion-Version': NOTION_VERSION,
      'Content-Type': 'application/json'
    },
  };

  // 构建请求体
  const body = {
    // page_size: 100, // 可以设置每页数量，默认是 100
  };

  // 如果有标签过滤条件，则添加到 filter 中
  if (tagsToFilter.length > 0) {
    const filterPredicates = tagsToFilter.map(tagName => ({
      property: 'tag',
      type: 'multi_select',
      multi_select: {
        contains: tagName, // 包含指定标签
      },
    }));

    body.filter = {
      and: filterPredicates, // 必须包含所有选中的标签
    };
  }

  // 如果提供了 startCursor，则添加到请求体中以获取下一页
  if (startCursor) {
    body.start_cursor = startCursor;
  }

  requestOptions.body = JSON.stringify(body); // 将请求体转换为 JSON 字符串

  try {
    // 发送 API 请求
    const response = await fetch(`${PROXY_URL}https://api.notion.com/v1/databases/${NOTION_DATABASE_ID}/query`, {
      ...requestOptions,
    });

    // 处理非成功的响应
    if (!response.ok) {
        const errorData = await response.json();
        console.error('Notion API 错误详情:', errorData);
        const errorMessage = errorData.message || `HTTP 错误! 状态: ${response.status}`;
        throw new Error(`无法获取数据: ${errorMessage}`);
    }

    const data = await response.json();
    const processed = processNotionResponse(data); // 处理返回的数据

    // 根据是否是分页加载，决定是追加数据还是替换数据
    if (startCursor) {
      navigationLinks.value = [...navigationLinks.value, ...processed]; // 追加到现有列表
    } else {
      navigationLinks.value = processed; // 替换为新加载的数据
    }

    // 更新分页状态
    nextCursor.value = data.next_cursor;
    hasMore.value = data.has_more;

    // 根据加载结果设置错误信息
    if (navigationLinks.value.length === 0 && tagsToFilter.length > 0) {
        error.value = `未找到包含所有选中标签 (${tagsToFilter.join(', ')}) 的导航链接。`;
    } else if (navigationLinks.value.length === 0 && tagsToFilter.length === 0) {
        // 这种情况也可能是由于配置错误，保留原来的提示
        error.value = '未从 Notion 数据库找到任何导航链接。请检查数据库内容、字段名称以及您是否设置了 "是否显示" 属性（如果需要）。';
    } else {
        error.value = null; // 清除错误信息
    }

  } catch (err) {
    error.value = err.message; // 捕获并设置错误信息
    console.error('获取 Notion 数据时出错:', err);
  } finally {
    loading.value = false;         // 停止初始加载状态
    isFetchingMore.value = false;  // 停止加载更多状态
  }
};

// --- 滚动事件监听 ---

// 处理页面滚动，实现无限滚动加载
const handleScroll = () => {
  // 当没有正在加载更多数据，且还有更多数据可加载，并且用户滚动到页面底部附近时
  if (
    !isFetchingMore.value &&
    hasMore.value &&
    // 检查是否滚动到视口底部（留有 100px 缓冲）
    window.innerHeight + window.scrollY >= document.body.offsetHeight - 100
  ) {
    // 请求下一页数据
    fetchNotionData(selectedTags.value, nextCursor.value);
  }
};

// --- 生命周期钩子 ---

onMounted(() => {
  fetchDatabaseMetadata(); // 获取数据库元数据
  fetchNotionData();       // 首次加载数据

  // 添加滚动事件监听器以实现无限滚动
  window.addEventListener('scroll', handleScroll);
});

// 组件卸载时移除滚动事件监听器，防止内存泄漏
onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll);
});

// --- Watchers ---

// 监听数据库标题的变化，用于更新页面标题
watch(
  () => databaseInfo.value.title,
  (newTitle) => {
    document.title = newTitle || '导航中心';
  },
  { immediate: true } // 立即执行一次，设置初始页面标题
);

// 监听 selectedTags 的变化。
// 注意：toggleTag 方法内部已经调用了 fetchNotionData(selectedTags.value, null)
// 当标签切换时，会触发重新加载并重置分页，所以这个 watcher 目前是冗余的。
// 如果 toggleTag 不再主动调用 fetchNotionData，则此处需要取消注释：
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

/* 自定义错误提示的颜色，覆盖 Tailwind 的默认颜色 */
.bg-red-100 {
  background-color: rgba(254, 202, 202, 1);
}
.dark .bg-red-900 {
  background-color: rgba(127, 29, 29, 1);
}
.border-red-300 {
  border-color: rgba(239, 68, 68, 1);
}
.dark .border-red-700 {
  border-color: rgba(185, 28, 28, 1);
}
</style>