import { motion } from 'framer-motion'
import Newsletter from '../components/Newsletter'

export default function ShippingReturnsPage() {
  return (
    <div className="min-h-screen bg-black pt-28 pb-12">
      <div className="max-w-4xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="space-y-4 text-center mb-16"
        >
          <p className="section-label text-accent uppercase tracking-widest">LOGISTICS</p>
          <h1 className="font-display text-5xl md:text-6xl tracking-wider text-white">SHIPPING & RETURNS</h1>
          <p className="font-sans text-sm text-gray-500 max-w-md mx-auto leading-relaxed">
            Hassle-free shipping and simple returns. We are committed to making your shopping experience effortless.
          </p>
        </motion.div>

        {/* Content sections */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="space-y-12 mb-20"
        >
          {/* Shipping Policy */}
          <div className="border border-white/5 bg-gray-950/40 p-8 rounded-lg backdrop-blur-md space-y-6">
            <h2 className="font-display text-2xl text-white uppercase tracking-wider">Domestic Shipping</h2>
            <div className="grid md:grid-cols-2 gap-8 text-sm text-gray-300 font-sans leading-relaxed">
              <div className="space-y-3">
                <p className="font-bold text-white uppercase text-xs tracking-wider">Processing Timeline</p>
                <p className="text-gray-400">
                  All orders are processed and prepared for shipping within 24 to 48 business hours. Orders placed over weekends or national holidays will be processed on the next business day.
                </p>
              </div>
              <div className="space-y-3">
                <p className="font-bold text-white uppercase text-xs tracking-wider">Delivery Rates & Speed</p>
                <p className="text-gray-400">
                  We offer free standard shipping all across India. Once shipped, standard delivery takes 3 to 5 business days to reach major metro areas and up to 7 business days for rural locations.
                </p>
              </div>
            </div>
          </div>

          {/* Returns & Exchanges */}
          <div className="border border-white/5 bg-gray-950/40 p-8 rounded-lg backdrop-blur-md space-y-6">
            <h2 className="font-display text-2xl text-white uppercase tracking-wider">Returns & Exchanges</h2>
            <div className="grid md:grid-cols-2 gap-8 text-sm text-gray-300 font-sans leading-relaxed">
              <div className="space-y-3">
                <p className="font-bold text-white uppercase text-xs tracking-wider">7-Day Return Window</p>
                <p className="text-gray-400">
                  If the item doesn't fit or suit you, you can initiate a return or exchange within 7 days of receiving your package. Items must be unworn, unwashed, with all original tags attached.
                </p>
              </div>
              <div className="space-y-3">
                <p className="font-bold text-white uppercase text-xs tracking-wider">Exchanges & Refunds</p>
                <p className="text-gray-400">
                  Exchanges are free of cost. Refunds are credited back to your original payment method within 5-7 business days after our quality checking team inspects and approves the returned items.
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
      <Newsletter />
    </div>
  )
}
