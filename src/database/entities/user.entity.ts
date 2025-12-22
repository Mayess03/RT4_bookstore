import { Entity, Column, OneToMany, OneToOne, Index } from 'typeorm';
import { Exclude } from 'class-transformer';
import { BaseEntity } from '../../common/entities/baseEntity';
import { Role } from '../../common/enums';
import { Order } from './order.entity';
import { Cart } from './cart.entity';
import { Review } from './review.entity';
import { Wishlist } from './wishlist.entity';
import { Address } from './address.entity';

@Entity('users')
export class User extends BaseEntity {
  @Column({ unique: true })
  @Index()
  email: string;

  @Column()
  @Exclude()
  password: string;

  @Column({ name: 'first_name' })
  firstName: string;

  @Column({ name: 'last_name' })
  lastName: string;

  @Column({
    type: 'enum',
    enum: Role,
    default: Role.USER,
  })
  role: Role;

  @Column({ name: 'is_active', default: true })
  isActive: boolean;

  // Relations
  @OneToMany(() => Order, (order) => order.user, { cascade: true })
  orders: Order[];

  @OneToOne(() => Cart, (cart) => cart.user, { cascade: true })
  cart: Cart;

  @OneToMany(() => Review, (review) => review.user, { cascade: true })
  reviews: Review[];

  @OneToMany(() => Wishlist, (wishlist) => wishlist.user, { cascade: true })
  wishlists: Wishlist[];

  @OneToMany(() => Address, (address) => address.user, { cascade: true })
  addresses: Address[];
}
