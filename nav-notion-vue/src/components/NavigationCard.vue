<template>
  <article 
    class="hero-card group relative flex flex-col overflow-hidden rounded-3xl border cursor-pointer transition-all duration-500 ease-out" 
    :class="containerClasses"
    :style="{ animationDelay: delay }"
    @click="handleNavigation" 
    @keydown.enter.prevent="handleNavigation"
    role="button"
    tabindex="0"
    :aria-label="`访问 ${name}`"
  >
    <!-- 背景与光效层 -->
    <div class="absolute inset-0 hero-card-bg pointer-events-none"></div>
    <div class="absolute inset-0 hero-card-glow opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"></div>
    
    <!-- 内容区域 -->
    <!-- 核心布局：h-full flex-col 确保垂直撑满 -->
    <div class="relative z-10 flex flex-col h-full w-full transition-all" :class="contentPaddingClasses">
      
      <!-- 1. 头部区域：Icon + 标题 -->
      <!-- shrink-0 防止头部被压缩 -->
      <header class="shrink-0" :class="headerClasses">
        <!-- 图标容器：仅 Small 显示 -->
        <div 
          v-if="showIcon"
          class="relative flex items-center justify-center rounded-xl transition-all duration-300 group-hover:scale-105 shadow-lg border border-white/20 overflow-hidden shrink-0 w-10 h-10"
        >
          <div class="absolute inset-0 bg-gradient-to-br from-[var(--primary-color)] to-[var(--accent-color)] opacity-90"></div>
          <img 
            v-if="processedIcon" 
            :src="processedIcon" 
            :alt="name" 
            class="relative z-10 object-contain drop-shadow-sm w-5 h-5"
          >
          <span v-else class="relative z-10 text-white font-bold text-base shadow-black/20 drop-shadow-md">
            {{ initialLetter }}
          </span>
        </div>

        <!-- 标题 -->
        <h3 
          class="font-bold leading-tight bg-clip-text text-transparent bg-gradient-to-br from-gray-900 to-gray-600 dark:from-gray-100 dark:to-gray-400 group-hover:from-[var(--primary-color)] group-hover:to-[var(--accent-color)] transition-all duration-300"
          :class="titleClasses"
          :title="name"
        >
          {{ name }}
        </h3>
      </header>

      <!-- 2. 描述区域 (中卡和大卡显示) -->
      <!-- 
         关键修复：
         1. flex-1: 占据剩余所有空间。
         2. min-h-0: 允许 flex 子项高度小于内容高度 (防止溢出)。
         3. py-2: 给上下留出呼吸空间。
      -->
      <div v-if="!isSmall" class="flex-1 min-h-0 py-2 flex flex-col justify-start">
        <p 
          class="text-sm text-gray-500 dark:text-gray-400 leading-relaxed" 
          :class="isMedium ? 'line-clamp-2' : 'line-clamp-2 md:line-clamp-3'"
          :title="description"
        >
          {{ description }}
        </p>
      </div>

      <!-- 垫片：小卡片不需要描述，用来占位 -->
      <div v-else class="flex-grow"></div>
      
      <!-- 3. 标签区域 -->
      <!-- shrink-0 确保标签区域高度固定，不会被压缩 -->
      <div 
        v-if="hasTags && !isSmall" 
        class="shrink-0 pt-1 flex flex-wrap gap-2 items-center relative z-20"
      >
        <span 
          v-for="(tag, index) in displayTags" 
          :key="`tag-${index}`" 
          class="px-2 py-0.5 text-[10px] md:text-xs font-semibold rounded-full border border-[var(--primary-color)]/20 text-[var(--primary-color)] bg-[var(--primary-color)]/5 backdrop-blur-md whitespace-nowrap"
        >
          {{ tag }}
        </span>
        <span v-if="remainingTagsCount > 0" class="px-2 py-0.5 text-[10px] md:text-xs font-medium rounded-full text-gray-400 bg-gray-500/5 border border-gray-500/10">
          +{{ remainingTagsCount }}
        </span>
      </div>
    </div>
    
    <!-- 边框高光 -->
    <div class="absolute inset-0 border border-transparent hero-border-gradient opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none rounded-3xl"></div>
  </article>
</template>

<script setup lang="ts">
import { computed } from 'vue';

interface Props {
  name: string;
  description?: string;
  icon?: string | null;
  tags?: string[];
  url?: string;
  delay?: string;
  size?: 'small' | 'medium' | 'large';
}

const props = withDefaults(defineProps<Props>(), {
  description: '',
  icon: null,
  tags: () => [],
  url: '',
  delay: '0s',
  size: 'large'
});

const isSmall = computed(() => props.size === 'small');
const isMedium = computed(() => props.size === 'medium');
const processedIcon = computed(() => props.icon?.trim());
const initialLetter = computed(() => props.name.charAt(0).toUpperCase());
const hasTags = computed(() => props.tags && props.tags.length > 0);
const displayTags = computed(() => props.tags.slice(0, 3)); 
const remainingTagsCount = computed(() => Math.max(0, props.tags.length - 3));

// 核心修改：只有 Small 模式才显示 Icon，大/中 均不显示
const showIcon = computed(() => isSmall.value);

const handleNavigation = () => {
  if (!props.url) return;
  window.open(props.url, '_blank', 'noopener,noreferrer');
};

/* --- 样式计算 --- */

const containerClasses = computed(() => ({
  'h-[72px]': isSmall.value,
  // 修改：增加中卡高度到 200px，确保容纳 标题(2行)+描述(2行)+标签+Padding
  'h-[200px]': isMedium.value,         
  'h-full min-h-[240px]': !isSmall.value && !isMedium.value,
  'hero-fade-in': true
}));

const contentPaddingClasses = computed(() => isSmall.value 
  ? 'p-3 pr-4' 
  : 'p-5' // 统一中大卡片的 Padding，减少上下 padding 给内容留空间
);

const headerClasses = computed(() => {
  if (isSmall.value) {
    return 'flex items-center gap-3 w-full'; // 小卡：横向
  } else {
    // 中/大卡：垂直布局，无图标
    return 'flex flex-col items-start w-full gap-1'; 
  }
});

const titleClasses = computed(() => {
  const base = 'line-clamp-2 w-full break-words'; 
  
  if (isSmall.value) {
    return `${base} text-sm font-semibold text-left`;
  } else if (isMedium.value) {
    // 中卡
    return `${base} text-lg font-bold tracking-tight`; 
  } else {
    // 大卡
    return `${base} text-2xl font-bold tracking-tight`;
  }
});
</script>

<style scoped>
/* 保持原有样式，仅精简 */
.hero-card {
  backdrop-filter: blur(40px) saturate(180%);
  background: 
    linear-gradient(145deg, rgba(255, 255, 255, 0.4) 0%, rgba(255, 255, 255, 0.1) 100%),
    linear-gradient(to bottom right, rgba(var(--primary-color-rgb), 0.05), transparent);
  border-color: rgba(255, 255, 255, 0.5);
  box-shadow: 0 4px 30px rgba(0, 0, 0, 0.05);
  will-change: transform;
  transform: translateZ(0); 
}

:global(.dark) .hero-card {
  background: 
    linear-gradient(145deg, rgba(30, 41, 59, 0.7) 0%, rgba(15, 23, 42, 0.5) 100%);
  border-color: rgba(255, 255, 255, 0.05);
  box-shadow: 0 4px 30px rgba(0, 0, 0, 0.2);
}

.hero-card:hover {
  transform: translateY(-4px);
  border-color: rgba(var(--primary-color-rgb), 0.4);
  box-shadow: 0 10px 40px -10px rgba(var(--primary-color-rgb), 0.15);
}

.hero-border-gradient {
  background: linear-gradient(135deg, rgba(var(--primary-color-rgb), 0.6), rgba(var(--accent-color-rgb), 0.3));
  -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
  mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
  -webkit-mask-composite: xor;
  mask-composite: exclude;
}

.hero-fade-in {
  animation: heroFadeInUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) backwards;
}

@keyframes heroFadeInUp {
  from { opacity: 0; transform: translateY(15px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>