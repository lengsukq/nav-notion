<template>
  <!-- 设置模态框 -->
  <div v-if="isSettingsOpen" class="fixed inset-0 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm flex items-center justify-center z-100 p-4 animate-in fade-in duration-300">
    <div class="bg-white dark:bg-gray-800 rounded-3xl shadow-xl p-6 max-w-md w-full transform transition-all duration-300 hover:shadow-2xl">
      <div class="flex justify-between items-center mb-6">
        <h3 class="text-xl font-bold text-gray-900 dark:text-white flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
          </svg>
          设置
        </h3>
        <button @click="closeSettings" class="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
      
      <!-- 设置选项卡片 -->
      <div class="space-y-6">
        <!-- 卡片模式设置 -->
        <div class="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-4 border border-gray-100 dark:border-gray-700">
          <h4 class="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3 flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-2 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
            </svg>
            卡片显示设置
          </h4>
          <div class="flex space-x-3">
            <button 
              @click="setCardSizeMode('small')"
              :class="cardSizeMode === 'small' ? 'bg-primary text-white shadow-md' : 'bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-500'"
              class="flex-1 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300"
            >
              小卡模式
            </button>
            <button 
              @click="setCardSizeMode('large')"
              :class="cardSizeMode === 'large' ? 'bg-primary text-white shadow-md' : 'bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-500'"
              class="flex-1 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300"
            >
              大卡模式
            </button>
          </div>
          <p class="text-xs text-gray-500 dark:text-gray-400 mt-2">选择适合您的导航卡片大小</p>
        </div>

        <!-- 主题色设置 -->
        <div class="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-4 border border-gray-100 dark:border-gray-700">
          <h4 class="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3 flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-2 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
            </svg>
            主题色调色板
          </h4>
          <div class="space-y-3">
            <div class="flex items-center space-x-3">
              <input
                type="color"
                v-model="themeColor"
                @change="setThemeColor($event.target.value)"
                class="w-12 h-12 rounded-full cursor-pointer transition-transform hover:scale-110 border-0 p-0 appearance-none outline-none box-border"
              >
              <input
                type="text"
                v-model="themeColor"
                @input="setThemeColor(themeColor)"
                class="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm focus:ring-2 focus:ring-primary/50 focus:border-primary outline-none transition-all"
                placeholder="输入十六进制颜色值 (#RRGGBB)"
              >
            </div>
            <div class="flex flex-wrap gap-2 mt-3">
              <button @click="setThemeColor('#3B82F6')" :style="{ backgroundColor: '#3B82F6' }" class="w-9 h-9 rounded-full hover:ring-2 hover:ring-offset-2 hover:ring-primary/50 transition-all transform hover:scale-110" title="蓝色"></button>
              <button @click="setThemeColor('#10B981')" :style="{ backgroundColor: '#10B981' }" class="w-9 h-9 rounded-full hover:ring-2 hover:ring-offset-2 hover:ring-primary/50 transition-all transform hover:scale-110" title="绿色"></button>
              <button @click="setThemeColor('#F59E0B')" :style="{ backgroundColor: '#F59E0B' }" class="w-9 h-9 rounded-full hover:ring-2 hover:ring-offset-2 hover:ring-primary/50 transition-all transform hover:scale-110" title="琥珀色"></button>
              <button @click="setThemeColor('#EF4444')" :style="{ backgroundColor: '#EF4444' }" class="w-9 h-9 rounded-full hover:ring-2 hover:ring-offset-2 hover:ring-primary/50 transition-all transform hover:scale-110" title="红色"></button>
              <button @click="setThemeColor('#8B5CF6')" :style="{ backgroundColor: '#8B5CF6' }" class="w-9 h-9 rounded-full hover:ring-2 hover:ring-offset-2 hover:ring-primary/50 transition-all transform hover:scale-110" title="紫色"></button>
              <button @click="setThemeColor('#EC4899')" :style="{ backgroundColor: '#EC4899' }" class="w-9 h-9 rounded-full hover:ring-2 hover:ring-offset-2 hover:ring-primary/50 transition-all transform hover:scale-110" title="粉色"></button>
              <button @click="setThemeColor('#06B6D4')" :style="{ backgroundColor: '#06B6D4' }" class="w-9 h-9 rounded-full hover:ring-2 hover:ring-offset-2 hover:ring-primary/50 transition-all transform hover:scale-110" title="青色"></button>
              <button @click="setThemeColor('#6B7280')" :style="{ backgroundColor: '#6B7280' }" class="w-9 h-9 rounded-full hover:ring-2 hover:ring-offset-2 hover:ring-primary/50 transition-all transform hover:scale-110" title="灰色"></button>
            </div>
            <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">选择或输入颜色值以更改系统主题色</p>
          </div>
        </div>
      </div>

      <!-- 操作按钮区域 -->
      <div class="flex justify-between mt-8 pt-4 border-t border-gray-100 dark:border-gray-700">

        <button 
          @click="resetSettings()"
          class="px-4 py-2 text-sm text-gray-600 dark:text-gray-300 hover:text-red-500 dark:hover:text-red-400 transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 inline mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          重置为默认设置
        </button>
        <button 
          @click="closeSettings()"
          class="px-5 py-2 bg-primary dark:bg-primary-dark text-white font-medium rounded-lg shadow hover:bg-primary-dark dark:hover:bg-primary-dark/90 transition-all duration-300 transform hover:translate-y-[-2px]"
        >
          关闭设置
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useSettingsStore } from '../store/settings';
import { storeToRefs } from 'pinia';
import { ref, watch } from 'vue';
import { toast } from 'vue-sonner';

// 获取设置store
const settingsStore = useSettingsStore();

// 使用storeToRefs保持状态响应性
const { cardSizeMode, isSettingsOpen, themeColor } = storeToRefs(settingsStore);
const { setCardSizeMode, closeSettings, setThemeColor, resetSettings } = settingsStore;

// 监听设置变化，自动保存并显示提示
watch([cardSizeMode, themeColor], () => {
  // 自动保存设置
  settingsStore.saveSettings();
  
  // 显示保存成功提示
  toast.success('设置已自动保存', {
    description: '您的偏好设置已更新',
    duration: 2000
  });
}, { deep: true });
</script>

<style scoped>
input[type="color"]::-webkit-color-swatch-wrapper {
  padding: 0;
}
input[type="color"]::-webkit-color-swatch {
  border: none;
  border-radius: 50%;
}
input[type="color"]::-moz-color-swatch {
  border: none;
  border-radius: 50%;
}
</style>