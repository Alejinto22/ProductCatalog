"use client"

import { Package, FolderTree, CheckCircle, XCircle } from "lucide-react"
import { useData } from "@/context/data-context"

export function StatCards() {
  const { products, categories } = useData()

  const totalProducts = products.length
  const totalCategories = categories.length
  const activeProducts = products.filter((p) => p.status === "Activo").length
  const discontinuedProducts = products.filter((p) => p.status === "Descontinuado").length

  const stats = [
    {
      label: "Total Productos",
      value: totalProducts,
      icon: Package,
      iconColor: "text-[#1D4ED8]",
      iconBg: "bg-[#1D4ED8]/10",
    },
    {
      label: "Total Categorias",
      value: totalCategories,
      icon: FolderTree,
      iconColor: "text-[#F59E0B]",
      iconBg: "bg-[#F59E0B]/10",
    },
    {
      label: "Productos Activos",
      value: activeProducts,
      icon: CheckCircle,
      iconColor: "text-[#059669]",
      iconBg: "bg-[#059669]/10",
    },
    {
      label: "Descontinuados",
      value: discontinuedProducts,
      icon: XCircle,
      iconColor: "text-[#DC2626]",
      iconBg: "bg-[#DC2626]/10",
    },
  ]

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => (
        <div
          key={stat.label}
          className="group flex items-center gap-4 rounded-xl border border-border bg-card p-5 card-shadow transition-all duration-300 hover:card-shadow-hover hover:scale-[1.02]"
        >
          <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${stat.iconBg} transition-transform duration-300 group-hover:scale-110`}>
            <stat.icon className={`h-6 w-6 ${stat.iconColor}`} />
          </div>
          <div>
            <p className="text-[13px] font-medium text-muted-foreground">{stat.label}</p>
            <p className="text-2xl font-semibold text-card-foreground">{stat.value}</p>
          </div>
        </div>
      ))}
    </div>
  )
}
