<template>
  <a :href="url" target="_blank" rel="noopener noreferrer" class="block h-full group transition-all duration-300">
    <div class="card card-hover" :style="{ '--delay': delay }" :class="cardClasses">
      <div class="content-wrapper">
        <!-- 仅在大卡显示图标和名称容器 -->
        <div v-if="size === 'large'" class="large-card-header">
          <div class="icon-container">
            <img v-if="icon" :src="icon.trim()" alt="{{ name }}" class="icon-svg">
            <span v-else class="icon-text">{{ name.charAt(0) }}</span>
          </div>
          <h3 class="large-card-title">{{ name }}</h3>
        </div>

        <!-- 小卡：仅显示名称，垂直居中 -->
        <div v-else class="small-card-header">
          <div class="icon-container small-icon">
            <img v-if="icon" :src="icon.trim()" alt="{{ name }}" class="icon-svg">
            <span v-else class="icon-text">{{ name.charAt(0) }}</span>
          </div>
          <h3 class="small-card-title">{{ name }}</h3>
        </div>

        <!-- 仅在大卡显示描述 -->
        <p v-if="size === 'large'" class="large-card-description">{{ description }}</p>

        <!-- 仅在大卡显示标签 -->
        <div v-if="size === 'large'" class="large-card-tags">
          <span v-for="(tag, tagIndex) in tags" :key="tagIndex" class="tag-item">
            {{ tag }}
          </span>
        </div>
      </div>
    </div>
  </a>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  name: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: false
  },
  icon: {
    type: Object,
    required: false,
    default: null
  },
  tags: {
    type: Array,
    required: false,
    default: () => []
  },
  url: {
    type: String,
    required: true
  },
  delay: {
    type: String,
    required: true // e.g., '0.2s'
  },
  size: {
    type: String,
    required: true,
    validator: value => ['small', 'large'].includes(value)
  }
});

const cardClasses = computed(() => {
  return {
    'small-card': props.size === 'small',
    'large-card': props.size === 'large',
  };
});
</script>

<style scoped>
@keyframes fadeInUp {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}

/* 内容容器 */
.content-wrapper {
  display: flex;
  flex-direction: column;
  justify-content: center; /* 默认居中内容 */
  height: 100%; /* 确保内容容器占满卡片高度 */
  box-sizing: border-box;
  padding: 1rem; /* 基础内边距 */
}

/* 大卡样式 */
.large-card .content-wrapper {
  padding: 1.5rem; /* 大卡内边距更大 */
}

.large-card-header {
  display: flex;
  align-items: center;
  margin-bottom: 1rem;
}

.icon-container {
  width: 3rem; /* 48px */
  height: 3rem; /* 48px */
  border-radius: 1rem; /* 16px */
  background-color: var(--primary-color-light, #E0E7FF); /* 使用主题色的浅色变体 */
  color: var(--primary-color); /* 使用主题色变量 */
  font-weight: 900; /* extrabold */
  font-size: 1.5rem; /* text-2xl -> 24px */
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 1rem; /* mr-4 */
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1); /* shadow-lg */
}

.dark .icon-container {
  background-color: var(--primary-color-dark, #1E3A8A); /* 深色模式下的主题色变体 */
  color: var(--primary-color-light, #93C5FD); /* 浅色文本变体 */
}

.large-card-title {
  font-size: 1.25rem; /* text-xl -> 20px */
  font-weight: 700; /* bold */
  color: #1F2937; /* text-gray-900 */
}

.dark .large-card-title {
  color: #FFFFFF; /* dark:text-white */
}

.large-card-description {
  font-size: 0.875rem; /* text-sm -> 14px */
  color: #4B5563; /* text-gray-700 */
  margin-bottom: 1.25rem; /* mb-5 */
  line-height: 1.5; /* leading-relaxed */
  display: -webkit-box;
  -webkit-line-clamp: 2; /* 限制两行 */
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.dark .large-card-description {
  color: #9CA3AF; /* dark:text-gray-300 */
}

.large-card-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem; /* gap-2 */
  margin-bottom: 1.25rem; /* mb-5 */
}

.tag-item {
  font-size: 0.75rem; /* text-xs -> 12px */
  font-weight: 500; /* medium */
  background-color: #E5E7EB; /* bg-gray-200 */
  color: #1F2937; /* text-gray-800 */
  padding: 0.25rem 0.75rem; /* px-3 py-1 */
  border-radius: 9999px; /* rounded-full */
  transition: all 0.3s ease;
}

.dark .tag-item {
  background-color: #374151; /* dark:bg-gray-700 */
  color: #E5E7EB; /* dark:text-gray-200 */
}

.tag-item:hover {
  background-color: #D1D5DB; /* hover:bg-gray-300 */
}

.dark .tag-item:hover {
  background-color: #4B5563; /* dark:hover:bg-gray-600 */
}

/* 小卡样式 */
.small-card-header {
  display: flex;
  align-items: center;
}

.small-icon {
  width: 2rem; /* 32px */
  height: 2rem; /* 32px */
  font-size: 1rem; /* text-base */
  margin-right: 0.5rem;
}

.small-card .content-wrapper {
  padding: 0.75rem 0.5rem; /* 调整小卡内边距 */
  justify-content: center; /* 确保名称垂直居中 */
}

.icon-svg {
  width: 100%;
  height: 100%;
  object-fit: contain;
}

.small-card-title {
  font-size: 1rem; /* text-base -> 16px */
  font-weight: 700; /* bold */
  color: #1F2937; /* text-gray-900 */
  text-align: center; /* 名字居中 */
  white-space: nowrap; /* 防止换行 */
  overflow: hidden; /* 隐藏超出部分 */
  text-overflow: ellipsis; /* 显示省略号 */
  width: 100%; /* 确保宽度撑满 */
}

.dark .small-card-title {
  color: #FFFFFF; /* dark:text-white */
}
</style>