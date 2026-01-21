import { BaseEntity } from '../../common/entities/baseEntity';
import { User } from './user.entity';
import { Book } from './book.entity';
export declare class Wishlist extends BaseEntity {
    userId: string;
    bookId: string;
    user: User;
    book: Book;
}
