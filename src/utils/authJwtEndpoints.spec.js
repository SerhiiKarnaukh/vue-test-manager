import { describe, expect, it } from 'vitest'
import {
  DEFAULT_JWT_LOGIN_URL,
  isJwtObtainOrRefreshUrl,
  resolveJwtLoginUrl,
} from './authJwtEndpoints'

describe('authJwtEndpoints', () => {
  describe('resolveJwtLoginUrl', () => {
    it('returns taberna token URL for taberna login_source', () => {
      expect(resolveJwtLoginUrl({ login_source: 'taberna' })).toBe(
        '/taberna-profiles/api/v1/token/'
      )
    })

    it('returns social token URL for social login_source', () => {
      expect(resolveJwtLoginUrl({ login_source: 'social' })).toBe(
        '/api/social-profiles/api/v1/token/'
      )
    })

    it('returns default URL when login_source is unknown or missing', () => {
      expect(resolveJwtLoginUrl({ login_source: 'unknown' })).toBe(
        DEFAULT_JWT_LOGIN_URL
      )
      expect(resolveJwtLoginUrl({})).toBe(DEFAULT_JWT_LOGIN_URL)
      expect(resolveJwtLoginUrl(null)).toBe(DEFAULT_JWT_LOGIN_URL)
    })
  })

  describe('isJwtObtainOrRefreshUrl', () => {
    it('returns false for empty or non-string input', () => {
      expect(isJwtObtainOrRefreshUrl()).toBe(false)
      expect(isJwtObtainOrRefreshUrl(null)).toBe(false)
      expect(isJwtObtainOrRefreshUrl(123)).toBe(false)
    })

    it('detects refresh token URLs', () => {
      expect(isJwtObtainOrRefreshUrl('/api/v1/token/refresh/')).toBe(true)
      expect(
        isJwtObtainOrRefreshUrl('https://api.example.com/api/v1/token/refresh/')
      ).toBe(true)
    })

    it('detects obtain token URLs', () => {
      expect(isJwtObtainOrRefreshUrl('/taberna-profiles/api/v1/token/')).toBe(
        true
      )
      expect(
        isJwtObtainOrRefreshUrl('https://api.example.com/api/social-profiles/api/v1/token')
      ).toBe(true)
    })

    it('returns false for unrelated API paths', () => {
      expect(isJwtObtainOrRefreshUrl('/api/social-posts/')).toBe(false)
      expect(isJwtObtainOrRefreshUrl('/taberna-cart/api/cart/')).toBe(false)
    })
  })
})
