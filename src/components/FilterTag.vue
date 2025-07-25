<template>
  <span
    @click="$emit('tag-click', tagName)"
    :class="['tag', tagVariant, { 'cursor-pointer transition-colors duration-300 hover:shadow-md': true }]"
    :style="tagStyle"
  >
    {{ tagName }}
  </span>
</template>

<script setup>
import { computed } from 'vue';
import Color from 'colorjs.io';

const props = defineProps({
  tagName: {
    type: String,
    required: true
  },
  tagColor: { // e.g., 'blue', 'red' etc. or a hex code
    type: String,
    required: true
  },
  isSelected: {
    type: Boolean,
    default: false
  }
});

// Emit the tag click event
defineEmits(['tag-click']);

const tagVariant = computed(() => {
  // 根据颜色属性选择合适的标签变体
  if (props.tagColor === 'primary' || props.tagColor === 'blue') {
    return props.isSelected ? 'tag-primary' : 'tag-default';
  } else if (props.tagColor === 'danger' || props.tagColor === 'red') {
    return 'tag-danger';
  } else {
    return 'tag-default';
  }
});

// 动态计算标签样式以支持自定义颜色
const tagStyle = computed(() => {
  // 如果是预定义颜色关键字，则不设置内联样式
  if (['primary', 'blue', 'danger', 'red', 'default'].includes(props.tagColor)) {
    return {};
  }
  
  try {
    // 使用 color.js 解析颜色并设置透明度
    const color = new Color(props.tagColor);
    const alpha = props.isSelected ? 0.7 : 0.3;
    color.alpha = alpha;
    return { backgroundColor: color.toString() };
  } catch (e) {
    // 如果颜色解析失败，回退到原始颜色值
    console.warn(`Invalid color value: ${props.tagColor}`);
    return { backgroundColor: props.tagColor };
  }
});
</script>

<style scoped>
/* 使用 common-styles.css 中定义的通用标签样式 */
</style>