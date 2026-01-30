import { Component, inject, computed, effect } from '@angular/core';
import { CartService } from '../../../services/cart.service';
import { OrdersService } from '../../../services/orders.service';
import { Router } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { CommonModule, CurrencyPipe, AsyncPipe } from '@angular/common';
import { Observable } from 'rxjs';
import { Cart } from '../../../models';
import { FormGroup, FormControl, Validators, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-checkout',
  standalone: true,
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css'],
  imports: [CommonModule, AsyncPipe, CurrencyPipe, ReactiveFormsModule],
})
export class CheckoutComponent {
  checkoutForm = new FormGroup({
    shippingAddress: new FormControl('', Validators.required),
    shippingCity: new FormControl('', Validators.required),
    shippingZipCode: new FormControl('', Validators.required),
    phone: new FormControl('', Validators.required),
  });

  private cartService = inject(CartService);
  private ordersService = inject(OrdersService);
  private authService = inject(AuthService);
  private router = inject(Router);

  cartObs!: Observable<Cart>;
  cart$!: Observable<Cart>;

  userId = computed(() => this.authService.getCurrentUser()?.id);

  constructor() {
    effect(() => {
      const id = this.userId();
      if (!id) {
        console.error('User not logged in');
        return;
      }

     
      this.cartObs = this.cartService.getCart(id);
      this.cart$ = this.cartService.getCart(id);
    });
  }

  confirmOrder() {
    const user = this.authService.getCurrentUser();
    if (!user) {
      alert('User not logged in');
      return;
    }

    if (this.checkoutForm.invalid) {
      alert('Please fill all required fields');
      return;
    }

    const dto = {
      shippingAddress: this.checkoutForm.get('shippingAddress')!.value,
      shippingCity: this.checkoutForm.get('shippingCity')!.value,
      shippingZipCode: this.checkoutForm.get('shippingZipCode')!.value,
      phone: this.checkoutForm.get('phone')!.value,
    };

    console.log('DTO SENT TO BACKEND', dto);

    this.ordersService.createOrder(user.id, dto).subscribe({
      next: () => this.router.navigate(['/orders']),
      error: (err) => console.error('Failed to create order:', err),
    });
  }

  getCartTotal(cart: Cart): number {
    return cart.items.reduce((sum, item) => {
      const price = item.book?.price ?? 0;
      return sum + price * item.quantity;
    }, 0);
  }
}
