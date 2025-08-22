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

        <!-- HeroUI 小卡：显示图标和名称，垂直居中 -->
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
    required: true,
    default: ''
  },
  icon: {
    type: String,
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
  background: rgba(255, 255, 255, 0.4);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 1.5rem;
  height: 100%;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03);
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
  background: rgba(31, 41, 55, 0.4);
  border-color: rgba(75, 85, 99, 0.2);
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
  justify-content: flex-start;
  height: 100%;
  box-sizing: border-box;
  padding: 0.75rem;
  position: relative;
  z-index: 1;
}

.large-card .content-wrapper {
  justify-content: flex-start;
  padding: 0.625rem;
  min-height: 100%;
  overflow: hidden;
}

/* HeroUI 大卡样式 */
.large-card {
  min-height: 140px;
  height: auto;
  max-height: 200px;
  width: 100%;
  display: flex;
  flex-direction: column;
}


.large-card-header {
  display: flex;
  align-items: center;
  margin-bottom: 0.375rem;
}

/* HeroUI 图标容器 */
.icon-container {
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 0.875rem;
  background: linear-gradient(135deg, var(--primary-color-light) 0%, var(--secondary-color-light) 100%);
  color: var(--primary-color);
  font-weight: 900;
  font-size: 1.25rem;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 0.625rem;
  box-shadow: 0 4px 6px -1px rgba(var(--primary-color-rgb), 0.2), 0 2px 4px -1px rgba(var(--primary-color-rgb), 0.1);
  position: relative;
  overflow: hidden;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  z-index: 1;
}

.icon-container::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(255, 255, 255, 0.15);
  transform: scaleX(0);
  transform-origin: left;
  transition: transform 0.3s ease;
  z-index: -1;
}

.card:hover .icon-container::before {
  transform: scaleX(1);
}



.dark .icon-container {
  background: linear-gradient(135deg, var(--primary-color-dark) 0%, var(--secondary-color-dark) 100%);
  color: var(--secondary-color-light);
  box-shadow: 0 4px 6px -1px rgba(var(--secondary-color-rgb), 0.3), 0 2px 4px -1px rgba(var(--secondary-color-rgb), 0.2);
}

/* HeroUI 大卡标题 */
.large-card-title {
  font-size: 1.125rem;
  font-weight: 700;
  color: #111827;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  line-height: 1.2;
  letter-spacing: -0.025em;
  max-width: 100%;
}

.dark .large-card-title {
  color: #f9fafb;
}

/* HeroUI 大卡描述 */
.large-card-description {
  font-size: 0.875rem;
  color: #4b5563;
  margin-bottom: 0.25rem;
  line-height: 1.3;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
  font-weight: 400;
  word-wrap: break-word;
  hyphens: auto;
  height: 2.6rem;
  min-height: 2.6rem;
  max-height: 2.6rem;
  white-space: pre-wrap;
}

.dark .large-card-description {
  color: #d1d5db;
}

/* HeroUI 大卡标签 */
.large-card-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.125rem;
  margin-bottom: 0.0625rem;
  max-height: 1.25rem;
  overflow: hidden;
}

.tag-item {
  font-size: 0.625rem;
  font-weight: 600;
  background: linear-gradient(135deg, var(--primary-color-light) 0%, var(--secondary-color-light) 100%);
  color: var(--primary-color-dark);
  padding: 0.0625rem 0.375rem;
  border-radius: 9999px;
  box-shadow: 0 1px 3px 0 rgba(var(--primary-color-rgb), 0.1), 0 1px 2px 0 rgba(var(--primary-color-rgb), 0.06);
  position: relative;
  overflow: hidden;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  z-index: 1;
  white-space: nowrap;
  max-width: 70px;
  overflow: hidden;
  text-overflow: ellipsis;
}

.tag-item::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(255, 255, 255, 0.15);
  transform: scaleX(0);
  transform-origin: left;
  transition: transform 0.3s ease;
  z-index: -1;
}

.card:hover .tag-item::before {
  transform: scaleX(1);
}



.dark .tag-item {
  background: linear-gradient(135deg, var(--primary-color-dark) 0%, var(--secondary-color-dark) 100%);
  color: var(--secondary-color-light);
  box-shadow: 0 1px 3px 0 rgba(var(--secondary-color-rgb), 0.2), 0 1px 2px 0 rgba(var(--secondary-color-rgb), 0.1);
}

/* HeroUI 小卡样式 */
.small-card-header {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.25rem;
}

.small-icon {
  width: 2rem;
  height: 2rem;
  font-size: 0.875rem;
  border-radius: 0.75rem;
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
  max-height: 100px;
  width: 100%;
  display: flex;
  flex-direction: column;
}

.small-card .content-wrapper {
  padding: 0.5rem;
  justify-content: center;
  overflow: hidden;
}

/* HeroUI 图标样式 */
.icon-svg {
  width: 100%;
  height: 100%;
  object-fit: contain;
}

/* HeroUI 小卡标题 */
.small-card-title {
  font-size: 0.875rem;
  font-weight: 700;
  color: #111827;
  text-align: center;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  width: 100%;
  line-height: 1.2;
  letter-spacing: -0.025em;
  max-width: 100%;
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

/* 响应式设计 */
@media (max-width: 768px) {
  .large-card {
    min-height: 120px;
    max-height: 160px;
  }
  
  .large-card .content-wrapper {
    padding: 0.5rem;
  }
  
  .large-card-title {
    font-size: 1rem;
  }
  
  .large-card-description {
    font-size: 0.75rem;
    -webkit-line-clamp: 2;
    height: 2.2rem;
    min-height: 2.2rem;
    max-height: 2.2rem;
  }
  
  .small-card {
    height: 80px;
    min-height: 80px;
    max-height: 80px;
  }
  
  .small-card .content-wrapper {
    padding: 0.375rem;
  }
  
  .small-card-title {
    font-size: 0.75rem;
  }
  
  .tag-item {
    max-width: 55px;
    font-size: 0.5rem;
    padding: 0.03125rem 0.25rem;
  }
}

@media (max-width: 480px) {
  .large-card {
    min-height: 100px;
    max-height: 140px;
  }
  
  .large-card .content-wrapper {
    padding: 0.375rem;
  }
  
  .large-card-title {
    font-size: 0.875rem;
  }
  
  .large-card-description {
    font-size: 0.6875rem;
    -webkit-line-clamp: 2;
    height: 1.8rem;
    min-height: 1.8rem;
    max-height: 1.8rem;
    margin-bottom: 0.125rem;
  }
  
  .large-card-tags {
    max-height: 0.875rem;
    gap: 0.0625rem;
    margin-bottom: 0.0625rem;
  }
  
  .small-card {
    height: 60px;
    min-height: 60px;
    max-height: 60px;
  }
  
  .small-card .content-wrapper {
    padding: 0.25rem;
  }
  
  .small-card-title {
    font-size: 0.625rem;
  }
  
  .icon-container {
    width: 1.75rem;
    height: 1.75rem;
    font-size: 0.875rem;
    margin-right: 0.375rem;
  }
  
  .small-icon {
    width: 1.5rem;
    height: 1.5rem;
    font-size: 0.75rem;
  }
  
  .tag-item {
    max-width: 45px;
    font-size: 0.4375rem;
    padding: 0.015625rem 0.1875rem;
  }
}

/* 超限内容处理增强 */
.large-card-description:hover {
  overflow-y: auto;
  max-height: 6rem;
}

.large-card-tags:hover {
  overflow-y: auto;
  max-height: 4rem;
}

/* 确保长文本在标题中也能正确处理 */
.large-card-title:hover,
.small-card-title:hover {
  white-space: normal;
  overflow: visible;
  text-overflow: clip;
  word-wrap: break-word;
  hyphens: auto;
}
</style>