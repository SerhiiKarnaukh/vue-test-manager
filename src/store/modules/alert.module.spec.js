import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import alertModule from './alert.module'

describe('alert module', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('setMessage commits message then clears after timeout', () => {
    const commit = vi.fn()
    const state = alertModule.state()

    alertModule.actions.setMessage({ commit }, {
      value: ['Saved'],
      type: 'success',
    })

    expect(commit).toHaveBeenCalledWith('setMessage', {
      value: ['Saved'],
      type: 'success',
    })

    vi.advanceTimersByTime(5000)

    expect(commit).toHaveBeenCalledWith('clearMessage')
  })

  it('clearMessage mutation resets message', () => {
    const state = alertModule.state()
    alertModule.mutations.setMessage(state, { value: ['Hi'], type: 'info' })
    alertModule.mutations.clearMessage(state)
    expect(state.message).toBeNull()
  })
})
