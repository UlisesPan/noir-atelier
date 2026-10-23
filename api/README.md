# Noir Atelier — API

API REST del e-commerce **Noir Atelier**, construida con NestJS 11, TypeORM y PostgreSQL.

## Funcionalidades

- **Auth JWT** con roles (`user` / `admin`), bcrypt y rate limit en login/registro.
- **Catálogo** con búsqueda, filtros (categoría, género, precio, stock), orden y paginación.
- **Órdenes** con ítems y cantidades, precio congelado al comprar y reserva de stock transaccional (lock pesimista).
- **Pagos** con Mercado Pago Checkout Pro (webhook y confirmación al volver), con modo simulado si no hay token.
- **Reseñas** (1 por usuario y producto, rating promedio denormalizado, "compra verificada").
- **Wishlist**.
- **Panel admin**: métricas de ventas, top productos, stock bajo, gestión de órdenes y CRUD de productos/categorías.
- Swagger en `/docs`, health check en `/health`, helmet, CORS restringido y migraciones versionadas.

## Desarrollo local

```bash
cp .env.example .env   # completar DB_PASSWORD, JWT_SECRET y ADMIN_PASSWORD
npm install
npm run migration:run
npm run seed
npm run start:dev
```

| Script | Descripción |
| --- | --- |
| `npm run migration:generate` | Genera una migración a partir de cambios en las entidades |
| `npm run migration:run` | Aplica migraciones pendientes |
| `npm run seed` | Carga categorías, productos y el usuario admin (idempotente) |
| `npm test` | Tests unitarios |

## Pagos

- Sin `MP_ACCESS_TOKEN`: `POST /payments/checkout/:orderId` devuelve una URL del front para simular el pago.
- Con un access token **de prueba** de Mercado Pago: se crea una preferencia de Checkout Pro. Usá las
  [tarjetas de prueba](https://www.mercadopago.com.ar/developers/es/docs/checkout-pro/additional-content/your-integrations/test/cards)
  para completar el pago. En producción configurá `API_PUBLIC_URL` para recibir el webhook.

## Deploy (Render + Neon)

1. Crear una base en [Neon](https://neon.tech) y copiar la connection string.
2. En Render, **New → Blueprint** apuntando a este repo (usa `render.yaml`).
3. Completar `DATABASE_URL`, `CORS_ORIGINS`/`FRONTEND_URL` (URL de Vercel), `API_PUBLIC_URL` y `ADMIN_PASSWORD`.
