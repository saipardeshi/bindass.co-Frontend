import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import Newsletter from '../components/Newsletter'
import { heroUrl } from '../utils/cloudinaryHelpers'

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-black pt-16">
      {/* Hero */}
      <section className="relative h-[60vh] overflow-hidden bg-black">
        <img
          src={heroUrl('WrinkledT_Blog_-_Sustainable_Fashion_Brand_1_qwfykb')}
          alt="About BINDASS"
          className="absolute w-full object-contain"
style={{ top: 0, left: 0, opacity: 0.85, mixBlendMode: 'lighten' }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black" />
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="absolute inset-0 flex flex-col items-center justify-center text-center px-6"
        >
          <p className="section-label text-silver mb-6">Est. 2024</p>
          <h1 className="font-display text-[12vw] md:text-[8vw] tracking-wider uppercase text-white leading-none">
            OUR STORY
          </h1>
        </motion.div>
      </section>

      {/* Content */}
      <section className="max-w-3xl mx-auto px-6 py-24 space-y-24">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="space-y-8"
        >
          <p className="font-sans text-lg text-gray-300 leading-loose">
            BINDASS was born from a simple belief: that streetwear should feel as premium as it looks.
            Founded in Mumbai in 2024, we set out to create pieces that challenge the norm — oversized,
            unisex, and built for those who refuse to blend in.
          </p>
          <p className="font-sans text-sm text-gray-500 leading-loose">
            Every hoodie in our collection is crafted with obsessive attention to detail.
            From the GSM weight of our French terry fabric to the exact drop of our shoulders —
            nothing is accidental. This is precision streetwear.
          </p>
        </motion.div>

        {/* Mission section */}
        <motion.div
          id="mission"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="space-y-6 scroll-mt-24"
        >
          <p className="section-label text-silver">01 / Mission</p>
          <h2 className="font-display text-4xl tracking-wider text-white">OUR MISSION</h2>
          <p className="font-sans text-sm text-gray-400 leading-loose">
            To create precision-tailored pieces that empower the modern generation to express their authentic identity.
            Fashion that speaks before you do. We commit to setting new benchmarks in quality, fit, and aesthetic design.
          </p>
        </motion.div>

        {/* Vision section */}
        <motion.div
          id="vision"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="space-y-6 scroll-mt-24"
        >
          <p className="section-label text-silver">02 / Vision</p>
          <h2 className="font-display text-4xl tracking-wider text-white">OUR VISION</h2>
          <p className="font-sans text-sm text-gray-400 leading-loose">
            To become India's most coveted streetwear brand — where dark luxury meets raw street culture.
            Global in reach, fearless in spirit. We aim to form a tribe of modern disruptors who define culture rather than follow it.
          </p>
        </motion.div>
      </section>

      <Newsletter />
    </div>
  )
}