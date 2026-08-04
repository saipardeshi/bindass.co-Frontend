import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Newsletter from '../components/Newsletter'

export default function FaqPage() {
  const FAQS = [
    {
      q: 'What makes BINDASS hoodies different?',
      a: 'Our hoodies are constructed using custom-milled high GSM French terry fabrics, designed for a luxury drop-shoulder look, heavy-weight comfort, and durable shape rentention over washes. Every detail has been obsessively tested.'
    },
    {
      q: 'How do I care for my oversized hoodies?',
      a: 'We recommend washing your hoodies inside out in cold water on a gentle cycle. Hang drying is highly recommended to protect the premium cotton fibers and avoid any minor fabric shrinkage.'
    },
    {
      q: 'Can I cancel or modify my order after placing it?',
      a: 'Since we process orders quickly to ship within 24 hours, you can only cancel or modify your order by emailing support@bindass.co within 2 hours of placing the order.'
    },
    {
      q: 'What payment methods do you accept?',
      a: 'We support all major payment options, including credit/debit cards, UPI payments, net banking, and secure digital wallets via our Razorpay integration.'
    },
    {
      q: 'Do you restock sold-out pieces?',
      a: 'To keep our collection exclusive and reduce carbon footprint, we make our collections in limited production runs. Once sold out, they are rarely restocked unless there is exceptional demand.'
    }
  ]

  const [openIndex, setOpenIndex] = useState(null)

  return (
    <div className="min-h-screen bg-black pt-28 pb-12">
      <div className="max-w-3xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="space-y-4 text-center mb-16"
        >
          <p className="section-label text-accent uppercase tracking-widest">HELP & SUPPORT</p>
          <h1 className="font-display text-5xl md:text-6xl tracking-wider text-white">FREQUENTLY ASKED QUESTIONS</h1>
          <p className="font-sans text-sm text-gray-500 max-w-md mx-auto leading-relaxed">
            Quick answers to the most common questions regarding our collections, sizing, and policies.
          </p>
        </motion.div>

        {/* FAQs Accordion */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="space-y-4 mb-20"
        >
          {FAQS.map((faq, idx) => {
            const isOpen = openIndex === idx
            return (
              <div 
                key={idx} 
                className="border border-white/5 bg-gray-950/40 rounded-lg overflow-hidden backdrop-blur-md transition-colors duration-300"
              >
                <button
                  onClick={() => setOpenIndex(isOpen ? null : idx)}
                  className="w-full flex items-center justify-between p-6 text-left"
                >
                  <span className="font-display text-base md:text-lg text-white uppercase tracking-wider">
                    {faq.q}
                  </span>
                  <span className="text-silver ml-4 font-mono text-xl">
                    {isOpen ? '—' : '+'}
                  </span>
                </button>
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: 'easeInOut' }}
                    >
                      <div className="px-6 pb-6 pt-0 font-sans text-sm text-gray-400 leading-relaxed border-t border-white/5">
                        <p className="pt-4">{faq.a}</p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )
          })}
        </motion.div>
      </div>
      <Newsletter />
    </div>
  )
}
