import { Component, inject, signal, effect, computed } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { RouterLink, Router } from '@angular/router';
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
import { debounceTime, distinctUntilChanged, Subject, switchMap, map, tap } from 'rxjs';

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
  
  private searchSubject = new Subject<string>();
  private priceRangeSubject = new Subject<{ min: number | null; max: number | null }>();
  private booksLoad$ = new Subject<any>();
  private categoriesLoad$ = new Subject<void>();

  
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
  sortOrder = signal<'ASC' | 'DESC'>('ASC');

  // Cart loading state
  addingToCartBookId = signal<string | null>(null);

  canGoNext = computed(() => this.currentPage() < this.totalPages());
  canGoPrevious = computed(() => this.currentPage() > 1);
  
  hasActiveFilters = computed(() => 
    this.searchTerm() !== '' ||
    this.selectedCategory() !== 'all' ||
    this.minPrice() !== null ||
    this.maxPrice() !== null
  );

  // Reactive data streams
  categories = toSignal(
    this.categoriesLoad$.pipe(
      switchMap(() => this.booksService.getCategories()) // Appelle a l'api
    ),
    { initialValue: [] as Array<{ id: string; name: string }> }
  );

  books = toSignal(
    this.booksLoad$.pipe(
      tap(() => {
        this.loading.set(true);
        this.error.set(null);
      }),
      switchMap((params) => this.booksService.getBooks(params)),
      tap({
        next: (response) => {
          this.totalBooks.set(response.meta.total);
          this.totalPages.set(response.meta.totalPages);
          this.loading.set(false);
        },
        error: () => {
          this.error.set('Failed to load books. Please try again.');
          this.loading.set(false);
        }
      }),
      map((response) => response.data)
    ),
    { initialValue: [] as Book[] }
  );

  constructor() {
    this.categoriesLoad$.next();

    toSignal(
      this.searchSubject.pipe(
        debounceTime(500),
        distinctUntilChanged(),
        tap((searchValue) => {
          const trimmedSearch = searchValue.trim();
          this.searchTerm.set(trimmedSearch);
          this.currentPage.set(1);
          this.triggerBooksLoad();
        })
      )
    );

    toSignal(
      this.priceRangeSubject.pipe(
        debounceTime(500),
        distinctUntilChanged((prev, curr) => 
          prev.min === curr.min && prev.max === curr.max
        ),
        tap(({ min, max }) => {
          this.minPrice.set(min);
          this.maxPrice.set(max);
          this.currentPage.set(1);
          this.triggerBooksLoad();
        })
      )
    );

    this.triggerBooksLoad();
  }

  /**
   * Trigger books load with current filter params
   */
  triggerBooksLoad(scrollToTop: boolean = false) {
    const params: QueryBooksParams = {
      page: this.currentPage(),
      limit: this.booksPerPage,
      sortBy: this.sortBy() as any,
      order: this.sortOrder(),
    };

    // Add optional filters
    if (this.searchTerm()) {
      params.search = this.searchTerm();
    }
    if (this.selectedCategory() !== 'all') {
      params.categoryId = this.selectedCategory();
    }
    if (this.minPrice()) {
      params.minPrice = this.minPrice() ?? undefined;
    }
    if (this.maxPrice()) {
      params.maxPrice = this.maxPrice() ?? undefined;
    }

    this.booksLoad$.next(params);

   
    if (scrollToTop) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
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
    this.triggerBooksLoad();
  }

  /**
   * Handle price range filter - debounced
   */
  onPriceRangeChange(min: number | null, max: number | null) {
    this.priceRangeSubject.next({ min, max });
  }

  /**
   * Handle sort change
   */
  onSortChange(sortBy: string, sortOrder: 'ASC' | 'DESC') {
    this.sortBy.set(sortBy);
    this.sortOrder.set(sortOrder);
    this.triggerBooksLoad();
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
    this.triggerBooksLoad();
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
      this.triggerBooksLoad(true);
    }
  }

  /**
   * Go to previous page
   */
  previousPage() {
    if (this.currentPage() > 1) {
      this.currentPage.update((page) => page - 1);
      this.triggerBooksLoad(true);
    }
  }

  /**
   * Go to specific page
   */
  goToPage(page: number) {
    if (page >= 1 && page <= this.totalPages()) {
      this.currentPage.set(page);
      this.triggerBooksLoad(true);
    }
  }
}
