import axios from 'axios'

const axiosClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000',
  timeout: 10000,
  headers: { 'Content-Type': 'application/json' },
})

// Request interceptor for attaching token
axiosClient.interceptors.request.use(
  config => {
    const token = localStorage.getItem('bindass_token')
    if (token && token !== 'undefined' && token !== 'null') {
      config.headers.Authorization = `Bearer ${token}`
    } else {
      delete config.headers.Authorization
    }
    return config
  },
  error => Promise.reject(error)
)

// Response interceptor for error handling
axiosClient.interceptors.response.use(
  res => res,
  err => {
    const isAuthError = err.response?.status === 401 || (err.response?.status === 403 && !localStorage.getItem('bindass_token'))
    if (isAuthError) {
      localStorage.removeItem('bindass_token')
      delete axiosClient.defaults.headers.common['Authorization']
      // Avoid redirect loop if already on /auth
      if (!window.location.pathname.startsWith('/auth')) {
        const current = window.location.pathname + window.location.search
        window.location.href = `/auth?redirect=${encodeURIComponent(current)}`
      }
    }
    return Promise.reject(err)
  }
)

export default axiosClient