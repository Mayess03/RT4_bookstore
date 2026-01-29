import { Component, OnInit, inject, signal, effect } from '@angular/core';
import { RouterLink, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { BooksService } from '../../../services/services/books.service';
import { CartService } from '../../../services/cart.service';
import { AuthService } from '../../../services/auth.service';
import { Book } from '../../../models';
import { BookCardComponent } from '../../book-card/book-card.component';
import { LoadingComponent } from '../../loading/loading.component';
import { debounceTime, Subject } from 'rxjs';

/**
 * Book List Component
 *
 * Purpose: Display paginated grid of books
 * Features:
 * - Grid layout of book cards
 * - Pagination
 * - Loading state
 * - Error handling
 *
 * Used by: Dev 2 (Books module)
 */
@Component({
  selector: 'app-book-list',
  standalone: true,
  imports: [
    FormsModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatSnackBarModule,
    BookCardComponent,
  ],
  templateUrl: './book-list.component.html',
  styleUrl: './book-list.component.css',
})
export class BookListComponent implements OnInit {
  private booksService = inject(BooksService);
  private cartService = inject(CartService);
  private authService = inject(AuthService);
  private router = inject(Router);
  private snackBar = inject(MatSnackBar);
  private searchSubject = new Subject<string>();

  // State using signals (Modern Angular best practice)
  books = signal<Book[]>([]);
  loading = signal(false);
  error = signal<string | null>(null);

  // Pagination signals
  currentPage = signal(1);
  totalBooks = signal(0);
  booksPerPage = 12;
  totalPages = signal(0);

  // Filter & Search signals
  searchTerm = signal('');
  selectedCategory = signal<string>('all');
  minPrice = signal<number | null>(null);
  maxPrice = signal<number | null>(null);
  sortBy = signal<string>('title');
  sortOrder = signal<'ASC' | 'DESC'>('ASC'); // Backend expects uppercase
  categories = signal<Array<{ id: string; name: string }>>([]);

  // Cart loading state
  addingToCartBookId = signal<string | null>(null);

  ngOnInit() {
    this.loadCategories();
    this.loadBooks();

    // Debounce search input - wait 750ms after user stops typing
    this.searchSubject.pipe(debounceTime(750)).subscribe((searchValue) => {
      // Trim whitespace to avoid strict matching issues
      const trimmedSearch = searchValue.trim();
      this.searchTerm.set(trimmedSearch);
      this.currentPage.set(1);
      this.loadBooks();
    });
  }

  /**
   * Load available categories
   */
  loadCategories() {
    this.booksService.getCategories().subscribe({
      next: (categories) => {
        this.categories.set(categories);
      },
      error: (err) => {
        console.error('Failed to load categories:', err);
      },
    });
  }

  /**
   * Load books from API with current filters
   */
  loadBooks(scrollToTop: boolean = false) {
    this.loading.set(true);
    this.error.set(null);

    // Build params matching backend QueryBookDto
    const params: any = {
      page: this.currentPage(),
      limit: this.booksPerPage,
      sortBy: this.sortBy(),
      order: this.sortOrder(), // Backend expects 'order', not 'sortOrder'
    };

    // Add optional filters
    if (this.searchTerm()) {
      params.search = this.searchTerm();
    }
    if (this.selectedCategory() !== 'all') {
      params.categoryId = this.selectedCategory(); // Backend expects categoryId (UUID)
    }
    if (this.minPrice()) {
      params.minPrice = this.minPrice();
    }
    if (this.maxPrice()) {
      params.maxPrice = this.maxPrice();
    }

    this.booksService.getBooks(params).subscribe({
      next: (response) => {
        this.books.set(response.data);
        this.totalBooks.set(response.meta.total);
        this.totalPages.set(response.meta.totalPages);
        this.loading.set(false);

        // Only scroll to top on pagination, not on filters
        if (scrollToTop) {
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }
      },
      error: (err) => {
        console.error('❌ Error loading books:', err);
        this.error.set('Failed to load books. Please try again.');
        this.loading.set(false);
      },
    });
  }

  /**
   * Handle search input - debounced
   */
  onSearch(searchValue: string) {
    // Don't call API immediately - let debounce handle it
    this.searchSubject.next(searchValue);
  }

  /**
   * Handle category filter change
   */
  onCategoryChange(category: string) {
    this.selectedCategory.set(category);
    this.currentPage.set(1);
    this.loadBooks();
  }

  /**
   * Handle price range filter
   */
  onPriceRangeChange(min: number | null, max: number | null) {
    this.minPrice.set(min);
    this.maxPrice.set(max);
    this.currentPage.set(1);
    this.loadBooks();
  }

  /**
   * Handle sort change
   */
  onSortChange(sortBy: string, sortOrder: 'ASC' | 'DESC') {
    this.sortBy.set(sortBy);
    this.sortOrder.set(sortOrder);
    this.loadBooks();
  }

  /**
   * Clear all filters
   */
  clearFilters() {
    this.searchTerm.set('');
    this.selectedCategory.set('all');
    this.minPrice.set(null);
    this.maxPrice.set(null);
    this.sortBy.set('title');
    this.sortOrder.set('ASC');
    this.currentPage.set(1);
    this.loadBooks();
  }

  /**
   * Handle add to cart event from book card
   */
  onAddToCart(book: Book) {
    // Check if user is logged in
    if (!this.authService.isLoggedIn()) {
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

    const user = this.authService.getCurrentUser();
    if (!user?.id) {
      this.snackBar.open('Error: User not found', 'Close', {
        duration: 5000,
        horizontalPosition: 'end',
        verticalPosition: 'bottom',
        panelClass: ['error-snackbar'],
      });
      return;
    }

    this.addingToCartBookId.set(book.id);

    this.cartService
      .addToCart({
        userId: user.id,
        bookId: book.id,
        quantity: 1,
      })
      .subscribe({
        next: () => {
          this.addingToCartBookId.set(null);
          this.snackBar
            .open(`Added "${book.title}" to cart!`, 'View Cart', {
              duration: 5000,
              horizontalPosition: 'end',
              verticalPosition: 'bottom',
              panelClass: ['success-snackbar'],
            })
            .onAction()
            .subscribe(() => {
              this.router.navigate(['/cart']);
            });
        },
        error: (error) => {
          this.addingToCartBookId.set(null);
          console.error('Error adding to cart:', error);
          const errorMessage = error?.error?.message || 'Failed to add to cart';
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
   * Go to next page
   */
  nextPage() {
    if (this.currentPage() < this.totalPages()) {
      this.currentPage.update((page) => page + 1);
      this.loadBooks(true); // Scroll to top on pagination
    }
  }

  /**
   * Go to previous page
   */
  previousPage() {
    if (this.currentPage() > 1) {
      this.currentPage.update((page) => page - 1);
      this.loadBooks(true); // Scroll to top on pagination
    }
  }

  /**
   * Go to specific page
   */
  goToPage(page: number) {
    if (page >= 1 && page <= this.totalPages()) {
      this.currentPage.set(page);
      this.loadBooks(true); // Scroll to top on pagination
    }
  }
}
