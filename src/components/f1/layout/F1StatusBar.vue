<template>
  <v-footer app class="f1-statusbar" :height="28">
    <div class="f1-statusbar__content">
      <div class="f1-statusbar__left">
        <span class="f1-statusbar__indicator">
          <v-icon
            :color="telemetryConnected ? 'success' : 'error'"
            size="8"
          >
            mdi-circle
          </v-icon>
          <span class="f1-statusbar__label">Telemetry</span>
        </span>

        <span class="f1-statusbar__indicator">
          <v-icon
            :color="raceControlConnected ? 'success' : 'error'"
            size="8"
          >
            mdi-circle
          </v-icon>
          <span class="f1-statusbar__label">Race Control</span>
        </span>

        <span v-if="dataRate > 0" class="f1-statusbar__rate">
          {{ dataRate }} msg/s
        </span>
      </div>

      <div class="f1-statusbar__center">
        <span v-if="activeSession" class="f1-statusbar__session">
          {{ activeSession.circuit_short_name || activeSession.circuit_name }}
          &mdash;
          {{ activeSession.session_name }}
        </span>
      </div>

      <div class="f1-statusbar__right">
        <span v-if="currentFlag !== 'GREEN'" class="f1-statusbar__flag">
          <v-icon :color="flagColor" size="10">mdi-flag</v-icon>
          {{ currentFlag }}
        </span>
        <span v-if="lastTimestamp" class="f1-statusbar__timestamp">
          Last: {{ lastTimestamp }}
        </span>
      </div>
    </div>
  </v-footer>
</template>

<script setup>
import { computed } from 'vue'
import { useStore } from 'vuex'
import { formatTimestamp } from '@/utils/f1/formatters'

const store = useStore()

const telemetryConnected = computed(
  () => store.getters['f1Data/websocket/isTelemetryConnected']
)
const raceControlConnected = computed(
  () => store.getters['f1Data/websocket/isRaceControlConnected']
)
const dataRate = computed(() => store.state.f1Data.websocket.dataRate)
const activeSession = computed(() => store.state.f1Data.sessions.activeSession)
const currentFlag = computed(() => store.state.f1Data.raceControl.currentFlag)
const flagColor = computed(() => store.getters['f1Data/raceControl/flagColor'])
const lastTimestamp = computed(() => {
  const ts = store.state.f1Data.websocket.lastMessageTimestamp
  return ts ? formatTimestamp(ts) : null
})
</script>

<style lang="scss" scoped>
.f1-statusbar {
  border-top: 1px solid #30363d !important;
  background-color: #161b22 !important;
  padding: 0 12px !important;
  font-family: 'Roboto Mono', monospace;
  font-size: 11px;
  color: #8b949e;

  &__content {
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;
  }

  &__left,
  &__center,
  &__right {
    display: flex;
    align-items: center;
    gap: 12px;
  }

  &__indicator {
    display: flex;
    align-items: center;
    gap: 4px;
  }

  &__label {
    font-size: 10px;
  }

  &__rate {
    color: #58a6ff;
    font-size: 10px;
  }

  &__session {
    color: #e6edf3;
    font-size: 11px;
  }

  &__flag {
    display: flex;
    align-items: center;
    gap: 4px;
    font-size: 10px;
    text-transform: uppercase;
  }

  &__timestamp {
    font-size: 10px;
  }
}
</style>
