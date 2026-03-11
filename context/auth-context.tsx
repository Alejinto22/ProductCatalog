'use client'

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback
} from 'react'
import { defaultUsers, type User } from '@/data/mock-data'

interface AuthContextType {
  user: User | null
  isAuthenticated: boolean
  login: (
    email: string,
    password: string
  ) => Promise<{ success: boolean; error?: string }>
  register: (
    name: string,
    email: string,
    password: string
  ) => { success: boolean; error?: string }
  logout: () => void
  isLoading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider ({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [users, setUsers] = useState<User[]>(defaultUsers)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const storedUser = localStorage.getItem('productcatalog_user')
    const storedUsers = localStorage.getItem('productcatalog_users')
    if (storedUsers) {
      setUsers(JSON.parse(storedUsers))
    }
    if (storedUser) {
      setUser(JSON.parse(storedUser))
    }
    setIsLoading(false)
  }, [])

  const login = useCallback(async (email: string, password: string) => {
    try {
      const response = await fetch('http://localhost:3001/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      })

      const data = await response.json()

      if (!response.ok) {
        return {
          success: false,
          error: data.message || 'Credenciales incorrectas'
        }
      }

      setUser(data)
      localStorage.setItem('productcatalog_user', JSON.stringify(data))
      return { success: true }
    } catch (error) {
      return { success: false, error: 'Error de conexión con el servidor' }
    }
  }, [])

  const register = useCallback(
    async (name: string, email: string, password: string) => {
      try {
        const response = await fetch('http://localhost:3001/auth/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name, email, password })
        })

        const data = await response.json()

        if (!response.ok) {
          // Si el backend tira 401 o 409, entramos aquí
          return {
            success: false,
            error: data.message || 'Error en el registro'
          }
        }

        // ÉXITO: El usuario ya está en Postgres
        setUser(data)
        localStorage.setItem('productcatalog_user', JSON.stringify(data))
        return { success: true }
      } catch (_error) {
        return { success: false, error: 'Error de red o conexión bloqueada' }
      }
    },
    []
  )

  const logout = useCallback(() => {
    setUser(null)
    localStorage.removeItem('productcatalog_user')
  }, [])

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        login,
        register,
        logout,
        isLoading
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth () {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
