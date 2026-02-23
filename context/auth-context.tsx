"use client"

import React, { createContext, useContext, useState, useEffect, useCallback } from "react"
import { defaultUsers, type User } from "@/data/mock-data"

interface AuthContextType {
  user: User | null
  isAuthenticated: boolean
  login: (email: string, password: string) => { success: boolean; error?: string }
  register: (name: string, email: string, password: string) => { success: boolean; error?: string }
  logout: () => void
  isLoading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [users, setUsers] = useState<User[]>(defaultUsers)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const storedUser = localStorage.getItem("productcatalog_user")
    const storedUsers = localStorage.getItem("productcatalog_users")
    if (storedUsers) {
      setUsers(JSON.parse(storedUsers))
    }
    if (storedUser) {
      setUser(JSON.parse(storedUser))
    }
    setIsLoading(false)
  }, [])

  const login = useCallback(
    (email: string, password: string) => {
      const foundUser = users.find(
        (u) => u.email.toLowerCase() === email.toLowerCase() && u.password === password
      )
      if (foundUser) {
        setUser(foundUser)
        localStorage.setItem("productcatalog_user", JSON.stringify(foundUser))
        return { success: true }
      }
      return { success: false, error: "Credenciales incorrectas. Verifica tu email y contrasena." }
    },
    [users]
  )

  const register = useCallback(
    (name: string, email: string, password: string) => {
      const exists = users.find((u) => u.email.toLowerCase() === email.toLowerCase())
      if (exists) {
        return { success: false, error: "Este email ya esta registrado." }
      }
      const newUser: User = {
        id: `user-${Date.now()}`,
        name,
        email,
        password,
      }
      const updatedUsers = [...users, newUser]
      setUsers(updatedUsers)
      localStorage.setItem("productcatalog_users", JSON.stringify(updatedUsers))
      return { success: true }
    },
    [users]
  )

  const logout = useCallback(() => {
    setUser(null)
    localStorage.removeItem("productcatalog_user")
  }, [])

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        login,
        register,
        logout,
        isLoading,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
