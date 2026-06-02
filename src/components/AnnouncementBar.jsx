import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const MESSAGES = [
  '🖤 FREE SHIPPING ABOVE ₹1299 — USE CODE: BINDASS10',
  '⚡ NEW DROP: OVERSIZED HOODIES — LIMITED UNITS',
  '🔥 MEMBER EXCLUSIVE: EARLY ACCESS TO NEXT DROP',
]

export default function AnnouncementBar() {
  const [current, setCurrent] = useState(0)
  const [visible, setVisible] = useState(true)

  if (!visible) return null

  return (
    <div className="bg-white text-black relative z-50 overflow-hidden" style={{ height: '36px' }}>
      <div className="h-full flex items-center justify-center relative">
        <AnimatePresence mode="wait">
          <motion.p
            key={current}
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 20, opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="font-mono text-[10px] tracking-widest3 uppercase text-center px-10"
          >
            {MESSAGES[current]}
          </motion.p>
        </AnimatePresence>

        {/* Cycle through messages */}
        <button
          onClick={() => setCurrent(p => (p - 1 + MESSAGES.length) % MESSAGES.length)}
          className="absolute left-4 text-black/50 hover:text-black transition-colors text-lg font-light"
          aria-label="Previous message"
        >
          ‹
        </button>
        <button
          onClick={() => setCurrent(p => (p + 1) % MESSAGES.length)}
          className="absolute right-10 text-black/50 hover:text-black transition-colors text-lg font-light"
          aria-label="Next message"
        >
          ›
        </button>
        <button
          onClick={() => setVisible(false)}
          className="absolute right-3 text-black/40 hover:text-black transition-colors text-base"
          aria-label="Close"
        >
          ×
        </button>
      </div>
    </div>
  )
}