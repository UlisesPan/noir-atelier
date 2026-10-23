import { Check, Column, Entity, Index, ManyToOne, Unique } from 'typeorm';
import { BaseEntity } from '../../common/base.entity';
import { Product } from '../products/product.entity';
import { User } from '../users/user.entity';

@Entity('reviews')
@Unique(['userId', 'productId'])
@Check('"rating" BETWEEN 1 AND 5')
export class Review extends BaseEntity {
  @Column({ type: 'smallint' })
  rating: number;

  @Column({ type: 'text', default: '' })
  comment: string;

  @Column()
  userId: number;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  user: User;

  @Index()
  @Column()
  productId: number;

  @ManyToOne(() => Product, { onDelete: 'CASCADE' })
  product: Product;
}
