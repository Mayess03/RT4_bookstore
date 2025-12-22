import { Entity, Column, ManyToOne, JoinColumn, Unique, Index } from 'typeorm';
import { BaseEntity } from '../../common/entities/baseEntity';
import { Cart } from './cart.entity';
import { Book } from './book.entity';

@Entity('cart_items')
@Unique(['cartId', 'bookId'])
export class CartItem extends BaseEntity {
  @Column({ name: 'cart_id' })
  @Index()
  cartId: string;

  @Column({ name: 'book_id' })
  @Index()
  bookId: string;

  @Column()
  quantity: number;

  // Relations
  @ManyToOne(() => Cart, (cart) => cart.items, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'cart_id' })
  cart: Cart;

  @ManyToOne(() => Book, (book) => book.cartItems, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'book_id' })
  book: Book;
}
