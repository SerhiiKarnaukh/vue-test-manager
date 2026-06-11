import axios from 'axios'

export function generateImage(question) {
  return axios.post('/ai-lab/image-generator/', { question })
}

export function downloadImage(filename) {
  return axios.post(
    '/ai-lab/download-image/',
    { filename },
    { responseType: 'blob' }
  )
}

export function deleteVisionImage(filename) {
  return axios.delete('/ai-lab/delete-vision-image/', { data: { filename } })
}

export function uploadVisionImages(formData) {
  return axios.post('/ai-lab/upload-vision-images/', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  })
}
