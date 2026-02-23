"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { LayoutDashboard, FolderTree, Package, X } from "lucide-react"
import { cn } from "@/lib/utils"

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/categories", label: "Categorias", icon: FolderTree },
  { href: "/products", label: "Productos", icon: Package },
]

interface AppSidebarProps {
  open: boolean
  onClose: () => void
}

export function AppSidebar({ open, onClose }: AppSidebarProps) {
  const pathname = usePathname()

  return (
    <>
      {/* Mobile overlay */}
      {open && (
        <div
          className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm transition-opacity duration-300 lg:hidden"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex w-[260px] flex-col transition-transform duration-300 ease-in-out lg:static lg:translate-x-0",
          "bg-[var(--sidebar-bg)]",
          open ? "translate-x-0" : "-translate-x-full"
        )}
      >
        {/* Logo area */}
        <div className="flex h-16 items-center justify-between border-b border-white/[0.08] px-6">
          <Link href="/dashboard" className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#1D4ED8]">
              <Package className="h-4 w-4 text-white" />
            </div>
            <span className="text-[15px] font-semibold tracking-wide text-white">
              ProductCatalog
            </span>
          </Link>
          <button
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-white/60 transition-colors duration-200 hover:bg-white/[0.08] hover:text-white lg:hidden"
            aria-label="Cerrar menu"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="mt-6 flex flex-1 flex-col gap-1 px-3">
          <p className="mb-2 px-3 text-[11px] font-semibold uppercase tracking-widest text-white/40">
            Menu
          </p>
          {navItems.map((item) => {
            const isActive = pathname === item.href
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onClose}
                className={cn(
                  "group flex items-center gap-3 rounded-[10px] px-3 py-2.5 text-[13px] font-medium transition-all duration-200",
                  isActive
                    ? "bg-[#1D4ED8] text-white shadow-[0_1px_3px_rgba(29,78,216,0.4)]"
                    : "text-white/60 hover:bg-white/[0.08] hover:text-white"
                )}
              >
                <item.icon className={cn(
                  "h-[18px] w-[18px] transition-colors duration-200",
                  isActive ? "text-white" : "text-white/50 group-hover:text-white"
                )} />
                {item.label}
              </Link>
            )
          })}
        </nav>

        {/* Footer */}
        <div className="border-t border-white/[0.08] px-6 py-4">
          <p className="text-[11px] text-white/30">ProductCatalog v1.0</p>
        </div>
      </aside>
    </>
  )
}
