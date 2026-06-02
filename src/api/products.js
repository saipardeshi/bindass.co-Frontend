import axiosClient from './axiosClient'

export const getProducts = (params = {}) =>
  axiosClient.get('/api/products', { params })

export const getProductBySlug = (slug) =>
  axiosClient.get(`/api/products/${slug}`)

export const getFeaturedProducts = () =>
  axiosClient.get('/api/products/featured')

export const getNewArrivals = () =>
  axiosClient.get('/api/products/new-arrivals')

export const getBestSellers = () =>
  axiosClient.get('/api/products/best-sellers')

export const searchProducts = (query) =>
  axiosClient.get(`/api/products/search?q=${query}`)