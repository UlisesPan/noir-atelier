import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { paginate } from '../../common/dto/pagination.dto';
import { slugify } from '../../common/slugify';
import { Product } from './product.entity';
import { CreateProductDto, ProductQueryDto, ProductSort, UpdateProductDto } from './dto/product.dto';

const SORTS: Record<ProductSort, [string, 'ASC' | 'DESC'][]> = {
  featured: [['p.featured', 'DESC'], ['p.ratingAvg', 'DESC'], ['p.id', 'ASC']],
  newest: [['p.createdAt', 'DESC'], ['p.id', 'DESC']],
  price_asc: [['p.price', 'ASC'], ['p.id', 'ASC']],
  price_desc: [['p.price', 'DESC'], ['p.id', 'ASC']],
  rating: [['p.ratingAvg', 'DESC'], ['p.ratingCount', 'DESC'], ['p.id', 'ASC']],
};

@Injectable()
export class ProductsService {
  constructor(@InjectRepository(Product) private readonly products: Repository<Product>) {}

  async findAll(query: ProductQueryDto, isAdmin = false) {
    const qb = this.products.createQueryBuilder('p').leftJoinAndSelect('p.category', 'c');

    if (!(isAdmin && query.includeInactive)) qb.andWhere('p.active = true');
    if (query.q) {
      qb.andWhere('(p.name ILIKE :q OR p.description ILIKE :q OR p.notes::text ILIKE :q)', {
        q: `%${query.q.replace(/[%_]/g, '\\$&')}%`,
      });
    }
    if (query.category) qb.andWhere('c.slug = :category', { category: query.category });
    if (query.gender) qb.andWhere('p.gender = :gender', { gender: query.gender });
    if (query.minPrice !== undefined) qb.andWhere('p.price >= :minPrice', { minPrice: query.minPrice });
    if (query.maxPrice !== undefined) qb.andWhere('p.price <= :maxPrice', { maxPrice: query.maxPrice });
    if (query.inStock) qb.andWhere('p.stock > 0');
    if (query.featured) qb.andWhere('p.featured = true');

    SORTS[query.sort].forEach(([column, dir], i) => (i === 0 ? qb.orderBy(column, dir) : qb.addOrderBy(column, dir)));

    const [data, total] = await qb
      .skip((query.page - 1) * query.limit)
      .take(query.limit)
      .getManyAndCount();
    return paginate(data, total, query);
  }

  /** Acepta id numérico o slug, así las URLs del front pueden ser legibles. */
  async findOne(idOrSlug: string) {
    const where = /^\d+$/.test(idOrSlug) ? { id: Number(idOrSlug) } : { slug: idOrSlug };
    const product = await this.products.findOne({ where: { ...where, active: true }, relations: { category: true } });
    if (!product) throw new NotFoundException('Producto no encontrado');
    return product;
  }

  /** Para el admin: incluye productos inactivos. */
  async findById(id: number) {
    const product = await this.products.findOne({ where: { id }, relations: { category: true } });
    if (!product) throw new NotFoundException('Producto no encontrado');
    return product;
  }

  async findRelated(idOrSlug: string, limit = 4) {
    const product = await this.findOne(idOrSlug);
    const candidates = await this.products.find({
      where: [
        { active: true, categoryId: product.categoryId },
        { active: true, gender: product.gender },
      ],
      relations: { category: true },
      order: { ratingAvg: 'DESC' },
      take: 24,
    });
    // Prioriza misma categoría y luego mismo género.
    const score = (p: Product) => (p.categoryId === product.categoryId ? 2 : 0) + (p.gender === product.gender ? 1 : 0);
    return candidates
      .filter((p) => p.id !== product.id)
      .sort((a, b) => score(b) - score(a))
      .slice(0, limit);
  }

  async create(dto: CreateProductDto) {
    const product = this.products.create({ ...dto, slug: await this.uniqueSlug(dto.name) });
    return this.products.save(product);
  }

  async update(id: number, dto: UpdateProductDto) {
    const product = await this.products.findOneBy({ id });
    if (!product) throw new NotFoundException('Producto no encontrado');
    if (dto.name && dto.name !== product.name) product.slug = await this.uniqueSlug(dto.name);
    return this.products.save(this.products.merge(product, dto));
  }

  /** Soft delete: los productos con órdenes no se borran, se desactivan. */
  async deactivate(id: number) {
    const result = await this.products.update({ id }, { active: false });
    if (!result.affected) throw new NotFoundException('Producto no encontrado');
  }

  private async uniqueSlug(name: string) {
    const base = slugify(name);
    let slug = base;
    for (let i = 2; await this.products.exists({ where: { slug } }); i++) slug = `${base}-${i}`;
    return slug;
  }
}
