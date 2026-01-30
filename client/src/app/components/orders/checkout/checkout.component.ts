import {
  Component,
  inject,
  computed,
  effect,
} from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';

import { CartService } from '../../../services/cart.service';
import { OrdersService } from '../../../services/orders.service';
import { AuthService } from '../../../services/auth.service';
import { Cart } from '../../../models';

@Component({
  selector: 'app-checkout',
  standalone: true,
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css'],
  imports: [CommonModule, CurrencyPipe, ReactiveFormsModule],
})
export class CheckoutComponent {
  private cartService = inject(CartService);
  private ordersService = inject(OrdersService);
  private authService = inject(AuthService);
  private router = inject(Router);

  
  
  checkoutForm = new FormGroup({
    shippingAddress: new FormControl('', Validators.required),
    shippingCity: new FormControl('', Validators.required),
    shippingZipCode: new FormControl('', Validators.required),
    phone: new FormControl('', Validators.required),
  });

  

  userId = computed(() => this.authService.currentUser()?.id);

  
  cart = toSignal(
    this.cartService.getCart(this.userId()!),
    { initialValue: null }
  );

 
  
  total = computed(() => {
    const cart = this.cart();
    if (!cart) return 0;

    return cart.items.reduce((sum, item) => {
      const price = item.book?.price ?? 0;
      return sum + price * item.quantity;
    }, 0);
  });

  
  
  confirmOrder() {
    const userId = this.userId();
    if (!userId) {
      alert('User not logged in');
      return;
    }

    if (this.checkoutForm.invalid) {
      alert('Please fill all required fields');
      return;
    }

    this.ordersService.createOrder(userId, this.checkoutForm.value).subscribe({
      next: () => this.router.navigate(['/orders']),
      error: (err) => console.error('Failed to create order:', err),
    });
  }
}
