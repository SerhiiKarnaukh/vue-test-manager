export function getLoginRoute(path) {
  if (path.startsWith('/taberna'))
    return `/taberna/login?redirect=${encodeURIComponent(path)}&message=auth`

  if (path.startsWith('/social')) return '/social/login?message=auth'

  return '/'
}

export function resolveAuthRedirect(to, isAuthenticated) {
  if (to.meta.authJWT && !isAuthenticated) {
    return getLoginRoute(to.fullPath)
  }

  return true
}
