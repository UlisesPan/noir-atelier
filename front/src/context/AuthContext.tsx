/* eslint-disable react-hooks/set-state-in-effect */
"use client";
import { createContext, useState, useEffect, useContext } from "react";
import { IUserSession } from "@/interfaces/userSession";


interface AuthContextProps  { 
    dataUser: null | IUserSession;
    setDataUser: (user: IUserSession ) => void;
    logout: () => void;
    isReady: boolean;
    isAuthReady?: boolean;
}

const AuthContext = createContext<AuthContextProps>({
    dataUser: null,
    setDataUser: () => {},
    logout: () => {},
    isReady: false
});

interface AuthProviderProps {
    children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
    const [dataUser, setDataUser] = useState<IUserSession | null>(null);
    const  [ isReady, setIsReady ] = useState(false);
    useEffect(() => {
        try {
            const userSession = localStorage.getItem("userSession");
            if (userSession) {
                setDataUser(JSON.parse(userSession as string) as IUserSession);
            }
        } catch  {
            localStorage.removeItem("userSession");
        } finally {
            setIsReady(true);
        }
    }, []);

    useEffect(() => {
        if (!isReady) return;
        if (dataUser) {
            localStorage.setItem("userSession", JSON.stringify(dataUser));
        } else {
            localStorage.removeItem("userSession");
        }
    }, [dataUser, isReady]);

    const logout = () => {
        setDataUser(null);
        localStorage.removeItem("userSession");
        localStorage.removeItem("cartItems");
    }

    return (
        <AuthContext.Provider value={{ dataUser, setDataUser, logout, isReady: isReady }}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => { return useContext(AuthContext) };