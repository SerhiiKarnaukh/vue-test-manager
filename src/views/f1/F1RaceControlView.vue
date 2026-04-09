<template>
  <div class="f1-race-control-view">
    <div v-if="!activeSession" class="f1-race-control-view__empty">
      Select a session to view race control feed.
    </div>

    <template v-else>
      <v-alert
        v-if="loadError"
        type="warning"
        variant="tonal"
        density="compact"
        class="f1-race-control-view__alert"
      >
        {{ loadError }}
      </v-alert>
      <FlagIndicator :flag="currentFlag" :color="flagColor" :is-safety-car="isSafetyCarActive" />
      <RaceControlFeed :messages="messages" />
    </template>
  </div>
</template>

<script setup>
import { computed, onMounted, watch } from 'vue'
import { useStore } from 'vuex'
import RaceControlFeed from '@/components/f1/racecontrol/RaceControlFeed.vue'
import FlagIndicator from '@/components/f1/racecontrol/FlagIndicator.vue'

const store = useStore()

const activeSession = computed(() => store.state.f1Data.sessions.activeSession)
const sessionKey = computed(() => store.getters['f1Data/sessions/activeSessionKey'])
const messages = computed(() => store.getters['f1Data/raceControl/latestMessages'])
const currentFlag = computed(() => store.state.f1Data.raceControl.currentFlag)
const flagColor = computed(() => store.getters['f1Data/raceControl/flagColor'])
const isSafetyCarActive = computed(() => store.state.f1Data.raceControl.isSafetyCarActive)
const raceControlStatus = computed(() => store.state.f1Data.websocket.raceControlStatus)
const loadError = computed(() => store.state.f1Data.raceControl.loadError)

onMounted(() => {
  initializeRaceControl(sessionKey.value)
})

watch(sessionKey, (nextSessionKey) => {
  initializeRaceControl(nextSessionKey)
})

function initializeRaceControl(nextSessionKey) {
  if (!nextSessionKey) return
  store.dispatch('f1Data/raceControl/fetchMessages', nextSessionKey)
  store.dispatch('f1Data/raceControl/fetchCurrentFlag', nextSessionKey)
  if (raceControlStatus.value !== 'connected') {
    store.dispatch('f1Data/websocket/connectRaceControl')
  }
}
</script>

<style lang="scss" scoped>
@use '@/styles/f1/variables' as *;

.f1-race-control-view {
  display: grid;
  gap: $f1-spacing-md;

  &__empty {
    color: $f1-text-secondary;
  }

  &__alert {
    margin-bottom: 0;
  }
}
</style>
