'use client'

import { useState, useEffect } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'
import { useData } from '@/context/data-context'
import type { Product } from '@/data/mock-data'
import { toast } from 'sonner'

interface ProductFormProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  editProduct?: Product | null
}

interface FormData {
  name: string
  productNumber: string
  color: string
  standardPrice: string
  listPrice: string
  size: string
  weight: string
  categoryId: string
  saleStartDate: string
  saleEndDate: string
  status: 'Activo' | 'Descontinuado'
}

const emptyForm: FormData = {
  name: '',
  productNumber: '',
  color: '',
  standardPrice: '',
  listPrice: '',
  size: '',
  weight: '',
  categoryId: '',
  saleStartDate: '',
  saleEndDate: '',
  status: 'Activo'
}

export function ProductForm ({
  open,
  onOpenChange,
  editProduct
}: ProductFormProps) {
  const { categories, addProduct, updateProduct } = useData()
  const [form, setForm] = useState<FormData>(emptyForm)
  const [errors, setErrors] = useState<Record<string, string>>({})

  useEffect(() => {
    if (editProduct) {
      setForm({
        name: editProduct.name,
        productNumber: editProduct.productNumber,
        color: editProduct.color,
        standardPrice: String(editProduct.standardPrice),
        listPrice: String(editProduct.listPrice),
        size: editProduct.size,
        weight: editProduct.weight,
        categoryId: editProduct.categoryId,
        // Limpiamos la fecha para que el input tipo date la reconozca (YYYY-MM-DD)
        saleStartDate: editProduct.saleStartDate ? editProduct.saleStartDate.split("T")[0] : "",
        saleEndDate: editProduct.saleEndDate ? editProduct.saleEndDate.split("T")[0] : "",
        status: editProduct.status as "Activo" | "Descontinuado",
      })
    } else {
      setForm(emptyForm)
    }
    setErrors({})
  }, [editProduct, open])

  function updateField (field: keyof FormData, value: string) {
    setForm(prev => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors(prev => {
        const next = { ...prev }
        delete next[field]
        return next
      })
    }
  }

  function validate () {
    const newErrors: Record<string, string> = {}
    if (!form.name.trim()) newErrors.name = 'El nombre es obligatorio'
    if (!form.categoryId) newErrors.categoryId = 'La categoria es obligatoria'
    if (!form.standardPrice.trim()) {
      newErrors.standardPrice = 'El precio es obligatorio'
    } else if (
      isNaN(Number(form.standardPrice)) ||
      Number(form.standardPrice) < 0
    ) {
      newErrors.standardPrice = 'Ingresa un precio valido'
    }
    if (
      form.listPrice.trim() &&
      (isNaN(Number(form.listPrice)) || Number(form.listPrice) < 0)
    ) {
      newErrors.listPrice = 'Ingresa un precio valido'
    }
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  async function handleSubmit (e: React.FormEvent) {
    e.preventDefault()
    if (!validate()) return

    const productData = {
      name: form.name.trim(),
      productNumber: form.productNumber.trim(),
      color: form.color.trim(),
      standardPrice: Number(form.standardPrice),
      listPrice: Number(form.listPrice) || 0,
      size: form.size.trim(),
      weight: form.weight.trim(),
      categoryId: form.categoryId,
      // Enviamos el string de la fecha; el backend se encargará del new Date()
      saleStartDate:
        form.saleStartDate || new Date().toISOString().split('T')[0],
      saleEndDate: form.saleEndDate || null,
      status: form.status
    }

    try {
      if (editProduct) {
        // IMPORTANTE: Pasamos el id por separado para la URL del PATCH
        await updateProduct(editProduct.id, productData)
        toast.success(`Producto "${productData.name}" actualizado`)
      } else {
        await addProduct(productData)
        toast.success(`Producto "${productData.name}" creado`)
      }
      onOpenChange(false) // Solo cerramos si la petición fue exitosa
    } catch (error) {
      // El toast de error ya se maneja en el DataProvider,
      // pero aquí evitamos que el modal se cierre si falla.
      console.error('Error al procesar el producto:', error)
    }
  }

  const inputClass = (field: string) =>
    `h-10 w-full rounded-[10px] border bg-card px-3.5 text-[13px] text-card-foreground placeholder:text-muted-foreground outline-none transition-all duration-200 focus:ring-2 focus:ring-[#1D4ED8]/20 ${
      errors[field]
        ? 'border-[#DC2626] focus:border-[#DC2626]'
        : 'border-[#D1D5DB] focus:border-[#1D4ED8] dark:border-input'
    }`

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='max-h-[90vh] overflow-y-auto rounded-xl border border-border bg-card shadow-[0_8px_30px_rgba(0,0,0,0.12)] sm:max-w-2xl'>
        <DialogHeader>
          <DialogTitle className='text-lg font-semibold text-card-foreground'>
            {editProduct ? 'Editar Producto' : 'Nuevo Producto'}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className='flex flex-col gap-5'>
          <div className='grid grid-cols-1 gap-5 sm:grid-cols-2'>
            {/* Nombre */}
            <div className='flex flex-col gap-1.5 sm:col-span-2'>
              <Label
                htmlFor='prod-name'
                className='text-[13px] font-medium text-card-foreground'
              >
                Nombre *
              </Label>
              <input
                id='prod-name'
                value={form.name}
                onChange={e => updateField('name', e.target.value)}
                placeholder='Nombre del producto'
                className={inputClass('name')}
              />
              {errors.name && (
                <p className='text-[12px] text-[#DC2626]'>{errors.name}</p>
              )}
            </div>

            {/* Product Number */}
            <div className='flex flex-col gap-1.5'>
              <Label
                htmlFor='prod-number'
                className='text-[13px] font-medium text-card-foreground'
              >
                Numero de producto
              </Label>
              <input
                id='prod-number'
                value={form.productNumber}
                onChange={e => updateField('productNumber', e.target.value)}
                placeholder='Ej: PRD-001'
                className={inputClass('')}
              />
            </div>

            {/* Color */}
            <div className='flex flex-col gap-1.5'>
              <Label
                htmlFor='prod-color'
                className='text-[13px] font-medium text-card-foreground'
              >
                Color
              </Label>
              <input
                id='prod-color'
                value={form.color}
                onChange={e => updateField('color', e.target.value)}
                placeholder='Ej: Negro'
                className={inputClass('')}
              />
            </div>

            {/* Standard Price */}
            <div className='flex flex-col gap-1.5'>
              <Label
                htmlFor='prod-std-price'
                className='text-[13px] font-medium text-card-foreground'
              >
                Precio estandar *
              </Label>
              <input
                id='prod-std-price'
                type='number'
                min='0'
                value={form.standardPrice}
                onChange={e => updateField('standardPrice', e.target.value)}
                placeholder='0'
                className={inputClass('standardPrice')}
              />
              {errors.standardPrice && (
                <p className='text-[12px] text-[#DC2626]'>
                  {errors.standardPrice}
                </p>
              )}
            </div>

            {/* List Price */}
            <div className='flex flex-col gap-1.5'>
              <Label
                htmlFor='prod-list-price'
                className='text-[13px] font-medium text-card-foreground'
              >
                Precio de lista
              </Label>
              <input
                id='prod-list-price'
                type='number'
                min='0'
                value={form.listPrice}
                onChange={e => updateField('listPrice', e.target.value)}
                placeholder='0'
                className={inputClass('listPrice')}
              />
              {errors.listPrice && (
                <p className='text-[12px] text-[#DC2626]'>{errors.listPrice}</p>
              )}
            </div>

            {/* Size */}
            <div className='flex flex-col gap-1.5'>
              <Label
                htmlFor='prod-size'
                className='text-[13px] font-medium text-card-foreground'
              >
                Tamano
              </Label>
              <input
                id='prod-size'
                value={form.size}
                onChange={e => updateField('size', e.target.value)}
                placeholder='Ej: 15.6"'
                className={inputClass('')}
              />
            </div>

            {/* Weight */}
            <div className='flex flex-col gap-1.5'>
              <Label
                htmlFor='prod-weight'
                className='text-[13px] font-medium text-card-foreground'
              >
                Peso
              </Label>
              <input
                id='prod-weight'
                value={form.weight}
                onChange={e => updateField('weight', e.target.value)}
                placeholder='Ej: 1.5 kg'
                className={inputClass('')}
              />
            </div>

            {/* Category */}
            <div className='flex flex-col gap-1.5'>
              <Label
                htmlFor='prod-category'
                className='text-[13px] font-medium text-card-foreground'
              >
                Categoria *
              </Label>
              <Select
                value={form.categoryId}
                onValueChange={v => updateField('categoryId', v)}
              >
                <SelectTrigger
                  id='prod-category'
                  className={`rounded-[10px] text-[13px] ${
                    errors.categoryId
                      ? 'border-[#DC2626]'
                      : 'border-[#D1D5DB] dark:border-input'
                  }`}
                >
                  <SelectValue placeholder='Selecciona una categoria' />
                </SelectTrigger>
                <SelectContent className='rounded-xl'>
                  {categories.map(cat => (
                    <SelectItem key={cat.id} value={cat.id}>
                      {cat.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.categoryId && (
                <p className='text-[12px] text-[#DC2626]'>
                  {errors.categoryId}
                </p>
              )}
            </div>

            {/* Status */}
            <div className='flex flex-col gap-1.5'>
              <Label
                htmlFor='prod-status'
                className='text-[13px] font-medium text-card-foreground'
              >
                Estado
              </Label>
              <Select
                value={form.status}
                onValueChange={v => updateField('status', v)}
              >
                <SelectTrigger
                  id='prod-status'
                  className='rounded-[10px] border-[#D1D5DB] text-[13px] dark:border-input'
                >
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className='rounded-xl'>
                  <SelectItem value='Activo'>Activo</SelectItem>
                  <SelectItem value='Descontinuado'>Descontinuado</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Sale Start Date */}
            <div className='flex flex-col gap-1.5'>
              <Label
                htmlFor='prod-start'
                className='text-[13px] font-medium text-card-foreground'
              >
                Fecha inicio venta
              </Label>
              <input
                id='prod-start'
                type='date'
                value={form.saleStartDate}
                onChange={e => updateField('saleStartDate', e.target.value)}
                className={inputClass('')}
              />
            </div>

            {/* Sale End Date */}
            <div className='flex flex-col gap-1.5'>
              <Label
                htmlFor='prod-end'
                className='text-[13px] font-medium text-card-foreground'
              >
                Fecha fin venta (opcional)
              </Label>
              <input
                id='prod-end'
                type='date'
                value={form.saleEndDate}
                onChange={e => updateField('saleEndDate', e.target.value)}
                className={inputClass('')}
              />
            </div>
          </div>

          <DialogFooter className='gap-2'>
            <Button
              type='button'
              variant='outline'
              onClick={() => onOpenChange(false)}
              className='rounded-[10px] border-[#D1D5DB] text-[13px] btn-tracking transition-all duration-200 hover:bg-muted dark:border-input'
            >
              Cancelar
            </Button>
            <Button
              type='submit'
              className='rounded-[10px] bg-[#1D4ED8] text-[13px] text-white btn-tracking transition-all duration-200 hover:bg-[#1E40AF] hover:scale-[1.02] active:scale-100'
            >
              {editProduct ? 'Guardar Cambios' : 'Crear Producto'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
