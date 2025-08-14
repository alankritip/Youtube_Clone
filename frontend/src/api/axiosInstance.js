// Axios configuration for API requests
import axios from 'axios'

// Create instance pointing to backend API base URL
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api', // default if env not set
  withCredentials: true // allow cookies & credentials if backend sends them
})

// Automatically add Authorization header if token exists
api.interceptors.request.use(config => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

export default api
