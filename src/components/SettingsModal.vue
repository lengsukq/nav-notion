<template>
  <!-- 设置模态框 -->
  <div v-if="isSettingsOpen" class="fixed inset-0 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm flex items-center justify-center z-100 p-4">
    <div class="bg-white dark:bg-gray-800 rounded-3xl shadow-xl p-6 max-w-md w-full transform transition-all duration-300">
      <div class="flex justify-between items-center mb-4">
        <h3 class="text-lg font-semibold text-gray-900 dark:text-white">设置</h3>
        <button @click="closeSettings" class="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
      
      <div class="mb-6">
        <h4 class="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">卡片模式</h4>
        <div class="flex space-x-2">
          <button 
            @click="setCardSizeMode('small')"
            :class="cardSizeMode === 'small' ? 'bg-blue-600 text-gray-900' : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'"
            class="px-3 py-1 rounded-full text-sm font-medium transition-all duration-300 hover:shadow"
          >
            小卡模式
          </button>
          <button 
            @click="setCardSizeMode('large')"
            :class="cardSizeMode === 'large' ? 'bg-blue-600 text-gray-900' : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'"
            class="px-3 py-1 rounded-full text-sm font-medium transition-all duration-300 hover:shadow"
          >
            大卡模式
          </button>
        </div>
      </div>
      
      <div class="flex justify-end">
        <button 
          @click="closeSettings()"
          class="px-4 py-2 bg-blue-600 dark:bg-blue-700 text-gray-900 font-medium rounded-full shadow hover:bg-blue-700 dark:hover:bg-blue-800 transition-all duration-300"
        >
          保存设置
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useSettingsStore } from '../store/settings';
import { storeToRefs } from 'pinia';

// 获取设置store
const settingsStore = useSettingsStore();

// 使用storeToRefs保持状态响应性
const { cardSizeMode, isSettingsOpen } = storeToRefs(settingsStore);
const { setCardSizeMode, closeSettings } = settingsStore;
</script>