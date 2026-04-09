<template>
  <div class="lap-time-comparison">
    <div class="lap-time-comparison__title">Lap Delta Comparison</div>

    <div v-if="comparisonRows.length < 2" class="lap-time-comparison__empty">
      Select at least 2 drivers in the timing tower.
    </div>

    <div v-else class="lap-time-comparison__rows">
      <div v-for="entry in comparisonRows" :key="entry.driverNumber" class="lap-time-comparison__row">
        <span>#{{ entry.driverNumber }} {{ entry.shortName }}</span>
        <span>{{ entry.bestLap }}</span>
        <span :class="{ 'lap-time-comparison__delta--leader': entry.deltaRaw === 0 }">
          {{ entry.delta }}
        </span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { formatGap } from '@/utils/f1/formatters'

const props = defineProps({
  rows: {
    type: Array,
    default: () => []
  },
  selectedDrivers: {
    type: Array,
    default: () => []
  }
})

const comparisonRows = computed(() => {
  const selected = props.rows.filter((row) => props.selectedDrivers.includes(row.driverNumber))
  if (selected.length < 2) return []
  const leader = selected[0]
  return selected.map((row) => {
    const deltaRaw = row.bestLapSeconds - leader.bestLapSeconds
    return {
      ...row,
      deltaRaw,
      delta: formatGap(deltaRaw)
    }
  })
})
</script>

<style lang="scss" scoped>
@use '@/styles/f1/variables' as *;

.lap-time-comparison {
  background: $f1-bg-secondary;
  border: 1px solid $f1-border;
  border-radius: $f1-radius-md;
  padding: $f1-spacing-md;
  font-family: $f1-font-mono;

  &__title {
    color: $f1-text-primary;
    margin-bottom: $f1-spacing-sm;
    font-weight: 600;
  }

  &__empty {
    color: $f1-text-secondary;
    font-size: 12px;
  }

  &__rows {
    display: grid;
    gap: $f1-spacing-xs;
  }

  &__row {
    display: grid;
    grid-template-columns: 1fr auto auto;
    gap: $f1-spacing-sm;
    font-size: 12px;
    color: $f1-text-primary;
  }

  &__delta--leader {
    color: $f1-success;
  }
}
</style>
