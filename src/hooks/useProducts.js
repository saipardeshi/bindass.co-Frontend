import { useQuery, useInfiniteQuery } from '@tanstack/react-query'
import {
  getProducts,
  getFeaturedProducts,
  getNewArrivals,
  getBestSellers,
  getProductBySlug,
} from '../api/products'

/* ──────────────────────────────────────────────────────────────
   The API wraps everything as { success, message, data }.
   - lists:  data is an array
   - paged:  data is a Spring Page { content, totalElements, last, number, ... }
   - one:    data is the product
   These helpers adapt that ONCE so pages always get
   { products, total, ... } and products that carry _id / isNew / isSoldOut.
   (Pages used to read `data.products`, which never existed → they showed hardcoded dummy items.)
   ────────────────────────────────────────────────────────────── */

export const normalizeProduct = (p) =>
  p && {
    ...p,
    _id: p._id ?? p.id,
    isNew: p.isNew ?? p.new ?? false,
    isSoldOut: p.isSoldOut ?? p.soldOut ?? false,
    isFeatured: p.isFeatured ?? p.featured ?? false,
  }

const unwrap = (res) => res?.data?.data

const adaptPage = (page) => ({
  products: (page?.content ?? []).map(normalizeProduct),
  total: page?.totalElements ?? 0,
  totalPages: page?.totalPages ?? 0,
  page: page?.number ?? 0,
  last: page?.last ?? true,
})

const adaptList = (list) => ({ products: (Array.isArray(list) ? list : []).map(normalizeProduct) })

// don't hammer the server for a product that simply doesn't exist
const retryUnlessNotFound = (count, err) => err?.response?.status !== 404 && count < 3

/** One page of products (all filters are applied server-side). */
export const useProducts = (params) =>
  useQuery({
    queryKey: ['products', params],
    queryFn: async () => adaptPage(unwrap(await getProducts(params))),
  })

/** "Load more" listing: pages are fetched on demand. */
export const useProductsInfinite = (params, pageSize = 12) =>
  useInfiniteQuery({
    queryKey: ['products', 'infinite', params, pageSize],
    initialPageParam: 0,
    queryFn: async ({ pageParam }) =>
      adaptPage(unwrap(await getProducts({ ...params, page: pageParam, size: pageSize }))),
    getNextPageParam: (last) => (last.last ? undefined : last.page + 1),
  })

export const useFeatured = () =>
  useQuery({
    queryKey: ['products', 'featured'],
    queryFn: async () => adaptList(unwrap(await getFeaturedProducts())),
  })

export const useNewArrivals = () =>
  useQuery({
    queryKey: ['products', 'new-arrivals'],
    queryFn: async () => adaptList(unwrap(await getNewArrivals())),
  })

export const useBestSellers = () =>
  useQuery({
    queryKey: ['products', 'best-sellers'],
    queryFn: async () => adaptList(unwrap(await getBestSellers())),
  })

/** A single product (data is the normalized product itself; a 404 surfaces as isError). */
export const useProduct = (slug) =>
  useQuery({
    queryKey: ['product', slug],
    queryFn: async () => normalizeProduct(unwrap(await getProductBySlug(slug))),
    enabled: !!slug,
    retry: retryUnlessNotFound,
  })
