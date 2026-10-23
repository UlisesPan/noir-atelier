import { CartDrawer } from "@/components/cart/cart-drawer";
import { Footer } from "@/components/layout/footer";
import { Navbar } from "@/components/layout/navbar";

export default function StoreLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <a
        href="#main"
        className="sr-only z-50 rounded-full bg-ink px-4 py-2 text-ivory focus:not-sr-only focus:fixed focus:top-3 focus:left-3"
      >
        Saltar al contenido
      </a>
      <Navbar />
      <main id="main" className="flex-1">
        {children}
      </main>
      <Footer />
      <CartDrawer />
    </>
  );
}
