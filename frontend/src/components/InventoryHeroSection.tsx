import { motion } from 'framer-motion'
import { Box, Plus, BarChart3, Trash2 } from 'lucide-react'

interface InventoryHeroSectionProps {
  onClearInventory: () => void
  isClearing: boolean
  hasInventory: boolean
}

export default function InventoryHeroSection({
  onClearInventory,
  isClearing,
  hasInventory
}: InventoryHeroSectionProps) {
  return (
    <motion.div
      className="relative overflow-hidden bg-gradient-to-r from-emerald-600 to-teal-600 rounded-2xl shadow-2xl p-8 text-white"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Animated background orbs */}
      <div className="absolute top-0 right-0 -mt-4 -mr-4 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 left-0 -mb-4 -ml-4 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
      
      <div className="relative z-10 flex items-center justify-between flex-wrap gap-4">
        <div>
          <div className="flex items-center space-x-3 mb-2">
            <Box className="w-8 h-8" />
            <h2 className="text-3xl font-bold">Inventory Management</h2>
          </div>
          <p className="text-emerald-100 text-lg">
            Real-time stock monitoring powered by AI
          </p>
        </div>
        
        <div className="flex items-center space-x-4">
          {/* Add Product Button - Placeholder */}
          <motion.button
            className="flex items-center px-6 py-3 bg-white/20 backdrop-blur-sm text-white rounded-xl hover:bg-white/30 transition-all duration-200 font-medium border border-white/30 shadow-lg"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Plus className="w-5 h-5 mr-2" />
            Add Product
          </motion.button>
          
          {/* Analytics Button - Placeholder */}
          <motion.button
            className="flex items-center px-6 py-3 bg-white/20 backdrop-blur-sm text-white rounded-xl hover:bg-white/30 transition-all duration-200 font-medium border border-white/30 shadow-lg"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <BarChart3 className="w-5 h-5 mr-2" />
            Analytics
          </motion.button>
          
          {/* Clear Inventory Button */}
          {hasInventory && (
            <motion.button
              onClick={onClearInventory}
              disabled={isClearing}
              className="flex items-center px-6 py-3 bg-red-600/90 backdrop-blur-sm text-white rounded-xl hover:bg-red-700 transition-all duration-200 font-medium border-2 border-red-500/50 hover:border-red-400 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
              whileHover={!isClearing ? { scale: 1.05 } : undefined}
              whileTap={!isClearing ? { scale: 0.95 } : undefined}
            >
              {isClearing ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2" />
                  Clearing...
                </>
              ) : (
                <>
                  <Trash2 className="w-5 h-5 mr-2" />
                  Clear All
                </>
              )}
            </motion.button>
          )}
        </div>
      </div>
    </motion.div>
  )
}
