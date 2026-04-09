<template>
  <div class="timing-tower">
    <div class="timing-tower__header">
      <span>Pos</span>
      <span>Driver</span>
      <span>Gap</span>
      <span>Int</span>
      <span>Last</span>
      <span>Best</span>
      <span>Tire</span>
      <span>Stops</span>
    </div>

    <TimingTowerRow
      v-for="row in rows"
      :key="row.driverNumber"
      :row="row"
      :selected="selectedDrivers.includes(row.driverNumber)"
      @select="$emit('select-driver', $event)"
    />

    <div v-if="rows.length === 0" class="timing-tower__empty">
      No lap data for this session yet.
    </div>
  </div>
</template>

<script setup>
import TimingTowerRow from '@/components/f1/timing/TimingTowerRow.vue'

defineProps({
  rows: {
    type: Array,
    default: () => []
  },
  selectedDrivers: {
    type: Array,
    default: () => []
  }
})

defineEmits(['select-driver'])
</script>

<style lang="scss" scoped>
@use '@/styles/f1/variables' as *;
@use '@/styles/f1/timing-tower';

.timing-tower {
  &__header {
    grid-template-columns: 42px minmax(180px, 1.5fr) 1fr 1fr 1fr 1fr 64px 42px;
    gap: $f1-spacing-sm;
  }

  &__empty {
    padding: $f1-spacing-md;
    color: $f1-text-secondary;
    font-size: 12px;
  }
}
</style>
