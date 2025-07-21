<template>
  <!-- 整个页面背景和布局 -->
  <div class="min-h-screen bg-gradient-to-br from-blue-200 to-purple-300 dark:from-gray-800 dark:to-gray-900 py-12 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
    <div class="w-full max-w-7xl">

      <!-- Header -->
      <header class="text-center mb-12 backdrop-blur-sm bg-white/30 dark:bg-gray-900/30 rounded-3xl p-6 shadow-xl relative">
        <h1 class="text-4xl font-extrabold text-gray-900 dark:text-white mb-2 drop-shadow-lg">导航中心</h1>
        <p class="text-gray-700 dark:text-gray-300 text-lg">从 Notion 数据库获取的链接集合</p>
      </header>

      <!-- 引入搜索框组件和设置按钮 -->
      <div class="flex items-center justify-center mb-6">
        <button 
          @click="() => { console.log('Settings button clicked'); settingsStore.toggleSettings() }"
          class="bg-white/50 dark:bg-gray-800/50 text-gray-700 dark:text-gray-300 p-2 rounded-full text-sm font-medium transition-all duration-300 hover:shadow-lg flex items-center space-x-1 z-index-100 mr-2"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
        </button>
        <SearchBox />
      </div>

      <!-- Loading State -->
      <div v-if="loading" class="flex justify-center items-center h-64 mt-8">
        <div class="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-500 dark:border-blue-400"></div>
      </div>

      <!-- Error State -->
      <div v-else-if="error" class="bg-red-100 dark:bg-red-900 border border-red-300 dark:border-red-700 rounded-3xl p-8 text-center shadow-lg mt-8">
        <p class="text-red-700 dark:text-red-300 text-lg">{{ error }}</p>
        <button @click="fetchNotionData" class="mt-6 px-6 py-3 bg-blue-600 dark:bg-blue-700 text-white font-semibold rounded-full shadow-md hover:bg-blue-700 dark:hover:bg-blue-800 transition-all duration-300 ease-in-out transform hover:-translate-y-1 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50">
          重试
        </button>
      </div>

      <!-- Navigation Links Grid -->
      <div v-else :class="cardSizeMode === 'small' ? 'grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 mt-8' : 'grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 mt-8'">
        <NavigationCard
          v-for="(item, index) in navigationLinks"
          :key="index"
          :name="item.name"
          :description="item.description"
          :tags="item.tags"
          :url="item.url"
          :delay="`${index * 50}ms`"
          :size="cardSizeMode"
        />
      </div>
      <SettingsModal />
    </div>


    </div>
</template>

<script setup>
import SearchBox from './SearchBox.vue';
import SettingsModal from './SettingsModal.vue';
import { useSettingsStore } from '../store/settings';
import { storeToRefs } from 'pinia';
import NavigationCard from './NavigationCard.vue'; // 导入新的导航卡片组件

import { ref, onMounted } from 'vue';

// State management
const navigationLinks = ref([]);
const loading = ref(true);
const error = ref(null);
// 从Pinia store获取设置状态
const settingsStore = useSettingsStore();
const { cardSizeMode } = storeToRefs(settingsStore);

// Get environment variables
const NOTION_TOKEN = import.meta.env.VITE_APP_NOTION_TOKEN;
const NOTION_VERSION = import.meta.env.VITE_APP_NOTION_VERSION || '2022-06-28';
const NOTION_DATABASE_ID = import.meta.env.VITE_APP_NOTION_DATABASE_ID;
const PROXY_URL = import.meta.env.VITE_APP_PROXY_URL;

// Process Notion API response to extract useful data
const processNotionResponse = (data) => {
  // 确保 data.results 存在且是一个数组
  if (!data || !Array.isArray(data.results)) {
    console.error('API 返回的数据格式不正确，缺少 results 数组');
    return []; // 返回空数组以防止后续错误
  }

  return data.results
    .filter(item => item.object === 'page') // 只处理 object 为 'page' 的项目
    .map(item => {
      const properties = item.properties;

      // 提取名称 - Notion API 的 title 属性
      // 属性名称是 "name"
      const name = properties['name']?.title?.[0]?.plain_text || '未命名';

      // 提取 URL - Notion API 的 rich_text 属性
      // 属性名称是 "url"，且链接可能嵌套在 text.link.url 中
      const url = properties['url']?.rich_text?.[0]?.text?.link?.url || properties['url']?.rich_text?.[0]?.plain_text || '#';

      // 提取描述 - Notion API 的 rich_text 属性
      // 属性名称是 "description"
      const description = properties['description']?.rich_text?.[0]?.plain_text || '无描述';

      // 提取标签 - 根据你提供的示例，'tag' 字段类型是 'multi_select'
      // 属性名称是 "tag"
      let tags = [];
      if (properties['tag'] && properties['tag'].type === 'multi_select') {
        // 如果你的 Notion 数据库 'tag' 字段是 'multi_select'，请使用此逻辑
        tags = properties['tag'].multi_select.map(tag => tag.name);
      } else {
        // 其他未知类型，或者字段不存在
        tags = [];
      }

      return {
        name,
        url,
        description,
        tags
      };
    });
};

// Fetch data from Notion API
const fetchNotionData = async () => {
  // 检查 Notion Token 是否已配置
  if (!NOTION_TOKEN) {
    console.error('未配置 Notion API Token (VITE_APP_NOTION_TOKEN)。请在 .env 文件中设置。');
    error.value = '未配置 Notion API Token。';
    loading.value = false;
    return;
  }
  // 检查 PROXY_URL 是否已配置
  if (!PROXY_URL) {
    console.error('未配置 Notion API Proxy URL (VITE_APP_PROXY_URL)。请在 .env 文件中设置。');
    error.value = '未配置 Notion API Proxy URL。';
    loading.value = false;
    return;
  }
  // 检查 NOTION_DATABASE_ID 是否已配置
  if (!NOTION_DATABASE_ID) {
    console.error('未配置 Notion Database ID (VITE_APP_NOTION_DATABASE_ID)。请在 .env 文件中设置。');
    error.value = '未配置 Notion Database ID。';
    loading.value = false;
    return;
  }

  loading.value = true;
  error.value = null;

  try {
    // Notion API 查询需要 POST 请求，并且 body 中指定了要查询的条件
    const response = await fetch(`${PROXY_URL}https://api.notion.com/v1/databases/${NOTION_DATABASE_ID}/query`, {
      method: 'POST', // 查询数据库使用 POST
      headers: {
        'Authorization': `Bearer ${NOTION_TOKEN}`, // Notion API 的认证头
        'Notion-Version': NOTION_VERSION,
        'Content-Type': 'application/json'
      },
    });

    if (!response.ok) {
        const errorData = await response.json(); // 尝试解析 Notion API 返回的错误信息
        console.error('Notion API 错误详情:', errorData);
        const errorMessage = errorData.message || `HTTP 错误: ${response.status}`;
        throw new Error(`无法获取数据: ${errorMessage}`);
    }

    const data = await response.json();
    navigationLinks.value = processNotionResponse(data);

    if (navigationLinks.value.length === 0) {
        error.value = '从 Notion 数据库未找到任何导航链接。请检查数据库内容、字段名称以及 "是否显示" 属性。';
    }

  } catch (err) {
    error.value = err.message;
    console.error('获取 Notion 数据时出错:', err);
  } finally {
    loading.value = false;
  }
};

// Fetch data when component mounts
onMounted(() => {
  fetchNotionData();
});
</script>

<style>
/* 全局样式，用于设置背景渐变和内容居中 */
/* (如果你的项目有全局 CSS 文件，这些也可以放在那里) */
body {
  margin: 0;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol';
  background-color: #f0f2f5; /* 默认背景，会被App.vue中的渐变覆盖 */
}

/* 毛玻璃和圆角样式 (这些也在 SearchBox.vue 和 App.vue 中重复使用，可以考虑移到全局 CSS) */
/* Header 的毛玻璃 */
header {
  backdrop-filter: blur(15px);
  -webkit-backdrop-filter: blur(15px);
  background: rgba(255, 255, 255, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.3);
}
/* Logo 区域的圆角和阴影 */
.flex.items-center.mb-4 > div {
  border-radius: 16px !important;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
}
/* 标签的圆角 */
.flex.flex-wrap.gap-2 span {
  border-radius: 10px !important;
}
/* loading 动画粗细 */
.animate-spin { border-width: 4px; }
/* error 状态的圆角和背景 */
.error-state-card {
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(5px);
  -webkit-backdrop-filter: blur(5px);
  border-radius: 20px;
}
/* 统一按钮和链接的圆角和阴影 */
button, a.text-blue-500 {
  border-radius: 12px !important;
}
button:hover, a.text-blue-500:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
}
/* 背景渐变 */
.bg-gradient-to-br {
  background-image: linear-gradient(to bottom right, var(--tw-gradient-stops));
  --tw-gradient-from: #a78bfa; /* purple-300 */
  --tw-gradient-from: #93c5fd; /* blue-200 */
  --tw-gradient-stops: var(--tw-gradient-from), var(--tw-gradient-to);
}
.dark .bg-gradient-to-br {
  --tw-gradient-from: #374151; /* gray-700 */
  --tw-gradient-from: #1f2937; /* gray-800 */
}

.app-search-wrapper {
  position: relative;
  z-index: 100; /* 确保搜索框及下拉菜单层级高于页面卡片 */
}

</style>