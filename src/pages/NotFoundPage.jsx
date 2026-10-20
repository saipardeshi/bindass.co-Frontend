import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'

export default function NotFoundPage() {
  return (
    <div className="min-h-screen bg-black pt-24 pb-16 flex items-center justify-center px-6">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        className="max-w-xl text-center"
      >
        <span className="font-mono text-[10px] tracking-widest uppercase text-accent mb-4 inline-block">
          STATUS 404 · NOT FOUND
        </span>
        <h1 className="font-display text-8xl md:text-9xl tracking-widest text-white/90 mb-4 select-none">
          404
        </h1>
        <h2 className="font-display text-3xl md:text-4xl tracking-wider uppercase text-white mb-6">
          LOST IN THE SHADOWS
        </h2>
        <p className="font-sans text-sm text-gray-400 mb-12 leading-relaxed max-w-md mx-auto">
          The piece, drop, or page you are looking for has been archived or does not exist in this realm.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link to="/" className="btn-primary py-4 px-8 text-xs font-mono uppercase tracking-widest">
            Back to Home
          </Link>
          <Link to="/shop" className="btn-outline py-4 px-8 text-xs font-mono uppercase tracking-widest">
            Explore Collection
          </Link>
          <Link to="/cart" className="btn-outline py-4 px-6 text-xs font-mono uppercase tracking-widest text-gray-400 hover:text-white">
            View Cart
          </Link>
        </div>
      </motion.div>
    </div>
  )
}
