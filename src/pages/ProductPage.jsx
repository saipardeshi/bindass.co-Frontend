import { useState } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useProduct } from '../hooks/useProducts'
import { useCart } from '../context/CartContext'
import { formatINR } from '../utils/formatCurrency'
import { cardUrl, sectionUrl } from '../utils/cloudinaryHelpers'
import { ProductCardSkeleton } from '../components/SkeletonLoader'
import toast from 'react-hot-toast'

const DUMMY_PRODUCT = {
  _id: 'p1', name: 'Shadow Oversized Hoodie', slug: 'shadow-oversized-hoodie',
  price: 2499, originalPrice: 3499, discount: 28,
  description: 'Crafted from 380 GSM heavyweight French terry fabric. Dropped shoulders, extended hem, ribbed cuffs. A silhouette engineered for presence.',
  details: ['380 GSM French Terry', '100% Ring-Spun Cotton', 'Dropped Shoulder Cut', 'Extended Hem 70cm', 'Ribbed Cuffs & Hem', 'Unisex Oversized Fit'],
  sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
  images: [
    'samples/ecommerce/leather-bag-gray',
    'samples/ecommerce/accessories-bag',
    'samples/ecommerce/leather-bag-gray',
  ],
  category: 'Unisex Hoodie', isNew: true,
  care: ['Cold machine wash', 'Do not tumble dry', 'Iron inside out', 'Do not bleach'],
}

export default function ProductPage() {
  const { slug } = useParams()
  const { data, isLoading } = useProduct(slug)
  const { addToCart } = useCart()

  const product = data?.product || DUMMY_PRODUCT
  const [selectedSize, setSelectedSize] = useState(null)
  const [activeImg, setActiveImg] = useState(0)
  const [activeTab, setActiveTab] = useState('details')
  const [sizeError, setSizeError] = useState(false)
  const [sizeGuideOpen, setSizeGuideOpen] = useState(false)
  const navigate = useNavigate()

  const handleBuyNow = () => {
    if (!selectedSize) {
      setSizeError(true)
      toast.error('Please select a size')
      return
    }
    setSizeError(false)
    addToCart(product, selectedSize)
    navigate('/checkout')
  }

  const handleAddToCart = () => {
    if (!selectedSize) {
      setSizeError(true)
      toast.error('Please select a size')
      return
    }
    setSizeError(false)
    addToCart(product, selectedSize)
  }

  if (isLoading) {
    return (
      <div className="min-h-screen pt-16 px-6 md:px-16 max-w-screen-xl mx-auto grid md:grid-cols-2 gap-16 py-10">
        <ProductCardSkeleton />
        <div className="space-y-6 pt-10">
          {Array.from({length: 6}).map((_, i) => (
            <div key={i} className="h-4 bg-gray-800 rounded animate-pulse" style={{width: `${80 - i*8}%`}} />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black pt-16">
      {/* Breadcrumb */}
      <div className="px-6 md:px-16 py-6 border-b border-white/5 max-w-screen-xl mx-auto">
        <p className="font-mono text-[10px] text-gray-600 tracking-widest uppercase">
          <Link to="/" className="hover:text-gray-400 transition-colors">Home</Link>
          <span className="mx-3">›</span>
          <Link to="/shop" className="hover:text-gray-400 transition-colors">Shop</Link>
          <span className="mx-3">›</span>
          <span className="text-gray-400">{product.name}</span>
        </p>
      </div>

      <div className="max-w-screen-xl mx-auto px-6 md:px-16 py-12 grid md:grid-cols-2 gap-10 lg:gap-20">
        {/* Images */}
        <div className="flex flex-col md:flex-row gap-4">
          {/* Thumbnail strip */}
          <div className="hidden md:flex flex-col gap-3 w-20 shrink-0">
            {product.images.map((img, i) => (
              <button
                key={i}
                onClick={() => setActiveImg(i)}
                className={`aspect-square overflow-hidden border transition-all duration-300 ${
                  activeImg === i ? 'border-white/50' : 'border-transparent opacity-50 hover:opacity-80'
                }`}
              >
                <img src={cardUrl(img)} alt="" loading="lazy" decoding="async" className="w-full h-full object-cover" />
              </button>
            ))}
          </div>

          {/* Main image wrapper */}
          <div className="flex-1">
            <div className="relative aspect-[3/4] overflow-hidden bg-gray-900">
              <AnimatePresence mode="wait">
                <motion.img
                  key={activeImg}
                  src={sectionUrl(product.images[activeImg])}
                  alt={product.name}
                  initial={{ opacity: 0, scale: 1.04 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.5 }}
                  className="w-full h-full object-cover"
                />
              </AnimatePresence>

              {/* Badges */}
              <div className="absolute top-4 left-4 flex flex-col gap-1.5">
                {product.isNew && (
                  <span className="bg-white text-black text-[9px] font-mono font-bold tracking-widest uppercase px-3 py-1.5">
                    New
                  </span>
                )}
                {product.discount > 0 && (
                  <span className="bg-gray-900 text-accent text-[9px] font-mono tracking-widest uppercase px-3 py-1.5">
                    -{product.discount}%
                  </span>
                )}
              </div>
            </div>

            {/* Horizontal thumbnails for mobile */}
            <div className="flex md:hidden gap-2 mt-3 overflow-x-auto pb-1 scrollbar-none">
              {product.images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setActiveImg(i)}
                  className={`w-14 h-14 shrink-0 overflow-hidden border transition-all duration-300 ${
                    activeImg === i ? 'border-white/50' : 'border-transparent opacity-50'
                  }`}
                >
                  <img src={cardUrl(img)} alt="" loading="lazy" decoding="async" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Product Info */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7 }}
          className="flex flex-col"
        >
          <p className="section-label text-silver mb-3">{product.category}</p>
          <h1 className="font-display text-4xl md:text-5xl lg:text-6xl tracking-wider uppercase text-white leading-tight mb-6">
            {product.name}
          </h1>

          {/* Price */}
          <div className="flex items-center gap-4 mb-8">
            <span className="font-mono text-2xl text-white">{formatINR(product.price)}</span>
            {product.originalPrice && (
              <span className="font-mono text-lg text-gray-600 line-through">{formatINR(product.originalPrice)}</span>
            )}
            {product.discount > 0 && (
              <span className="bg-gray-800 text-accent font-mono text-xs tracking-widest uppercase px-3 py-1">
                Save {formatINR(product.originalPrice - product.price)}
              </span>
            )}
          </div>

          <p className="font-sans text-sm text-gray-400 leading-loose mb-8">
            {product.description}
          </p>

          {/* Size Selector */}
          <div className="mb-8">
            <div className="flex justify-between items-center mb-4">
              <p className="font-mono text-[10px] tracking-widest uppercase text-silver">
                Size {selectedSize && <span className="text-white">— {selectedSize}</span>}
              </p>
              <button
                onClick={() => setSizeGuideOpen(true)}
                className="font-mono text-[10px] tracking-widest uppercase text-gray-600 hover:text-gray-300 border-b border-gray-800 hover:border-gray-600 transition-all"
              >
                Size Guide
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {product.sizes.map(s => (
                <button
                  key={s}
                  onClick={() => { setSelectedSize(s); setSizeError(false) }}
                  className={`min-w-[44px] h-11 px-3 font-mono text-xs border transition-all duration-200 ${
                    selectedSize === s
                      ? 'bg-white text-black border-white'
                      : sizeError
                      ? 'border-red-900/50 text-gray-500 hover:border-white/20 hover:text-gray-300'
                      : 'border-white/10 text-gray-400 hover:border-white/30 hover:text-white'
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
            {sizeError && (
              <p className="font-mono text-[10px] text-red-500 tracking-wider mt-2 uppercase">
                Please select a size
              </p>
            )}
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col gap-3 mb-10">
            <motion.button
              whileTap={{ scale: 0.98 }}
              onClick={handleAddToCart}
              className="btn-primary w-full text-center text-sm py-4"
            >
              Add to Cart
            </motion.button>
            <button
              onClick={handleBuyNow}
              className="btn-outline w-full text-center text-sm py-4"
            >
              Buy Now
            </button>
          </div>

          {/* Tabs */}
          <div className="border-t border-white/5 pt-8">
            <div className="flex gap-8 mb-6">
              {['details', 'care', 'shipping'].map(tab => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`font-mono text-[10px] tracking-widest uppercase pb-2 border-b transition-all duration-200 ${
                    activeTab === tab
                      ? 'text-white border-white'
                      : 'text-gray-600 border-transparent hover:text-gray-400'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                {activeTab === 'details' && (
                  <ul className="space-y-2">
                    {product.details.map((d, i) => (
                      <li key={i} className="flex items-center gap-3 font-sans text-sm text-gray-400">
                        <span className="w-1 h-1 bg-accent rounded-full shrink-0" />
                        {d}
                      </li>
                    ))}
                  </ul>
                )}
                {activeTab === 'care' && (
                  <ul className="space-y-2">
                    {product.care.map((c, i) => (
                      <li key={i} className="flex items-center gap-3 font-sans text-sm text-gray-400">
                        <span className="w-1 h-1 bg-silver rounded-full shrink-0" />
                        {c}
                      </li>
                    ))}
                  </ul>
                )}
                {activeTab === 'shipping' && (
                  <div className="space-y-4 font-sans text-sm text-gray-400">
                    <p>🚚 Free shipping on orders above ₹1299</p>
                    <p>📦 Dispatched within 2-3 business days</p>
                    <p>🔄 Easy 7-day returns on unworn items</p>
                    <p>🇮🇳 Delivering across India</p>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          </div>
        </motion.div>
      </div>

      {/* Size Guide Modal */}
      <AnimatePresence>
        {sizeGuideOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/85 flex items-center justify-center p-6"
            onClick={() => setSizeGuideOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-gray-900 border border-white/10 p-8 max-w-lg w-full relative"
              onClick={e => e.stopPropagation()}
            >
              <button
                onClick={() => setSizeGuideOpen(false)}
                className="absolute top-4 right-4 text-gray-500 hover:text-white transition-colors text-2xl font-light"
              >
                ×
              </button>
              <h3 className="font-display text-2xl tracking-wider uppercase text-white mb-6">SIZE GUIDE</h3>
              <p className="font-sans text-xs text-gray-400 mb-6 leading-relaxed">
                All our hoodies are cut in a signature boxy, oversized fit. If you prefer a standard fit, we recommend ordering one size down.
              </p>
              <table className="w-full text-left font-mono text-xs border-collapse">
                <thead>
                  <tr className="border-b border-white/10 text-gray-400">
                    <th className="py-2">Size</th>
                    <th className="py-2">Chest (in)</th>
                    <th className="py-2">Length (cm)</th>
                  </tr>
                </thead>
                <tbody className="text-gray-300">
                  <tr className="border-b border-white/5"><td className="py-2">XS</td><td className="py-2">42</td><td className="py-2">66</td></tr>
                  <tr className="border-b border-white/5"><td className="py-2">S</td><td className="py-2">44</td><td className="py-2">68</td></tr>
                  <tr className="border-b border-white/5"><td className="py-2">M</td><td className="py-2">46</td><td className="py-2">70</td></tr>
                  <tr className="border-b border-white/5"><td className="py-2">L</td><td className="py-2">48</td><td className="py-2">72</td></tr>
                  <tr className="border-b border-white/5"><td className="py-2">XL</td><td className="py-2">50</td><td className="py-2">74</td></tr>
                  <tr className="border-b border-white/5"><td className="py-2">XXL</td><td className="py-2">52</td><td className="py-2">76</td></tr>
                </tbody>
              </table>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}