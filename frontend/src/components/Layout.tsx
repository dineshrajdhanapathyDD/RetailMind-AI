import { Outlet, Link, useLocation } from 'react-router-dom'
import { LayoutDashboard, Package, Lightbulb, Sparkles, Menu, X, Sun, Moon, Bell, User } from 'lucide-react'
import { useState } from 'react'
import { useTheme } from '../contexts/ThemeContext'
import BackgroundEffects from './BackgroundEffects'
import FloatingAIAssistant from './FloatingAIAssistant'

export default function Layout() {
  const location = useLocation()
  const { theme, toggleTheme } = useTheme()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  
  const isActive = (path: string) => {
    return location.pathname === path
  }
  
  return (
    <div className="min-h-screen relative">
      <BackgroundEffects variant="grid" intensity="medium" animated={true} />
      
      {/* Header with Glassmorphism */}
      <header className="glass-strong shadow-lg border-b sticky top-0 z-50" style={{ borderColor: 'var(--border-color)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center space-x-3">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-br from-purple-600 via-blue-600 to-pink-600 rounded-lg blur opacity-75"></div>
                <div className="relative bg-gradient-to-br from-purple-600 via-blue-600 to-pink-600 p-2 rounded-lg">
                  <Sparkles className="w-6 h-6 text-white" />
                </div>
              </div>
              <div>
                <h1 className="text-2xl font-bold gradient-text">
                  RetailMind AI
                </h1>
                <p className="text-xs" style={{ color: 'var(--text-tertiary)' }}>
                  Intelligent Retail Decision Engine
                </p>
              </div>
            </div>
            
            {/* Desktop Navigation */}
            <nav className="hidden md:flex space-x-2">
              <Link
                to="/"
                className={`flex items-center px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                  isActive('/')
                    ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg shadow-purple-500/50'
                    : 'hover:bg-white/10'
                }`}
                style={!isActive('/') ? { color: 'var(--text-primary)' } : undefined}
              >
                <LayoutDashboard className="w-4 h-4 mr-2" />
                Dashboard
              </Link>
              <Link
                to="/recommendations"
                className={`flex items-center px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                  isActive('/recommendations')
                    ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg shadow-purple-500/50'
                    : 'hover:bg-white/10'
                }`}
                style={!isActive('/recommendations') ? { color: 'var(--text-primary)' } : undefined}
              >
                <Lightbulb className="w-4 h-4 mr-2" />
                AI Recommendations
              </Link>
              <Link
                to="/inventory"
                className={`flex items-center px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                  isActive('/inventory')
                    ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg shadow-purple-500/50'
                    : 'hover:bg-white/10'
                }`}
                style={!isActive('/inventory') ? { color: 'var(--text-primary)' } : undefined}
              >
                <Package className="w-4 h-4 mr-2" />
                Inventory
              </Link>
            </nav>

            {/* Right side controls */}
            <div className="hidden md:flex items-center space-x-3">
              {/* Theme Toggle */}
              <button
                onClick={toggleTheme}
                className="p-2 rounded-xl hover:bg-white/10 transition-all duration-200"
                style={{ color: 'var(--text-primary)' }}
                aria-label="Toggle theme"
              >
                {theme === 'light' ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
              </button>

              {/* Notifications */}
              <button
                className="p-2 rounded-xl hover:bg-white/10 transition-all duration-200 relative"
                style={{ color: 'var(--text-primary)' }}
                aria-label="Notifications"
              >
                <Bell className="w-5 h-5" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>

              {/* User Avatar */}
              <button
                className="p-2 rounded-xl hover:bg-white/10 transition-all duration-200"
                style={{ color: 'var(--text-primary)' }}
                aria-label="User menu"
              >
                <User className="w-5 h-5" />
              </button>
            </div>

            {/* Mobile menu button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-xl hover:bg-white/10"
              style={{ color: 'var(--text-primary)' }}
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

          {/* Mobile Navigation */}
          {mobileMenuOpen && (
            <div className="md:hidden py-4 space-y-2">
              <Link
                to="/"
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center px-4 py-3 rounded-xl text-sm font-medium ${
                  isActive('/')
                    ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white'
                    : 'hover:bg-white/10'
                }`}
                style={!isActive('/') ? { color: 'var(--text-primary)' } : undefined}
              >
                <LayoutDashboard className="w-4 h-4 mr-2" />
                Dashboard
              </Link>
              <Link
                to="/recommendations"
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center px-4 py-3 rounded-xl text-sm font-medium ${
                  isActive('/recommendations')
                    ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white'
                    : 'hover:bg-white/10'
                }`}
                style={!isActive('/recommendations') ? { color: 'var(--text-primary)' } : undefined}
              >
                <Lightbulb className="w-4 h-4 mr-2" />
                AI Recommendations
              </Link>
              <Link
                to="/inventory"
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center px-4 py-3 rounded-xl text-sm font-medium ${
                  isActive('/inventory')
                    ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white'
                    : 'hover:bg-white/10'
                }`}
                style={!isActive('/inventory') ? { color: 'var(--text-primary)' } : undefined}
              >
                <Package className="w-4 h-4 mr-2" />
                Inventory
              </Link>
              
              {/* Mobile theme toggle */}
              <button
                onClick={toggleTheme}
                className="flex items-center w-full px-4 py-3 rounded-xl hover:bg-white/10 text-sm font-medium"
                style={{ color: 'var(--text-primary)' }}
              >
                {theme === 'light' ? <Moon className="w-4 h-4 mr-2" /> : <Sun className="w-4 h-4 mr-2" />}
                {theme === 'light' ? 'Dark Mode' : 'Light Mode'}
              </button>
            </div>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10">
        <Outlet />
      </main>

      {/* Floating AI Assistant */}
      <FloatingAIAssistant />
    </div>
  )
}
