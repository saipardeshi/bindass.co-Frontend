import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useCart } from '../context/CartContext'
import { formatINR } from '../utils/formatCurrency'
import { cardUrl } from '../utils/cloudinaryHelpers'

export default function ProductCard({ product, index = 0 }) {
  const [hovered, setHovered] = useState(false)
  const [imgIndex, setImgIndex] = useState(0)
  const { addToCart } = useCart()

  const primaryImg = product.images?.[0] || 'placeholder'
  const hoverImg   = product.images?.[1] || product.images?.[0] || 'placeholder'

  const handleQuickAdd = (e) => {
    e.preventDefault()
    e.stopPropagation()
    addToCart(product, product.sizes?.[0] || 'M')
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.6, delay: index * 0.08, ease: [0.22, 1, 0.36, 1] }}
    >
      <Link
        to={`/product/${product.slug}`}
        className="group block"
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        {/* Image container */}
        <div className="relative aspect-[3/4] overflow-hidden bg-gray-900">
          {/* Primary image */}
          <img
            src={cardUrl(primaryImg)}
            alt={product.name}
            loading="lazy"
            decoding="async"
            className={`absolute inset-0 w-full h-full object-cover transition-all duration-700 ${
              hovered ? 'opacity-0 scale-105' : 'opacity-100 scale-100'
            }`}
          />
          {/* Hover image — only fetch once the card is hovered */}
          <img
            src={hovered ? cardUrl(hoverImg) : undefined}
            alt={product.name}
            loading="lazy"
            decoding="async"
            className={`absolute inset-0 w-full h-full object-cover transition-all duration-700 ${
              hovered ? 'opacity-100 scale-100' : 'opacity-0 scale-110'
            }`}
          />

          {/* Badges */}
          <div className="absolute top-3 left-3 flex flex-col gap-1.5">
            {product.isNew && (
              <span className="bg-white text-black text-[9px] font-mono font-bold tracking-widest uppercase px-2.5 py-1">
                New
              </span>
            )}
            {product.isSoldOut && (
              <span className="bg-gray-800 text-gray-400 text-[9px] font-mono tracking-widest uppercase px-2.5 py-1">
                Sold Out
              </span>
            )}
            {product.discount > 0 && (
              <span className="bg-gray-900/90 text-accent text-[9px] font-mono tracking-widest uppercase px-2.5 py-1">
                -{product.discount}%
              </span>
            )}
          </div>

          {/* Quick Add (appears on hover) */}
          {!product.isSoldOut && (
            <motion.button
              initial={{ y: 10, opacity: 0 }}
              animate={hovered ? { y: 0, opacity: 1 } : { y: 10, opacity: 0 }}
              transition={{ duration: 0.3 }}
              onClick={handleQuickAdd}
              className="absolute bottom-3 left-3 right-3 bg-white text-black text-[10px] font-mono font-bold tracking-widest uppercase py-3 hover:bg-accent transition-colors duration-300"
            >
              Quick Add — {product.sizes?.[0] || 'M'}
            </motion.button>
          )}
        </div>

        {/* Info */}
        <div className="mt-4 flex justify-between items-start">
          <div>
            <h3 className="font-sans text-sm font-medium text-white group-hover:text-accent transition-colors duration-300 leading-tight">
              {product.name}
            </h3>
            <p className="font-mono text-[10px] text-gray-500 mt-1 uppercase tracking-widest">
              {product.category || 'Unisex Hoodie'}
            </p>
          </div>
          <div className="text-right">
            <p className="font-mono text-sm text-white">{formatINR(product.price)}</p>
            {product.originalPrice && (
              <p className="font-mono text-[10px] text-gray-600 line-through">
                {formatINR(product.originalPrice)}
              </p>
            )}
          </div>
        </div>

        {/* Size dots */}
        {product.sizes && (
          <div className="mt-2 flex gap-1.5">
            {product.sizes.map(s => (
              <span key={s} className="font-mono text-[9px] text-gray-600 tracking-wider uppercase">
                {s}
              </span>
            ))}
          </div>
        )}
      </Link>
    </motion.div>
  )
}