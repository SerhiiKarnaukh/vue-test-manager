import { ref, onUnmounted } from 'vue'
import { useStore } from 'vuex'
import { WS_RECONNECT_DELAY, WS_MAX_RETRIES, WS_STATUS } from '@/constants/f1'

const DEFAULT_OPTIONS = {
  autoReconnect: true,
  reconnectDelay: WS_RECONNECT_DELAY,
  maxRetries: WS_MAX_RETRIES
}

function logDevConnection(debugLabel) {
  if (!import.meta.env.DEV || !debugLabel) return
  console.info('[F1 WS]', `${debugLabel}: connected (createManagedWebSocket)`)
}

/**
 * Headless WebSocket lifecycle for Vuex modules or thin composable wrappers.
 * Does not use Vue lifecycle hooks.
 */
export function createManagedWebSocket(options = {}) {
  const config = { ...DEFAULT_OPTIONS, ...options }
  let socket = null
  let reconnectTimer = null
  let retryCount = 0
  let intentionalDisconnect = false

  function clearReconnectTimer() {
    if (!reconnectTimer) return
    clearTimeout(reconnectTimer)
    reconnectTimer = null
  }

  function closeSocketWithoutOnClose() {
    if (!socket) return
    socket.onclose = null
    socket.close()
    socket = null
  }

  function scheduleReconnect() {
    if (!config.autoReconnect || retryCount >= config.maxRetries) return

    retryCount += 1
    const delay = config.reconnectDelay * Math.min(retryCount, 5)
    reconnectTimer = setTimeout(connect, delay)
  }

  function connect() {
    clearReconnectTimer()
    intentionalDisconnect = false

    const fullUrl = config.buildUrl()
    if (!fullUrl) {
      config.onMissingUrl?.()
      return false
    }

    closeSocketWithoutOnClose()

    socket = new WebSocket(fullUrl)

    socket.onopen = () => {
      logDevConnection(config.debugLabel)
      retryCount = 0
      config.onOpen?.()
    }

    socket.onmessage = (event) => {
      config.onMessage?.(event)
    }

    socket.onclose = () => {
      socket = null
      if (intentionalDisconnect) return
      config.onClose?.()
      scheduleReconnect()
    }

    socket.onerror = (event) => {
      config.onError?.(event)
    }

    return true
  }

  function disconnect() {
    intentionalDisconnect = true
    clearReconnectTimer()
    retryCount = 0
    closeSocketWithoutOnClose()
  }

  function send(payload) {
    if (!socket || socket.readyState !== WebSocket.OPEN) return
    const msg = typeof payload === 'string' ? payload : JSON.stringify(payload)
    socket.send(msg)
  }

  function getReadyState() {
    return socket ? socket.readyState : WebSocket.CLOSED
  }

  return { connect, disconnect, send, getReadyState }
}

export function useWebSocket(url, options = {}) {
  const userConfig = { ...DEFAULT_OPTIONS, ...options }
  const store = useStore()

  const status = ref(WS_STATUS.DISCONNECTED)
  const data = ref(null)
  const error = ref(null)

  function buildUrl() {
    const token = store.getters['authJWT/accessToken']
    if (!token) return null
    const separator = url.includes('?') ? '&' : '?'
    return `${url}${separator}token=${token}`
  }

  const client = createManagedWebSocket({
    autoReconnect: userConfig.autoReconnect,
    reconnectDelay: userConfig.reconnectDelay,
    maxRetries: userConfig.maxRetries,
    buildUrl,
    debugLabel: userConfig.debugLabel,
    onMissingUrl: () => {
      status.value = WS_STATUS.ERROR
      error.value = new Error('No auth token available')
    },
    onOpen: () => {
      status.value = WS_STATUS.CONNECTED
      error.value = null
    },
    onMessage: (event) => {
      try {
        data.value = JSON.parse(event.data)
      } catch {
        data.value = event.data
      }
    },
    onClose: () => {
      status.value = WS_STATUS.DISCONNECTED
    },
    onError: () => {
      status.value = WS_STATUS.ERROR
      error.value = new Error('WebSocket error')
    }
  })

  function connect() {
    if (!buildUrl()) {
      status.value = WS_STATUS.ERROR
      error.value = new Error('No auth token available')
      return
    }
    status.value = WS_STATUS.CONNECTING
    client.disconnect()
    client.connect()
  }

  function disconnect() {
    client.disconnect()
    status.value = WS_STATUS.DISCONNECTED
  }

  function send(payload) {
    client.send(payload)
  }

  onUnmounted(disconnect)

  return { status, data, error, connect, disconnect, send }
}
