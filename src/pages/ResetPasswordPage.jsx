import { useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { resetPassword } from '../api/auth'
import { useAuth } from '../context/AuthContext'
import toast from 'react-hot-toast'

export default function ResetPasswordPage() {
  const { token } = useParams()
  const navigate = useNavigate()
  const { fetchUser } = useAuth()
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const getStrength = (pass) => {
    if (!pass) return { score: 0, text: '' }
    let score = 0
    if (pass.length >= 6) score += 1
    if (pass.length >= 10) score += 1
    if (/[A-Z]/.test(pass) && /[a-z]/.test(pass)) score += 1
    if (/[0-9]/.test(pass) || /[^A-Za-z0-9]/.test(pass)) score += 1

    const levels = ['Weak', 'Fair', 'Good', 'Strong']
    return { score, text: levels[score - 1] || 'Weak' }
  }

  const strength = getStrength(password)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    if (password.length < 6) {
      setError('Password must be at least 6 characters long.')
      return
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match.')
      return
    }

    setLoading(true)
    try {
      const res = await resetPassword(token, password)
      const data = res.data?.data || res.data
      if (data?.token) {
        localStorage.setItem('bindass_token', data.token)
        if (typeof fetchUser === 'function') {
          await fetchUser()
        }
      }
      toast.success('Password updated successfully!')
      navigate('/')
    } catch (err) {
      const msg = err?.response?.data?.message || 'Invalid or expired reset token. Please request a new link.'
      setError(msg)
      toast.error(msg)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-black pt-28 pb-16 flex items-center justify-center px-6">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md border border-white/10 p-8 md:p-10 bg-gray-950/60 backdrop-blur-md"
      >
        <div className="mb-8 text-center">
          <span className="font-mono text-[10px] tracking-widest uppercase text-accent mb-2 inline-block">
            AUTHENTICATION
          </span>
          <h1 className="font-display text-4xl tracking-wider uppercase text-white mb-2">
            SET NEW PASSWORD
          </h1>
          <p className="font-sans text-xs text-gray-500">
            Create a secure password to protect your account.
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-950/40 border border-red-500/20 text-red-400 font-sans text-xs">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="section-label text-gray-400 mb-2 block">New Password</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full bg-gray-900 border border-white/10 text-white font-sans text-sm px-4 py-3.5 focus:outline-none focus:border-white/30 transition-colors"
            />
            {password && (
              <div className="mt-2 flex items-center justify-between">
                <div className="flex gap-1 flex-1 max-w-[120px]">
                  {[1, 2, 3, 4].map((step) => (
                    <div
                      key={step}
                      className={`h-1 flex-1 rounded-full transition-colors ${
                        step <= strength.score
                          ? strength.score >= 3
                            ? 'bg-green-500'
                            : strength.score === 2
                            ? 'bg-amber-500'
                            : 'bg-red-500'
                          : 'bg-white/10'
                      }`}
                    />
                  ))}
                </div>
                <span className="font-mono text-[9px] uppercase tracking-wider text-gray-500">
                  {strength.text}
                </span>
              </div>
            )}
          </div>

          <div>
            <label className="section-label text-gray-400 mb-2 block">Confirm Password</label>
            <input
              type="password"
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full bg-gray-900 border border-white/10 text-white font-sans text-sm px-4 py-3.5 focus:outline-none focus:border-white/30 transition-colors"
            />
            {confirmPassword && password !== confirmPassword && (
              <p className="font-mono text-[10px] text-red-400 mt-1.5">
                Passwords do not match
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={loading || password.length < 6 || password !== confirmPassword}
            className="btn-primary w-full py-4 uppercase font-mono text-xs tracking-widest disabled:opacity-40"
          >
            {loading ? 'Updating Password...' : 'Save New Password'}
          </button>
        </form>

        <div className="mt-8 text-center">
          <Link
            to="/auth"
            className="font-mono text-[10px] text-gray-500 hover:text-white uppercase tracking-widest transition-colors"
          >
            ← Back to Sign In
          </Link>
        </div>
      </motion.div>
    </div>
  )
}
