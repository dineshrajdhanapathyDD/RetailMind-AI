import { useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Upload, X, Database, Package, ShoppingBag, CheckCircle, AlertCircle, FileText } from 'lucide-react'
import axios from 'axios'
import { API_ENDPOINTS } from '../config'

interface DataUploadModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
}

export default function DataUploadModal({ isOpen, onClose, onSuccess }: DataUploadModalProps) {
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')
  const [uploadMode, setUploadMode] = useState<'sample' | 'file'>('sample')
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const sampleProducts = [
    { id: 'PROD001', name: 'Wireless Mouse', category: 'Electronics', price: 2499.00, stock: 5 },
    { id: 'PROD002', name: 'USB-C Cable', category: 'Electronics', price: 1099.00, stock: 25 },
    { id: 'PROD003', name: 'Laptop Stand', category: 'Accessories', price: 4199.00, stock: 8 },
    { id: 'PROD004', name: 'Mechanical Keyboard', category: 'Electronics', price: 7499.00, stock: 0 },
    { id: 'PROD005', name: 'Webcam HD', category: 'Electronics', price: 5899.00, stock: 12 },
  ]

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const fileType = file.name.split('.').pop()?.toLowerCase()
      if (fileType === 'csv' || fileType === 'json') {
        setSelectedFile(file)
        setError('')
      } else {
        setError('Please select a CSV or JSON file')
        setSelectedFile(null)
      }
    }
  }

  const handleSeedData = async () => {
    setLoading(true)
    setError('')
    setSuccess(false)

    try {
      let requestBody: any = { type: 'sample' }

      if (uploadMode === 'file' && selectedFile) {
        const fileContent = await selectedFile.text()
        const fileType = selectedFile.name.split('.').pop()?.toLowerCase()
        
        requestBody = {
          type: 'file',
          fileContent: fileContent,
          fileType: fileType
        }
      }

      const response = await axios.post(API_ENDPOINTS.seed, requestBody)
      
      if (response.status === 200) {
        setSuccess(true)
        setTimeout(() => {
          onSuccess()
          onClose()
          setUploadMode('sample')
          setSelectedFile(null)
        }, 1500)
      }
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to seed data. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  if (!isOpen) return null

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
            {/* Background overlay with animation */}
            <motion.div 
              className="fixed inset-0 transition-opacity bg-gray-900 bg-opacity-75 backdrop-blur-sm"
              onClick={onClose}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            />

            {/* Modal panel with glassmorphism */}
            <motion.div 
              className="inline-block align-bottom glass rounded-2xl text-left overflow-hidden shadow-2xl transform transition-all sm:my-8 sm:align-middle sm:max-w-2xl sm:w-full border border-white/20"
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.3, type: 'spring', stiffness: 300 }}
            >
              {/* Header */}
              <div className="bg-gradient-to-r from-purple-600 via-blue-600 to-pink-600 px-6 py-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <motion.div 
                      className="bg-white/20 backdrop-blur-sm p-2 rounded-lg"
                      whileHover={{ scale: 1.1, rotate: 5 }}
                      transition={{ duration: 0.2 }}
                    >
                      <Database className="w-6 h-6 text-white" />
                    </motion.div>
                    <div>
                      <h3 className="text-xl font-bold text-white">Seed Sample Data</h3>
                      <p className="text-sm text-blue-100">Load example products and inventory</p>
                    </div>
                  </div>
                  <motion.button
                    onClick={onClose}
                    className="text-white hover:bg-white/20 rounded-lg p-2 transition-colors"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <X className="w-5 h-5" />
                  </motion.button>
                </div>
              </div>

              {/* Content */}
              <div className="px-6 py-6 bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm">
                {success ? (
                  <motion.div 
                    className="text-center py-8"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5 }}
                  >
                    <motion.div 
                      className="bg-green-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
                    >
                      <CheckCircle className="w-10 h-10 text-green-600" />
                    </motion.div>
                    <h4 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Data Seeded Successfully!</h4>
                    <p className="text-gray-600 dark:text-gray-400">Sample products and inventory have been loaded.</p>
                  </motion.div>
                ) : (
                  <>
                    {/* Mode Selection */}
                    <div className="flex space-x-2 mb-6">
                      <motion.button
                        onClick={() => setUploadMode('sample')}
                        className={`flex-1 px-4 py-3 rounded-xl font-medium transition-all duration-200 ${
                          uploadMode === 'sample'
                            ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg'
                            : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                        }`}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <Database className="w-5 h-5 inline-block mr-2" />
                        Sample Data
                      </motion.button>
                      <motion.button
                        onClick={() => setUploadMode('file')}
                        className={`flex-1 px-4 py-3 rounded-xl font-medium transition-all duration-200 ${
                          uploadMode === 'file'
                            ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg'
                            : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                        }`}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <FileText className="w-5 h-5 inline-block mr-2" />
                        Upload File
                      </motion.button>
                    </div>

                {uploadMode === 'sample' ? (
                  <>
                    {/* Info Box */}
                    <div className="bg-blue-50 border-l-4 border-blue-500 rounded-lg p-4 mb-6">
                      <div className="flex items-start space-x-3">
                        <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                        <div>
                          <p className="text-sm font-semibold text-blue-900 mb-1">What will be loaded?</p>
                          <p className="text-sm text-blue-800">
                            This will load 5 sample products with inventory data into your database. 
                            All prices are in Indian Rupees (₹).
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Sample Data Preview */}
                    <div className="mb-6">
                      <h4 className="text-sm font-semibold text-gray-900 mb-3 flex items-center">
                        <Package className="w-4 h-4 mr-2" />
                        Sample Products Preview
                      </h4>
                      <div className="bg-gray-50 rounded-xl p-4 max-h-64 overflow-y-auto">
                        <div className="space-y-3">
                          {sampleProducts.map((product) => (
                            <div
                              key={product.id}
                              className="bg-white rounded-lg p-3 border border-gray-200 hover:border-blue-300 transition-colors"
                            >
                              <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-3">
                                  <div className="bg-gradient-to-br from-blue-100 to-purple-100 p-2 rounded-lg">
                                    <ShoppingBag className="w-4 h-4 text-blue-600" />
                                  </div>
                                  <div>
                                    <p className="text-sm font-semibold text-gray-900">{product.name}</p>
                                    <p className="text-xs text-gray-500">{product.id} • {product.category}</p>
                                  </div>
                                </div>
                                <div className="text-right">
                                  <p className="text-sm font-bold text-gray-900">₹{product.price.toLocaleString('en-IN')}</p>
                                  <p className={`text-xs font-medium ${
                                    product.stock === 0 ? 'text-red-600' :
                                    product.stock < 10 ? 'text-yellow-600' :
                                    'text-green-600'
                                  }`}>
                                    Stock: {product.stock}
                                  </p>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </>
                ) : (
                  <>
                    {/* File Upload Section */}
                    <div className="bg-blue-50 border-l-4 border-blue-500 rounded-lg p-4 mb-6">
                      <div className="flex items-start space-x-3">
                        <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                        <div>
                          <p className="text-sm font-semibold text-blue-900 mb-1">Upload Your Data</p>
                          <p className="text-sm text-blue-800 mb-2">
                            Upload a CSV or JSON file with your product and inventory data.
                          </p>
                          <p className="text-xs text-blue-700">
                            Required fields: productId, name, sku, category, brand, price, cost, currentStock, reorderPoint, maxStock
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="mb-6">
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept=".csv,.json"
                        onChange={handleFileSelect}
                        className="hidden"
                      />
                      
                      <div
                        onClick={() => fileInputRef.current?.click()}
                        className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center cursor-pointer hover:border-blue-500 hover:bg-blue-50 transition-all duration-200"
                      >
                        <Upload className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                        {selectedFile ? (
                          <div>
                            <p className="text-sm font-semibold text-gray-900 mb-1">{selectedFile.name}</p>
                            <p className="text-xs text-gray-500">
                              {(selectedFile.size / 1024).toFixed(2)} KB
                            </p>
                            <button
                              onClick={(e) => {
                                e.stopPropagation()
                                setSelectedFile(null)
                              }}
                              className="mt-2 text-xs text-red-600 hover:text-red-700"
                            >
                              Remove file
                            </button>
                          </div>
                        ) : (
                          <div>
                            <p className="text-sm font-medium text-gray-700 mb-1">
                              Click to upload or drag and drop
                            </p>
                            <p className="text-xs text-gray-500">CSV or JSON files only</p>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Sample Format */}
                    <div className="bg-gray-50 rounded-lg p-4 mb-6">
                      <p className="text-xs font-semibold text-gray-700 mb-2">CSV Format Example:</p>
                      <pre className="text-xs text-gray-600 overflow-x-auto">
{`productId,name,sku,category,brand,price,cost,currentStock,reorderPoint,maxStock
PROD001,Wireless Mouse,WM-001,Electronics,TechPro,2499,1250,5,10,50`}
                      </pre>
                    </div>
                  </>
                )}

                {error && (
                  <motion.div 
                    className="bg-red-50 dark:bg-red-900/20 border-l-4 border-red-500 rounded-lg p-4 mb-4"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <p className="text-sm text-red-800 dark:text-red-300">{error}</p>
                  </motion.div>
                )}

                {/* Actions */}
                <div className="flex space-x-3">
                  <motion.button
                    onClick={handleSeedData}
                    disabled={loading || (uploadMode === 'file' && !selectedFile)}
                    className="flex-1 flex items-center justify-center px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl hover:shadow-lg transition-all duration-200 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                    whileHover={!loading && !(uploadMode === 'file' && !selectedFile) ? { scale: 1.02 } : undefined}
                    whileTap={!loading && !(uploadMode === 'file' && !selectedFile) ? { scale: 0.98 } : undefined}
                  >
                    {loading ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2" />
                        Loading Data...
                      </>
                    ) : (
                      <>
                        <Upload className="w-5 h-5 mr-2" />
                        {uploadMode === 'sample' ? 'Load Sample Data' : 'Upload & Load Data'}
                      </>
                    )}
                  </motion.button>
                  <motion.button
                    onClick={onClose}
                    disabled={loading}
                    className="px-6 py-3 border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 transition-all duration-200 font-medium disabled:opacity-50"
                    whileHover={!loading ? { scale: 1.02 } : undefined}
                    whileTap={!loading ? { scale: 0.98 } : undefined}
                  >
                    Cancel
                  </motion.button>
                </div>
              </>
            )}
          </div>
        </motion.div>
      </div>
    </div>
      )}
    </AnimatePresence>
  )
}
