// Theme configuration for RetailMind AI

export interface ColorPalette {
  primary: string
  secondary: string
  accent: string
  background: string
  surface: string
  text: {
    primary: string
    secondary: string
    disabled: string
  }
  status: {
    success: string
    warning: string
    error: string
    info: string
  }
}

export interface GradientPalette {
  primary: string // purple → blue
  secondary: string // blue → pink
  accent: string // pink → purple
  hero: string // multi-color gradient
}

export interface EffectSettings {
  glassmorphism: {
    blur: string
    opacity: number
    border: string
  }
  shadows: {
    sm: string
    md: string
    lg: string
    xl: string
  }
  borderRadius: {
    sm: string
    md: string
    lg: string
    xl: string
  }
}

export interface ThemeConfig {
  mode: 'light' | 'dark'
  colors: ColorPalette
  gradients: GradientPalette
  effects: EffectSettings
}

// Light theme configuration
export const lightTheme: ThemeConfig = {
  mode: 'light',
  colors: {
    primary: '#3b82f6',
    secondary: '#8b5cf6',
    accent: '#ec4899',
    background: '#ffffff',
    surface: '#f8fafc',
    text: {
      primary: '#0f172a',
      secondary: '#64748b',
      disabled: '#cbd5e1'
    },
    status: {
      success: '#10b981',
      warning: '#f59e0b',
      error: '#ef4444',
      info: '#3b82f6'
    }
  },
  gradients: {
    primary: 'linear-gradient(135deg, #8b5cf6 0%, #3b82f6 100%)',
    secondary: 'linear-gradient(135deg, #3b82f6 0%, #ec4899 100%)',
    accent: 'linear-gradient(135deg, #ec4899 0%, #8b5cf6 100%)',
    hero: 'linear-gradient(135deg, #8b5cf6 0%, #3b82f6 50%, #ec4899 100%)'
  },
  effects: {
    glassmorphism: {
      blur: '12px',
      opacity: 0.8,
      border: '1px solid rgba(255, 255, 255, 0.2)'
    },
    shadows: {
      sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
      md: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
      lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
      xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1)'
    },
    borderRadius: {
      sm: '0.5rem',
      md: '1rem',
      lg: '1.5rem',
      xl: '2rem'
    }
  }
}

// Dark theme configuration
export const darkTheme: ThemeConfig = {
  mode: 'dark',
  colors: {
    primary: '#3b82f6',
    secondary: '#8b5cf6',
    accent: '#ec4899',
    background: '#0f172a',
    surface: '#1e293b',
    text: {
      primary: '#f1f5f9',
      secondary: '#cbd5e1',
      disabled: '#64748b'
    },
    status: {
      success: '#10b981',
      warning: '#f59e0b',
      error: '#ef4444',
      info: '#3b82f6'
    }
  },
  gradients: {
    primary: 'linear-gradient(135deg, #8b5cf6 0%, #3b82f6 100%)',
    secondary: 'linear-gradient(135deg, #3b82f6 0%, #ec4899 100%)',
    accent: 'linear-gradient(135deg, #ec4899 0%, #8b5cf6 100%)',
    hero: 'linear-gradient(135deg, #8b5cf6 0%, #3b82f6 50%, #ec4899 100%)'
  },
  effects: {
    glassmorphism: {
      blur: '16px',
      opacity: 0.7,
      border: '1px solid rgba(255, 255, 255, 0.1)'
    },
    shadows: {
      sm: '0 1px 2px 0 rgba(0, 0, 0, 0.3)',
      md: '0 4px 6px -1px rgba(0, 0, 0, 0.4)',
      lg: '0 10px 15px -3px rgba(0, 0, 0, 0.5)',
      xl: '0 20px 25px -5px rgba(0, 0, 0, 0.6)'
    },
    borderRadius: {
      sm: '0.5rem',
      md: '1rem',
      lg: '1.5rem',
      xl: '2rem'
    }
  }
}

// Animation configuration
export const animationConfig = {
  duration: {
    fast: 150,
    normal: 300,
    slow: 500
  },
  easing: {
    easeIn: 'cubic-bezier(0.4, 0, 1, 1)',
    easeOut: 'cubic-bezier(0, 0, 0.2, 1)',
    easeInOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
    spring: {
      type: 'spring' as const,
      stiffness: 300,
      damping: 25,
      mass: 1
    }
  }
}
