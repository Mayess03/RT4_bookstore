import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateStatusDto } from './dto/update-status.dto';
import { OrderStatus } from '../../common/enums';
export declare class OrdersController {
    private readonly ordersService;
    constructor(ordersService: OrdersService);
    findAll(status?: OrderStatus, userId?: string): Promise<import("../../database/entities").Order[]>;
    findOneAdmin(id: string): Promise<import("../../database/entities").Order>;
    updateStatus(id: string, dto: UpdateStatusDto): Promise<import("../../database/entities").Order>;
    refund(id: string): Promise<import("../../database/entities").Order>;
    create(req: any, dto: CreateOrderDto): Promise<import("../../database/entities").Order>;
    confirm(id: string, req: any): Promise<import("../../database/entities").Order>;
    findMy(req: any): Promise<import("../../database/entities").Order[]>;
    findOne(id: string, req: any): Promise<import("../../database/entities").Order>;
    getStatus(id: string, req: any): Promise<OrderStatus>;
    cancel(id: string, req: any): Promise<import("../../database/entities").Order>;
}
