import { Component, inject, signal, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StatsService } from '../../../../../services/stats.service';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-pending-orders',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './pending-orders.component.html',
  styleUrls: ['./pending-orders.component.css']
})
export class PendingOrdersComponent {
  private router = inject(Router);
  private statsService = inject(StatsService);

  pendingOrders = signal<number>(0);

  constructor() {
    effect(() => {
      this.statsService.getPendingOrders().subscribe({
        next: (res: { pendingOrders: number }) => this.pendingOrders.set(res.pendingOrders),
        error: (err) => console.error('Error fetching pending orders', err)
      });
    });
  }

  goToOrders() {
    this.router.navigate(['/admin/orders']);
  }

  pendingCount() {
    return this.pendingOrders();
  }
}
