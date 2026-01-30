import { Component, inject, OnDestroy, signal, effect } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { OrdersSocketService } from '../../services/orders-socket.service';
import { Order } from '../../models';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css'],
})
export class AdminComponent implements OnDestroy {
  private socketService = inject(OrdersSocketService);
  private router = inject(Router);

  newOrderNotification = signal<Order | null>(null);

  constructor() {
    effect(() => {
      this.socketService.onNewOrder((order: Order) => {
        console.log('New order received:', order);
        this.newOrderNotification.set(order);

        // Auto-hide after 10s
        setTimeout(() => this.newOrderNotification.set(null), 10000);
      });
    });
  }

  ngOnDestroy() {
    this.socketService.disconnect();
  }

  goToOrder(order: Order) {
    if (!order) return;
    this.router.navigate(['/admin/orders', order.id]);
    this.newOrderNotification.set(null);
  }
}
