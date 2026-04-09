import { computed, watch } from 'vue'
import { useStore } from 'vuex'

export function useTelemetry() {
  const store = useStore()
  const status = computed(() => store.state.f1Data.websocket.telemetryStatus)
  const selectedDrivers = computed(() => store.state.f1Data.telemetry.selectedDrivers)
  const latestData = computed(() => store.state.f1Data.telemetry.latestData)
  const chartBuffers = computed(() => store.state.f1Data.telemetry.chartBuffers)

  const chartData = computed(() => ({
    labels: buildLabels(),
    speed: buildSeries('speed'),
    rpm: buildSeries('rpm'),
    throttle: buildSeries('throttle'),
    brake: buildSeries('brake')
  }))

  watch(
    () => store.getters['f1Data/sessions/activeSessionKey'],
    () => {
      store.commit('f1Data/telemetry/CLEAR_BUFFERS')
    }
  )

  function subscribe(driverNumbers) {
    store.dispatch('f1Data/telemetry/selectDrivers', driverNumbers)
  }

  function unsubscribe() {
    store.dispatch('f1Data/telemetry/clearDrivers')
  }

  function replay(lapNumber) {
    store.dispatch('f1Data/telemetry/requestReplay', lapNumber)
  }

  function buildLabels() {
    const maxPoints = getMaxPoints()
    return Array.from({ length: maxPoints }, (_, idx) => idx + 1)
  }

  function buildSeries(field) {
    return selectedDrivers.value.map((driverNumber) => {
      const points = chartBuffers.value[driverNumber]?.[field] ?? []
      return { driverNumber, points }
    })
  }

  function getMaxPoints() {
    return Object.values(chartBuffers.value).reduce((max, driverBuffers) => {
      const speedLen = driverBuffers?.speed?.length ?? 0
      return Math.max(max, speedLen)
    }, 0)
  }

  return { status, selectedDrivers, latestData, chartData, subscribe, unsubscribe, replay }
}
