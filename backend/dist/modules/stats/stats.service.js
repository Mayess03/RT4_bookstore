"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.StatsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("typeorm");
const entities_1 = require("../../database/entities");
const orders_gateway_1 = require("./orders.gateway");
let StatsService = class StatsService {
    dataSource;
    ordersGateway;
    constructor(dataSource, ordersGateway) {
        this.dataSource = dataSource;
        this.ordersGateway = ordersGateway;
    }
    async getStats() {
        const userCount = await this.dataSource
            .getRepository(entities_1.User)
            .createQueryBuilder('user')
            .where('user.role != :role', { role: 'admin' })
            .getCount();
        const bookCount = await this.dataSource.getRepository(entities_1.Book).count();
        const orderCount = await this.dataSource.getRepository(entities_1.Order).count();
        return {
            users: userCount,
            books: bookCount,
            orders: orderCount,
        };
    }
    async getRevenue() {
        const result = await this.dataSource
            .getRepository(entities_1.OrderItem)
            .createQueryBuilder('item')
            .select('SUM(item.subtotal)', 'total')
            .getRawOne();
        return {
            totalRevenue: Number(result.total) || 0,
        };
    }
    async getSalesByDay() {
        const result = await this.dataSource
            .getRepository(entities_1.Order)
            .createQueryBuilder('order')
            .select("DATE(order.created_at)", "date")
            .addSelect("SUM(order.total_price)", "totalSales")
            .addSelect("COUNT(*)", "orderCount")
            .groupBy("DATE(order.created_at)")
            .orderBy("DATE(order.created_at)", "ASC")
            .getRawMany();
        return result.map(r => ({
            date: r.date,
            totalSales: Number(r.totalSales),
            orderCount: Number(r.orderCount),
        }));
    }
    async getSalesByMonth() {
        const result = await this.dataSource
            .getRepository(entities_1.Order)
            .createQueryBuilder('order')
            .select("TO_CHAR(order.created_at, 'YYYY-MM')", "month")
            .addSelect("SUM(order.total_price)", "totalSales")
            .addSelect("COUNT(*)", "orderCount")
            .groupBy("TO_CHAR(order.created_at, 'YYYY-MM')")
            .orderBy("TO_CHAR(order.created_at, 'YYYY-MM')", "ASC")
            .getRawMany();
        return result.map(r => ({
            month: r.month,
            totalSales: Number(r.totalSales),
            orderCount: Number(r.orderCount),
        }));
    }
    async getOutOfStockBooks() {
        const books = await this.dataSource
            .getRepository(entities_1.Book)
            .createQueryBuilder('book')
            .select(['book.id', 'book.title', 'book.stock'])
            .where('book.stock <= :stock', { stock: 0 })
            .getMany();
        return books;
    }
    async createOrder(orderData) {
        const orderRepo = this.dataSource.getRepository(entities_1.Order);
        const newOrder = orderRepo.create(orderData);
        await orderRepo.save(newOrder);
        this.ordersGateway.newOrder(newOrder);
        return newOrder;
    }
    async getBooksByCategory() {
        const result = await this.dataSource
            .getRepository(entities_1.Book)
            .createQueryBuilder('book')
            .leftJoin('book.category', 'category')
            .select('category.name', 'category')
            .addSelect('COUNT(book.id)', 'count')
            .groupBy('category.name')
            .orderBy('count', 'DESC')
            .getRawMany();
        const totalBooks = await this.dataSource.getRepository(entities_1.Book).count();
        return {
            total: totalBooks,
            byCategory: result.map(r => ({
                category: r.category || 'Uncategorized',
                count: Number(r.count),
            })),
        };
    }
};
exports.StatsService = StatsService;
exports.StatsService = StatsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [typeorm_1.DataSource, orders_gateway_1.OrdersGateway])
], StatsService);
//# sourceMappingURL=stats.service.js.map