"use client"

import { useState, useEffect } from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useData } from "@/context/data-context"
import type { Category } from "@/data/mock-data"
import { toast } from "sonner"

interface CategoryFormProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  editCategory?: Category | null
}

export function CategoryForm({ open, onOpenChange, editCategory }: CategoryFormProps) {
  const { categories, addCategory, updateCategory } = useData()
  const [name, setName] = useState("")
  const [parentId, setParentId] = useState<string>("none")
  const [error, setError] = useState("")

  useEffect(() => {
    if (editCategory) {
      setName(editCategory.name)
      setParentId(editCategory.parentId ?? "none")
    } else {
      setName("")
      setParentId("none")
    }
    setError("")
  }, [editCategory, open])

  const availableParents = categories.filter((c) =>
    editCategory ? c.id !== editCategory.id : true
  )

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!name.trim()) {
      setError("El nombre es obligatorio")
      return
    }

    const data = {
      name: name.trim(),
      parentId: parentId === "none" ? null : parentId,
    }

    if (editCategory) {
      updateCategory(editCategory.id, data)
      toast.success(`Categoria "${data.name}" actualizada`)
    } else {
      addCategory(data)
      toast.success(`Categoria "${data.name}" creada`)
    }

    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="rounded-xl border border-border bg-card shadow-[0_8px_30px_rgba(0,0,0,0.12)] sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold text-card-foreground">
            {editCategory ? "Editar Categoria" : "Nueva Categoria"}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="cat-name" className="text-[13px] font-medium text-card-foreground">Nombre *</Label>
            <input
              id="cat-name"
              value={name}
              onChange={(e) => { setName(e.target.value); setError("") }}
              placeholder="Nombre de la categoria"
              className={`h-10 w-full rounded-[10px] border bg-card px-3.5 text-[13px] text-card-foreground placeholder:text-muted-foreground outline-none transition-all duration-200 focus:ring-2 focus:ring-[#1D4ED8]/20 ${
                error ? "border-[#DC2626] focus:border-[#DC2626]" : "border-[#D1D5DB] focus:border-[#1D4ED8] dark:border-input"
              }`}
            />
            {error && <p className="text-[12px] text-[#DC2626]">{error}</p>}
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="cat-parent" className="text-[13px] font-medium text-card-foreground">Categoria padre (opcional)</Label>
            <Select value={parentId} onValueChange={setParentId}>
              <SelectTrigger id="cat-parent" className="rounded-[10px] border-[#D1D5DB] text-[13px] dark:border-input">
                <SelectValue placeholder="Sin categoria padre" />
              </SelectTrigger>
              <SelectContent className="rounded-xl">
                <SelectItem value="none">Sin categoria padre</SelectItem>
                {availableParents.map((cat) => (
                  <SelectItem key={cat.id} value={cat.id}>
                    {cat.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <DialogFooter className="gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="rounded-[10px] border-[#D1D5DB] text-[13px] btn-tracking transition-all duration-200 hover:bg-muted dark:border-input"
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              className="rounded-[10px] bg-[#1D4ED8] text-[13px] text-white btn-tracking transition-all duration-200 hover:bg-[#1E40AF] hover:scale-[1.02] active:scale-100"
            >
              {editCategory ? "Guardar Cambios" : "Crear Categoria"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
