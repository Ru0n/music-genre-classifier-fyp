import axios from 'axios'

// Create axios instance with base URL
const api = axios.create({
  baseURL: '/api'
})

// API functions
export const uploadAudio = async (file) => {
  const formData = new FormData()
  formData.append('file', file)
  
  const response = await api.post('/upload', formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })
  
  return response.data
}

export const getPlaylists = async () => {
  const response = await api.get('/playlists')
  return response.data
}

export default api
