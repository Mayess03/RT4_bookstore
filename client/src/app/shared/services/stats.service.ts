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
}
