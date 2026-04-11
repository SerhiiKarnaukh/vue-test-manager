import { computed } from 'vue'

/**
 * Stable :error-messages arrays for Vuetify + Vuelidate (inline .map() on $errors
 * creates a new array each render and can cause "Maximum recursive updates" with VForm).
 *
 * @param {import('vue').Ref} v$ - return value of useVuelidate()
 * @param {string[]} fieldKeys - keys matching rules/state fields
 * @returns {Record<string, import('vue').ComputedRef<string[]>>} e.g. { emailErrors, passwordErrors }
 */
export function useVuelidateErrorMessages(v$, fieldKeys) {
  const out = {}
  for (const key of fieldKeys) {
    out[`${key}Errors`] = computed(() => {
      const field = v$.value[key]
      if (!field?.$errors?.length) {
        return []
      }
      return field.$errors.map((e) => e.$message)
    })
  }
  return out
}
