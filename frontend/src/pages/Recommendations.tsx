import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Lightbulb, TrendingUp, Sparkles, Package, Target, Brain, Check, X, Trash2 } from 'lucide-react'
import { API_ENDPOINTS } from '../config'
import axios from 'axios'

export default function Recommendations() {
  const [processingId, setProcessingId] = useState<string | null>(null)
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
    try {
      await axios.post(API_ENDPOINTS.recommendations)
      refetch()
    } catch (error) {
      console.error('Error generating recommendations:', error)
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

  if (isLoading) {
    return <div className="text-center py-8">Loading...</div>
  }

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Hero Section with Image */}
      <div className="relative overflow-hidden rounded-2xl shadow-2xl h-64">
        <img
          src="https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=1200&h=400&fit=crop"
          alt="Retail Analytics"
          className="absolute inset-0 w-full h-full object-cover"
          onError={(e) => {
            e.currentTarget.style.display = 'none'
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-purple-900/90 to-pink-900/90" />
        <div className="relative z-10 h-full flex items-center justify-between px-8">
          <div className="flex items-center space-x-4">
            <div className="bg-white/20 backdrop-blur-sm p-4 rounded-xl">
              <Brain className="w-10 h-10 text-white" />
            </div>
            <div className="text-white">
              <h2 className="text-4xl font-bold mb-2">AI Recommendations</h2>
              <p className="text-lg text-purple-100">Intelligent insights powered by Amazon Bedrock</p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <button
              onClick={handleGenerateRecommendations}
              disabled={clearing}
              className="hidden md:flex items-center px-6 py-3 bg-white text-purple-600 rounded-xl hover:shadow-xl transition-all duration-200 font-bold group disabled:opacity-50"
            >
              <Sparkles className="w-5 h-5 mr-2 group-hover:rotate-12 transition-transform" />
              Generate New
            </button>
            {recommendations.length > 0 && (
              <button
                onClick={handleClearAll}
                disabled={clearing}
                className="hidden md:flex items-center px-6 py-3 bg-red-600 text-white rounded-xl hover:shadow-xl transition-all duration-200 font-bold group disabled:opacity-50"
              >
                {clearing ? (
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
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Action Buttons */}
      <div className="md:hidden space-y-3">
        <button
          onClick={handleGenerateRecommendations}
          disabled={clearing}
          className="w-full flex items-center justify-center px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:shadow-xl transition-all duration-200 font-medium group disabled:opacity-50"
        >
          <Sparkles className="w-5 h-5 mr-2 group-hover:rotate-12 transition-transform" />
          Generate New Recommendations
        </button>
        {recommendations.length > 0 && (
          <button
            onClick={handleClearAll}
            disabled={clearing}
            className="w-full flex items-center justify-center px-6 py-3 bg-red-600 text-white rounded-xl hover:shadow-xl transition-all duration-200 font-medium disabled:opacity-50"
          >
            {clearing ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2" />
                Clearing All...
              </>
            ) : (
              <>
                <Trash2 className="w-5 h-5 mr-2" />
                Clear All Recommendations
              </>
            )}
          </button>
        )}
      </div>

      {recommendations.length === 0 ? (
        <div className="bg-white shadow-xl rounded-2xl p-12 text-center border border-gray-100">
          <div className="bg-gradient-to-br from-blue-50 to-purple-50 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6">
            <Lightbulb className="w-12 h-12 text-blue-600" />
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-3">
            No recommendations yet
          </h3>
          <p className="text-gray-500 mb-8 max-w-md mx-auto">
            Click the button above to generate AI-powered recommendations using Amazon Bedrock
          </p>
          <div className="flex items-center justify-center space-x-8 text-sm text-gray-400">
            <div className="flex items-center space-x-2">
              <Target className="w-4 h-4" />
              <span>Smart Analysis</span>
            </div>
            <div className="flex items-center space-x-2">
              <Brain className="w-4 h-4" />
              <span>AI-Powered</span>
            </div>
            <div className="flex items-center space-x-2">
              <TrendingUp className="w-4 h-4" />
              <span>Actionable Insights</span>
            </div>
          </div>
        </div>
      ) : (
        <div className="grid gap-6">
          {recommendations.map((rec: any, index: number) => (
            <div
              key={rec.recommendationId}
              className="bg-white shadow-lg hover:shadow-2xl rounded-2xl overflow-hidden transition-all duration-300 border border-gray-100 group"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-3">
                      <div className={`p-2 rounded-lg ${
                        rec.priority === 'critical' ? 'bg-red-100' :
                        rec.priority === 'high' ? 'bg-orange-100' :
                        rec.priority === 'medium' ? 'bg-yellow-100' :
                        'bg-green-100'
                      }`}>
                        <Package className={`w-5 h-5 ${
                          rec.priority === 'critical' ? 'text-red-600' :
                          rec.priority === 'high' ? 'text-orange-600' :
                          rec.priority === 'medium' ? 'text-yellow-600' :
                          'text-green-600'
                        }`} />
                      </div>
                      <h3 className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                        {rec.title}
                      </h3>
                    </div>
                    
                    <p className="text-gray-600 mb-6 leading-relaxed">{rec.description}</p>
                    
                    {/* Metrics Grid */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                      <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-4">
                        <p className="text-xs text-blue-600 font-medium mb-1">Current Stock</p>
                        <p className="text-2xl font-bold text-blue-900">{rec.currentStock}</p>
                      </div>
                      <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-4">
                        <p className="text-xs text-purple-600 font-medium mb-1">Recommended Qty</p>
                        <p className="text-2xl font-bold text-purple-900">{rec.recommendedQuantity}</p>
                      </div>
                      <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-4">
                        <p className="text-xs text-green-600 font-medium mb-1">Estimated Cost</p>
                        <p className="text-2xl font-bold text-green-900">₹{rec.estimatedCost?.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
                      </div>
                      <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl p-4">
                        <p className="text-xs text-orange-600 font-medium mb-1">Confidence</p>
                        <div className="flex items-center space-x-2">
                          <div className="flex-1 bg-white rounded-full h-2">
                            <div
                              className="bg-gradient-to-r from-orange-400 to-orange-600 h-2 rounded-full transition-all duration-500"
                              style={{ width: `${rec.confidence}%` }}
                            />
                          </div>
                          <span className="text-lg font-bold text-orange-900">{rec.confidence}%</span>
                        </div>
                      </div>
                    </div>

                    {/* AI Insight */}
                    {rec.aiInsight && (
                      <div className="bg-gradient-to-r from-blue-50 to-purple-50 border-l-4 border-blue-500 rounded-lg p-4 mb-6">
                        <div className="flex items-start space-x-3">
                          <Brain className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                          <div>
                            <p className="text-sm font-semibold text-blue-900 mb-1">AI Insight</p>
                            <p className="text-sm text-blue-800">{rec.aiInsight}</p>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Priority Badge and Actions */}
                    <div className="flex items-center justify-between">
                      <span className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-bold ${
                        rec.priority === 'critical' ? 'bg-red-100 text-red-800' :
                        rec.priority === 'high' ? 'bg-orange-100 text-orange-800' :
                        rec.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-green-100 text-green-800'
                      }`}>
                        {rec.priority.toUpperCase()} PRIORITY
                      </span>
                      
                      <div className="flex space-x-3">
                        <button 
                          onClick={() => handleAccept(rec.recommendationId)}
                          disabled={processingId === rec.recommendationId}
                          className="px-6 py-2 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-lg hover:shadow-lg transition-all duration-200 font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
                        >
                          {processingId === rec.recommendationId ? (
                            <>
                              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
                              <span>Processing...</span>
                            </>
                          ) : (
                            <>
                              <Check className="w-4 h-4" />
                              <span>Accept</span>
                            </>
                          )}
                        </button>
                        <button 
                          onClick={() => handleDismiss(rec.recommendationId)}
                          disabled={processingId === rec.recommendationId}
                          className="px-6 py-2 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-all duration-200 font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
                        >
                          {processingId === rec.recommendationId ? (
                            <>
                              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-700" />
                              <span>Processing...</span>
                            </>
                          ) : (
                            <>
                              <X className="w-4 h-4" />
                              <span>Dismiss</span>
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
