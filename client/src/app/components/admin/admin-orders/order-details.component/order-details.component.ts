import { Component, inject, signal, effect } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { OrdersService } from '../../../../services/orders.service';
import { AdminUsersService } from '../../../../services/admin-users.service';
import { BooksService } from '../../../../services/books.service';
import { Order, User, Book, OrderStatus } from '../../../../models';

@Component({
  selector: 'app-order-details',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './order-details.component.html',
  styleUrls: ['./order-details.component.css']
})
export class OrderDetailsAdminComponent {
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private ordersService = inject(OrdersService);
  private adminUsersService = inject(AdminUsersService);
  private booksService = inject(BooksService);

  order = signal<Order | null>(null);
  user = signal<User | null>(null);
  orderStatuses = Object.values(OrderStatus);
  updatingStatus = signal(false);

  booksMap = signal<Record<string, Book>>({});

  loading = signal(true);
  error = signal(false);

  constructor() {
    // Effect pour charger automatiquement les données au montage
    effect(() => {
      const orderId = this.route.snapshot.paramMap.get('id');

      if (!orderId) {
        this.error.set(true);
        this.loading.set(false);
        return;
      }

      this.ordersService.getOrderAdminById(orderId).subscribe({
        next: (order) => {
          this.order.set(order);

          // Charger l'utilisateur
          this.adminUsersService.getById(order.userId).subscribe({
            next: (user) => this.user.set(user),
            error: () => console.warn(`User ${order.userId} not found`)
          });

          // Charger les livres
          order.items.forEach(item => this.loadBook(item.bookId));

          this.loading.set(false);
        },
        error: () => {
          this.error.set(true);
          this.loading.set(false);
        }
      });
    });
  }

  private loadBook(bookId: string) {
    // éviter les appels dupliqués
    if (this.booksMap()[bookId]) return;

    this.booksService.getBookById(bookId).subscribe({
      next: (book) => {
        this.booksMap.update(map => ({ ...map, [bookId]: book }));
      },
      error: () => console.warn(`Book ${bookId} not found`)
    });
  }

  getBook(bookId: string): Book | null {
    return this.booksMap()[bookId] ?? null;
  }

  onStatusChange(selectedStatus: string) {
    const currentOrder = this.order();
    if (!currentOrder || currentOrder.status === selectedStatus) return;

    this.updatingStatus.set(true);

    this.ordersService.updateOrderStatus(currentOrder.id, selectedStatus as OrderStatus)
      .subscribe({
        next: (updatedOrder) => {
          this.order.set(updatedOrder); // UI refresh
          this.updatingStatus.set(false);
          console.log('Order status updated:', updatedOrder.status);
        },
        error: (err) => {
          console.error(err);
          this.updatingStatus.set(false);
          alert('Failed to update order status');
        }
      });
  }

  goBack() {
    this.router.navigate(['/admin/orders']);
  }
}
