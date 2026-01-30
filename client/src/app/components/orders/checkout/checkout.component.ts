<<<<<<< HEAD
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
=======
import { Component, inject, computed, effect } from '@angular/core';
import { CommonModule, CurrencyPipe, AsyncPipe } from '@angular/common';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { FormGroup, FormControl, Validators, ReactiveFormsModule } from '@angular/forms';
>>>>>>> 57f08029708837e3b38683cf571e73eea090251c

import { CartService } from '../../../services/cart.service';
import { OrdersService } from '../../../services/orders.service';
import { AuthService } from '../../../services/auth.service';
import { Cart } from '../../../models';

@Component({
  selector: 'app-checkout',
  standalone: true,
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css'],
<<<<<<< HEAD
  imports: [CommonModule, CurrencyPipe, ReactiveFormsModule],
})
export class CheckoutComponent {
  private cartService = inject(CartService);
  private ordersService = inject(OrdersService);
  private authService = inject(AuthService);
  private router = inject(Router);

  
  
=======
  imports: [CommonModule, AsyncPipe, CurrencyPipe, ReactiveFormsModule],
})
export class CheckoutComponent {
>>>>>>> 57f08029708837e3b38683cf571e73eea090251c
  checkoutForm = new FormGroup({
    shippingAddress: new FormControl('', Validators.required),
    shippingCity: new FormControl('', Validators.required),
    shippingZipCode: new FormControl('', Validators.required),
    phone: new FormControl('', Validators.required),
  });

<<<<<<< HEAD
  

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
=======
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
>>>>>>> 57f08029708837e3b38683cf571e73eea090251c
      alert('User not logged in');
      return;
    }

    if (this.checkoutForm.invalid) {
      alert('Please fill all required fields');
      return;
    }

<<<<<<< HEAD
    this.ordersService.createOrder(userId, this.checkoutForm.value).subscribe({
=======
    const dto = {
      shippingAddress: this.checkoutForm.get('shippingAddress')!.value,
      shippingCity: this.checkoutForm.get('shippingCity')!.value,
      shippingZipCode: this.checkoutForm.get('shippingZipCode')!.value,
      phone: this.checkoutForm.get('phone')!.value,
    };

    console.log('DTO SENT TO BACKEND', dto);

    this.ordersService.createOrder(user.id, dto).subscribe({
>>>>>>> 57f08029708837e3b38683cf571e73eea090251c
      next: () => this.router.navigate(['/orders']),
      error: (err) => console.error('Failed to create order:', err),
    });
  }
<<<<<<< HEAD
=======

  getCartTotal(cart: Cart): number {
    return cart.items.reduce((sum, item) => {
      const price = item.book?.price ?? 0;
      return sum + price * item.quantity;
    }, 0);
  }
>>>>>>> 57f08029708837e3b38683cf571e73eea090251c
}
