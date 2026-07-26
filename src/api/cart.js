import axiosClient from './axiosClient'

// All of these require auth (see backend CartController) — only call them
// when a user is logged in. Guest carts stay in localStorage only.
export const getCart = () => axiosClient.get('/api/cart')
export const addCartItem = (data) => axiosClient.post('/api/cart/items', data)
export const updateCartItem = (data) => axiosClient.put('/api/cart/items', data)
export const removeCartItem = (productId, size) =>
  axiosClient.delete('/api/cart/items', { params: { productId, size } })
export const clearCartApi = () => axiosClient.delete('/api/cart')

// data: { items: [{ productId, size, quantity }] } — sent once right after
// login/register to fold the guest localStorage cart into the server cart.
export const mergeGuestCart = (data) => axiosClient.post('/api/cart/merge', data)