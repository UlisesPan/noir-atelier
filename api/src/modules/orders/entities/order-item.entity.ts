import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { numericTransformer } from '../../../common/numeric.transformer';
import { Product } from '../../products/product.entity';
import { Order } from './order.entity';

/** Guarda nombre y precio al momento de la compra: el historial no cambia si se edita el producto. */
@Entity('order_items')
export class OrderItem {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  orderId: number;

  @ManyToOne(() => Order, (o) => o.items, { onDelete: 'CASCADE' })
  order: Order;

  @Column({ type: 'int', nullable: true })
  productId: number | null;

  @ManyToOne(() => Product, { onDelete: 'SET NULL', nullable: true })
  product: Product | null;

  @Column({ length: 120 })
  productName: string;

  @Column()
  productImage: string;

  @Column({ type: 'numeric', precision: 12, scale: 2, transformer: numericTransformer })
  unitPrice: number;

  @Column({ type: 'int' })
  quantity: number;
}
