import { describe, expect, it, vi } from 'vitest'
import { getLoginRoute, resolveAuthRedirect } from './guards'
import { adaptLegacyGuard, applyLegacyGuardCompat } from './legacy-guard-compat'

describe('router guards', () => {
  describe('getLoginRoute', () => {
    it('redirects taberna paths to taberna login with return url', () => {
      expect(getLoginRoute('/taberna/dashboard')).toBe(
        '/taberna/login?redirect=%2Ftaberna%2Fdashboard&message=auth'
      )
    })

    it('redirects social paths to social login', () => {
      expect(getLoginRoute('/social/chat')).toBe('/social/login?message=auth')
    })

    it('falls back to home for other apps', () => {
      expect(getLoginRoute('/ai-lab')).toBe('/')
    })
  })

  describe('resolveAuthRedirect', () => {
    it('allows navigation when auth is not required', () => {
      expect(
        resolveAuthRedirect({ meta: {}, fullPath: '/taberna' }, false)
      ).toBe(true)
    })

    it('allows navigation when user is authenticated', () => {
      expect(
        resolveAuthRedirect(
          { meta: { authJWT: true }, fullPath: '/taberna/dashboard' },
          true
        )
      ).toBe(true)
    })

    it('redirects guests away from protected taberna routes', () => {
      expect(
        resolveAuthRedirect(
          { meta: { authJWT: true }, fullPath: '/taberna/cart/checkout' },
          false
        )
      ).toBe(
        '/taberna/login?redirect=%2Ftaberna%2Fcart%2Fcheckout&message=auth'
      )
    })

    it('redirects guests away from protected social routes', () => {
      expect(
        resolveAuthRedirect(
          { meta: { authJWT: true }, fullPath: '/social/chat' },
          false
        )
      ).toBe('/social/login?message=auth')
    })
  })

  describe('adaptLegacyGuard', () => {
    it('adapts legacy next-style guards to promise resolves', async () => {
      const legacyGuard = vi.fn((_to, _from, next) => next('/login'))
      const adapted = adaptLegacyGuard(legacyGuard)

      await expect(adapted({ path: '/x' }, { path: '/' })).resolves.toBe('/login')
      expect(legacyGuard).toHaveBeenCalled()
    })

    it('resolves when legacy guard returns a value directly', async () => {
      const legacyGuard = vi.fn(() => '/home')
      const adapted = adaptLegacyGuard(legacyGuard)

      await expect(adapted({ path: '/x' }, { path: '/' })).resolves.toBe('/home')
    })

    it('resolves when legacy guard returns a promise', async () => {
      const legacyGuard = vi.fn(() => Promise.resolve('/async-home'))
      const adapted = adaptLegacyGuard(legacyGuard)

      await expect(adapted({ path: '/x' }, { path: '/' })).resolves.toBe(
        '/async-home'
      )
    })

    it('rejects when legacy guard throws', async () => {
      const legacyGuard = vi.fn(() => {
        throw new Error('guard failed')
      })
      const adapted = adaptLegacyGuard(legacyGuard)

      await expect(adapted({ path: '/x' }, { path: '/' })).rejects.toThrow(
        'guard failed'
      )
    })

    it('ignores duplicate next() calls', async () => {
      const legacyGuard = vi.fn((_to, _from, next) => {
        next('/first')
        next('/second')
      })
      const adapted = adaptLegacyGuard(legacyGuard)

      await expect(adapted({ path: '/x' }, { path: '/' })).resolves.toBe('/first')
    })
  })

  describe('applyLegacyGuardCompat', () => {
    it('wraps beforeEach to adapt 3-arg legacy guards', () => {
      const originalBeforeEach = vi.fn()
      const router = { beforeEach: originalBeforeEach, beforeResolve: vi.fn() }

      applyLegacyGuardCompat(router)

      const legacyGuard = vi.fn()
      router.beforeEach(legacyGuard)

      expect(originalBeforeEach).toHaveBeenCalledWith(
        expect.any(Function)
      )
      expect(legacyGuard).not.toHaveBeenCalled()
    })

    it('passes modern 2-arg guards through unchanged', () => {
      const originalBeforeEach = vi.fn()
      const router = { beforeEach: originalBeforeEach, beforeResolve: vi.fn() }

      applyLegacyGuardCompat(router)

      const modernGuard = vi.fn()
      router.beforeEach(modernGuard)

      expect(originalBeforeEach).toHaveBeenCalledWith(modernGuard)
    })

    it('wraps beforeResolve for legacy guards', () => {
      const originalBeforeResolve = vi.fn()
      const router = { beforeEach: vi.fn(), beforeResolve: originalBeforeResolve }

      applyLegacyGuardCompat(router)
      router.beforeResolve(vi.fn())

      expect(originalBeforeResolve).toHaveBeenCalledWith(expect.any(Function))
    })

    it('skips missing router hook methods', () => {
      expect(() => applyLegacyGuardCompat({})).not.toThrow()
    })
  })
})
