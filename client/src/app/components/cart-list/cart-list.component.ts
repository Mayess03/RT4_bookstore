import { Component, inject, signal, computed, effect, DestroyRef } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { CartService } from '../../services/cart.service';
import { AuthService } from '../../services/auth.service';
import { Cart, CartItem } from '../../models';
import { LoadingComponent } from '../loading/loading.component';

@Component({
  selector: 'app-cart-list',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatProgressSpinnerModule,
    CurrencyPipe,
    LoadingComponent,
  ],
  templateUrl: './cart-list.component.html',
  styleUrl: './cart-list.component.css',
})
export class CartListComponent {
  private cartService = inject(CartService);
  private authService = inject(AuthService);
  private router = inject(Router);
  private destroyRef = inject(DestroyRef);

  cart = signal<Cart | null>(null);
  loading = signal(false);
  error = signal<string | null>(null);
  updatingItems = signal<Set<string>>(new Set());

  tax = signal(0.2); // 20%

  itemCount = computed(() => this.cart()?.items.reduce((sum, i) => sum + i.quantity, 0) ?? 0);

  subtotal = computed(
    () =>
      this.cart()?.items.reduce(
        (total, item) => total + (item.book?.price ?? 0) * item.quantity,
        0,
      ) ?? 0,
  );

  taxAmount = computed(() => this.subtotal() * this.tax());
  total = computed(() => this.subtotal() + this.taxAmount());

  constructor() {
    effect(() => {
      const user = this.authService.currentUser();
      if (!user?.id) {
        this.error.set('User not authenticated');
        return;
      }

      this.loadCart(user.id);
    });

    this.cartService.loading$
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((loading) => this.loading.set(loading));

    this.cartService.error$
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((error) => this.error.set(error));
  }

  private loadCart(userId: string) {
    this.cartService.getCart(userId).subscribe({
      next: (cart) => {
        this.cart.set(cart);
        this.cartService.setCart(cart);
        this.cartService.setLoading(false);
        this.error.set(null);
      },
      error: () => {
        this.error.set('Failed to load cart');
        this.cartService.setLoading(false);
      },
    });
  }

  updateQuantity(item: CartItem, quantity: number) {
    if (quantity < 1 || !item.book) return;

    const user = this.authService.currentUser();
    if (!user?.id) return;

    this.updatingItems.update((s) => new Set(s).add(item.id));

    this.cartService
      .updateItemQuantity({
        userId: user.id,
        bookId: item.bookId,
        quantity,
      })
      .subscribe({
        next: () => {
          this.cart.update((cart) =>
            cart
              ? {
                  ...cart,
                  items: cart.items.map((i) => (i.id === item.id ? { ...i, quantity } : i)),
                }
              : cart,
          );
          this.finishUpdate(item.id);
        },
        error: () => {
          this.error.set('Failed to update quantity');
          this.finishUpdate(item.id);
        },
      });
  }

  removeItem(item: CartItem) {
    const user = this.authService.currentUser();
    if (!user?.id) return;

    this.updatingItems.update((s) => new Set(s).add(item.id));

    this.cartService.removeItem(user.id, item.bookId).subscribe({
      next: () => {
        this.cart.update((cart) =>
          cart ? { ...cart, items: cart.items.filter((i) => i.id !== item.id) } : cart,
        );
        this.finishUpdate(item.id);
      },
      error: () => {
        this.error.set('Failed to remove item');
        this.finishUpdate(item.id);
      },
    });
  }

  clearCart() {
    if (!confirm('Are you sure you want to clear your cart?')) return;

    const user = this.authService.currentUser();
    if (!user?.id) return;

    this.cartService.clearCart(user.id).subscribe({
      next: () => this.cart.update((c) => (c ? { ...c, items: [] } : c)),
      error: () => this.error.set('Failed to clear cart'),
    });
  }

  continueShopping() {
    this.router.navigate(['/books']);
  }

  proceedToCheckout() {
    this.router.navigate(['/orders/checkout']);
  }

  isUpdating(itemId: string) {
    return this.updatingItems().has(itemId);
  }

  private finishUpdate(itemId: string) {
    this.updatingItems.update((s) => {
      s.delete(itemId);
      return new Set(s);
    });
    this.cartService.setLoading(false);
  }
}
