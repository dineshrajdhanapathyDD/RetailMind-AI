import { motion } from 'framer-motion'
import { AlertTriangle, Info, CheckCircle, TrendingUp, Clock } from 'lucide-react'

interface StockInsight {
  id: string
  type: 'warning' | 'info' | 'success'
  message: string
  productIds?: string[]
  timestamp?: Date
  priority?: number
}

interface AIStockInsightsPanelProps {
  insights?: StockInsight[]
}

const insightConfig = {
  warning: {
    icon: AlertTriangle,
    bg: 'bg-yellow-50 dark:bg-yellow-900/20',
    border: 'border-yellow-200 dark:border-yellow-800',
    iconColor: 'text-yellow-600 dark:text-yellow-400',
    iconBg: 'bg-yellow-100 dark:bg-yellow-900/40'
  },
  info: {
    icon: Info,
    bg: 'bg-blue-50 dark:bg-blue-900/20',
    border: 'border-blue-200 dark:border-blue-800',
    iconColor: 'text-blue-600 dark:text-blue-400',
    iconBg: 'bg-blue-100 dark:bg-blue-900/40'
  },
  success: {
    icon: CheckCircle,
    bg: 'bg-green-50 dark:bg-green-900/20',
    border: 'border-green-200 dark:border-green-800',
    iconColor: 'text-green-600 dark:text-green-400',
    iconBg: 'bg-green-100 dark:bg-green-900/40'
  }
}

function EmptyState() {
  return (
    <motion.div
      className="text-center py-8"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
    >
      <TrendingUp className="w-12 h-12 mx-auto text-gray-400 dark:text-gray-600 mb-3" />
      <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-1">
        All Clear!
      </h4>
      <p className="text-xs text-gray-500 dark:text-gray-400">
        No stock alerts at the moment
      </p>
    </motion.div>
  )
}

export default function AIStockInsightsPanel({ insights = [] }: AIStockInsightsPanelProps) {
  // Generate default insights if none provided
  const defaultInsights: StockInsight[] = [
    {
      id: '1',
      type: 'warning',
      message: 'Low stock detected on 3 products. Consider reordering soon.',
      timestamp: new Date(),
      priority: 1
    },
    {
      id: '2',
      type: 'info',
      message: 'Demand trending up for Electronics category this week.',
      timestamp: new Date(),
      priority: 2
    },
    {
      id: '3',
      type: 'success',
      message: 'Optimal stock levels maintained across 85% of inventory.',
      timestamp: new Date(),
      priority: 3
    }
  ]

  const displayInsights = insights.length > 0 ? insights : defaultInsights

  return (
    <motion.div
      className="glass rounded-2xl shadow-xl p-6 border border-white/20"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            AI Stock Insights
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Real-time alerts and recommendations
          </p>
        </div>
        <div className="flex items-center space-x-2 text-xs text-gray-500 dark:text-gray-400">
          <Clock className="w-4 h-4" />
          <span>Live</span>
        </div>
      </div>

      {displayInsights.length === 0 ? (
        <EmptyState />
      ) : (
        <div className="space-y-3">
          {displayInsights.map((insight, index) => {
            const config = insightConfig[insight.type]
            const Icon = config.icon

            return (
              <motion.div
                key={insight.id}
                className={`${config.bg} ${config.border} border rounded-xl p-4 cursor-pointer hover:shadow-md transition-all duration-200`}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                whileHover={{ scale: 1.02 }}
              >
                <div className="flex items-start space-x-3">
                  <div className={`${config.iconBg} rounded-lg p-2 flex-shrink-0`}>
                    <Icon className={`w-5 h-5 ${config.iconColor}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      {insight.message}
                    </p>
                    {insight.timestamp && (
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        {new Date(insight.timestamp).toLocaleTimeString('en-IN', {
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </p>
                    )}
                  </div>
                </div>
              </motion.div>
            )
          })}
        </div>
      )}

      {/* AI Badge */}
      <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-center space-x-2 text-xs text-gray-500 dark:text-gray-400">
          <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse"></div>
          <span>Powered by Amazon Bedrock AI</span>
        </div>
      </div>
    </motion.div>
  )
}
