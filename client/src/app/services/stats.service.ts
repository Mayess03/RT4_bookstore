import { Injectable } from '@angular/core';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root'
})
export class StatsService extends ApiService {

  constructor() {
    super();
  }

  getGlobalStats() {
    // Calls GET /api/stats/global
    return this.http.get<{ users: number, books: number, orders: number }>(`${this.apiUrl}/stats/global`);
  }
  getRevenue() {
    // Calls GET /api/stats/revenue
    return this.http.get<{ totalRevenue: number }>(`${this.apiUrl}/stats/revenue`);
  }
  getSalesByDay() {
    return this.http.get<{
      date: string;
      totalSales: number;
      orderCount: number;
    }[]>(`${this.apiUrl}/stats/sales/day`);
  }

  getSalesByMonth() {
    return this.http.get<{
      month: string;
      totalSales: number;
      orderCount: number;
    }[]>(`${this.apiUrl}/stats/sales/month`);
  }
  getOutOfStockBooks() {
    // Calls GET /api/stats/out-of-stock
    return this.http.get<{ id: string; title: string; stock: number }[]>(`${this.apiUrl}/stats/out-of-stock`);
  }
  getPendingOrders() {
    return this.http.get<{ pendingOrders: number }>(`${this.apiUrl}/stats/orders/pending`);
  }
  getBestSellers() {
    return this.http.get<{ id: string; title: string; sales: number }[]>(
      `${this.apiUrl}/books/bestsellers?limit=5`
    );
  }
  getBooksByCategory() {
    return this.http.get<{
      total: number;
      byCategory: { category: string; count: number }[];
    }>(`${this.apiUrl}/stats/books-by-category`);
  }
}
