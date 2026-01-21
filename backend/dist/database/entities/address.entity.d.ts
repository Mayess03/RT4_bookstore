import { BaseEntity } from '../../common/entities/baseEntity';
import { User } from './user.entity';
export declare class Address extends BaseEntity {
    userId: string;
    street: string;
    city: string;
    zipCode: string;
    country: string;
    isDefault: boolean;
    user: User;
}
