import { motion } from 'framer-motion'
import { Package, Sparkles } from 'lucide-react'

interface InventoryItem {
  productId: string
  productName: string
  category: string
  currentStock: number
  reorderPoint: number
  status: 'critical' | 'low' | 'optimal' | 'overstock'
  price: number
}

interface InventoryTableProps {
  items: InventoryItem[]
  isLoading: boolean
}

interface StatusBadgeProps {
  status: string
  currentStock: number
  reorderPoint: number
}

const statusConfig = {
  critical: {
    bg: 'bg-red-100 border-red-200 dark:bg-red-900/30 dark:border-red-800',
    text: 'text-red-800 dark:text-red-300',
    label: 'Critical',
    icon: '🔴',
    progressColor: 'bg-red-600'
  },
  low: {
    bg: 'bg-yellow-100 border-yellow-200 dark:bg-yellow-900/30 dark:border-yellow-800',
    text: 'text-yellow-800 dark:text-yellow-300',
    label: 'Low Stock',
    icon: '⚠️',
    progressColor: 'bg-yellow-500'
  },
  optimal: {
    bg: 'bg-green-100 border-green-200 dark:bg-green-900/30 dark:border-green-800',
    text: 'text-green-800 dark:text-green-300',
    label: 'Optimal',
    icon: '✅',
    progressColor: 'bg-green-500'
  },
  overstock: {
    bg: 'bg-blue-100 border-blue-200 dark:bg-blue-900/30 dark:border-blue-800',
    text: 'text-blue-800 dark:text-blue-300',
    label: 'Overstock',
    icon: '📦',
    progressColor: 'bg-blue-500'
  }
}

function StatusBadge({ status, currentStock, reorderPoint }: StatusBadgeProps) {
  const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.optimal
  const percentage = Math.min((currentStock / reorderPoint) * 100, 100)

  return (
    <div className="space-y-1">
      <span className={`px-3 py-1 inline-flex items-center text-xs leading-5 font-bold rounded-full border ${config.bg} ${config.text}`}>
        <span className="mr-1">{config.icon}</span>
        {config.label}
      </span>
      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5">
        <motion.div
          className={`h-1.5 rounded-full ${config.progressColor}`}
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
        />
      </div>
    </div>
  )
}

function LoadingSkeleton() {
  return (
    <div className="space-y-4">
      {[1, 2, 3, 4, 5].map((i) => (
        <div key={i} className="animate-pulse flex space-x-4 p-4">
          <div className="rounded-lg bg-gray-300 dark:bg-gray-700 h-10 w-10"></div>
          <div className="flex-1 space-y-2">
            <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-3/4"></div>
            <div className="h-3 bg-gray-300 dark:bg-gray-700 rounded w-1/2"></div>
          </div>
        </div>
      ))}
    </div>
  )
}

function EmptyState() {
  return (
    <motion.div
      className="text-center py-12"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
    >
      <Package className="w-16 h-16 mx-auto text-gray-400 dark:text-gray-600 mb-4" />
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
        No Inventory Items
      </h3>
      <p className="text-gray-500 dark:text-gray-400">
        Start by seeding data or adding products to your inventory
      </p>
    </motion.div>
  )
}

export default function InventoryTable({ items, isLoading }: InventoryTableProps) {
  if (isLoading) {
    return (
      <div className="glass rounded-2xl shadow-xl overflow-hidden border border-white/20">
        <div className="px-6 py-4 bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Product Inventory</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">Monitor and manage your retail stock levels</p>
        </div>
        <div className="p-6">
          <LoadingSkeleton />
        </div>
      </div>
    )
  }

  if (items.length === 0) {
    return (
      <div className="glass rounded-2xl shadow-xl overflow-hidden border border-white/20">
        <div className="px-6 py-4 bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Product Inventory</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">Monitor and manage your retail stock levels</p>
        </div>
        <EmptyState />
      </div>
    )
  }

  return (
    <motion.div
      className="glass rounded-2xl shadow-xl overflow-hidden border border-white/20"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="px-6 py-4 bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 border-b border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Product Inventory</h3>
        <p className="text-sm text-gray-500 dark:text-gray-400">Monitor and manage your retail stock levels</p>
      </div>
      
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gray-50 dark:bg-gray-800">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                Product
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                Category
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                Stock Level
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                Reorder Point
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                Price
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                Total Value
              </th>
            </tr>
          </thead>
          <tbody className="bg-white/50 dark:bg-gray-900/50 divide-y divide-gray-200 dark:divide-gray-700">
            {items.map((item, index) => (
              <motion.tr
                key={item.productId}
                className="hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors duration-150 group"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
              >
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-10 w-10 bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900 dark:to-purple-900 rounded-lg flex items-center justify-center">
                      <Package className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-semibold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                        {item.productName}
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">{item.productId}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="px-3 py-1 inline-flex text-xs leading-5 font-medium rounded-full bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-300">
                    {item.category}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <span className="text-lg font-bold text-gray-900 dark:text-white">{item.currentStock}</span>
                    <span className="text-xs text-gray-500 dark:text-gray-400 ml-1">units</span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                  {item.reorderPoint}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <StatusBadge
                    status={item.status}
                    currentStock={item.currentStock}
                    reorderPoint={item.reorderPoint}
                  />
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900 dark:text-white">
                  ₹{item.price?.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center space-x-2">
                    <span className="text-sm font-semibold text-emerald-600 dark:text-emerald-400">
                      ₹{(item.price * item.currentStock).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </span>
                    {/* AI insight icon placeholder */}
                    {item.currentStock < item.reorderPoint && (
                      <span title="AI recommendation available">
                        <Sparkles className="w-4 h-4 text-purple-500" />
                      </span>
                    )}
                  </div>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    </motion.div>
  )
}
