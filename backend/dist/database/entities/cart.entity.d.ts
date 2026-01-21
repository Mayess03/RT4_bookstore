import { BaseEntity } from '../../common/entities/baseEntity';
import { User } from './user.entity';
import { CartItem } from './cart-item.entity';
export declare class Cart extends BaseEntity {
    userId: string;
    user: User;
    items: CartItem[];
}
