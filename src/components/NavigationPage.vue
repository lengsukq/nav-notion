<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-200 to-purple-300 dark:from-gray-800 dark:to-gray-900 py-12 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
    <div class="w-full max-w-7xl">

      <header class="text-center mb-12 backdrop-blur-sm bg-white/30 dark:bg-gray-900/30 rounded-3xl p-6 shadow-xl relative">
        <h1 class="text-4xl font-extrabold text-gray-900 dark:text-white mb-2 drop-shadow-lg">{{ databaseInfo.title }}</h1>
        <p class="text-gray-700 dark:text-gray-300 text-lg">{{ databaseInfo.description }}</p>
      </header>

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

      <div class="flex items-center justify-center mb-6">
        <button
          @click="settingsStore.toggleSettings()"
          class="bg-white/50 dark:bg-gray-800/50 text-gray-700 dark:text-gray-300 p-2 rounded-full text-sm font-medium transition-all duration-300 hover:shadow-lg flex items-center space-x-1 z-index-100 mr-2"
          aria-label="Settings"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
        </button>
        <SearchBox @search="handleSearch" />
      </div>

      <div v-if="loading" class="flex justify-center items-center h-64 mt-8">
        <div class="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-500 dark:border-blue-400"></div>
      </div>

      <div v-else-if="error" class="bg-red-100 dark:bg-red-900 border border-red-300 dark:border-red-700 rounded-3xl p-8 text-center shadow-lg mt-8">
        <p class="text-red-700 dark:text-red-300 text-lg">{{ error }}</p>
        <button @click="fetchNotionData(selectedTags)" class="mt-6 px-6 py-3 bg-blue-600 dark:bg-blue-700 text-white font-semibold rounded-full shadow-md hover:bg-blue-700 dark:hover:bg-blue-800 transition-all duration-300 ease-in-out transform hover:-translate-y-1 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50">
          重试
        </button>
      </div>

      <div v-else :class="cardContainerClasses">
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
import { ref, onMounted, computed, watch } from 'vue';
import color from 'color';

// --- State Management ---
const navigationLinks = ref([]);
const loading = ref(true);
const error = ref(null);
const databaseInfo = ref({ title: '导航中心', description: '从 Notion 数据库获取的链接集合' });
const availableTags = ref([]);
const selectedTags = ref([]);
const searchQuery = ref('');

// Pinia Store
const settingsStore = useSettingsStore();
const { cardSizeMode } = storeToRefs(settingsStore);

// --- Environment Variables ---
const NOTION_TOKEN = import.meta.env.VITE_APP_NOTION_TOKEN;
const NOTION_VERSION = import.meta.env.VITE_APP_NOTION_VERSION || '2022-06-28';
const NOTION_DATABASE_ID = import.meta.env.VITE_APP_NOTION_DATABASE_ID;
const PROXY_URL = import.meta.env.VITE_APP_PROXY_URL;

// --- Computed Properties ---
const cardContainerClasses = computed(() => {
  const baseClasses = 'gap-4 mt-8';
  if (cardSizeMode.value === 'small') {
    return `grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 ${baseClasses}`;
  } else { // large
    return `grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 ${baseClasses}`;
  }
});

const processedLinks = computed(() => {
  let filtered = navigationLinks.value;
  if (searchQuery.value.trim()) {
    const lowerCaseQuery = searchQuery.value.trim().toLowerCase();
    filtered = filtered.filter(link =>
      link.name.toLowerCase().includes(lowerCaseQuery) ||
      link.description.toLowerCase().includes(lowerCaseQuery)
    );
  }
  return filtered;
});

// --- Methods ---
const toggleTag = (tagName) => {
  let newSelectedTags;
  if (selectedTags.value.includes(tagName)) {
    newSelectedTags = selectedTags.value.filter(tag => tag !== tagName);
  } else {
    newSelectedTags = [...selectedTags.value, tagName];
  }
  selectedTags.value = newSelectedTags;
  fetchNotionData(selectedTags.value);
};

const handleSearch = (query) => {
  searchQuery.value = query;
};

const processNotionResponse = (data) => {
  if (!data || !Array.isArray(data.results)) {
    return [];
  }
  return data.results
    .filter(item => item.object === 'page' && item.properties)
    .map(item => {
      const properties = item.properties;
      const name = properties['name']?.title?.[0]?.plain_text || '未命名';
      const url = properties['url']?.rich_text?.[0]?.text?.link?.url || properties['url']?.rich_text?.[0]?.plain_text || '#';
      const description = properties['description']?.rich_text?.[0]?.plain_text || '无描述';
      const icon = properties['icon']?.phone_number;
      let tags = [];
      if (properties['tag'] && properties['tag'].type === 'multi_select') {
        tags = properties['tag'].multi_select.map(tag => tag.name);
      }
      return { name, url, description, icon, tags };
    });
};

const fetchDatabaseMetadata = async () => {
  if (!NOTION_TOKEN || !NOTION_DATABASE_ID || !PROXY_URL) {
    console.warn('Notion credentials not fully configured. Skipping metadata fetch.');
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
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    const data = await response.json();

    databaseInfo.value.title = data.title?.[0]?.plain_text || 'nav-notion';
    databaseInfo.value.description = data.description?.[0]?.plain_text || 'nav-notion';

    if (data.properties?.tag?.type === 'multi_select') {
      availableTags.value = data.properties.tag.multi_select.options.map(option => ({
        name: option.name,
        color: option.color // Notion's color for the tag
      }));
    }
  } catch (err) {
    console.error('Failed to fetch Notion database metadata:', err);
  }
};

const fetchNotionData = async (tagsToFilter = []) => {
  if (!NOTION_TOKEN || !NOTION_DATABASE_ID || !PROXY_URL) {
    error.value = '请检查 .env 文件中是否已配置 Notion API Token, Database ID 和 Proxy URL。';
    loading.value = false;
    return;
  }

  loading.value = true;
  error.value = null;

  const requestOptions = {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${NOTION_TOKEN}`,
      'Notion-Version': NOTION_VERSION,
      'Content-Type': 'application/json'
    },
  };

  if (tagsToFilter.length > 0) {
    const filterPredicates = tagsToFilter.map(tagName => ({
      property: 'tag',
      type: 'multi_select',
      multi_select: {
        contains: tagName,
      },
    }));

   const filterBody = {
      filter: {
        and: filterPredicates, 
      },
    };
    requestOptions.body = JSON.stringify(filterBody);
  }


  try {
    const response = await fetch(`${PROXY_URL}https://api.notion.com/v1/databases/${NOTION_DATABASE_ID}/query`, {
      ...requestOptions,
    });

    if (!response.ok) {
        const errorData = await response.json();
        console.error('Notion API Error Details:', errorData);
        const errorMessage = errorData.message || `HTTP error! Status: ${response.status}`;
        throw new Error(`无法获取数据: ${errorMessage}`);
    }

    const data = await response.json();
    navigationLinks.value = processNotionResponse(data);

    if (navigationLinks.value.length === 0 && tagsToFilter.length > 0) {
        error.value = `未找到包含所有选中标签 (${tagsToFilter.join(', ')}) 的导航链接。`;
    } else if (navigationLinks.value.length === 0 && tagsToFilter.length === 0) {
        error.value = '未从 Notion 数据库找到任何导航链接。请检查数据库内容、字段名称以及您是否设置了 "是否显示" 属性（如果需要）。';
    } else {
        error.value = null;
    }

  } catch (err) {
    error.value = err.message;
    console.error('Error fetching Notion data:', err);
  } finally {
    loading.value = false;
  }
};

// --- Lifecycle Hooks ---
onMounted(() => {
  fetchDatabaseMetadata();
  fetchNotionData();
});

// --- Watchers ---
watch(
  () => databaseInfo.value.title,
  (newTitle) => {
    document.title = newTitle || '导航中心';
  },
  { immediate: true }
);
</script>

<style>
/* Global styles if not in App.vue or main.css */
body {
  margin: 0;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol';
}

header {
  backdrop-filter: blur(15px);
  -webkit-backdrop-filter: blur(15px);
  background: rgba(255, 255, 255, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.3);
}

.flex.items-center.justify-center.mb-6 {
  position: relative;
  z-index: 100;
}

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