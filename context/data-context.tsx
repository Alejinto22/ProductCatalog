"use client"

import React, { createContext, useContext, useState, useEffect, useCallback } from "react"
import { type Category, type Product } from "@/data/mock-data"
import { toast } from "sonner"

const API_URL = "http://localhost:3001"; // DIRECCIÓN DE TU NESTJS

interface DataContextType {
  categories: Category[]
  products: Product[]
  isLoading: boolean
  addCategory: (category: Omit<Category, "id" | "updatedAt">) => Promise<void>
  addProduct: (product: Omit<Product, "id" | "createdAt">) => Promise<void>
  updateProduct: (id: string, data: Partial<Product>) => Promise<void>
  deleteProduct: (id: string) => Promise<void>
  getCategoryName: (id: string) => string
  refreshData: () => Promise<void>
}

const DataContext = createContext<DataContextType | undefined>(undefined)

export function DataProvider({ children }: { children: React.ReactNode }) {
  const [categories, setCategories] = useState<Category[]>([])
  const [products, setProducts] = useState<Product[]>([])
  const [isLoading, setIsLoading] = useState(true)

  // Función para sincronizar todo desde el Back
  const refreshData = useCallback(async () => {
    setIsLoading(true)
    try {
      const [resProd, resCat] = await Promise.all([
        fetch(`${API_URL}/products`),
        fetch(`${API_URL}/categories`) // Asegúrate de tener este GET en el back
      ])

      if (resProd.ok) {
        const data = await resProd.json()
        setProducts(data)
      }
      
      if (resCat.ok) {
        const data = await resCat.json()
        setCategories(data)
      }
    } catch (error) {
      toast.error("No se pudo conectar con el servidor")
      console.error("Fetch error:", error)
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    refreshData()
  }, [refreshData])

  // CREAR PRODUCTO (POST)
  const addProduct = useCallback(async (productData: Omit<Product, "id" | "createdAt">) => {
    try {
      const response = await fetch(`${API_URL}/products`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(productData),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || "Error al crear producto")
      }

      const newProduct = await response.json()
      setProducts((prev) => [...prev, newProduct])
      toast.success("Producto guardado en base de datos")
    } catch (error: any) {
      toast.error(error.message)
      throw error
    }
  }, [])

  // ACTUALIZAR PRODUCTO (PATCH)
  const updateProduct = useCallback(async (id: string, data: Partial<Product>) => {
    try {
      const response = await fetch(`${API_URL}/products/${id}`, {
        method: 'PATCH', // O PUT según tu @Patch() en NestJS
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })

      if (!response.ok) throw new Error("Error al actualizar")

      const updated = await response.json()
      setProducts((prev) => prev.map((p) => (p.id === id ? updated : p)))
    } catch (error) {
      toast.error("Error al actualizar producto")
    }
  }, [])

  // ELIMINAR PRODUCTO (DELETE)
  const deleteProduct = useCallback(async (id: string) => {
    try {
      const response = await fetch(`${API_URL}/products/${id}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        setProducts((prev) => prev.filter((p) => p.id !== id))
      } else {
        throw new Error()
      }
    } catch (error) {
      toast.error("No se pudo eliminar el producto del servidor")
    }
  }, [])

  // CATEGORÍAS (Ejemplo simple de add)
  const addCategory = useCallback(async (category: Omit<Category, "id" | "updatedAt">) => {
    try {
      const res = await fetch(`${API_URL}/categories`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(category),
      })
      if (res.ok) refreshData()
    } catch (error) {
      console.error(error)
    }
  }, [refreshData])

  const getCategoryName = useCallback(
    (id: string) => {
      const cat = categories.find((c) => c.id === id || String(c.id) === String(id))
      return cat?.name ?? "Sin categoria"
    },
    [categories]
  )

  return (
    <DataContext.Provider
      value={{
        categories,
        products,
        isLoading,
        addCategory,
        addProduct,
        updateProduct,
        deleteProduct,
        getCategoryName,
        refreshData,
      }}
    >
      {children}
    </DataContext.Provider>
  )
}

export function useData() {
  const context = useContext(DataContext)
  if (context === undefined) throw new Error("useData must be used within a DataProvider")
  return context
}