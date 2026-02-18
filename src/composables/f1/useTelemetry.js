import { ref, computed } from 'vue'

export function useTelemetry() {
  const status = ref('disconnected')
  const latestData = computed(() => ({}))
  const chartData = computed(() => ({}))

  function subscribe(driverNumbers) { /* TODO: implement */ }
  function unsubscribe() { /* TODO: implement */ }
  function replay(lapNumber) { /* TODO: implement */ }

  return { status, latestData, chartData, subscribe, unsubscribe, replay }
}
