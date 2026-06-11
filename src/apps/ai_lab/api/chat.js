import axios from 'axios'

export function sendChatMessage(question, promptImages) {
  return axios.post('/ai-lab/', { question, prompt_images: promptImages })
}
