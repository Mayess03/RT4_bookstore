import { Component, signal, computed, inject, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { firstValueFrom } from 'rxjs';
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
import { BooksService } from '../../../services/books.service';
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
  private booksService = inject(BooksService);
  private dialog = inject(MatDialog);
  private snackBar = inject(MatSnackBar);

  searchTerm = signal('');
  selectedCategoryId = signal('');
  page = signal(1);
  limit = signal(10);
  totalBooks = signal(0);
  isLoading = signal(false);
  books = signal<any>({ data: [], meta: { total: 0, page: 1, limit: 10, totalPages: 0 } });
  categories = signal<Array<{ id: string; name: string }>>([]);
  
  private searchDebounce = signal('');
  private debounceTimer: any;
  
  displayedColumns = ['coverImage', 'title', 'author', 'isbn', 'price', 'stock', 'category', 'status', 'actions'];

  booksData = computed(() => this.books()?.data || []);

  private queryParams = computed(() => {
    const params: any = {
      page: this.page(),
      limit: this.limit()
    };

    const search = this.searchDebounce().trim();
    if (search) params.search = search;

    const categoryId = this.selectedCategoryId().trim();
    if (categoryId) params.categoryId = categoryId;

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
      const cats = await firstValueFrom(this.booksService.getCategories());
      this.categories.set(cats || []);
    } catch (error) {
      console.error('Failed to load categories', error);
    }
  }

  private async loadBooks(params: any) {
    try {
      this.isLoading.set(true);
      const response = await firstValueFrom(this.booksService.getBooks(params));
      if (response) {
        this.books.set(response);
        this.totalBooks.set(response.meta.total);
      }
    } catch (error) {
      console.error('Failed to load books', error);
    } finally {
      this.isLoading.set(false);
    }
  }

  onSearch(searchValue: string): void {
    this.searchTerm.set(searchValue);
    this.page.set(1);
    clearTimeout(this.debounceTimer);
    this.debounceTimer = setTimeout(() => {
      this.searchDebounce.set(searchValue);
    }, 500);
  }

  onCategoryChange(): void {
    this.page.set(1);
  }

  onPageChange(event: PageEvent): void {
    this.page.set(event.pageIndex + 1);
    this.limit.set(event.pageSize);
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
    this.booksService.createBook(bookData).subscribe({
      next: () => {
        this.snackBar.open('Book created successfully!', 'Close', { duration: 3000 });
        this.page.set(1);
      },
      error: (error) => {
        this.snackBar.open(error.error?.message || 'Failed to create book', 'Close', { duration: 3000 });
      }
    });
  }

  updateBook(id: string, bookData: any): void {
    this.booksService.updateBook(id, bookData).subscribe({
      next: () => {
        this.snackBar.open('Book updated successfully!', 'Close', { duration: 3000 });
        const currentBooks = this.books();
        const updatedBooks = {
          ...currentBooks,
          data: currentBooks.data.map((b: Book) => b.id === id ? { ...b, ...bookData } : b)
        };
        this.books.set(updatedBooks);
      },
      error: (error) => {
        this.snackBar.open(error.error?.message || 'Failed to update book', 'Close', { duration: 3000 });
      }
    });
  }

  deleteBook(book: Book): void {
    if (confirm(`Are you sure you want to delete "${book.title}"?`)) {
      this.booksService.deleteBook(book.id).subscribe({
        next: () => {
          this.snackBar.open('Book deleted successfully!', 'Close', { duration: 3000 });
          const currentBooks = this.books();
          const updatedBooks = {
            ...currentBooks,
            data: currentBooks.data.filter((b: Book) => b.id !== book.id)
          };
          this.books.set(updatedBooks);
        },
        error: (error) => {
          this.snackBar.open(error.error?.message || 'Failed to delete book', 'Close', { duration: 3000 });
        }
      });
    }
  }

  toggleBookStatus(book: Book): void {
    const newStatus = !book.isActive;
    
    this.booksService.toggleBookActive(book.id, newStatus).subscribe({
      next: () => {
        this.snackBar.open(`Book ${newStatus ? 'activated' : 'deactivated'} successfully!`, 'Close', { duration: 3000 });
        const currentBooks = this.books();
        const updatedBooks = {
          ...currentBooks,
          data: currentBooks.data.map((b: Book) => b.id === book.id ? { ...b, isActive: newStatus } : b)
        };
        this.books.set(updatedBooks);
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
          const currentBooks = this.books();
          const updatedBooks = {
            ...currentBooks,
            data: currentBooks.data.map((b: Book) => b.id === book.id ? { ...b, stock: quantity } : b)
          };
          this.books.set(updatedBooks);
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

