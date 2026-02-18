import { ref, computed } from 'vue'

export function useSessionSelector() {
  const sessions = ref([])
  const activeSession = ref(null)
  const isLive = computed(() => activeSession.value?.is_live ?? false)
  const filters = ref({
    year: new Date().getFullYear(),
    sessionType: null
  })

  function selectSession(session) { /* TODO: implement */ }

  return { sessions, activeSession, isLive, filters, selectSession }
}
