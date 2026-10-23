import { CreateDateColumn, Entity, ManyToOne, PrimaryColumn } from 'typeorm';
import { Product } from '../products/product.entity';
import { User } from '../users/user.entity';

@Entity('wishlist_items')
export class WishlistItem {
  @PrimaryColumn()
  userId: number;

  @PrimaryColumn()
  productId: number;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  user: User;

  @ManyToOne(() => Product, { onDelete: 'CASCADE' })
  product: Product;

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;
}
