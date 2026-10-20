import { useState } from 'react'
import { useNavigate, Link, useSearchParams } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuth } from '../context/AuthContext'
import { forgotPassword } from '../api/auth'
import { sectionUrl } from '../utils/cloudinaryHelpers'
import OnboardingModal from '../components/OnboardingModal'
import toast from 'react-hot-toast'

export default function AuthPage() {
  const [mode, setMode] = useState('login') // 'login' | 'register' | 'forgot'
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({ name: '', email: '', password: '', confirmPassword: '' })
  const [errors, setErrors] = useState({})
  const [forgotSent, setForgotSent] = useState(false)
  const [showOnboarding, setShowOnboarding] = useState(false)

  const { login, register } = useAuth()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const redirect = searchParams.get('redirect') || '/'

  const validate = () => {
    const errs = {}
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

    if (!form.email.trim()) {
      errs.email = 'Email address is required.'
    } else if (!emailRegex.test(form.email.trim())) {
      errs.email = 'Please enter a valid email address.'
    }

    if (mode !== 'forgot') {
      if (!form.password) {
        errs.password = 'Password is required.'
      } else if (form.password.length < 6) {
        errs.password = 'Password must be at least 6 characters.'
      }
    }

    if (mode === 'register') {
      if (!form.name.trim()) {
        errs.name = 'Full name is required.'
      } else if (form.name.trim().length < 2) {
        errs.name = 'Name must be at least 2 characters.'
      }

      if (form.password !== form.confirmPassword) {
        errs.confirmPassword = 'Passwords do not match.'
      }
    }

    setErrors(errs)
    return Object.keys(errs).length === 0
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm(p => ({ ...p, [name]: value }))
    // Clear field-specific error as user types
    if (errors[name]) {
      setErrors(p => ({ ...p, [name]: '' }))
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validate()) return

    setLoading(true)
    try {
      if (mode === 'login') {
        await login(form.email.trim(), form.password)
        toast.success('Welcome back!')
        navigate(redirect)
      } else if (mode === 'register') {
        await register(form.name.trim(), form.email.trim(), form.password)
        toast.success('Account created!')
        setShowOnboarding(true)
      } else if (mode === 'forgot') {
        await forgotPassword(form.email.trim())
        setForgotSent(true)
        toast.success('Recovery link sent! Check your inbox.')
      }
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Something went wrong. Please check your credentials.')
    } finally {
      setLoading(false)
    }
  }

  const handleOnboardingClose = () => {
    setShowOnboarding(false)
    navigate(redirect)
  }

  return (
    <>
      <div className="min-h-screen bg-black pt-16 grid md:grid-cols-2">
        {/* Left — decorative branding */}
        <div className="hidden md:block relative overflow-hidden bg-gray-950">
          <img
            src={sectionUrl('b784be56a2cd854742fd4955dd8312bd_lhbpmv')}
            alt=""
            loading="lazy"
            decoding="async"
            className="w-full h-full object-cover opacity-40"
          />
          <div className="absolute inset-0 flex flex-col justify-end p-16">
            <Link to="/" className="font-display text-6xl tracking-wider text-white mb-4">
              BINDASS
            </Link>
            <p className="font-sans text-sm text-gray-400 max-w-xs leading-loose">
              Dark luxury streetwear for those who dare to be different.
            </p>
          </div>
        </div>

        {/* Right — form container */}
        <div className="flex items-center justify-center px-8 py-20">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="w-full max-w-md"
          >
            {/* Toggle tabs (only visible for login / register) */}
            {mode !== 'forgot' && (
              <div className="flex gap-0 mb-12 border border-white/10 p-0.5 bg-gray-950">
                {(['login', 'register']).map(m => (
                  <button
                    key={m}
                    type="button"
                    onClick={() => {
                      setMode(m)
                      setErrors({})
                    }}
                    className={`flex-1 py-3 font-mono text-[10px] tracking-widest uppercase transition-all duration-300 ${
                      mode === m ? 'bg-white text-black font-bold' : 'text-gray-500 hover:text-gray-300'
                    }`}
                  >
                    {m === 'login' ? 'Sign In' : 'Create Account'}
                  </button>
                ))}
              </div>
            )}

            {/* Header Titles */}
            <div className="mb-8">
              <span className="font-mono text-[10px] tracking-widest uppercase text-accent mb-2 inline-block">
                {mode === 'forgot' ? 'ACCOUNT RECOVERY' : mode === 'login' ? 'MEMBERS AREA' : 'JOIN THE INNER CIRCLE'}
              </span>
              <h1 className="font-display text-4xl md:text-5xl tracking-wider uppercase text-white mb-2">
                {mode === 'login' ? 'WELCOME BACK' : mode === 'register' ? 'JOIN THE TRIBE' : 'RESET ACCESS'}
              </h1>
              <p className="font-sans text-sm text-gray-500">
                {mode === 'login'
                  ? 'Sign in to access your orders and wishlist.'
                  : mode === 'register'
                  ? 'Create your account for early access to limited edition drops.'
                  : 'Enter your registered email and we will send a password reset link.'}
              </p>
            </div>

            {mode === 'forgot' && forgotSent ? (
              <div className="border border-white/10 bg-gray-950/60 p-8 text-center space-y-4">
                <span className="text-3xl block">✉️</span>
                <h3 className="font-display text-2xl uppercase tracking-wider text-white">LINK DISPATCHED</h3>
                <p className="font-sans text-xs text-gray-400 leading-relaxed">
                  If <strong className="text-white">{form.email}</strong> is registered, a password reset link has been dispatched. Link expires in 15 minutes.
                </p>
                <div className="pt-4 flex flex-col gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      setForgotSent(false)
                      setMode('login')
                    }}
                    className="btn-primary py-3.5 uppercase font-mono text-xs tracking-widest"
                  >
                    Back to Sign In
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4" noValidate>
                {/* Full Name (Register only) */}
                <AnimatePresence>
                  {mode === 'register' && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden"
                    >
                      <label className="section-label text-gray-400 mb-2 block">Full Name</label>
                      <input
                        name="name"
                        value={form.name}
                        onChange={handleChange}
                        placeholder="Bruce Wayne"
                        className={`w-full bg-gray-900 border text-white font-sans text-sm px-5 py-4 focus:outline-none transition-colors placeholder-gray-700 ${
                          errors.name ? 'border-red-500/80 focus:border-red-500' : 'border-white/10 focus:border-white/30'
                        }`}
                      />
                      {errors.name && (
                        <p className="font-mono text-[10px] text-red-400 mt-1.5">{errors.name}</p>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Email (All modes) */}
                <div>
                  <label className="section-label text-gray-400 mb-2 block">Email Address</label>
                  <input
                    name="email"
                    type="email"
                    value={form.email}
                    onChange={handleChange}
                    placeholder="you@example.com"
                    className={`w-full bg-gray-900 border text-white font-sans text-sm px-5 py-4 focus:outline-none transition-colors placeholder-gray-700 ${
                      errors.email ? 'border-red-500/80 focus:border-red-500' : 'border-white/10 focus:border-white/30'
                    }`}
                  />
                  {errors.email && (
                    <p className="font-mono text-[10px] text-red-400 mt-1.5">{errors.email}</p>
                  )}
                </div>

                {/* Password (Login and Register) */}
                {mode !== 'forgot' && (
                  <div>
                    <label className="section-label text-gray-400 mb-2 block">Password</label>
                    <input
                      name="password"
                      type="password"
                      value={form.password}
                      onChange={handleChange}
                      placeholder="••••••••"
                      className={`w-full bg-gray-900 border text-white font-sans text-sm px-5 py-4 focus:outline-none transition-colors placeholder-gray-700 ${
                        errors.password ? 'border-red-500/80 focus:border-red-500' : 'border-white/10 focus:border-white/30'
                      }`}
                    />
                    {errors.password && (
                      <p className="font-mono text-[10px] text-red-400 mt-1.5">{errors.password}</p>
                    )}
                  </div>
                )}

                {/* Confirm Password (Register only) */}
                {mode === 'register' && (
                  <div>
                    <label className="section-label text-gray-400 mb-2 block">Confirm Password</label>
                    <input
                      name="confirmPassword"
                      type="password"
                      value={form.confirmPassword}
                      onChange={handleChange}
                      placeholder="••••••••"
                      className={`w-full bg-gray-900 border text-white font-sans text-sm px-5 py-4 focus:outline-none transition-colors placeholder-gray-700 ${
                        errors.confirmPassword ? 'border-red-500/80 focus:border-red-500' : 'border-white/10 focus:border-white/30'
                      }`}
                    />
                    {errors.confirmPassword && (
                      <p className="font-mono text-[10px] text-red-400 mt-1.5">{errors.confirmPassword}</p>
                    )}
                  </div>
                )}

                {/* Forgot Password link */}
                {mode === 'login' && (
                  <div className="text-right">
                    <button
                      type="button"
                      onClick={() => {
                        setMode('forgot')
                        setErrors({})
                      }}
                      className="font-mono text-[10px] text-gray-500 hover:text-white tracking-widest uppercase transition-colors"
                    >
                      Forgot Password?
                    </button>
                  </div>
                )}

                {/* Back to sign in (Forgot mode only) */}
                {mode === 'forgot' && (
                  <div className="text-right">
                    <button
                      type="button"
                      onClick={() => {
                        setMode('login')
                        setErrors({})
                      }}
                      className="font-mono text-[10px] text-gray-500 hover:text-white tracking-widest uppercase transition-colors"
                    >
                      ← Back to Sign In
                    </button>
                  </div>
                )}

                {/* Submit button */}
                <button
                  type="submit"
                  disabled={loading}
                  className="btn-primary w-full py-4 mt-4 font-mono text-xs uppercase tracking-widest disabled:opacity-50"
                >
                  {loading
                    ? 'Processing...'
                    : mode === 'login'
                    ? 'Sign In'
                    : mode === 'register'
                    ? 'Create Account'
                    : 'Send Recovery Link'}
                </button>
              </form>
            )}
          </motion.div>
        </div>
      </div>

      {/* Onboarding Flow for new members */}
      <OnboardingModal isOpen={showOnboarding} onClose={handleOnboardingClose} />
    </>
  )
}