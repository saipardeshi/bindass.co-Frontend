import axiosClient from './axiosClient'

// Spring returns a 400 for empty params, so drop undefined/empty ones
const clean = (params = {}) =>
  Object.fromEntries(
    Object.entries(params).filter(([, v]) => v !== undefined && v !== null && v !== '' && v !== false)
  )

export const getProducts = (params = {}) =>
  axiosClient.get('/api/products', { params: clean(params) })

export const getProductBySlug = (slug) =>
  axiosClient.get(`/api/products/${encodeURIComponent(slug)}`)

export const getFeaturedProducts = () =>
  axiosClient.get('/api/products/featured')

export const getNewArrivals = () =>
  axiosClient.get('/api/products/new-arrivals')

export const getBestSellers = () =>
  axiosClient.get('/api/products/best-sellers')

export const searchProducts = (query, params = {}) =>
  axiosClient.get('/api/products/search', { params: { q: query, ...clean(params) } })
