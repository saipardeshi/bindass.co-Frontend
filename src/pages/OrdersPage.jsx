import { useQuery } from '@tanstack/react-query'
import { motion } from 'framer-motion'
import { getMyOrders } from '../api/orders'
import { formatINR } from '../utils/formatCurrency'

const STATUS_STYLES = {
  pending:    'text-amber-500 bg-amber-500/10',
  confirmed:  'text-blue-400 bg-blue-500/10',
  shipped:    'text-purple-400 bg-purple-500/10',
  delivered:  'text-green-400 bg-green-500/10',
  cancelled:  'text-red-400 bg-red-500/10',
}

export default function OrdersPage() {
  const { data, isLoading } = useQuery({
    queryKey: ['orders'],
    queryFn: () => getMyOrders().then(r => r.data),
  })

  const orders = data?.orders || []

  return (
    <div className="min-h-screen bg-black pt-16">
      <div className="max-w-screen-xl mx-auto px-6 md:px-16 py-16">
        <div className="mb-12">
          <p className="section-label text-silver mb-2">Your</p>
          <h1 className="font-display text-6xl tracking-wider uppercase text-white">ORDERS</h1>
        </div>

        {isLoading ? (
          <div className="space-y-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="h-28 bg-gray-900 animate-pulse rounded" />
            ))}
          </div>
        ) : orders.length === 0 ? (
          <div className="text-center py-24">
            <p className="font-display text-6xl text-gray-800 mb-4">EMPTY</p>
            <p className="font-sans text-sm text-gray-500">No orders yet. Time to shop.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order, i) => (
              <motion.div
                key={order._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.06 }}
                className="border border-white/5 p-6 hover:border-white/10 transition-colors"
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <p className="font-mono text-[10px] text-gray-600 tracking-widest uppercase mb-1">
                      Order #{order._id?.slice(-8).toUpperCase()}
                    </p>
                    <p className="font-sans text-sm text-gray-400">
                      {new Date(order.createdAt).toLocaleDateString('en-IN', {
                        day: 'numeric', month: 'long', year: 'numeric'
                      })}
                    </p>
                    <div className="flex gap-2 mt-2 flex-wrap">
                      {order.items?.map((item, j) => (
                        <span key={j} className="font-mono text-[9px] text-gray-600 bg-gray-900 px-3 py-1 tracking-wider">
                          {item.name || 'Hoodie'} — {item.size}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <span className={`font-mono text-[9px] tracking-widest uppercase px-3 py-1.5 rounded-sm ${STATUS_STYLES[order.status?.toLowerCase()] || STATUS_STYLES.pending}`}>
                      {order.status}
                    </span>
                    <span className="font-mono text-lg text-white">{formatINR(order.totalAmount)}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}