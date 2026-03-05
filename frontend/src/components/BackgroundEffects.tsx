import { motion } from 'framer-motion'

interface BackgroundEffectsProps {
  variant?: 'grid' | 'particles' | 'gradient'
  intensity?: 'low' | 'medium' | 'high'
  animated?: boolean
}

export default function BackgroundEffects({ 
  variant = 'grid', 
  intensity = 'medium',
  animated = true 
}: BackgroundEffectsProps) {
  const orbCount = intensity === 'low' ? 2 : intensity === 'medium' ? 3 : 5

  return (
    <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
      {/* Grid Background */}
      {variant === 'grid' && (
        <div 
          className="absolute inset-0 opacity-30"
          style={{
            backgroundImage: `
              linear-gradient(to right, rgba(128, 128, 128, 0.1) 1px, transparent 1px),
              linear-gradient(to bottom, rgba(128, 128, 128, 0.1) 1px, transparent 1px)
            `,
            backgroundSize: '14px 24px'
          }}
        />
      )}

      {/* Gradient Orbs */}
      {animated && (
        <>
          {Array.from({ length: orbCount }).map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-96 h-96 rounded-full blur-3xl"
              style={{
                background: `radial-gradient(circle, ${
                  i % 3 === 0 ? 'rgba(139, 92, 246, 0.3)' : 
                  i % 3 === 1 ? 'rgba(59, 130, 246, 0.3)' : 
                  'rgba(236, 72, 153, 0.3)'
                }, transparent 70%)`,
                left: `${(i * 25) % 100}%`,
                top: `${(i * 30) % 100}%`
              }}
              animate={{
                x: [0, 100, -50, 0],
                y: [0, -100, 50, 0],
                scale: [1, 1.2, 0.9, 1],
                opacity: [0.3, 0.5, 0.3, 0.3]
              }}
              transition={{
                duration: 20 + i * 5,
                repeat: Infinity,
                ease: 'easeInOut'
              }}
            />
          ))}
        </>
      )}

      {/* Static gradient overlay for depth */}
      <div 
        className="absolute inset-0 opacity-20"
        style={{
          background: 'radial-gradient(circle at 50% 50%, rgba(139, 92, 246, 0.1), transparent 50%)'
        }}
      />
    </div>
  )
}
