import { motion } from 'framer-motion'
import Newsletter from '../components/Newsletter'

export default function SizeGuidePage() {
  const SIZES = [
    { size: 'XS', chest: '44"', length: '27.5"', shoulder: '21.5"', sleeve: '22"' },
    { size: 'S', chest: '46"', length: '28"', shoulder: '22"', sleeve: '22.5"' },
    { size: 'M', chest: '48"', length: '28.5"', shoulder: '22.5"', sleeve: '23"' },
    { size: 'L', chest: '50"', length: '29"', shoulder: '23.5"', sleeve: '23.5"' },
    { size: 'XL', chest: '52"', length: '30"', shoulder: '24.5"', sleeve: '24"' },
    { size: 'XXL', chest: '54"', length: '30.5"', shoulder: '25.5"', sleeve: '24.5"' },
  ]

  return (
    <div className="min-h-screen bg-black pt-28 pb-12">
      <div className="max-w-4xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="space-y-4 text-center mb-16"
        >
          <p className="section-label text-accent uppercase tracking-widest">FIT GUIDE</p>
          <h1 className="font-display text-5xl md:text-6xl tracking-wider text-white">SIZE GUIDE</h1>
          <p className="font-sans text-sm text-gray-500 max-w-md mx-auto leading-relaxed">
            All BINDASS hoodies are cut in a signature oversized, drop-shoulder silhouette. 
            We recommend ordering your standard size for the intended relaxed look.
          </p>
        </motion.div>

        {/* Table container */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="border border-white/5 bg-gray-950/40 p-6 md:p-8 rounded-lg backdrop-blur-md mb-16"
        >
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-white/10 text-mono text-xs tracking-widest text-silver uppercase">
                  <th className="py-4">Size</th>
                  <th className="py-4">Chest Width</th>
                  <th className="py-4">Length</th>
                  <th className="py-4">Shoulder</th>
                  <th className="py-4">Sleeve Length</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 font-sans text-sm text-gray-300">
                {SIZES.map((s, i) => (
                  <tr key={i} className="hover:bg-white/2 transition-colors">
                    <td className="py-4 font-mono font-bold text-white text-base">{s.size}</td>
                    <td className="py-4">{s.chest}</td>
                    <td className="py-4">{s.length}</td>
                    <td className="py-4">{s.shoulder}</td>
                    <td className="py-4">{s.sleeve}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>

        {/* How to Measure Section */}
        <div className="grid md:grid-cols-3 gap-8 mb-20 text-center md:text-left">
          <div className="space-y-3">
            <h3 className="font-display text-lg text-white uppercase tracking-wider">01 / Chest</h3>
            <p className="font-sans text-xs text-gray-500 leading-relaxed">
              Measure around the fullest part of your chest, keeping the tape horizontal.
            </p>
          </div>
          <div className="space-y-3">
            <h3 className="font-display text-lg text-white uppercase tracking-wider">02 / Body Length</h3>
            <p className="font-sans text-xs text-gray-500 leading-relaxed">
              Measure from the highest point of the shoulder down to the hem.
            </p>
          </div>
          <div className="space-y-3">
            <h3 className="font-display text-lg text-white uppercase tracking-wider">03 / Shoulder</h3>
            <p className="font-sans text-xs text-gray-500 leading-relaxed">
              Measure straight across your back from the edge of one shoulder bone to the other.
            </p>
          </div>
        </div>
      </div>
      <Newsletter />
    </div>
  )
}
