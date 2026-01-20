import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { User, Book, Order, OrderItem } from 'src/database/entities';
import { OrdersGateway } from './orders.gateway';

@Injectable()
export class StatsService {
    constructor(private readonly dataSource: DataSource, private readonly ordersGateway: OrdersGateway,) { }

    async getStats() {
        // nb des utilisateurs (exclure les admins)
        const userCount = await this.dataSource
            .getRepository(User)
            .createQueryBuilder('user')
            .where('user.role != :role', { role: 'admin' })
            .getCount();
        const bookCount = await this.dataSource.getRepository(Book).count();
        const orderCount = await this.dataSource.getRepository(Order).count();
        return {
            users: userCount,
            books: bookCount,
            orders: orderCount,
        };
    }

    async getRevenue() {
        // somme total des commandes
        const result = await this.dataSource
            .getRepository(OrderItem)
            .createQueryBuilder('item')
            .select('SUM(item.subtotal)', 'total')
            .getRawOne();

        return {
            totalRevenue: Number(result.total) || 0,
        };
    }

    // Ventes agrégées par jour
    async getSalesByDay() {
        const result = await this.dataSource
            .getRepository(Order)
            .createQueryBuilder('order')
            .select("DATE(order.created_at)", "date")
            .addSelect("SUM(order.total_price)", "totalSales")
            .addSelect("COUNT(*)", "orderCount")  // <-- Ajout du count
            .groupBy("DATE(order.created_at)")
            .orderBy("DATE(order.created_at)", "ASC")
            .getRawMany();

        return result.map(r => ({
            date: r.date,
            totalSales: Number(r.totalSales),
            orderCount: Number(r.orderCount),   // <-- inclut le count
        }));
    }

    // Ventes agrégées par mois
    async getSalesByMonth() {
        const result = await this.dataSource
            .getRepository(Order)
            .createQueryBuilder('order')
            .select("TO_CHAR(order.created_at, 'YYYY-MM')", "month")
            .addSelect("SUM(order.total_price)", "totalSales")
            .addSelect("COUNT(*)", "orderCount")  // <-- Ajout du count
            .groupBy("TO_CHAR(order.created_at, 'YYYY-MM')")
            .orderBy("TO_CHAR(order.created_at, 'YYYY-MM')", "ASC")
            .getRawMany();

        return result.map(r => ({
            month: r.month,
            totalSales: Number(r.totalSales),
            orderCount: Number(r.orderCount),   // <-- inclut le count
        }));
    }

    async getOutOfStockBooks() {
        const books = await this.dataSource
            .getRepository(Book)
            .createQueryBuilder('book')
            .select(['book.id', 'book.title', 'book.stock'])
            .where('book.stock <= :stock', { stock: 0 })
            .getMany();

        return books;
    }

    async createOrder(orderData: Partial<Order>) {
        const orderRepo = this.dataSource.getRepository(Order);
        const newOrder = orderRepo.create(orderData);
        await orderRepo.save(newOrder);

        // Notifier en temps réel
        this.ordersGateway.newOrder(newOrder);

        return newOrder;
    }

    async getBooksByCategory() {
        // Comptage par catégorie
        const result = await this.dataSource
            .getRepository(Book)
            .createQueryBuilder('book')
            .leftJoin('book.category', 'category')
            .select('category.name', 'category')
            .addSelect('COUNT(book.id)', 'count')
            .groupBy('category.name')
            .orderBy('count', 'DESC')
            .getRawMany();

        // Total de livres
        const totalBooks = await this.dataSource.getRepository(Book).count();

        return {
            total: totalBooks,
            byCategory: result.map(r => ({
                category: r.category || 'Uncategorized',
                count: Number(r.count),
            })),
        };
    }
}
