import { Component, OnInit, inject } from '@angular/core';
import { OrdersService } from '../../services/orders.service';
import { Order } from '../../models/order.model';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router'; 

@Component({
  selector: 'app-order-list',
  templateUrl: './order-list.component.html',
  styleUrls: ['./order-list.component.css'],
  imports: [CommonModule, RouterModule], 
})
export class OrderListComponent implements OnInit {
  private ordersService = inject(OrdersService);

  orders: Order[] = [];
   loading = true;
  error: string | null = null;

 ngOnInit(): void {
    this.loadOrders(); // 👈 APPEL DIRECT
  }


  loadOrders() {
    this.loading = true;
    this.ordersService.getMyOrders().subscribe({
      next: (orders) => {
        console.log('ORDERS FROM BACKEND', orders);
        this.orders = orders;
        this.loading = false;
      },
      error: (err) => {
        console.error('Failed to load orders', err);
        this.error = 'Failed to load orders';
        this.loading = false;
      },
    });
  }
}
