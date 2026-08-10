/* eslint-disable react-hooks/set-state-in-effect */
"use client"
import { createContext, useState, useEffect, useContext } from "react";
import { IProduct } from "@/interfaces/types";
import { useAuth } from "./AuthContext";

interface CartContextProps {
    cartItems: IProduct[];
    isReady: boolean;
    getIdItems: () => number[];
    addToCart: (product: IProduct) => void;
    removeFromCart: (productId: number) => void;
    clearCart: () => void;
}

export const CartContext = createContext< CartContextProps>({
    cartItems: [],
     isReady: false,
    getIdItems: () => [],
    addToCart:() => {},
    removeFromCart: () => {},
    clearCart:() => {},
});


interface CartProviderProps {
    children: React.ReactNode;
}

export const CartProvider: React.FC<CartProviderProps> = ({ children }) => {
    const [cartItems, setCartItems] = useState<IProduct[]>([]);
    const [isReady, setIsReady] = useState(false);
    const { dataUser } = useAuth();



    useEffect(() => {
        try {
            const storedCart = localStorage.getItem("cartItems");
            if (storedCart) {
              
                setCartItems(JSON.parse(storedCart) as IProduct[]);
            }
        } catch {
            localStorage.removeItem("cartItems");
        } finally {
            setIsReady(true);
        }
    }, []);

    useEffect(() => {
        if (!isReady) return;
        if (cartItems.length > 0) {
            localStorage.setItem("cartItems", JSON.stringify(cartItems));
        } else {
            localStorage.removeItem("cartItems");
        }
    }, [cartItems, isReady]);

    const getIdItems = () => {
        return cartItems.map(item => item.id);
    };

    

    const addToCart = (product: IProduct) => {
        if (!dataUser) {
            alert("Debes iniciar sesión para agregar productos al carrito.");
            return;
        }
        const productExists = cartItems.some(item => item.id === product.id);
        if (productExists) {
            alert("El producto ya está en el carrito.");
            return;
        }
        setCartItems(prevItems => [...prevItems, product]);
    };

    const removeFromCart = (productId: number) => {
        setCartItems(prevItems => prevItems.filter(item => item.id !== productId));
    };

    const clearCart = () => {
        setCartItems([]);
    };

return (
    <CartContext.Provider value={{ cartItems, isReady, getIdItems, addToCart, removeFromCart, clearCart }}>
        {children}
    </CartContext.Provider>
);
}


export const useCart = () => useContext(CartContext);