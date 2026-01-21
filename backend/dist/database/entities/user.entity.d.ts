import { BaseEntity } from '../../common/entities/baseEntity';
import { Role } from '../../common/enums';
import { Order } from './order.entity';
import { Cart } from './cart.entity';
import { Review } from './review.entity';
import { Wishlist } from './wishlist.entity';
import { Address } from './address.entity';
export declare class User extends BaseEntity {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    role: Role;
    isActive: boolean;
    orders: Order[];
    cart: Cart;
    reviews: Review[];
    wishlists: Wishlist[];
    addresses: Address[];
}
