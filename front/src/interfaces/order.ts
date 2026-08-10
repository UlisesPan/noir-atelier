import { IProduct } from "./types";

export interface Order {
  id: number;
  status: string;
  date: string;
  products: IProduct[];
}
