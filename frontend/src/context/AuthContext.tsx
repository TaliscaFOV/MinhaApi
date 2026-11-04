import { createContext, useContext, useState, type ReactNode, useEffect } from 'react'
import {type AuthUser } from '../types/Auth'

interface AuthContextType {
  user: AuthUser | null
  isAuthenticated: boolean
  login: (u: AuthUser) => void
  logout: () => void
  handleAuthError: () => void
}

const AuthContext = createContext<AuthContextType | null>(null)

// Custom event for auth errors (triggered by axios interceptor)
const AUTH_ERROR_EVENT = 'auth:error'

export function AuthProvider({ children }: { children: ReactNode }) {
  // Lê o localStorage na 1ª renderização (mantém login após F5)
  const [user, setUser] = useState<AuthUser | null>(() => {
    const saved = localStorage.getItem('auth')
    return saved ? JSON.parse(saved) : null
  })

  const login = (u: AuthUser) => {
    setUser(u)
    localStorage.setItem('auth', JSON.stringify(u))
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem('auth')
  }

  const handleAuthError = () => {
    logout()
    // Navigation will be handled by ProtectedRoute when isAuthenticated becomes false
  }

  // Listen for auth error events from axios interceptor
  useEffect(() => {
    const handleError = () => handleAuthError()
    window.addEventListener(AUTH_ERROR_EVENT, handleError)
    return () => window.removeEventListener(AUTH_ERROR_EVENT, handleError)
  }, [])

  return (
    <AuthContext.Provider value={{
      user, isAuthenticated: user !== null, login, logout, handleAuthError
    }}>
      {children}
    </AuthContext.Provider>
  )
}

// Hook personalizado
export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth deve ser usado dentro de AuthProvider')
  return ctx
}

// Export for axios interceptor to trigger auth error
export function triggerAuthError() {
  window.dispatchEvent(new Event(AUTH_ERROR_EVENT))
}