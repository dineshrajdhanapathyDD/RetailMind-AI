import { motion, AnimatePresence } from 'framer-motion'
import { Package, Brain, Check, X, Lightbulb, Target, TrendingUp } from 'lucide-react'

interface Recommendation {
  recommendationId: string
  title: string
  description: string
  productName: string
  currentStock: number
  recommendedQuantity: number
  estimatedCost: number
  confidence: number
  aiInsight: string
  priority: 'critical' | 'high' | 'medium' | 'low'
  status: 'pending' | 'accepted' | 'dismissed'
}

interface RecommendationFeedProps {
  recommendations: Recommendation[]
  isLoading: boolean
  onAccept: (id: string) => void
  onDismiss: (id: string) => void
  processingId: string | null
}

export default function RecommendationFeed({
  recommendations,
  isLoading,
  onAccept,
  onDismiss,
  processingId
}: RecommendationFeedProps) {
  // Priority color mapping
  const getPriorityColors = (priority: string) => {
    switch (priority) {
      case 'critical':
        return {
          bg: 'bg-red-100',
          text: 'text-red-800',
          icon: 'text-red-600',
          badge: 'bg-red-100 text-red-800'
        }
      case 'high':
        return {
          bg: 'bg-orange-100',
          text: 'text-orange-800',
          icon: 'text-orange-600',
          badge: 'bg-orange-100 text-orange-800'
        }
      case 'medium':
        return {
          bg: 'bg-yellow-100',
          text: 'text-yellow-800',
          icon: 'text-yellow-600',
          badge: 'bg-yellow-100 text-yellow-800'
        }
      case 'low':
        return {
          bg: 'bg-blue-100',
          text: 'text-blue-800',
          icon: 'text-blue-600',
          badge: 'bg-blue-100 text-blue-800'
        }
      default:
        return {
          bg: 'bg-gray-100',
          text: 'text-gray-800',
          icon: 'text-gray-600',
          badge: 'bg-gray-100 text-gray-800'
        }
    }
  }

  // Loading skeleton
  if (isLoading) {
    return (
      <div className="space-y-6">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="glass rounded-2xl p-6 animate-pulse"
          >
            <div className="h-6 bg-gray-200 rounded w-3/4 mb-4" />
            <div className="h-4 bg-gray-200 rounded w-full mb-6" />
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[1, 2, 3, 4].map((j) => (
                <div key={j} className="h-20 bg-gray-200 rounded-xl" />
              ))}
            </div>
          </div>
        ))}
      </div>
    )
  }

  // Empty state
  if (recommendations.length === 0) {
    return (
      <motion.div
        className="glass rounded-2xl p-12 text-center"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <motion.div
          className="bg-gradient-to-br from-blue-50 to-purple-50 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6"
          animate={{
            scale: [1, 1.1, 1],
            rotate: [0, 5, -5, 0]
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: 'easeInOut'
          }}
        >
          <Lightbulb className="w-12 h-12 text-blue-600" />
        </motion.div>
        <h3 className="text-2xl font-bold text-gray-900 mb-3">
          No recommendations yet
        </h3>
        <p className="text-gray-500 mb-8 max-w-md mx-auto">
          Click the button above to generate AI-powered recommendations using Amazon Bedrock
        </p>
        <div className="flex items-center justify-center space-x-8 text-sm text-gray-400">
          <div className="flex items-center space-x-2">
            <Target className="w-4 h-4" />
            <span>Smart Analysis</span>
          </div>
          <div className="flex items-center space-x-2">
            <Brain className="w-4 h-4" />
            <span>AI-Powered</span>
          </div>
          <div className="flex items-center space-x-2">
            <TrendingUp className="w-4 h-4" />
            <span>Actionable Insights</span>
          </div>
        </div>
      </motion.div>
    )
  }

  // Recommendation cards
  return (
    <div className="space-y-6">
      <AnimatePresence mode="popLayout">
        {recommendations.map((rec, index) => {
          const colors = getPriorityColors(rec.priority)
          const isProcessing = processingId === rec.recommendationId

          return (
            <motion.div
              key={rec.recommendationId}
              className="glass rounded-2xl overflow-hidden group hover:shadow-2xl transition-shadow duration-300"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.3 } }}
              transition={{ delay: index * 0.05, duration: 0.5 }}
              layout
            >
              <div className="p-6">
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-3">
                      <div className={`p-2 rounded-lg ${colors.bg}`}>
                        <Package className={`w-5 h-5 ${colors.icon}`} />
                      </div>
                      <h3 className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                        {rec.title}
                      </h3>
                    </div>
                    <p className="text-gray-600 mb-6 leading-relaxed">
                      {rec.description}
                    </p>
                  </div>
                </div>

                {/* Metrics Grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                  <motion.div
                    className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-4"
                    whileHover={{ scale: 1.02 }}
                    transition={{ type: 'spring', stiffness: 300 }}
                  >
                    <p className="text-xs text-blue-600 font-medium mb-1">
                      Current Stock
                    </p>
                    <p className="text-2xl font-bold text-blue-900">
                      {rec.currentStock}
                    </p>
                  </motion.div>

                  <motion.div
                    className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-4"
                    whileHover={{ scale: 1.02 }}
                    transition={{ type: 'spring', stiffness: 300 }}
                  >
                    <p className="text-xs text-purple-600 font-medium mb-1">
                      Recommended Qty
                    </p>
                    <p className="text-2xl font-bold text-purple-900">
                      {rec.recommendedQuantity}
                    </p>
                  </motion.div>

                  <motion.div
                    className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-4"
                    whileHover={{ scale: 1.02 }}
                    transition={{ type: 'spring', stiffness: 300 }}
                  >
                    <p className="text-xs text-green-600 font-medium mb-1">
                      Estimated Cost
                    </p>
                    <p className="text-2xl font-bold text-green-900">
                      ₹{rec.estimatedCost.toLocaleString('en-IN', {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2
                      })}
                    </p>
                  </motion.div>

                  <motion.div
                    className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl p-4"
                    whileHover={{ scale: 1.02 }}
                    transition={{ type: 'spring', stiffness: 300 }}
                  >
                    <p className="text-xs text-orange-600 font-medium mb-1">
                      Confidence
                    </p>
                    <div className="flex items-center space-x-2">
                      <div className="flex-1 bg-white rounded-full h-2 overflow-hidden">
                        <motion.div
                          className="bg-gradient-to-r from-orange-400 to-orange-600 h-2 rounded-full"
                          initial={{ width: 0 }}
                          animate={{ width: `${rec.confidence}%` }}
                          transition={{ delay: index * 0.05 + 0.3, duration: 0.8 }}
                        />
                      </div>
                      <span className="text-lg font-bold text-orange-900">
                        {rec.confidence}%
                      </span>
                    </div>
                  </motion.div>
                </div>

                {/* AI Insight */}
                {rec.aiInsight && (
                  <motion.div
                    className="bg-gradient-to-r from-blue-50 to-purple-50 border-l-4 border-blue-500 rounded-lg p-4 mb-6"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 + 0.4, duration: 0.5 }}
                  >
                    <div className="flex items-start space-x-3">
                      <Brain className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="text-sm font-semibold text-blue-900 mb-1">
                          AI Insight
                        </p>
                        <p className="text-sm text-blue-800">{rec.aiInsight}</p>
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* Priority Badge and Actions */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <span
                    className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-bold ${colors.badge}`}
                  >
                    {rec.priority.toUpperCase()} PRIORITY
                  </span>

                  <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3 w-full sm:w-auto">
                    <motion.button
                      onClick={() => onAccept(rec.recommendationId)}
                      disabled={isProcessing}
                      className="w-full sm:w-auto px-6 py-2 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-lg hover:shadow-lg transition-all duration-200 font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      {isProcessing ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
                          <span>Processing...</span>
                        </>
                      ) : (
                        <>
                          <Check className="w-4 h-4" />
                          <span>Accept</span>
                        </>
                      )}
                    </motion.button>

                    <motion.button
                      onClick={() => onDismiss(rec.recommendationId)}
                      disabled={isProcessing}
                      className="w-full sm:w-auto px-6 py-2 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-all duration-200 font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      {isProcessing ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-700" />
                          <span>Processing...</span>
                        </>
                      ) : (
                        <>
                          <X className="w-4 h-4" />
                          <span>Dismiss</span>
                        </>
                      )}
                    </motion.button>
                  </div>
                </div>
              </div>
            </motion.div>
          )
        })}
      </AnimatePresence>
    </div>
  )
}
