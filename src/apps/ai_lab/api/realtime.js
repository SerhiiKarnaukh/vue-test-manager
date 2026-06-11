import axios from 'axios'

export const REALTIME_WS_URL =
  'wss://api.openai.com/v1/realtime?model=gpt-4o-realtime-preview-2024-12-17'

export function fetchRealtimeToken() {
  return axios.post('/ai-lab/realtime-token/')
}
