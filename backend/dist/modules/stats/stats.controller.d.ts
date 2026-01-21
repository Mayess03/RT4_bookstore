import { StatsService } from './stats.service';
export declare class StatsController {
    private readonly statsService;
    constructor(statsService: StatsService);
    getGlobalStats(): Promise<{
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
    getOutOfStockBooks(): Promise<import("../../database/entities").Book[]>;
    getBooksByCategory(): Promise<{
        total: number;
        byCategory: {
            category: any;
            count: number;
        }[];
    }>;
}
