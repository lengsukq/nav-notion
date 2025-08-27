<template>
  <!-- HeroUI 标签筛选区域 -->
  <div class="navigation-tags flex flex-wrap justify-center gap-3 p-6 glass-effect rounded-2xl shadow-lg fade-in-up">
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

<script setup>
import FilterTag from './FilterTag.vue';
import { useSettingsStore } from '../store/settings';

// 定义组件的props
defineProps({
  availableTags: {
    type: Array,
    required: true,
    default: () => []
  },
  selectedTags: {
    type: Array,
    required: true,
    default: () => []
  }
});

// 定义组件的事件
defineEmits(['tag-click']);

// 获取设置store
const settingsStore = useSettingsStore();

// 处理标签点击事件
const handleTagClick = (tagName) => {
  // 直接向上传递事件，让父组件处理具体的逻辑
  emit('tag-click', tagName);
};
</script>

<style scoped>
/* 组件特定的样式可以在这里添加 */
</style>