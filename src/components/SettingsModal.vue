<template>
  <!-- 设置模态框 -->
  <div v-if="isSettingsOpen" class="modal-backdrop fixed inset-0 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm flex items-center justify-center z-100 p-4" 
       :class="modalBackdropClasses" ref="modalBackdrop">
    <div class="modal-container bg-white dark:bg-gray-800 rounded-3xl shadow-xl p-5 max-w-md w-full max-h-[85vh] transform transition-all duration-500 hover:shadow-2xl flex flex-col" 
         :class="modalContainerClasses" :style="modalContainerStyle" ref="modalContainer">
      <div class="flex justify-between items-center mb-4">
        <h3 class="text-xl font-bold text-gray-900 dark:text-white flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
          </svg>
          设置
        </h3>
        <button @click="closeSettings" class="button button-secondary p-1 rounded-full transition-all duration-300 hover:scale-110">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 transition-all duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
      </div>
      
      <!-- 设置选项卡片 -->
      <div class="space-y-4 overflow-y-auto flex-1 pr-2">
        <!-- 卡片模式设置 -->
        <div class="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-3 border border-gray-100 dark:border-gray-700">
          <h4 class="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-2 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
            </svg>
            卡片显示设置
          </h4>
          <div class="flex space-x-3">
            <button 
              @click="setCardSizeMode('small')"
              :class="[cardSizeMode === 'small' ? 'button-primary selected' : 'button-secondary', 'flex-1 px-4 py-2 rounded-lg text-sm font-medium button']"
            >
              小卡模式
            </button>
            <button 
              @click="setCardSizeMode('large')"
              :class="[cardSizeMode === 'large' ? 'button-primary selected' : 'button-secondary', 'flex-1 px-4 py-2 rounded-lg text-sm font-medium button']"
            >
              大卡模式
            </button>
          </div>
          <p class="text-xs text-gray-500 dark:text-gray-400 mt-2">选择适合您的导航卡片大小</p>
        </div>

        <!-- 主题色设置 -->
        <div class="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-3 border border-gray-100 dark:border-gray-700">
          <h4 class="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-2 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
            </svg>
            主题色调色板
          </h4>
          
          <!-- 主次主题色紧凑布局 -->
          <div class="space-y-3">
            <!-- 主题色行 -->
            <div class="flex items-center gap-3">
              <div class="flex items-center gap-2 min-w-0 flex-1">
                <span class="text-xs text-gray-600 dark:text-gray-400 w-8 flex-shrink-0">主色</span>
              <input
                type="color"
                v-model="themeColor"
                @change="setThemeColor($event.target.value)"
                  class="w-8 h-8 rounded-full cursor-pointer transition-all duration-300 hover:scale-110 border-0 p-0 appearance-none outline-none box-border hover:shadow-lg flex-shrink-0"
              >
              <input
                type="text"
                v-model="themeColor"
                @input="setThemeColor(themeColor)"
                  class="flex-1 min-w-0 px-2 py-1 border border-gray-300 dark:border-gray-600 rounded text-xs focus:ring-1 focus:ring-primary/50 focus:border-primary outline-none transition-all duration-300"
                  placeholder="#RRGGBB"
                >
          </div>
        </div>

            <!-- 次主题色行 -->
            <div class="flex items-center gap-3">
              <div class="flex items-center gap-2 min-w-0 flex-1">
                <span class="text-xs text-gray-600 dark:text-gray-400 w-8 flex-shrink-0">次色</span>
              <input
                type="color"
                v-model="secondaryColor"
                @change="setSecondaryColor($event.target.value)"
                  class="w-8 h-8 rounded-full cursor-pointer transition-all duration-300 hover:scale-110 border-0 p-0 appearance-none outline-none box-border hover:shadow-lg flex-shrink-0"
              >
              <input
                type="text"
                v-model="secondaryColor"
                @input="setSecondaryColor(secondaryColor)"
                  class="flex-1 min-w-0 px-2 py-1 border border-gray-300 dark:border-gray-600 rounded text-xs focus:ring-1 focus:ring-secondary/50 focus:border-secondary outline-none transition-all duration-300"
                  placeholder="#RRGGBB"
              >
              </div>
            </div>
            
            <!-- 预设颜色选择器 -->
            <div class="space-y-2">
              <p class="text-xs text-gray-500 dark:text-gray-400">快速选择</p>
              <div class="grid grid-cols-8 gap-2">
                <button @click="applyColor('#3B82F6')" :style="{ backgroundColor: '#3B82F6' }" 
                        class="w-7 h-7 rounded-full hover:ring-2 hover:ring-offset-1 hover:ring-blue-300 transition-all duration-200 transform hover:scale-110 relative group" 
                        title="蓝色">
                  <span class="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">蓝色</span>
                </button>
                <button @click="applyColor('#10B981')" :style="{ backgroundColor: '#10B981' }" 
                        class="w-7 h-7 rounded-full hover:ring-2 hover:ring-offset-1 hover:ring-green-300 transition-all duration-200 transform hover:scale-110 relative group" 
                        title="绿色">
                  <span class="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">绿色</span>
                </button>
                <button @click="applyColor('#F59E0B')" :style="{ backgroundColor: '#F59E0B' }" 
                        class="w-7 h-7 rounded-full hover:ring-2 hover:ring-offset-1 hover:ring-yellow-300 transition-all duration-200 transform hover:scale-110 relative group" 
                        title="琥珀色">
                  <span class="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">琥珀</span>
                </button>
                <button @click="applyColor('#EF4444')" :style="{ backgroundColor: '#EF4444' }" 
                        class="w-7 h-7 rounded-full hover:ring-2 hover:ring-offset-1 hover:ring-red-300 transition-all duration-200 transform hover:scale-110 relative group" 
                        title="红色">
                  <span class="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">红色</span>
                </button>
                <button @click="applyColor('#8B5CF6')" :style="{ backgroundColor: '#8B5CF6' }" 
                        class="w-7 h-7 rounded-full hover:ring-2 hover:ring-offset-1 hover:ring-purple-300 transition-all duration-200 transform hover:scale-110 relative group" 
                        title="紫色">
                  <span class="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">紫色</span>
                </button>
                <button @click="applyColor('#EC4899')" :style="{ backgroundColor: '#EC4899' }" 
                        class="w-7 h-7 rounded-full hover:ring-2 hover:ring-offset-1 hover:ring-pink-300 transition-all duration-200 transform hover:scale-110 relative group" 
                        title="粉色">
                  <span class="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">粉色</span>
                </button>
                <button @click="applyColor('#06B6D4')" :style="{ backgroundColor: '#06B6D4' }" 
                        class="w-7 h-7 rounded-full hover:ring-2 hover:ring-offset-1 hover:ring-cyan-300 transition-all duration-200 transform hover:scale-110 relative group" 
                        title="青色">
                  <span class="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">青色</span>
                </button>
                <button @click="applyColor('#6B7280')" :style="{ backgroundColor: '#6B7280' }" 
                        class="w-7 h-7 rounded-full hover:ring-2 hover:ring-offset-1 hover:ring-gray-300 transition-all duration-200 transform hover:scale-110 relative group" 
                        title="灰色">
                  <span class="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">灰色</span>
                </button>
              </div>
              <div class="flex items-center justify-between">
                <p class="text-xs text-gray-500 dark:text-gray-400">点击色块应用到{{ applyToSecondary ? '次主题色' : '主题色' }}</p>
                <button 
                  @click="applyToSecondary = !applyToSecondary"
                  :class="[applyToSecondary ? 'text-secondary bg-secondary/10 border-secondary/30' : 'text-primary bg-primary/10 border-primary/30', 'px-2 py-1 text-xs rounded border transition-all duration-200']"
                >
                  {{ applyToSecondary ? '切换到主色' : '切换到次色' }}
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Tag筛选模式设置 -->
        <div class="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-3 border border-gray-100 dark:border-gray-700">
          <h4 class="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-2 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
            </svg>
            Tag筛选模式
          </h4>
          <div class="flex space-x-3">
            <button 
              @click="setTagFilterMode('single')"
              :class="[tagFilterMode === 'single' ? 'button-primary selected' : 'button-secondary', 'flex-1 px-4 py-2 rounded-lg text-sm font-medium button']"
            >
              单选模式
            </button>
            <button 
              @click="setTagFilterMode('multiple')"
              :class="[tagFilterMode === 'multiple' ? 'button-primary selected' : 'button-secondary', 'flex-1 px-4 py-2 rounded-lg text-sm font-medium button']"
            >
              多选模式
            </button>
          </div>
          <p class="text-xs text-gray-500 dark:text-gray-400 mt-2">选择Tag筛选方式：单选仅显示匹配任一Tag的结果，多选显示同时匹配所有选中Tag的结果</p>
        </div>
      </div>

      <!-- 操作按钮区域 -->
      <div class="flex justify-between mt-6 pt-4 border-t border-gray-100 dark:border-gray-700 flex-shrink-0">

        <button 
          @click="resetSettings()"
          class="px-4 py-2 text-sm text-gray-600 dark:text-gray-300 hover:text-red-500 dark:hover:text-red-400 transition-all duration-300 transform hover:scale-105 button button-danger hover:shadow-md"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 inline mr-1 transition-all duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          重置为默认设置
        </button>
        <button 
          @click="closeSettings()"
          class="px-5 py-2 font-medium rounded-lg shadow button button-primary"
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
import { watch, ref, computed, nextTick, onMounted, onUnmounted } from 'vue';
import { toast } from 'vue-sonner';

// 获取设置store
const settingsStore = useSettingsStore();

// 使用storeToRefs保持状态响应性
const { cardSizeMode, isSettingsOpen, themeColor, secondaryColor, tagFilterMode } = storeToRefs(settingsStore);
const { setCardSizeMode, setSettingsOpen, setThemeColor, setSecondaryColor, resetSettings, setTagFilterMode } = settingsStore;

// 预设颜色应用模式切换
const applyToSecondary = ref(false);

// 动画相关的状态
const isAnimating = ref(false);
const animationState = ref('enter'); // 'enter' | 'exit'
const settingsButtonPosition = ref({ x: 0, y: 0 });
const modalBackdrop = ref(null);
const modalContainer = ref(null);

// 计算动画类名
const modalBackdropClasses = computed(() => {
  if (!isAnimating.value) return '';
  
  return animationState.value === 'enter' 
    ? 'animate-in fade-in duration-300 ease-out'
    : 'animate-out fade-out duration-200 ease-in';
});

const modalContainerClasses = computed(() => {
  if (!isAnimating.value) return '';
  
  return animationState.value === 'enter' 
    ? 'animate-in zoom-in-95 duration-400 ease-out'
    : 'animate-out zoom-out-95 duration-200 ease-in';
});

// 计算模态框容器的变换原点样式
const modalContainerStyle = computed(() => {
  if (!isAnimating.value) return {};
  
  // 将设置按钮的屏幕坐标转换为相对于模态框的位置
  const viewportWidth = window.innerWidth;
  const viewportHeight = window.innerHeight;
  
  // 计算变换原点（相对于视窗的百分比）
  const originX = (settingsButtonPosition.value.x / viewportWidth) * 100;
  const originY = (settingsButtonPosition.value.y / viewportHeight) * 100;
  
  return {
    transformOrigin: `${originX}% ${originY}%`,
    transition: animationState.value === 'enter' 
      ? 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)'
      : 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)'
  };
});

// 应用颜色的函数
const applyColor = (color) => {
  if (applyToSecondary.value) {
    setSecondaryColor(color);
  } else {
    setThemeColor(color);
  }
};

// 获取设置按钮的位置
const getSettingsButtonPosition = () => {
  const settingsButton = document.querySelector('.settings-button');
  if (settingsButton) {
    const rect = settingsButton.getBoundingClientRect();
    settingsButtonPosition.value = {
      x: rect.left + rect.width / 2,
      y: rect.top + rect.height / 2
    };
  }
};

// 关闭设置的函数，带有iOS风格动画效果
const closeSettings = () => {
  isAnimating.value = true;
  animationState.value = 'exit';
  
  // 获取当前设置按钮位置
  getSettingsButtonPosition();
  
  // 延迟关闭以播放动画
  setTimeout(() => {
    setSettingsOpen(false);
    isAnimating.value = false;
  }, 200);
};

// 监听设置开启状态，触发进入动画
watch(isSettingsOpen, (newValue) => {
  if (newValue) {
    // 获取设置按钮位置
    getSettingsButtonPosition();
    
    // 触发进入动画
    isAnimating.value = true;
    animationState.value = 'enter';
    
    nextTick(() => {
      setTimeout(() => {
        isAnimating.value = false;
      }, 400);
    });
  }
});

// 监听设置变化，自动保存并显示提示
watch([cardSizeMode, themeColor, secondaryColor, tagFilterMode], () => {
  // 自动保存设置
  settingsStore.saveSettings();
  console.log('cardSizeMode', cardSizeMode.value);
  console.log('themeColor', themeColor.value);
  console.log('secondaryColor', secondaryColor.value);
  
  // 调试日志，检查按钮选中状态
  console.log('Button classes - small:', cardSizeMode.value === 'small' ? 'button-primary selected' : 'button-secondary');
  console.log('Button classes - large:', cardSizeMode.value === 'large' ? 'button-primary selected' : 'button-secondary');
  
  // 显示保存成功提示
  toast.success('设置已自动保存', {
    description: '您的偏好设置已更新',
    duration: 2000
  });
}, { deep: true });
</script>

<style scoped>
/* iOS风格动画效果 */
.modal-backdrop {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.modal-container {
  will-change: transform, opacity;
  backface-visibility: hidden;
}

/* 进入动画 */
@keyframes zoomInFromPoint {
  0% {
    opacity: 0;
    transform: scale(0.1);
  }
  60% {
    opacity: 1;
    transform: scale(1.05);
  }
  100% {
    opacity: 1;
    transform: scale(1);
  }
}

/* 退出动画 */
@keyframes zoomOutToPoint {
  0% {
    opacity: 1;
    transform: scale(1);
  }
  100% {
    opacity: 0;
    transform: scale(0.1);
  }
}

.animate-zoom-in {
  animation: zoomInFromPoint 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;
}

.animate-zoom-out {
  animation: zoomOutToPoint 0.2s cubic-bezier(0.4, 0, 0.2, 1) forwards;
}

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

/* 自定义滚动条样式 */
.overflow-y-auto::-webkit-scrollbar {
  width: 6px;
}

.overflow-y-auto::-webkit-scrollbar-track {
  background: transparent;
  border-radius: 3px;
}

.overflow-y-auto::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 3px;
  transition: background 0.2s ease;
}

.overflow-y-auto::-webkit-scrollbar-thumb:hover {
  background: #94a3b8;
}

.dark .overflow-y-auto::-webkit-scrollbar-thumb {
  background: #475569;
}

.dark .overflow-y-auto::-webkit-scrollbar-thumb:hover {
  background: #64748b;
}
</style>