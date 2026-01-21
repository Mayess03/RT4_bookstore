import { Repository } from 'typeorm';
import { ChangePasswordDto } from './dto/change-password.dto';
import { User } from '../../database/entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { OrdersService } from '../orders/orders.service';
export declare class UsersService {
    private readonly userRepository;
    private readonly ordersService;
    constructor(userRepository: Repository<User>, ordersService: OrdersService);
    findByEmail(email: string): Promise<User | null>;
    findById(id: string): Promise<User | null>;
    findAll(): Promise<User[]>;
    create(createUserDto: CreateUserDto): Promise<User>;
    updateProfile(userId: string, updateUserDto: UpdateUserDto): Promise<User>;
    changePassword(userId: string, dto: ChangePasswordDto): Promise<void>;
    getOrderHistory(userId: string): Promise<import("../../database/entities").Order[]>;
    resetPasswordById(userId: string, newHashedPassword: string): Promise<void>;
    deleteAccount(userId: string): Promise<void>;
    activateUser(userId: string): Promise<void>;
}
