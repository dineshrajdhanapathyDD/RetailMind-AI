// API Configuration
export const API_BASE_URL = (import.meta as any).env.VITE_API_URL || 'http://localhost:3001/api'

export const API_ENDPOINTS = {
  inventory: `${API_BASE_URL}/inventory`,
  recommendations: `${API_BASE_URL}/recommendations`,
  seed: `${API_BASE_URL}/seed`,
  clearAll: `${API_BASE_URL}/clear-all`,
}
