import { Component, OnInit, inject, signal, effect } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { BooksService } from '../../services/books.service';
import { Book } from '../../../shared/models';
import { BookCardComponent } from '../../../shared/components/book-card/book-card.component';
import { LoadingComponent } from '../../../shared/components/loading/loading.component';
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
    RouterLink,
    FormsModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    BookCardComponent,
    LoadingComponent
  ],
  templateUrl: './book-list.component.html',
  styleUrl: './book-list.component.css'
})
export class BookListComponent implements OnInit {
  private booksService = inject(BooksService);
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

  ngOnInit() {
    this.loadCategories();
    this.loadBooks();
    
    // Debounce search input - wait 750ms after user stops typing
    this.searchSubject.pipe(
      debounceTime(750)
    ).subscribe(searchValue => {
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
      }
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
      order: this.sortOrder() // Backend expects 'order', not 'sortOrder'
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
      }
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
    // TODO: Implement cart service integration
    console.log('Add to cart:', book);
    alert(`Added "${book.title}" to cart!`);
  }

  /**
   * Go to next page
   */
  nextPage() {
    if (this.currentPage() < this.totalPages()) {
      this.currentPage.update(page => page + 1);
      this.loadBooks(true); // Scroll to top on pagination
    }
  }

  /**
   * Go to previous page
   */
  previousPage() {
    if (this.currentPage() > 1) {
      this.currentPage.update(page => page - 1);
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
