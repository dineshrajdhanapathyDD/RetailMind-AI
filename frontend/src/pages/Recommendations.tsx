import { useQuery } from '@tanstack/react-query'
import { Lightbulb, TrendingUp } from 'lucide-react'
import { API_ENDPOINTS } from '../config'
import axios from 'axios'

export default function Recommendations() {
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

  if (isLoading) {
    return <div className="text-center py-8">Loading...</div>
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">AI Recommendations</h2>
          <p className="mt-1 text-sm text-gray-500">
            Intelligent insights powered by Amazon Bedrock
          </p>
        </div>
        <button
          onClick={handleGenerateRecommendations}
          className="flex items-center px-4 py-2 bg-primary-500 text-white rounded-md hover:bg-primary-700"
        >
          <TrendingUp className="w-4 h-4 mr-2" />
          Generate New Recommendations
        </button>
      </div>

      {recommendations.length === 0 ? (
        <div className="bg-white shadow rounded-lg p-12 text-center">
          <Lightbulb className="w-16 h-16 mx-auto text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No recommendations yet
          </h3>
          <p className="text-gray-500 mb-6">
            Click the button above to generate AI-powered recommendations
          </p>
        </div>
      ) : (
        <div className="grid gap-6">
          {recommendations.map((rec: any) => (
            <div
              key={rec.recommendationId}
              className="bg-white shadow rounded-lg p-6 hover:shadow-lg transition-shadow"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <h3 className="text-lg font-semibold text-gray-900">
                      {rec.title}
                    </h3>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      rec.priority === 'critical' ? 'bg-red-100 text-red-800' :
                      rec.priority === 'high' ? 'bg-orange-100 text-orange-800' :
                      rec.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-green-100 text-green-800'
                    }`}>
                      {rec.priority.toUpperCase()}
                    </span>
                  </div>
                  
                  <p className="text-gray-600 mb-4">{rec.description}</p>
                  
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                      <p className="text-sm text-gray-500">Current Stock</p>
                      <p className="text-lg font-semibold">{rec.currentStock}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Recommended Quantity</p>
                      <p className="text-lg font-semibold">{rec.recommendedQuantity}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Estimated Cost</p>
                      <p className="text-lg font-semibold">${rec.estimatedCost?.toFixed(2)}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Confidence Score</p>
                      <div className="flex items-center">
                        <div className="flex-1 bg-gray-200 rounded-full h-2 mr-2">
                          <div
                            className="bg-primary-500 h-2 rounded-full"
                            style={{ width: `${rec.confidence}%` }}
                          />
                        </div>
                        <span className="text-sm font-medium">{rec.confidence}%</span>
                      </div>
                    </div>
                  </div>

                  {rec.aiInsight && (
                    <div className="bg-blue-50 border border-blue-200 rounded-md p-3 mb-4">
                      <p className="text-sm text-blue-900">
                        <strong>AI Insight:</strong> {rec.aiInsight}
                      </p>
                    </div>
                  )}

                  <div className="flex space-x-3">
                    <button className="px-4 py-2 bg-primary-500 text-white rounded-md hover:bg-primary-700">
                      Accept
                    </button>
                    <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50">
                      Dismiss
                    </button>
                    <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50">
                      View Details
                    </button>
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
