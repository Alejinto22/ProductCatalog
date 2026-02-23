"use client"

import { useState, useMemo } from "react"
import { Plus, Pencil, Trash2, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { useData } from "@/context/data-context"
import { CategoryForm } from "@/components/categories/category-form"
import { ConfirmDialog } from "@/components/confirm-dialog"
import type { Category } from "@/data/mock-data"
import { toast } from "sonner"

export default function CategoriesPage() {
  const { categories, deleteCategory, getCategoryName } = useData()
  const [search, setSearch] = useState("")
  const [formOpen, setFormOpen] = useState(false)
  const [editCategory, setEditCategory] = useState<Category | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<Category | null>(null)

  const filtered = useMemo(() => {
    if (!search.trim()) return categories
    return categories.filter((c) =>
      c.name.toLowerCase().includes(search.toLowerCase())
    )
  }, [categories, search])

  function handleEdit(category: Category) {
    setEditCategory(category)
    setFormOpen(true)
  }

  function handleDelete() {
    if (deleteTarget) {
      deleteCategory(deleteTarget.id)
      toast.success(`Categoria "${deleteTarget.name}" eliminada`)
      setDeleteTarget(null)
    }
  }

  function handleFormClose(open: boolean) {
    setFormOpen(open)
    if (!open) {
      setEditCategory(null)
    }
  }

  function handleNew() {
    setEditCategory(null)
    setFormOpen(true)
  }

  function formatDate(dateStr: string) {
    return new Date(dateStr).toLocaleDateString("es-CO", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-semibold text-foreground">Categorias</h1>
          <p className="mt-1 text-[13px] text-muted-foreground">
            Gestiona las categorias del catalogo
          </p>
        </div>
        <Button
          onClick={handleNew}
          className="gap-2 rounded-[10px] bg-[#1D4ED8] text-white btn-tracking transition-all duration-200 hover:bg-[#1E40AF] hover:scale-[1.03] active:scale-100"
        >
          <Plus className="h-4 w-4" />
          Nueva Categoria
        </Button>
      </div>

      <div className="rounded-xl border border-border bg-card card-shadow">
        {/* Card header */}
        <div className="flex flex-col gap-4 border-b border-border px-6 py-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-2">
            <h3 className="text-[15px] font-semibold text-card-foreground">
              Lista de Categorias
            </h3>
            <Badge variant="secondary" className="rounded-full text-[11px] font-semibold">
              {categories.length}
            </Badge>
          </div>
          <div className="relative w-full sm:w-72">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Buscar categorias..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="rounded-[10px] border-[#D1D5DB] pl-9 text-[13px] transition-all duration-200 focus:border-[#1D4ED8] focus:ring-[#1D4ED8]/20 dark:border-input"
            />
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-[13px]">
            <thead>
              <tr className="border-b border-border bg-muted/50">
                <th className="px-6 py-3 text-left font-semibold text-muted-foreground">Nombre</th>
                <th className="px-6 py-3 text-left font-semibold text-muted-foreground">Categoria Padre</th>
                <th className="px-6 py-3 text-left font-semibold text-muted-foreground">Fecha de modificacion</th>
                <th className="px-6 py-3 text-right font-semibold text-muted-foreground">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-12 text-center text-muted-foreground">
                    {search ? "No se encontraron categorias" : "No hay categorias registradas"}
                  </td>
                </tr>
              ) : (
                filtered.map((category, index) => (
                  <tr
                    key={category.id}
                    className={`border-b border-border last:border-0 transition-colors duration-200 hover:bg-[#E0E7FF] dark:hover:bg-[#1D4ED8]/10 ${
                      index % 2 === 1 ? "bg-[#F9FAFB] dark:bg-[#0F172A]" : ""
                    }`}
                  >
                    <td className="px-6 py-3.5 font-medium text-card-foreground">
                      {category.name}
                    </td>
                    <td className="px-6 py-3.5 text-muted-foreground">
                      {category.parentId ? getCategoryName(category.parentId) : (
                        <span className="text-muted-foreground/50">--</span>
                      )}
                    </td>
                    <td className="px-6 py-3.5 text-muted-foreground">
                      {formatDate(category.updatedAt)}
                    </td>
                    <td className="px-6 py-3.5 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => handleEdit(category)}
                          className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-[#1D4ED8] transition-all duration-200 hover:bg-[#1D4ED8]/10 hover:scale-110"
                          aria-label={`Editar ${category.name}`}
                        >
                          <Pencil className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => setDeleteTarget(category)}
                          className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-[#DC2626] transition-all duration-200 hover:bg-[#DC2626]/10 hover:scale-110"
                          aria-label={`Eliminar ${category.name}`}
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

      <CategoryForm
        open={formOpen}
        onOpenChange={handleFormClose}
        editCategory={editCategory}
      />

      <ConfirmDialog
        open={!!deleteTarget}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
        title="Eliminar Categoria"
        description={`Estas seguro de que quieres eliminar la categoria "${deleteTarget?.name}"? Esta accion no se puede deshacer.`}
        onConfirm={handleDelete}
        confirmLabel="Eliminar"
      />
    </div>
  )
}
