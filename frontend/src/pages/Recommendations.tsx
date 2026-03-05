import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { motion } from 'framer-motion'
import { API_ENDPOINTS } from '../config'
import axios from 'axios'
import RecommendationHeroBanner from '../components/RecommendationHeroBanner'
import RecommendationFeed from '../components/RecommendationFeed'
import AITrendAnalysisPanel from '../components/AITrendAnalysisPanel'

export default function Recommendations() {
  const [processingId, setProcessingId] = useState<string | null>(null)
  const [generating, setGenerating] = useState(false)
  const [clearing, setClearing] = useState(false)
  
  const { data, isLoading, refetch } = useQuery({
    queryKey: ['recommendations'],
    queryFn: async () => {
      const response = await axios.get(API_ENDPOINTS.recommendations)
      return response.data
    }
  })

  const recommendations = data?.recommendations || []

  const handleGenerateRecommendations = async () => {
    setGenerating(true)
    try {
      await axios.post(API_ENDPOINTS.recommendations)
      await refetch()
      // Show success notification
      alert('✓ AI recommendations generated successfully!')
    } catch (error) {
      console.error('Error generating recommendations:', error)
      alert('Failed to generate recommendations. Please try again.')
    } finally {
      setGenerating(false)
    }
  }

  const handleAccept = async (recommendationId: string) => {
    // Show confirmation
    const confirmed = window.confirm(
      'Accept this recommendation?\n\n' +
      'This will mark the recommendation as accepted and remove it from your pending list. ' +
      'You can proceed with ordering the recommended quantity.'
    )
    
    if (!confirmed) return
    
    setProcessingId(recommendationId)
    try {
      await axios.patch(`${API_ENDPOINTS.recommendations}/${recommendationId}`, {
        status: 'accepted'
      })
      await refetch()
      // Show success message
      alert('✓ Recommendation accepted successfully!')
    } catch (error) {
      console.error('Error accepting recommendation:', error)
      alert('Failed to accept recommendation. Please try again.')
    } finally {
      setProcessingId(null)
    }
  }

  const handleDismiss = async (recommendationId: string) => {
    // Show confirmation
    const confirmed = window.confirm(
      'Dismiss this recommendation?\n\n' +
      'This will remove the recommendation from your pending list. ' +
      'You can always generate new recommendations later.'
    )
    
    if (!confirmed) return
    
    setProcessingId(recommendationId)
    try {
      await axios.patch(`${API_ENDPOINTS.recommendations}/${recommendationId}`, {
        status: 'dismissed'
      })
      await refetch()
      // Show success message
      alert('✓ Recommendation dismissed successfully!')
    } catch (error) {
      console.error('Error dismissing recommendation:', error)
      alert('Failed to dismiss recommendation. Please try again.')
    } finally {
      setProcessingId(null)
    }
  }

  const handleClearAll = async () => {
    // Show confirmation
    const confirmed = window.confirm(
      'Clear all recommendations?\n\n' +
      'This will remove ALL pending recommendations from your list. ' +
      'This action cannot be undone. You can generate new recommendations afterwards.'
    )
    
    if (!confirmed) return
    
    setClearing(true)
    try {
      // Dismiss all recommendations one by one
      for (const rec of recommendations) {
        await axios.patch(`${API_ENDPOINTS.recommendations}/${rec.recommendationId}`, {
          status: 'dismissed'
        })
      }
      await refetch()
      alert('✓ All recommendations cleared successfully!')
    } catch (error) {
      console.error('Error clearing recommendations:', error)
      alert('Failed to clear recommendations. Please try again.')
    } finally {
      setClearing(false)
    }
  }

  return (
    <motion.div
      className="space-y-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {/* Hero Banner */}
      <RecommendationHeroBanner
        onGenerate={handleGenerateRecommendations}
        isGenerating={generating}
        hasRecommendations={recommendations.length > 0}
        onClearAll={handleClearAll}
        isClearing={clearing}
      />

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recommendation Feed - Takes 2 columns on large screens */}
        <div className="lg:col-span-2">
          <RecommendationFeed
            recommendations={recommendations}
            isLoading={isLoading}
            onAccept={handleAccept}
            onDismiss={handleDismiss}
            processingId={processingId}
          />
        </div>

        {/* AI Trend Analysis Panel - Takes 1 column on large screens */}
        <div className="lg:col-span-1">
          <AITrendAnalysisPanel />
        </div>
      </div>
    </motion.div>
  )
}
