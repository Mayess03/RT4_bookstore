import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { Observable, map } from 'rxjs';
import { Order, OrderItem } from '../models';

@Injectable({
  providedIn: 'root'
})
export class OrdersService extends ApiService {

  /**
   * orders (User)
   */
  createOrder(userId: string, dto: any) {
  return this.http.post<Order>(`${this.apiUrl}/orders`, dto);
}
  
    getMyOrders() {
  return this.http.get<Order[]>(`${this.apiUrl}/orders/my`);
}

getOrderById(id: string) {
  return this.http.get<Order>(`${this.apiUrl}/orders/${id}`);
}

cancelOrder(id: string) {
  return this.http.patch(`${this.apiUrl}/orders/${id}/cancel`, {});
}

  /**
   * Get all orders (Admin)
   */
  getAllOrders(): Observable<Order[]> {
    return this.http.get<Order[]>(`${this.apiUrl}/orders/admin`).pipe(
      map(orders =>
        orders.map(order => this.transformOrder(order))
      )
    );
  }

  /**
   * Get single order by ID
   */
  getOrderAdminById(orderId: string): Observable<Order> {
  return this.http.get<Order>(`${this.apiUrl}/orders/admin/${orderId}`)
    .pipe(map(order => this.transformOrder(order)));
}

  /**
   * Transform API order into proper types (numbers, dates)
   */
  private transformOrder(order: any): Order {
    return {
      ...order,
      totalPrice: parseFloat(order.totalPrice),
      createdAt: new Date(order.createdAt),
      updatedAt: order.updatedAt ? new Date(order.updatedAt) : undefined,
      items: order.items.map((item: any) => this.transformOrderItem(item))
    };
  }

  private transformOrderItem(item: any): OrderItem {
    return {
      ...item,
      unitPrice: parseFloat(item.unitPrice),
      subtotal: parseFloat(item.subtotal)
    };
  }
}
