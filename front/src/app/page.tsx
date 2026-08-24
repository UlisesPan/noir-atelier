import { CardComponent } from "../components/Card/Card";
import Image from "next/image";
import background from '../assets/bg-home.jpg';

import { getProducts } from "../services/services";

export default async function App() {
  const getAllProducts = await getProducts();

  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <section className="relative overflow-hidden">
        <div className="absolute inset-0">
          <Image src={background} alt="Spicebomb hero background" fill className="object-cover" priority />
          <div className="absolute inset-0 bg-slate-950/70" />
        </div>

        <div className="relative mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-2 lg:items-center">
            <div className="space-y-6 xl:pr-12">
              <p className="text-sm uppercase tracking-[0.35em] text-slate-300">Edición limitada</p>
              <h1 className="text-5xl font-semibold tracking-tight text-white md:text-6xl">Sumérgete en el universo de Milano</h1>
              <p className="max-w-xl text-lg leading-8 text-slate-300">
                Viktor&amp;Rolf presenta la edición limitada Milano, creada para ofrecer una experiencia olfativa poderosa y moderna.
              </p>
              <div className="flex flex-wrap gap-4">
                <button className="inline-flex cursor-pointer items-center justify-center rounded-full bg-red-600 px-8 py-3 text-sm font-semibold uppercase tracking-[0.2em] text-white shadow-lg shadow-red-500/30 transition hover:bg-red-700">
                  Comprar ahora
                </button>
                <button className="inline-flex cursor-pointer items-center justify-center rounded-full border border-white/15 bg-white/5 px-8 py-3 text-sm uppercase tracking-[0.2em] text-white transition hover:bg-white/10">
                  Ver colección
                </button>
              </div>
            </div>

            <div className="relative mx-auto w-full max-w-xl overflow-hidden rounded-32px border border-white/10 bg-white/5 shadow-2xl shadow-black/30">
              <div className="aspect-4/5.5 bg-slate-900">
                <Image src={background} alt="Spicebomb product display" className="h-full w-full object-cover" fill />
              </div>
              <div className="space-y-2 p-8">
                <p className="text-sm uppercase tracking-[0.3em] text-slate-300">Edición especial</p>
                <h2 className="text-3xl font-semibold text-white">SPICEBOMB</h2>
                <p className="text-slate-400">Diseño premium para el hombre moderno que busca algo único.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="mb-10 text-center">
            <p className="text-sm uppercase tracking-[0.35em] text-red-400">Productos destacados</p>
            <p className="mx-auto mt-3 max-w-2xl text-base text-slate-400">
              Explora nuestra colección premium con productos especialmente elegidos para complementar tu estilo de vida.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {getAllProducts.map((product) => (
              <div key={product.id} className="flex justify-center">
                <div className="w-full max-w-xs">
                  <CardComponent {...product} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

 

      <div className="h-12" />
    </main>
  );
}
