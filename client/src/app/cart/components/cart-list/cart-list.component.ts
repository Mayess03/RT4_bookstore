import { Component, OnInit, inject, signal, computed, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { CurrencyPipe } from '@angular/common';
import { CartService } from '../../services/cart.service';
import { AuthService } from '../../../shared/services/auth.service';
import { Cart, CartItem } from '../../../shared/models';
import { LoadingComponent } from '../../../shared/components/loading/loading.component';
import { Router } from '@angular/router';


/**
 * Cart List Component
 *
 * Purpose: Display user's shopping cart with items
 * Features:
 * - Display all cart items with book details
 * - Adjust quantities
 * - Remove items
 * - Calculate totals
 * - Empty cart state
 *
 */
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
export class CartListComponent implements OnInit {
  private cartService = inject(CartService);
  private authService = inject(AuthService);
  private router = inject(Router);
  // State using signals
  cart = signal<Cart | null>(null);
  loading = signal(false);
  error = signal<string | null>(null);
  updatingItems = signal<Set<string>>(new Set());

  // Computed values
  itemCount = computed(() => {
    const items = this.cart()?.items || [];
    return items.reduce((count, item) => count + item.quantity, 0);
  });

  subtotal = computed(() => {
    const items = this.cart()?.items || [];
    return items.reduce((total, item) => {
      return total + (item.book?.price || 0) * item.quantity;
    }, 0);
  });

  tax = signal(0.2); // 20% tax rate (adjust as needed)

  taxAmount = computed(() => {
    return this.subtotal() * this.tax();
  });

  total = computed(() => {
    return this.subtotal() + this.taxAmount();
  });

  ngOnInit() {
    this.loadCart();

    // Subscribe to loading state
    this.cartService.loading$.subscribe((loading) => {
      this.loading.set(loading);
    });

    // Subscribe to error state
    this.cartService.error$.subscribe((error) => {
      this.error.set(error);
    });
  }

  /**
   * Load cart from backend
   */
  loadCart() {
    const user = this.authService.currentUser();
    if (!user?.id) {
      this.error.set('User not authenticated');
      return;
    }

    this.cartService.getCart(user.id).subscribe({
      next: (cart: Cart) => {
        this.cart.set(cart);
        this.cartService.setCart(cart);
        this.cartService.setLoading(false);
        this.error.set(null);
      },
      error: (error) => {
        console.error('Error loading cart:', error);
        this.error.set('Failed to load cart');
        this.cartService.setLoading(false);
      },
    });
  }

  /**
   * Update item quantity
   */
  updateQuantity(item: CartItem, newQuantity: number) {
    if (newQuantity < 1 || !item.book) return;

    const user = this.authService.currentUser();
    if (!user?.id) return;

    this.updatingItems.update((set) => new Set(set).add(item.id));

    this.cartService
      .updateItemQuantity({
        userId: user.id,
        bookId: item.bookId,
        quantity: newQuantity,
      })
      .subscribe({
        next: (updatedItem: CartItem) => {
          // Update the item in cart
          const currentCart = this.cart();
          if (currentCart) {
            const updatedItems = currentCart.items.map((cartItem) =>
              cartItem.id === item.id ? { ...cartItem, quantity: newQuantity } : cartItem,
            );
            this.cart.set({ ...currentCart, items: updatedItems });
          }
          this.updatingItems.update((set) => {
            set.delete(item.id);
            return new Set(set);
          });
          this.cartService.setLoading(false);
        },
        error: (error) => {
          console.error('Error updating quantity:', error);
          this.error.set('Failed to update quantity');
          this.updatingItems.update((set) => {
            set.delete(item.id);
            return new Set(set);
          });
          this.cartService.setLoading(false);
        },
      });
  }

  /**
   * Remove item from cart
   */
  removeItem(item: CartItem) {
    const user = this.authService.currentUser();
    if (!user?.id) return;

    this.updatingItems.update((set) => new Set(set).add(item.id));

    this.cartService.removeItem(user.id, item.bookId).subscribe({
      next: () => {
        // Remove the item from cart
        const currentCart = this.cart();
        if (currentCart) {
          const updatedItems = currentCart.items.filter((cartItem) => cartItem.id !== item.id);
          this.cart.set({ ...currentCart, items: updatedItems });
        }
        this.updatingItems.update((set) => {
          set.delete(item.id);
          return new Set(set);
        });
        this.cartService.setLoading(false);
      },
      error: (error) => {
        console.error('Error removing item:', error);
        this.error.set('Failed to remove item');
        this.updatingItems.update((set) => {
          set.delete(item.id);
          return new Set(set);
        });
        this.cartService.setLoading(false);
      },
    });
  }

  /**
   * Clear entire cart
   */
  clearCart() {
    if (!confirm('Are you sure you want to clear your cart?')) return;

    const user = this.authService.currentUser();
    if (!user?.id) return;

    this.cartService.clearCart(user.id).subscribe({
      next: () => {
        this.cart.set({ ...this.cart()!, items: [] });
        this.cartService.setLoading(false);
      },
      error: (error) => {
        console.error('Error clearing cart:', error);
        this.error.set('Failed to clear cart');
        this.cartService.setLoading(false);
      },
    });
  }

  /**
   * Continue shopping
   */
  continueShopping() {
    // Navigate to books page
    window.location.href = '/books';
  }

  /**
   * Proceed to checkout
   */
  proceedToCheckout() {
    this.router.navigate(['/orders/checkout']);
    alert('Checkout functionality coming soon!');
  }

  /**
   * Check if item is being updated
   */
  isUpdating(itemId: string): boolean {
    return this.updatingItems().has(itemId);
  }
}
