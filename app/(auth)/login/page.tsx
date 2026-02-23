"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { useAuth } from "@/context/auth-context"
import { Eye, EyeOff, LogIn, Package } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"

export default function LoginPage() {
  const { login } = useAuth()
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [errors, setErrors] = useState<{ email?: string; password?: string; general?: string }>({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  function validate() {
    const newErrors: typeof errors = {}
    if (!email.trim()) {
      newErrors.email = "El email es obligatorio"
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = "Ingresa un email valido"
    }
    if (!password.trim()) {
      newErrors.password = "La contrasena es obligatoria"
    }
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!validate()) return

    setIsSubmitting(true)
    setTimeout(() => {
      const result = login(email, password)
      if (result.success) {
        router.push("/dashboard")
      } else {
        setErrors({ general: result.error })
      }
      setIsSubmitting(false)
    }, 500)
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#F9FAFB] px-4 dark:bg-background">
      <div className="w-full max-w-[420px]">
        {/* Brand header */}
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-[#1D4ED8] shadow-[0_2px_8px_rgba(29,78,216,0.3)]">
            <Package className="h-6 w-6 text-white" />
          </div>
          <h1 className="text-2xl font-semibold text-[#1F2937] dark:text-foreground">ProductCatalog</h1>
          <p className="mt-1.5 text-[13px] text-muted-foreground">
            Sistema de Gestion de Catalogo de Productos
          </p>
        </div>

        {/* Login card */}
        <div className="rounded-xl border border-border bg-card p-8 shadow-[0_4px_16px_rgba(0,0,0,0.08)]">
          <div className="mb-6 text-center">
            <h2 className="text-lg font-semibold text-card-foreground">Iniciar Sesion</h2>
            <p className="mt-1 text-[13px] text-muted-foreground">Ingresa tus credenciales para acceder al panel</p>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            {errors.general && (
              <div className="rounded-[10px] bg-[#DC2626]/10 px-4 py-3 text-[13px] text-[#DC2626]">
                {errors.general}
              </div>
            )}

            <div className="flex flex-col gap-1.5">
              <Label htmlFor="email" className="text-[13px] font-medium text-card-foreground">Email</Label>
              <input
                id="email"
                type="email"
                placeholder="tu@email.com"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value)
                  if (errors.email) setErrors((prev) => ({ ...prev, email: undefined }))
                }}
                className={`h-10 w-full rounded-[10px] border bg-card px-3.5 text-[13px] text-card-foreground placeholder:text-muted-foreground outline-none transition-all duration-200 focus:ring-2 focus:ring-[#1D4ED8]/20 ${
                  errors.email ? "border-[#DC2626] focus:border-[#DC2626]" : "border-[#D1D5DB] focus:border-[#1D4ED8] dark:border-input"
                }`}
              />
              {errors.email && (
                <p className="text-[12px] text-[#DC2626]">{errors.email}</p>
              )}
            </div>

            <div className="flex flex-col gap-1.5">
              <Label htmlFor="password" className="text-[13px] font-medium text-card-foreground">Contrasena</Label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Tu contrasena"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value)
                    if (errors.password) setErrors((prev) => ({ ...prev, password: undefined }))
                  }}
                  className={`h-10 w-full rounded-[10px] border bg-card pr-10 pl-3.5 text-[13px] text-card-foreground placeholder:text-muted-foreground outline-none transition-all duration-200 focus:ring-2 focus:ring-[#1D4ED8]/20 ${
                    errors.password ? "border-[#DC2626] focus:border-[#DC2626]" : "border-[#D1D5DB] focus:border-[#1D4ED8] dark:border-input"
                  }`}
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
              {errors.password && (
                <p className="text-[12px] text-[#DC2626]">{errors.password}</p>
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
                  <LogIn className="mr-2 h-4 w-4" />
                  Iniciar Sesion
                </>
              )}
            </Button>

            <p className="text-center text-[13px] text-muted-foreground">
              {"No tienes cuenta? "}
              <Link href="/register" className="font-medium text-[#1D4ED8] transition-colors duration-200 hover:text-[#1E40AF] hover:underline">
                Registrate aqui
              </Link>
            </p>
          </form>
        </div>

        {/* Test credentials */}
        <div className="mt-5 rounded-xl border border-dashed border-border bg-card/80 p-4 text-center">
          <p className="mb-1.5 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Credenciales de prueba</p>
          <p className="text-[13px] text-card-foreground">
            <span className="font-medium">Email:</span> admin@demo.com
          </p>
          <p className="text-[13px] text-card-foreground">
            <span className="font-medium">Password:</span> admin123
          </p>
        </div>
      </div>
    </div>
  )
}
