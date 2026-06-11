import axios from 'axios'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import {
  attachAccessTokenToRequest,
  retryRequestAfterRefresh,
  setupAxiosInterceptors,
} from './axiosInterceptors'

describe('axiosInterceptors', () => {
  describe('attachAccessTokenToRequest', () => {
    it('adds Bearer header when access token exists', () => {
      const config = { headers: {} }
      const result = attachAccessTokenToRequest(config, 'token-123')

      expect(result.headers.Authorization).toBe('Bearer token-123')
    })

    it('leaves config unchanged when token is missing', () => {
      const config = { headers: {} }
      const result = attachAccessTokenToRequest(config, null)

      expect(result.headers.Authorization).toBeUndefined()
    })
  })

  describe('retryRequestAfterRefresh', () => {
    const baseError = {
      response: { status: 401 },
      config: { url: '/api/social-posts/', headers: {} },
    }

    it('rejects when response is not 401', async () => {
      await expect(
        retryRequestAfterRefresh(
          { response: { status: 403 }, config: {} },
          {
            originalRequest: {},
            refreshToken: vi.fn(),
            retryRequest: vi.fn(),
          }
        )
      ).rejects.toEqual({ response: { status: 403 }, config: {} })
    })

    it('does not refresh on jwt obtain or refresh urls', async () => {
      const refreshToken = vi.fn()
      const retryRequest = vi.fn()

      await expect(
        retryRequestAfterRefresh(baseError, {
          originalRequest: baseError.config,
          refreshToken,
          retryRequest,
          isObtainOrRefreshUrl: () => true,
        })
      ).rejects.toBe(baseError)

      expect(refreshToken).not.toHaveBeenCalled()
    })

    it('retries original request after successful refresh', async () => {
      const refreshToken = vi.fn().mockResolvedValue({ data: { access: 'new' } })
      const retryRequest = vi.fn().mockResolvedValue({ data: 'ok' })

      const result = await retryRequestAfterRefresh(baseError, {
        originalRequest: baseError.config,
        refreshToken,
        retryRequest,
        isObtainOrRefreshUrl: () => false,
      })

      expect(baseError.config._retry).toBe(true)
      expect(refreshToken).toHaveBeenCalledOnce()
      expect(retryRequest).toHaveBeenCalledWith(baseError.config)
      expect(result).toEqual({ data: 'ok' })
    })

    it('rejects when refresh returns empty result', async () => {
      const refreshToken = vi.fn().mockResolvedValue(null)

      await expect(
        retryRequestAfterRefresh(baseError, {
          originalRequest: baseError.config,
          refreshToken,
          retryRequest: vi.fn(),
          isObtainOrRefreshUrl: () => false,
        })
      ).rejects.toBe(baseError)
    })

    it('does not retry the same request twice', async () => {
      const refreshToken = vi.fn()

      await expect(
        retryRequestAfterRefresh(baseError, {
          originalRequest: { ...baseError.config, _retry: true },
          refreshToken,
          retryRequest: vi.fn(),
          isObtainOrRefreshUrl: () => false,
        })
      ).rejects.toBe(baseError)

      expect(refreshToken).not.toHaveBeenCalled()
    })
  })

  describe('setupAxiosInterceptors', () => {
    let client
    let store

    beforeEach(() => {
      client = axios.create()
      vi.spyOn(client, 'request').mockResolvedValue({ data: 'ok' })
      store = {
        getters: { 'authJWT/accessToken': 'stored-token' },
        dispatch: vi.fn().mockResolvedValue({ data: { access: 'fresh-token' } }),
      }
      setupAxiosInterceptors(client, store)
    })

    it('registers request interceptor that reads store token', async () => {
      const handlers = client.interceptors.request.handlers
      const fulfilled = handlers[handlers.length - 1].fulfilled
      const config = await fulfilled({ headers: {}, url: '/api/test' })

      expect(config.headers.Authorization).toBe('Bearer stored-token')
    })

    it('passes successful responses through unchanged', async () => {
      const handlers = client.interceptors.response.handlers
      const fulfilled = handlers[handlers.length - 1].fulfilled
      const response = { data: 'payload', status: 200 }

      expect(fulfilled(response)).toBe(response)
    })

    it('rejects failed request interceptor errors', async () => {
      const handlers = client.interceptors.request.handlers
      const rejected = handlers[handlers.length - 1].rejected
      const error = new Error('request failed')

      await expect(rejected(error)).rejects.toBe(error)
    })

    it('registers response interceptor that dispatches refresh on 401', async () => {
      const handlers = client.interceptors.response.handlers
      const rejected = handlers[handlers.length - 1].rejected

      const error = {
        response: { status: 401 },
        config: { url: '/api/social-posts/', headers: {} },
      }

      const result = await rejected(error)

      expect(store.dispatch).toHaveBeenCalledWith('authJWT/refreshToken')
      expect(client.request).toHaveBeenCalled()
      expect(result).toEqual({ data: 'ok' })
    })
  })
})
