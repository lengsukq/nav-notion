<template>
  <!-- HeroUI 搜索组件容器 -->
  <div class="app-search-wrapper">
    <div class="w-full max-w-full md:max-w-2xl lg:max-w-4xl xl:max-w-6xl search-container transition-all duration-800 hover:scale-[1.015]">
      <div class="search-box shadow-2xl hover:shadow-3xl transition-all duration-800 rounded-3xl"
           :class="{ 'is-focused': isFocused }">

        <!-- 1. 搜索引擎选择器 -->
        <div class="engine-selector-container" ref="engineSelectorRef">
          <div class="selected-engine" @click.stop="toggleEngineDropdown">
            <span class="engine-icon">{{ engineIcon }}</span>
            <span class="engine-name hidden sm:inline">{{ currentEngine?.name || 'Search' }}</span>
            <span class="engine-name-short sm:hidden">{{ currentEngine?.shortName || 'S' }}</span>
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="ml-1 transition-transform duration-800 will-change-transform" :class="{'rotate-180': showEngineDropdown}">
              <polyline points="6 9 12 15 18 9"></polyline>
            </svg>
          </div>
          <!-- 下拉菜单 -->
          <transition name="dropdown">
            <div v-if="showEngineDropdown" class="engine-dropdown rounded-xl shadow-lg">
              <div v-for="(config, key) in SEARCH_CONFIG" :key="key"
                   @click.stop="selectEngine(key)" 
                   class="engine-option transition-all duration-800 will-change-transform">
                {{ config.name }}
              </div>
            </div>
          </transition>
        </div>

        <!-- 2. 搜索输入框 -->
        <div class="search-input-container" ref="inputContainerRef">
          <input
            v-model="searchQuery"
            @keyup.enter="executeSearch"
            @focus="handleFocus"
            @blur="handleBlur"
            placeholder="搜索..."
            class="search-input"
            ref="searchInputRef"
          >
          
          <!-- 动作按钮 -->
          <div class="search-actions">
            <button @click.stop="executeSearch" class="search-button transform transition-all duration-800 hover:scale-110 hover:bg-primary/10">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
            </button>
            <button @click.stop="emit('toggle-settings')" class="settings-button transform transition-all duration-800 hover:scale-110 hover:bg-primary/10">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path stroke-linecap="round" stroke-linejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </button>
          </div>

          <!-- 3. 历史记录下拉 -->
          <transition name="dropdown">
            <div v-if="shouldShowHistory" class="search-history rounded-xl shadow-lg">
              <div v-if="filteredHistory.length > 0" class="search-history-content">
                <div class="search-history-header">
                  <span class="text-gray-600 dark:text-gray-400">搜索历史</span>
                  <span class="clear-history cursor-pointer text-blue-500 hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-300 transition-colors duration-800" @click.stop="clearHistory">清除</span>
                </div>
                <div class="history-items">
                  <div v-for="(item, index) in filteredHistory" :key="index"
                       class="history-item transition-all duration-800 will-change-transform" @click.stop="selectHistory(item)">
                    {{ item }}
                  </div>
                </div>
              </div>
              <div v-else class="no-history text-gray-500 dark:text-gray-400">
                {{ searchQuery ? `搜索 "${searchQuery}"` : '暂无搜索历史' }}
              </div>
            </div>
          </transition>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, type Ref } from 'vue';

// ==========================================
// 1. Constants & Configuration (Memory Opt)
// ==========================================
// 定义搜索引擎配置类型
interface SearchEngineConfig {
  name: string;
  shortName: string;
  icon?: string;
  type: 'external' | 'event';
  url?: string;
  eventName?: string;
}

/**
 * 搜索引擎配置
 * 移出 Setup，避免每次渲染重新分配内存。
 * type: 'external' (跳转 URL) | 'event' (Emit 事件)
 */
const SEARCH_CONFIG: Record<string, SearchEngineConfig> = {
  bing:   { name: 'Bing', shortName: 'Bing', type: 'external', url: 'https://www.bing.com/search?q=' },
  google: { name: 'Google', shortName: 'Google', type: 'external', url: 'https://www.google.com/search?q=' },
  yahoo:  { name: 'Yahoo', shortName: 'Yahoo', type: 'external', url: 'https://search.yahoo.com/search?p=' },
  duck:   { name: 'Duck', shortName: 'Duck', type: 'external', url: 'https://duckduckgo.com/?q=' },
  baidu:  { name: '百度', shortName: '百度', type: 'external', url: 'https://www.baidu.com/s?wd=' },
  mieta:  { name: '密塔', shortName: '密塔', type: 'external', url: 'https://metaso.cn/?q=' },
  notion: { name: 'Notion', shortName: 'Notion', type: 'event', eventName: 'search' }
};

// 定义emits类型
interface Emits {
  search: [query: string];
  'toggle-settings': [];
}

// 定义emits
const emit = defineEmits<Emits>();

// ==========================================
// 2. Logic Abstraction (Composables)
// ==========================================

/**
 * 内部方法：管理搜索引擎状态
 * 封装选择逻辑，降低主组件复杂度。
 */
const useSearchEngine = () => {
  const selectedKey: Ref<string> = ref('bing');
  const showDropdown: Ref<boolean> = ref(false);

  const currentEngine = computed(() => SEARCH_CONFIG[selectedKey.value] || SEARCH_CONFIG.bing);

  const selectEngine = (key: string): void => {
    selectedKey.value = key;
    localStorage.setItem('preferredSearchEngine', key);
    showDropdown.value = false;
  };

  const toggleDropdown = (): void => {
    showDropdown.value = !showDropdown.value;
  };

  onMounted(() => {
    const saved = localStorage.getItem('preferredSearchEngine');
    if (saved && SEARCH_CONFIG[saved]) {
      selectedKey.value = saved;
    }
  });

  return { selectedKey, currentEngine, showDropdown, selectEngine, toggleDropdown };
};

/**
 * 内部方法：管理搜索历史
 * 职责分离，专门处理 Storage 和过滤逻辑。
 */
const useSearchHistory = (searchQueryRef: Ref<string>) => {
  const history: Ref<string[]> = ref([]);
  const showHistory: Ref<boolean> = ref(false);

  // 安全读取 Storage
  const loadHistory = (): void => {
    try {
      history.value = JSON.parse(localStorage.getItem('searchHistory') || '[]');
    } catch (e) {
      history.value = [];
    }
  };

  const saveHistory = (query: string): void => {
    if (!query || !query.trim()) return;
    // 去重并将新搜索置顶，保留最近 10 条
    const next = [query, ...history.value.filter(h => h !== query)].slice(0, 10);
    history.value = next;
    localStorage.setItem('searchHistory', JSON.stringify(next));
  };

  const clearHistory = (): void => {
    history.value = [];
    localStorage.removeItem('searchHistory');
    showHistory.value = false;
  };

  const filteredHistory = computed(() => {
    const q = searchQueryRef.value.trim().toLowerCase();
    if (!q) return history.value;
    return history.value.filter(item => item.toLowerCase().includes(q));
  });

  onMounted(loadHistory);

  return { history, showHistory, filteredHistory, saveHistory, clearHistory };
};

// ==========================================
// 3. Component Setup & Integration
// ==========================================

const searchQuery: Ref<string> = ref('');
const isFocused: Ref<boolean> = ref(false); // 用于 UI 状态
const engineSelectorRef = ref<HTMLElement | null>(null);
const inputContainerRef = ref<HTMLElement | null>(null);

// 初始化内部逻辑
const { 
  selectedKey: engineKey, 
  currentEngine, 
  showDropdown: showEngineDropdown, 
  selectEngine, 
  toggleDropdown: toggleEngineDropdown 
} = useSearchEngine();

const { 
  showHistory: showSearchHistory, 
  filteredHistory, 
  saveHistory, 
  clearHistory: clearHistoryAction 
} = useSearchHistory(searchQuery);

// 计算属性：是否显示历史记录 (UI Logic)
const shouldShowHistory = computed(() => {
  return showSearchHistory.value && (filteredHistory.value.length > 0 || searchQuery.value);
});

// 动态设置搜索引擎图标
const engineIcon = computed(() => {
  const engine = currentEngine.value;
  return engine?.icon || '🔍';
});

// UI Event Handlers
const handleFocus = (): void => {
  isFocused.value = true;
  showSearchHistory.value = true;
};

const handleBlur = (): void => {
  isFocused.value = false;
  // 延迟关闭以允许点击历史项
  setTimeout(() => {
    if (!showEngineDropdown.value) {
      showSearchHistory.value = false;
    }
  }, 150);
};

const selectHistory = (item: string): void => {
  searchQuery.value = item;
  executeSearch();
};

const clearHistory = (): void => {
  clearHistoryAction();
  // 保持焦点以便用户继续输入
  // nextTick(() => inputRef.value?.focus()); 
};

/**
 * 核心搜索逻辑
 * 重构说明：使用 Strategy Pattern (多态) 替代 If-Else。
 * 根据配置中的 'type' 决定是打开 URL 还是触发事件。
 */
const executeSearch = (): void => {
  const query = searchQuery.value.trim();
  if (!query) return;

  const config = currentEngine.value;

  // 保存历史和执行搜索策略
  if (config?.type === 'event' && config?.eventName) {
    emit('search', query);
    saveHistory(query);
  } else if (config?.type === 'external' && config?.url) {
    window.open(config.url + encodeURIComponent(query), '_blank');
    saveHistory(query);
  }

  // 3. 重置 UI 状态
  searchQuery.value = '';
  showSearchHistory.value = false;
  if(document.activeElement instanceof HTMLElement) {
    document.activeElement.blur();
  }
};

/**
 * 全局点击监听优化
 * 使用 Guard Clauses 提前返回。
 */
const handleClickOutside = (event: MouseEvent): void => {
  // 如果两个下拉都关闭，直接返回，避免计算 DOM
  if (!showEngineDropdown.value && !showSearchHistory.value) return;

  const target = event.target as Node;
  const inEngine = engineSelectorRef.value?.contains(target);
  const inInput = inputContainerRef.value?.contains(target);

  if (!inEngine && showEngineDropdown.value) {
    showEngineDropdown.value = false;
  }
  if (!inInput && showSearchHistory.value) {
    showSearchHistory.value = false;
  }
};

// Lifecycle
onMounted(() => document.addEventListener('click', handleClickOutside));
onUnmounted(() => document.removeEventListener('click', handleClickOutside));

</script>

<style scoped>
/* 保持原有 HeroUI 样式，添加少量状态类优化 */
.app-search-wrapper {
  position: relative;
  z-index: 200;
  width: 100%;
  padding: 0;
  box-sizing: border-box;
}

.search-container {
  width: 100%;
  max-width: 100%;
  margin: 0 auto;
  transition: max-width 0.8s cubic-bezier(0.4, 0, 0.2, 1), transform 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  will-change: max-width, transform;
  transform: translateZ(0);
}

@media (min-width: 768px) { .search-container { max-width: 42rem; } }
@media (min-width: 1024px) { .search-container { max-width: 56rem; } }
@media (min-width: 1280px) { .search-container { max-width: 72rem; } }

.search-box {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  background: rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border-radius: 28px;
  padding: 0.75rem 1.25rem;
  box-shadow: 0 8px 25px rgba(var(--primary-color-rgb), 0.15), inset 0 1px 0 rgba(255, 255, 255, 0.3);
  transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  border: 1px solid rgba(255, 255, 255, 0.25);
  flex-wrap: wrap;
  will-change: transform, box-shadow;
  transform: translateZ(0);
}

/* 使用 CSS 类控制焦点状态，替代 :focus-within 提高可维护性 */
.search-box.is-focused,
.search-box:focus-within {
  background: rgba(255, 255, 255, 0.3);
  backdrop-filter: blur(24px);
  box-shadow: 0 12px 40px rgba(var(--primary-color-rgb), 0.25), 0 0 0 2px rgba(var(--primary-color-rgb), 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.4);
  border-color: rgba(var(--primary-color-rgb), 0.4);
  transform: translateY(-2px);
}

/* 小屏幕优化 */
@media (max-width: 640px) {
  .search-box { gap: 0.5rem; padding: 0.5rem 0.75rem; border-radius: 20px; }
  .engine-selector-container { flex-shrink: 0; }
  .search-input-container { flex: 1; min-width: 0; }
}

@media (max-width: 450px) {
  .search-box {
    gap: 0.5rem; padding: 0.75rem; border-radius: 20px;
    background: rgba(255, 255, 255, 0.25);
    backdrop-filter: blur(24px);
  }
  .selected-engine { padding: 0.625rem 1rem; font-size: 13px; border-radius: 14px; }
  .search-input { padding: 0.625rem; font-size: 15px; }
  .settings-button { background: rgba(var(--primary-color-rgb), 0.15); box-shadow: 0 3px 10px rgba(var(--primary-color-rgb), 0.2); }
  
  .search-box.is-focused,
  .search-box:focus-within {
    transform: translateY(-3px);
  }
}

/* 引擎选择器 */
.engine-selector-container { position: relative; z-index: 250; }

.selected-engine {
  display: flex; align-items: center; gap: 0.25rem; padding: 0.625rem 1rem;
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.8), rgba(255, 255, 255, 0.6));
  backdrop-filter: blur(16px);
  border-radius: 16px; cursor: pointer; font-size: 13px; font-weight: 600;
  box-shadow: 0 4px 12px rgba(var(--primary-color-rgb), 0.15), inset 0 1px 0 rgba(255, 255, 255, 0.5);
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  white-space: nowrap; border: 1px solid rgba(255, 255, 255, 0.3);
  position: relative; overflow: hidden; min-width: fit-content; flex-shrink: 0;
}
.selected-engine:hover { box-shadow: 0 4px 12px rgba(var(--primary-color-rgb), 0.2); background-color: rgba(255, 255, 255, 0.85); }

.engine-dropdown {
  position: absolute; top: calc(100% + 6px); left: 0; right: 0;
  background-color: rgba(255, 255, 255, 0.75); backdrop-filter: blur(16px);
  border-radius: 20px; box-shadow: 0 8px 30px rgba(var(--primary-color-rgb), 0.2);
  padding: 12px 0; z-index: 300; border: 1px solid rgba(255, 255, 255, 0.2);
}

.engine-option {
  padding: 0.75rem 1rem; cursor: pointer; transition: all 0.8s cubic-bezier(0.4, 0, 0.2, 1);
  font-size: 14px; font-weight: 500; color: var(--text-primary); border-radius: 12px; margin: 0 8px;
}
.engine-option:hover { background-color: rgba(var(--primary-color-rgb), 0.1); color: var(--primary); transform: translateX(4px); }

/* 输入框 */
.search-input-container { flex: 1; display: flex; align-items: center; position: relative; }
.search-input {
  flex: 1; background: transparent; border: none; padding: 0.75rem;
  font-size: 16px; font-weight: 500; outline: none; color: var(--text-primary); width: 100%;
}
.search-input::placeholder { color: var(--text-tertiary); }

/* 动作按钮 */
.search-actions { display: flex; align-items: center; gap: 0.25rem; }
.search-button, .settings-button {
  background: transparent; border: none; color: var(--text-secondary);
  cursor: pointer; padding: 0.5rem; border-radius: 16px;
  display: flex; align-items: center; justify-content: center;
  transition: all 0.5s; will-change: transform, background-color; transform: translateZ(0);
}
.search-button:hover { background-color: rgba(var(--primary-color-rgb), 0.1); transform: scale(1.08); color: var(--primary); }

.settings-button {
  background: rgba(var(--primary-color-rgb), 0.1); border: 1px solid rgba(var(--primary-color-rgb), 0.2);
  color: var(--primary-color); box-shadow: 0 2px 8px rgba(var(--primary-color-rgb), 0.15);
}
.settings-button:hover {
  background: linear-gradient(135deg, var(--primary-color), var(--accent-color));
  border-color: var(--primary-color); transform: scale(1.1) rotate(90deg); color: white;
  box-shadow: 0 4px 12px rgba(var(--primary-color-rgb), 0.3);
}

/* 历史记录 */
.search-history {
  position: absolute; top: calc(100% + 8px); left: 0; right: 0;
  background-color: rgba(255, 255, 255, 0.75); backdrop-filter: blur(16px);
  border-radius: 20px; box-shadow: 0 8px 30px rgba(var(--primary-color-rgb), 0.15);
  padding: 12px 0; z-index: 240; border: 1px solid rgba(255, 255, 255, 0.2);
}
.search-history-header {
  display: flex; justify-content: space-between; align-items: center;
  padding: 0 1rem 0.5rem 1rem; border-bottom: 1px solid rgba(var(--primary-color-rgb), 0.1); font-size: 13px;
}
.clear-history { font-weight: 500; color: var(--primary); transition: color 0.8s; }
.clear-history:hover { color: var(--secondary); }

.history-items { max-height: 200px; overflow-y: auto; padding-top: 8px; }
.history-item {
  padding: 0.75rem 1rem; cursor: pointer; transition: all 0.8s;
  font-size: 14px; font-weight: 500; color: var(--text-primary); border-radius: 12px; margin: 0 8px;
}
.history-item:hover { background-color: rgba(var(--primary-color-rgb), 0.1); color: var(--primary); transform: translateX(4px); }
.no-history { padding: 1rem; text-align: center; font-size: 13px; color: var(--text-tertiary); }

/* 动画 */
.dropdown-enter-active, .dropdown-leave-active { transition: all 0.8s cubic-bezier(0.4, 0, 0.2, 1), transform 0.8s cubic-bezier(0.4, 0, 0.2, 1); }
.dropdown-enter-from, .dropdown-leave-to { opacity: 0; transform: translateY(12px) scale(0.95); }
.dropdown-enter-to, .dropdown-leave-from { opacity: 1; transform: translateY(0) scale(1); }
.rotate-180 { transform: rotate(180deg); }
</style>