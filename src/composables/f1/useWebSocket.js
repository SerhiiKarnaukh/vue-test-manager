import { ref, onUnmounted } from 'vue'
import { useStore } from 'vuex'
import { WS_RECONNECT_DELAY, WS_MAX_RETRIES, WS_STATUS } from '@/constants/f1'

const DEFAULT_OPTIONS = {
  autoReconnect: true,
  reconnectDelay: WS_RECONNECT_DELAY,
  maxRetries: WS_MAX_RETRIES
}

export function useWebSocket(url, options = {}) {
  const config = { ...DEFAULT_OPTIONS, ...options }
  const store = useStore()

  const status = ref(WS_STATUS.DISCONNECTED)
  const data = ref(null)
  const error = ref(null)

  let socket = null
  let reconnectTimer = null
  let retryCount = 0

  function buildUrl() {
    const token = store.getters['authJWT/accessToken']
    if (!token) return null
    const separator = url.includes('?') ? '&' : '?'
    return `${url}${separator}token=${token}`
  }

  function connect() {
    disconnect()
    const fullUrl = buildUrl()
    if (!fullUrl) {
      status.value = WS_STATUS.ERROR
      error.value = new Error('No auth token available')
      return
    }

    status.value = WS_STATUS.CONNECTING
    socket = new WebSocket(fullUrl)

    socket.onopen = () => {
      status.value = WS_STATUS.CONNECTED
      retryCount = 0
      error.value = null
    }

    socket.onmessage = (event) => {
      try {
        data.value = JSON.parse(event.data)
      } catch {
        data.value = event.data
      }
    }

    socket.onclose = () => {
      status.value = WS_STATUS.DISCONNECTED
      socket = null
      scheduleReconnect()
    }

    socket.onerror = (e) => {
      status.value = WS_STATUS.ERROR
      error.value = e
    }
  }

  function disconnect() {
    clearTimeout(reconnectTimer)
    reconnectTimer = null
    retryCount = 0

    if (socket) {
      socket.onclose = null
      socket.close()
      socket = null
    }
    status.value = WS_STATUS.DISCONNECTED
  }

  function send(payload) {
    if (socket && socket.readyState === WebSocket.OPEN) {
      const msg = typeof payload === 'string' ? payload : JSON.stringify(payload)
      socket.send(msg)
    }
  }

  function scheduleReconnect() {
    if (!config.autoReconnect || retryCount >= config.maxRetries) return

    retryCount++
    const delay = config.reconnectDelay * Math.min(retryCount, 5)
    reconnectTimer = setTimeout(connect, delay)
  }

  onUnmounted(disconnect)

  return { status, data, error, connect, disconnect, send }
}
