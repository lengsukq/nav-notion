<template>
  <span
    @click="$emit('tag-click', tagName)"
    :class="tagClasses"
    :style="tagStyles"
  >
    {{ tagName }}
  </span>
</template>

<script setup>
import { computed } from 'vue';
import color from 'color'; // 确保已安装: npm install color

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

const getTransparentColor = (colorValue, alpha) => {
  try {
    return color(colorValue).alpha(alpha).rgb().string();
  } catch (e) {
    console.error(`Invalid color value: ${colorValue}`, e);
    // Fallback for invalid colors
    return alpha === 0.7 ? 'rgba(255, 0, 0, 0.7)' : 'rgba(100, 100, 100, 0.4)';
  }
};

const tagClasses = computed(() => [
  'px-4 py-2 rounded-full text-sm font-medium cursor-pointer transition-colors duration-300 hover:shadow-md',
  props.isSelected
    ? 'text-white' // Selected state text color
    : 'text-gray-800 dark:text-gray-200', // Unselected state text color
]);

const tagStyles = computed(() => {
  const baseStyle = props.isSelected
    ? { backgroundColor: getTransparentColor(props.tagColor, 0.7) }
    : { backgroundColor: getTransparentColor(props.tagColor, 0.4) };

  // If the color is invalid or can't be processed, use a default
  if (!baseStyle.backgroundColor) {
      return props.isSelected
        ? { backgroundColor: 'rgba(59, 130, 246, 0.7)' } // Default blue for selected
        : { backgroundColor: 'rgba(209, 213, 219, 0.4)' }; // Default gray for unselected
  }
  return baseStyle;
});
</script>

<style scoped>
/* Optional: Add specific styles for the tag if needed, or rely on Tailwind */
/* For example, to make the hover effect stronger */
span:hover {
  transform: translateY(-1px);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
}
.dark span:hover {
  box-shadow: 0 2px 8px rgba(255, 255, 255, 0.15);
}
</style>