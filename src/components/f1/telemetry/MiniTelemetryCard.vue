<template>
  <div class="mini-telemetry-card">
    <div class="mini-telemetry-card__header">
      <div>
        <div class="mini-telemetry-card__title">
          #{{ driver?.driver_number || driverNumber }}
          {{ driver?.acronym || driver?.last_name || 'Driver' }}
        </div>
        <div class="mini-telemetry-card__team">{{ driver?.team_name || 'Unknown team' }}</div>
      </div>
      <div class="mini-telemetry-card__badges">
        <v-chip
          v-if="isFallback"
          size="x-small"
          variant="tonal"
          color="warning"
          class="mini-telemetry-card__fallback-chip"
        >
          Limited
        </v-chip>
        <DrsIndicator :drs="data?.drs" />
      </div>
    </div>

    <div class="mini-telemetry-card__grid">
      <div class="mini-telemetry-card__metric">
        <span class="mini-telemetry-card__label">Speed</span>
        <span class="mini-telemetry-card__value">{{ valueOrDash(data?.speed) }} km/h</span>
      </div>
      <div class="mini-telemetry-card__metric">
        <span class="mini-telemetry-card__label">RPM</span>
        <span class="mini-telemetry-card__value">{{ valueOrDash(data?.rpm) }}</span>
      </div>
      <div class="mini-telemetry-card__metric">
        <span class="mini-telemetry-card__label">Throttle</span>
        <span class="mini-telemetry-card__value">{{ valueOrDash(data?.throttle) }}%</span>
      </div>
      <div class="mini-telemetry-card__metric">
        <span class="mini-telemetry-card__label">Brake</span>
        <span class="mini-telemetry-card__value">{{ valueOrDash(data?.brake) }}%</span>
      </div>
      <div class="mini-telemetry-card__metric">
        <span class="mini-telemetry-card__label">Gear</span>
        <span class="mini-telemetry-card__value">{{ valueOrDash(data?.n_gear ?? data?.gear) }}</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import DrsIndicator from '@/components/f1/telemetry/DrsIndicator.vue'

const props = defineProps({
  driverNumber: {
    type: Number,
    required: true
  },
  driver: {
    type: Object,
    default: null
  },
  data: {
    type: Object,
    default: null
  }
})

const isFallback = computed(() => {
  return props.data?.is_fallback === true || props.data?.data_source === 'fallback_lap_speed_trap'
})

function valueOrDash(value) {
  return value == null ? '---' : value
}
</script>

<style lang="scss" scoped>
@use '@/styles/f1/variables' as *;

.mini-telemetry-card {
  background: $f1-bg-secondary;
  border: 1px solid $f1-border;
  border-radius: $f1-radius-md;
  padding: $f1-spacing-md;

  &__header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: $f1-spacing-sm;
  }

  &__badges {
    display: inline-flex;
    align-items: center;
    gap: 6px;
  }

  &__title {
    color: $f1-text-primary;
    font-weight: 600;
  }

  &__team {
    color: $f1-text-secondary;
    font-size: 12px;
  }

  &__grid {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: $f1-spacing-sm;
  }

  &__metric {
    display: flex;
    flex-direction: column;
  }

  &__label {
    color: $f1-text-secondary;
    font-size: 11px;
    margin-bottom: 2px;
  }

  &__value {
    color: $f1-text-primary;
    font-family: $f1-font-mono;
    font-size: 13px;
  }

  &__fallback-chip {
    font-size: 10px;
  }
}
</style>
