import { useEffect, useState } from 'react'
import { useSearchParams, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { verifyEmail, resendVerification } from '../api/auth'
import { useAuth } from '../context/AuthContext'
import toast from 'react-hot-toast'

export default function VerifyEmailPage() {
  const [searchParams] = useSearchParams()
  const token = searchParams.get('token')
  const { user, fetchUser } = useAuth()

  const [status, setStatus] = useState('verifying') // 'verifying' | 'success' | 'error'
  const [errorMessage, setErrorMessage] = useState('')
  const [resendEmail, setResendEmail] = useState(user?.email || '')
  const [resending, setResending] = useState(false)

  useEffect(() => {
    if (!token) {
      setStatus('error')
      setErrorMessage('No verification token provided in URL.')
      return
    }

    let isMounted = true
    verifyEmail(token)
      .then(async () => {
        if (isMounted) {
          setStatus('success')
          toast.success('Email verified successfully!')
          if (typeof fetchUser === 'function') {
            await fetchUser()
          }
        }
      })
      .catch((err) => {
        if (isMounted) {
          setStatus('error')
          const msg = err?.response?.data?.message || 'Verification link is invalid or has expired.'
          setErrorMessage(msg)
          toast.error(msg)
        }
      })

    return () => {
      isMounted = false
    }
  }, [token])

  const handleResend = async (e) => {
    e.preventDefault()
    if (!resendEmail.trim()) {
      toast.error('Please enter your email')
      return
    }
    setResending(true)
    try {
      await resendVerification(resendEmail.trim())
      toast.success('Verification link sent! Check your inbox.')
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Could not send verification email.')
    } finally {
      setResending(false)
    }
  }

  return (
    <div className="min-h-screen bg-black pt-28 pb-16 flex items-center justify-center px-6">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md border border-white/10 p-8 md:p-12 text-center bg-gray-950/60 backdrop-blur-md"
      >
        {status === 'verifying' && (
          <div className="space-y-6">
            <div className="w-12 h-12 border-2 border-white/20 border-t-white rounded-full animate-spin mx-auto" />
            <h1 className="font-display text-3xl uppercase tracking-wider text-white">
              VERIFYING ACCOUNT
            </h1>
            <p className="font-sans text-xs text-gray-500">
              Please wait while we authenticate your verification token...
            </p>
          </div>
        )}

        {status === 'success' && (
          <div className="space-y-6">
            <span className="w-12 h-12 rounded-full border border-green-500/30 bg-green-500/10 text-green-400 flex items-center justify-center text-xl mx-auto">
              ✓
            </span>
            <span className="font-mono text-[10px] tracking-widest uppercase text-green-400 block">
              STATUS VERIFIED
            </span>
            <h1 className="font-display text-4xl uppercase tracking-wider text-white">
              EMAIL CONFIRMED
            </h1>
            <p className="font-sans text-xs text-gray-400 leading-relaxed max-w-xs mx-auto">
              Your BINDASS account is now fully verified. You have unlocked complete access to drop alerts and orders.
            </p>
            <div className="pt-4 flex flex-col gap-3">
              <Link to="/shop" className="btn-primary py-3.5 uppercase font-mono text-xs tracking-widest block">
                Start Shopping
              </Link>
              <Link to="/orders" className="btn-outline py-3.5 uppercase font-mono text-xs tracking-widest block">
                Go to My Account
              </Link>
            </div>
          </div>
        )}

        {status === 'error' && (
          <div className="space-y-6">
            <span className="w-12 h-12 rounded-full border border-red-500/30 bg-red-500/10 text-red-400 flex items-center justify-center text-xl mx-auto font-mono">
              !
            </span>
            <span className="font-mono text-[10px] tracking-widest uppercase text-red-400 block">
              VERIFICATION FAILED
            </span>
            <h1 className="font-display text-3xl uppercase tracking-wider text-white">
              LINK EXPIRED OR INVALID
            </h1>
            <p className="font-sans text-xs text-gray-400 leading-relaxed max-w-xs mx-auto">
              {errorMessage}
            </p>

            <form onSubmit={handleResend} className="pt-4 space-y-3 text-left">
              <label className="section-label text-gray-500 block">Request New Verification Link</label>
              <input
                type="email"
                required
                value={resendEmail}
                onChange={(e) => setResendEmail(e.target.value)}
                placeholder="Enter your email"
                className="w-full bg-gray-900 border border-white/10 text-white font-sans text-xs px-4 py-3 focus:outline-none focus:border-white/30"
              />
              <button
                type="submit"
                disabled={resending}
                className="btn-primary w-full py-3.5 uppercase font-mono text-[11px] tracking-widest disabled:opacity-40"
              >
                {resending ? 'Sending Link...' : 'Resend Verification Email'}
              </button>
            </form>

            <div className="pt-2">
              <Link to="/" className="font-mono text-[10px] text-gray-500 hover:text-white uppercase tracking-widest">
                ← Return to Home
              </Link>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  )
}
