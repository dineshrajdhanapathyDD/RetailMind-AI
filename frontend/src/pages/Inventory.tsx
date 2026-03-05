import { useQuery } from '@tanstack/react-query'
import { API_ENDPOINTS } from '../config'
import axios from 'axios'
import { useState } from 'react'
import { motion } from 'framer-motion'
import InventoryHeroSection from '../components/InventoryHeroSection'
import InventoryMetricsCards from '../components/InventoryMetricsCards'
import InventoryTable from '../components/InventoryTable'
import AIStockInsightsPanel from '../components/AIStockInsightsPanel'

export default function Inventory() {
  const [clearing, setClearing] = useState(false)
  
  const { data, isLoading, refetch } = useQuery({
    queryKey: ['inventory'],
    queryFn: async () => {
      const response = await axios.get(API_ENDPOINTS.inventory)
      return response.data
    }
  })

  const items = data?.items || []

  // Calculate metrics from inventory data
  const lowStockCount = items.filter((item: any) => 
    item.status === 'low' || item.status === 'critical'
  ).length
  
  const optimalCount = items.filter((item: any) => 
    item.status === 'optimal'
  ).length
  
  const totalValue = items.reduce((sum: number, item: any) => 
    sum + (item.price * item.currentStock), 0
  )

  const handleClearAllData = async () => {
    const confirmed = window.confirm(
      '⚠️ Clear ALL Inventory Data?\n\n' +
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
      refetch()
    } catch (error) {
      console.error('Error clearing data:', error)
      alert('Failed to clear data. Please try again.')
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
      {/* Hero Section */}
      <InventoryHeroSection
        onClearInventory={handleClearAllData}
        isClearing={clearing}
        hasInventory={items.length > 0}
      />

      {/* Metrics Cards */}
      <InventoryMetricsCards
        totalItems={items.length}
        lowStockCount={lowStockCount}
        totalValue={totalValue}
        optimalCount={optimalCount}
      />

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Inventory Table - Takes 2 columns on large screens */}
        <div className="lg:col-span-2">
          <InventoryTable items={items} isLoading={isLoading} />
        </div>

        {/* AI Stock Insights Panel - Takes 1 column on large screens */}
        <div className="lg:col-span-1">
          <AIStockInsightsPanel />
        </div>
      </div>
    </motion.div>
  )
}
