<template>
  <a :href="url" target="_blank" rel="noopener noreferrer" class="block h-full rounded-3xl fade-in-up" :style="{ animationDelay: delay }">
    <div class="card" :class="cardClasses">
      <div class="content-wrapper">
        <!-- HeroUI 大卡显示图标和名称容器 -->
        <div v-if="size === 'large'" class="large-card-header">
          <div class="icon-container">
            <img v-if="icon" :src="icon.trim()" alt="{{ name }}" class="icon-svg">
            <span v-else class="icon-text">{{ name.charAt(0) }}</span>
          </div>
          <h3 class="large-card-title" :title="name">{{ name }}</h3>
        </div>

        <!-- HeroUI 小卡：仅显示名称，垂直居中 -->
        <div v-else class="small-card-header">
          <div class="icon-container small-icon">
            <img v-if="icon" :src="icon.trim()" alt="{{ name }}" class="icon-svg">
            <span v-else class="icon-text">{{ name.charAt(0) }}</span>
          </div>
          <h3 class="small-card-title">{{ name }}</h3>
        </div>

        <!-- HeroUI 仅在大卡显示描述 -->
        <p v-if="size === 'large'" class="large-card-description" :title="description">{{ description }}</p>

        <!-- HeroUI 仅在大卡显示标签 -->
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
/* HeroUI 动画定义 */
@keyframes fadeInUp {
  from { 
    opacity: 0; 
    transform: translateY(30px);
  }
  to { 
    opacity: 1; 
    transform: translateY(0);
  }
}

/* HeroUI 基础卡片样式 */
.card {
  position: relative;
  overflow: hidden;
  background: white;
  border: 1px solid rgba(229, 231, 235, 0.5);
  border-radius: 1.5rem;
  height: 100%;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

/* HeroUI 卡片悬浮效果 */
.card:hover {
  transform: translateY(-4px);
  box-shadow: 0 20px 25px -5px rgba(99, 102, 241, 0.15), 0 8px 10px -6px rgba(99, 102, 241, 0.1);
  border-color: rgba(99, 102, 241, 0.3);
}

.card:hover .icon-container {
  transform: scale(1.05);
  box-shadow: 0 8px 12px -1px rgba(99, 102, 241, 0.3), 0 4px 8px -1px rgba(99, 102, 241, 0.2);
}

.card:hover .large-card-title,
.card:hover .small-card-title {
  background: linear-gradient(135deg, var(--primary-color), var(--secondary-color));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.card:hover .tag-item {
  transform: scale(1.05);
  box-shadow: 0 4px 6px -1px rgba(99, 102, 241, 0.2), 0 2px 4px -1px rgba(99, 102, 241, 0.1);
}



.dark .card {
  background: #1f2937;
  border-color: rgba(75, 85, 99, 0.5);
}

.dark .card:hover {
  box-shadow: 0 20px 25px -5px rgba(168, 85, 247, 0.2), 0 8px 10px -6px rgba(168, 85, 247, 0.15);
  border-color: rgba(168, 85, 247, 0.4);
}

.dark .card:hover .icon-container {
  box-shadow: 0 8px 12px -1px rgba(168, 85, 247, 0.4), 0 4px 8px -1px rgba(168, 85, 247, 0.3);
}

.dark .card:hover .tag-item {
  box-shadow: 0 4px 6px -1px rgba(168, 85, 247, 0.3), 0 2px 4px -1px rgba(168, 85, 247, 0.2);
}

/* HeroUI 内容容器 */
.content-wrapper {
  display: flex;
  flex-direction: column;
  justify-content: center;
  height: 100%;
  box-sizing: border-box;
  padding: 1rem;
  position: relative;
  z-index: 1;
}

/* HeroUI 大卡样式 */
.large-card {
  height: 180px;
  min-height: 180px;
}

.large-card .content-wrapper {
  padding: 1.75rem;
}

.large-card-header {
  display: flex;
  align-items: center;
  margin-bottom: 1.25rem;
}

/* HeroUI 图标容器 */
.icon-container {
  width: 3.5rem;
  height: 3.5rem;
  border-radius: 1.25rem;
  background: linear-gradient(135deg, var(--primary-color-light) 0%, var(--secondary-color-light) 100%);
  color: var(--primary-color);
  font-weight: 900;
  font-size: 1.75rem;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 1.25rem;
  box-shadow: 0 4px 6px -1px rgba(var(--primary-color-rgb), 0.2), 0 2px 4px -1px rgba(var(--primary-color-rgb), 0.1);
  position: relative;
  overflow: hidden;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}



.dark .icon-container {
  background: linear-gradient(135deg, var(--primary-color-dark) 0%, var(--secondary-color-dark) 100%);
  color: var(--secondary-color-light);
  box-shadow: 0 4px 6px -1px rgba(var(--secondary-color-rgb), 0.3), 0 2px 4px -1px rgba(var(--secondary-color-rgb), 0.2);
}

/* HeroUI 大卡标题 */
.large-card-title {
  font-size: 1.375rem;
  font-weight: 800;
  color: #111827;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  line-height: 1.2;
}

.dark .large-card-title {
  color: #f9fafb;
}

/* HeroUI 大卡描述 */
.large-card-description {
  font-size: 0.875rem;
  color: #4b5563;
  margin-bottom: 1.5rem;
  line-height: 1.6;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
  font-weight: 400;
}

.dark .large-card-description {
  color: #d1d5db;
}

/* HeroUI 大卡标签 */
.large-card-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
  margin-bottom: 1.25rem;
}

.tag-item {
  font-size: 0.75rem;
  font-weight: 600;
  background: linear-gradient(135deg, var(--primary-color-light) 0%, var(--secondary-color-light) 100%);
  color: var(--primary-color-dark);
  padding: 0.375rem 1rem;
  border-radius: 9999px;
  box-shadow: 0 1px 3px 0 rgba(var(--primary-color-rgb), 0.1), 0 1px 2px 0 rgba(var(--primary-color-rgb), 0.06);
  position: relative;
  overflow: hidden;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}



.dark .tag-item {
  background: linear-gradient(135deg, var(--primary-color-dark) 0%, var(--secondary-color-dark) 100%);
  color: var(--secondary-color-light);
  box-shadow: 0 1px 3px 0 rgba(var(--secondary-color-rgb), 0.2), 0 1px 2px 0 rgba(var(--secondary-color-rgb), 0.1);
}

/* HeroUI 小卡样式 */
.small-card-header {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
}

.small-icon {
  width: 2.5rem;
  height: 2.5rem;
  font-size: 1.125rem;
  border-radius: 1rem;
  background: linear-gradient(135deg, var(--primary-color-light) 0%, var(--secondary-color-light) 100%);
  color: var(--primary-color);
  box-shadow: 0 2px 4px -1px rgba(var(--primary-color-rgb), 0.2), 0 1px 2px -1px rgba(var(--primary-color-rgb), 0.1);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.dark .small-icon {
  background: linear-gradient(135deg, var(--primary-color-dark) 0%, var(--secondary-color-dark) 100%);
  color: var(--secondary-color-light);
  box-shadow: 0 2px 4px -1px rgba(var(--secondary-color-rgb), 0.3), 0 1px 2px -1px rgba(var(--secondary-color-rgb), 0.2);
}

.small-card {
  height: 100px;
  min-height: 100px;
}

.small-card .content-wrapper {
  padding: 1rem 0.75rem;
  justify-content: center;
}

/* HeroUI 图标样式 */
.icon-svg {
  width: 100%;
  height: 100%;
  object-fit: contain;
}

/* HeroUI 小卡标题 */
.small-card-title {
  font-size: 1.125rem;
  font-weight: 700;
  color: #111827;
  text-align: center;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  width: 100%;
  line-height: 1.2;
}

.dark .small-card-title {
  color: #f9fafb;
}

/* HeroUI 淡入上移动画 */
.fade-in-up {
  animation: fadeInUp 0.8s cubic-bezier(0.4, 0, 0.2, 1) forwards;
  opacity: 0;
}

.fade-in-up.animated {
  opacity: 1;
}
</style>