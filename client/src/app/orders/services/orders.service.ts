import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Order } from '../models/order.model';

@Injectable({ providedIn: 'root' })
export class OrdersService {
  private http = inject(HttpClient);
private apiUrl = 'http://localhost:3000/api/orders';

  
  createOrder(userId: string, dto: any) {
  return this.http.post<Order>(this.apiUrl, dto);}





  getMyOrders() {
    return this.http.get<Order[]>(`${this.apiUrl}/my`);
  }

  getOrderById(id: string) {
    return this.http.get<Order>(`${this.apiUrl}/${id}`);
  }

  cancelOrder(id: string) {
    return this.http.patch(`${this.apiUrl}/${id}/cancel`, {});
  }
}
