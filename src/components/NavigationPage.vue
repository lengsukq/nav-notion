<template>
  <!-- HeroUI 页面根容器 - 个人导航核心模块 -->
  <div class="min-h-screen bg-transparent py-6 px-4 sm:px-6 lg:px-8 relative">
    <!-- HeroUI 装饰性几何元素 -->
    <div class="fixed top-20 left-10 w-32 h-32 bg-gradient-to-br from-indigo-400/20 to-purple-400/20 rounded-full blur-xl pointer-events-none animate-pulse"></div>
    <div class="fixed bottom-20 right-10 w-24 h-24 bg-gradient-to-br from-pink-400/20 to-indigo-400/20 rounded-full blur-xl pointer-events-none animate-pulse" style="animation-delay: 2s;"></div>
    <div class="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-40 h-40 bg-gradient-to-br from-purple-400/10 to-pink-400/10 rounded-full blur-2xl pointer-events-none animate-pulse" style="animation-delay: 4s;"></div>
    
    <div class="w-full max-w-7xl mx-auto space-y-8 relative z-0">

      <!-- HeroUI 页面头部：个人导航中心 -->
      <NavigationHeader 
        :database-info="databaseInfo" 
        @search="handleSearch" 
        @toggle-settings="settingsStore.toggleSettings()"
      />

      <!-- HeroUI 标签筛选区域 -->
      <NavigationTags 
        :available-tags="availableTags" 
        :selected-tags="selectedTags" 
        @tag-click="handleTagClick"
      />

      <!-- HeroUI 导航卡片列表 - 个人导航核心功能 -->
      <NavigationCards 
        :loading="loading" 
        :error="error" 
        :navigation-links="navigationLinks" 
        :search-query="searchQuery" 
        :card-size-mode="cardSizeMode" 
        :is-fetching-more="isFetchingMore" 
        @retry="handleRetry"
      />

      <!-- 设置模态框 -->
      <SettingsModal />
    </div>
  </div>
</template>

<script setup>
import NavigationHeader from './NavigationHeader.vue';
import NavigationTags from './NavigationTags.vue';
import NavigationCards from './NavigationCards.vue';
import SettingsModal from './SettingsModal.vue';
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
// 注意：processedLinks 和 cardContainerClasses 计算属性已移至 NavigationCards 组件中

// --- 方法 ---

// 处理标签点击事件
const handleTagClick = (tagName) => {
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

// 处理重试事件
const handleRetry = () => {
  fetchNotionData(selectedTags.value, null, settingsStore.tagFilterMode);
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
    body.style.backgroundColor = 'transparent';
  } else {
    body.style.backgroundImage = '';
    body.style.backgroundColor = '';
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
</script>

<style scoped>
/* 组件特定的样式 */

/* HeroUI 导航头部样式 */
.navigation-header {
  position: relative;
  z-index: 20;
}

/* HeroUI 标签区域样式 */
.navigation-tags {
  /* 标签区域的特定样式可以在这里添加 */
}

/* HeroUI 卡片区域样式 */
.navigation-cards {
  /* 卡片区域的特定样式可以在这里添加 */
}
</style>