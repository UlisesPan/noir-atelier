import { Column, Entity, Index, ManyToOne, OneToMany } from 'typeorm';
import { BaseEntity } from '../../../common/base.entity';
import { numericTransformer } from '../../../common/numeric.transformer';
import { User } from '../../users/user.entity';
import { OrderItem } from './order-item.entity';

export enum OrderStatus {
  PENDING = 'pending',
  PAID = 'paid',
  SHIPPED = 'shipped',
  DELIVERED = 'delivered',
  CANCELLED = 'cancelled',
}

@Entity('orders')
export class Order extends BaseEntity {
  @Index()
  @Column({ type: 'enum', enum: OrderStatus, default: OrderStatus.PENDING })
  status: OrderStatus;

  @Column({ type: 'numeric', precision: 12, scale: 2, transformer: numericTransformer })
  total: number;

  @Column({ length: 160 })
  shippingAddress: string;

  @Column({ type: 'varchar', nullable: true })
  paymentId: string | null;

  @Column({ type: 'varchar', nullable: true })
  paymentPreferenceId: string | null;

  @Column({ type: 'timestamptz', nullable: true })
  paidAt: Date | null;

  @Index()
  @Column()
  userId: number;

  @ManyToOne(() => User, (u) => u.orders, { onDelete: 'CASCADE' })
  user: User;

  @OneToMany(() => OrderItem, (item) => item.order, { cascade: true })
  items: OrderItem[];
}
