"use client"

import { Badge } from "@/components/ui/badge"
import { useData } from "@/context/data-context"

export function RecentProducts() {
  const { products, getCategoryName } = useData()

  const recentProducts = [...products]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5)

  function formatPrice(price: number) {
    return new Intl.NumberFormat("es-CO", {
      style: "currency",
      currency: "COP",
      minimumFractionDigits: 0,
    }).format(price)
  }

  return (
    <div className="rounded-xl border border-border bg-card card-shadow">
      <div className="border-b border-border px-6 py-4">
        <h3 className="text-[15px] font-semibold text-card-foreground">
          Ultimos Productos Agregados
        </h3>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-[13px]">
          <thead>
            <tr className="border-b border-border bg-muted/50">
              <th className="px-6 py-3 text-left font-semibold text-muted-foreground">Nombre</th>
              <th className="px-6 py-3 text-left font-semibold text-muted-foreground">Categoria</th>
              <th className="px-6 py-3 text-left font-semibold text-muted-foreground">Precio</th>
              <th className="px-6 py-3 text-left font-semibold text-muted-foreground">Estado</th>
            </tr>
          </thead>
          <tbody>
            {recentProducts.map((product, index) => (
              <tr
                key={product.id}
                className={`border-b border-border last:border-0 transition-colors duration-200 hover:bg-[#E0E7FF] dark:hover:bg-[#1D4ED8]/10 ${
                  index % 2 === 1 ? "bg-[#F9FAFB] dark:bg-[#0F172A]" : ""
                }`}
              >
                <td className="px-6 py-3.5 font-medium text-card-foreground">{product.name}</td>
                <td className="px-6 py-3.5 text-muted-foreground">
                  {getCategoryName(product.categoryId)}
                </td>
                <td className="px-6 py-3.5 font-medium text-card-foreground">{formatPrice(product.standardPrice)}</td>
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
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
