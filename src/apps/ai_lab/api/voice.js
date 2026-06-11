import axios from 'axios'

export function generateVoice(question) {
  return axios.post('/ai-lab/voice-generator/', { question })
}
