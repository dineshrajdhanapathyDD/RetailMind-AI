import { motion } from 'framer-motion'
import { Sparkles, Brain, ArrowRight } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

interface AIRecommendation {
  recommendationId: string
  title: string
  description: string
  productName: string
  confidence: number
  priority: 'critical' | 'high' | 'medium' | 'low'
  status: 'pending' | 'accepted' | 'dismissed'
}

interface AIInsightsPanelProps {
  recommendations: AIRecommendation[]
  isLoading: boolean
  onGenerate: () => void
}

export default function AIInsightsPanel({
  recommendations,
  isLoading,
  onGenerate
}: AIInsightsPanelProps) {
  const navigate = useNavigate()

  // Filter to show only pending recommendations
  const pendingRecommendations = recommendations.filter(
    rec => rec.status === 'pending'
  ).slice(0, 3) // Show max 3 on dashboard

  return (
    <div className="glass rounded-2xl shadow-xl p-6 border border-white/20">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="bg-gradient-to-br from-purple-500 to-pink-500 p-2 rounded-lg">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white">
              AI Recommendations
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Powered by Amazon Bedrock
            </p>
          </div>
        </div>

        {/* Generate button - show when no recommendations */}
        {pendingRecommendations.length === 0 && !isLoading && (
          <motion.button
            onClick={onGenerate}
            className="flex items-center px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:shadow-lg transition-all duration-200 font-medium"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Sparkles className="w-4 h-4 mr-2" />
            Generate Recommendations
          </motion.button>
        )}
      </div>

      {/* Loading state */}
      {isLoading && (
        <div className="flex items-center justify-center py-12">
          <div className="flex flex-col items-center space-y-4">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600" />
            <p className="text-gray-600 dark:text-gray-400">
              Generating AI insights...
            </p>
          </div>
        </div>
      )}

      {/* Empty state */}
      {!isLoading && pendingRecommendations.length === 0 && (
        <motion.div
          className="text-center py-12"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <motion.div
            className="bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4"
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
            <Brain className="w-10 h-10 text-purple-600" />
          </motion.div>
          <p className="text-gray-600 dark:text-gray-400 mb-2">
            No recommendations yet
          </p>
          <p className="text-sm text-gray-400 dark:text-gray-500">
            Click the button above to generate AI-powered insights
          </p>
        </motion.div>
      )}

      {/* Recommendation cards */}
      {!isLoading && pendingRecommendations.length > 0 && (
        <div className="space-y-4">
          {pendingRecommendations.map((rec, index) => (
            <RecommendationCard
              key={rec.recommendationId}
              recommendation={rec}
              index={index}
              onClick={() => navigate('/recommendations')}
            />
          ))}

          {/* View all link */}
          {recommendations.filter(r => r.status === 'pending').length > 3 && (
            <motion.button
              onClick={() => navigate('/recommendations')}
              className="w-full flex items-center justify-center space-x-2 py-3 text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 font-medium transition-colors"
              whileHover={{ x: 5 }}
            >
              <span>View all recommendations</span>
              <ArrowRight className="w-4 h-4" />
            </motion.button>
          )}
        </div>
      )}
    </div>
  )
}

interface RecommendationCardProps {
  recommendation: AIRecommendation
  index: number
  onClick: () => void
}

function RecommendationCard({ recommendation, index, onClick }: RecommendationCardProps) {
  const { title, description, confidence, priority } = recommendation

  const priorityConfig = {
    critical: {
      bg: 'bg-red-100 dark:bg-red-900/30',
      text: 'text-red-700 dark:text-red-400',
      label: 'CRITICAL'
    },
    high: {
      bg: 'bg-orange-100 dark:bg-orange-900/30',
      text: 'text-orange-700 dark:text-orange-400',
      label: 'HIGH'
    },
    medium: {
      bg: 'bg-yellow-100 dark:bg-yellow-900/30',
      text: 'text-yellow-700 dark:text-yellow-400',
      label: 'MEDIUM'
    },
    low: {
      bg: 'bg-blue-100 dark:bg-blue-900/30',
      text: 'text-blue-700 dark:text-blue-400',
      label: 'LOW'
    }
  }

  const config = priorityConfig[priority]

  return (
    <motion.div
      className="group border border-gray-200 dark:border-gray-700 rounded-xl p-5 hover:shadow-lg hover:border-purple-300 dark:hover:border-purple-600 transition-all duration-200 cursor-pointer bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ 
        duration: 0.5,
        delay: index * 0.05 // 50ms stagger
      }}
      onClick={onClick}
      whileHover={{ y: -2 }}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          {/* Title and priority badge */}
          <div className="flex items-center space-x-3 mb-2">
            <h4 className="font-semibold text-gray-900 dark:text-white group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
              {title}
            </h4>
            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${config.bg} ${config.text}`}>
              {config.label}
            </span>
          </div>

          {/* Description */}
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
            {description}
          </p>

          {/* Confidence score */}
          <div className="flex items-center space-x-2">
            <div className="w-24 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
              <motion.div
                className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${confidence}%` }}
                transition={{ duration: 1, delay: index * 0.05 + 0.3 }}
              />
            </div>
            <span className="text-xs font-medium text-gray-600 dark:text-gray-400">
              {confidence}% confidence
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  )
}
