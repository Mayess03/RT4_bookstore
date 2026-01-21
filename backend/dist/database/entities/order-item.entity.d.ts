import { BaseEntity } from '../../common/entities/baseEntity';
import { Order } from './order.entity';
import { Book } from './book.entity';
export declare class OrderItem extends BaseEntity {
    orderId: string;
    bookId: string;
    quantity: number;
    unitPrice: number;
    subtotal: number;
    order: Order;
    book: Book;
}
