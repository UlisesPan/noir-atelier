"use client";
import { useState, useRef, useEffect } from "react";
import { Navlinks } from "../../app/helpers/Navlinks";
import { useAuth } from "@/context/AuthContext";
import { useCart } from "@/context/CartContext";
import Link from "next/link";
import { IUserSession } from "@/interfaces/userSession";

interface ProfileMenuProps {
  dataUser: null | IUserSession; 
  logout: () => void;
}

const ProfileMenu = ({  logout }: ProfileMenuProps) => {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    window.addEventListener("click", handleClick);
    return () => window.removeEventListener("click", handleClick);
  }, []);

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(!open)}
        aria-expanded={open}
        className="inline-flex items-center gap-2 rounded-full bg-white/5 px-3 py-2 text-sm text-white transition hover:bg-white/10 cursor-pointer"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
          <path d="M20 21v-2a4 4 0 0 0-3-3.87" />
          <path d="M4 21v-2a4 4 0 0 1 3-3.87" />
          <circle cx="12" cy="7" r="4" />
        </svg>
      </button>

      {open && (
        <div className="absolute right-0 z-50 mt-2 w-44 rounded-md bg-[#0b0b0b] border border-slate-800 shadow-lg py-1">
          <Link href="/dashboard" onClick={() => setOpen(false)} className="block px-4 py-2 text-sm text-slate-200 hover:bg-white/5 cursor-pointer">
            Perfil
          </Link>
          <button onClick={logout} className="w-full text-left px-4 py-2 text-sm text-slate-200 hover:bg-white/5 cursor-pointer">
            Cerrar sesión
          </button>
        </div>
      )}
    </div>
  );
};

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { dataUser, logout } = useAuth();
  const { cartItems } = useCart();

  return (
    <nav className="sticky top-0 z-50 w-full backdrop-blur-sm">
      <div className="bg-[#0b0b0b] text-white text-[11px] uppercase tracking-[0.24em] px-4 py-2 sm:px-6">
        <div className="mx-auto flex max-w-7xl flex-col gap-2 md:flex-row md:items-center md:justify-between">
          <span className="text-slate-300">Envío gratis en pedidos superiores a $150</span>
          <div className="flex items-center gap-3 justify-center md:justify-end">
            <button className="cursor-pointer rounded-full border border-white/12 bg-white/3 px-3 py-1 text-white/80 transition hover:bg-white/10 hover:text-white">
              ARS
            </button>
            <button className="cursor-pointer rounded-full border border-white/12 bg-white/3 px-3 py-1 text-white/80 transition hover:bg-white/10 hover:text-white">
              Español
            </button>
          </div>
        </div>
      </div>

      <div className="bg-[#0b0b0b] shadow-sm">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:px-6">
          <div className="flex items-center gap-4">
            <Link href="/" className="inline-flex items-center text-sm font-semibold uppercase tracking-[0.2em] text-white no-underline">
              <div className="bg-red-700 cursor-pointer px-5 py-2 text-lg font-bold tracking-[0.18em] text-white rounded-sm">Milano</div>
            </Link>
          </div>

        

          <div className="flex items-center gap-3">
            <div className="hidden items-center gap-6 md:flex">
              {Navlinks.map((link) => (
                <Link key={link.name} href={link.path} className="cursor-pointer text-sm uppercase tracking-[0.16em] text-slate-200 transition hover:text-white">
                  {link.name}
                </Link>
              ))}
              {dataUser ? (
                <div className="relative">
                  <ProfileMenu dataUser={dataUser} logout={logout} />
                </div>
              ) : (
                <>
                  <Link href="/login" className="cursor-pointer hidden rounded-full px-3 py-2 text-sm text-slate-200 transition hover:bg-white/5 md:inline-flex">
                    Iniciar sesión
                  </Link>
                  <Link href="/register" className="cursor-pointer hidden rounded-full bg-red-600 px-3 py-2 text-sm text-white transition hover:bg-red-700 md:inline-flex">
                    Registrarse
                  </Link>
                </>
              )}
            </div>
            <Link href="/cart" className="group inline-flex items-center rounded-full border border-slate-700 bg-white/5 px-3 py-2 text-slate-200 transition hover:border-slate-500 hover:bg-white/10 cursor-pointer">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M6 6h15l-1.5 9h-13z" />
                <circle cx="9" cy="20" r="1" />
                <circle cx="18" cy="20" r="1" />
              </svg>
              <span className="ml-2 text-sm text-slate-200 sr-only">Carrito</span>
              <span className="ml-2 hidden rounded-full bg-red-600 px-2 py-0.5 text-xs font-semibold text-white md:inline-block">{cartItems.length}</span>
            </Link>
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-slate-700 bg-white/5 text-slate-200 transition hover:border-slate-500 hover:bg-white/10 md:hidden cursor-pointer"
              aria-label="Toggle navigation menu"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                {isOpen ? <path d="M6 18L18 6M6 6l12 12" /> : <><path d="M4 7h16" /><path d="M4 12h16" /><path d="M4 17h16" /></>}
              </svg>
            </button>
          </div>
        </div>

        <div className={`${isOpen ? 'block' : 'hidden'} border-t border-slate-800 bg-[#070707] px-4 pb-4 pt-3 md:hidden`}>
          <div className="space-y-3">
            <div>
              <label htmlFor="mobile-search" className="sr-only">
                Buscar producto
              </label>
              <div className="relative">
                <input
                  id="mobile-search"
                  type="search"
                  placeholder="Buscar producto"
                  className="w-full rounded-full border border-slate-800 bg-slate-900/70 px-4 py-3 pr-12 text-sm text-slate-200 outline-none"
                />
                <button type="button" className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200 cursor-pointer">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="11" cy="11" r="8" />
                    <path d="M21 21l-4.35-4.35" />
                  </svg>
                </button>
              </div>
            </div>
            <div className="flex flex-col gap-2">
              {Navlinks.map((link) => (
                <Link key={link.name} href={link.path} className="rounded-full border border-slate-800 bg-[#0f0f0f] px-4 py-3 text-sm uppercase tracking-[0.16em] text-white transition hover:bg-white/5 cursor-pointer">
                  {link.name}
                </Link>
              ))}
              {dataUser ? (
                <button
                  onClick={logout}
                  className="rounded-full border border-slate-800 bg-[#0f0f0f] px-4 py-3 text-sm text-white transition hover:bg-slate-700 cursor-pointer"
                >
                  Logout
                </button>
              ) : (
                <>
                  <Link href="/login" className="rounded-full border border-slate-800 bg-[#0f0f0f] px-4 py-3 text-sm text-white transition hover:bg-white/5 cursor-pointer">
                    Iniciar sesión
                  </Link>
                  <Link href="/register" className="rounded-full border border-slate-800 bg-red-600 px-4 py-3 text-sm text-white transition hover:bg-red-700 cursor-pointer">
                    Registrarse
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
