import { Entity, Column, ManyToOne, JoinColumn, Unique, Index } from 'typeorm';
import { BaseEntity } from '../../common/entities/baseEntity';
import { User } from './user.entity';
import { Book } from './book.entity';

@Entity('wishlists')
@Unique(['userId', 'bookId'])
export class Wishlist extends BaseEntity {
  @Column({ name: 'user_id' })
  @Index()
  userId: string;

  @Column({ name: 'book_id' })
  @Index()
  bookId: string;

  // Relations
  @ManyToOne(() => User, (user) => user.wishlists, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @ManyToOne(() => Book, (book) => book.wishlists, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'book_id' })
  book: Book;
}
