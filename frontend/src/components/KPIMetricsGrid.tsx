import { motion } from 'framer-motion'
import { Package, AlertCircle, TrendingUp, CheckCircle, LucideIcon } from 'lucide-react'

interface KPIMetric {
  title: string
  value: string | number
  icon: LucideIcon
  color: 'blue' | 'red' | 'purple' | 'green'
  trend?: {
    value: number
    direction: 'up' | 'down'
  }
}

interface KPIMetricsGridProps {
  totalProducts: number
  lowStockItems: number
  activeRecommendations: number
  automationRate: number
}

export default function KPIMetricsGrid({
  totalProducts,
  lowStockItems,
  activeRecommendations,
  automationRate
}: KPIMetricsGridProps) {
  const metrics: KPIMetric[] = [
    {
      title: 'Total Products',
      value: totalProducts,
      icon: Package,
      color: 'blue',
      trend: { value: 12, direction: 'up' }
    },
    {
      title: 'Low Stock Alerts',
      value: lowStockItems,
      icon: AlertCircle,
      color: 'red',
      trend: { value: 8, direction: 'down' }
    },
    {
      title: 'AI Recommendations',
      value: activeRecommendations,
      icon: TrendingUp,
      color: 'purple',
      trend: { value: 15, direction: 'up' }
    },
    {
      title: 'Automation Success',
      value: `${automationRate}%`,
      icon: CheckCircle,
      color: 'green',
      trend: { value: 3, direction: 'up' }
    }
  ]

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
      {metrics.map((metric, index) => (
        <KPICard
          key={metric.title}
          metric={metric}
          index={index}
        />
      ))}
    </div>
  )
}

interface KPICardProps {
  metric: KPIMetric
  index: number
}

function KPICard({ metric, index }: KPICardProps) {
  const { title, value, icon: Icon, color, trend } = metric

  const colorClasses = {
    blue: {
      gradient: 'from-blue-500 to-blue-600',
      bg: 'bg-blue-500/10',
      text: 'text-blue-600'
    },
    red: {
      gradient: 'from-red-500 to-red-600',
      bg: 'bg-red-500/10',
      text: 'text-red-600'
    },
    purple: {
      gradient: 'from-purple-500 to-purple-600',
      bg: 'bg-purple-500/10',
      text: 'text-purple-600'
    },
    green: {
      gradient: 'from-green-500 to-green-600',
      bg: 'bg-green-500/10',
      text: 'text-green-600'
    }
  }

  const colors = colorClasses[color]

  return (
    <motion.div
      className="glass rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group border border-white/20"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ 
        duration: 0.5,
        delay: index * 0.05 // 50ms stagger
      }}
      whileHover={{ y: -4 }}
    >
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          {/* Gradient icon circle with hover animation */}
          <motion.div
            className={`bg-gradient-to-br ${colors.gradient} p-3 rounded-xl shadow-lg`}
            whileHover={{ 
              scale: 1.1,
              rotate: 5
            }}
            transition={{ duration: 0.2 }}
          >
            <Icon className="w-6 h-6 text-white" />
          </motion.div>

          {/* Trend indicator */}
          {trend && (
            <div className={`flex items-center space-x-1 text-sm font-medium ${
              trend.direction === 'up' ? 'text-green-600' : 'text-red-600'
            }`}>
              {trend.direction === 'up' ? (
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
                </svg>
              ) : (
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                </svg>
              )}
              <span>{trend.value}%</span>
            </div>
          )}
        </div>

        <div>
          <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
            {title}
          </p>
          <p className="text-3xl font-bold text-gray-900 dark:text-white">
            {value}
          </p>
        </div>
      </div>
    </motion.div>
  )
}
