import { Server } from 'socket.io';
import { Order } from 'src/database/entities';
export declare class OrdersGateway {
    server: Server;
    newOrder(order: Order): void;
}
