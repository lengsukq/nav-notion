<template>
  <!-- HeroUI 页面根容器 -->
  <div class="min-h-screen bg-transparent py-6 px-4 sm:px-6 lg:px-8 relative">
    <!-- 装饰性几何元素 (保持原样) -->
    <div class="fixed top-20 left-10 w-32 h-32 bg-gradient-to-br from-indigo-400/20 to-purple-400/20 rounded-full blur-xl pointer-events-none animate-pulse"></div>
    <div class="fixed bottom-20 right-10 w-24 h-24 bg-gradient-to-br from-pink-400/20 to-indigo-400/20 rounded-full blur-xl pointer-events-none animate-pulse" style="animation-delay: 2s;"></div>
    <div class="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-40 h-40 bg-gradient-to-br from-purple-400/10 to-pink-400/10 rounded-full blur-2xl pointer-events-none animate-pulse" style="animation-delay: 4s;"></div>
    
    <div class="w-full max-w-7xl mx-auto space-y-8 relative z-0">
      <NavigationHeader 
        :database-info="databaseInfo" 
        @search="handleSearch" 
        @toggle-settings="settingsStore.toggleSettings()"
      />

      <NavigationTags 
        :available-tags="availableTags" 
        :selected-tags="selectedTags" 
        @tag-click="handleTagClick"
      />

      <NavigationCards 
        :loading="loading" 
        :error="error" 
        :navigation-links="navigationLinks" 
        :search-query="searchQuery" 
        :card-size-mode="cardSizeMode" 
        :is-fetching-more="isFetchingMore" 
        @retry="handleRetry"
      />

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
import navigationCache from '../utils/cache';

// --- 配置与环境常量 ---
const CONFIG = {
  TOKEN: import.meta.env.VITE_APP_NOTION_TOKEN,
  VERSION: import.meta.env.VITE_APP_NOTION_VERSION || '2022-06-28',
  DB_ID: import.meta.env.VITE_APP_NOTION_DATABASE_ID,
  PROXY: import.meta.env.VITE_APP_PROXY_URL,
};

// --- 响应式状态 ---
const navigationLinks = ref([]);
const loading = ref(true);
const error = ref(null);
const databaseInfo = ref({ title: '导航中心', description: '正在从 Notion 加载...' });
const availableTags = ref([]);
const selectedTags = ref([]);
const searchQuery = ref('');

// 分页状态
const pagination = ref({
  nextCursor: null,
  hasMore: false,
  isFetchingMore: false
});

const settingsStore = useSettingsStore();
const { cardSizeMode, cacheExpiryTime } = storeToRefs(settingsStore);

// ==========================================
// 1. API Client Module (Internal Service)
// 遵循 Clean Interface & DRY 原则，统一请求逻辑
// ==========================================
const createNotionClient = () => {
  // 校验配置
  const validateConfig = () => {
    if (!CONFIG.TOKEN || !CONFIG.DB_ID || !CONFIG.PROXY) {
      throw new Error('配置不完整，请检查 .env 文件中的 Notion API 相关设置。');
    }
  };

  const getHeaders = () => ({
    'Authorization': `Bearer ${CONFIG.TOKEN}`,
    'Notion-Version': CONFIG.VERSION,
    'Content-Type': 'application/json',
  });

  // 通用请求方法，封装 fetch 和 错误处理
  const request = async (endpoint, method = 'GET', body = null) => {
    validateConfig();
    const url = `${CONFIG.PROXY}https://api.notion.com/v1/${endpoint}`;
    
    const response = await fetch(url, {
      method,
      headers: getHeaders(),
      body: body ? JSON.stringify(body) : null
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `HTTP 错误! 状态: ${response.status}`);
    }

    return response.json();
  };

  return {
    queryDatabase: (filters = null, cursor = null) => {
      const body = {};
      if (filters) body.filter = filters;
      if (cursor) body.start_cursor = cursor;
      return request(`databases/${CONFIG.DB_ID}/query`, 'POST', body);
    },
    retrieveDatabase: () => request(`databases/${CONFIG.DB_ID}`, 'GET')
  };
};

const notionApi = createNotionClient();

// ==========================================
// 2. Helper Functions (Pure Logic)
// 内存优化：纯函数，不依赖外部状态，易于垃圾回收
// ==========================================

// 解析 Notion 响应数据
const parseNotionResults = (results) => {
  if (!Array.isArray(results)) return [];
  
  return results
    .filter(item => item.object === 'page' && item.properties)
    .map(item => {
      const { properties } = item;
      return {
        name: properties['name']?.title?.[0]?.plain_text || '未命名',
        url: properties['url']?.rich_text?.[0]?.text?.link?.url || 
             properties['url']?.rich_text?.[0]?.plain_text || '#',
        description: properties['description']?.rich_text?.[0]?.plain_text || '无描述',
        icon: item.icon?.type === 'external' ? item.icon.external.url : 
              (item.icon?.type === 'file' ? item.icon.file.url : null),
        tags: properties['tag']?.multi_select?.map(tag => tag.name) || []
      };
    })
    .sort((a, b) => a.name.toLowerCase().localeCompare(b.name.toLowerCase(), 'zh-CN', { sensitivity: 'base' }));
};

// 构建查询过滤器
const buildFilterQuery = (tags, mode, query) => {
  // 搜索模式优先
  if (query) {
    return {
      or: [
        { property: 'name', title: { contains: query } },
        { property: 'description', rich_text: { contains: query } },
        { property: 'tag', multi_select: { contains: query } }
      ]
    };
  }
  
  // 标签筛选模式
  if (tags.length > 0) {
    const filterLogic = mode === 'multiple' ? 'and' : 'or';
    return {
      [filterLogic]: tags.map(tagName => ({
        property: 'tag',
        multi_select: { contains: tagName },
      }))
    };
  }
  
  return null; // 无过滤条件
};

// ==========================================
// 3. Composable Logic (State Management)
// ==========================================

// 背景图管理逻辑 (DOM 操作隔离)
const useDynamicBackground = () => {
  const setBackground = (imageUrl) => {
    const existingLayer = document.getElementById('dynamic-background-layer');
    if (existingLayer) {
      existingLayer.remove();
      document.body.classList.remove('has-dynamic-bg');
    }
    
    if (imageUrl?.trim()) {
      const div = document.createElement('div');
      div.id = 'dynamic-background-layer';
      div.className = 'dynamic-bg-layer fixed inset-0 w-screen h-screen -z-50 opacity-70 pointer-events-none bg-cover bg-center bg-no-repeat bg-fixed';
      div.style.backgroundImage = `url("${imageUrl}")`;
      document.body.appendChild(div);
      document.body.classList.add('has-dynamic-bg');
    }
  };
  return { setBackground };
};

const backgroundManager = useDynamicBackground();

// ==========================================
// 4. Main Business Logic
// ==========================================

// 核心数据加载方法 - 降低复杂度，拆分流程
const fetchContent = async (options = {}) => {
  const { 
    isLoadMore = false, 
    tags = selectedTags.value, 
    search = searchQuery.value 
  } = options;

  // 1. 状态守卫与初始化
  if (isLoadMore) {
    pagination.value.isFetchingMore = true;
  } else {
    loading.value = true;
    error.value = null;
    if (!search) navigationLinks.value = []; // 搜索时不立即清空以免闪烁
  }

  // 2. 缓存检查 (仅在非加载更多且无搜索且缓存有效时)
  const shouldUseCache = !isLoadMore && !search && cacheExpiryTime.value > 0;
  if (shouldUseCache) {
    const cached = navigationCache.getCache(tags, settingsStore.tagFilterMode, cacheExpiryTime.value * 3600000);
    if (cached) {
      applyDataToState(cached.data, cached.metadata, false);
      loading.value = false;
      return;
    }
  }

  try {
    // 3. 准备参数
    const cursor = isLoadMore ? pagination.value.nextCursor : null;
    const filter = buildFilterQuery(tags, settingsStore.tagFilterMode, search);

    // 4. API 调用
    const data = await notionApi.queryDatabase(filter, cursor);
    const processedLinks = parseNotionResults(data.results);
    const metadata = { nextCursor: data.next_cursor, hasMore: data.has_more };

    // 5. 更新状态与缓存
    applyDataToState(processedLinks, metadata, isLoadMore);
    
    if (shouldUseCache) {
      navigationCache.setCache(tags, settingsStore.tagFilterMode, processedLinks, metadata);
    }

    // 6. 空数据处理
    if (navigationLinks.value.length === 0 && !data.has_more) {
      error.value = search 
        ? `未找到包含 "${search}" 的链接。` 
        : (tags.length > 0 ? '未找到符合所选标签的链接。' : '数据库为空。');
    }

  } catch (err) {
    error.value = `获取数据失败: ${err.message}`;
  } finally {
    loading.value = false;
    pagination.value.isFetchingMore = false;
  }
};

// 辅助：统一应用数据到状态
const applyDataToState = (links, metadata, append) => {
  if (append) {
    navigationLinks.value = [...navigationLinks.value, ...links];
  } else {
    navigationLinks.value = links;
  }
  pagination.value.nextCursor = metadata.nextCursor;
  pagination.value.hasMore = metadata.hasMore;
};

// 初始化元数据 (标题、描述、背景、标签)
const initMetadata = async () => {
  // 尝试缓存
  const cachedMeta = navigationCache.getMetadataCache(cacheExpiryTime.value * 3600000);
  if (cachedMeta) {
    const { title, description, availableTags: tags, backgroundImageUrl } = cachedMeta.data;
    applyMetadata({ title, description, tags, backgroundImageUrl });
    
    // 如果有缓存，直接用缓存的标签触发数据加载
    const hasHome = tags.find(t => t.name === '主页');
    if (hasHome) selectedTags.value = ['主页'];
    fetchContent(); 
    return;
  }

  try {
    const data = await notionApi.retrieveDatabase();
    
    const meta = {
      title: data.title?.[0]?.plain_text || '导航中心',
      description: data.description?.[0]?.plain_text || 'Notion 驱动的导航站',
      tags: data.properties?.tag?.multi_select?.options.map(o => ({ name: o.name, color: o.color })) || [],
      backgroundImageUrl: data.cover?.file?.url || data.cover?.external?.url || null
    };

    applyMetadata(meta);
    
    if (cacheExpiryTime.value > 0) {
      navigationCache.setMetadataCache({ 
        title: meta.title, 
        description: meta.description, 
        availableTags: meta.tags, 
        backgroundImageUrl: meta.backgroundImageUrl 
      });
    }

    // 设置默认标签并加载
    const hasHome = meta.tags.find(t => t.name === '主页');
    if (hasHome) selectedTags.value = ['主页'];
    fetchContent();

  } catch (err) {
    console.warn('元数据加载失败，使用默认值:', err);
    // 即使元数据失败，也尝试加载一次内容
    fetchContent();
  }
};

const applyMetadata = ({ title, description, tags, backgroundImageUrl }) => {
  databaseInfo.value = { title, description };
  availableTags.value = tags;
  backgroundManager.setBackground(backgroundImageUrl);
};

// ==========================================
// 5. Event Handlers
// ==========================================

const handleTagClick = (tagName) => {
  // 优化：简化 If-Else 逻辑，使用更清晰的流控制
  if (settingsStore.tagFilterMode === 'single') {
    if (selectedTags.value.includes(tagName)) return; // 避免重复点击
    selectedTags.value = [tagName];
  } else {
    const index = selectedTags.value.indexOf(tagName);
    if (index > -1) {
      selectedTags.value = selectedTags.value.filter(t => t !== tagName);
    } else {
      selectedTags.value = [...selectedTags.value, tagName];
    }
  }
  
  // 重置搜索并加载
  searchQuery.value = '';
  fetchContent({ isLoadMore: false, search: '' });
};

const handleSearch = (query) => {
  searchQuery.value = query;
  if (query.trim()) {
    selectedTags.value = []; // 搜索时清空标签
    fetchContent({ isLoadMore: false, search: query.trim() });
  } else {
    fetchContent({ isLoadMore: false });
  }
};

const handleRetry = () => {
  fetchContent({ isLoadMore: false });
};

const handleScroll = () => {
  const { isFetchingMore, hasMore } = pagination.value;
  if (isFetchingMore || !hasMore) return;

  const threshold = document.body.offsetHeight - 200;
  if (window.innerHeight + window.scrollY >= threshold) {
    fetchContent({ isLoadMore: true });
  }
};

// ==========================================
// 6. Lifecycle & Watchers
// ==========================================

watch(() => databaseInfo.value.title, (newTitle) => {
  if (newTitle) document.title = newTitle;
}, { immediate: true });

watch(() => settingsStore.tagFilterMode, () => {
  selectedTags.value = [];
  fetchContent({ isLoadMore: false });
});

onMounted(() => {
  initMetadata();
  window.addEventListener('scroll', handleScroll);
});

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll);
});
</script>

<style scoped>
.navigation-header { position: relative; z-index: 20; }
</style>