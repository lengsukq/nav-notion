<template>
  <div class="search-container">
    <div class="search-box">
      <div class="engine-selector-container">
        <div class="selected-engine" @click="toggleEngineDropdown">
          {{ getEngineName(selectedEngine) }}
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>
        </div>
        <div v-if="showEngineDropdown" class="engine-dropdown">
          <div v-for="(engine, key) in searchEngines" :key="key" 
               @click="selectEngine(key)" class="engine-option">
            {{ engine.name }}
          </div>
        </div>
      </div>
      <div class="search-input-container">
        <input
          v-model="searchQuery"
          @keyup.enter="handleSearch"
          placeholder="搜索..."
          class="search-input"
        >
        <button @click="handleSearch" class="search-button">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
        </button>
        <!-- 搜索历史记录 -->
        <div v-if="showSearchHistory && filteredHistory.length > 0" class="search-history">
          <div class="search-history-header">
            <span>搜索历史</span>
            <span class="clear-history" @click="clearSearchHistory">清除</span>
          </div>
          <div class="history-items">
            <div v-for="(item, index) in filteredHistory" :key="index"
                 class="history-item" @click="selectHistoryItem(item)">
              {{ item }}
            </div>
          </div>
        </div>
        <div v-else-if="showSearchHistory && filteredHistory.length === 0" class="search-history">
          <div class="no-history">暂无搜索历史</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch  } from 'vue';

const searchQuery = ref('');
const selectedEngine = ref('bing');

const searchEngines = {
  bing: { name: 'Bing', url: 'https://www.bing.com/search?q=' },
  google: { name: 'Google', url: 'https://www.google.com/search?q=' },
  yahoo: { name: 'Yahoo', url: 'https://search.yahoo.com/search?p=' },
  duckduckgo: { name: 'DuckDuckGo', url: 'https://duckduckgo.com/?q=' },
  baidu: { name: '百度', url: 'https://www.baidu.com/s?wd=' },
  mieta: { name: '密塔搜索', url: 'https://metaso.cn/?q=' }
};

// 搜索历史记录
const searchHistory = ref(JSON.parse(localStorage.getItem('searchHistory') || '[]'));
const showSearchHistory = ref(false);
const filteredHistory = ref([]);

// 搜索引擎下拉框状态
const showEngineDropdown = ref(false);

// 初始化时从localStorage读取上次选择的搜索引擎
onMounted(() => {
  const savedEngine = localStorage.getItem('preferredSearchEngine');
  if (savedEngine && searchEngines[savedEngine]) {
    selectedEngine.value = savedEngine;
  }
});

// 获取搜索引擎名称
const getEngineName = (engineKey) => {
  return searchEngines[engineKey]?.name || '搜索';
};

// 切换搜索引擎下拉框
const toggleEngineDropdown = () => {
  showEngineDropdown.value = !showEngineDropdown.value;
};

// 选择搜索引擎
const selectEngine = (engineKey) => {
  selectedEngine.value = engineKey;
  localStorage.setItem('preferredSearchEngine', engineKey);
  showEngineDropdown.value = false;
};

// 保存搜索记录
const saveSearchHistory = (query) => {
  if (!query.trim()) return;
  
  // 去重并限制数量
  const newHistory = [query, ...searchHistory.value.filter(item => item !== query)].slice(0, 10);
  searchHistory.value = newHistory;
  localStorage.setItem('searchHistory', JSON.stringify(newHistory));
};

// 过滤搜索历史
watch(searchQuery, (val) => {
  if (val.trim()) {
    filteredHistory.value = searchHistory.value.filter(item => 
      item.toLowerCase().includes(val.toLowerCase())
    );
    showSearchHistory.value = true;
  } else {
    showSearchHistory.value = false;
  }
});

// 从历史记录选择搜索词
const selectHistoryItem = (item) => {
  searchQuery.value = item;
  showSearchHistory.value = false;
  handleSearch();
};

// 清除搜索历史
const clearSearchHistory = () => {
  searchHistory.value = [];
  localStorage.removeItem('searchHistory');
  showSearchHistory.value = false;
};

const handleSearch = () => {
  if (searchQuery.value.trim()) {
    const searchUrl = searchEngines[selectedEngine.value].url + encodeURIComponent(searchQuery.value);
    window.open(searchUrl, '_blank');
    saveSearchHistory(searchQuery.value);
    searchQuery.value = '';
  }
};
</script>

<style scoped>
.search-container {
  padding: 16px;
}

.search-box {
  display: flex;
  gap: 8px;
  align-items: center;
  background-color: rgba(255, 255, 255, 0.7);
  backdrop-filter: blur(10px);
  border-radius: 24px;
  padding: 8px 16px;
  box-shadow: 0 1px 5px rgba(0, 0, 0, 0.08);
  transition: all 0.3s ease;
  position: relative;
}

.search-box:focus-within {
  box-shadow: 0 3px 8px rgba(0, 0, 0, 0.15);
}

.engine-selector-container {
  position: relative;
}

.selected-engine {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 12px;
  background-color: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(8px);
  border-radius: 16px;
  cursor: pointer;
  font-size: 14px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08);
  transition: all 0.2s ease;
  min-width: 100px;
  justify-content: space-between;
}

.selected-engine:hover {
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
}

.engine-dropdown {
  position: absolute;
  top: calc(100% + 5px);
  left: 0;
  right: 0;
  background-color: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(10px);
  border-radius: 16px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  padding: 8px 0;
  z-index: 100;
}

.engine-option {
  padding: 10px 16px;
  cursor: pointer;
  transition: background-color 0.2s;
  font-size: 14px;
}

.engine-option:hover {
  background-color: rgba(0, 0, 0, 0.05);
}

.search-input-container {
  flex: 1;
  display: flex;
  align-items: center;
  position: relative;
}

/* 搜索历史样式 */
.search-history {
  position: absolute;
  top: calc(100% + 8px);
  left: 0;
  right: 0;
  background-color: rgba(255, 255, 255, 0.85);
  backdrop-filter: blur(10px);
  border-radius: 16px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  padding: 8px 0;
  z-index: 100;
}

.search-history-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 16px 8px;
  border-bottom: 1px solid rgba(0, 0, 0, 0.05);
  font-size: 14px;
  color: #86868b;
}

.clear-history {
  cursor: pointer;
  font-size: 13px;
  color: #007aff;
}

.history-items {
  max-height: 200px;
  overflow-y: auto;
}

.history-item {
  padding: 10px 16px;
  cursor: pointer;
  transition: background-color 0.2s;
  font-size: 14px;
}

.history-item:hover {
  background-color: rgba(0, 0, 0, 0.03);
}

.no-history {
  padding: 16px;
  text-align: center;
  color: #86868b;
  font-size: 14px;
}

.search-input {
  flex: 1;
  background: transparent;
  border: none;
  padding: 10px 8px;
  font-size: 16px;
  outline: none;
  color: #1d1d1f;
}

.search-input::placeholder {
  color: #86868b;
}

.search-button {
  background: transparent;
  border: none;
  color: #6e6e73;
  cursor: pointer;
  padding: 8px;
  border-radius: 50%;
  transition: background-color 0.2s ease;
}

.search-button:hover {
  background-color: rgba(0, 0, 0, 0.05);
}
</style>