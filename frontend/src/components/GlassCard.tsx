import { motion } from 'framer-motion'
import { ReactNode } from 'react'

interface GlassCardProps {
  children: ReactNode
  className?: string
  hover?: boolean
  onClick?: () => void
}

export default function GlassCard({ 
  children, 
  className = '', 
  hover = true,
  onClick 
}: GlassCardProps) {
  return (
    <motion.div
      className={`
        glass rounded-2xl shadow-xl
        ${hover ? 'hover:shadow-2xl hover:-translate-y-1 cursor-pointer' : ''}
        transition-all duration-300
        ${className}
      `}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      onClick={onClick}
      whileHover={hover ? { y: -4 } : undefined}
    >
      {children}
    </motion.div>
  )
}
