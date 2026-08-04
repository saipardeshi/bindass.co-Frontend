import { motion } from 'framer-motion'
import Newsletter from '../components/Newsletter'

export default function SustainabilityPage() {
  return (
    <div className="min-h-screen bg-black pt-28 pb-12">
      <div className="max-w-4xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="space-y-4 text-center mb-16"
        >
          <p className="section-label text-accent uppercase tracking-widest">OUR COMMITMENT</p>
          <h1 className="font-display text-5xl md:text-6xl tracking-wider text-white">SUSTAINABILITY</h1>
          <p className="font-sans text-sm text-gray-500 max-w-md mx-auto leading-relaxed">
            Streetwear shouldn't compromise the future. We build luxury basics with conscious craftsmanship.
          </p>
        </motion.div>

        {/* Pillars */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="grid md:grid-cols-3 gap-8 mb-20"
        >
          <div className="border border-white/5 bg-gray-950/40 p-8 rounded-lg backdrop-blur-md space-y-4">
            <p className="font-mono text-xs text-accent uppercase tracking-widest">01</p>
            <h3 className="font-display text-lg text-white uppercase tracking-wider">Small Batches</h3>
            <p className="font-sans text-sm text-gray-400 leading-relaxed">
              We design in highly controlled, limited quantities. By preventing deadstock and excess inventory, we ensure zero textile waste hits landfills.
            </p>
          </div>

          <div className="border border-white/5 bg-gray-950/40 p-8 rounded-lg backdrop-blur-md space-y-4">
            <p className="font-mono text-xs text-accent uppercase tracking-widest">02</p>
            <h3 className="font-display text-lg text-white uppercase tracking-wider">Organic Milled</h3>
            <p className="font-sans text-sm text-gray-400 leading-relaxed">
              Our custom-weight French terry is constructed using ethically grown organic cotton. Our dyes are eco-certified and free from toxic synthetic runoff.
            </p>
          </div>

          <div className="border border-white/5 bg-gray-950/40 p-8 rounded-lg backdrop-blur-md space-y-4">
            <p className="font-mono text-xs text-accent uppercase tracking-widest">03</p>
            <h3 className="font-display text-lg text-white uppercase tracking-wider">Ethical Labor</h3>
            <p className="font-sans text-sm text-gray-400 leading-relaxed">
              Every BINDASS piece is fabricated by skilled craftspeople in facilities that prioritize fair wages, healthy working environments, and human dignity.
            </p>
          </div>
        </motion.div>

        {/* Philosophy Block */}
        <div className="border border-white/5 bg-gray-950/40 p-10 rounded-lg backdrop-blur-md text-center max-w-2xl mx-auto mb-20 space-y-4">
          <h3 className="font-display text-xl text-white uppercase tracking-wider">Circular Streetwear</h3>
          <p className="font-sans text-sm text-gray-400 leading-loose">
            "We build pieces intended to last a lifetime. Our goal is to shift fashion away from fast-disposable clothing cycles to premium pieces that grow character and remain timeless."
          </p>
        </div>
      </div>
      <Newsletter />
    </div>
  )
}
