<template>
  <div class="connection-status">
    <v-icon :color="dotColor" size="10">mdi-circle</v-icon>
    <span class="connection-status__label">{{ label }}</span>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { WS_STATUS } from '@/constants/f1'

const props = defineProps({
  status: {
    type: String,
    default: WS_STATUS.DISCONNECTED
  }
})

const label = computed(() => {
  if (props.status === WS_STATUS.CONNECTED) return 'Connected'
  if (props.status === WS_STATUS.CONNECTING) return 'Connecting...'
  if (props.status === WS_STATUS.ERROR) return 'Error'
  return 'Disconnected'
})

const dotColor = computed(() => {
  if (props.status === WS_STATUS.CONNECTED) return 'success'
  if (props.status === WS_STATUS.CONNECTING) return 'warning'
  return 'error'
})
</script>

<style lang="scss" scoped>
@use '@/styles/f1/variables' as *;

.connection-status {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  color: $f1-text-secondary;
  font-size: 12px;

  &__label {
    font-family: $f1-font-mono;
  }
}
</style>
