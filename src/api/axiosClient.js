import axios from 'axios'

const axiosClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000',
  timeout: 10000,
  headers: { 'Content-Type': 'application/json' },
})

// Response interceptor for error handling
axiosClient.interceptors.response.use(
  res => res,
  err => {
    if (err.response?.status === 401) {
      localStorage.removeItem('bindass_token')
      window.location.href = '/auth'
    }
    return Promise.reject(err)
  }
)

export default axiosClient