import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useCart } from '../context/CartContext'
import { formatINR } from '../utils/formatCurrency'
import { createOrder, verifyPayment } from '../api/orders'
import toast from 'react-hot-toast'

const STEPS = ['Address', 'Review', 'Payment']

export default function CheckoutPage() {
  const [step, setStep] = useState(0)
  const [loading, setLoading] = useState(false)
  const { items, cartTotal, clearCart } = useCart()
  const navigate = useNavigate()

  const shipping = cartTotal >= 1299 ? 0 : 99
  const total = cartTotal + shipping

  useEffect(() => {
    // Redirect if cart is empty
    if (items.length === 0) {
      navigate('/cart')
      return
    }

    // Load Razorpay script dynamically
    const scriptId = 'razorpay-checkout-script'
    let script = document.getElementById(scriptId)
    if (!script) {
      script = document.createElement('script')
      script.id = scriptId
      script.src = 'https://checkout.razorpay.com/v1/checkout.js'
      script.async = true
      document.body.appendChild(script)
    }
  }, [items, navigate])

  const [address, setAddress] = useState({
    name: '', phone: '', line1: '', line2: '',
    city: '', state: '', pincode: '', country: 'India',
  })

  const handleChange = e =>
    setAddress(p => ({ ...p, [e.target.name]: e.target.value }))

  const handlePayment = async () => {
    setLoading(true)
    try {
      // 1. Create order on backend
      const { data } = await createOrder({
        items: items.map(i => ({ productId: i._id, size: i.size, quantity: i.quantity })),
        shippingAddress: address,
        totalAmount: total,
      })

      // 2. Open Razorpay
      const resultData = data.data; // ApiResponse's data field
      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: Math.round(resultData.order.totalAmount * 100), // convert to paise
        currency: 'INR',
        name: 'BINDASS',
        description: 'Premium Unisex Hoodies',
        order_id: resultData.razorpayOrderId,
        handler: async (response) => {
          await verifyPayment({
            orderId: resultData.order.id || resultData.order._id,
            razorpayPaymentId: response.razorpay_payment_id,
            razorpayOrderId: response.razorpay_order_id,
            razorpaySignature: response.razorpay_signature,
          })
          clearCart()
          toast.success('Order placed successfully!')
          navigate(`/orders`)
        },
        prefill: { name: address.name, contact: address.phone },
        theme: { color: '#F5F5F0' },
      }

      const rzp = new window.Razorpay(options)
      rzp.open()
    } catch (err) {
      console.error('Payment error:', err)
      const msg = err?.response?.data?.message || err?.message || 'Payment failed. Please try again.'
      toast.error(msg)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-black pt-16">
      <div className="max-w-3xl mx-auto px-6 py-16">
        {/* Steps */}
        <div className="flex items-center gap-0 mb-16">
          {STEPS.map((s, i) => (
            <div key={s} className="flex items-center">
              <button
                onClick={() => i < step && setStep(i)}
                className={`flex items-center gap-2 font-mono text-[10px] tracking-widest uppercase transition-colors ${
                  i <= step ? 'text-white' : 'text-gray-700'
                }`}
              >
                <span className={`w-6 h-6 rounded-full border flex items-center justify-center text-[9px] ${
                  i < step ? 'bg-white text-black border-white' :
                  i === step ? 'border-white text-white' :
                  'border-gray-800 text-gray-700'
                }`}>
                  {i < step ? '✓' : i + 1}
                </span>
                {s}
              </button>
              {i < STEPS.length - 1 && (
                <div className={`w-16 h-px mx-4 ${i < step ? 'bg-white/30' : 'bg-gray-800'}`} />
              )}
            </div>
          ))}
        </div>

        {/* Step 0 — Address */}
        {step === 0 && (
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
            <h2 className="font-display text-4xl tracking-wider uppercase text-white mb-8">
              SHIPPING ADDRESS
            </h2>
            <div className="grid grid-cols-2 gap-4">
              {[
                { name: 'name', label: 'Full Name', col: 2 },
                { name: 'phone', label: 'Phone', col: 1 },
                { name: 'pincode', label: 'Pincode', col: 1 },
                { name: 'line1', label: 'Address Line 1', col: 2 },
                { name: 'line2', label: 'Address Line 2 (optional)', col: 2 },
                { name: 'city', label: 'City', col: 1 },
                { name: 'state', label: 'State', col: 1 },
              ].map(f => (
                <div key={f.name} className={`${f.col === 2 ? 'col-span-2' : 'col-span-1'}`}>
                  <label className="section-label text-gray-600 mb-2 block">{f.label}</label>
                  <input
                    name={f.name}
                    value={address[f.name]}
                    onChange={handleChange}
                    className="w-full bg-gray-900 border border-white/8 text-white font-sans text-sm px-4 py-3.5
                               focus:outline-none focus:border-white/20 transition-colors placeholder-gray-700"
                  />
                </div>
              ))}
            </div>
            <button
              onClick={() => {
                const required = ['name', 'phone', 'line1', 'city', 'state', 'pincode']
                const missing = required.filter(k => !address[k].trim())
                if (missing.length > 0) {
                  toast.error('Please fill in all required fields')
                  return
                }
                setStep(1)
              }}
              className="btn-primary mt-8 px-12"
            >
              Continue to Review
            </button>
          </motion.div>
        )}

        {/* Step 1 — Review */}
        {step === 1 && (
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
            <h2 className="font-display text-4xl tracking-wider uppercase text-white mb-8">
              ORDER REVIEW
            </h2>
            <div className="space-y-4 mb-8">
              {items.map(item => (
                <div key={`${item._id}-${item.size}`} className="flex justify-between items-center py-4 border-b border-white/5">
                  <div>
                    <p className="font-sans text-sm text-white">{item.name}</p>
                    <p className="font-mono text-[10px] text-gray-600 tracking-widest uppercase mt-0.5">
                      Size: {item.size} · Qty: {item.quantity}
                    </p>
                  </div>
                  <span className="font-mono text-sm text-white">{formatINR(item.price * item.quantity)}</span>
                </div>
              ))}
            </div>
            <div className="border border-white/5 p-6 mb-8 space-y-2">
              <p className="font-mono text-[10px] text-gray-600 tracking-widest uppercase mb-4">
                Delivering To
              </p>
              <p className="font-sans text-sm text-white">{address.name}</p>
              <p className="font-sans text-sm text-gray-400">
                {address.line1}, {address.city}, {address.state} — {address.pincode}
              </p>
              <p className="font-sans text-sm text-gray-400">{address.phone}</p>
            </div>
            <div className="flex gap-4">
              <button onClick={() => setStep(0)} className="btn-outline px-8">Back</button>
              <button onClick={() => setStep(2)} className="btn-primary px-12">Proceed to Pay</button>
            </div>
          </motion.div>
        )}

        {/* Step 2 — Payment */}
        {step === 2 && (
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
            <h2 className="font-display text-4xl tracking-wider uppercase text-white mb-8">
              PAYMENT
            </h2>
            <div className="border border-white/5 p-8 mb-8 text-center space-y-4">
              <div>
                <p className="section-label text-silver mb-1 text-[10px]">Subtotal</p>
                <p className="font-mono text-lg text-gray-400">{formatINR(cartTotal)}</p>
              </div>
              {shipping > 0 ? (
                <div>
                  <p className="section-label text-silver mb-1 text-[10px]">Shipping</p>
                  <p className="font-mono text-lg text-gray-400">{formatINR(shipping)}</p>
                </div>
              ) : (
                <div>
                  <p className="section-label text-silver mb-1 text-[10px]">Shipping</p>
                  <p className="font-mono text-lg text-accent">FREE</p>
                </div>
              )}
              <div className="border-t border-white/5 pt-4">
                <p className="section-label text-silver mb-1 text-[10px]">Total to Pay</p>
                <p className="font-mono text-4xl text-white font-bold">{formatINR(total)}</p>
              </div>
            </div>
            <p className="font-sans text-xs text-gray-600 mb-6 leading-relaxed text-center">
              You'll be redirected to Razorpay's secure payment gateway. We accept UPI, debit/credit cards, and net banking.
            </p>
            <div className="flex gap-4 justify-center">
              <button onClick={() => setStep(1)} className="btn-outline px-8">Back</button>
              <button
                onClick={handlePayment}
                disabled={loading}
                className="btn-primary px-12 disabled:opacity-50"
              >
                {loading ? 'Processing...' : `Pay ${formatINR(total)}`}
              </button>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  )
}