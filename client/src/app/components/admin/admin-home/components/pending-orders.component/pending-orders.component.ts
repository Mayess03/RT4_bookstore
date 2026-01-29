import { Component, inject, OnInit, signal } from '@angular/core';
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
export class PendingOrdersComponent implements OnInit {
  private router = inject(Router);
  pendingOrders = signal<number>(0);
  private statsService = inject(StatsService);

  ngOnInit() {
    this.loadPendingOrders();
  }

  loadPendingOrders() {
    this.statsService.getPendingOrders().subscribe({
      next: (res: { pendingOrders: number }) => this.pendingOrders.set(res.pendingOrders),
      error: (err) => console.error('Error fetching pending orders', err)
    });
  }

  goToOrders() {
    this.router.navigate(['/admin/orders']);
  }

  pendingCount() {
    return this.pendingOrders();
  }
}
