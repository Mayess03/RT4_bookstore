import { BaseEntity } from '../../common/entities/baseEntity';
import { OrderStatus } from '../../common/enums';
import { User } from './user.entity';
import { OrderItem } from './order-item.entity';
export declare class Order extends BaseEntity {
    userId: string;
    totalPrice: number;
    status: OrderStatus;
    shippingAddress: string;
    shippingCity: string;
    shippingZipCode: string;
    phone: string;
    user: User;
    items: OrderItem[];
}
