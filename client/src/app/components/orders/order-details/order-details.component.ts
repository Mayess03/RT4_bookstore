import { Component, inject } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { OrdersService } from '../../../services/orders.service';
import { Order } from '../../../models';
import { switchMap, filter, map } from 'rxjs/operators';
import { OrderStatus } from '../../../models';

@Component({
  selector: 'app-order-details',
  standalone: true,
  imports: [CommonModule, CurrencyPipe],
  templateUrl: './order-details.component.html',
  styleUrls: ['./order-details.component.css'],
})
export class OrderDetailsComponent {
  OrderStatus = OrderStatus;
  
  private route = inject(ActivatedRoute);
  private ordersService = inject(OrdersService);

  order$ = this.route.paramMap.pipe(
    map(params => params.get('id')),
    filter((id): id is string => !!id),
    switchMap(id => this.ordersService.getOrderById(id))
  );

  getItemTotal(price: number, quantity: number): number {
    return price * quantity;
  }
  cancelOrder(orderId: string) {
    const confirmed = confirm('Are you sure you want to cancel this order?');
    if (!confirmed) return;

    this.order$ = this.ordersService.cancelOrder(orderId).pipe(
      switchMap(() => this.ordersService.getOrderById(orderId))
    );
  }

  
}
