import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { motion } from 'framer-motion'
import { API_ENDPOINTS } from '../config'
import axios from 'axios'
import DataUploadModal from '../components/DataUploadModal'
import HeroSection from '../components/HeroSection'
import KPIMetricsGrid from '../components/KPIMetricsGrid'
import AIInsightsPanel from '../components/AIInsightsPanel'
import RetailFeaturesGrid from '../components/RetailFeaturesGrid'

export default function Dashboard() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [clearing, setClearing] = useState(false)
  const [generating, setGenerating] = useState(false)
  
  // Parallel data fetching for performance
  const { data: inventory, refetch: refetchInventory } = useQuery({
    queryKey: ['inventory'],
    queryFn: async () => {
      const response = await axios.get(API_ENDPOINTS.inventory)
      return response.data
    }
  })

  const { data: recommendations, refetch: refetchRecommendations, isLoading: recommendationsLoading } = useQuery({
    queryKey: ['recommendations'],
    queryFn: async () => {
      const response = await axios.get(API_ENDPOINTS.recommendations)
      return response.data
    }
  })

  const inventoryItems = inventory?.items || []
  const recommendationsList = recommendations?.recommendations || []

  // Calculate KPIs
  const totalProducts = inventoryItems.length
  const lowStockItems = inventoryItems.filter((item: any) => 
    item.status === 'low' || item.status === 'critical'
  ).length
  const activeRecommendations = recommendationsList.filter((rec: any) => 
    rec.status === 'pending'
  ).length
  const automationRate = 95 // Static for now, can be calculated from historical data

  const handleClearAllData = async () => {
    const confirmed = window.confirm(
      '⚠️ Clear ALL Data?\n\n' +
      'This will permanently delete:\n' +
      '• All products\n' +
      '• All inventory records\n' +
      '• All recommendations\n\n' +
      'This action CANNOT be undone!\n\n' +
      'Are you absolutely sure?'
    )
    
    if (!confirmed) return
    
    // Double confirmation for safety
    const doubleConfirm = window.confirm(
      'Final Confirmation\n\n' +
      'Click OK to permanently delete all data, or Cancel to keep your data.'
    )
    
    if (!doubleConfirm) return
    
    setClearing(true)
    try {
      await axios.delete(API_ENDPOINTS.clearAll)
      alert('✓ All data cleared successfully!')
      refetchInventory()
      refetchRecommendations()
    } catch (error) {
      console.error('Error clearing data:', error)
      alert('Failed to clear data. Please try again.')
    } finally {
      setClearing(false)
    }
  }

  const handleGenerateRecommendations = async () => {
    setGenerating(true)
    try {
      await axios.post(API_ENDPOINTS.recommendations)
      await refetchRecommendations()
      alert('✓ AI recommendations generated successfully!')
    } catch (error) {
      console.error('Error generating recommendations:', error)
      alert('Failed to generate recommendations. Please try again.')
    } finally {
      setGenerating(false)
    }
  }

  return (
    <motion.div
      className="space-y-8"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {/* Data Upload Modal */}
      <DataUploadModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={() => {
          refetchInventory()
          refetchRecommendations()
          setIsModalOpen(false)
        }}
      />

      {/* Hero Section */}
      <HeroSection
        onSeedData={() => setIsModalOpen(true)}
        onClearData={handleClearAllData}
        isClearing={clearing}
        hasData={inventoryItems.length > 0}
      />

      {/* KPI Metrics Grid */}
      <KPIMetricsGrid
        totalProducts={totalProducts}
        lowStockItems={lowStockItems}
        activeRecommendations={activeRecommendations}
        automationRate={automationRate}
      />

      {/* AI Insights Panel */}
      <AIInsightsPanel
        recommendations={recommendationsList}
        isLoading={generating || recommendationsLoading}
        onGenerate={handleGenerateRecommendations}
      />

      {/* Retail Features Grid */}
      <RetailFeaturesGrid />
    </motion.div>
  )
}
