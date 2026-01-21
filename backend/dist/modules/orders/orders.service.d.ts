import { Repository } from 'typeorm';
import { Order } from '../../database/entities/order.entity';
import { OrderItem } from '../../database/entities/order-item.entity';
import { OrderStatus } from '../../common/enums';
import { CreateOrderDto } from './dto/create-order.dto';
import { CartService } from '../cart/cart.service';
import { BooksService } from '../books/books.service';
export declare class OrdersService {
    private readonly orderRepo;
    private readonly orderItemRepo;
    private readonly cartService;
    private readonly booksService;
    constructor(orderRepo: Repository<Order>, orderItemRepo: Repository<OrderItem>, cartService: CartService, booksService: BooksService);
    createOrder(userId: string, dto: CreateOrderDto): Promise<Order>;
    confirmOrder(id: string, userId: string): Promise<Order>;
    findMyOrders(userId: string): Promise<Order[]>;
    findUserOrder(id: string, userId: string): Promise<Order>;
    getStatus(id: string, userId: string): Promise<OrderStatus>;
    cancelOrder(id: string, userId: string): Promise<Order>;
    findAll(status?: OrderStatus, userId?: string): Promise<Order[]>;
    findOneAdmin(id: string): Promise<Order>;
    updateStatus(id: string, status: OrderStatus): Promise<Order>;
    refundOrder(id: string): Promise<Order>;
}
