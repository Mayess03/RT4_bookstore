import { Entity, Column, ManyToOne, OneToMany, JoinColumn, Index } from 'typeorm';
import { BaseEntity } from '../../common/entities/baseEntity';
import { Category } from './category.entity';
import { OrderItem } from './order-item.entity';
import { CartItem } from './cart-item.entity';
import { Review } from './review.entity';
import { Wishlist } from './wishlist.entity';

@Entity('books')
export class Book extends BaseEntity {
  @Column()
  title: string;

  @Column()
  author: string;

  @Column({ unique: true, nullable: true })
  @Index()
  isbn: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  price: number;

  @Column({ default: 0 })
  stock: number;

  @Column({ name: 'cover_image', nullable: true })
  coverImage: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ name: 'is_active', default: true })
  isActive: boolean;

  @Column({ name: 'category_id', nullable: true })
  categoryId: string;

  // Relations
  @ManyToOne(() => Category, (category) => category.books, {
    onDelete: 'SET NULL',
  })
  @JoinColumn({ name: 'category_id' })
  category: Category;

  @OneToMany(() => OrderItem, (orderItem) => orderItem.book)
  orderItems: OrderItem[];

  @OneToMany(() => CartItem, (cartItem) => cartItem.book)
  cartItems: CartItem[];

  @OneToMany(() => Review, (review) => review.book, { cascade: true })
  reviews: Review[];

  @OneToMany(() => Wishlist, (wishlist) => wishlist.book, { cascade: true })
  wishlists: Wishlist[];
}
