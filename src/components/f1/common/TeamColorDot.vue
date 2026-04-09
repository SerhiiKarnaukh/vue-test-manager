<template>
  <span class="team-color-dot" :style="dotStyle" />
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  color: {
    type: String,
    default: '#8B949E'
  },
  size: {
    type: Number,
    default: 10
  }
})

const dotStyle = computed(() => ({
  backgroundColor: props.color,
  width: `${props.size}px`,
  height: `${props.size}px`
}))
</script>

<style lang="scss" scoped>
@use '@/styles/f1/variables' as *;

.team-color-dot {
  display: inline-block;
  border-radius: 50%;
  border: 1px solid rgba(255, 255, 255, 0.2);
  flex-shrink: 0;
}
</style>
