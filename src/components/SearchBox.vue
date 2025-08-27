<template>
  <!-- HeroUI 整个搜索组件的容器，居中并设置毛玻璃背景 -->
  <div class="app-search-wrapper"> <!-- 添加这个 wrapper 来管理 z-index -->
    <div class="w-full max-w-full md:max-w-2xl lg:max-w-4xl xl:max-w-6xl search-container transition-all duration-800 hover:scale-[1.015]">
      <div class="search-box shadow-2xl hover:shadow-3xl transition-all duration-800 rounded-3xl">

        <!-- 搜索引擎选择器 -->
        <div class="engine-selector-container">
          <div class="selected-engine" @click.stop="toggleEngineDropdown">
            <span class="engine-name hidden sm:inline">{{ getEngineName(selectedEngine) }}</span>
            <span class="engine-name-short sm:hidden">{{ getEngineName(selectedEngine, true) }}</span>
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="ml-1 transition-transform duration-800 will-change-transform" :class="{'rotate-180': showEngineDropdown}">
              <polyline points="6 9 12 15 18 9"></polyline>
            </svg>
          </div>
          <!-- 搜索引擎下拉菜单 -->
          <transition name="dropdown">
            <div v-if="showEngineDropdown" class="engine-dropdown rounded-xl shadow-lg">
              <div v-for="(engine, key) in searchEngines" :key="key"
                   @click.stop="selectEngine(key)" class="engine-option transition-all duration-800 will-change-transform">
                {{ engine.name }}
              </div>
            </div>
          </transition>
        </div>

        <!-- 搜索输入框和按钮 -->
        <div class="search-input-container">
          <input
            v-model="searchQuery"
            @keyup.enter="handleSearch"
            @focus="showSearchHistory = true"
            @blur="handleBlur"
            placeholder="搜索..."
            class="search-input"
            ref="searchInputRef"
          >
          <button @click.stop="handleSearch" class="search-button transform transition-all duration-800 hover:scale-110 hover:bg-primary/10">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
          </button>

          <!-- 搜索历史记录 -->
          <transition name="dropdown">
            <div v-if="showSearchHistory && (filteredHistory.length > 0 || searchQuery)" class="search-history rounded-xl shadow-lg">
              <div v-if="filteredHistory.length > 0" class="search-history-content">
                <div class="search-history-header">
                  <span class="text-gray-600 dark:text-gray-400">搜索历史</span>
                  <span class="clear-history cursor-pointer text-blue-500 hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-300 transition-colors duration-800" @click.stop="clearSearchHistory">清除</span>
                </div>
                <div class="history-items">
                  <div v-for="(item, index) in filteredHistory" :key="index"
                       class="history-item transition-all duration-800 will-change-transform" @click.stop="selectHistoryItem(item)">
                    {{ item }}
                  </div>
                </div>
              </div>
              <div v-else-if="searchQuery" class="no-history text-gray-500 dark:text-gray-400">
                搜索 "{{ searchQuery }}"
              </div>
               <div v-else class="no-history text-gray-500 dark:text-gray-400">
                暂无搜索历史
              </div>
            </div>
          </transition>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, watch, computed, nextTick } from 'vue';

const searchQuery = ref('');
const selectedEngine = ref('bing'); // 默认搜索引擎

const searchEngines = {
  bing: { name: 'Bing', shortName: 'Bing', url: 'https://www.bing.com/search?q=' },
  google: { name: 'Google', shortName: 'Google', url: 'https://www.google.com/search?q=' },
  yahoo: { name: 'Yahoo', shortName: 'Yahoo', url: 'https://search.yahoo.com/search?p=' },
  duck: { name: 'DuckDuckGo', shortName: 'Duck', url: 'https://duckduckgo.com/?q=' },
  baidu: { name: '百度', shortName: '百度', url: 'https://www.baidu.com/s?wd=' },
  mieta: { name: '密塔搜索', shortName: '密塔', url: 'https://metaso.cn/?q=' }
};

// 搜索历史记录
const searchHistory = ref(JSON.parse(localStorage.getItem('searchHistory') || '[]'));
const showSearchHistory = ref(false);

// 搜索引擎下拉框状态
const showEngineDropdown = ref(false);

// 用于处理点击外部关闭下拉框和历史记录
const searchInputRef = ref(null);

// 计算过滤后的历史记录
const filteredHistory = computed(() => {
  if (!searchQuery.value.trim()) {
    return searchHistory.value; // 如果输入为空，显示所有历史记录
  }
  return searchHistory.value.filter(item =>
    item.toLowerCase().includes(searchQuery.value.toLowerCase())
  );
});

// 初始化时从localStorage读取上次选择的搜索引擎
onMounted(() => {
  const savedEngine = localStorage.getItem('preferredSearchEngine');
  if (savedEngine && searchEngines[savedEngine]) {
    selectedEngine.value = savedEngine;
  }

  // 添加全局点击监听器来关闭下拉菜单
  document.addEventListener('click', handleClickOutside);
});

// 组件卸载时移除监听器
onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside);
});

// 获取搜索引擎名称 - 支持响应式显示
const getEngineName = (engineKey, useShort = false) => {
  const engine = searchEngines[engineKey];
  if (!engine) return '搜索';
  return useShort ? engine.shortName : engine.name;
};

// 切换搜索引擎下拉框
const toggleEngineDropdown = () => {
  showEngineDropdown.value = !showEngineDropdown.value;
};

// 选择搜索引擎
const selectEngine = (engineKey) => {
  selectedEngine.value = engineKey;
  localStorage.setItem('preferredSearchEngine', engineKey);
  showEngineDropdown.value = false; // 选择后关闭下拉框
};

// 保存搜索记录
const saveSearchHistory = (query) => {
  if (!query.trim()) return;

  // 去重并限制数量
  const newHistory = [query, ...searchHistory.value.filter(item => item !== query)].slice(0, 10);
  searchHistory.value = newHistory;
  localStorage.setItem('searchHistory', JSON.stringify(newHistory));
};

// 处理输入框失焦
const handleBlur = () => {
  // 延迟关闭，允许点击历史记录项
  setTimeout(() => {
    // 检查当前是否有一个下拉菜单是打开的，如果是，则不关闭历史记录
    if (!showEngineDropdown.value) {
      showSearchHistory.value = false;
    }
  }, 150); // 150ms 的延迟，比点击事件的响应稍长
};

// 处理搜索
const handleSearch = () => {
  if (searchQuery.value.trim()) {
    const searchUrl = searchEngines[selectedEngine.value].url + encodeURIComponent(searchQuery.value);
    window.open(searchUrl, '_blank');
    saveSearchHistory(searchQuery.value);
    searchQuery.value = '';
    showSearchHistory.value = false; // 搜索后隐藏历史记录
  }
};

// 从历史记录选择搜索词
const selectHistoryItem = (item) => {
  searchQuery.value = item;
  // 自动触发搜索
  handleSearch();
  // 保持历史记录打开，直到用户下次操作，或者在handleSearch里关闭
};

// 清除搜索历史
const clearSearchHistory = () => {
  searchHistory.value = [];
  localStorage.removeItem('searchHistory');
  showSearchHistory.value = false; // 清除后隐藏
};

// 点击页面其他地方时关闭下拉菜单和历史记录
const handleClickOutside = (event) => {
  // 检查点击的目标是否在搜索引擎选择器或输入框内部
  const isClickInsideEngineSelector = event.target.closest('.engine-selector-container');
  const isClickInsideInputContainer = event.target.closest('.search-input-container');

  if (!isClickInsideEngineSelector) {
    showEngineDropdown.value = false;
  }
  if (!isClickInsideInputContainer) {
    showSearchHistory.value = false;
  }
};
</script>

<style scoped>
/* HeroUI 整体容器，用于居中和背景 */
/* 确保这个 wrapper 有 position: relative; z-index: 100; */
.app-search-wrapper {
  position: relative;
  z-index: 200; /* 提高层级，确保搜索框层级高于标签和页面卡片 */
  /* 同样，也需要控制其在App.vue中的布局 */
  width: 100%; /* 确保它占满App.vue中的可用宽度 */
  padding: 0 1rem; /* 左右内边距，与App.vue的其他内容对齐 */
  box-sizing: border-box; /* 包含padding的宽度 */
}

.search-container {
  width: 100%;
  max-width: 100%; /* 默认占满容器宽度 */
  margin: 0 auto;
  transition: max-width 0.8s cubic-bezier(0.4, 0, 0.2, 1), transform 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  will-change: max-width, transform;
  transform-origin: center center;
  transform: translateZ(0);
}

/* 响应式宽度调整 */
@media (min-width: 768px) {
  .search-container {
    max-width: 42rem; /* md:max-w-2xl */
  }
}

@media (min-width: 1024px) {
  .search-container {
    max-width: 56rem; /* lg:max-w-4xl */
  }
}

@media (min-width: 1280px) {
  .search-container {
    max-width: 72rem; /* xl:max-w-6xl */
  }
}

/* HeroUI 搜索框整体样式 */
.search-box {
  display: flex;
  align-items: center;
  gap: 0.75rem; /* 12px */
  background: rgba(255, 255, 255, 0.2); /* 增强透明背景 */
  backdrop-filter: blur(20px); /* 增强毛玻璃效果 */
  -webkit-backdrop-filter: blur(20px); /* Safari 兼容 */
  border-radius: 28px; /* 更大圆角 */
  padding: 0.75rem 1.25rem; /* 增加内边距 */
  box-shadow: 
    0 8px 25px rgba(var(--primary-color-rgb), 0.15),
    inset 0 1px 0 rgba(255, 255, 255, 0.3); /* 增强阴影和内光 */
  transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1); /* HeroUI 风格过渡 */
  position: relative; /* 用于定位下拉菜单 */
  border: 1px solid rgba(255, 255, 255, 0.25); /* 增强边框 */
  flex-wrap: wrap; /* 允许在小屏幕上换行 */
  will-change: transform, box-shadow;
  transform-origin: center center;
  transform: translateZ(0);
}

/* 小屏幕优化 - 保持一行布局 */
@media (max-width: 640px) {
  .search-box {
    gap: 0.5rem;
    padding: 0.5rem 0.75rem;
    border-radius: 20px;
  }
  
  .engine-selector-container {
    flex-shrink: 0;
  }
  
  .search-input-container {
    flex: 1;
    min-width: 0; /* 允许收缩 */
  }
}

/* 小尺寸屏幕优化 */
@media (max-width: 450px) {
  .search-box {
    gap: 0.375rem;
    padding: 0.5rem;
    border-radius: 16px;
  }
  
  .selected-engine {
    padding: 0.5rem 0.75rem;
    font-size: 12px;
    border-radius: 12px;
  }
  
  .search-input {
    padding: 0.5rem;
    font-size: 14px;
  }
  
  .search-button {
    padding: 0.375rem;
  }
}

.search-box:focus-within {
  background: rgba(255, 255, 255, 0.3);
  backdrop-filter: blur(24px);
  -webkit-backdrop-filter: blur(24px);
  box-shadow: 
    0 12px 40px rgba(var(--primary-color-rgb), 0.25),
    0 0 0 2px rgba(var(--primary-color-rgb), 0.3),
    inset 0 1px 0 rgba(255, 255, 255, 0.4);
  border-color: rgba(var(--primary-color-rgb), 0.4);
  transform: translateY(-2px);
}

/* 搜索引擎选择器容器 */
.engine-selector-container {
  position: relative;
  z-index: 250; /* 提高层级，确保下拉菜单能正确显示 */
}

/* HeroUI 已选搜索引擎样式 */
.selected-engine {
  display: flex;
  align-items: center;
  gap: 0.25rem; /* 减小间距 */
  padding: 0.625rem 1rem; /* 稍微减少内边距 */
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.8), rgba(255, 255, 255, 0.6)); /* 渐变背景 */
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  border-radius: 16px; /* 中等圆角 */
  cursor: pointer;
  font-size: 13px; /* 稍小字体 */
  font-weight: 600; /* 增强字重 */
  box-shadow: 
    0 4px 12px rgba(var(--primary-color-rgb), 0.15),
    inset 0 1px 0 rgba(255, 255, 255, 0.5); /* 内部高光 */
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  white-space: nowrap; /* 防止名称换行 */
  border: 1px solid rgba(255, 255, 255, 0.3);
  position: relative;
  overflow: hidden;
  min-width: fit-content; /* 最小宽度适应内容 */
  flex-shrink: 0; /* 防止收缩 */
}

.selected-engine:hover {
  box-shadow: 0 4px 12px rgba(var(--primary-color-rgb), 0.2);
  background-color: rgba(255, 255, 255, 0.85);
}

/* HeroUI 搜索引擎下拉菜单 */
.engine-dropdown {
  position: absolute;
  top: calc(100% + 6px); /* 距离选择器下方 */
  left: 0;
  right: 0;
  background-color: rgba(255, 255, 255, 0.75);
  backdrop-filter: blur(16px);
  border-radius: 20px;
  box-shadow: 0 8px 30px rgba(var(--primary-color-rgb), 0.2); /* 主色调更明显的阴影 */
  padding: 12px 0;
  z-index: 300; /* !!! 修正: 搜索引擎下拉菜单的 z-index 必须是最高的 !!! */
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.engine-option {
  padding: 0.75rem 1rem; /* 12px 16px */
  cursor: pointer;
  transition: all 0.8s cubic-bezier(0.4, 0, 0.2, 1);
  font-size: 14px;
  font-weight: 500;
  color: var(--text-primary); /* 深色文字 */
  border-radius: 12px;
  margin: 0 8px;
}

.engine-option:hover {
  background-color: rgba(var(--primary-color-rgb), 0.1);
  color: var(--primary);
  transform: translateX(4px);
}

/* 搜索输入框容器 */
.search-input-container {
  flex: 1; /* 占据剩余空间 */
  display: flex;
  align-items: center;
  position: relative;
}

/* HeroUI 搜索输入框 */
.search-input {
  flex: 1;
  background: transparent;
  border: none;
  padding: 0.75rem 0.75rem; /* 12px */
  font-size: 16px;
  font-weight: 500;
  outline: none;
  color: var(--text-primary); /* HeroUI 默认文本颜色 */
  width: 100%; /* 确保填充容器 */
}

.search-input::placeholder {
  color: var(--text-tertiary); /* 占位符颜色 */
}

/* HeroUI 搜索按钮 */
.search-button {
  background: transparent;
  border: none;
  color: var(--text-secondary); /* 搜索图标颜色 */
  cursor: pointer;
  padding: 0.5rem; /* 8px */
  border-radius: 16px; /* HeroUI 风格圆角 */
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  will-change: transform, background-color;
  transform: translateZ(0);
}

.search-button:hover {
  background-color: rgba(var(--primary-color-rgb), 0.1);
  transform: scale(1.08); /* 悬停时放大一点，调整为更自然的比例 */
  color: var(--primary);
}

/* HeroUI 搜索历史记录 */
.search-history {
  position: absolute;
  top: calc(100% + 8px); /* 距离输入框下方 */
  left: 0;
  right: 0;
  background-color: rgba(255, 255, 255, 0.75); /* 半透明背景 */
  backdrop-filter: blur(16px); /* 毛玻璃 */
  border-radius: 20px; /* 大圆角 */
  box-shadow: 0 8px 30px rgba(var(--primary-color-rgb), 0.15); /* 主色调更强的阴影 */
  padding: 12px 0;
  z-index: 240; /* 调整 z-index，确保历史记录能正确显示，但低于引擎下拉菜单 */
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.search-history-content {
  /* 内部内容容器 */
}

.search-history-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 1rem 0.5rem 1rem; /* 0 16px 8px 16px */
  border-bottom: 1px solid rgba(var(--primary-color-rgb), 0.1); /* 主色调细分隔线 */
  font-size: 13px;
}

.clear-history {
  font-weight: 500;
  color: var(--primary);
  transition: color 0.8s cubic-bezier(0.4, 0, 0.2, 1);
}

.clear-history:hover {
  color: var(--secondary);
}

.history-items {
  max-height: 200px; /* 限制历史记录显示的高度 */
  overflow-y: auto;
  padding-top: 8px; /* 历史记录项上面的顶部间距 */
}

.history-item {
  padding: 0.75rem 1rem; /* 12px 16px */
  cursor: pointer;
  transition: all 0.8s cubic-bezier(0.4, 0, 0.2, 1);
  font-size: 14px;
  font-weight: 500;
  color: var(--text-primary);
  border-radius: 12px;
  margin: 0 8px;
}

.history-item:hover {
  background-color: rgba(var(--primary-color-rgb), 0.1);
  color: var(--primary);
  transform: translateX(4px);
}

.no-history {
  padding: 1rem; /* 16px */
  text-align: center;
  font-size: 13px;
  color: var(--text-tertiary);
}

/* HeroUI 过渡动画 */
.dropdown-enter-active,
.dropdown-leave-active {
  transition: all 0.8s cubic-bezier(0.4, 0, 0.2, 1), transform 0.8s cubic-bezier(0.4, 0, 0.2, 1);
}

.dropdown-enter-from,
.dropdown-leave-to {
  opacity: 0;
  transform: translateY(12px) scale(0.95);
}

.dropdown-enter-to,
.dropdown-leave-from {
  opacity: 1;
  transform: translateY(0) scale(1);
}

/* HeroUI 箭头旋转动画 */
.rotate-180 {
  transform: rotate(180deg);
}

/* Tailwind CSS 类的覆写/调整 */
/* 确保外层容器有相对定位，以便内部 absolute 元素能正确定位 */
.app-search-wrapper {
  position: relative;
  z-index: 100; /* 确保搜索框层级高于页面卡片 */
}

</style>