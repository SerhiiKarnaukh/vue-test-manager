import { beforeEach, describe, expect, it, vi } from 'vitest'
import * as ordersApi from '../api/orders'
import profilesModule from './profiles.module'

vi.mock('../api/orders', () => ({
  fetchUserOrders: vi.fn(),
}))

describe('taberna profiles module', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('getMyOrders commits orders payload', async () => {
    const commit = vi.fn()
    ordersApi.fetchUserOrders.mockResolvedValueOnce({
      data: [{ id: 1, order_number: '100' }],
    })

    await profilesModule.actions.getMyOrders({ commit })

    expect(commit).toHaveBeenCalledWith('setOrdersLoading', true)
    expect(commit).toHaveBeenCalledWith('setOrders', [{ id: 1, order_number: '100' }])
    expect(commit).toHaveBeenCalledWith('setOrdersLoading', false)
  })

  it('getMyOrders logs errors and clears loading', async () => {
    const commit = vi.fn()
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
    ordersApi.fetchUserOrders.mockRejectedValueOnce(new Error('network'))

    await profilesModule.actions.getMyOrders({ commit })

    expect(consoleSpy).toHaveBeenCalled()
    expect(commit).toHaveBeenCalledWith('setOrdersLoading', false)
    expect(commit).not.toHaveBeenCalledWith('setOrders', expect.anything())
    consoleSpy.mockRestore()
  })

  it('exposes profile getters', () => {
    const state = { orders: [{ id: 2 }], ordersLoading: true }

    expect(profilesModule.getters.orders(state)).toEqual([{ id: 2 }])
    expect(profilesModule.getters.ordersLoading(state)).toBe(true)
  })

  it('setOrders mutation updates orders list', () => {
    const state = profilesModule.state()
    profilesModule.mutations.setOrders(state, [{ id: 3 }])
    expect(state.orders).toEqual([{ id: 3 }])
  })

  it('setOrdersLoading mutation updates loading flag', () => {
    const state = profilesModule.state()
    profilesModule.mutations.setOrdersLoading(state, true)
    expect(state.ordersLoading).toBe(true)
  })
})
