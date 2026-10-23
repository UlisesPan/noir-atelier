import { randomBytes } from 'crypto';
import * as bcrypt from 'bcrypt';
import { DataSource } from 'typeorm';
import { OrderItem } from '../../modules/orders/entities/order-item.entity';
import { Order, OrderStatus } from '../../modules/orders/entities/order.entity';
import { Product } from '../../modules/products/product.entity';
import { Review } from '../../modules/reviews/review.entity';
import { Role, User } from '../../modules/users/user.entity';

const DEMO_DOMAIN = 'demo.noiratelier.dev';

const CUSTOMERS = [
  ['Valentina Ríos', 'Palermo, CABA'],
  ['Martín Sosa', 'Nueva Córdoba, Córdoba'],
  ['Camila Herrera', 'Centro, Rosario'],
  ['Joaquín Pereyra', 'Godoy Cruz, Mendoza'],
  ['Sofía Medina', 'La Plata, Buenos Aires'],
  ['Tomás Aguirre', 'Belgrano, CABA'],
  ['Florencia Díaz', 'San Isidro, Buenos Aires'],
  ['Lucas Romero', 'Yerba Buena, Tucumán'],
];

const COMMENTS: Record<number, string[]> = {
  5: [
    'Increíble fijación, me dura todo el día y recibo cumplidos cada vez que lo uso.',
    'Mi nuevo favorito. La salida es preciosa y el fondo es súper elegante.',
    'Lo compré para regalar y terminé comprando otro para mí.',
    'Huele mucho más caro de lo que cuesta. Excelente presentación.',
  ],
  4: [
    'Muy lindo, aunque la proyección es más suave de lo que esperaba.',
    'Gran perfume para el día a día. Le pondría 5 si durara un poco más.',
    'Elegante y versátil. El envío llegó rapidísimo.',
  ],
  3: ['Está bien, pero en mi piel se vuelve un poco dulce después de unas horas.'],
};

/** Generador pseudoaleatorio determinístico: los datos demo salen iguales en cada entorno. */
const rng = (seed: number) => () => {
  seed = (seed * 1664525 + 1013904223) % 4294967296;
  return seed / 4294967296;
};

/**
 * Datos de demostración para que el dashboard y las reseñas no aparezcan vacíos en el portfolio.
 * Las cuentas demo tienen contraseñas aleatorias (no se puede iniciar sesión con ellas) y las órdenes
 * son históricas, así que no descuentan stock.
 */
export async function seedDemoData(db: DataSource) {
  const users = db.getRepository(User);
  if (await users.exists({ where: { email: `valentina.rios@${DEMO_DOMAIN}` } })) {
    console.log('Datos demo ya cargados');
    return;
  }

  const random = rng(42);
  const pick = <T>(list: T[]) => list[Math.floor(random() * list.length)];
  const products = await db.getRepository(Product).find({ where: { active: true } });

  const customers = await users.save(
    await Promise.all(
      CUSTOMERS.map(async ([name, city]) =>
        users.create({
          name,
          email: `${name.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(' ', '.')}@${DEMO_DOMAIN}`,
          passwordHash: await bcrypt.hash(randomBytes(24).toString('hex'), 10),
          address: `Calle ${100 + Math.floor(random() * 900)}, ${city}`,
          phone: `+54 11 ${4000 + Math.floor(random() * 5000)}-${1000 + Math.floor(random() * 8999)}`,
          role: Role.USER,
        }),
      ),
    ),
  );

  // ~60 órdenes en los últimos 30 días; las más viejas ya entregadas, las recientes en curso.
  const orders: Order[] = [];
  for (let i = 0; i < 60; i++) {
    const daysAgo = Math.floor(random() * 30);
    const createdAt = new Date(Date.now() - daysAgo * 86_400_000 - Math.floor(random() * 86_400_000));
    const lines = new Map<number, OrderItem>();
    const count = 1 + Math.floor(random() * 3);
    for (let j = 0; j < count; j++) {
      const product = random() < 0.35 ? pick(products.filter((p) => p.featured)) : pick(products);
      const existing = lines.get(product.id);
      if (existing) existing.quantity++;
      else
        lines.set(
          product.id,
          db.getRepository(OrderItem).create({
            productId: product.id,
            productName: product.name,
            productImage: product.image,
            unitPrice: product.price,
            quantity: 1,
          }),
        );
    }
    const items = [...lines.values()];
    const roll = random();
    const status =
      roll < 0.06
        ? OrderStatus.CANCELLED
        : daysAgo > 7
          ? OrderStatus.DELIVERED
          : daysAgo > 2
            ? OrderStatus.SHIPPED
            : roll < 0.2
              ? OrderStatus.PENDING
              : OrderStatus.PAID;
    const customer = pick(customers);
    orders.push(
      db.getRepository(Order).create({
        userId: customer.id,
        items,
        status,
        total: items.reduce((s, it) => s + it.unitPrice * it.quantity, 0),
        shippingAddress: customer.address,
        paymentId: status === OrderStatus.PENDING || status === OrderStatus.CANCELLED ? null : `DEMO-${1000 + i}`,
        paidAt: status === OrderStatus.PENDING || status === OrderStatus.CANCELLED ? null : createdAt,
        createdAt,
      }),
    );
  }
  await db.getRepository(Order).save(orders);

  // Reseñas: 1 a 4 por producto, de clientes demo distintos.
  const reviews = db.getRepository(Review);
  for (const product of products) {
    const authors = [...customers].sort(() => random() - 0.5).slice(0, 1 + Math.floor(random() * 4));
    for (const author of authors) {
      const rating = random() < 0.6 ? 5 : random() < 0.85 ? 4 : 3;
      await reviews.save(
        reviews.create({ userId: author.id, productId: product.id, rating, comment: pick(COMMENTS[rating]) }),
      );
    }
  }
  await db.query(`
    UPDATE products p SET "ratingAvg" = r.avg, "ratingCount" = r.count
    FROM (SELECT "productId", ROUND(AVG(rating)::numeric, 2) AS avg, COUNT(*) AS count FROM reviews GROUP BY "productId") r
    WHERE r."productId" = p.id`);

  console.log(`Datos demo: ${customers.length} clientes, ${orders.length} órdenes y reseñas`);
}
