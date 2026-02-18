import { ref } from 'vue'

const DEFAULT_OPTIONS = {
  autoReconnect: true,
  reconnectDelay: 3000,
  maxRetries: 10
}

export function useWebSocket(url, options = {}) {
  const config = { ...DEFAULT_OPTIONS, ...options }

  const status = ref('disconnected')
  const data = ref(null)
  const error = ref(null)

  function connect() { /* TODO: implement */ }
  function disconnect() { /* TODO: implement */ }
  function send(payload) { /* TODO: implement */ }

  return { status, data, error, connect, disconnect, send }
}
