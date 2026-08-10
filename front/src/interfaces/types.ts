export interface IProduct {
  id: number;
  name: string;
  description: string;
  price: number;
  image?: string;
  categoryId?: number;
  stock: number;
}