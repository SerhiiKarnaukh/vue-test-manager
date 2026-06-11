export function adaptLegacyGuard(legacyGuard) {
  return (to, from) =>
    new Promise((resolve, reject) => {
      let isResolved = false
      const resolveOnce = (value) => {
        if (isResolved) return
        isResolved = true
        resolve(value)
      }

      try {
        const result = legacyGuard(to, from, resolveOnce)

        if (result && typeof result.then === 'function') {
          result.then(resolveOnce).catch(reject)
          return
        }

        if (result !== undefined) {
          resolveOnce(result)
        }
      } catch (error) {
        reject(error)
      }
    })
}

export function applyLegacyGuardCompat(routerInstance) {
  const methods = ['beforeEach', 'beforeResolve']

  methods.forEach((method) => {
    if (typeof routerInstance[method] !== 'function') return

    const original = routerInstance[method].bind(routerInstance)
    routerInstance[method] = (...args) => {
      const maybeGuard = args[0]
      if (typeof maybeGuard === 'function' && maybeGuard.length > 2) {
        const adaptedGuard = adaptLegacyGuard(maybeGuard)
        return original(adaptedGuard, ...args.slice(1))
      }

      return original(...args)
    }
  })
}
