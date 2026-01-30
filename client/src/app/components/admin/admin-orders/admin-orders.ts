import { Component, computed, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { OrdersService } from '../../../services/orders.service';
import { Order } from '../../../models';

@Component({
  selector: 'app-admin-orders',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './admin-orders.html',
  styleUrl: './admin-orders.css',
})
export class AdminOrders implements OnInit {
  orders = signal<Order[]>([]);
  loading = signal(false);

  constructor(
    private ordersService: OrdersService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.fetchOrders();
  }

  fetchOrders(): void {
    this.loading.set(true);
    this.ordersService.getAllOrders().subscribe({
      next: (data) => {
        const sorted = data.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        this.orders.set(sorted);
        this.loading.set(false);
      },
      error: (err) => {
        console.error('Failed to load orders', err);
        this.loading.set(false);
      }
    });
  }

  goToDetails(orderId: string): void {
  this.router.navigate(['admin', 'orders', orderId]);
}
searchTerm = signal('');
selectedStatus = signal('ALL');

filteredOrders = computed(() => {
  return this.orders().filter(order => {
    const matchesSearch =
      order.id.toLowerCase().includes(this.searchTerm().toLowerCase());

    const matchesStatus =
      this.selectedStatus() === 'ALL' ||
      order.status === this.selectedStatus();

    return matchesSearch && matchesStatus;
  });
});
}
