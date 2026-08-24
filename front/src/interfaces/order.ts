import { IProduct } from "./product";

export interface Order {
  id: number;
  status: string;
  date: string;
  products: IProduct[];
}
