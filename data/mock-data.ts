export interface User {
  id: string
  name: string
  email: string
  password: string
}

export interface Category {
  id: string
  name: string
  parentId: string | null
  updatedAt: string
}

export interface Product {
  id: string
  name: string
  productNumber: string
  color: string
  standardPrice: number
  listPrice: number
  size: string
  weight: string
  categoryId: string
  saleStartDate: string
  saleEndDate: string | null
  status: "Activo" | "Descontinuado"
  createdAt: string
}

export const defaultUsers: User[] = [
  {
    id: "1",
    name: "Administrador",
    email: "admin@demo.com",
    password: "admin123",
  },
]

export const defaultCategories: Category[] = [
  {
    id: "cat-1",
    name: "Electronica",
    parentId: null,
    updatedAt: "2026-01-15T10:30:00Z",
  },
  {
    id: "cat-2",
    name: "Computadores",
    parentId: "cat-1",
    updatedAt: "2026-01-20T14:45:00Z",
  },
  {
    id: "cat-3",
    name: "Celulares",
    parentId: "cat-1",
    updatedAt: "2026-01-22T09:15:00Z",
  },
  {
    id: "cat-4",
    name: "Ropa",
    parentId: null,
    updatedAt: "2026-02-01T11:00:00Z",
  },
  {
    id: "cat-5",
    name: "Camisetas",
    parentId: "cat-4",
    updatedAt: "2026-02-05T16:30:00Z",
  },
  {
    id: "cat-6",
    name: "Pantalones",
    parentId: "cat-4",
    updatedAt: "2026-02-08T08:20:00Z",
  },
  {
    id: "cat-7",
    name: "Hogar",
    parentId: null,
    updatedAt: "2026-02-10T13:45:00Z",
  },
  {
    id: "cat-8",
    name: "Accesorios",
    parentId: null,
    updatedAt: "2026-02-12T10:00:00Z",
  },
]

export const defaultProducts: Product[] = [
  {
    id: "prod-1",
    name: "Laptop HP Pavilion 15",
    productNumber: "HP-PAV-15-001",
    color: "Plata",
    standardPrice: 2499000,
    listPrice: 2799000,
    size: '15.6"',
    weight: "1.75 kg",
    categoryId: "cat-2",
    saleStartDate: "2026-01-01",
    saleEndDate: null,
    status: "Activo",
    createdAt: "2026-01-15T10:30:00Z",
  },
  {
    id: "prod-2",
    name: "Samsung Galaxy S24",
    productNumber: "SAM-GS24-001",
    color: "Negro",
    standardPrice: 3200000,
    listPrice: 3599000,
    size: '6.2"',
    weight: "167 g",
    categoryId: "cat-3",
    saleStartDate: "2026-01-10",
    saleEndDate: null,
    status: "Activo",
    createdAt: "2026-01-18T14:00:00Z",
  },
  {
    id: "prod-3",
    name: "Camiseta Polo Classic",
    productNumber: "CAM-POL-001",
    color: "Blanco",
    standardPrice: 89000,
    listPrice: 119000,
    size: "M",
    weight: "200 g",
    categoryId: "cat-5",
    saleStartDate: "2026-01-05",
    saleEndDate: null,
    status: "Activo",
    createdAt: "2026-01-20T09:00:00Z",
  },
  {
    id: "prod-4",
    name: "Jeans Slim Fit",
    productNumber: "PAN-JSF-001",
    color: "Azul Oscuro",
    standardPrice: 120000,
    listPrice: 159000,
    size: "32",
    weight: "450 g",
    categoryId: "cat-6",
    saleStartDate: "2025-11-01",
    saleEndDate: "2026-01-31",
    status: "Descontinuado",
    createdAt: "2025-11-01T08:00:00Z",
  },
  {
    id: "prod-5",
    name: "MacBook Air M3",
    productNumber: "APL-MBA-M3-001",
    color: "Gris Espacial",
    standardPrice: 4999000,
    listPrice: 5499000,
    size: '13.6"',
    weight: "1.24 kg",
    categoryId: "cat-2",
    saleStartDate: "2026-02-01",
    saleEndDate: null,
    status: "Activo",
    createdAt: "2026-02-01T12:00:00Z",
  },
  {
    id: "prod-6",
    name: "iPhone 16 Pro",
    productNumber: "APL-IP16P-001",
    color: "Titanio Natural",
    standardPrice: 5200000,
    listPrice: 5799000,
    size: '6.3"',
    weight: "199 g",
    categoryId: "cat-3",
    saleStartDate: "2026-02-05",
    saleEndDate: null,
    status: "Activo",
    createdAt: "2026-02-05T10:30:00Z",
  },
  {
    id: "prod-7",
    name: "Monitor LG UltraWide 34",
    productNumber: "LG-UW34-001",
    color: "Negro",
    standardPrice: 1800000,
    listPrice: 2100000,
    size: '34"',
    weight: "7.2 kg",
    categoryId: "cat-1",
    saleStartDate: "2026-01-15",
    saleEndDate: null,
    status: "Activo",
    createdAt: "2026-02-08T15:00:00Z",
  },
  {
    id: "prod-8",
    name: "Teclado Mecanico Corsair K70",
    productNumber: "COR-K70-001",
    color: "Negro/RGB",
    standardPrice: 450000,
    listPrice: 520000,
    size: "Full Size",
    weight: "1.08 kg",
    categoryId: "cat-8",
    saleStartDate: "2025-09-01",
    saleEndDate: "2025-12-31",
    status: "Descontinuado",
    createdAt: "2025-09-01T11:00:00Z",
  },
  {
    id: "prod-9",
    name: "Camiseta Deportiva Nike Dri-FIT",
    productNumber: "NIK-DF-001",
    color: "Rojo",
    standardPrice: 110000,
    listPrice: 139000,
    size: "L",
    weight: "150 g",
    categoryId: "cat-5",
    saleStartDate: "2026-02-10",
    saleEndDate: null,
    status: "Activo",
    createdAt: "2026-02-10T09:00:00Z",
  },
  {
    id: "prod-10",
    name: "Lampara LED Escritorio",
    productNumber: "HGR-LED-001",
    color: "Blanco",
    standardPrice: 75000,
    listPrice: 95000,
    size: "40 cm",
    weight: "800 g",
    categoryId: "cat-7",
    saleStartDate: "2026-02-12",
    saleEndDate: null,
    status: "Activo",
    createdAt: "2026-02-12T14:30:00Z",
  },
]
