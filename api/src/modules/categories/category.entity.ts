import { Column, Entity, OneToMany } from 'typeorm';
import { BaseEntity } from '../../common/base.entity';
import { Product } from '../products/product.entity';

@Entity('categories')
export class Category extends BaseEntity {
  @Column({ unique: true, length: 60 })
  name: string;

  @Column({ unique: true, length: 80 })
  slug: string;

  @Column({ type: 'text', default: '' })
  description: string;

  @OneToMany(() => Product, (product) => product.category)
  products: Product[];
}
