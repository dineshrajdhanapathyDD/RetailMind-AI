import { motion } from 'framer-motion'
import { Package, TrendingUp, Store, Users, ArrowRight } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

interface RetailFeature {
  id: string
  title: string
  description: string
  icon: React.ReactNode
  backgroundImage: string
  route: string
}

export default function RetailFeaturesGrid() {
  const navigate = useNavigate()

  const features: RetailFeature[] = [
    {
      id: 'smart-inventory',
      title: 'Smart Inventory',
      description: 'AI-powered stock management with predictive analytics and automated reorder suggestions',
      icon: <Package className="w-6 h-6" />,
      backgroundImage: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      route: '/inventory'
    },
    {
      id: 'retail-analytics',
      title: 'Retail Analytics',
      description: 'Real-time insights and trend analysis to optimize your retail operations',
      icon: <TrendingUp className="w-6 h-6" />,
      backgroundImage: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
      route: '/recommendations'
    },
    {
      id: 'store-operations',
      title: 'Store Operations',
      description: 'Streamline daily operations with intelligent automation and workflow optimization',
      icon: <Store className="w-6 h-6" />,
      backgroundImage: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
      route: '/inventory'
    },
    {
      id: 'customer-experience',
      title: 'Customer Experience',
      description: 'Enhance customer satisfaction with data-driven inventory availability',
      icon: <Users className="w-6 h-6" />,
      backgroundImage: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
      route: '/recommendations'
    }
  ]

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          Retail Intelligence Features
        </h3>
        <p className="text-gray-500 dark:text-gray-400">
          Explore how AI transforms your retail operations
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {features.map((feature, index) => (
          <FeatureCard
            key={feature.id}
            feature={feature}
            index={index}
            onExplore={() => navigate(feature.route)}
          />
        ))}
      </div>
    </div>
  )
}

interface FeatureCardProps {
  feature: RetailFeature
  index: number
  onExplore: () => void
}

function FeatureCard({ feature, index, onExplore }: FeatureCardProps) {
  const { title, description, icon, backgroundImage } = feature

  return (
    <motion.div
      className="group relative overflow-hidden rounded-2xl glass border border-white/20 cursor-pointer"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ 
        duration: 0.5,
        delay: index * 0.05 // 50ms stagger
      }}
      whileHover={{ y: -4 }}
      onClick={onExplore}
    >
      {/* Background with gradient overlay and zoom effect */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          className="absolute inset-0"
          style={{ background: backgroundImage }}
          whileHover={{ scale: 1.1 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
        />
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
      </div>

      {/* Content */}
      <div className="relative z-10 p-6 h-full flex flex-col justify-between min-h-[280px]">
        {/* Icon */}
        <motion.div
          className="bg-white/20 backdrop-blur-sm p-3 rounded-xl w-fit"
          whileHover={{ scale: 1.1, rotate: 5 }}
          transition={{ duration: 0.2 }}
        >
          <div className="text-white">
            {icon}
          </div>
        </motion.div>

        {/* Text content */}
        <div className="space-y-3">
          <h4 className="text-xl font-bold text-white">
            {title}
          </h4>
          <p className="text-sm text-gray-200 leading-relaxed">
            {description}
          </p>

          {/* Explore button */}
          <motion.button
            className="flex items-center space-x-2 text-white font-medium group-hover:text-blue-200 transition-colors"
            whileHover={{ x: 5 }}
          >
            <span>Explore</span>
            <ArrowRight className="w-4 h-4" />
          </motion.button>
        </div>
      </div>

      {/* Hover glow effect */}
      <motion.div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        style={{
          background: 'radial-gradient(circle at center, rgba(255,255,255,0.1) 0%, transparent 70%)'
        }}
      />
    </motion.div>
  )
}
