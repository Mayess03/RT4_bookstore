import { BaseEntity } from '../../common/entities/baseEntity';
import { User } from './user.entity';
import { Book } from './book.entity';
export declare class Review extends BaseEntity {
    userId: string;
    bookId: string;
    rating: number;
    comment: string;
    user: User;
    book: Book;
}
