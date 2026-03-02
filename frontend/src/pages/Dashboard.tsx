import { useQuery } from '@tanstack/react-query'
import { Package, TrendingUp, AlertCircle, CheckCircle, Sparkles, ArrowUp, ArrowDown } from 'lucide-react'
import { API_ENDPOINTS } from '../config'
import axios from 'axios'
import RetailImageGallery from '../components/RetailImageGallery'

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
    <div className="space-y-8 animate-fadeIn">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl shadow-2xl p-8 text-white">
        <div className="absolute top-0 right-0 -mt-4 -mr-4 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 -mb-4 -ml-4 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
        <div className="relative z-10">
          <div className="flex items-center space-x-3 mb-2">
            <Sparkles className="w-8 h-8" />
            <h2 className="text-3xl font-bold">Welcome to RetailMind AI</h2>
          </div>
          <p className="text-blue-100 text-lg">
            AI-powered retail intelligence powered by Amazon Bedrock
          </p>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <KPICard
          title="Total Products"
          value={totalProducts}
          icon={<Package className="w-6 h-6" />}
          color="blue"
          trend={{ value: 12, isUp: true }}
        />
        <KPICard
          title="Low Stock Alerts"
          value={lowStockItems}
          icon={<AlertCircle className="w-6 h-6" />}
          color="red"
          trend={{ value: 8, isUp: false }}
        />
        <KPICard
          title="AI Recommendations"
          value={activeRecommendations}
          icon={<TrendingUp className="w-6 h-6" />}
          color="purple"
          trend={{ value: 15, isUp: true }}
        />
        <KPICard
          title="Automation Success"
          value="95%"
          icon={<CheckCircle className="w-6 h-6" />}
          color="green"
          trend={{ value: 3, isUp: true }}
        />
      </div>

      {/* Recent Recommendations */}
      <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <div className="bg-gradient-to-br from-purple-500 to-pink-500 p-2 rounded-lg">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-900">AI Recommendations</h3>
              <p className="text-sm text-gray-500">Powered by Amazon Bedrock</p>
            </div>
          </div>
          {recommendationsList.length === 0 && (
            <button
              onClick={async () => {
                await axios.post(API_ENDPOINTS.recommendations)
                window.location.reload()
              }}
              className="flex items-center px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:shadow-lg transition-all duration-200 font-medium"
            >
              <Sparkles className="w-4 h-4 mr-2" />
              Generate Recommendations
            </button>
          )}
        </div>

        {recommendationsList.length === 0 ? (
          <div className="text-center py-12">
            <div className="bg-gradient-to-br from-blue-50 to-purple-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
              <Sparkles className="w-10 h-10 text-blue-600" />
            </div>
            <p className="text-gray-600 mb-2">No recommendations yet</p>
            <p className="text-sm text-gray-400">Click the button above to generate AI-powered insights</p>
          </div>
        ) : (
          <div className="space-y-4">
            {recommendationsList.slice(0, 5).map((rec: any, index: number) => (
              <div
                key={rec.recommendationId}
                className="group border border-gray-200 rounded-xl p-5 hover:shadow-lg hover:border-blue-300 transition-all duration-200 cursor-pointer"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h4 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                        {rec.title}
                      </h4>
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        rec.priority === 'high' ? 'bg-red-100 text-red-700' :
                        rec.priority === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                        'bg-green-100 text-green-700'
                      }`}>
                        {rec.priority.toUpperCase()}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mb-3">{rec.description}</p>
                    <div className="flex items-center space-x-6">
                      <div className="flex items-center space-x-2">
                        <div className="w-full bg-gray-200 rounded-full h-2 w-24">
                          <div
                            className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-500"
                            style={{ width: `${rec.confidence}%` }}
                          />
                        </div>
                        <span className="text-xs font-medium text-gray-600">
                          {rec.confidence}% confidence
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Retail Image Gallery */}
      <div className="space-y-4">
        <div>
          <h3 className="text-2xl font-bold text-gray-900 mb-2">Retail Intelligence Features</h3>
          <p className="text-gray-500">Explore how AI transforms your retail operations</p>
        </div>
        <RetailImageGallery />
      </div>
    </div>
  )
}

interface KPICardProps {
  title: string
  value: string | number
  icon: React.ReactNode
  color: 'blue' | 'red' | 'green' | 'purple'
  trend?: { value: number; isUp: boolean }
}

function KPICard({ title, value, icon, color, trend }: KPICardProps) {
  const colorClasses = {
    blue: 'from-blue-500 to-blue-600',
    red: 'from-red-500 to-red-600',
    green: 'from-green-500 to-green-600',
    purple: 'from-purple-500 to-purple-600',
  }

  return (
    <div className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group border border-gray-100">
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className={`bg-gradient-to-br ${colorClasses[color]} p-3 rounded-xl shadow-lg group-hover:scale-110 transition-transform duration-200`}>
            <div className="text-white">{icon}</div>
          </div>
          {trend && (
            <div className={`flex items-center space-x-1 text-sm font-medium ${
              trend.isUp ? 'text-green-600' : 'text-red-600'
            }`}>
              {trend.isUp ? <ArrowUp className="w-4 h-4" /> : <ArrowDown className="w-4 h-4" />}
              <span>{trend.value}%</span>
            </div>
          )}
        </div>
        <div>
          <p className="text-sm font-medium text-gray-500 mb-1">{title}</p>
          <p className="text-3xl font-bold text-gray-900">{value}</p>
        </div>
      </div>
    </div>
  )
}
