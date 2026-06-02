import { useQuery } from '@tanstack/react-query'
import {
  getProducts,
  getFeaturedProducts,
  getNewArrivals,
  getBestSellers,
  getProductBySlug,
} from '../api/products'

export const useProducts = (params) =>
  useQuery({
    queryKey: ['products', params],
    queryFn: () => getProducts(params).then(r => r.data),
  })

export const useFeatured = () =>
  useQuery({
    queryKey: ['products', 'featured'],
    queryFn: () => getFeaturedProducts().then(r => r.data),
  })

export const useNewArrivals = () =>
  useQuery({
    queryKey: ['products', 'new-arrivals'],
    queryFn: () => getNewArrivals().then(r => r.data),
  })

export const useBestSellers = () =>
  useQuery({
    queryKey: ['products', 'best-sellers'],
    queryFn: () => getBestSellers().then(r => r.data),
  })

export const useProduct = (slug) =>
  useQuery({
    queryKey: ['product', slug],
    queryFn: () => getProductBySlug(slug).then(r => r.data),
    enabled: !!slug,
  })