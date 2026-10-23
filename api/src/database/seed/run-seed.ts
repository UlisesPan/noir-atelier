import * as bcrypt from 'bcrypt';
import { slugify } from '../../common/slugify';
import { Category } from '../../modules/categories/category.entity';
import { Product } from '../../modules/products/product.entity';
import { Role, User } from '../../modules/users/user.entity';
import dataSource from '../data-source';
import { seedDemoData } from './demo-data';
import { categories, products } from './seed-data';

/** Idempotente: se puede correr varias veces sin duplicar datos ni pisar cambios de stock. */
async function seed() {
  await dataSource.initialize();

  await dataSource.getRepository(Category).upsert(categories, ['slug']);
  const categoryIds = new Map(
    (await dataSource.getRepository(Category).find()).map((c) => [c.slug, c.id] as const),
  );

  const productRepo = dataSource.getRepository(Product);
  let created = 0;
  for (const { category, ...data } of products) {
    const slug = slugify(data.name);
    if (await productRepo.exists({ where: { slug } })) continue;
    await productRepo.save(productRepo.create({ ...data, slug, categoryId: categoryIds.get(category)! }));
    created++;
  }

  const userRepo = dataSource.getRepository(User);
  const adminEmail = process.env.ADMIN_EMAIL ?? 'admin@noiratelier.dev';
  const adminPassword = process.env.ADMIN_PASSWORD;
  if (adminPassword && !(await userRepo.exists({ where: { email: adminEmail } }))) {
    await userRepo.save(
      userRepo.create({
        name: 'Admin Noir',
        email: adminEmail,
        passwordHash: await bcrypt.hash(adminPassword, 12),
        address: 'Av. Corrientes 1234, CABA',
        phone: '+54 11 5555-0000',
        role: Role.ADMIN,
      }),
    );
    console.log(`Admin creado: ${adminEmail}`);
  } else if (!adminPassword) {
    console.warn('ADMIN_PASSWORD no definido: se omite la creación del admin');
  }

  console.log(`Seed listo: ${categories.length} categorías, ${created} productos nuevos`);

  if (process.env.SEED_DEMO_DATA === 'true') await seedDemoData(dataSource);
  await dataSource.destroy();
}

seed().catch((error) => {
  console.error(error);
  process.exit(1);
});
