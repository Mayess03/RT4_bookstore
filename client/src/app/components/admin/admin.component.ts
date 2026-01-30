import { Component, inject, OnDestroy, OnInit, signal } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { AdminNavbarComponent } from './admin-navbar/admin-navbar.component';
import { OrdersSocketService } from '../../services/orders-socket.service';
import { Order } from '../../models';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css'],
})
export class AdminComponent implements OnInit, OnDestroy {

  private socketService = inject(OrdersSocketService);
  private router = inject(Router);

  newOrderNotification = signal<Order | null>(null);

  ngOnInit() {
    this.socketService.onNewOrder((order: Order) => {
      this.newOrderNotification.set(order);

      // Auto-hide après 10s
      setTimeout(() => this.newOrderNotification.set(null), 10000);
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
