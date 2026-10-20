import axiosClient from './axiosClient'

export const loginUser = (data) => axiosClient.post('/api/auth/login', data)
export const registerUser = (data) => axiosClient.post('/api/auth/register', data)
export const getMe = () => axiosClient.get('/api/auth/me')
export const updateProfile = (data) => axiosClient.put('/api/auth/profile', data)

export const forgotPassword = (email) =>
  axiosClient.post('/api/auth/forgot-password', { email })

export const resetPassword = (token, password) =>
  axiosClient.post(`/api/auth/reset-password/${token}`, { password })

export const verifyEmail = (token) =>
  axiosClient.post('/api/auth/verify-email', { token })

export const resendVerification = (email) =>
  axiosClient.post('/api/auth/resend-verification', { email })

export const deleteAccount = () =>
  axiosClient.delete('/api/auth/me')