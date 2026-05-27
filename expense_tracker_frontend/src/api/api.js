import axios from 'axios'

// This creates a custom axios instance with your backend URL as the base
// Instead of writing full URL every time, we just write /expenses, /auth/login etc.
const api = axios.create({
  baseURL: 'http://localhost:8082'
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