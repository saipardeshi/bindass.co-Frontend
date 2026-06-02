import axiosClient from './axiosClient'

export const createOrder = (data) => axiosClient.post('/api/orders', data)
export const getMyOrders = () => axiosClient.get('/api/orders/my-orders')
export const getOrderById = (id) => axiosClient.get(`/api/orders/${id}`)
export const verifyPayment = (data) => axiosClient.post('/api/orders/verify-payment', data)