import { Component, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatChipsModule } from '@angular/material/chips';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatTooltipModule } from '@angular/material/tooltip';
import { BooksService } from '../../../services/services/books.service';
import { Book } from '../../../models';

@Component({
  selector: 'app-admin-books',
  imports: [
    CommonModule,
    FormsModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatChipsModule,
    MatSnackBarModule,
    MatProgressSpinnerModule,
    MatPaginatorModule,
    MatTooltipModule
  ],
  templateUrl: './admin-books.html',
  styleUrl: './admin-books.css',
})
export class AdminBooks {
  // Signals for reactive state
  books = signal<Book[]>([]);
  categories = signal<Array<{ id: string; name: string }>>([]);
  isLoading = signal(false);
  searchTerm = signal('');
  selectedCategoryId = signal('');
  
  // Pagination
  page = signal(1);
  limit = signal(10);
  totalBooks = signal(0);
  
  // Table columns
  displayedColumns = ['coverImage', 'title', 'author', 'isbn', 'price', 'stock', 'category', 'status', 'actions'];
  
  // Computed for filtered books
  filteredBooks = computed(() => {
    return this.books();
  });

  constructor(
    private booksService: BooksService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {
    // Initialize data on component creation
    this.loadCategories();
    this.loadBooks();
  }

  loadBooks(): void {
    this.isLoading.set(true);
    
    const params: any = {
      page: this.page(),
      limit: this.limit()
    };

    // Add search term if exists and not empty
    const search = this.searchTerm().trim();
    if (search) {
      params.search = search;
    }

    // Add category filter if exists and not empty
    const categoryId = this.selectedCategoryId().trim();
    if (categoryId) {
      params.categoryId = categoryId;
    }
    
    this.booksService.getBooks(params).subscribe({
      next: (response) => {
        this.books.set(response.data);
        this.totalBooks.set(response.meta.total);
        this.isLoading.set(false);
      },
      error: (error) => {
        this.snackBar.open(error.error?.message || 'Failed to load books', 'Close', { duration: 3000 });
        this.isLoading.set(false);
      }
    });
  }

  loadCategories(): void {
    this.booksService.getCategories().subscribe({
      next: (categories) => {
        this.categories.set(categories);
      },
      error: (error) => {
        this.snackBar.open('Failed to load categories', 'Close', { duration: 3000 });
      }
    });
  }

  onSearch(): void {
    this.page.set(1);
    this.loadBooks();
  }

  onCategoryChange(): void {
    this.page.set(1);
    this.loadBooks();
  }

  onPageChange(event: PageEvent): void {
    this.page.set(event.pageIndex + 1);
    this.limit.set(event.pageSize);
    this.loadBooks();
  }

  openAddBookDialog(): void {
    import('./book-form-dialog/book-form-dialog').then(m => {
      const dialogRef = this.dialog.open(m.BookFormDialog, {
        width: '600px',
        data: { categories: this.categories() }
      });

      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          this.createBook(result);
        }
      });
    });
  }

  openEditBookDialog(book: Book): void {
    import('./book-form-dialog/book-form-dialog').then(m => {
      const dialogRef = this.dialog.open(m.BookFormDialog, {
        width: '600px',
        data: { book, categories: this.categories() }
      });

      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          this.updateBook(book.id, result);
        }
      });
    });
  }

  createBook(bookData: any): void {
    this.isLoading.set(true);
    
    this.booksService.createBook(bookData).subscribe({
      next: () => {
        this.snackBar.open('Book created successfully!', 'Close', { duration: 3000 });
        this.loadBooks();
      },
      error: (error) => {
        this.snackBar.open(error.error?.message || 'Failed to create book', 'Close', { duration: 3000 });
        this.isLoading.set(false);
      }
    });
  }

  updateBook(id: string, bookData: any): void {
    this.isLoading.set(true);
    
    this.booksService.updateBook(id, bookData).subscribe({
      next: () => {
        this.snackBar.open('Book updated successfully!', 'Close', { duration: 3000 });
        this.loadBooks();
      },
      error: (error) => {
        this.snackBar.open(error.error?.message || 'Failed to update book', 'Close', { duration: 3000 });
        this.isLoading.set(false);
      }
    });
  }

  deleteBook(book: Book): void {
    if (confirm(`Are you sure you want to delete "${book.title}"?`)) {
      this.isLoading.set(true);
      
      this.booksService.deleteBook(book.id).subscribe({
        next: () => {
          this.snackBar.open('Book deleted successfully!', 'Close', { duration: 3000 });
          this.loadBooks();
        },
        error: (error) => {
          this.snackBar.open(error.error?.message || 'Failed to delete book', 'Close', { duration: 3000 });
          this.isLoading.set(false);
        }
      });
    }
  }

  toggleBookStatus(book: Book): void {
    const newStatus = !book.isActive;
    
    this.booksService.toggleBookActive(book.id, newStatus).subscribe({
      next: () => {
        this.snackBar.open(`Book ${newStatus ? 'activated' : 'deactivated'} successfully!`, 'Close', { duration: 3000 });
        this.loadBooks();
      },
      error: (error) => {
        this.snackBar.open('Failed to update book status', 'Close', { duration: 3000 });
      }
    });
  }

  updateStock(book: Book): void {
    const newStock = prompt(`Enter new stock quantity for "${book.title}":`, book.stock.toString());
    
    if (newStock !== null) {
      const quantity = parseInt(newStock, 10);
      
      if (isNaN(quantity) || quantity < 0) {
        this.snackBar.open('Please enter a valid quantity', 'Close', { duration: 3000 });
        return;
      }
      
      this.booksService.updateBookStock(book.id, quantity).subscribe({
        next: () => {
          this.snackBar.open('Stock updated successfully!', 'Close', { duration: 3000 });
          this.loadBooks();
        },
        error: (error) => {
          this.snackBar.open('Failed to update stock', 'Close', { duration: 3000 });
        }
      });
    }
  }

  getCategoryName(categoryId?: string): string {
    if (!categoryId) return 'N/A';
    const category = this.categories().find(c => c.id === categoryId);
    return category?.name || 'Unknown';
  }
}

