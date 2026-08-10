"use client";

import { IProduct } from "@/interfaces/types";
import {  useCart } from "@/context/CartContext";

interface AddToCartButtonProps {
  product: IProduct;
}

const AddToCartButton = ({ product }: AddToCartButtonProps) => {
    const { addToCart } = useCart();
  return (
    <button
      className=" bg-red-600 hover:bg-red-700 transition-colors duration-300 px-4 py-2 rounded-full text-sm font-semibold text-white cursor-pointer"
      onClick={() => {
        addToCart(product);
      }}
    >
      Agregar al carrito
    </button>
  )
}

export default AddToCartButton
