import { ref, computed } from 'vue'

export function useRaceControl() {
  const messages = ref([])
  const currentFlag = computed(() => {
    const flagMsg = messages.value.find((m) => m.flag)
    return flagMsg?.flag ?? 'GREEN'
  })
  const isSafetyCar = computed(() =>
    messages.value.some((m) => m.category === 'SafetyCar' && !m.message?.includes('ENDING'))
  )

  return { messages, currentFlag, isSafetyCar }
}
