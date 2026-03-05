import { motion } from 'framer-motion'
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend
} from 'recharts'
import { TrendingUp, AlertTriangle, Activity } from 'lucide-react'

interface AITrendAnalysisPanelProps {
  data?: {
    demandForecast?: any[]
    inventoryRisk?: any[]
    salesPattern?: any[]
  }
}

// Mock data for demonstration
const mockDemandForecast = [
  { day: 'Mon', demand: 45, forecast: 48 },
  { day: 'Tue', demand: 52, forecast: 55 },
  { day: 'Wed', demand: 48, forecast: 50 },
  { day: 'Thu', demand: 61, forecast: 58 },
  { day: 'Fri', demand: 55, forecast: 60 },
  { day: 'Sat', demand: 67, forecast: 65 },
  { day: 'Sun', demand: 43, forecast: 45 }
]

const mockInventoryRisk = [
  { category: 'Electronics', risk: 75 },
  { category: 'Clothing', risk: 45 },
  { category: 'Food', risk: 85 },
  { category: 'Home', risk: 30 },
  { category: 'Sports', risk: 60 }
]

const mockSalesPattern = [
  { week: 'W1', sales: 4200 },
  { week: 'W2', sales: 3800 },
  { week: 'W3', sales: 5100 },
  { week: 'W4', sales: 4600 },
  { week: 'W5', sales: 5400 },
  { week: 'W6', sales: 4900 }
]

export default function AITrendAnalysisPanel({ data }: AITrendAnalysisPanelProps) {
  const demandData = data?.demandForecast || mockDemandForecast
  const riskData = data?.inventoryRisk || mockInventoryRisk
  const salesData = data?.salesPattern || mockSalesPattern

  return (
    <div className="space-y-6">
      {/* Demand Forecast Chart */}
      <motion.div
        className="glass rounded-2xl p-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex items-center space-x-3 mb-6">
          <div className="bg-gradient-to-br from-blue-500 to-purple-500 p-2 rounded-lg">
            <TrendingUp className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-900">Demand Forecast</h3>
            <p className="text-sm text-gray-500">7-day prediction vs actual</p>
          </div>
        </div>

        <ResponsiveContainer width="100%" height={250}>
          <LineChart data={demandData}>
            <defs>
              <linearGradient id="demandGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0.2} />
              </linearGradient>
              <linearGradient id="forecastGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#ec4899" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#ec4899" stopOpacity={0.2} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis
              dataKey="day"
              stroke="#6b7280"
              style={{ fontSize: '12px' }}
            />
            <YAxis stroke="#6b7280" style={{ fontSize: '12px' }} />
            <Tooltip
              contentStyle={{
                backgroundColor: 'rgba(255, 255, 255, 0.95)',
                border: '1px solid #e5e7eb',
                borderRadius: '8px',
                boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
              }}
            />
            <Legend />
            <Line
              type="monotone"
              dataKey="demand"
              stroke="url(#demandGradient)"
              strokeWidth={3}
              dot={{ fill: '#3b82f6', r: 4 }}
              activeDot={{ r: 6 }}
              name="Actual Demand"
            />
            <Line
              type="monotone"
              dataKey="forecast"
              stroke="url(#forecastGradient)"
              strokeWidth={3}
              strokeDasharray="5 5"
              dot={{ fill: '#ec4899', r: 4 }}
              activeDot={{ r: 6 }}
              name="AI Forecast"
            />
          </LineChart>
        </ResponsiveContainer>
      </motion.div>

      {/* Inventory Risk Gauge */}
      <motion.div
        className="glass rounded-2xl p-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, duration: 0.5 }}
      >
        <div className="flex items-center space-x-3 mb-6">
          <div className="bg-gradient-to-br from-orange-500 to-red-500 p-2 rounded-lg">
            <AlertTriangle className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-900">Inventory Risk</h3>
            <p className="text-sm text-gray-500">Risk level by category</p>
          </div>
        </div>

        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={riskData} layout="vertical">
            <defs>
              <linearGradient id="riskGradient" x1="0" y1="0" x2="1" y2="0">
                <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#ef4444" stopOpacity={0.8} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis
              type="number"
              stroke="#6b7280"
              style={{ fontSize: '12px' }}
              domain={[0, 100]}
            />
            <YAxis
              type="category"
              dataKey="category"
              stroke="#6b7280"
              style={{ fontSize: '12px' }}
              width={80}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: 'rgba(255, 255, 255, 0.95)',
                border: '1px solid #e5e7eb',
                borderRadius: '8px',
                boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
              }}
              formatter={(value: any) => [`${value}%`, 'Risk Level']}
            />
            <Bar
              dataKey="risk"
              fill="url(#riskGradient)"
              radius={[0, 8, 8, 0]}
              animationDuration={1000}
            />
          </BarChart>
        </ResponsiveContainer>
      </motion.div>

      {/* Weekly Sales Pattern */}
      <motion.div
        className="glass rounded-2xl p-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.5 }}
      >
        <div className="flex items-center space-x-3 mb-6">
          <div className="bg-gradient-to-br from-green-500 to-emerald-500 p-2 rounded-lg">
            <Activity className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-900">Sales Pattern</h3>
            <p className="text-sm text-gray-500">Weekly sales trend</p>
          </div>
        </div>

        <ResponsiveContainer width="100%" height={250}>
          <AreaChart data={salesData}>
            <defs>
              <linearGradient id="salesGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10b981" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#10b981" stopOpacity={0.1} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis
              dataKey="week"
              stroke="#6b7280"
              style={{ fontSize: '12px' }}
            />
            <YAxis
              stroke="#6b7280"
              style={{ fontSize: '12px' }}
              tickFormatter={(value) => `₹${(value / 1000).toFixed(1)}k`}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: 'rgba(255, 255, 255, 0.95)',
                border: '1px solid #e5e7eb',
                borderRadius: '8px',
                boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
              }}
              formatter={(value: any) => [
                `₹${value.toLocaleString('en-IN')}`,
                'Sales'
              ]}
            />
            <Area
              type="monotone"
              dataKey="sales"
              stroke="#10b981"
              strokeWidth={3}
              fill="url(#salesGradient)"
              animationDuration={1000}
            />
          </AreaChart>
        </ResponsiveContainer>
      </motion.div>
    </div>
  )
}
