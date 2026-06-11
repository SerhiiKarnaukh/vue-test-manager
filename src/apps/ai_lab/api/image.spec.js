import { beforeEach, describe, expect, it, vi } from 'vitest'
import axios from 'axios'
import {
  deleteVisionImage,
  downloadImage,
  generateImage,
  uploadVisionImages,
} from './image'

vi.mock('axios', () => ({
  default: {
    post: vi.fn(),
    delete: vi.fn(),
  },
}))

describe('ai-lab image api', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('generateImage posts question', async () => {
    axios.post.mockResolvedValueOnce({ data: {} })
    await generateImage('draw a cat')
    expect(axios.post).toHaveBeenCalledWith('/ai-lab/image-generator/', {
      question: 'draw a cat',
    })
  })

  it('downloadImage requests blob by filename', async () => {
    axios.post.mockResolvedValueOnce({ data: new Blob() })
    await downloadImage('cat.png')
    expect(axios.post).toHaveBeenCalledWith(
      '/ai-lab/download-image/',
      { filename: 'cat.png' },
      { responseType: 'blob' }
    )
  })

  it('deleteVisionImage sends filename in body', async () => {
    axios.delete.mockResolvedValueOnce({})
    await deleteVisionImage('cat.png')
    expect(axios.delete).toHaveBeenCalledWith('/ai-lab/delete-vision-image/', {
      data: { filename: 'cat.png' },
    })
  })

  it('uploadVisionImages posts multipart form data', async () => {
    const formData = new FormData()
    axios.post.mockResolvedValueOnce({ data: {} })
    await uploadVisionImages(formData)
    expect(axios.post).toHaveBeenCalledWith(
      '/ai-lab/upload-vision-images/',
      formData,
      { headers: { 'Content-Type': 'multipart/form-data' } }
    )
  })
})
