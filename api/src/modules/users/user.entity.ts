import { Column, Entity, OneToMany } from 'typeorm';
import { BaseEntity } from '../../common/base.entity';
import { Order } from '../orders/entities/order.entity';

export enum Role {
  USER = 'user',
  ADMIN = 'admin',
}

@Entity('users')
export class User extends BaseEntity {
  @Column({ length: 80 })
  name: string;

  @Column({ unique: true, length: 120 })
  email: string;

  /** Nunca se selecciona por defecto: solo se pide explícitamente en el login. */
  @Column({ select: false })
  passwordHash: string;

  @Column({ length: 160 })
  address: string;

  @Column({ length: 30 })
  phone: string;

  @Column({ type: 'enum', enum: Role, default: Role.USER })
  role: Role;

  @OneToMany(() => Order, (order) => order.user)
  orders: Order[];
}
