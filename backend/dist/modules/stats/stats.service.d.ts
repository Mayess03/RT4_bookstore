import { DataSource } from 'typeorm';
import { Book, Order } from 'src/database/entities';
import { OrdersGateway } from './orders.gateway';
export declare class StatsService {
    private readonly dataSource;
    private readonly ordersGateway;
    constructor(dataSource: DataSource, ordersGateway: OrdersGateway);
    getStats(): Promise<{
        users: number;
        books: number;
        orders: number;
    }>;
    getRevenue(): Promise<{
        totalRevenue: number;
    }>;
    getSalesByDay(): Promise<{
        date: any;
        totalSales: number;
        orderCount: number;
    }[]>;
    getSalesByMonth(): Promise<{
        month: any;
        totalSales: number;
        orderCount: number;
    }[]>;
    getOutOfStockBooks(): Promise<Book[]>;
    createOrder(orderData: Partial<Order>): Promise<Order>;
    getBooksByCategory(): Promise<{
        total: number;
        byCategory: {
            category: any;
            count: number;
        }[];
    }>;
}
