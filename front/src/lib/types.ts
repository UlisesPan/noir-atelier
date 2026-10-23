export type Gender = "masculine" | "feminine" | "unisex";
export type Role = "user" | "admin";
export type OrderStatus = "pending" | "paid" | "shipped" | "delivered" | "cancelled";
export type ProductSort = "featured" | "newest" | "price_asc" | "price_desc" | "rating";

export interface Category {
  id: number;
  name: string;
  slug: string;
  description: string;
  productCount?: number;
}

export interface ScentNotes {
  top: string[];
  heart: string[];
  base: string[];
}

export interface Product {
  id: number;
  name: string;
  slug: string;
  description: string;
  notes: ScentNotes;
  price: number;
  compareAtPrice: number | null;
  stock: number;
  volumeMl: number;
  gender: Gender;
  image: string;
  featured: boolean;
  active: boolean;
  ratingAvg: number;
  ratingCount: number;
  categoryId: number;
  category?: Category;
  createdAt: string;
}

export interface User {
  id: number;
  name: string;
  email: string;
  address: string;
  phone: string;
  role: Role;
  createdAt: string;
}

export interface OrderItem {
  id: number;
  productId: number | null;
  productName: string;
  productImage: string;
  unitPrice: number;
  quantity: number;
}

export interface Order {
  id: number;
  status: OrderStatus;
  total: number;
  shippingAddress: string;
  paymentId: string | null;
  paidAt: string | null;
  createdAt: string;
  userId: number;
  user?: User;
  items: OrderItem[];
}

export interface Review {
  id: number;
  rating: number;
  comment: string;
  author: string;
  userId: number;
  productId: number;
  createdAt: string;
}

export interface Paginated<T> {
  data: T[];
  meta: { page: number; limit: number; total: number; totalPages: number };
}

export interface AdminStats {
  revenue: number;
  paidOrders: number;
  pendingOrders: number;
  avgTicket: number;
  customers: number;
  products: number;
  lowStock: number;
  salesByDay: { date: string; revenue: number; orders: number }[];
  topProducts: { id: number | null; name: string; units: number; revenue: number }[];
  lowStockProducts: Pick<Product, "id" | "name" | "stock" | "image">[];
}

export interface ProductFilters {
  q?: string;
  category?: string;
  gender?: Gender;
  minPrice?: number;
  maxPrice?: number;
  inStock?: boolean;
  featured?: boolean;
  sort?: ProductSort;
  page?: number;
  limit?: number;
}
