<template>
  <v-app-bar app density="compact" :height="48" flat class="f1-header">
    <v-app-bar-nav-icon size="small" @click="$emit('toggle-sidebar')" />

    <v-toolbar-title class="f1-header__title">
      <v-icon size="small" class="mr-1">mdi-flag-checkered</v-icon>
      <span class="f1-header__logo-text">PIT WALL</span>
    </v-toolbar-title>

    <template #append>
      <div class="f1-header__controls">
        <v-menu open-on-hover>
          <template #activator="{ props }">
            <v-btn
              v-bind="props"
              variant="text"
              size="small"
              prepend-icon="mdi-remote-desktop"
            >
              Apps Manager
            </v-btn>
          </template>
          <v-list density="compact">
            <v-list-item :href="remoteHost" title="All Apps" />
            <v-list-item to="/" title="Vue Apps" />
          </v-list>
        </v-menu>

        <v-select
          v-model="selectedYear"
          :items="availableYears"
          density="compact"
          variant="outlined"
          hide-details
          class="f1-header__year-select"
          @update:model-value="onYearChange"
        />

        <v-select
          v-model="selectedType"
          :items="sessionTypeOptions"
          item-title="label"
          item-value="value"
          density="compact"
          variant="outlined"
          hide-details
          clearable
          placeholder="All types"
          class="f1-header__type-select"
          @update:model-value="onTypeChange"
        />

        <v-autocomplete
          v-model="activeSessionKey"
          :items="sessionItems"
          item-title="label"
          item-value="session_key"
          density="compact"
          variant="outlined"
          hide-details
          clearable
          placeholder="Select session..."
          class="f1-header__session-select"
          @update:model-value="onSessionSelect"
        />

        <v-btn
          variant="text"
          size="small"
          prepend-icon="mdi-filter-remove-outline"
          @click="resetFilters"
        >
          Reset
        </v-btn>

        <v-chip
          v-if="isLiveSession"
          color="error"
          size="small"
          variant="flat"
          class="f1-header__live-badge"
        >
          <v-icon start size="x-small" class="f1-header__live-dot">
            mdi-circle
          </v-icon>
          LIVE
        </v-chip>

        <span class="f1-header__clock">{{ utcClock }}</span>

        <v-btn
          v-if="isAuthenticated"
          variant="text"
          size="small"
          prepend-icon="mdi-logout"
          @click="logout"
        >
          Logout
        </v-btn>
      </div>
    </template>
  </v-app-bar>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { useStore } from 'vuex'

defineEmits(['toggle-sidebar'])

const store = useStore()
const router = useRouter()
const remoteHost = import.meta.env.VITE_REMOTE_HOST

const selectedYear = ref(
  store.state.f1Data.sessions.selectedYear || new Date().getFullYear(),
)
const selectedType = ref(
  store.state.f1Data.sessions.selectedSessionType || null,
)
const utcClock = ref('')
let clockInterval = null

const availableYears = computed(() => {
  const current = new Date().getFullYear()
  return Array.from({ length: current - 2022 }, (_, i) => current - i)
})

const sessionTypeOptions = [
  { label: 'Race', value: 'race' },
  { label: 'Qualifying', value: 'qualifying' },
  { label: 'Sprint', value: 'sprint' },
  { label: 'Practice', value: 'practice' },
]

const sessions = computed(() => store.state.f1Data.sessions.sessions)
const activeSession = computed(() => store.state.f1Data.sessions.activeSession)
const isLiveSession = computed(
  () => store.getters['f1Data/sessions/isLiveSession'],
)
const isAuthenticated = computed(() => store.getters['authJWT/isAuthenticated'])

const activeSessionKey = computed({
  get: () => getSessionKey(activeSession.value),
  set: () => {},
})

const sessionItems = computed(() =>
  sessions.value.map((s) => ({
    session_key: s.session_key,
    label: `${s.circuit_short_name || s.circuit_name} — ${s.session_name}`,
  })),
)

async function onYearChange(year) {
  store.commit('f1Data/sessions/SET_SELECTED_YEAR', year)
  await store.dispatch('f1Data/sessions/selectSession', null)
  store.dispatch('f1Data/sessions/fetchSessions')
}

async function onTypeChange(type) {
  store.commit('f1Data/sessions/SET_SELECTED_SESSION_TYPE', type)
  await store.dispatch('f1Data/sessions/selectSession', null)
  store.dispatch('f1Data/sessions/fetchSessions')
}

function onSessionSelect(sessionKey) {
  if (!sessionKey) {
    store.dispatch('f1Data/sessions/selectSession', null)
    return
  }

  const session = sessions.value.find(
    (s) => String(getSessionKey(s)) === String(sessionKey),
  )
  if (session) {
    store.dispatch('f1Data/sessions/selectSession', session)
  }
}

async function resetFilters() {
  const currentYear = new Date().getFullYear()
  selectedYear.value = currentYear
  selectedType.value = null

  store.commit('f1Data/sessions/SET_SELECTED_YEAR', currentYear)
  store.commit('f1Data/sessions/SET_SELECTED_SESSION_TYPE', null)
  await store.dispatch('f1Data/sessions/selectSession', null)
  store.dispatch('f1Data/sessions/fetchSessions')
}

function updateClock() {
  utcClock.value = new Date().toISOString().slice(11, 19) + ' UTC'
}

function getSessionKey(session) {
  return session?.session_key ?? session?.sessionKey ?? session?.key ?? null
}

async function logout() {
  await store.dispatch('f1Data/websocket/disconnectTelemetry')
  await store.dispatch('f1Data/websocket/disconnectRaceControl')
  await store.dispatch('authJWT/logout')

  store.commit('f1Data/sessions/SET_CURRENT_USER', null)
  store.commit('f1Data/sessions/SET_USER_IS_ADMIN', false)
  store.commit('f1Data/sessions/SET_ACTIVE_SESSION', null)

  router.push('/f1/login')
}

onMounted(() => {
  updateClock()
  clockInterval = setInterval(updateClock, 1000)
})

onUnmounted(() => {
  clearInterval(clockInterval)
})
</script>

<style lang="scss" scoped>
.f1-header {
  border-bottom: 1px solid #30363d !important;

  &__title {
    flex: none;
    min-width: auto;
  }

  &__logo-text {
    font-family: 'Roboto Mono', monospace;
    font-weight: 700;
    font-size: 14px;
    letter-spacing: 2px;
  }

  &__controls {
    display: flex;
    align-items: center;
    gap: 8px;
  }

  &__year-select {
    max-width: 100px;
  }

  &__type-select {
    max-width: 140px;
  }

  &__session-select {
    max-width: 260px;
  }

  &__live-badge {
    animation: f1-pulse 1.5s ease-in-out infinite;
  }

  &__live-dot {
    animation: f1-pulse-dot 1.5s ease-in-out infinite;
  }

  &__clock {
    font-family: 'Roboto Mono', monospace;
    font-size: 12px;
    color: #8b949e;
    min-width: 80px;
    text-align: right;
  }
}

@keyframes f1-pulse {
  0%,
  100% {
    opacity: 1;
  }
  50% {
    opacity: 0.7;
  }
}

@keyframes f1-pulse-dot {
  0%,
  100% {
    opacity: 1;
  }
  50% {
    opacity: 0.3;
  }
}
</style>
