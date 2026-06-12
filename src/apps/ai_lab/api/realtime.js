import axios from 'axios'

export const REALTIME_WS_URL =
  'wss://api.openai.com/v1/realtime?model=gpt-realtime'

export function fetchRealtimeToken() {
  return axios.post('/ai-lab/realtime-token/')
}
