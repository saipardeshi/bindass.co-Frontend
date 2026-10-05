import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useCart } from '../context/CartContext'
import { formatINR } from '../utils/formatCurrency'
import { thumbUrl } from '../utils/cloudinaryHelpers'

export default function CartPage() {
  const { items, removeFromCart, updateQuantity, cartTotal, clearCart } = useCart()

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-black pt-16 flex flex-col items-center justify-center gap-8 px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <p className="font-display text-8xl md:text-[12rem] tracking-wider text-gray-900 mb-6">0</p>
          <p className="section-label text-silver mb-2">Your Cart</p>
          <h1 className="font-display text-4xl tracking-wider uppercase text-white mb-6">IS EMPTY</h1>
          <p className="font-sans text-sm text-gray-500 mb-10">Looks like you haven't added anything yet.</p>
          <Link to="/shop" className="btn-primary">Shop Now</Link>
        </motion.div>
      </div>
    )
  }

  const shipping = cartTotal >= 1299 ? 0 : 99
  const total = cartTotal + shipping

  return (
    <div className="min-h-screen bg-black pt-16">
      <div className="max-w-screen-xl mx-auto px-6 md:px-16 py-16">
        <div className="flex justify-between items-end mb-12">
          <div>
            <p className="section-label text-silver mb-2">Your</p>
            <h1 className="font-display text-6xl tracking-wider uppercase text-white">CART</h1>
          </div>
          <button
            onClick={clearCart}
            className="font-mono text-[10px] tracking-widest uppercase text-gray-600 hover:text-gray-300 transition-colors border-b border-gray-800 hover:border-gray-600 pb-0.5"
          >
            Clear All
          </button>
        </div>

        <div className="grid lg:grid-cols-3 gap-12">
          {/* Items */}
          <div className="lg:col-span-2 space-y-0">
            <AnimatePresence>
              {items.map((item, i) => (
                <motion.div
                  key={`${item._id}-${item.size}`}
                  layout
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20, height: 0 }}
                  transition={{ duration: 0.4 }}
                  className="flex gap-6 py-8 border-b border-white/5"
                >
                  {/* Image */}
                  <div className="w-24 md:w-32 aspect-[3/4] bg-gray-900 shrink-0 overflow-hidden">
                    <img
                      src={thumbUrl(item.images?.[0] || 'samples/ecommerce/leather-bag-gray')}
                      alt={item.name}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Info */}
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <h3 className="font-sans text-sm font-medium text-white mb-1">{item.name}</h3>
                      <p className="font-mono text-[10px] text-gray-600 tracking-widest uppercase">
                        Size: {item.size} &nbsp;·&nbsp; Unisex Hoodie
                      </p>
                    </div>

                    <div className="flex items-center justify-between mt-4">
                      {/* Qty */}
                      <div className="flex items-center border border-white/10">
                        <button
                          onClick={() => updateQuantity(item._id, item.size, item.quantity - 1)}
                          className="w-9 h-9 text-gray-400 hover:text-white transition-colors flex items-center justify-center font-light text-lg"
                        >
                          −
                        </button>
                        <span className="w-8 text-center font-mono text-xs text-white">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item._id, item.size, item.quantity + 1)}
                          className="w-9 h-9 text-gray-400 hover:text-white transition-colors flex items-center justify-center font-light text-lg"
                        >
                          +
                        </button>
                      </div>

                      {/* Price + Remove */}
                      <div className="flex items-center gap-6">
                        <span className="font-mono text-sm text-white">
                          {formatINR(item.price * item.quantity)}
                        </span>
                        <button
                          onClick={() => removeFromCart(item._id, item.size)}
                          className="font-mono text-[10px] text-gray-700 hover:text-gray-300 tracking-widest uppercase transition-colors"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {/* Summary */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="border border-white/5 p-8 h-fit sticky top-24"
          >
            <h2 className="font-display text-3xl tracking-wider uppercase text-white mb-8">
              ORDER SUMMARY
            </h2>

            <div className="space-y-4 mb-8">
              <div className="flex justify-between font-sans text-sm">
                <span className="text-gray-500">Subtotal</span>
                <span className="text-white">{formatINR(cartTotal)}</span>
              </div>
              <div className="flex justify-between font-sans text-sm">
                <span className="text-gray-500">Shipping</span>
                <span className={shipping === 0 ? 'text-accent' : 'text-white'}>
                  {shipping === 0 ? 'FREE' : formatINR(shipping)}
                </span>
              </div>
              {shipping > 0 && cartTotal < 1299 && (
                <p className="font-mono text-[9px] text-gray-600 tracking-wider uppercase">
                  Add {formatINR(Math.max(0, 1299 - cartTotal))} more for free shipping
                </p>
              )}
              <div className="border-t border-white/5 pt-4 flex justify-between">
                <span className="font-sans font-medium text-white">Total</span>
                <span className="font-mono text-xl text-white">{formatINR(total)}</span>
              </div>
            </div>

            {/* Promo Code */}
            <div className="flex gap-0 mb-6">
              <input
                type="text"
                placeholder="Promo code"
                className="flex-1 bg-gray-900 border border-white/10 text-white font-mono text-[10px] tracking-widest uppercase px-4 py-3 placeholder-gray-700 focus:outline-none focus:border-white/20"
              />
              <button className="bg-gray-800 text-white font-mono text-[9px] tracking-widest uppercase px-5 hover:bg-gray-700 transition-colors border border-white/10 border-l-0">
                Apply
              </button>
            </div>

            <Link to="/checkout" className="btn-primary w-full text-center block py-4">
              Checkout
            </Link>
            <Link to="/shop" className="block text-center font-mono text-[10px] tracking-widest uppercase text-gray-600 hover:text-gray-300 transition-colors mt-4">
              Continue Shopping
            </Link>
          </motion.div>
        </div>
      </div>
    </div>
  )
}