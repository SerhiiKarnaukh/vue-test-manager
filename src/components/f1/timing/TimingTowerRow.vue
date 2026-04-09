<template>
  <div
    class="timing-tower-row"
    :class="{ 'timing-tower-row--selected': selected }"
    @click="$emit('select', row.driverNumber)"
  >
    <span>{{ row.position }}</span>
    <span class="timing-tower-row__driver">
      <TeamColorDot :color="row.teamColor" :size="8" />
      #{{ row.driverNumber }} {{ row.shortName }}
    </span>
    <span>{{ row.gap }}</span>
    <span>{{ row.interval }}</span>
    <span>{{ row.lastLap }}</span>
    <span>{{ row.bestLap }}</span>
    <span><CompoundBadge :compound="row.compound" /></span>
    <span>{{ row.stops }}</span>
  </div>
</template>

<script setup>
import TeamColorDot from '@/components/f1/common/TeamColorDot.vue'
import CompoundBadge from '@/components/f1/common/CompoundBadge.vue'

defineProps({
  row: {
    type: Object,
    required: true
  },
  selected: {
    type: Boolean,
    default: false
  }
})

defineEmits(['select'])
</script>

<style lang="scss" scoped>
@use '@/styles/f1/variables' as *;

.timing-tower-row {
  display: grid;
  grid-template-columns: 42px minmax(180px, 1.5fr) 1fr 1fr 1fr 1fr 64px 42px;
  gap: $f1-spacing-sm;
  align-items: center;
  padding: $f1-spacing-xs $f1-spacing-md;
  border-bottom: 1px solid $f1-border;
  color: $f1-text-primary;
  font-family: $f1-font-mono;
  font-size: 12px;
  cursor: pointer;

  &:hover {
    background: $f1-bg-tertiary;
  }

  &--selected {
    background: rgba($f1-accent, 0.12);
  }

  &__driver {
    display: inline-flex;
    align-items: center;
    gap: 6px;
  }
}
</style>
