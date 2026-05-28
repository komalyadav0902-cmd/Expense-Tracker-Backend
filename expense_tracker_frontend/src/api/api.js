import axios from 'axios'

// Reads the environment variable from Vercel in production 
// Falls back to localhost when running on your computer
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8082'
})

// This is called an INTERCEPTOR
// It runs automatically before EVERY request you make
// Its job: grab the JWT token from localStorage and attach it to the request header
// Without this, your backend will reject every request with 401 Unauthorized
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

export default api