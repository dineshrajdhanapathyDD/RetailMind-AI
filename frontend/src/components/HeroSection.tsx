import { motion } from 'framer-motion'
import { Sparkles } from 'lucide-react'

interface HeroSectionProps {
  onSeedData: () => void
  onClearData: () => void
  isClearing: boolean
  hasData: boolean
}

export default function HeroSection({
  onSeedData,
  onClearData,
  isClearing,
  hasData
}: HeroSectionProps) {
  return (
    <motion.div
      className="relative overflow-hidden rounded-2xl p-8 glass"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Multi-color gradient background */}
      <div className="absolute inset-0 bg-gradient-to-r from-purple-600 via-blue-600 to-pink-600 opacity-90" />
      
      {/* Animated gradient orbs */}
      <motion.div
        className="absolute top-0 right-0 -mt-4 -mr-4 w-64 h-64 bg-white/10 rounded-full blur-3xl"
        animate={{
          x: [0, 30, 0],
          y: [0, -30, 0],
          scale: [1, 1.1, 1]
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: 'easeInOut'
        }}
      />
      <motion.div
        className="absolute bottom-0 left-0 -mb-4 -ml-4 w-64 h-64 bg-white/10 rounded-full blur-3xl"
        animate={{
          x: [0, -30, 0],
          y: [0, 30, 0],
          scale: [1, 1.2, 1]
        }}
        transition={{
          duration: 25,
          repeat: Infinity,
          ease: 'easeInOut'
        }}
      />

      {/* Content */}
      <div className="relative z-10">
        <div className="flex items-center justify-between flex-wrap gap-6">
          <div>
            {/* Title with sparkle animation */}
            <div className="flex items-center space-x-3 mb-2">
              <motion.div
                animate={{
                  rotate: [0, 360],
                  scale: [1, 1.2, 1]
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: 'easeInOut'
                }}
              >
                <Sparkles className="w-8 h-8 text-white" />
              </motion.div>
              <h2 className="text-3xl font-bold text-white">
                Welcome to RetailMind AI
              </h2>
            </div>
            <p className="text-blue-100 text-lg">
              AI-powered retail intelligence powered by Amazon Bedrock
            </p>
          </div>

          {/* Action buttons */}
          <div className="flex items-center space-x-3">
            {/* Primary action - Seed Data */}
            <motion.button
              onClick={onSeedData}
              disabled={isClearing}
              className="flex items-center px-6 py-3 bg-white/20 backdrop-blur-sm text-white rounded-xl hover:bg-white/30 transition-all duration-200 font-medium border-2 border-white/30 hover:border-white/50 shadow-lg disabled:opacity-50"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <svg
                className="w-5 h-5 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4"
                />
              </svg>
              Seed Data
            </motion.button>

            {/* Secondary action - Clear Data (only show if data exists) */}
            {hasData && (
              <motion.button
                onClick={onClearData}
                disabled={isClearing}
                className="flex items-center px-6 py-3 bg-red-600/90 backdrop-blur-sm text-white rounded-xl hover:bg-red-700 transition-all duration-200 font-medium border-2 border-red-500/50 hover:border-red-400 shadow-lg disabled:opacity-50"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
              >
                {isClearing ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2" />
                    Clearing...
                  </>
                ) : (
                  <>
                    <svg
                      className="w-5 h-5 mr-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                      />
                    </svg>
                    Clear All
                  </>
                )}
              </motion.button>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  )
}
