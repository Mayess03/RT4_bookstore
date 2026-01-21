import { BaseEntity } from '../../common/entities/baseEntity';
import { Category } from './category.entity';
import { OrderItem } from './order-item.entity';
import { CartItem } from './cart-item.entity';
import { Review } from './review.entity';
import { Wishlist } from './wishlist.entity';
export declare class Book extends BaseEntity {
    title: string;
    author: string;
    isbn: string;
    price: number;
    stock: number;
    coverImage: string;
    description: string;
    isActive: boolean;
    categoryId: string;
    category: Category;
    orderItems: OrderItem[];
    cartItems: CartItem[];
    reviews: Review[];
    wishlists: Wishlist[];
}
