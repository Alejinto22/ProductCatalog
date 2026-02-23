"use client"

import { useRouter } from "next/navigation"
import { useAuth } from "@/context/auth-context"
import { useTheme } from "next-themes"
import { Menu, LogOut, Sun, Moon, User } from "lucide-react"
import { Button } from "@/components/ui/button"

interface AppNavbarProps {
  onMenuToggle: () => void
}

export function AppNavbar({ onMenuToggle }: AppNavbarProps) {
  const { user, logout } = useAuth()
  const { theme, setTheme } = useTheme()
  const router = useRouter()

  function handleLogout() {
    logout()
    router.push("/login")
  }

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-border bg-card px-4 card-shadow lg:px-6">
      <div className="flex items-center gap-3">
        <button
          onClick={onMenuToggle}
          className="flex h-9 w-9 items-center justify-center rounded-[10px] text-foreground transition-colors duration-200 hover:bg-accent lg:hidden"
          aria-label="Abrir menu"
        >
          <Menu className="h-5 w-5" />
        </button>
        <h2 className="text-[15px] font-semibold text-foreground hidden sm:block">
          Panel Administrativo
        </h2>
      </div>

      <div className="flex items-center gap-1.5">
        {/* Dark mode toggle */}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          aria-label="Cambiar tema"
          className="h-9 w-9 rounded-[10px] text-muted-foreground transition-colors duration-200 hover:bg-accent hover:text-foreground"
        >
          <Sun className="h-[18px] w-[18px] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <Moon className="absolute h-[18px] w-[18px] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
        </Button>

        {/* User info */}
        <div className="hidden items-center gap-2 rounded-[10px] border border-border bg-muted/50 px-3 py-1.5 sm:flex">
          <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/10">
            <User className="h-3.5 w-3.5 text-primary" />
          </div>
          <span className="text-[13px] font-medium text-foreground">{user?.name ?? "Usuario"}</span>
        </div>

        {/* Logout */}
        <Button
          variant="ghost"
          size="sm"
          onClick={handleLogout}
          className="gap-2 rounded-[10px] text-destructive transition-colors duration-200 hover:bg-destructive/10 hover:text-destructive btn-tracking"
        >
          <LogOut className="h-4 w-4" />
          <span className="hidden sm:inline text-[13px]">Salir</span>
        </Button>
      </div>
    </header>
  )
}
