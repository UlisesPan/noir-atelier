import { BadRequestException, ConflictException } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { Product } from '../products/product.entity';
import { User } from '../users/user.entity';
import { Order, OrderStatus } from './entities/order.entity';
import { OrdersService } from './orders.service';

const product = (overrides: Partial<Product>): Product =>
  ({ id: 1, name: 'Obsidiana', price: 100, stock: 5, image: 'img', ...overrides }) as Product;

/** EntityManager falso que simula la transacción en memoria. */
const buildService = (products: Product[], order?: Partial<Order>) => {
  const saved: unknown[] = [];
  const manager = {
    findOneByOrFail: jest.fn().mockResolvedValue({ id: 7, address: 'Calle 1' } as User),
    find: jest.fn().mockResolvedValue(products),
    findOne: jest.fn().mockResolvedValue(order),
    create: jest.fn((_: unknown, data: object) => ({ ...data })),
    save: jest.fn(async (entity: any) => {
      saved.push(entity);
      return Array.isArray(entity) ? entity : { id: 99, ...entity };
    }),
    increment: jest.fn(),
  };
  const dataSource = { transaction: (cb: (m: typeof manager) => unknown) => cb(manager) } as unknown as DataSource;
  const repo = { findOne: jest.fn().mockResolvedValue({ id: 99 }) } as unknown as Repository<Order>;
  return { service: new OrdersService(repo, dataSource), manager, saved };
};

describe('OrdersService.create', () => {
  it('descuenta stock y calcula el total con el precio actual', async () => {
    const p1 = product({ id: 1, price: 100.5, stock: 5 });
    const p2 = product({ id: 2, price: 20, stock: 3 });
    const { service, saved } = buildService([p1, p2]);

    await service.create(7, { items: [{ productId: 1, quantity: 2 }, { productId: 2, quantity: 1 }] });

    expect(p1.stock).toBe(3);
    expect(p2.stock).toBe(2);
    const order = saved.find((e: any) => e.total !== undefined) as Order;
    expect(order.total).toBe(221);
    expect(order.shippingAddress).toBe('Calle 1');
  });

  it('agrupa ítems repetidos antes de validar stock', async () => {
    const { service } = buildService([product({ stock: 3 })]);
    await expect(
      service.create(7, { items: [{ productId: 1, quantity: 2 }, { productId: 1, quantity: 2 }] }),
    ).rejects.toBeInstanceOf(ConflictException);
  });

  it('rechaza productos inexistentes o inactivos', async () => {
    const { service } = buildService([]);
    await expect(service.create(7, { items: [{ productId: 1, quantity: 1 }] })).rejects.toBeInstanceOf(
      BadRequestException,
    );
  });
});

describe('OrdersService.updateStatus', () => {
  it('devuelve el stock al cancelar', async () => {
    const order = { id: 1, status: OrderStatus.PENDING, items: [{ productId: 1, quantity: 2 }] } as Order;
    const { service, manager } = buildService([], order);
    await service.updateStatus(1, OrderStatus.CANCELLED);
    expect(manager.increment).toHaveBeenCalledWith(Product, { id: 1 }, 'stock', 2);
  });

  it('impide transiciones inválidas', async () => {
    const order = { id: 1, status: OrderStatus.DELIVERED, items: [] } as unknown as Order;
    const { service } = buildService([], order);
    await expect(service.updateStatus(1, OrderStatus.PENDING)).rejects.toBeInstanceOf(BadRequestException);
  });
});
