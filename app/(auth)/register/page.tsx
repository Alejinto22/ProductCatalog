"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { useAuth } from "@/context/auth-context"
import { Eye, EyeOff, UserPlus, Package } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"

export default function RegisterPage() {
  const { register } = useAuth()
  const router = useRouter()
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  function validate() {
    const newErrors: Record<string, string> = {}
    if (!name.trim()) newErrors.name = "El nombre es obligatorio"
    if (!email.trim()) {
      newErrors.email = "El email es obligatorio"
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = "Ingresa un email valido"
    }
    if (!password.trim()) {
      newErrors.password = "La contrasena es obligatoria"
    } else if (password.length < 6) {
      newErrors.password = "La contrasena debe tener al menos 6 caracteres"
    }
    if (!confirmPassword.trim()) {
      newErrors.confirmPassword = "Confirma tu contrasena"
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword = "Las contrasenas no coinciden"
    }
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!validate()) return

    setIsSubmitting(true)
    setErrors({}) // Limpiamos errores previos

    try {
      // LLAMADA ASÍNCRONA: Esperamos la respuesta real del backend
      const result = await register(name, email, password)

      if (result.success) {
        toast.success("Cuenta creada exitosamente. Inicia sesión.")
        router.push("/login")
      } else {
        // Capturamos el error 401/409 del backend (ej: "El email ya está registrado")
        setErrors({ general: result.error ?? "Error al registrar" })
      }
    } catch (error) {
      setErrors({ general: "Error de conexión con el servidor" })
    } finally {
      setIsSubmitting(false)
    }
  }

  function clearError(field: string) {
    setErrors((prev) => {
      const next = { ...prev }
      delete next[field]
      return next
    })
  }

  const inputClass = (field: string) =>
    `h-10 w-full rounded-[10px] border bg-card px-3.5 text-[13px] text-card-foreground placeholder:text-muted-foreground outline-none transition-all duration-200 focus:ring-2 focus:ring-[#1D4ED8]/20 ${
      errors[field] ? "border-[#DC2626] focus:border-[#DC2626]" : "border-[#D1D5DB] focus:border-[#1D4ED8] dark:border-input"
    }`

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#F9FAFB] px-4 py-8 dark:bg-background">
      <div className="w-full max-w-[420px]">
        {/* Brand header */}
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-[#1D4ED8] shadow-[0_2px_8px_rgba(29,78,216,0.3)]">
            <Package className="h-6 w-6 text-white" />
          </div>
          <h1 className="text-2xl font-semibold text-[#1F2937] dark:text-foreground">ProductCatalog</h1>
          <p className="mt-1.5 text-[13px] text-muted-foreground">
            Crea tu cuenta para acceder al sistema
          </p>
        </div>

        {/* Register card */}
        <div className="rounded-xl border border-border bg-card p-8 shadow-[0_4px_16px_rgba(0,0,0,0.08)]">
          <div className="mb-6 text-center">
            <h2 className="text-lg font-semibold text-card-foreground">Crear Cuenta</h2>
            <p className="mt-1 text-[13px] text-muted-foreground">Completa los campos para registrarte</p>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            {errors.general && (
              <div className="rounded-[10px] bg-[#DC2626]/10 px-4 py-3 text-[13px] text-[#DC2626]">
                {errors.general}
              </div>
            )}

            <div className="flex flex-col gap-1.5">
              <Label htmlFor="name" className="text-[13px] font-medium text-card-foreground">Nombre completo</Label>
              <input
                id="name"
                type="text"
                placeholder="Tu nombre completo"
                value={name}
                onChange={(e) => { setName(e.target.value); clearError("name") }}
                className={inputClass("name")}
              />
              {errors.name && <p className="text-[12px] text-[#DC2626]">{errors.name}</p>}
            </div>

            <div className="flex flex-col gap-1.5">
              <Label htmlFor="email" className="text-[13px] font-medium text-card-foreground">Email</Label>
              <input
                id="email"
                type="email"
                placeholder="tu@email.com"
                value={email}
                onChange={(e) => { setEmail(e.target.value); clearError("email") }}
                className={inputClass("email")}
              />
              {errors.email && <p className="text-[12px] text-[#DC2626]">{errors.email}</p>}
            </div>

            <div className="flex flex-col gap-1.5">
              <Label htmlFor="password" className="text-[13px] font-medium text-card-foreground">Contrasena</Label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Minimo 6 caracteres"
                  value={password}
                  onChange={(e) => { setPassword(e.target.value); clearError("password") }}
                  className={`${inputClass("password")} pr-10`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground transition-colors duration-200 hover:text-foreground"
                  aria-label={showPassword ? "Ocultar contrasena" : "Mostrar contrasena"}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {errors.password && <p className="text-[12px] text-[#DC2626]">{errors.password}</p>}
            </div>

            <div className="flex flex-col gap-1.5">
              <Label htmlFor="confirmPassword" className="text-[13px] font-medium text-card-foreground">Confirmar contrasena</Label>
              <input
                id="confirmPassword"
                type={showPassword ? "text" : "password"}
                placeholder="Repite tu contrasena"
                value={confirmPassword}
                onChange={(e) => { setConfirmPassword(e.target.value); clearError("confirmPassword") }}
                className={inputClass("confirmPassword")}
              />
              {errors.confirmPassword && (
                <p className="text-[12px] text-[#DC2626]">{errors.confirmPassword}</p>
              )}
            </div>

            <Button
              type="submit"
              disabled={isSubmitting}
              className="h-10 w-full rounded-[10px] bg-[#1D4ED8] text-[13px] font-medium text-white btn-tracking transition-all duration-200 hover:bg-[#1E40AF] hover:scale-[1.02] active:scale-100 disabled:opacity-60"
            >
              {isSubmitting ? (
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
              ) : (
                <>
                  <UserPlus className="mr-2 h-4 w-4" />
                  Crear Cuenta
                </>
              )}
            </Button>

            <p className="text-center text-[13px] text-muted-foreground">
              {"Ya tienes cuenta? "}
              <Link href="/login" className="font-medium text-[#1D4ED8] transition-colors duration-200 hover:text-[#1E40AF] hover:underline">
                Inicia sesion
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  )
}
