import {
  Entity,
  Column,
  OneToMany,
} from 'typeorm';
import { BaseEntity } from '../../common/entities/baseEntity';
import { OrderItem } from './order-item.entity';
import { OrderStatus } from './order-status.enum';

@Entity('orders')
export class Order extends BaseEntity {
  @Column()
  userId: number;

  @Column('decimal', { precision: 10, scale: 2 })
  totalPrice: number;

  @Column({
    type: 'enum',
    enum: OrderStatus,
    default: OrderStatus.PENDING,
  })
  status: OrderStatus;

  @Column()
  shippingAddress: string;

  @OneToMany(() => OrderItem, (item) => item.order, {
    cascade: true,
  })
  items: OrderItem[];
}
