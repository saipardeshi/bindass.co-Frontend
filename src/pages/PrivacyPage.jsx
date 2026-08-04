import { motion } from 'framer-motion'
import Newsletter from '../components/Newsletter'

export default function PrivacyPage() {
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
          <h1 className="font-display text-5xl md:text-6xl tracking-wider text-white">PRIVACY POLICY</h1>
          <p className="font-sans text-sm text-gray-500 max-w-md mx-auto leading-relaxed">
            Last Updated: August 2026. How we process and protect your personal information.
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
            <h2 className="font-display text-lg text-white uppercase tracking-wider">1. Information We Collect</h2>
            <p>
              We collect information that you directly provide to us, such as when you create an account, purchase products, sign up for our newsletter, or communicate with customer service. This may include your name, email address, shipping and billing addresses, phone number, and transaction information.
            </p>
          </div>

          <div className="space-y-3">
            <h2 className="font-display text-lg text-white uppercase tracking-wider">2. How We Use Your Information</h2>
            <p>
              We use the collected information to process and fulfill your orders, send transaction confirmations, communicate updates, personalize your shopping experience, prevent fraudulent transactions, and send marketing communications if you have subscribed to them.
            </p>
          </div>

          <div className="space-y-3">
            <h2 className="font-display text-lg text-white uppercase tracking-wider">3. Sharing Information</h2>
            <p>
              We do not sell, rent, or trade your personal information. We only share information with verified third-party services that perform functions on our behalf, such as payment processors (Razorpay), shipping services (Delhivery), and hosting providers.
            </p>
          </div>

          <div className="space-y-3">
            <h2 className="font-display text-lg text-white uppercase tracking-wider">4. Data Security</h2>
            <p>
              We implement industry-standard physical, electronic, and managerial security protocols to protect your personal details from unauthorized access, modification, or exposure.
            </p>
          </div>
        </motion.div>
      </div>
      <Newsletter />
    </div>
  )
}
