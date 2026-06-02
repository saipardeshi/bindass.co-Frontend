import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useProducts } from '../hooks/useProducts'
import ProductCard from '../components/ProductCard'
import { ProductCardSkeleton } from '../components/SkeletonLoader'

const SIZES   = ['XS', 'S', 'M', 'L', 'XL', 'XXL']
const SORT_OPTIONS = [
  { label: 'Newest', value: 'newest' },
  { label: 'Popular', value: 'popular' },
  { label: 'Price: Low → High', value: 'price_asc' },
  { label: 'Price: High → Low', value: 'price_desc' },
]
const PRICE_RANGES = [
  { label: 'Under ₹2000', min: 0, max: 2000 },
  { label: '₹2000 – ₹3000', min: 2000, max: 3000 },
  { label: '₹3000 – ₹4000', min: 3000, max: 4000 },
  { label: 'Above ₹4000', min: 4000, max: 99999 },
]

export default function ShopPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [filterOpen, setFilterOpen] = useState(false)

  const [filters, setFilters] = useState({
    sort: searchParams.get('sort') || 'newest',
    sizes: [],
    price: null,
    sale: searchParams.get('sale') === 'true',
  })

  const { data, isLoading } = useProducts({
    sort: filters.sort,
    sizes: filters.sizes.join(','),
    minPrice: filters.price?.min,
    maxPrice: filters.price?.max,
    sale: filters.sale,
  })

  const searchQuery = searchParams.get('search') || ''

const HOODIE_IMAGES = [
  '04fa1b239c87c925221839f4fdd14fbe_jpc0xg',
  '09c14caaec87319b9505427d1fa1ae53_snesau',
  '0949a3757008088d45d4b7a39e861b36_hfqvgk',
  '7c4c4793bd2de27f8f33b1fe143e68a3_helqqb',
  '11b74b65d3f58353f0e8a89ebef7f8e9_r5pkje',
  'b68f66df131f426c9c4293de87a66968_ld9esi',
  'feb19ee3b1dc442bfc0a4b3c56503a6c_yeh9ev',
  '5cdaab5bfdf6296f55deb61811685e45_dhpehl',
  'e2ef98fba55320fac63538b3e27132cb_al66lw',
  'e6db31232a2369369581001c111d53e7_pde1t1',
  '8ca8a1bb3a5991499a869ac497a5da6e_z7ncww',
  '8851175913f2fa522a694960e20f7d23_lrog5e',
]

const rawProducts = data?.products || Array.from({ length: 12 }, (_, i) => ({
    _id: `p${i}`, slug: `hoodie-${i}`,
    name: `Hoodie Style ${i + 1}`,
    price: 2299 + i * 200,
    sizes: SIZES,
    images: [HOODIE_IMAGES[i % HOODIE_IMAGES.length]],
    isNew: i < 2,
    category: 'Unisex Hoodie',
  }))

  const products = searchQuery
    ? rawProducts.filter(p => p.name.toLowerCase().includes(searchQuery.toLowerCase()))
    : rawProducts

  const toggleSize = (s) =>
    setFilters(f => ({
      ...f,
      sizes: f.sizes.includes(s) ? f.sizes.filter(x => x !== s) : [...f.sizes, s],
    }))

  return (
    <div className="min-h-screen bg-black pt-16">
      {/* Page Header */}
      <div className="border-b border-white/5 px-6 md:px-16 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-screen-xl mx-auto"
        >
          <p className="section-label text-silver mb-3">
            {searchQuery ? `Search results for "${searchQuery}"` : 'All Products'}
          </p>
          <h1 className="font-display text-6xl md:text-8xl tracking-wider uppercase text-white">
            SHOP
          </h1>
        </motion.div>
      </div>

      <div className="max-w-screen-xl mx-auto px-6 md:px-16 py-10">
        {/* Toolbar */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-10">
          {/* Filter toggle */}
          <button
            onClick={() => setFilterOpen(p => !p)}
            className="flex items-center gap-3 font-mono text-xs tracking-widest uppercase text-silver hover:text-white transition-colors"
          >
            <span>{filterOpen ? '— ' : '+ '} Filters</span>
            {(filters.sizes.length > 0 || filters.price || filters.sale) && (
              <span className="bg-white text-black text-[9px] font-bold px-2 py-0.5 rounded-full font-mono">
                {filters.sizes.length + (filters.price ? 1 : 0) + (filters.sale ? 1 : 0)}
              </span>
            )}
          </button>

          <div className="flex items-center gap-4">
            <span className="font-mono text-[10px] text-gray-600 tracking-wider uppercase">
              {products.length} items
            </span>
            {/* Sort */}
            <select
              value={filters.sort}
              onChange={e => setFilters(f => ({ ...f, sort: e.target.value }))}
              className="bg-transparent border border-white/10 text-white font-mono text-[10px] tracking-widest uppercase px-4 py-2 
                         focus:outline-none focus:border-white/30 cursor-pointer"
            >
              {SORT_OPTIONS.map(o => (
                <option key={o.value} value={o.value} className="bg-gray-900">{o.label}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Filter Panel */}
        <AnimatePresence>
          {filterOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.4 }}
              className="overflow-hidden"
            >
              <div className="border border-white/5 p-8 mb-10 grid grid-cols-2 md:grid-cols-4 gap-10">
                {/* Sizes */}
                <div>
                  <p className="section-label text-silver mb-4">Size</p>
                  <div className="flex flex-wrap gap-2">
                    {SIZES.map(s => (
                      <button
                        key={s}
                        onClick={() => toggleSize(s)}
                        className={`w-10 h-10 font-mono text-xs border transition-all duration-200 ${
                          filters.sizes.includes(s)
                            ? 'bg-white text-black border-white'
                            : 'border-white/10 text-gray-400 hover:border-white/30 hover:text-white'
                        }`}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Price */}
                <div>
                  <p className="section-label text-silver mb-4">Price</p>
                  <div className="flex flex-col gap-2">
                    {PRICE_RANGES.map(r => (
                      <button
                        key={r.label}
                        onClick={() => setFilters(f => ({
                          ...f, price: f.price?.label === r.label ? null : r
                        }))}
                        className={`text-left font-sans text-xs transition-colors duration-200 ${
                          filters.price?.label === r.label
                            ? 'text-white'
                            : 'text-gray-500 hover:text-gray-300'
                        }`}
                      >
                        {filters.price?.label === r.label ? '✓ ' : ''}{r.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Sale */}
                <div>
                  <p className="section-label text-silver mb-4">Offers</p>
                  <button
                    onClick={() => setFilters(f => ({ ...f, sale: !f.sale }))}
                    className={`font-sans text-xs transition-colors duration-200 ${
                      filters.sale ? 'text-white' : 'text-gray-500 hover:text-gray-300'
                    }`}
                  >
                    {filters.sale ? '✓ ' : ''}On Sale
                  </button>
                </div>

                {/* Clear */}
                <div className="flex items-end">
                  <button
                    onClick={() => {
                      setFilters({ sort: 'newest', sizes: [], price: null, sale: false })
                      setSearchParams({})
                    }}
                    className="font-mono text-[10px] text-gray-600 hover:text-gray-300 tracking-widest uppercase transition-colors border-b border-gray-800 hover:border-gray-500 pb-0.5"
                  >
                    Clear All
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Grid */}
        {!isLoading && products.length === 0 ? (
          <div className="text-center py-20 border border-white/5 bg-gray-950/20">
            <p className="font-mono text-xs text-gray-500 uppercase tracking-widest mb-4">No products found matching your search</p>
            {searchQuery && (
              <button
                onClick={() => setSearchParams({})}
                className="btn-outline text-xs px-6 py-2"
              >
                Clear Search
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {isLoading
              ? Array.from({ length: 8 }).map((_, i) => <ProductCardSkeleton key={i} />)
              : products.map((p, i) => <ProductCard key={p._id} product={p} index={i} />)
            }
          </div>
        )}

        {/* Load more */}
        {!isLoading && products.length > 0 && (
          <div className="text-center mt-16">
            <button className="btn-outline">Load More</button>
          </div>
        )}
      </div>
    </div>
  )
}