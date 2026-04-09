<template>
  <span class="compound-badge" :style="badgeStyle">{{ label }}</span>
</template>

<script setup>
import { computed } from 'vue'
import { getCompoundColor, getCompoundLabel } from '@/utils/f1/compoundColors'

const props = defineProps({
  compound: {
    type: String,
    default: null
  }
})

const label = computed(() => (props.compound ? getCompoundLabel(props.compound) : '--'))
const badgeStyle = computed(() => ({
  color: props.compound === 'HARD' ? '#0D1117' : '#E6EDF3',
  backgroundColor: props.compound ? getCompoundColor(props.compound) : '#30363D'
}))
</script>

<style lang="scss" scoped>
@use '@/styles/f1/variables' as *;

.compound-badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 20px;
  height: 18px;
  border-radius: $f1-radius-sm;
  padding: 0 6px;
  font-family: $f1-font-mono;
  font-size: 10px;
  font-weight: 700;
}
</style>
