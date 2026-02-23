"use client"

import React, { createContext, useContext, useState, useEffect, useCallback } from "react"
import {
  defaultCategories,
  defaultProducts,
  type Category,
  type Product,
} from "@/data/mock-data"

interface DataContextType {
  categories: Category[]
  products: Product[]
  addCategory: (category: Omit<Category, "id" | "updatedAt">) => void
  updateCategory: (id: string, data: Partial<Category>) => void
  deleteCategory: (id: string) => void
  addProduct: (product: Omit<Product, "id" | "createdAt">) => void
  updateProduct: (id: string, data: Partial<Product>) => void
  deleteProduct: (id: string) => void
  getCategoryName: (id: string) => string
}

const DataContext = createContext<DataContextType | undefined>(undefined)

export function DataProvider({ children }: { children: React.ReactNode }) {
  const [categories, setCategories] = useState<Category[]>(defaultCategories)
  const [products, setProducts] = useState<Product[]>(defaultProducts)

  useEffect(() => {
    const storedCategories = localStorage.getItem("productcatalog_categories")
    const storedProducts = localStorage.getItem("productcatalog_products")
    if (storedCategories) setCategories(JSON.parse(storedCategories))
    if (storedProducts) setProducts(JSON.parse(storedProducts))
  }, [])

  useEffect(() => {
    localStorage.setItem("productcatalog_categories", JSON.stringify(categories))
  }, [categories])

  useEffect(() => {
    localStorage.setItem("productcatalog_products", JSON.stringify(products))
  }, [products])

  const addCategory = useCallback((category: Omit<Category, "id" | "updatedAt">) => {
    const newCategory: Category = {
      ...category,
      id: `cat-${Date.now()}`,
      updatedAt: new Date().toISOString(),
    }
    setCategories((prev) => [...prev, newCategory])
  }, [])

  const updateCategory = useCallback((id: string, data: Partial<Category>) => {
    setCategories((prev) =>
      prev.map((c) =>
        c.id === id ? { ...c, ...data, updatedAt: new Date().toISOString() } : c
      )
    )
  }, [])

  const deleteCategory = useCallback((id: string) => {
    setCategories((prev) => prev.filter((c) => c.id !== id))
  }, [])

  const addProduct = useCallback((product: Omit<Product, "id" | "createdAt">) => {
    const newProduct: Product = {
      ...product,
      id: `prod-${Date.now()}`,
      createdAt: new Date().toISOString(),
    }
    setProducts((prev) => [...prev, newProduct])
  }, [])

  const updateProduct = useCallback((id: string, data: Partial<Product>) => {
    setProducts((prev) => prev.map((p) => (p.id === id ? { ...p, ...data } : p)))
  }, [])

  const deleteProduct = useCallback((id: string) => {
    setProducts((prev) => prev.filter((p) => p.id !== id))
  }, [])

  const getCategoryName = useCallback(
    (id: string) => {
      const cat = categories.find((c) => c.id === id)
      return cat?.name ?? "Sin categoria"
    },
    [categories]
  )

  return (
    <DataContext.Provider
      value={{
        categories,
        products,
        addCategory,
        updateCategory,
        deleteCategory,
        addProduct,
        updateProduct,
        deleteProduct,
        getCategoryName,
      }}
    >
      {children}
    </DataContext.Provider>
  )
}

export function useData() {
  const context = useContext(DataContext)
  if (context === undefined) {
    throw new Error("useData must be used within a DataProvider")
  }
  return context
}
