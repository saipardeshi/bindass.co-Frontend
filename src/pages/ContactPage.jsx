import { useState } from 'react'
import { motion } from 'framer-motion'
import { toast } from 'react-hot-toast'
import Newsletter from '../components/Newsletter'

export default function ContactPage() {
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' })
  const [loading, setLoading] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    setLoading(true)
    setTimeout(() => {
      setLoading(false)
      toast.success('Your message has been sent successfully!')
      setFormData({ name: '', email: '', subject: '', message: '' })
    }, 1500)
  }

  return (
    <div className="min-h-screen bg-black pt-28 pb-12">
      <div className="max-w-5xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="space-y-4 text-center mb-16"
        >
          <p className="section-label text-accent uppercase tracking-widest">GET IN TOUCH</p>
          <h1 className="font-display text-5xl md:text-6xl tracking-wider text-white">CONTACT US</h1>
          <p className="font-sans text-sm text-gray-500 max-w-md mx-auto leading-relaxed">
            Have questions about sizing, delivery, or custom orders? Drop us a line.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-5 gap-12 mb-20">
          {/* Contact info info */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="md:col-span-2 space-y-10"
          >
            <div className="space-y-4">
              <h3 className="font-display text-xl text-white uppercase tracking-wider">EMAIL</h3>
              <p className="font-mono text-sm text-gray-400 hover:text-white transition-colors">
                <a href="mailto:support@bindass.co">support@bindass.co</a>
              </p>
            </div>
            
            <div className="space-y-4">
              <h3 className="font-display text-xl text-white uppercase tracking-wider">OFFICE ADDRESS</h3>
              <p className="font-sans text-sm text-gray-400 leading-relaxed">
                BINDASS HQ<br />
                Bandera West, Mumbai — 400050<br />
                Maharashtra, India
              </p>
            </div>

            <div className="space-y-4">
              <h3 className="font-display text-xl text-white uppercase tracking-wider">SOCIALS</h3>
              <p className="font-mono text-sm text-gray-400 leading-relaxed">
                Instagram: <a href="https://instagram.com/bindass.co" target="_blank" rel="noopener noreferrer" className="hover:text-white">@bindass.co</a><br />
                Pinterest: <a href="https://pinterest.com/bindass" target="_blank" rel="noopener noreferrer" className="hover:text-white">@bindass</a>
              </p>
            </div>
          </motion.div>

          {/* Contact form */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="md:col-span-3 border border-white/5 bg-gray-950/40 p-8 rounded-lg backdrop-blur-md"
          >
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="font-mono text-[10px] text-gray-400 tracking-wider uppercase">Name</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                    className="w-full bg-black/60 border border-white/10 rounded px-4 py-3 text-sm text-white focus:border-white focus:outline-none transition-colors"
                  />
                </div>
                <div className="space-y-2">
                  <label className="font-mono text-[10px] text-gray-400 tracking-wider uppercase">Email</label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={e => setFormData({ ...formData, email: e.target.value })}
                    className="w-full bg-black/60 border border-white/10 rounded px-4 py-3 text-sm text-white focus:border-white focus:outline-none transition-colors"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="font-mono text-[10px] text-gray-400 tracking-wider uppercase">Subject</label>
                <input
                  type="text"
                  required
                  value={formData.subject}
                  onChange={e => setFormData({ ...formData, subject: e.target.value })}
                  className="w-full bg-black/60 border border-white/10 rounded px-4 py-3 text-sm text-white focus:border-white focus:outline-none transition-colors"
                />
              </div>
              <div className="space-y-2">
                <label className="font-mono text-[10px] text-gray-400 tracking-wider uppercase">Message</label>
                <textarea
                  required
                  rows={5}
                  value={formData.message}
                  onChange={e => setFormData({ ...formData, message: e.target.value })}
                  className="w-full bg-black/60 border border-white/10 rounded px-4 py-3 text-sm text-white focus:border-white focus:outline-none transition-colors resize-none"
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="btn-primary w-full text-center"
              >
                {loading ? 'SENDING...' : 'SEND MESSAGE'}
              </button>
            </form>
          </motion.div>
        </div>
      </div>
      <Newsletter />
    </div>
  )
}
