import { motion } from 'framer-motion'
import Newsletter from '../components/Newsletter'

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-black pt-28 pb-12">
      <div className="max-w-3xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="space-y-4 text-center mb-16"
        >
          <p className="section-label text-accent uppercase tracking-widest">LEGAL</p>
          <h1 className="font-display text-5xl md:text-6xl tracking-wider text-white">TERMS OF USE</h1>
          <p className="font-sans text-sm text-gray-500 max-w-md mx-auto leading-relaxed">
            Last Updated: August 2026. Rules and guidelines for browsing and shopping at BINDASS.
          </p>
        </motion.div>

        {/* Content */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="font-sans text-sm text-gray-400 leading-loose space-y-8 mb-20"
        >
          <div className="space-y-3">
            <h2 className="font-display text-lg text-white uppercase tracking-wider">1. Agreement to Terms</h2>
            <p>
              By accessing our website (bindass.co) and purchasing items, you agree to comply with and be bound by these Terms of Use and our Privacy Policy. If you do not agree, please do not use our services.
            </p>
          </div>

          <div className="space-y-3">
            <h2 className="font-display text-lg text-white uppercase tracking-wider">2. Account Responsibility</h2>
            <p>
              When creating an account on BINDASS, you are responsible for maintaining the confidentiality of your login details and credentials, and you agree to accept responsibility for all activities that occur under your account.
            </p>
          </div>

          <div className="space-y-3">
            <h2 className="font-display text-lg text-white uppercase tracking-wider">3. Pricing and Availability</h2>
            <p>
              All prices shown on the website are in Indian Rupees (INR) and are inclusive of tax unless stated otherwise. We reserve the right to change product pricing and availability at any time without prior notice.
            </p>
          </div>

          <div className="space-y-3">
            <h2 className="font-display text-lg text-white uppercase tracking-wider">4. Intellectual Property</h2>
            <p>
              All website content, layout design, graphics, logo emblems, product patterns, and digital imagery belong exclusively to BINDASS.CO and are protected by international copyright laws.
            </p>
          </div>
        </motion.div>
      </div>
      <Newsletter />
    </div>
  )
}
