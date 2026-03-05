import { motion, AnimatePresence } from 'framer-motion'
import { MessageCircle, X, Sparkles, Send, Bot, User } from 'lucide-react'
import { useState, useRef, useEffect } from 'react'
import axios from 'axios'
import { API_ENDPOINTS } from '../config'

interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
}

interface FloatingAIAssistantProps {
  examplePrompts?: string[]
}

const defaultPrompts = [
  'Which products should I restock?',
  'Show me low stock items',
  'What are the latest AI recommendations?',
  'Analyze inventory trends'
]

export default function FloatingAIAssistant({ 
  examplePrompts = defaultPrompts
}: FloatingAIAssistantProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([])
  const [inputValue, setInputValue] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus()
    }
  }, [isOpen])

  const generateAIResponse = async (userMessage: string): Promise<string> => {
    try {
      // Fetch current inventory and recommendations for context
      const [inventoryRes, recommendationsRes] = await Promise.all([
        axios.get(API_ENDPOINTS.inventory).catch(() => ({ data: { items: [] } })),
        axios.get(API_ENDPOINTS.recommendations).catch(() => ({ data: { recommendations: [] } }))
      ])

      const inventory = inventoryRes.data?.items || []
      const recommendations = recommendationsRes.data?.recommendations || []

      // Analyze the data based on user query
      const lowStockItems = inventory.filter((item: any) => 
        item.status === 'low' || item.status === 'critical'
      )
      const pendingRecommendations = recommendations.filter((rec: any) => 
        rec.status === 'pending'
      )

      // Generate contextual response based on query
      const query = userMessage.toLowerCase()

      if (query.includes('restock') || query.includes('low stock')) {
        if (lowStockItems.length === 0) {
          return "Great news! All your products are well-stocked. No immediate restocking needed. 📦✅"
        }
        const itemsList = lowStockItems.slice(0, 5).map((item: any) => 
          `• ${item.productName}: ${item.currentStock} units (reorder at ${item.reorderPoint})`
        ).join('\n')
        return `You have ${lowStockItems.length} items that need restocking:\n\n${itemsList}\n\nWould you like me to generate AI recommendations for these items?`
      }

      if (query.includes('recommendation') || query.includes('suggest')) {
        if (pendingRecommendations.length === 0) {
          return "You don't have any pending AI recommendations. Would you like me to generate new recommendations based on your current inventory?"
        }
        const recList = pendingRecommendations.slice(0, 3).map((rec: any) => 
          `• ${rec.title} (${rec.priority} priority, ${rec.confidence}% confidence)`
        ).join('\n')
        return `You have ${pendingRecommendations.length} pending recommendations:\n\n${recList}\n\nCheck the Recommendations page for full details and actions.`
      }

      if (query.includes('trend') || query.includes('analyze') || query.includes('forecast')) {
        const totalValue = inventory.reduce((sum: any, item: any) => 
          sum + (item.price * item.currentStock), 0
        )
        return `📊 Inventory Analysis:\n\n• Total Products: ${inventory.length}\n• Low Stock Items: ${lowStockItems.length}\n• Total Inventory Value: ₹${totalValue.toLocaleString('en-IN')}\n• Pending Recommendations: ${pendingRecommendations.length}\n\nYour inventory is ${lowStockItems.length > 5 ? 'showing some concerns' : 'looking healthy'}. ${lowStockItems.length > 0 ? 'Consider reviewing low stock items.' : 'Keep monitoring for changes.'}`
      }

      if (query.includes('help') || query.includes('what can you do')) {
        return "I'm your RetailMind AI assistant! I can help you with:\n\n• Inventory analysis and insights\n• Restocking recommendations\n• Low stock alerts\n• Demand forecasting\n• Product optimization\n\nJust ask me anything about your retail inventory!"
      }

      // Default response with general info
      return `I'm analyzing your inventory data... You currently have ${inventory.length} products with ${lowStockItems.length} items needing attention. How can I help you optimize your inventory today?`

    } catch (error) {
      console.error('Error generating AI response:', error)
      return "I'm having trouble accessing your inventory data right now. Please make sure you have data loaded and try again."
    }
  }

  const handleSendMessage = async (content: string) => {
    if (!content.trim() || isLoading) return

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: content.trim(),
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    setInputValue('')
    setIsLoading(true)

    try {
      const aiResponse = await generateAIResponse(content)
      
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: aiResponse,
        timestamp: new Date()
      }

      setMessages(prev => [...prev, assistantMessage])
    } catch (error) {
      console.error('Error sending message:', error)
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: 'Sorry, I encountered an error. Please try again.',
        timestamp: new Date()
      }
      setMessages(prev => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  const handlePromptClick = (prompt: string) => {
    handleSendMessage(prompt)
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage(inputValue)
    }
  }

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="mb-4 glass-strong rounded-2xl shadow-2xl w-96 max-h-[600px] flex flex-col"
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-white/20">
              <div className="flex items-center space-x-2">
                <div className="bg-gradient-to-br from-purple-500 to-pink-500 p-2 rounded-lg">
                  <Sparkles className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 dark:text-white">
                    RetailMind AI Assistant
                  </h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Powered by Amazon Bedrock
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 min-h-[300px] max-h-[400px]">
              {messages.length === 0 ? (
                <div className="space-y-3">
                  <div className="text-center py-4">
                    <div className="bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-3">
                      <Bot className="w-8 h-8 text-purple-600" />
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                      Hi! I'm your AI assistant. Ask me anything about your inventory!
                    </p>
                  </div>
                  <div className="space-y-2">
                    <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">
                      Try these prompts:
                    </p>
                    {examplePrompts.map((prompt, index) => (
                      <motion.button
                        key={index}
                        onClick={() => handlePromptClick(prompt)}
                        className="w-full text-left px-3 py-2 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 hover:from-blue-100 hover:to-purple-100 dark:hover:from-blue-900/30 dark:hover:to-purple-900/30 rounded-lg text-sm transition-all duration-200 border border-blue-100 dark:border-blue-800 text-gray-700 dark:text-gray-300"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        disabled={isLoading}
                      >
                        {prompt}
                      </motion.button>
                    ))}
                  </div>
                </div>
              ) : (
                <>
                  {messages.map((message) => (
                    <motion.div
                      key={message.id}
                      className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <div className={`flex items-start space-x-2 max-w-[85%] ${message.role === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`}>
                        <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                          message.role === 'user' 
                            ? 'bg-gradient-to-br from-blue-500 to-purple-500' 
                            : 'bg-gradient-to-br from-purple-500 to-pink-500'
                        }`}>
                          {message.role === 'user' ? (
                            <User className="w-4 h-4 text-white" />
                          ) : (
                            <Bot className="w-4 h-4 text-white" />
                          )}
                        </div>
                        <div className={`px-4 py-2 rounded-2xl ${
                          message.role === 'user'
                            ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white'
                            : 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white'
                        }`}>
                          <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                  {isLoading && (
                    <motion.div
                      className="flex justify-start"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                    >
                      <div className="flex items-start space-x-2">
                        <div className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center bg-gradient-to-br from-purple-500 to-pink-500">
                          <Bot className="w-4 h-4 text-white" />
                        </div>
                        <div className="px-4 py-2 rounded-2xl bg-gray-100 dark:bg-gray-800">
                          <div className="flex space-x-1">
                            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                  <div ref={messagesEndRef} />
                </>
              )}
            </div>

            {/* Input */}
            <div className="p-4 border-t border-white/20">
              <div className="flex items-center space-x-2">
                <input
                  ref={inputRef}
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Ask me anything..."
                  disabled={isLoading}
                  className="flex-1 px-4 py-2 bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white rounded-xl border border-gray-200 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:opacity-50 text-sm"
                />
                <motion.button
                  onClick={() => handleSendMessage(inputValue)}
                  disabled={!inputValue.trim() || isLoading}
                  className="p-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl disabled:opacity-50 disabled:cursor-not-allowed"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Send className="w-5 h-5" />
                </motion.button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className="bg-gradient-to-br from-purple-600 to-pink-600 text-white p-4 rounded-full shadow-2xl hover:shadow-purple-500/50 transition-all duration-300"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
      >
        <MessageCircle className="w-6 h-6" />
      </motion.button>
    </div>
  )
}
