<template>
  <span
    @click="$emit('tag-click', tagName)"
    :class="['tag', tagVariant, 'hero-filter-tag', { 'cursor-pointer relative overflow-hidden': true }]"
    :style="tagStyle"
  >
    <!-- HeroUI 内部光效 -->
    <span class="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></span>
    <span class="relative z-10">{{ tagName }}</span>
  </span>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import Color from 'colorjs.io';

// 定义Props接口
interface Props {
  tagName: string;
  tagColor: string;
  isSelected?: boolean;
}

const props = defineProps<Props>();

// 定义Emits接口
interface Emits {
  (e: 'tag-click', tagName: string): void;
}

defineEmits<Emits>();

// 配置：预定义颜色映射，用于消除 magic strings 和重复的列表检查
// Memory: 放在模块顶层作为常量，避免每次组件渲染都重新分配内存
const COLOR_VARIANT_MAP: Record<string, string> = {
  primary: 'tag-primary',
  blue: 'tag-primary',
  indigo: 'tag-primary',
  secondary: 'tag-secondary',
  purple: 'tag-secondary',
  danger: 'tag-danger',
  red: 'tag-danger',
  default: 'tag-default'
};

const tagVariant = computed((): string => {
  // Logic: 优先处理选中状态，否则查表返回对应变体，兜底为 default
  if (props.isSelected) return 'tag-primary-selected';
  return COLOR_VARIANT_MAP[props.tagColor] || 'tag-default';
});

const tagStyle = computed((): Record<string, string> => {
  // DRY: 如果是预定义颜色，由 class 处理样式，不需要内联 style
  if (COLOR_VARIANT_MAP.hasOwnProperty(props.tagColor)) {
    return {};
  }

  // Memory/SRP: 内部辅助函数，仅在当前作用域生效，处理颜色解析逻辑
  // 解决了 try-catch 代码块过大导致逻辑不清晰的问题
  const resolveColorValues = (): { bg: string; border: string | null } => {
    try {
      const color = new Color(props.tagColor);
      const alpha = props.isSelected ? 0.95 : 0.4;
      color.alpha = alpha;
      
      return {
        bg: color.toString(),
        // 只有选中时才需要 hex 格式的边框色
        border: props.isSelected 
          ? new Color(props.tagColor).toString({ format: 'hex' }) 
          : null
      };
    } catch (e) {
      console.warn(`[TagComponent] Invalid color value: ${props.tagColor}`);
      // Fallback strategies
      return { bg: props.tagColor, border: props.tagColor };
    }
  };

  const { bg, border } = resolveColorValues();

  // DRY: 统一构建样式对象，不再分别在 try 和 catch 中重复写两遍样式定义
  const styles: Record<string, string> = {
    backgroundColor: bg,
  };

  if (props.isSelected) {
    Object.assign(styles, {
      color: 'white',
      fontWeight: '700',
      boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.2), 0 4px 6px -2px rgba(0, 0, 0, 0.1)',
      border: `2px solid ${border}`,
      transform: 'scale(1.05)'
    });
  } else {
    Object.assign(styles, {
      backdropFilter: 'blur(15px)', // 统一模糊度，移除原有代码中不一致的 24px/15px 差异
      WebkitBackdropFilter: 'blur(15px)'
    });
  }

  return styles;
});
</script>

<style scoped>
/* HeroUI 使用 common-styles.css 中定义的通用标签样式 */
</style>