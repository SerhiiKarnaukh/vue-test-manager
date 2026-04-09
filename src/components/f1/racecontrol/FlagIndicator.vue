<template>
  <div class="flag-indicator">
    <v-chip
      :color="chipColor"
      :style="chipStyle"
      variant="flat"
      size="small"
      class="flag-indicator__chip"
    >
      <v-icon start size="12">mdi-flag</v-icon>
      {{ label }}
    </v-chip>
    <v-chip v-if="isSafetyCar" color="warning" variant="outlined" size="small">
      SAFETY CAR
    </v-chip>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { FLAG_LABELS } from '@/utils/f1/flagColors'

const props = defineProps({
  flag: {
    type: String,
    default: 'GREEN'
  },
  color: {
    type: String,
    default: '#3FB950'
  },
  isSafetyCar: {
    type: Boolean,
    default: false
  }
})

const label = computed(() => FLAG_LABELS[props.flag] || props.flag)
const chipColor = computed(() => props.color)
const chipStyle = computed(() => ({
  color: resolveTextColor(props.color)
}))

function resolveTextColor(backgroundColor) {
  const hex = normalizeHexColor(backgroundColor)
  if (!hex) return '#E6EDF3'
  return isLightColor(hex) ? '#111111' : '#E6EDF3'
}

function normalizeHexColor(value) {
  if (typeof value !== 'string') return null
  const color = value.trim()
  if (!color.startsWith('#')) return null
  if (color.length === 4) {
    return `#${color[1]}${color[1]}${color[2]}${color[2]}${color[3]}${color[3]}`
  }
  if (color.length === 7) return color
  return null
}

function isLightColor(hex) {
  const red = Number.parseInt(hex.slice(1, 3), 16)
  const green = Number.parseInt(hex.slice(3, 5), 16)
  const blue = Number.parseInt(hex.slice(5, 7), 16)
  // Relative luminance approximation.
  const luminance = 0.299 * red + 0.587 * green + 0.114 * blue
  return luminance > 186
}
</script>

<style lang="scss" scoped>
@use '@/styles/f1/variables' as *;

.flag-indicator {
  display: flex;
  align-items: center;
  gap: $f1-spacing-sm;

  &__chip {
    color: $f1-text-primary;
  }
}
</style>
