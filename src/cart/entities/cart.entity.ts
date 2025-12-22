import { Entity, Column, OneToOne, OneToMany, JoinColumn } from 'typeorm';
// import { User } from './user.entity';
import { CartItem } from '../../cart-item/entities/cart-item.entity';
import { BaseEntity } from '../../common/entities/baseEntity';

@Entity('carts')
export class Cart extends BaseEntity {
  // Relations
  @Column({ name: 'user_id', unique: true })
  userId: string;

  //   @OneToOne(() => User, (user) => user.cart, { onDelete: 'CASCADE' })
  //   @JoinColumn({ name: 'user_id' })
  //   user: User;

  @OneToMany(() => CartItem, (cartItem) => cartItem.cart, { cascade: true })
  items: CartItem[];
}
