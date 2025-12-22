import { Entity, Column, OneToMany } from 'typeorm';
import { BaseEntity } from '../../common/entities/baseEntity';
import { Book } from './book.entity';

@Entity('categories')
export class Category extends BaseEntity {
  @Column({ unique: true })
  name: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  // Relations
  @OneToMany(() => Book, (book) => book.category)
  books: Book[];
}
