import { useQuery } from '@tanstack/react-query'
import { Package, AlertTriangle, TrendingUp, ShoppingCart, BarChart3, Box } from 'lucide-react'
import { API_ENDPOINTS } from '../config'
import axios from 'axios'

export default function Inventory() {
  const { data, isLoading } = useQuery({
    queryKey: ['inventory'],
    queryFn: async () => {
      const response = await axios.get(API_ENDPOINTS.inventory)
      return response.data
    }
  })

  const items = data?.items || []

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  const lowStockCount = items.filter((item: any) => item.status === 'low' || item.status === 'critical').length
  const optimalCount = items.filter((item: any) => item.status === 'optimal').length
  const totalValue = items.reduce((sum: number, item: any) => sum + (item.price * item.currentStock), 0)

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header with Retail Theme */}
      <div className="relative overflow-hidden bg-gradient-to-r from-emerald-600 to-teal-600 rounded-2xl shadow-2xl p-8 text-white">
        <div className="absolute top-0 right-0 -mt-4 -mr-4 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 -mb-4 -ml-4 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
        <div className="relative z-10 flex items-center justify-between">
          <div>
            <div className="flex items-center space-x-3 mb-2">
              <Box className="w-8 h-8" />
              <h2 className="text-3xl font-bold">Inventory Management</h2>
            </div>
            <p className="text-emerald-100 text-lg">
              Real-time stock monitoring powered by AI
            </p>
          </div>
          <div className="hidden md:flex items-center space-x-4">
            <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4">
              <ShoppingCart className="w-8 h-8" />
            </div>
            <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4">
              <BarChart3 className="w-8 h-8" />
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Stats Cards */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Products"
          value={items.length}
          icon={<Package className="w-6 h-6" />}
          color="blue"
          subtitle="Active SKUs"
        />
        <StatCard
          title="Low Stock Alerts"
          value={lowStockCount}
          icon={<AlertTriangle className="w-6 h-6" />}
          color="red"
          subtitle="Needs attention"
          pulse={lowStockCount > 0}
        />
        <StatCard
          title="Optimal Stock"
          value={optimalCount}
          icon={<TrendingUp className="w-6 h-6" />}
          color="green"
          subtitle="Well stocked"
        />
        <StatCard
          title="Total Value"
          value={`$${totalValue.toFixed(0)}`}
          icon={<BarChart3 className="w-6 h-6" />}
          color="purple"
          subtitle="Inventory worth"
        />
      </div>

      {/* Enhanced Inventory Table */}
      <div className="bg-white/80 backdrop-blur-sm shadow-xl rounded-2xl overflow-hidden border border-gray-100">
        <div className="px-6 py-4 bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Product Inventory</h3>
          <p className="text-sm text-gray-500">Monitor and manage your retail stock levels</p>
        </div>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Product
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Category
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Stock Level
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Reorder Point
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Price
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Value
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {items.map((item: any, index: number) => (
                <tr 
                  key={item.productId} 
                  className="hover:bg-blue-50 transition-colors duration-150 group"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10 bg-gradient-to-br from-blue-100 to-purple-100 rounded-lg flex items-center justify-center">
                        <Package className="w-5 h-5 text-blue-600" />
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                          {item.productName}
                        </div>
                        <div className="text-xs text-gray-500">{item.productId}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-3 py-1 inline-flex text-xs leading-5 font-medium rounded-full bg-gray-100 text-gray-800">
                      {item.category}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <span className="text-lg font-bold text-gray-900">{item.currentStock}</span>
                      <span className="text-xs text-gray-500 ml-1">units</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {item.reorderPoint}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <StatusBadge status={item.status} currentStock={item.currentStock} reorderPoint={item.reorderPoint} />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">
                    ${item.price?.toFixed(2)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-emerald-600">
                    ${(item.price * item.currentStock).toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

interface StatCardProps {
  title: string
  value: number | string
  icon: React.ReactNode
  color: 'blue' | 'red' | 'green' | 'purple'
  subtitle?: string
  pulse?: boolean
}

function StatCard({ title, value, icon, color, subtitle, pulse }: StatCardProps) {
  const colorClasses = {
    blue: 'from-blue-500 to-blue-600',
    red: 'from-red-500 to-red-600',
    green: 'from-green-500 to-green-600',
    purple: 'from-purple-500 to-purple-600',
  }

  return (
    <div className={`bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden group border border-gray-100 ${pulse ? 'animate-pulse-slow' : ''}`}>
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className={`bg-gradient-to-br ${colorClasses[color]} p-3 rounded-xl shadow-lg group-hover:scale-110 transition-transform duration-200`}>
            <div className="text-white">{icon}</div>
          </div>
        </div>
        <div>
          <p className="text-sm font-medium text-gray-500 mb-1">{title}</p>
          <p className="text-3xl font-bold text-gray-900 mb-1">{value}</p>
          {subtitle && <p className="text-xs text-gray-400">{subtitle}</p>}
        </div>
      </div>
    </div>
  )
}

function StatusBadge({ status, currentStock, reorderPoint }: { status: string; currentStock: number; reorderPoint: number }) {
  const statusConfig = {
    critical: { 
      bg: 'bg-red-100 border-red-200', 
      text: 'text-red-800', 
      label: 'Critical',
      icon: '🔴'
    },
    low: { 
      bg: 'bg-yellow-100 border-yellow-200', 
      text: 'text-yellow-800', 
      label: 'Low Stock',
      icon: '⚠️'
    },
    optimal: { 
      bg: 'bg-green-100 border-green-200', 
      text: 'text-green-800', 
      label: 'Optimal',
      icon: '✅'
    },
    overstock: { 
      bg: 'bg-blue-100 border-blue-200', 
      text: 'text-blue-800', 
      label: 'Overstock',
      icon: '📦'
    },
  }

  const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.optimal
  const percentage = (currentStock / reorderPoint) * 100

  return (
    <div className="space-y-1">
      <span className={`px-3 py-1 inline-flex items-center text-xs leading-5 font-bold rounded-full border ${config.bg} ${config.text}`}>
        <span className="mr-1">{config.icon}</span>
        {config.label}
      </span>
      <div className="w-full bg-gray-200 rounded-full h-1.5">
        <div
          className={`h-1.5 rounded-full transition-all duration-500 ${
            status === 'critical' ? 'bg-red-600' :
            status === 'low' ? 'bg-yellow-500' :
            status === 'optimal' ? 'bg-green-500' :
            'bg-blue-500'
          }`}
          style={{ width: `${Math.min(percentage, 100)}%` }}
        />
      </div>
    </div>
  )
}
