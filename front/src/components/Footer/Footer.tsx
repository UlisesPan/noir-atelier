const Footer = () => {
  return (
    <footer className="bg-[#070707] text-slate-300">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-4">
          <div className="space-y-4">
            <h3 className="text-2xl font-semibold text-white">Milano</h3>
            <p className="max-w-sm text-sm leading-6 text-slate-400">
              Misión: Ofrecer lo mejor en lujo y tecnología para el hombre moderno. Calidad y exclusividad garantizadas.
            </p>
          </div>

          <div>
            <h4 className="mb-4 text-sm font-semibold uppercase tracking-[0.2em] text-slate-400">Navegación</h4>
            <ul className="space-y-3 text-sm text-slate-300">
              <li className="cursor-pointer transition hover:text-white">Tienda</li>
              <li className="cursor-pointer transition hover:text-white">Hombre</li>
              <li className="cursor-pointer transition hover:text-white">Tecnología</li>
              <li className="cursor-pointer transition hover:text-white">FAQ</li>
            </ul>
          </div>

          <div>
            <h4 className="mb-4 text-sm font-semibold uppercase tracking-[0.2em] text-slate-400">Atención al cliente</h4>
            <ul className="space-y-3 text-sm text-slate-300">
              <li className="cursor-pointer transition hover:text-white">Contacto</li>
              <li className="cursor-pointer transition hover:text-white">Envíos</li>
              <li className="cursor-pointer transition hover:text-white">Devoluciones</li>
            </ul>
          </div>

          <div>
            <h4 className="mb-4 text-sm font-semibold uppercase tracking-[0.2em] text-slate-400">Boletín</h4>
            <p className="mb-5 text-sm text-slate-400">Recibí novedades exclusivas y ofertas antes que nadie.</p>
            <div className="flex flex-col gap-3 sm:flex-row">
              <input
                type="email"
                placeholder="Email"
                className="min-w-0 flex-1 rounded-full border border-slate-700 bg-slate-900/90 px-4 py-3 text-sm text-white outline-none transition focus:border-red-600"
              />
              <button className="inline-flex items-center justify-center rounded-full bg-red-600 px-5 py-3 text-sm font-semibold uppercase tracking-[0.18em] text-white transition hover:bg-red-700 cursor-pointer">
                Suscribir
              </button>
            </div>
            <div className="mt-6 flex items-center gap-3 text-slate-400">
              <span className="cursor-pointer transition hover:text-white">Instagram</span>
              <span className="cursor-pointer transition hover:text-white">Facebook</span>
              <span className="cursor-pointer transition hover:text-white">Twitter</span>
              <span className="cursor-pointer transition hover:text-white">LinkedIn</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
