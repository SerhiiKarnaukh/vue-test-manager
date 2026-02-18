import { ref, computed } from 'vue'

export function useStrategy() {
  const strategies = ref([])
  const isLoading = ref(false)
  const bestStrategy = computed(() => strategies.value.length ? strategies.value[0] : null)

  async function calculate(input) { /* TODO: implement */ }

  return { strategies, isLoading, bestStrategy, calculate }
}
