import { BaseEntity } from '../../common/entities/baseEntity';
import { Cart } from './cart.entity';
import { Book } from './book.entity';
export declare class CartItem extends BaseEntity {
    cartId: string;
    bookId: string;
    quantity: number;
    cart: Cart;
    book: Book;
}
