<template>
  <a :href="url" target="_blank" rel="noopener noreferrer" class="block h-full group transition-all duration-700 ease-in-out transform hover:-translate-y-2 hover:shadow-2xl rounded-3xl fade-in-up" :style="{ animationDelay: delay }">
    <div class="card card-hover" :class="cardClasses">
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
  transition: all 0.7s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
}

.card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(135deg, rgba(99, 102, 241, 0.05) 0%, rgba(168, 85, 247, 0.05) 50%, rgba(236, 72, 153, 0.05) 100%);
  opacity: 0;
  transition: opacity 0.7s ease;
  pointer-events: none;
}

.card:hover::before {
  opacity: 1;
}

.card:hover {
  border-color: rgba(99, 102, 241, 0.3);
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25), 0 0 0 1px rgba(99, 102, 241, 0.1);
  transform: translateY(-8px);
}

.dark .card {
  background: #1f2937;
  border-color: rgba(75, 85, 99, 0.5);
}

.dark .card:hover {
  border-color: rgba(168, 85, 247, 0.3);
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(168, 85, 247, 0.2);
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
  background: linear-gradient(135deg, #e0e7ff 0%, #ddd6fe 100%);
  color: #6366f1;
  font-weight: 900;
  font-size: 1.75rem;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 1.25rem;
  box-shadow: 0 4px 6px -1px rgba(99, 102, 241, 0.2), 0 2px 4px -1px rgba(99, 102, 241, 0.1);
  transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;
}

.icon-container::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.4), transparent);
  transition: left 0.7s ease;
}

.icon-container:hover::before {
  left: 100%;
}

.icon-container:hover {
  transform: scale(1.1) rotate(3deg);
  box-shadow: 0 10px 15px -3px rgba(99, 102, 241, 0.3), 0 4px 6px -2px rgba(99, 102, 241, 0.2);
}

.dark .icon-container {
  background: linear-gradient(135deg, #312e81 0%, #581c87 100%);
  color: #a78bfa;
  box-shadow: 0 4px 6px -1px rgba(168, 85, 247, 0.3), 0 2px 4px -1px rgba(168, 85, 247, 0.2);
}

.dark .icon-container:hover {
  box-shadow: 0 10px 15px -3px rgba(168, 85, 247, 0.4), 0 4px 6px -2px rgba(168, 85, 247, 0.3);
}

/* HeroUI 大卡标题 */
.large-card-title {
  font-size: 1.375rem;
  font-weight: 800;
  color: #111827;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  transition: color 0.5s ease;
  line-height: 1.2;
}

.large-card-title:hover {
  color: #6366f1;
}

.dark .large-card-title {
  color: #f9fafb;
}

.dark .large-card-title:hover {
  color: #a78bfa;
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
  transition: color 0.5s ease;
  font-weight: 400;
}

.large-card-description:hover {
  color: #374151;
}

.dark .large-card-description {
  color: #d1d5db;
}

.dark .large-card-description:hover {
  color: #e5e7eb;
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
  background: linear-gradient(135deg, #e0e7ff 0%, #ddd6fe 100%);
  color: #4338ca;
  padding: 0.375rem 1rem;
  border-radius: 9999px;
  transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 1px 3px 0 rgba(99, 102, 241, 0.1), 0 1px 2px 0 rgba(99, 102, 241, 0.06);
  position: relative;
  overflow: hidden;
}

.tag-item::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent);
  transition: left 0.6s ease;
}

.tag-item:hover::before {
  left: 100%;
}

.tag-item:hover {
  transform: scale(1.05);
  background: linear-gradient(135deg, #c7d2fe 0%, #e9d5ff 100%);
  box-shadow: 0 4px 6px -1px rgba(99, 102, 241, 0.2), 0 2px 4px -1px rgba(99, 102, 241, 0.1);
}

.dark .tag-item {
  background: linear-gradient(135deg, #312e81 0%, #581c87 100%);
  color: #c4b5fd;
  box-shadow: 0 1px 3px 0 rgba(168, 85, 247, 0.2), 0 1px 2px 0 rgba(168, 85, 247, 0.1);
}

.dark .tag-item:hover {
  background: linear-gradient(135deg, #4c1d95 0%, #6b21a8 100%);
  color: #ddd6fe;
  box-shadow: 0 4px 6px -1px rgba(168, 85, 247, 0.3), 0 2px 4px -1px rgba(168, 85, 247, 0.2);
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
  background: linear-gradient(135deg, #e0e7ff 0%, #ddd6fe 100%);
  color: #6366f1;
  box-shadow: 0 2px 4px -1px rgba(99, 102, 241, 0.2), 0 1px 2px -1px rgba(99, 102, 241, 0.1);
  transition: all 0.5s ease;
}

.small-icon:hover {
  transform: scale(1.1) rotate(3deg);
  box-shadow: 0 4px 6px -1px rgba(99, 102, 241, 0.3), 0 2px 4px -1px rgba(99, 102, 241, 0.2);
}

.dark .small-icon {
  background: linear-gradient(135deg, #312e81 0%, #581c87 100%);
  color: #a78bfa;
  box-shadow: 0 2px 4px -1px rgba(168, 85, 247, 0.3), 0 1px 2px -1px rgba(168, 85, 247, 0.2);
}

.dark .small-icon:hover {
  box-shadow: 0 4px 6px -1px rgba(168, 85, 247, 0.4), 0 2px 4px -1px rgba(168, 85, 247, 0.3);
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
  transition: transform 0.5s ease;
}

.icon-container:hover .icon-svg,
.small-icon:hover .icon-svg {
  transform: scale(1.1);
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
  transition: color 0.5s ease;
  line-height: 1.2;
}

.small-card-title:hover {
  color: #6366f1;
}

.dark .small-card-title {
  color: #f9fafb;
}

.dark .small-card-title:hover {
  color: #a78bfa;
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