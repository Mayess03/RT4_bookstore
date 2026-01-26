import { Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Order } from '../../../../models';
import { CommonModule } from '@angular/common';
import { OrdersService } from '../../../../services/orders.service';

@Component({
  selector: 'app-order-details',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './order-details.component.html',
  styleUrls: ['./order-details.component.css']
})
export class OrderDetailsAdminComponent implements OnInit {

  private route = inject(ActivatedRoute);
  private ordersService = inject(OrdersService);

  order = signal<Order | null>(null);
  loading = signal(true);
  error = signal(false);

  ngOnInit(): void {
    const orderId = this.route.snapshot.paramMap.get('id');
    if (orderId) {
      this.ordersService.getOrderAdminById(orderId).subscribe({
        next: (data) => {
          this.order.set(data);
          this.loading.set(false);
        },
        error: (err) => {
          console.error(err);
          this.error.set(true);
          this.loading.set(false);
        }
      });
    } else {
      this.error.set(true);
      this.loading.set(false);
    }
  }
}
