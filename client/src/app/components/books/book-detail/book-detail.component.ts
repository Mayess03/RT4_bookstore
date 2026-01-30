import { Component, inject, signal, ViewChild } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { BooksService } from '../../../services/services/books.service';
import { CartService } from '../../../services/cart.service';
import { Book } from '../../../models';
import { AuthService } from '../../../services/auth.service';
import { ReviewListComponent } from '../../reviews/review-list/review-list.component';
import { AddReviewComponent } from '../../reviews/add-review/add-review.component';
import { WishlistButtonComponent } from '../../wishlist/wishlist-button/wishlist-button.component';

/**
 * Book Detail Component
 *
 * Purpose: Display full details of a single book
 * Features:
 * - Large cover image with fallback
 * - Complete book information
 * - Stock status
 * - Add to cart functionality
 * - Back navigation
 *
 * Used by: Dev 2 (Books module)
 * Modern Angular 21: Uses inject() and constructor initialization
 */
@Component({
  selector: 'app-book-detail',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    MatIconModule,
    MatButtonModule,
    MatDividerModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
    ReviewListComponent,
    AddReviewComponent,
    WishlistButtonComponent,
  ],
  templateUrl: './book-detail.component.html',
  styleUrl: './book-detail.component.css',
})
export class BookDetailComponent {
  private route = inject(ActivatedRoute);
  router = inject(Router);
  private booksService = inject(BooksService);
  private authService = inject(AuthService);
  private cartService = inject(CartService);
  private snackBar = inject(MatSnackBar);

  // State
  book = signal<Book | null>(null);
  loading = signal(true);
  error = signal<string | null>(null);
  quantity = signal(1);
  isLoggedIn = this.authService.isLoggedIn;
  isAddingToCart = signal(false);
  refreshKey = signal(0); // Key to trigger review list refresh

  // Placeholder for missing covers
  readonly placeholderImage =
    'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjYwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iNDAwIiBoZWlnaHQ9IjYwMCIgZmlsbD0iI2YwZjBmMCIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMjQiIGZpbGw9IiM5OTk5OTkiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIj5ObyBDb3ZlcjwvdGV4dD48L3N2Zz4=';

  constructor() {
    // Load book data on component creation
    const bookId = this.route.snapshot.paramMap.get('id');
    if (bookId) {
      this.loadBook(bookId);
    } else {
      this.error.set('Invalid book ID');
      this.loading.set(false);
    }
  }

  /**
   * Load book details from API
   */
  loadBook(id: string) {
    this.loading.set(true);
    this.error.set(null);

    this.booksService.getBookById(id).subscribe({
      next: (book) => {
        this.book.set(book);
        this.loading.set(false);
      },
      error: (err) => {
        console.error('Failed to load book:', err);
        this.error.set('Failed to load book details. Please try again.');
        this.loading.set(false);
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

  /**
   * Increase quantity
   */
  increaseQuantity() {
    const currentBook = this.book();
    if (currentBook && this.quantity() < currentBook.stock) {
      this.quantity.update((q) => q + 1);
    }
  }

  /**
   * Decrease quantity
   */
  decreaseQuantity() {
    if (this.quantity() > 1) {
      this.quantity.update((q) => q - 1);
    }
  }

  /**
   * Add to cart
   */
  onAddToCart() {
    // Check if user is logged in
    if (!this.isLoggedIn()) {
      this.snackBar
        .open('Please login to add items to your cart', 'Login', {
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

    const currentBook = this.book();
    const user = this.authService.currentUser();

    if (!currentBook || !user?.id) {
      this.snackBar.open('Error adding to cart', 'Close', {
        duration: 5000,
        horizontalPosition: 'end',
        verticalPosition: 'bottom',
        panelClass: ['error-snackbar'],
      });
      return;
    }

    this.isAddingToCart.set(true);

    this.cartService
      .addToCart({
        userId: user.id,
        bookId: currentBook.id,
        quantity: this.quantity(),
      })
      .subscribe({
        next: (cartItem) => {
          this.isAddingToCart.set(false);
          this.snackBar
            .open(`Added ${this.quantity()} x "${currentBook.title}" to cart!`, 'View Cart', {
              duration: 5000,
              horizontalPosition: 'end',
              verticalPosition: 'bottom',
              panelClass: ['success-snackbar'],
            })
            .onAction()
            .subscribe(() => {
              this.router.navigate(['/cart']);
            });

          // Reset quantity
          this.quantity.set(1);
        },
        error: (error) => {
          this.isAddingToCart.set(false);
          console.error('Error adding to cart:', error);
          const errorMessage = error?.error?.message || 'Failed to add to cart. Please try again.';
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
   * Navigate back to books list
   */
  goBack() {
    this.router.navigate(['/books']);
  }

  /**
   * Refresh reviews list after adding a review
   */
  onReviewAdded() {
    // Increment to trigger re-render via ngOnChanges in review-list
    this.refreshKey.update((k) => k + 1);
  }
}
