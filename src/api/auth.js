import axiosClient from './axiosClient'

export const loginUser = (data) => axiosClient.post('/api/auth/login', data)
export const registerUser = (data) => axiosClient.post('/api/auth/register', data)
export const getMe = () => axiosClient.get('/api/auth/me')
export const updateProfile = (data) => axiosClient.put('/api/auth/profile', data)