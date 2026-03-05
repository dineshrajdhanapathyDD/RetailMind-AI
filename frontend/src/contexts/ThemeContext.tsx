import { createContext, useContext, useState, useEffect, ReactNode } from 'react'

type Theme = 'light' | 'dark'

interface ThemeContextType {
  theme: Theme
  toggleTheme: () => void
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>(() => {
    const saved = localStorage.getItem('retailmind-theme')
    return (saved as Theme) || 'light'
  })

  useEffect(() => {
    const root = document.documentElement
    
    // Add theme attribute
    root.setAttribute('data-theme', theme)
    
    // Add transition class for smooth theme changes
    root.classList.add('theme-transitioning')
    
    // Update CSS variables
    if (theme === 'dark') {
      root.style.setProperty('--bg-primary', '#0f172a')
      root.style.setProperty('--bg-secondary', '#1e293b')
      root.style.setProperty('--bg-surface', '#334155')
      root.style.setProperty('--text-primary', '#f1f5f9')
      root.style.setProperty('--text-secondary', '#cbd5e1')
      root.style.setProperty('--text-tertiary', '#94a3b8')
      root.style.setProperty('--border-color', 'rgba(255, 255, 255, 0.1)')
      root.style.setProperty('--glass-bg', 'rgba(30, 41, 59, 0.8)')
    } else {
      root.style.setProperty('--bg-primary', '#ffffff')
      root.style.setProperty('--bg-secondary', '#f8fafc')
      root.style.setProperty('--bg-surface', '#ffffff')
      root.style.setProperty('--text-primary', '#0f172a')
      root.style.setProperty('--text-secondary', '#64748b')
      root.style.setProperty('--text-tertiary', '#94a3b8')
      root.style.setProperty('--border-color', 'rgba(0, 0, 0, 0.1)')
      root.style.setProperty('--glass-bg', 'rgba(255, 255, 255, 0.8)')
    }
    
    // Remove transition class after animation completes
    const timeout = setTimeout(() => {
      root.classList.remove('theme-transitioning')
    }, 300)
    
    // Save to localStorage
    localStorage.setItem('retailmind-theme', theme)
    
    return () => clearTimeout(timeout)
  }, [theme])

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light')
  }

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  const context = useContext(ThemeContext)
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider')
  }
  return context
}
