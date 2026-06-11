import { describe, expect, it } from 'vitest'
import { ref } from 'vue'
import { useVuelidateErrorMessages } from './useVuelidateErrorMessages'

describe('useVuelidateErrorMessages', () => {
  it('returns empty arrays when field has no errors', () => {
    const v$ = ref({
      email: { $errors: [] },
      password: { $errors: [] },
    })

    const { emailErrors, passwordErrors } = useVuelidateErrorMessages(v$, [
      'email',
      'password',
    ])

    expect(emailErrors.value).toEqual([])
    expect(passwordErrors.value).toEqual([])
  })

  it('maps vuelidate messages for requested fields', () => {
    const v$ = ref({
      email: {
        $errors: [{ $message: 'Email is required' }],
      },
    })

    const { emailErrors } = useVuelidateErrorMessages(v$, ['email'])

    expect(emailErrors.value).toEqual(['Email is required'])
  })

  it('returns empty array when field is missing on v$', () => {
    const v$ = ref({})
    const { emailErrors } = useVuelidateErrorMessages(v$, ['email'])
    expect(emailErrors.value).toEqual([])
  })
})
