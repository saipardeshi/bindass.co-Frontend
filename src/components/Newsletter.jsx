import { useState } from 'react'
import { motion } from 'framer-motion'
import axios from '../api/axiosClient'
import toast from 'react-hot-toast'

export default function Newsletter() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [done, setDone] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!email) return
    setLoading(true)
    try {
      await axios.post('/api/newsletter/subscribe', { email })
      setDone(true)
      toast.success('You\'re on the list!')
    } catch {
      toast.error('Something went wrong. Try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <section className="border-t border-white/5 py-24 px-6 md:px-10 bg-gray-950">
      <div className="max-w-screen-xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="text-center max-w-xl mx-auto"
        >
          <p className="section-label text-silver mb-6">Stay in the Loop</p>
          <h2 className="font-display text-5xl md:text-7xl tracking-wider mb-4 uppercase">
            GET FIRST ACCESS
          </h2>
          <p className="font-sans text-sm text-gray-500 mb-10 leading-relaxed">
            New drops. Exclusive collabs. Member-only discounts.
            Join the BINDASS inner circle.
          </p>

          {done ? (
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="font-mono text-accent tracking-wider text-sm uppercase"
            >
              ✓ Welcome to the family
            </motion.div>
          ) : (
            <form onSubmit={handleSubmit} className="flex gap-0 max-w-md mx-auto">
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="your@email.com"
                required
                className="flex-1 bg-gray-900 border border-white/10 text-white font-sans text-sm px-5 py-4 
                           placeholder-gray-600 focus:outline-none focus:border-white/30 transition-colors"
              />
              <button
                type="submit"
                disabled={loading}
                className="bg-white text-black font-mono text-[10px] tracking-widest uppercase px-6 py-4 
                           hover:bg-accent transition-colors duration-300 disabled:opacity-50 whitespace-nowrap"
              >
                {loading ? '...' : 'JOIN'}
              </button>
            </form>
          )}
        </motion.div>
      </div>
    </section>
  )
}