<template>
  <!-- HeroUI 标签筛选区域 -->
  <div class="navigation-tags flex flex-wrap justify-center gap-2 p-4 glass-effect rounded-2xl shadow-lg fade-in-up relative overflow-hidden">
    <!-- 装饰性背景光效 -->
    <div class="absolute top-0 left-1/4 w-20 h-20 bg-gradient-to-br from-indigo-400/10 to-transparent rounded-full blur-xl"></div>
    <div class="absolute bottom-0 right-1/4 w-16 h-16 bg-gradient-to-tl from-purple-400/10 to-transparent rounded-full blur-xl"></div>
    <FilterTag
      v-for="tag in availableTags"
      :key="tag.name"
      :tag-name="tag.name"
      :tag-color="tag.color"
      :is-selected="selectedTags.includes(tag.name)"
      @tag-click="handleTagClick"
    />
  </div>
</template>

<script setup lang="ts">
import FilterTag from './FilterTag.vue';
import { useSettingsStore } from '../store/settings';

// 定义标签数据类型
interface Tag {
  name: string;
  color: string;
}

// 定义组件的props
interface Props {
  availableTags: Tag[];
  selectedTags: string[];
}

const props = defineProps<Props>();

// 定义组件的事件
interface Emits {
  (e: 'tag-click', tagName: string): void;
}

const emit = defineEmits<Emits>();

// 获取设置store
const settingsStore = useSettingsStore();

// 处理标签点击事件
const handleTagClick = (tagName: string): void => {
  // 直接向上传递事件，让父组件处理具体的逻辑
  emit('tag-click', tagName);
};
</script>

<style scoped>
/* 组件特定的样式可以在这里添加 */
</style>