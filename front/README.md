# Noir Atelier — Front

Tienda y panel de administración en Next.js 16. Ver el [README principal](../README.md) para la arquitectura completa.

## Scripts

| Script | Descripción |
| --- | --- |
| `npm run dev` | Servidor de desarrollo en `http://localhost:3000` |
| `npm run build` / `npm start` | Build y servidor de producción |
| `npm run lint` | ESLint |
| `node scripts/generate-bottles.mjs` | Regenera las ilustraciones SVG de `public/products` |

## Variables de entorno

| Variable | Descripción |
| --- | --- |
| `API_URL` | URL de la API NestJS. Solo se usa del lado del servidor. |
| `NEXT_PUBLIC_SITE_URL` | URL pública del sitio (metadata, sitemap y robots). |

## Estructura

```
src/
├─ app/
│  ├─ (store)/        tienda: home, shop, producto, carrito, checkout, cuenta
│  ├─ admin/          panel de administración
│  ├─ api/auth/       login/registro/logout → cookie httpOnly
│  └─ api/proxy/      BFF: reenvía a la API agregando el JWT
├─ components/        UI por dominio (product, cart, checkout, admin, ui…)
├─ hooks/             sesión y wishlist (TanStack Query)
├─ lib/               clientes HTTP, tipos, esquemas Zod y utilidades
├─ store/             carrito (Zustand + localStorage)
└─ proxy.ts           protección optimista de rutas privadas
```
