# Noir Atelier — E-commerce de perfumería de autor

E-commerce full stack de una perfumería ficticia: catálogo con filtros, carrito, checkout con Mercado Pago,
reseñas, wishlist y panel de administración con métricas.

> Proyecto de portfolio. Nació como el proyecto integrador del Módulo 4 de Henry y luego se reescribió
> por completo con foco en arquitectura, seguridad y experiencia de usuario.

| | |
| --- | --- |
| **Front** | Next.js 16 (App Router, Server Components, React Compiler) · Tailwind CSS 4 · TanStack Query · Zustand · React Hook Form + Zod · Recharts |
| **API** | NestJS 11 · TypeORM · PostgreSQL · JWT + Passport · class-validator · Swagger · Jest |
| **Pagos** | Mercado Pago Checkout Pro (sandbox) con modo simulado de respaldo |
| **Deploy** | Vercel (front) · Render (API) · Neon (PostgreSQL) |

## Funcionalidades

**Tienda**
- Catálogo con búsqueda por nombre/notas, filtros por familia olfativa, género, precio y stock, orden y paginación (todo sincronizado en la URL).
- Ficha de producto con pirámide olfativa, productos relacionados, datos estructurados (JSON-LD) y metadata SEO.
- Carrito persistente con cantidades (funciona sin sesión), drawer lateral y meter de envío gratis.
- Checkout que reserva stock y redirige a Mercado Pago; reintento y cancelación de pagos pendientes.
- Reseñas con puntuación, distribución de estrellas y sello de **compra verificada**.
- Wishlist con actualización optimista.
- Cuenta de usuario: perfil editable, historial y detalle de pedidos con línea de tiempo.

**Administración** (`/admin`)
- Dashboard con ingresos, ticket promedio, ventas de los últimos 30 días, más vendidos y alertas de stock bajo.
- CRUD de productos (con vista previa) y categorías; ocultar/mostrar productos.
- Gestión de pedidos con transiciones de estado validadas (pendiente → pagado → enviado → entregado).

## Arquitectura

```
Navegador ──► Next.js (Vercel)
               ├─ Server Components ──────────────► API NestJS (Render) ──► PostgreSQL (Neon)
               └─ /api/proxy/* (BFF) ─ agrega JWT ─►        │
                  /api/auth/*  ─ cookie httpOnly            └──► Mercado Pago (preferencias + webhook)
```

Decisiones destacadas:

- **BFF con cookie httpOnly.** El JWT nunca llega al JavaScript del navegador: Next lo guarda en una cookie
  httpOnly y lo agrega al reenviar las requests a la API. Un XSS no puede robar la sesión.
- **Stock transaccional.** Crear una orden bloquea las filas de producto (`SELECT … FOR UPDATE`), valida
  stock, congela el precio y descuenta unidades en una sola transacción. Cancelar devuelve el stock.
- **Pagos verificados.** El estado de un pago nunca se toma de la URL de retorno ni del cuerpo del webhook:
  la API siempre lo consulta a Mercado Pago.
- **Migraciones versionadas** en lugar de `synchronize`, seed idempotente y validación de variables de entorno al arrancar.
- **Caché por tags.** El catálogo se cachea (ISR) y se invalida con `updateTag` cuando el admin edita o alguien deja una reseña.
- **Dirección de arte propia.** Las ilustraciones de los frascos son SVG generados por código
  (`front/scripts/generate-bottles.mjs`), sin depender de fotos de marcas reales.

## Correr en local

Requisitos: Node 22+ y PostgreSQL.

```bash
# 1. API
cd api
cp .env.example .env        # completar DB_PASSWORD, JWT_SECRET y ADMIN_PASSWORD
npm install
npm run migration:run
npm run seed                # SEED_DEMO_DATA=true carga clientes, pedidos y reseñas de ejemplo
npm run start:dev           # http://localhost:3100 · docs en /docs

# 2. Front (en otra terminal)
cd front
cp .env.example .env.local
npm install
npm run dev                 # http://localhost:3000
```

El usuario administrador se crea con `ADMIN_EMAIL` / `ADMIN_PASSWORD` del `.env` de la API.

Sin `MP_ACCESS_TOKEN` la tienda usa una **pasarela simulada** para aprobar o rechazar pagos. Con un access
token de prueba de Mercado Pago se usa Checkout Pro real (sandbox).

## Deploy

1. **Neon:** crear la base y copiar la connection string.
2. **Render:** *New → Blueprint* con este repo (usa [`render.yaml`](render.yaml)). Completar `DATABASE_URL`,
   `ADMIN_PASSWORD`, `CORS_ORIGINS` y `FRONTEND_URL` (URL de Vercel), `API_PUBLIC_URL` y opcionalmente `MP_ACCESS_TOKEN`.
3. **Vercel:** importar el repo con *Root Directory* `front` y definir `API_URL` (URL de Render) y
   `NEXT_PUBLIC_SITE_URL` (URL pública del front).

> En el plan gratuito, Render duerme la API tras un rato sin uso; la primera request puede tardar unos segundos.

## Tests

```bash
cd api && npm test
```
