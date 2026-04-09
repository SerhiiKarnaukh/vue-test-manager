<template>
  <div class="driver-selector">
    <div class="driver-selector__header">
      <span class="driver-selector__title">Drivers</span>
      <span class="driver-selector__limit">{{ selectedDrivers.length }}/{{ maxDrivers }}</span>
    </div>

    <div class="driver-selector__chips">
      <v-chip
        v-for="driver in drivers"
        :key="driver.driver_number"
        :color="isSelected(driver.driver_number) ? 'primary' : 'default'"
        :variant="isSelected(driver.driver_number) ? 'flat' : 'tonal'"
        size="small"
        class="mr-1 mb-1 driver-selector__chip"
        @click="toggleDriver(driver.driver_number)"
      >
        #{{ driver.driver_number }} {{ driver.acronym || driver.last_name || driver.full_name }}
      </v-chip>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { MAX_SELECTED_DRIVERS } from '@/constants/f1'

const props = defineProps({
  drivers: {
    type: Array,
    default: () => []
  },
  selectedDrivers: {
    type: Array,
    default: () => []
  }
})

const emit = defineEmits(['update:selectedDrivers'])
const maxDrivers = MAX_SELECTED_DRIVERS

const selectedSet = computed(() => new Set(props.selectedDrivers))

function isSelected(driverNumber) {
  return selectedSet.value.has(driverNumber)
}

function toggleDriver(driverNumber) {
  if (isSelected(driverNumber)) {
    emit('update:selectedDrivers', props.selectedDrivers.filter((value) => value !== driverNumber))
    return
  }
  if (props.selectedDrivers.length >= maxDrivers) return
  emit('update:selectedDrivers', [...props.selectedDrivers, driverNumber])
}
</script>

<style lang="scss" scoped>
@use '@/styles/f1/variables' as *;

.driver-selector {
  background: $f1-bg-secondary;
  border: 1px solid $f1-border;
  border-radius: $f1-radius-md;
  padding: $f1-spacing-md;

  &__header {
    display: flex;
    justify-content: space-between;
    margin-bottom: $f1-spacing-sm;
  }

  &__title {
    color: $f1-text-primary;
    font-weight: 600;
  }

  &__limit {
    color: $f1-text-secondary;
    font-family: $f1-font-mono;
    font-size: 12px;
  }

  &__chips {
    display: flex;
    flex-wrap: wrap;
  }

  &__chip {
    color: $f1-text-primary !important;
    border: 1px solid rgba(139, 148, 158, 0.35);
  }
}
</style>
