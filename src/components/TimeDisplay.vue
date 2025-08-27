<template>
  <!-- HeroUI 时间显示组件 - 融入式设计 -->
  <div class="flex items-center gap-2">
    <!-- 时间图标 -->
    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-gray-500 dark:text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
      <path stroke-linecap="round" stroke-linejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
    <!-- 时间文本 -->
    <span class="font-mono text-sm font-medium text-gray-700 dark:text-gray-300 tracking-wider">
      {{ currentTime }}
    </span>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';

const currentTime = ref('');
let timeInterval = null;

// 更新时间显示
const updateTime = () => {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');
  const seconds = String(now.getSeconds()).padStart(2, '0');
  currentTime.value = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
};

onMounted(() => {
  // 首次立即更新
  updateTime();
  // 设置定时器每秒更新
  timeInterval = setInterval(updateTime, 1000);
});

onUnmounted(() => {
  // 组件卸载时清除定时器，防止内存泄漏
  if (timeInterval) {
    clearInterval(timeInterval);
  }
});
</script>

<style scoped>
/* 此组件的所有样式均由 Tailwind CSS 的原子类在模板中直接定义，因此无需额外的 scoped CSS。*/
</style>