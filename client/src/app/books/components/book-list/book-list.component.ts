import { Component, OnInit, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { BooksService } from '../../services/books.service';
import { Book } from '../../../shared/models';
import { BookCardComponent } from '../../../shared/components/book-card/book-card.component';
import { LoadingComponent } from '../../../shared/components/loading/loading.component';

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
    BookCardComponent,
    LoadingComponent
  ],
  templateUrl: './book-list.component.html',
  styleUrl: './book-list.component.css'
})
export class BookListComponent implements OnInit {
  private booksService = inject(BooksService);

  // State using signals (Modern Angular best practice)
  books = signal<Book[]>([]);
  loading = signal(false);
  error = signal<string | null>(null);
  
  // Pagination signals
  currentPage = signal(1);
  totalBooks = signal(0);
  booksPerPage = 12;
  totalPages = signal(0);

  ngOnInit() {
    this.loadBooks();
  }

  /**
   * Load books from API
   */
  loadBooks() {
    this.loading.set(true);
    this.error.set(null);
    console.log('🔍 Loading books - page:', this.currentPage(), 'limit:', this.booksPerPage);

    this.booksService.getBooks({
      page: this.currentPage(),
      limit: this.booksPerPage
    }).subscribe({
      next: (response) => {
        console.log('✅ Books loaded successfully:', response);
        this.books.set(response.data);
        this.totalBooks.set(response.meta.total);
        this.totalPages.set(response.meta.totalPages);
        this.loading.set(false);
        console.log('📚 Books array:', this.books().length, 'books');
      },
      error: (err) => {
        console.error('❌ Error loading books:', err);
        this.error.set('Failed to load books. Please try again.');
        this.loading.set(false);
      }
    });
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
      this.loadBooks();
      window.scrollTo(0, 0); // Scroll to top
    }
  }

  /**
   * Go to previous page
   */
  previousPage() {
    if (this.currentPage() > 1) {
      this.currentPage.update(page => page - 1);
      this.loadBooks();
      window.scrollTo(0, 0);
    }
  }

  /**
   * Go to specific page
   */
  goToPage(page: number) {
    if (page >= 1 && page <= this.totalPages()) {
      this.currentPage.set(page);
      this.loadBooks();
      window.scrollTo(0, 0);
    }
  }
}
