import { motion } from 'framer-motion'
import { Package, AlertTriangle, TrendingUp, BarChart3 } from 'lucide-react'
import { ReactNode } from 'react'

interface InventoryMetricsCardsProps {
  totalItems: number
  lowStockCount: number
  totalValue: number
  optimalCount: number
}

interface MetricCardProps {
  title: string
  value: string | number
  icon: ReactNode
  color: 'blue' | 'red' | 'green' | 'purple'
  subtitle?: string
  index: number
}

const colorClasses = {
  blue: {
    gradient: 'from-blue-500 to-blue-600',
    bg: 'bg-blue-50',
    text: 'text-blue-600'
  },
  red: {
    gradient: 'from-red-500 to-red-600',
    bg: 'bg-red-50',
    text: 'text-red-600'
  },
  green: {
    gradient: 'from-green-500 to-green-600',
    bg: 'bg-green-50',
    text: 'text-green-600'
  },
  purple: {
    gradient: 'from-purple-500 to-purple-600',
    bg: 'bg-purple-50',
    text: 'text-purple-600'
  }
}

function MetricCard({ title, value, icon, color, subtitle, index }: MetricCardProps) {
  const colors = colorClasses[color]
  
  return (
    <motion.div
      className="glass rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden group border border-white/20"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.05 }}
      whileHover={{ y: -4 }}
    >
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <motion.div
            className={`bg-gradient-to-br ${colors.gradient} p-3 rounded-xl shadow-lg`}
            whileHover={{ scale: 1.1, rotate: 5 }}
            transition={{ duration: 0.2 }}
          >
            <div className="text-white">{icon}</div>
          </motion.div>
          
          {/* Trend indicator - placeholder for now */}
          <div className="flex items-center space-x-1 text-sm">
            <TrendingUp className="w-4 h-4 text-green-500" />
            <span className="text-green-500 font-medium">+5%</span>
          </div>
        </div>
        
        <div>
          <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
            {title}
          </p>
          <p className="text-3xl font-bold text-gray-900 dark:text-white mb-1">
            {value}
          </p>
          {subtitle && (
            <p className="text-xs text-gray-400 dark:text-gray-500">{subtitle}</p>
          )}
        </div>
        
        {/* Micro sparkline placeholder */}
        <div className="mt-4 h-8 flex items-end space-x-1">
          {[40, 60, 45, 70, 55, 80, 65].map((height, i) => (
            <motion.div
              key={i}
              className={`flex-1 ${colors.bg} rounded-t`}
              style={{ height: `${height}%` }}
              initial={{ height: 0 }}
              animate={{ height: `${height}%` }}
              transition={{ duration: 0.5, delay: index * 0.05 + i * 0.05 }}
            />
          ))}
        </div>
      </div>
    </motion.div>
  )
}

export default function InventoryMetricsCards({
  totalItems,
  lowStockCount,
  totalValue,
  optimalCount
}: InventoryMetricsCardsProps) {
  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
      <MetricCard
        title="Total Items"
        value={totalItems}
        icon={<Package className="w-6 h-6" />}
        color="blue"
        subtitle="Active SKUs"
        index={0}
      />
      
      <MetricCard
        title="Low Stock Alerts"
        value={lowStockCount}
        icon={<AlertTriangle className="w-6 h-6" />}
        color="red"
        subtitle="Needs attention"
        index={1}
      />
      
      <MetricCard
        title="Total Value"
        value={`₹${totalValue.toLocaleString('en-IN', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`}
        icon={<BarChart3 className="w-6 h-6" />}
        color="purple"
        subtitle="Inventory worth"
        index={2}
      />
      
      <MetricCard
        title="Optimal Stock"
        value={optimalCount}
        icon={<TrendingUp className="w-6 h-6" />}
        color="green"
        subtitle="Well stocked"
        index={3}
      />
    </div>
  )
}
