import { motion } from 'framer-motion'
import { Sparkles, Trash2 } from 'lucide-react'

interface RecommendationHeroBannerProps {
  onGenerate: () => void
  isGenerating: boolean
  hasRecommendations: boolean
  onClearAll: () => void
  isClearing: boolean
}

export default function RecommendationHeroBanner({
  onGenerate,
  isGenerating,
  hasRecommendations,
  onClearAll,
  isClearing
}: RecommendationHeroBannerProps) {
  return (
    <motion.div
      className="relative overflow-hidden rounded-2xl shadow-2xl"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Gradient Background */}
      <div className="absolute inset-0 bg-gradient-to-r from-purple-600 via-pink-600 to-purple-600" />
      
      {/* Glass overlay */}
      <div className="relative backdrop-blur-sm bg-white/10 border border-white/20">
        <div className="px-8 py-12">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            {/* Title Section */}
            <div className="text-white text-center md:text-left">
              <motion.h1
                className="text-4xl md:text-5xl font-bold mb-3"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2, duration: 0.5 }}
              >
                AI Recommendations
              </motion.h1>
              <motion.p
                className="text-lg md:text-xl text-purple-100"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3, duration: 0.5 }}
              >
                Intelligent insights powered by Amazon Bedrock
              </motion.p>
            </div>

            {/* Action Buttons */}
            <motion.div
              className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4, duration: 0.5 }}
            >
              <motion.button
                onClick={onGenerate}
                disabled={isGenerating || isClearing}
                className="w-full sm:w-auto px-6 py-3 bg-white text-purple-600 rounded-xl font-bold shadow-xl hover:shadow-2xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 group"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {isGenerating ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-purple-600" />
                    <span>Generating...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-5 h-5 group-hover:rotate-12 transition-transform" />
                    <span>Generate New</span>
                  </>
                )}
              </motion.button>

              {hasRecommendations && (
                <motion.button
                  onClick={onClearAll}
                  disabled={isClearing || isGenerating}
                  className="w-full sm:w-auto px-6 py-3 bg-red-600 text-white rounded-xl font-bold shadow-xl hover:shadow-2xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.5 }}
                >
                  {isClearing ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white" />
                      <span>Clearing...</span>
                    </>
                  ) : (
                    <>
                      <Trash2 className="w-5 h-5" />
                      <span>Clear All</span>
                    </>
                  )}
                </motion.button>
              )}
            </motion.div>
          </div>
        </div>
      </div>
    </motion.div>
  )
}
