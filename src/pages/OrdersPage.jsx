import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { getMyOrders } from '../api/orders'
import { deleteAccount, resendVerification } from '../api/auth'
import { useAuth } from '../context/AuthContext'
import { formatINR } from '../utils/formatCurrency'
import toast from 'react-hot-toast'

const STATUS_STYLES = {
  pending:    'text-amber-500 bg-amber-500/10',
  confirmed:  'text-blue-400 bg-blue-500/10',
  shipped:    'text-purple-400 bg-purple-500/10',
  delivered:  'text-green-400 bg-green-500/10',
  cancelled:  'text-red-400 bg-red-500/10',
}

export default function OrdersPage() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [deleteConfirmation, setDeleteConfirmation] = useState('')
  const [deleting, setDeleting] = useState(false)
  const [resending, setResending] = useState(false)

  const { data, isLoading } = useQuery({
    queryKey: ['orders'],
    queryFn: () => getMyOrders().then(r => r.data),
  })

  // Extract orders from Spring Page or ApiResponse structure
  const orders = Array.isArray(data?.data?.content)
    ? data.data.content
    : Array.isArray(data?.data)
    ? data.data
    : Array.isArray(data?.orders)
    ? data.orders
    : []

  const handleResendVerification = async () => {
    if (!user?.email) return
    setResending(true)
    try {
      await resendVerification(user.email)
      toast.success('Verification link dispatched to your email!')
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Could not send verification email.')
    } finally {
      setResending(false)
    }
  }

  const handleDeleteAccount = async () => {
    if (deleteConfirmation !== 'DELETE') {
      toast.error('Please type DELETE to confirm.')
      return
    }

    setDeleting(true)
    try {
      await deleteAccount()
      logout()
      toast.success('Your account has been deleted permanently.')
      navigate('/')
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Failed to delete account. Please try again.')
    } finally {
      setDeleting(false)
      setShowDeleteModal(false)
    }
  }

  return (
    <div className="min-h-screen bg-black pt-16">
      <div className="max-w-screen-xl mx-auto px-6 md:px-16 py-16">
        
        {/* User Profile Card */}
        {user && (
          <div className="border border-white/5 bg-gray-950/40 p-6 md:p-8 mb-16 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <span className="font-mono text-[10px] tracking-widest uppercase text-accent mb-1 block">
                AUTHENTICATED MEMBER
              </span>
              <h2 className="font-display text-2xl md:text-3xl text-white uppercase tracking-wider mb-1">
                {user.name}
              </h2>
              <p className="font-sans text-xs text-gray-400">{user.email}</p>
            </div>

            <div className="flex items-center gap-4 flex-wrap">
              {(user.isVerified ?? user.verified) ? (
                <span className="font-mono text-[10px] tracking-widest uppercase px-3 py-1.5 border border-green-500/30 bg-green-500/10 text-green-400">
                  Verified Account ✓
                </span>
              ) : (
                <div className="flex items-center gap-3">
                  <span className="font-mono text-[10px] tracking-widest uppercase px-3 py-1.5 border border-amber-500/30 bg-amber-500/10 text-amber-400">
                    Unverified
                  </span>
                  <button
                    onClick={handleResendVerification}
                    disabled={resending}
                    className="font-mono text-[10px] tracking-widest uppercase text-gray-400 hover:text-white underline underline-offset-4 disabled:opacity-50"
                  >
                    {resending ? 'Sending...' : 'Verify Email'}
                  </button>
                </div>
              )}

              <button
                onClick={logout}
                className="btn-outline py-2 px-5 font-mono text-[10px] tracking-widest uppercase"
              >
                Sign Out
              </button>
            </div>
          </div>
        )}

        {/* Section Title */}
        <div className="mb-12">
          <p className="section-label text-silver mb-2">Order History</p>
          <h1 className="font-display text-5xl md:text-6xl tracking-wider uppercase text-white">YOUR ORDERS</h1>
        </div>

        {/* Orders List */}
        {isLoading ? (
          <div className="space-y-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="h-28 bg-gray-900 animate-pulse rounded" />
            ))}
          </div>
        ) : orders.length === 0 ? (
          <div className="text-center py-24 border border-white/5 bg-gray-950/20">
            <p className="font-display text-6xl text-gray-800 mb-4">EMPTY</p>
            <p className="font-sans text-sm text-gray-500 mb-6">No orders found. Discover limited edition silhouettes.</p>
            <button onClick={() => navigate('/shop')} className="btn-primary px-8 py-3.5 text-xs font-mono uppercase tracking-widest">
              Explore Drops
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order, i) => (
              <motion.div
                key={order.id || order._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.06 }}
                className="border border-white/5 p-6 hover:border-white/10 transition-colors bg-gray-950/20"
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <p className="font-mono text-[10px] text-gray-600 tracking-widest uppercase mb-1">
                      Order #{(order.id || order._id)?.slice(-8).toUpperCase()}
                    </p>
                    <p className="font-sans text-sm text-gray-400">
                      {new Date(order.createdAt).toLocaleDateString('en-IN', {
                        day: 'numeric', month: 'long', year: 'numeric'
                      })}
                    </p>
                    <div className="flex gap-2 mt-2 flex-wrap">
                      {order.items?.map((item, j) => (
                        <span key={j} className="font-mono text-[9px] text-gray-400 bg-gray-900 border border-white/5 px-3 py-1 tracking-wider">
                          {item.name || 'Hoodie'} — {item.size} × {item.quantity}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="flex flex-col items-start md:items-end gap-2">
                    <span className={`font-mono text-[9px] tracking-widest uppercase px-3 py-1.5 rounded-sm ${STATUS_STYLES[order.status?.toLowerCase()] || STATUS_STYLES.pending}`}>
                      {order.status}
                    </span>
                    <span className="font-mono text-lg text-white font-medium">{formatINR(order.totalAmount)}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* Danger Zone: Account Deletion */}
        <div className="mt-24 pt-12 border-t border-white/10">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 p-6 border border-red-500/20 bg-red-950/10">
            <div>
              <p className="font-mono text-[10px] text-red-400 tracking-widest uppercase mb-1">DANGER ZONE</p>
              <h3 className="font-display text-xl text-white uppercase tracking-wider mb-1">Delete Account</h3>
              <p className="font-sans text-xs text-gray-400 max-w-lg leading-relaxed">
                Permanently delete your profile, wishlist, and active carts. Completed order transactions will be anonymized for compliance. This action cannot be reversed.
              </p>
            </div>
            <button
              onClick={() => {
                setDeleteConfirmation('')
                setShowDeleteModal(true)
              }}
              className="border border-red-500/40 text-red-400 hover:bg-red-500/10 px-6 py-3 font-mono text-[10px] uppercase tracking-widest transition-colors shrink-0"
            >
              Delete Account
            </button>
          </div>
        </div>

      </div>

      {/* Delete Account Confirmation Modal */}
      <AnimatePresence>
        {showDeleteModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-md border border-red-500/30 bg-gray-950 p-8 text-center space-y-6"
            >
              <span className="text-4xl block">⚠️</span>
              <h3 className="font-display text-3xl uppercase tracking-wider text-white">
                CONFIRM ACCOUNT DELETION
              </h3>
              <p className="font-sans text-xs text-gray-400 leading-relaxed">
                Are you absolutely certain? This will immediately purge your user credentials, wishlist, and active sessions.
              </p>
              <p className="font-mono text-xs text-red-400">
                Type <strong className="text-white underline">DELETE</strong> below to authorize:
              </p>

              <input
                type="text"
                value={deleteConfirmation}
                onChange={(e) => setDeleteConfirmation(e.target.value)}
                placeholder="DELETE"
                className="w-full bg-gray-900 border border-white/20 text-white text-center font-mono text-sm px-4 py-3 focus:outline-none focus:border-red-500 uppercase tracking-widest"
              />

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowDeleteModal(false)}
                  className="btn-outline flex-1 py-3.5 uppercase font-mono text-xs tracking-widest"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleDeleteAccount}
                  disabled={deleting || deleteConfirmation !== 'DELETE'}
                  className="bg-red-600 hover:bg-red-700 text-white flex-1 py-3.5 uppercase font-mono text-xs tracking-widest disabled:opacity-40 transition-colors font-bold"
                >
                  {deleting ? 'Deleting...' : 'Confirm Delete'}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  )
}