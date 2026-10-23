import { Check, Column, Entity, Index, ManyToOne } from 'typeorm';
import { BaseEntity } from '../../common/base.entity';
import { numericTransformer } from '../../common/numeric.transformer';
import { Category } from '../categories/category.entity';

export enum Gender {
  MASCULINE = 'masculine',
  FEMININE = 'feminine',
  UNISEX = 'unisex',
}

export interface ScentNotes {
  top: string[];
  heart: string[];
  base: string[];
}

@Entity('products')
@Check('"stock" >= 0')
@Check('"price" >= 0')
export class Product extends BaseEntity {
  @Column({ length: 120 })
  name: string;

  @Index({ unique: true })
  @Column({ length: 140 })
  slug: string;

  @Column({ type: 'text' })
  description: string;

  /** Notas olfativas: salida, corazón y fondo. */
  @Column({ type: 'jsonb', default: { top: [], heart: [], base: [] } })
  notes: ScentNotes;

  @Column({ type: 'numeric', precision: 12, scale: 2, transformer: numericTransformer })
  price: number;

  /** Precio "antes" para mostrar descuentos. */
  @Column({ type: 'numeric', precision: 12, scale: 2, nullable: true, transformer: numericTransformer })
  compareAtPrice: number | null;

  @Column({ type: 'int', default: 0 })
  stock: number;

  @Column({ type: 'int', default: 100 })
  volumeMl: number;

  @Column({ type: 'enum', enum: Gender, default: Gender.UNISEX })
  gender: Gender;

  @Column()
  image: string;

  @Column({ default: false })
  featured: boolean;

  @Column({ default: true })
  active: boolean;

  /** Denormalizado para ordenar/filtrar sin agregar reseñas en cada listado. */
  @Column({ type: 'numeric', precision: 3, scale: 2, default: 0, transformer: numericTransformer })
  ratingAvg: number;

  @Column({ type: 'int', default: 0 })
  ratingCount: number;

  @Index()
  @Column()
  categoryId: number;

  @ManyToOne(() => Category, (c) => c.products, { onDelete: 'RESTRICT' })
  category: Category;
}
