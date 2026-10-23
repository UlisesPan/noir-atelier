import { BadRequestException, ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { DataSource, EntityManager, In, Repository } from 'typeorm';
import { paginate } from '../../common/dto/pagination.dto';
import { Product } from '../products/product.entity';
import { User } from '../users/user.entity';
import { CreateOrderDto, OrderQueryDto } from './dto/order.dto';
import { OrderItem } from './entities/order-item.entity';
import { Order, OrderStatus } from './entities/order.entity';

/** Transiciones permitidas: evita, por ejemplo, volver una orden entregada a pendiente. */
const TRANSITIONS: Record<OrderStatus, OrderStatus[]> = {
  [OrderStatus.PENDING]: [OrderStatus.PAID, OrderStatus.CANCELLED],
  [OrderStatus.PAID]: [OrderStatus.SHIPPED, OrderStatus.CANCELLED],
  [OrderStatus.SHIPPED]: [OrderStatus.DELIVERED],
  [OrderStatus.DELIVERED]: [],
  [OrderStatus.CANCELLED]: [],
};

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order) private readonly orders: Repository<Order>,
    @InjectDataSource() private readonly dataSource: DataSource,
  ) {}

  /**
   * Crea la orden y reserva stock en una única transacción.
   * El lock pesimista evita vender dos veces la última unidad ante compras concurrentes.
   */
  async create(userId: number, dto: CreateOrderDto) {
    const quantities = new Map<number, number>();
    for (const { productId, quantity } of dto.items) {
      quantities.set(productId, (quantities.get(productId) ?? 0) + quantity);
    }

    const orderId = await this.dataSource.transaction(async (manager) => {
      const user = await manager.findOneByOrFail(User, { id: userId });
      const products = await manager.find(Product, {
        where: { id: In([...quantities.keys()]), active: true },
        lock: { mode: 'pessimistic_write' },
        order: { id: 'ASC' },
      });
      if (products.length !== quantities.size) {
        throw new BadRequestException('Uno o más productos no existen o no están disponibles');
      }

      const items = products.map((product) => {
        const quantity = quantities.get(product.id)!;
        if (product.stock < quantity) {
          throw new ConflictException(`Stock insuficiente para "${product.name}" (disponible: ${product.stock})`);
        }
        product.stock -= quantity;
        return manager.create(OrderItem, {
          productId: product.id,
          productName: product.name,
          productImage: product.image,
          unitPrice: product.price,
          quantity,
        });
      });
      await manager.save(products);

      const total = items.reduce((sum, i) => sum + i.unitPrice * i.quantity, 0);
      const order = await manager.save(
        manager.create(Order, {
          userId,
          items,
          total: Math.round(total * 100) / 100,
          shippingAddress: dto.shippingAddress ?? user.address,
        }),
      );
      return order.id;
    });

    return this.findOne(orderId);
  }

  async findMine(userId: number, query: OrderQueryDto) {
    const [data, total] = await this.orders.findAndCount({
      where: { userId, ...(query.status && { status: query.status }) },
      relations: { items: true },
      order: { createdAt: 'DESC' },
      skip: (query.page - 1) * query.limit,
      take: query.limit,
    });
    return paginate(data, total, query);
  }

  async findAll(query: OrderQueryDto) {
    const [data, total] = await this.orders.findAndCount({
      where: query.status && { status: query.status },
      relations: { items: true, user: true },
      order: { createdAt: 'DESC' },
      skip: (query.page - 1) * query.limit,
      take: query.limit,
    });
    return paginate(data, total, query);
  }

  /** Si se pasa `userId`, solo devuelve la orden si le pertenece. */
  async findOne(id: number, userId?: number) {
    const order = await this.orders.findOne({
      where: { id, ...(userId !== undefined && { userId }) },
      relations: { items: true },
    });
    if (!order) throw new NotFoundException('Orden no encontrada');
    return order;
  }

  async updateStatus(id: number, status: OrderStatus, extra: Partial<Order> = {}) {
    return this.dataSource.transaction(async (manager) => {
      const order = await manager.findOne(Order, {
        where: { id },
        relations: { items: true },
        lock: { mode: 'pessimistic_write', tables: ['orders'] },
      });
      if (!order) throw new NotFoundException('Orden no encontrada');
      if (order.status === status) return manager.save(Object.assign(order, extra));
      if (!TRANSITIONS[order.status].includes(status)) {
        throw new BadRequestException(`No se puede pasar de "${order.status}" a "${status}"`);
      }

      if (status === OrderStatus.CANCELLED) await this.restock(manager, order);
      if (status === OrderStatus.PAID) order.paidAt = new Date();
      Object.assign(order, extra, { status });
      return manager.save(order);
    });
  }

  async cancelMine(id: number, userId: number) {
    const order = await this.findOne(id, userId);
    if (order.status !== OrderStatus.PENDING) {
      throw new BadRequestException('Solo se pueden cancelar órdenes pendientes de pago');
    }
    return this.updateStatus(id, OrderStatus.CANCELLED);
  }

  private async restock(manager: EntityManager, order: Order) {
    for (const item of order.items) {
      if (item.productId) await manager.increment(Product, { id: item.productId }, 'stock', item.quantity);
    }
  }
}
