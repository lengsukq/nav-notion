<template>
  <!-- 整个页面背景和布局 -->
  <div class="min-h-screen bg-gradient-to-br from-blue-200 to-purple-300 dark:from-gray-800 dark:to-gray-900 py-12 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
    <div class="w-full max-w-7xl">

      <!-- Header -->
      <header class="text-center mb-12 backdrop-blur-sm bg-white/30 dark:bg-gray-900/30 rounded-3xl p-6 shadow-xl relative">
        <h1 class="text-4xl font-extrabold text-gray-900 dark:text-white mb-2 drop-shadow-lg">{{ databaseInfo.title }}</h1>
        <p class="text-gray-700 dark:text-gray-300 text-lg">{{ databaseInfo.description }}</p>
      </header>

      <!-- Tag Filter Section -->
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

      <!-- 引入搜索框组件和设置按钮 -->
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
        <!-- Pass filteredLinks to SearchBox if it needs to display results -->
        <!-- Assuming SearchBox internally handles filtering or receives the current search term -->
        <SearchBox @search="handleSearch" />
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
import SearchBox from './SearchBox.vue'; // Make sure this path is correct
import SettingsModal from './SettingsModal.vue'; // Make sure this path is correct
import NavigationCard from './NavigationCard.vue'; // Make sure this path is correct
import FilterTag from './FilterTag.vue'; // Make sure this path is correct
import { useSettingsStore } from '../store/settings'; // Make sure this path is correct
import { storeToRefs } from 'pinia';
import { ref, onMounted, computed, watch } from 'vue';
import color from 'color'; // Make sure 'color' library is installed

// --- State Management ---
const navigationLinks = ref([]);
const loading = ref(true);
const error = ref(null);
const databaseInfo = ref({ title: '导航中心', description: '从 Notion 数据库获取的链接集合' });
const availableTags = ref([]);
const selectedTags = ref([]);
const searchQuery = ref(''); // State for the search query

// Pinia Store
const settingsStore = useSettingsStore();
const { cardSizeMode } = storeToRefs(settingsStore);

// --- Environment Variables ---
const NOTION_TOKEN = import.meta.env.VITE_APP_NOTION_TOKEN;
const NOTION_VERSION = import.meta.env.VITE_APP_NOTION_VERSION || '2022-06-28';
const NOTION_DATABASE_ID = import.meta.env.VITE_APP_NOTION_DATABASE_ID;
const PROXY_URL = import.meta.env.VITE_APP_PROXY_URL;

// --- Computed Properties ---

// Grid classes based on cardSizeMode
const cardContainerClasses = computed(() => {
  const baseClasses = 'gap-4 mt-8'; // Base gap and margin-top

  if (cardSizeMode.value === 'small') {
    // Small cards: At least two per row on small screens, expanding on larger ones
    return `grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 ${baseClasses}`;
  } else { // large
    // Large cards: Fewer per row
    return `grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 ${baseClasses}`;
  }
});

// Filter links based on selected tags and search query
const processedLinks = computed(() => {
  let filtered = navigationLinks.value;

  // Apply tag filtering
  if (selectedTags.value.length > 0) {
    filtered = filtered.filter(link =>
      selectedTags.value.every(tag => link.tags.includes(tag))
    );
  }

  // Apply search filtering
  if (searchQuery.value.trim()) {
    const lowerCaseQuery = searchQuery.value.trim().toLowerCase();
    filtered = filtered.filter(link =>
      link.name.toLowerCase().includes(lowerCaseQuery) ||
      link.description.toLowerCase().includes(lowerCaseQuery)
    );
  }
  console.log('filtered',filtered);
  return filtered;
});

// --- Methods ---

// Toggle tag selection
const toggleTag = (tagName) => {
  if (selectedTags.value.includes(tagName)) {
    selectedTags.value = selectedTags.value.filter(tag => tag !== tagName);
  } else {
    selectedTags.value = [...selectedTags.value, tagName];
  }
};

// Update search query from SearchBox component
const handleSearch = (query) => {
  searchQuery.value = query;
};

// Process Notion API response
const processNotionResponse = (data) => {
  if (!data || !Array.isArray(data.results)) {
    console.error('API 返回的数据格式不正确，缺少 results 数组');
    return [];
  }

  return data.results
    .filter(item => item.object === 'page' && item.properties)
    .map(item => {
      const properties = item.properties;

      const name = properties['name']?.title?.[0]?.plain_text || '未命名';
      // Use 'url' property for the link destination
      const url = properties['url']?.rich_text?.[0]?.text?.link?.url || properties['url']?.rich_text?.[0]?.plain_text || '#';
      const description = properties['description']?.rich_text?.[0]?.plain_text || '无描述';
      const icon = properties['icon']?.phone_number;
      
      // Assume 'tag' property is of type 'multi_select'
      let tags = [];
      if (properties['tag'] && properties['tag'].type === 'multi_select') {
        tags = properties['tag'].multi_select.map(tag => tag.name);
      }

      return {
        name,
        url,
        description,
        icon,
        tags
      };
    });
};

// Fetch database metadata (title, description, tags)
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
    console.log('data',data);
    
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

// Fetch data from Notion API
const fetchNotionData = async () => {
  // Check if all necessary environment variables are set
  if (!NOTION_TOKEN || !NOTION_DATABASE_ID || !PROXY_URL) {
    error.value = '请检查 .env 文件中是否已配置 Notion API Token, Database ID 和 Proxy URL。';
    loading.value = false;
    return;
  }

  loading.value = true;
  error.value = null;

  try {
    const response = await fetch(`${PROXY_URL}https://api.notion.com/v1/databases/${NOTION_DATABASE_ID}/query`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${NOTION_TOKEN}`,
        'Notion-Version': NOTION_VERSION,
        'Content-Type': 'application/json'
      },
    });

    if (!response.ok) {
        const errorData = await response.json();
        console.error('Notion API Error Details:', errorData);
        const errorMessage = errorData.message || `HTTP error! Status: ${response.status}`;
        throw new Error(`无法获取数据: ${errorMessage}`);
    }

    const data = await response.json();
    navigationLinks.value = processNotionResponse(data);

    if (navigationLinks.value.length === 0) {
        error.value = '未从 Notion 数据库找到任何导航链接。请检查数据库内容、字段名称以及您是否设置了 "是否显示" 属性（如果需要）。';
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
  fetchDatabaseMetadata(); // Fetch metadata first
  fetchNotionData();      // Then fetch the actual data
});

// Update document title based on database title
watch(
  () => databaseInfo.value.title,
  (newTitle) => {
    document.title = newTitle || '导航中心';
  },
  { immediate: true } // Run on initial load
);
</script>

<style>
/* Global styles if not in App.vue or main.css */
body {
  margin: 0;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol';
}

/* Header Glassmorphism */
header {
  backdrop-filter: blur(15px);
  -webkit-backdrop-filter: blur(15px);
  background: rgba(255, 255, 255, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.3);
}

/* Filter Tag Hover Effect - Inherited from FilterTag component */

/* Settings Button and Search Box Wrapper */
.flex.items-center.justify-center.mb-6 {
  position: relative; /* For z-index context */
  z-index: 100; /* Ensure it's above cards if they have shadows */
}

/* Error State Card Styles */
.bg-red-100 { /* Example: Overriding Tailwind if needed for specific styling */
  background-color: rgba(254, 202, 202, 1); /* Red-100 */
}
.dark .bg-red-900 {
  background-color: rgba(127, 29, 29, 1); /* Red-900 */
}
.border-red-300 {
  border-color: rgba(239, 68, 68, 1); /* Red-300 */
}
.dark .border-red-700 {
  border-color: rgba(185, 28, 28, 1); /* Red-700 */
}
/* Add more specific overrides if needed */

/* Global button/link styles for consistency */
button,
.FilterTag { /* Assuming FilterTag has a base class for styling */
  border-radius: 12px !important;
  transition: all 0.3s ease-in-out;
}
button:hover,
.FilterTag:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
}
.dark button:hover,
.dark .FilterTag:hover {
  box-shadow: 0 4px 15px rgba(255, 255, 255, 0.1);
}


/* Background Gradient Styles (if not handled by App.vue) */
/* Example: If you want to apply it directly here, but usually it's better in App.vue or a layout component */
/*
.bg-gradient-to-br {
  --tw-gradient-from: #93c5fd; // blue-200
  --tw-gradient-to: #a78bfa; // purple-300
  background-image: linear-gradient(to bottom right, var(--tw-gradient-from), var(--tw-gradient-to));
}
.dark .bg-gradient-to-br {
  --tw-gradient-from: #1f2937; // gray-800
  --tw-gradient-to: #374151; // gray-700
  background-image: linear-gradient(to bottom right, var(--tw-gradient-from), var(--tw-gradient-to));
}
*/
</style>