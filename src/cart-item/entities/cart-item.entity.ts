import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
  Unique,
} from 'typeorm';
import { Cart } from '../../cart/entities/cart.entity';
import { BaseEntity } from '../../common/entities/baseEntity';
// import { Book } from './book.entity';

@Entity('cart_items')
@Unique(['cartId', 'bookId']) // Un livre une seule fois dans un panier
export class CartItem extends BaseEntity {
  @Column()
  quantity: number;

  // Relations
  @Column({ name: 'cart_id' })
  cartId: string;

  @Column({ name: 'book_id' })
  bookId: string;

  @ManyToOne(() => Cart, (cart) => cart.items, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'cart_id' })
  cart: Cart;

  //   @ManyToOne(() => Book, (book) => book.cartItems, { onDelete: 'CASCADE' })
  //   @JoinColumn({ name: 'book_id' })
  //   book: Book;
}
