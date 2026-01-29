import { Component, OnInit, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDividerModule } from '@angular/material/divider';
import { WishlistService } from '../../../services/wishlist.service';
import { AuthService } from '../../../services/auth.service';
import { CartService } from '../../../services/cart.service';
import { WishlistItem } from '../../../models/wishlist.model';

@Component({
  selector: 'app-wishlist-page',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    MatIconModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
    MatDividerModule,
  ],
  templateUrl: './wishlist-page.component.html',
  styleUrl: './wishlist-page.component.css',
})
export class WishlistPageComponent implements OnInit {
  private wishlistService = inject(WishlistService);
  private authService = inject(AuthService);
  private cartService = inject(CartService);
  private snackBar = inject(MatSnackBar);

  wishlistItems = signal<WishlistItem[]>([]);
  loading = signal(true);
  error = signal<string | null>(null);
  removingItemId = signal<string | null>(null);
  addingToCartId = signal<string | null>(null);

  readonly placeholderImage =
    'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMjAwIiBoZWlnaHQ9IjMwMCIgZmlsbD0iI2YwZjBmMCIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMTQiIGZpbGw9IiM5OTk5OTkiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIj5ObyBDb3ZlcjwvdGV4dD48L3N2Zz4=';

  ngOnInit() {
    this.loadWishlist();
  }

  /**
   * Load user's wishlist
   */
  loadWishlist() {
    this.loading.set(true);
    this.error.set(null);

    this.wishlistService.getWishlist().subscribe({
      next: (items) => {
        this.wishlistItems.set(items);
        this.loading.set(false);
      },
      error: (err) => {
        console.error('Failed to load wishlist:', err);
        this.error.set('Failed to load your wishlist. Please try again.');
        this.loading.set(false);
      },
    });
  }

  /**
   * Remove item from wishlist
   */
  removeFromWishlist(item: WishlistItem) {
    this.removingItemId.set(item.id);

    this.wishlistService.removeBook(item.bookId).subscribe({
      next: () => {
        this.wishlistItems.update((items) => items.filter((i) => i.id !== item.id));
        this.removingItemId.set(null);
        this.snackBar.open('Removed from wishlist', 'Close', {
          duration: 3000,
          horizontalPosition: 'end',
          verticalPosition: 'bottom',
          panelClass: ['success-snackbar'],
        });
      },
      error: (err) => {
        this.removingItemId.set(null);
        console.error('Error removing from wishlist:', err);
        this.snackBar.open('Failed to remove from wishlist', 'Close', {
          duration: 3000,
          horizontalPosition: 'end',
          verticalPosition: 'bottom',
          panelClass: ['error-snackbar'],
        });
      },
    });
  }

  /**
   * Add item to cart from wishlist
   */
  addToCart(item: WishlistItem) {
    if (!item.book) return;

    const user = this.authService.currentUser();
    if (!user?.id) {
      this.snackBar.open('Please login to add to cart', 'Close', {
        duration: 3000,
        horizontalPosition: 'end',
        verticalPosition: 'bottom',
      });
      return;
    }

    if (item.book.stock <= 0) {
      this.snackBar.open('This book is out of stock', 'Close', {
        duration: 3000,
        horizontalPosition: 'end',
        verticalPosition: 'bottom',
        panelClass: ['error-snackbar'],
      });
      return;
    }

    this.addingToCartId.set(item.bookId);

    this.cartService
      .addToCart({
        userId: user.id,
        bookId: item.bookId,
        quantity: 1,
      })
      .subscribe({
        next: () => {
          this.addingToCartId.set(null);
          this.snackBar.open(`Added "${item.book!.title}" to cart!`, 'View Cart', {
            duration: 5000,
            horizontalPosition: 'end',
            verticalPosition: 'bottom',
            panelClass: ['success-snackbar'],
          });
        },
        error: (err) => {
          this.addingToCartId.set(null);
          console.error('Error adding to cart:', err);
          const errorMessage = err?.error?.message || 'Failed to add to cart';
          this.snackBar.open(errorMessage, 'Close', {
            duration: 5000,
            horizontalPosition: 'end',
            verticalPosition: 'bottom',
            panelClass: ['error-snackbar'],
          });
        },
      });
  }

  /**
   * Handle image loading errors
   */
  onImageError(event: Event) {
    const img = event.target as HTMLImageElement;
    img.src = this.placeholderImage;
  }
}
