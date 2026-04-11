/** JWT obtain/refresh paths per app (mirrors Taberna: `<app>/api/v1/token/`). */

const LOGIN_BY_SOURCE = {
  taberna: '/taberna-profiles/api/v1/token/',
  // Under global `/api/social-profiles/` mount, same JWT suffix as Taberna (`/api/v1/token/`).
  social: '/api/social-profiles/api/v1/token/',
  f1_pitwall: '/f1/api/v1/token/',
}

export const DEFAULT_JWT_LOGIN_URL = '/api/v1/token/'

export function resolveJwtLoginUrl(credentials) {
  const key = credentials?.login_source
  if (key && LOGIN_BY_SOURCE[key]) {
    return LOGIN_BY_SOURCE[key]
  }
  return DEFAULT_JWT_LOGIN_URL
}

/** Avoid refresh loop: login and refresh requests must not trigger token refresh on 401. */
export function isJwtObtainOrRefreshUrl(url) {
  if (!url || typeof url !== 'string') {
    return false
  }
  const path = url.replace(/^https?:\/\/[^/?#]+/, '')
  if (path.includes('/token/refresh')) {
    return true
  }
  return /\/v1\/token\/?(\?|$)/.test(path)
}
