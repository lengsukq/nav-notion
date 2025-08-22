<template>
  <a :href="url" target="_blank" rel="noopener noreferrer" class="block h-full rounded-3xl fade-in-up" :style="{ animationDelay: delay }">
    <!-- 关键改动：移除了 glass-effect 类，所有样式都由 .card 控制 -->
    <div class="card" :class="cardClasses">
      <div class="content-wrapper">
        <!-- HeroUI 大卡显示图标和名称容器 -->
        <div v-if="size === 'large'" class="large-card-header">
          <div class="icon-container">
            <img v-if="icon" :src="icon.trim()" :alt="name" class="icon-svg">
            <span v-else class="icon-text">{{ name.charAt(0) }}</span>
          </div>
          <h3 class="large-card-title" :title="name">{{ name }}</h3>
        </div>

        <!-- HeroUI 小卡：显示图标和名称，垂直居中 -->
        <div v-else class="small-card-header">
          <div class="icon-container small-icon">
            <img v-if="icon" :src="icon.trim()" :alt="name" class="icon-svg">
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
/*  <-- 如果你在环境中配置了 PostCSS，这个可以保留 */
 @reference "tailwindcss";
/* --- 关键改动：基础卡片样式，已包含毛玻璃效果 --- */
.card {
  height: 100%;
  border-radius: 1.5rem; /* 对应 rounded-3xl */
  /* 毛玻璃效果核心 */
  background-color: rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(1rem);
  -webkit-backdrop-filter: blur(1rem); /* 兼容 Safari */
  border: 1px solid rgba(255, 255, 255, 0.2);
  box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
}

/* 深色模式下的卡片 */
.dark .card {
  background-color: rgba(31, 41, 55, 0.15); /* ~dark:bg-gray-800/15 */
  border-color: rgba(255, 255, 255, 0.1);
}

/* 卡片悬浮效果 */
.card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 40px -5px rgba(99, 102, 241, 0.2); /* 对应 var(--primary-color) */
  border-color: rgba(99, 102, 241, 0.3);
}

/* 深色模式下的卡片悬浮效果 */
.dark .card:hover {
  box-shadow: 0 12px 40px -5px rgba(168, 85, 247, 0.25); /* 对应 var(--secondary-color) 或强调色 */
  border-color: rgba(168, 85, 247, 0.4);
}
/* --- 改动结束 --- */


/* --- 以下是你原有的其他样式，保持不变 --- */
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

.dark .card:hover .icon-container {
  box-shadow: 0 8px 12px -1px rgba(168, 85, 247, 0.4), 0 4px 8px -1px rgba(168, 85, 247, 0.3);
}

.dark .card:hover .tag-item {
  box-shadow: 0 4px 6px -1px rgba(168, 85, 247, 0.3), 0 2px 4px -1px rgba(168, 85, 247, 0.2);
}

/* HeroUI 内容容器 */
.content-wrapper {
  @apply flex flex-col justify-start h-full box-border p-3 relative z-10;
}

.large-card .content-wrapper {
  @apply justify-start p-2.5 min-h-full overflow-hidden;
}

/* HeroUI 大卡样式 */
.large-card {
  @apply min-h-[140px] h-auto max-h-[200px] w-full flex flex-col;
}


.large-card-header {
  @apply flex items-center mb-1.5;
}

/* HeroUI 图标容器 */
.icon-container {
  @apply w-10 h-10 rounded-[1.5rem] flex items-center justify-center mr-2.5 relative overflow-hidden transition-all duration-300 z-10;
  background: linear-gradient(135deg, var(--primary-color-light) 0%, var(--secondary-color-light) 100%);
  color: var(--primary-color);
  font-weight: 900;
  font-size: 1.25rem;
  box-shadow: 0 4px 6px -1px rgba(var(--primary-color-rgb), 0.2), 0 2px 4px -1px rgba(var(--primary-color-rgb), 0.1);
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
  @apply text-lg font-bold text-gray-900 whitespace-nowrap overflow-hidden text-ellipsis leading-tight tracking-tighter max-w-full;
}

.dark .large-card-title {
  @apply text-gray-50;
}

/* HeroUI 大卡描述 */
.large-card-description {
  @apply text-sm text-gray-600 mb-1 leading-relaxed line-clamp-2 overflow-hidden text-ellipsis font-normal break-words hyphens-auto h-[2.6rem] min-h-[2.6rem] max-h-[2.6rem] whitespace-pre-wrap;
}

.dark .large-card-description {
  @apply text-gray-300;
}

/* HeroUI 大卡标签 */
.large-card-tags {
  @apply flex flex-wrap gap-0.5 mb-0.25 max-h-5 overflow-hidden;
}

.tag-item {
  @apply text-xs font-semibold relative overflow-hidden transition-all duration-300 z-10 whitespace-nowrap max-w-[70px] overflow-hidden text-ellipsis rounded-full;
  background: linear-gradient(135deg, var(--primary-color-light) 0%, var(--secondary-color-light) 100%);
  color: var(--primary-color-dark);
  padding: 0.0625rem 0.375rem;
  box-shadow: 0 1px 3px 0 rgba(var(--primary-color-rgb), 0.1), 0 1px 2px 0 rgba(var(--primary-color-rgb), 0.06);
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
  @apply flex flex-col items-center justify-center gap-0.5;
}

.small-icon {
  @apply w-6 h-6 text-xs rounded-[1.5rem] transition-all duration-300;
  background: linear-gradient(135deg, var(--primary-color-light) 0%, var(--secondary-color-light) 100%);
  color: var(--primary-color);
  box-shadow: 0 2px 4px -1px rgba(var(--primary-color-rgb), 0.2), 0 1px 2px -1px rgba(var(--primary-color-rgb), 0.1);
}

.dark .small-icon {
  background: linear-gradient(135deg, var(--primary-color-dark) 0%, var(--secondary-color-dark) 100%);
  color: var(--secondary-color-light);
  box-shadow: 0 2px 4px -1px rgba(var(--secondary-color-rgb), 0.3), 0 1px 2px -1px rgba(var(--secondary-color-rgb), 0.2);
}

.small-card {
  @apply h-[80px] min-h-[80px] max-h-[80px] w-full flex flex-col;
  padding: 0;
}

.small-card .content-wrapper {
  @apply p-2 justify-center overflow-hidden;
}

/* HeroUI 图标样式 */
.icon-svg {
  @apply w-full h-full object-contain;
}

/* HeroUI 小卡标题 */
.small-card-title {
  @apply text-xs font-bold text-gray-900 text-center whitespace-nowrap overflow-hidden text-ellipsis w-full leading-tight tracking-tighter max-w-full;
}

.dark .small-card-title {
  @apply text-gray-50;
}

/* HeroUI 淡入上移动画 - 使用公共样式 */
.fade-in-up {
  opacity: 0;
  animation: fadeInUp 0.6s ease-out forwards;
}

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

/* 响应式设计 */
@media (max-width: 768px) {
  .large-card {
    @apply min-h-[120px] max-h-[160px];
  }
  
  .large-card .content-wrapper {
    @apply p-2;
  }
  
  .large-card-title {
    @apply text-base;
  }
  
  .large-card-description {
    @apply text-xs line-clamp-2 h-[2.2rem] min-h-[2.2rem] max-h-[2.2rem];
  }
  
  .small-card {
    @apply h-[70px] min-h-[70px] max-h-[70px];
  }
  
  .small-card .content-wrapper {
    @apply p-1.5;
  }
  
  .small-card-title {
    @apply text-[0.625rem];
  }
  
  .tag-item {
    @apply max-w-[55px] text-[0.5rem] p-px;
  }
}

@media (max-width: 480px) {
  .large-card {
    @apply min-h-[100px] max-h-[140px];
  }
  
  .large-card .content-wrapper {
    @apply p-1.5;
  }
  
  .large-card-title {
    @apply text-sm;
  }
  
  .large-card-description {
    @apply text-[0.6875rem] line-clamp-2 h-[1.8rem] min-h-[1.8rem] max-h-[1.8rem] mb-0.5;
  }
  
  .large-card-tags {
    @apply max-h-3.5 gap-0.25 mb-0.25;
  }
  
  .small-card {
    @apply h-[60px] min-h-[60px] max-h-[60px];
  }
  
  .small-card .content-wrapper {
    @apply p-1;
  }
  
  .small-card-title {
    @apply text-[0.5rem];
  }
  
  .icon-container {
    @apply w-7 h-7 text-sm mr-1.5 rounded-[1.5rem];
  }
  
  .small-icon {
    @apply w-5 h-5 text-[0.625rem] rounded-[1.5rem];
  }
  
  .tag-item {
    @apply max-w-[45px] text-[0.4375rem] p-px;
  }
}

</style>