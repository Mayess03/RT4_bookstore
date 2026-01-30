import { Component, signal, inject, effect, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { WishlistService } from '../../../services/wishlist.service';
import { AuthService } from '../../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-wishlist-button',
  standalone: true,
  imports: [CommonModule, MatIconModule, MatButtonModule, MatSnackBarModule, MatTooltipModule],
  templateUrl: './wishlist-button.component.html',
  styleUrl: './wishlist-button.component.css',
})
export class WishlistButtonComponent {
  bookId = input<string>();

  private wishlistService = inject(WishlistService);
  private authService = inject(AuthService);
  private snackBar = inject(MatSnackBar);
  private router = inject(Router);

  isInWishlist = signal(false);
  loading = signal(false);
  isLoggedIn = this.authService.isLoggedIn;

  constructor() {
    effect(() => {
      const id = this.bookId();
      if (!id || !this.isLoggedIn()) return;

      this.wishlistService.getWishlist().subscribe({
        next: (items) => {
          this.isInWishlist.set(items.some((item) => item.bookId === id));
        },
        error: (err) => {
          console.error('Failed to check wishlist:', err);
        },
      });
    });
  }

  toggleWishlist() {
    if (!this.isLoggedIn()) {
      this.snackBar
        .open('Please login to add items to your wishlist', 'Login', {
          duration: 5000,
          horizontalPosition: 'end',
          verticalPosition: 'bottom',
        })
        .onAction()
        .subscribe(() => {
          this.router.navigate(['/login'], {
            queryParams: { returnUrl: this.router.url },
          });
        });
      return;
    }

    this.loading.set(true);
    const id = this.bookId();

    if (!id) {
      this.loading.set(false);
      return;
    }

    if (this.isInWishlist()) {
      this.wishlistService.removeBook(id).subscribe({
        next: () => {
          this.loading.set(false);
          this.isInWishlist.set(false);
          this.snackBar.open('Removed from wishlist', 'Close', {
            duration: 3000,
            horizontalPosition: 'end',
            verticalPosition: 'bottom',
            panelClass: ['success-snackbar'],
          });
        },
        error: (err) => {
          this.loading.set(false);
          console.error('Error removing from wishlist:', err);
          this.snackBar.open('Failed to remove from wishlist', 'Close', {
            duration: 3000,
            horizontalPosition: 'end',
            verticalPosition: 'bottom',
            panelClass: ['error-snackbar'],
          });
        },
      });
    } else {
      this.wishlistService.addBook(id).subscribe({
        next: () => {
          this.loading.set(false);
          this.isInWishlist.set(true);
          this.snackBar.open('Added to wishlist', 'Close', {
            duration: 3000,
            horizontalPosition: 'end',
            verticalPosition: 'bottom',
            panelClass: ['success-snackbar'],
          });
        },
        error: (err) => {
          this.loading.set(false);
          console.error('Error adding to wishlist:', err);
          this.snackBar.open('Failed to add to wishlist', 'Close', {
            duration: 3000,
            horizontalPosition: 'end',
            verticalPosition: 'bottom',
            panelClass: ['error-snackbar'],
          });
        },
      });
    }
  }
}
