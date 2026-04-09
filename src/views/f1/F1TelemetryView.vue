<template>
  <div class="f1-telemetry-view">
    <div v-if="!activeSession" class="f1-telemetry-view__empty">
      Select a session in the top bar to start telemetry streaming.
    </div>
    <TelemetryDashboard v-else />
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useStore } from 'vuex'
import TelemetryDashboard from '@/components/f1/telemetry/TelemetryDashboard.vue'

const store = useStore()
const activeSession = computed(() => store.state.f1Data.sessions.activeSession)
</script>

<style lang="scss" scoped>
@use '@/styles/f1/variables' as *;

.f1-telemetry-view {
  &__empty {
    color: $f1-text-secondary;
  }
}
</style>
