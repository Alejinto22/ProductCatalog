"use client"

import { useState, useMemo } from "react"
import { Plus, Pencil, Trash2, Search, Filter } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useData } from "@/context/data-context"
import { ProductForm } from "@/components/products/product-form"
import { ConfirmDialog } from "@/components/confirm-dialog"
import type { Product } from "@/data/mock-data"
import { toast } from "sonner"

export default function ProductsPage() {
  const { products, categories, deleteProduct, getCategoryName } = useData()
  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [categoryFilter, setCategoryFilter] = useState("all")
  const [formOpen, setFormOpen] = useState(false)
  const [editProduct, setEditProduct] = useState<Product | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<Product | null>(null)

  const filtered = useMemo(() => {
    let result = products

    if (search.trim()) {
      const term = search.toLowerCase()
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(term) ||
          p.productNumber.toLowerCase().includes(term) ||
          p.color.toLowerCase().includes(term)
      )
    }

    if (statusFilter !== "all") {
      result = result.filter((p) => p.status === statusFilter)
    }

    if (categoryFilter !== "all") {
      result = result.filter((p) => p.categoryId === categoryFilter)
    }

    return result
  }, [products, search, statusFilter, categoryFilter])

  function handleEdit(product: Product) {
    setEditProduct(product)
    setFormOpen(true)
  }

  function handleDelete() {
    if (deleteTarget) {
      deleteProduct(deleteTarget.id)
      toast.success(`Producto "${deleteTarget.name}" eliminado`)
      setDeleteTarget(null)
    }
  }

  function handleFormClose(open: boolean) {
    setFormOpen(open)
    if (!open) {
      setEditProduct(null)
    }
  }

  function handleNew() {
    setEditProduct(null)
    setFormOpen(true)
  }

  function formatPrice(price: number) {
    return new Intl.NumberFormat("es-CO", {
      style: "currency",
      currency: "COP",
      minimumFractionDigits: 0,
    }).format(price)
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-semibold text-foreground">Productos</h1>
          <p className="mt-1 text-[13px] text-muted-foreground">
            Gestiona los productos del catalogo
          </p>
        </div>
        <Button
          onClick={handleNew}
          className="gap-2 rounded-[10px] bg-[#1D4ED8] text-white btn-tracking transition-all duration-200 hover:bg-[#1E40AF] hover:scale-[1.03] active:scale-100"
        >
          <Plus className="h-4 w-4" />
          Nuevo Producto
        </Button>
      </div>

      <div className="rounded-xl border border-border bg-card card-shadow">
        {/* Card header */}
        <div className="flex flex-col gap-4 border-b border-border px-6 py-4">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-2">
              <h3 className="text-[15px] font-semibold text-card-foreground">
                Lista de Productos
              </h3>
              <Badge variant="secondary" className="rounded-full text-[11px] font-semibold">
                {products.length}
              </Badge>
            </div>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Buscar productos..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="rounded-[10px] border-[#D1D5DB] pl-9 text-[13px] transition-all duration-200 focus:border-[#1D4ED8] focus:ring-[#1D4ED8]/20 dark:border-input"
              />
            </div>
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-muted-foreground" />
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-40 rounded-[10px] border-[#D1D5DB] text-[13px] dark:border-input">
                  <SelectValue placeholder="Estado" />
                </SelectTrigger>
                <SelectContent className="rounded-xl">
                  <SelectItem value="all">Todos</SelectItem>
                  <SelectItem value="Activo">Activo</SelectItem>
                  <SelectItem value="Descontinuado">Descontinuado</SelectItem>
                </SelectContent>
              </Select>
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger className="w-40 rounded-[10px] border-[#D1D5DB] text-[13px] dark:border-input">
                  <SelectValue placeholder="Categoria" />
                </SelectTrigger>
                <SelectContent className="rounded-xl">
                  <SelectItem value="all">Todas</SelectItem>
                  {categories.map((cat) => (
                    <SelectItem key={cat.id} value={cat.id}>
                      {cat.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-[13px]">
            <thead>
              <tr className="border-b border-border bg-muted/50">
                <th className="px-6 py-3 text-left font-semibold text-muted-foreground">Nombre</th>
                <th className="px-6 py-3 text-left font-semibold text-muted-foreground">Categoria</th>
                <th className="px-6 py-3 text-left font-semibold text-muted-foreground">Precio</th>
                <th className="px-6 py-3 text-left font-semibold text-muted-foreground hidden md:table-cell">Color</th>
                <th className="px-6 py-3 text-left font-semibold text-muted-foreground">Estado</th>
                <th className="px-6 py-3 text-right font-semibold text-muted-foreground">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-muted-foreground">
                    {search || statusFilter !== "all" || categoryFilter !== "all"
                      ? "No se encontraron productos con los filtros aplicados"
                      : "No hay productos registrados"}
                  </td>
                </tr>
              ) : (
                filtered.map((product, index) => (
                  <tr
                    key={product.id}
                    className={`border-b border-border last:border-0 transition-colors duration-200 hover:bg-[#E0E7FF] dark:hover:bg-[#1D4ED8]/10 ${
                      index % 2 === 1 ? "bg-[#F9FAFB] dark:bg-[#0F172A]" : ""
                    }`}
                  >
                    <td className="px-6 py-3.5">
                      <div>
                        <p className="font-medium text-card-foreground">{product.name}</p>
                        <p className="text-[11px] text-muted-foreground">{product.productNumber}</p>
                      </div>
                    </td>
                    <td className="px-6 py-3.5 text-muted-foreground">
                      {getCategoryName(product.categoryId)}
                    </td>
                    <td className="px-6 py-3.5 font-medium text-card-foreground">
                      {formatPrice(product.standardPrice)}
                    </td>
                    <td className="px-6 py-3.5 text-muted-foreground hidden md:table-cell">
                      {product.color || "--"}
                    </td>
                    <td className="px-6 py-3.5">
                      <Badge
                        variant={product.status === "Activo" ? "default" : "destructive"}
                        className={
                          product.status === "Activo"
                            ? "border-0 bg-[#059669]/10 text-[#059669] hover:bg-[#059669]/20 font-medium"
                            : "border-0 font-medium"
                        }
                      >
                        {product.status}
                      </Badge>
                    </td>
                    <td className="px-6 py-3.5 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => handleEdit(product)}
                          className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-[#1D4ED8] transition-all duration-200 hover:bg-[#1D4ED8]/10 hover:scale-110"
                          aria-label={`Editar ${product.name}`}
                        >
                          <Pencil className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => setDeleteTarget(product)}
                          className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-[#DC2626] transition-all duration-200 hover:bg-[#DC2626]/10 hover:scale-110"
                          aria-label={`Eliminar ${product.name}`}
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <ProductForm
        open={formOpen}
        onOpenChange={handleFormClose}
        editProduct={editProduct}
      />

      <ConfirmDialog
        open={!!deleteTarget}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
        title="Eliminar Producto"
        description={`Estas seguro de que quieres eliminar el producto "${deleteTarget?.name}"? Esta accion no se puede deshacer.`}
        onConfirm={handleDelete}
        confirmLabel="Eliminar"
      />
    </div>
  )
}
