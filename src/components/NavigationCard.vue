<template>
  <a :href="url" target="_blank" rel="noopener noreferrer" class="block h-full">
    <div class="glassmorphic-card" :style="{ '--delay': delay }" :class="size === 'small' ? 'small-card' : 'large-card'">
    <div class="p-6 flex flex-col justify-between h-full">
      <div>
        <!-- 只在大卡显示图标和名称容器 -->
        <div v-if="size === 'large'" class="flex items-center mb-4">
          <div class="w-12 h-12 rounded-2xl bg-blue-100 dark:bg-blue-900 flex items-center justify-center mr-4 shadow-lg">
            <span class="text-2xl text-blue-600 dark:text-blue-300 font-extrabold">{{ name.charAt(0) }}</span>
          </div>
          <h3 class="text-xl font-bold text-gray-900 dark:text-white">{{ name }}</h3>
        </div>
        <!-- 小卡只显示名称并垂直居中 -->
        <h3 v-else class="text-xl font-bold text-gray-900 dark:text-white flex items-center justify-center h-full">{{ name }}</h3>
        <!-- 只在大卡显示描述 -->
        <p v-if="size === 'large'" class="text-gray-700 dark:text-gray-300 text-sm mb-5 leading-relaxed">{{ description }}</p>
        <!-- 只在大卡显示标签 -->
        <div v-if="size === 'large'" class="flex flex-wrap gap-2 mb-5">
          <span v-for="(tag, tagIndex) in tags" :key="tagIndex" class="text-xs font-medium bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 px-3 py-1 rounded-full transition-colors duration-300 hover:bg-gray-300 dark:hover:bg-gray-600">
            {{ tag }}
          </span>
        </div>
      </div>
    </div>
  </div>
</a>
</template>

<script setup>
defineProps({
  name: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  tags: {
    type: Array,
    required: true
  },
  url: {
    type: String,
    required: true
  },
  delay: {
    type: String,
    required: true
  },
  size: {
    type: String,
    required: true,
    validator: value => ['small', 'large'].includes(value)
  }
});
</script>

<style scoped>
.glassmorphic-card {
  background: rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  border-radius: 24px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.1);
  transition: all 0.4s cubic-bezier(0.25, 0.8, 0.25, 1);
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 100%;
}

/* 小卡样式 */
.small-card {
  padding: 0.5rem;
  height: auto;
  min-height: 80px;
  margin-bottom: 0;
}/* 固定小卡高度以确保垂直居中效果 */

.small-card h3 {
  font-size: 17px;
  color: #3A3A3C;
  margin-bottom: 2px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.small-card .w-12 {
  width: 24px;
  height: 24px;
}

.small-card span.text-2xl {
  font-size: 14px;
}

.small-card p.text-sm {
  font-size: 11px;
  margin-bottom: 4px;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.small-card span.text-xs {
  font-size: 9px;
  padding: 2px 4px;
  margin-bottom: 2px;
}

/* 大卡样式 */
.large-card .p-6 {
  padding: 8px;
}

.large-card h3 {
  font-size: 18px;
}

.large-card p.text-sm {
  font-size: 14px;
}
.glassmorphic-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 12px 40px 0 rgba(31, 38, 135, 0.2);
}
.glassmorphic-card {
  animation: fadeInUp 0.6s var(--delay) forwards cubic-bezier(0.25, 0.8, 0.25, 1);
  opacity: 0;
}
@keyframes fadeInUp {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}

/* 移动端响应式布局 */
@media (max-width: 768px) {
  .small-card {
    width: calc(50% - 0.5rem);
    display: inline-block;
  }
}
</style>