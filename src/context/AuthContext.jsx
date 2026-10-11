import { createContext, useContext, useState, useEffect } from 'react'
import axios from '../api/axiosClient'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem('bindass_token')
    if (token && token !== 'undefined' && token !== 'null') {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
      fetchUser()
    } else {
      localStorage.removeItem('bindass_token')
      setLoading(false)
    }
  }, [])

  const fetchUser = async () => {
    try {
      const res = await axios.get('/api/auth/me')
      const userData = res.data?.data || res.data?.user || res.data
      setUser(userData)
    } catch {
      logout()
    } finally {
      setLoading(false)
    }
  }

  const login = async (email, password) => {
    const res = await axios.post('/api/auth/login', { email, password })
    const payload = res.data?.data || res.data
    const token = payload?.token
    const userData = payload?.user || payload
    if (token) {
      localStorage.setItem('bindass_token', token)
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
    }
    setUser(userData)
    return res.data
  }

  const register = async (name, email, password) => {
    const res = await axios.post('/api/auth/register', { name, email, password })
    const payload = res.data?.data || res.data
    const token = payload?.token
    const userData = payload?.user || payload
    if (token) {
      localStorage.setItem('bindass_token', token)
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
    }
    setUser(userData)
    return res.data
  }

  const logout = () => {
    localStorage.removeItem('bindass_token')
    delete axios.defaults.headers.common['Authorization']
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)