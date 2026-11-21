import { useState, useEffect, useCallback } from 'react'
import axios from '../api/axiosClient'
import { AuthContext } from './contexts'

const hasStoredToken = () => {
  const token = localStorage.getItem('bindass_token')
  return !!token && token !== 'undefined' && token !== 'null'
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  // we are only "loading" if there is a stored token to validate
  const [loading, setLoading] = useState(hasStoredToken)

  const logout = useCallback(() => {
    localStorage.removeItem('bindass_token')
    delete axios.defaults.headers.common['Authorization']
    setUser(null)
  }, [])

  const fetchUser = useCallback(async () => {
    try {
      const res = await axios.get('/api/auth/me')
      const userData = res.data?.data || res.data?.user || res.data
      setUser(userData)
    } catch {
      logout()
    } finally {
      setLoading(false)
    }
  }, [logout])

  // Validate a stored token once on startup (state is only set from promise callbacks)
  useEffect(() => {
    if (!hasStoredToken()) {
      localStorage.removeItem('bindass_token')
      return
    }
    axios.defaults.headers.common['Authorization'] = `Bearer ${localStorage.getItem('bindass_token')}`

    let cancelled = false
    axios.get('/api/auth/me')
      .then((res) => {
        if (!cancelled) setUser(res.data?.data || res.data?.user || res.data)
      })
      .catch(() => {
        if (!cancelled) logout()
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })
    return () => { cancelled = true }
  }, [logout])

  const login = async (email, password) => {
    const res = await axios.post('/api/auth/login', {
      email: typeof email === 'string' ? email.trim().toLowerCase() : email,
      password,
    })
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
    const res = await axios.post('/api/auth/register', {
      name: typeof name === 'string' ? name.trim() : name,
      email: typeof email === 'string' ? email.trim().toLowerCase() : email,
      password,
    })
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

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, fetchUser }}>
      {children}
    </AuthContext.Provider>
  )
}
