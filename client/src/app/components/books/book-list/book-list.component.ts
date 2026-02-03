import { Component, inject, signal, effect, computed } from '@angular/core';
import { Router } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { BooksService } from '../../../services/books.service';
import { CartService } from '../../../services/cart.service';
import { AuthService } from '../../../services/auth.service';
import { Book, QueryBooksParams } from '../../../models';
import { BookCardComponent } from '../../book-card/book-card.component';
import { LoadingComponent } from '../../loading/loading.component';

/**
 * Book List Component
 *
 * Purpose: Display paginated grid of books
 * Features:
 * - Grid layout of book cards
 * - Pagination
 * - Loading state
 * - Error handling
 */
@Component({
  selector: 'app-book-list',
  standalone: true,
  imports: [
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
export class BookListComponent {
  private booksService = inject(BooksService);
  private cartService = inject(CartService);
  private authService = inject(AuthService);
  private router = inject(Router);
  private snackBar = inject(MatSnackBar);

  loading = signal(false);
  error = signal<string | null>(null);
  books = signal<Book[]>([]);
  categories = signal<Array<{ id: string; name: string }>>([]);

  currentPage = signal(1);
  totalBooks = signal(0);
  booksPerPage = 12;
  totalPages = signal(0);

  searchTerm = signal('');
  selectedCategory = signal<string>('all');
  minPrice = signal<number | null>(null);
  maxPrice = signal<number | null>(null);
  sortBy = signal<string>('title');
  sortOrder = signal<'ASC' | 'DESC'>('ASC');

  addingToCartBookId = signal<string | null>(null);

  private searchDebounce = signal<string>('');
  private priceDebounce = signal<{ min: number | null; max: number | null }>({ min: null, max: null });
  private debounceTimer: any;

  canGoNext = computed(() => this.currentPage() < this.totalPages());
  canGoPrevious = computed(() => this.currentPage() > 1);
  
  hasActiveFilters = computed(() => 
    this.searchTerm() !== '' ||
    this.selectedCategory() !== 'all' ||
    this.minPrice() !== null ||
    this.maxPrice() !== null
  );

  private queryParams = computed<QueryBooksParams>(() => {
    const params: QueryBooksParams = {
      page: this.currentPage(),
      limit: this.booksPerPage,
      sortBy: this.sortBy() as any,
      order: this.sortOrder(),
    };

    if (this.searchDebounce()) params.search = this.searchDebounce();
    if (this.selectedCategory() !== 'all') params.categoryId = this.selectedCategory();
    if (this.priceDebounce().min) params.minPrice = this.priceDebounce().min ?? undefined;
    if (this.priceDebounce().max) params.maxPrice = this.priceDebounce().max ?? undefined;

    return params;
  });

  constructor() {
    this.loadCategories();

    effect(() => {
      const params = this.queryParams();
      this.loadBooks(params);
    });
  }

  private async loadCategories() {
    try {
      const cats = await this.booksService.getCategories().toPromise();
      this.categories.set(cats || []);
    } catch (error) {
      console.error('Failed to load categories', error);
    }
  }

  private async loadBooks(params: QueryBooksParams) {
    try {
      this.loading.set(true);
      this.error.set(null);
      const response = await this.booksService.getBooks(params).toPromise();
      if (response) {
        this.books.set(response.data);
        this.totalBooks.set(response.meta.total);
        this.totalPages.set(response.meta.totalPages);
      }
    } catch (error) {
      this.error.set('Failed to load books. Please try again.');
    } finally {
      this.loading.set(false);
    }
  }

  onSearch(searchValue: string) {
    this.searchTerm.set(searchValue);
    this.currentPage.set(1);
    clearTimeout(this.debounceTimer);
    this.debounceTimer = setTimeout(() => {
      this.searchDebounce.set(searchValue.trim());
    }, 750);
  }

  onCategoryChange(category: string) {
    this.selectedCategory.set(category);
    this.currentPage.set(1);
  }

  onPriceRangeChange(min: number | null, max: number | null) {
    this.minPrice.set(min);
    this.maxPrice.set(max);
    this.currentPage.set(1);
    clearTimeout(this.debounceTimer);
    this.debounceTimer = setTimeout(() => {
      this.priceDebounce.set({ min, max });
    }, 750);
  }

  onSortChange(sortBy: string, sortOrder: 'ASC' | 'DESC') {
    this.sortBy.set(sortBy);
    this.sortOrder.set(sortOrder);
  }

  clearFilters() {
    this.searchTerm.set('');
    this.searchDebounce.set('');
    this.selectedCategory.set('all');
    this.minPrice.set(null);
    this.maxPrice.set(null);
    this.priceDebounce.set({ min: null, max: null });
    this.sortBy.set('title');
    this.sortOrder.set('ASC');
    this.currentPage.set(1);
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
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  /**
   * Go to previous page
   */
  previousPage() {
    if (this.currentPage() > 1) {
      this.currentPage.update((page) => page - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  /**
   * Go to specific page
   */
  goToPage(page: number) {
    if (page >= 1 && page <= this.totalPages()) {
      this.currentPage.set(page);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }
}
