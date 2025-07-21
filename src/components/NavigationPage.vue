<template>
  <!-- 整个页面背景和布局 -->
  <div class="min-h-screen bg-gradient-to-br from-blue-200 to-purple-300 dark:from-gray-800 dark:to-gray-900 py-12 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
    <div class="w-full max-w-7xl">

      <!-- Header -->
      <header class="text-center mb-12 backdrop-blur-sm bg-white/30 dark:bg-gray-900/30 rounded-3xl p-6 shadow-xl">
        <h1 class="text-4xl font-extrabold text-gray-900 dark:text-white mb-2 drop-shadow-lg">导航中心</h1>
        <p class="text-gray-700 dark:text-gray-300 text-lg">从 Notion 数据库获取的链接集合</p>
      </header>

      <!-- 引入搜索框组件 -->
      <!-- 确保 SearchBox 组件被包含在一个有 z-index 的容器中 -->
      <SearchBox />

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
      <div v-else class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 mt-8">
        <div
          v-for="(item, index) in navigationLinks"
          :key="index"
          class="glassmorphic-card"
          :style="{ '--delay': `${index * 50}ms` }"
        >
          <div class="p-6 flex flex-col justify-between h-full">
            <div>
              <div class="flex items-center mb-4">
                <div class="w-12 h-12 rounded-2xl bg-blue-100 dark:bg-blue-900 flex items-center justify-center mr-4 shadow-lg">
                  <span class="text-2xl text-blue-600 dark:text-blue-300 font-extrabold">{{ item.name.charAt(0) }}</span>
                </div>
                <h3 class="text-xl font-bold text-gray-900 dark:text-white">{{ item.name }}</h3>
              </div>
              <p class="text-gray-700 dark:text-gray-300 text-sm mb-5 leading-relaxed">{{ item.description }}</p>
              <div class="flex flex-wrap gap-2 mb-5">
                <span v-for="(tag, tagIndex) in item.tags" :key="tagIndex" class="text-xs font-medium bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 px-3 py-1 rounded-full transition-colors duration-300 hover:bg-gray-300 dark:hover:bg-gray-600">
                  {{ tag }}
                </span>
              </div>
            </div>
            <a
              :href="item.url"
              target="_blank"
              rel="noopener noreferrer"
              class="mt-auto text-blue-500 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 text-sm font-semibold flex items-center transition-colors duration-300 ease-in-out"
            >
              访问链接
              <svg class="w-4 h-4 ml-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6v6m0 0v6m0-6h-6"></path>
              </svg>
            </a>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import SearchBox from './SearchBox.vue'; // 确保路径正确

import { ref, onMounted } from 'vue';

// State management
const navigationLinks = ref([]);
const loading = ref(true);
const error = ref(null);

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

/*DarkMode 颜色辅助 (如果 TailwindCSS 正常工作，这些可能不需要，除非你想覆盖)*/
/*
.dark {
  --tw-bg-opacity: 1;
  background-color: rgb(17 24 39 / var(--tw-bg-opacity)); // gray-900
}
.dark h1, .dark h2, .dark h3, .dark p, .dark span, .dark a, .dark li, .dark div {
  color: #e5e7eb; // dark gray-300
}
.dark .text-gray-900 { color: #e5e7eb; }
.dark .text-gray-600 { color: #9ca3af; }
.dark .text-gray-400 { color: #9ca3af; }
*/

/* 毛玻璃和圆角样式 (这些也在 SearchBox.vue 和 App.vue 中重复使用，可以考虑移到全局 CSS) */
/* 毛玻璃和圆角样式 - App.vue Card */
.glassmorphic-card {
  background: rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  border-radius: 24px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.1);
  transition: all 0.4s cubic-bezier(0.25, 0.8, 0.25, 1);
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 100%;
}
.glassmorphic-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 12px 40px 0 rgba(31, 38, 135, 0.2);
}
.glassmorphic-card {
  animation: fadeInUp 0.6s var(--delay, 0s) forwards cubic-bezier(0.25, 0.8, 0.25, 1);
  opacity: 0;
}
@keyframes fadeInUp {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}
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

/*
  z-index 管理:
  .global-search-container (z-index: 100)
    > SearchBox (component)
      > .search-box (position: relative, z-index: 10)
        > .engine-selector-container (position: relative, z-index: 10)
          > .engine-dropdown (position: absolute, z-index: 30) <- Highest inside searchbox
        > .search-input-container (position: relative)
          > .search-history (position: absolute, z-index: 25) <- High inside searchbox
*/

/* 修正: 确保 SearchBox 的父容器是定位的，以便其内部的绝对定位元素受其 z-index 影响 */
/* App.vue 中引入 SearchBox 的那个 div 需要有这个样式 */
.app-search-wrapper {
  position: relative;
  z-index: 100; /* 确保搜索框及下拉菜单层级高于页面卡片 */
}

</style>