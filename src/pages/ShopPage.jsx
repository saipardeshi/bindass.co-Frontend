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

const ALL_IMAGES = [
  // ── Original 12 ──────────────────────────────────────────
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
  // ── New 29 ───────────────────────────────────────────────
  'v1780475917/Cord%C3%A3o_Bolso_Bloco_de_cores_ocasional_Su%C3%A9ter_Masculino_mkb334.jpg',
  'v1780475916/zanzea___women_fashion_outfits_g8hoir.jpg',
  'v1780475916/Best_jnuobj.jpg',
  'v1780475916/Colorblock_Drawstring_Pocket_Hoodie_muzi37.jpg',
  'v1780475916/Guys_Letter_Colorblock_Kangaroo_Pocket_Drawstring_Hoodie_tdnwng.jpg',
  'v1780475915/COLORBLOCK_KANGROO_POCKET_DRAWSTRING_HOODI_eafyfn.jpg',
  'v1780475915/Colorblock_Drawstring_Pocket_Thermal_Lined_Hoodie_mma4sx.jpg',
  'v1780475914/Mens_Letter_Embroidered_Colorblock_Stitching_Street_Drawstring_Hoodies_qtmbyh.jpg',
  'v1780475914/Boys_Letter_Graphic_Colourblock_Hoodie_hgjuwm.jpg',
  'v1780475914/Color-Block_Casual_Cotton-Blend_%E5%82%A8%E5%A4%87%E6%AC%BE_-_Anniecloth_wdmq4n.jpg',
  'v1780475900/Cord%C3%A3o_Bolso_Bloco_de_cores_ocasional_Su%C3%A9ter_Masculino_hk5xz6.jpg',
  'v1780475578/Cord%C3%A3o_Bolso_Simples_ocasional_Su%C3%A9ter_Masculino_mvnxvo.jpg',
  'v1780475578/YHWH_Unisex_Hooded_Sweatshirt_-_Orange___L_zq8vyj.jpg',
  'v1780475577/Men_s_Knitted_Fit_Basic_Style_Shoulder_Hoodie_With_Velvet_Green_Sweatshirt_Suitable_For_Autumn_And_Winter_p62usz.jpg',
  'v1780475577/Navy_blue_aesthetic_hoodie_vugnwi.jpg',
  'v1780475577/Yellow-white_hoodie_dayixi.jpg',
  'v1780475577/Hoodie_lkdu4n.jpg',
  'v1780475577/download_wpbw6c.jpg',
  'v1780475577/13_Per_Hoodie_Wholesale_is_available_from_Bangladesh_ittxie.jpg',
  'v1780475576/White-orange_hoodie_kgrfpp.jpg',
  'v1780475576/Best_jigb3t.jpg',
  'v1780475576/Plus_Drop_Shoulder_Two_Tone_Drawstring_Hoodie_iuwyst.jpg',
  'v1780475576/Cord%C3%A3o_Bolso_Bloco_de_cores_ocasional_Su%C3%A9ter_Masculino_naez1z.jpg',
  'v1780475576/Colorblock_Drawstring_Pocket_Thermal_Lined_Hoodie_nxojbd.jpg',
  'v1780475576/Colorblock_Drawstring_Pocket_Hoodie_ynean5.jpg',
  'v1780475575/zanzea___women_fashion_outfits_ksmynu.jpg',
]

const NAMES = [
  'Shadow Block Hoodie','Noir Street Hoodie','Premium Drop Hoodie',
  'Void Series Hoodie','Tactical Pull Hoodie','Club Black Hoodie',
  'Crest Embroidered Hoodie','Monogram Fleece Hoodie','LA Wash Hoodie',
  'Colorblock Kangaroo Hoodie','Urban Drawstring Hoodie','Thermal Lined Hoodie',
  'Colorblock Block Mens Hoodie','Zanzea Oversized Hoodie','Best Premium Hoodie',
  'Colorblock Pocket Hoodie','Letter Colorblock Hoodie','Kangaroo Drawstring Hoodie',
  'Thermal Pocket Hoodie','Letter Embroidered Hoodie','Graphic Colourblock Hoodie',
  'Casual Cotton Hoodie','Colorblock Casual Hoodie','Simple Drawstring Hoodie',
  'Orange Unisex Hoodie','Velvet Shoulder Hoodie','Navy Blue Aesthetic Hoodie',
  'Yellow White Hoodie','Classic Drop Hoodie','Heavyweight Hoodie',
  'Urban Street Hoodie','White Orange Hoodie','Drop Oversized Hoodie',
  'Two Tone Hoodie','Pocket Casual Hoodie','Thermal Colorblock Hoodie',
  'Drawstring Vol2 Hoodie','Street Fashion Hoodie','Bindass Core Hoodie',
  'Dark Luxury Hoodie','Oversized Minimal Hoodie',
]

const PRICES = [
  2499,2299,2799,2699,3499,2799,3099,3199,2299,2399,
  2599,3199,2499,2299,2799,2599,2899,2399,3199,3499,
  2199,2299,2599,1999,2699,3299,2499,2299,2799,1999,
  1799,2599,2899,2999,2399,3099,2499,2699,2799,2399,2599
]

const ORIGINAL = [
  3199,null,3499,null,null,null,null,null,2799,2999,
  null,null,null,null,3499,3199,null,2999,null,null,
  2799,null,3199,null,null,null,2999,null,null,2499,
  null,null,3499,null,null,3799,null,null,null,null,null
]

const rawProducts = data?.products || ALL_IMAGES.map((img, i) => ({
  _id:           `h${i}`,
  slug:          `hoodie-${i}`,
  name:          NAMES[i % NAMES.length],
  price:         PRICES[i % PRICES.length],
  originalPrice: ORIGINAL[i % ORIGINAL.length],
  discount:      ORIGINAL[i % ORIGINAL.length]
    ? Math.round((1 - PRICES[i % PRICES.length] / ORIGINAL[i % ORIGINAL.length]) * 100)
    : 0,
  sizes:    SIZES,
  images:   [img],
  isNew:    i < 8,
  category: 'Unisex Hoodie',
}))
const [visibleCount, setVisibleCount] = useState(12)

// Reset visible count when filters change
useEffect(() => {
  setVisibleCount(12)
}, [filters, searchQuery])

const filteredProducts = (() => {
  let p = [...rawProducts]
  if (searchQuery) p = p.filter(x => x.name.toLowerCase().includes(searchQuery.toLowerCase()))
  if (filters.sizes.length > 0) p = p.filter(x => x.sizes.some(s => filters.sizes.includes(s)))
  if (filters.price) p = p.filter(x => x.price >= filters.price.min && x.price <= filters.price.max)
  if (filters.sale) p = p.filter(x => x.discount > 0)
  switch (filters.sort) {
    case 'price_asc':  p.sort((a, b) => a.price - b.price); break
    case 'price_desc': p.sort((a, b) => b.price - a.price); break
    case 'popular':    p.sort((a, b) => b.discount - a.discount); break
    default:           p.sort((a, b) => (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0))
  }
  return p
})()

const products = filteredProducts.slice(0, visibleCount)
const hasMore  = visibleCount < filteredProducts.length
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
              {filteredProducts.length} items
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
  setVisibleCount(12)
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
        {hasMore && (
  <div className="text-center mt-16">
    <button
      onClick={() => setVisibleCount(c => c + 12)}
      className="btn-outline px-12 py-4"
    >
      Load More 
    </button>
  </div>
)}
      </div>
    </div>
  )
}