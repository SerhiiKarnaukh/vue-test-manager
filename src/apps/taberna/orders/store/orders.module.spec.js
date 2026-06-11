import { describe, expect, it } from 'vitest'
import { orderActions } from './orderActions'
import ordersModule from './orders.module'

describe('taberna orders module', () => {
  it('exports order actions as namespaced module', () => {
    expect(ordersModule.namespaced).toBe(true)
    expect(ordersModule.actions).toBe(orderActions)
    expect(ordersModule.state()).toEqual({})
  })
})
