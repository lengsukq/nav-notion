<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-7xl mx-auto">

      <!-- Header -->
      <header class="text-center mb-12">
        <h1 class="text-4xl font-bold text-gray-900 dark:text-white mb-2">导航中心</h1>
        <p class="text-gray-600 dark:text-gray-400">从Notion数据库获取的链接集合</p>
      </header>

      <SearchBox />


      <!-- Loading State -->
      <div v-if="loading" class="flex justify-center items-center h-64">
        <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>

      <!-- Error State -->
      <div v-else-if="error" class="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
        <p class="text-red-600 dark:text-red-400">{{ error }}</p>
        <button @click="fetchNotionData" class="mt-4 text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300">重试</button>
      </div>

      <!-- Navigation Links Grid -->
      <div v-else class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        <div v-for="(item, index) in navigationLinks" :key="index" class="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden transform transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
          <div class="p-6">
            <div class="flex items-center mb-3">
              <div class="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center mr-3">
                <span class="text-blue-600 dark:text-blue-300 font-bold">{{ item.name.charAt(0) }}</span>
              </div>
              <h3 class="text-lg font-semibold text-gray-900 dark:text-white">{{ item.name }}</h3>
            </div>
            <p class="text-gray-600 dark:text-gray-400 text-sm mb-4">{{ item.description }}</p>
            <div class="flex flex-wrap gap-2 mb-4">
              <span v-for="(tag, tagIndex) in item.tags" :key="tagIndex" class="text-xs bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 px-2 py-1 rounded-full">{{ tag }}</span>
            </div>
            <a :href="item.url" target="_blank" rel="noopener noreferrer" class="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 text-sm font-medium flex items-center">
              访问链接
              <svg class="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
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
import SearchBox from './SearchBox.vue';

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
      // body: JSON.stringify({
      //   // 您可以在这里添加过滤条件，例如只显示 '是否显示' 为 '显示' 的条目
      //   // filter: {
      //   //   property: "是否显示",
      //   //   status: {
      //   //     equals: "显示"
      //   //   }
      //   // }
      //   // 如果您已经在 Notion 中设置了过滤，或者想在前端过滤，可以注释掉这里
      // })
    });

    if (!response.ok) {
        const errorData = await response.json(); // 尝试解析 Notion API 返回的错误信息
        console.error('Notion API 错误详情:', errorData);
        // 尝试从错误信息中提取更具体的错误消息
        const errorMessage = errorData.message || `HTTP 错误: ${response.status}`;
        throw new Error(`无法获取数据: ${errorMessage}`);
    }

    const data = await response.json();
    navigationLinks.value = processNotionResponse(data);

    // 如果返回的数据为空，也设置一个提示
    if (navigationLinks.value.length === 0) {
        error.value = '从 Notion 数据库未找到任何导航链接。请检查数据库内容、字段名称以及 "是否显示" 属性。';
    }

  } catch (err) {
    error.value = err.message;
    console.error('获取 Notion 数据时出错:', err);
    // 在发生错误时，不回退到模拟数据，让用户看到错误信息
  } finally {
    loading.value = false;
  }
};

// Fetch data when component mounts
onMounted(() => {
  fetchNotionData();
});
</script>


<style scoped>
/* Add any component-specific styles here */
</style>