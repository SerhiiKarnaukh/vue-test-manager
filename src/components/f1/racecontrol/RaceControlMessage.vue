<template>
  <div class="race-control-message" :style="messageStyle">
    <div class="race-control-message__meta">
      <span>{{ timestamp }}</span>
      <span class="race-control-message__category">{{ category }}</span>
      <span v-if="driverLabel">{{ driverLabel }}</span>
      <span v-if="lapLabel">{{ lapLabel }}</span>
    </div>
    <div class="race-control-message__text">{{ text }}</div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { formatTimestamp } from '@/utils/f1/formatters'
import { getFlagColor } from '@/utils/f1/flagColors'

const props = defineProps({
  message: {
    type: Object,
    required: true
  }
})

const timestamp = computed(() => formatTimestamp(props.message.timestamp))
const text = computed(() => props.message.message || 'No message')
const category = computed(() => props.message.category || 'Info')
const driverLabel = computed(() => {
  const driver = props.message.driver_number ?? props.message.driver
  return driver != null ? `#${driver}` : ''
})
const lapLabel = computed(() => {
  const lap = props.message.lap_number ?? props.message.lap
  return lap != null ? `Lap ${lap}` : ''
})

const messageStyle = computed(() => {
  if (!props.message.flag) return {}
  return {
    borderLeft: `3px solid ${getFlagColor(props.message.flag)}`
  }
})
</script>

<style lang="scss" scoped>
@use '@/styles/f1/variables' as *;

.race-control-message {
  background: $f1-bg-secondary;
  border: 1px solid $f1-border;
  border-radius: $f1-radius-sm;
  padding: $f1-spacing-sm;

  &__meta {
    display: flex;
    flex-wrap: wrap;
    gap: $f1-spacing-sm;
    color: $f1-text-secondary;
    font-family: $f1-font-mono;
    font-size: 11px;
    margin-bottom: 4px;
  }

  &__category {
    color: $f1-accent;
  }

  &__text {
    color: $f1-text-primary;
    font-size: 13px;
    line-height: 1.35;
  }
}
</style>
