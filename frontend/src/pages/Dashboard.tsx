import { useQuery } from '@tanstack/react-query'
import { Package, TrendingUp, AlertCircle, CheckCircle } from 'lucide-react'
import { API_ENDPOINTS } from '../config'
import axios from 'axios'

export default function Dashboard() {
  const { data: inventory } = useQuery({
    queryKey: ['inventory'],
    queryFn: async () => {
      const response = await axios.get(API_ENDPOINTS.inventory)
      return response.data
    }
  })

  const { data: recommendations } = useQuery({
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

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-gray-900">Dashboard</h2>
        <p className="mt-1 text-sm text-gray-500">
          AI-powered retail intelligence at a glance
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <KPICard
          title="Total Products"
          value={totalProducts}
          icon={<Package className="w-6 h-6" />}
          color="blue"
        />
        <KPICard
          title="Low Stock Items"
          value={lowStockItems}
          icon={<AlertCircle className="w-6 h-6" />}
          color="red"
        />
        <KPICard
          title="Active Recommendations"
          value={activeRecommendations}
          icon={<TrendingUp className="w-6 h-6" />}
          color="green"
        />
        <KPICard
          title="Automation Success"
          value="95%"
          icon={<CheckCircle className="w-6 h-6" />}
          color="green"
        />
      </div>

      {/* Recent Recommendations */}
      <div className="bg-white shadow rounded-lg p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">
          Recent AI Recommendations
        </h3>
        {recommendationsList.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-500">No recommendations yet</p>
            <button
              onClick={async () => {
                await axios.post(API_ENDPOINTS.recommendations)
                window.location.reload()
              }}
              className="mt-4 px-4 py-2 bg-primary-500 text-white rounded-md hover:bg-primary-700"
            >
              Generate Recommendations
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {recommendationsList.slice(0, 5).map((rec: any) => (
              <div
                key={rec.recommendationId}
                className="border rounded-lg p-4 hover:bg-gray-50"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900">{rec.title}</h4>
                    <p className="text-sm text-gray-600 mt-1">{rec.description}</p>
                    <div className="flex items-center mt-2 space-x-4">
                      <span className={`text-xs px-2 py-1 rounded ${
                        rec.priority === 'high' ? 'bg-red-100 text-red-800' :
                        rec.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-green-100 text-green-800'
                      }`}>
                        {rec.priority}
                      </span>
                      <span className="text-xs text-gray-500">
                        Confidence: {rec.confidence}%
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

interface KPICardProps {
  title: string
  value: string | number
  icon: React.ReactNode
  color: 'blue' | 'red' | 'green'
}

function KPICard({ title, value, icon, color }: KPICardProps) {
  const colorClasses = {
    blue: 'bg-blue-50 text-blue-600',
    red: 'bg-red-50 text-red-600',
    green: 'bg-green-50 text-green-600',
  }

  return (
    <div className="bg-white overflow-hidden shadow rounded-lg">
      <div className="p-5">
        <div className="flex items-center">
          <div className={`flex-shrink-0 rounded-md p-3 ${colorClasses[color]}`}>
            {icon}
          </div>
          <div className="ml-5 w-0 flex-1">
            <dl>
              <dt className="text-sm font-medium text-gray-500 truncate">
                {title}
              </dt>
              <dd className="text-2xl font-semibold text-gray-900">
                {value}
              </dd>
            </dl>
          </div>
        </div>
      </div>
    </div>
  )
}
