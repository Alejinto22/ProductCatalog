"use client"

import { StatCards } from "@/components/dashboard/stat-cards"
import { RecentProducts } from "@/components/dashboard/recent-products"

export default function DashboardPage() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-xl font-semibold text-foreground">Dashboard</h1>
        <p className="mt-1 text-[13px] text-muted-foreground">
          Resumen general del catalogo de productos
        </p>
      </div>
      <StatCards />
      <RecentProducts />
    </div>
  )
}
