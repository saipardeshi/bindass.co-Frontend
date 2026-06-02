import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuth } from '../context/AuthContext'
import toast from 'react-hot-toast'

export default function AuthPage() {
  const [mode, setMode] = useState('login') // 'login' | 'register'
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({ name: '', email: '', password: '' })
  const { login, register } = useAuth()
  const navigate = useNavigate()

  const handleChange = e => setForm(p => ({ ...p, [e.target.name]: e.target.value }))

  const handleSubmit = async e => {
    e.preventDefault()
    setLoading(true)
    try {
      if (mode === 'login') {
        await login(form.email, form.password)
        toast.success('Welcome back!')
      } else {
        await register(form.name, form.email, form.password)
        toast.success('Account created!')
      }
      navigate('/')
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-black pt-16 grid md:grid-cols-2">
      {/* Left — decorative */}
      <div className="hidden md:block relative overflow-hidden bg-gray-950">
        <img
          src="https://res.cloudinary.com/drxjzujjo/image/upload/b784be56a2cd854742fd4955dd8312bd_lhbpmv"
          alt=""
          className="w-full h-full object-cover opacity-40"
        />
        <div className="absolute inset-0 flex flex-col justify-end p-16">
          <Link to="/" className="font-display text-6xl tracking-wider text-white mb-4">BINDASS</Link>
          <p className="font-sans text-sm text-gray-400 max-w-xs leading-loose">
            Dark luxury streetwear for those who dare to be different.
          </p>
        </div>
      </div>

      {/* Right — form */}
      <div className="flex items-center justify-center px-8 py-20">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="w-full max-w-md"
        >
          {/* Toggle */}
          <div className="flex gap-0 mb-12 border border-white/8 p-0.5">
            {(['login', 'register']).map(m => (
              <button
                key={m}
                onClick={() => setMode(m)}
                className={`flex-1 py-3 font-mono text-[10px] tracking-widest uppercase transition-all duration-300 ${
                  mode === m ? 'bg-white text-black' : 'text-gray-500 hover:text-gray-300'
                }`}
              >
                {m === 'login' ? 'Sign In' : 'Create Account'}
              </button>
            ))}
          </div>

          <h1 className="font-display text-5xl tracking-wider uppercase text-white mb-2">
            {mode === 'login' ? 'WELCOME BACK' : 'JOIN THE TRIBE'}
          </h1>
          <p className="font-sans text-sm text-gray-500 mb-10">
            {mode === 'login'
              ? 'Sign in to access your orders and wishlist.'
              : 'Create your account for early access to new drops.'}
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <AnimatePresence>
              {mode === 'register' && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                >
                  <label className="section-label text-gray-600 mb-2 block">Full Name</label>
                  <input
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    required={mode === 'register'}
                    placeholder="Your name"
                    className="w-full bg-gray-900 border border-white/8 text-white font-sans text-sm px-5 py-4 
                               focus:outline-none focus:border-white/20 transition-colors placeholder-gray-700"
                  />
                </motion.div>
              )}
            </AnimatePresence>

            <div>
              <label className="section-label text-gray-600 mb-2 block">Email</label>
              <input
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                required
                placeholder="you@example.com"
                className="w-full bg-gray-900 border border-white/8 text-white font-sans text-sm px-5 py-4 
                           focus:outline-none focus:border-white/20 transition-colors placeholder-gray-700"
              />
            </div>

            <div>
              <label className="section-label text-gray-600 mb-2 block">Password</label>
              <input
                name="password"
                type="password"
                value={form.password}
                onChange={handleChange}
                required
                placeholder="••••••••"
                className="w-full bg-gray-900 border border-white/8 text-white font-sans text-sm px-5 py-4 
                           focus:outline-none focus:border-white/20 transition-colors placeholder-gray-700"
              />
            </div>

            {mode === 'login' && (
              <div className="text-right">
                <button type="button" className="font-mono text-[10px] text-gray-600 hover:text-gray-300 tracking-widest uppercase transition-colors">
                  Forgot Password?
                </button>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full py-4 mt-2 disabled:opacity-50"
            >
              {loading ? 'Please wait...' : mode === 'login' ? 'Sign In' : 'Create Account'}
            </button>
          </form>
        </motion.div>
      </div>
    </div>
  )
}