import { describe, expect, it } from 'vitest'
import { error } from './error'

describe('error', () => {
  it('flattens validation error object values into one array', () => {
    const result = error({
      email: ['Invalid email'],
      password: ['Too short', 'Required'],
    })

    expect(result).toEqual(['Invalid email', 'Too short', 'Required'])
  })

  it('returns empty array for empty object', () => {
    expect(error({})).toEqual([])
  })
})
