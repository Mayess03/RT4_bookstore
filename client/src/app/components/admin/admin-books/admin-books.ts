import { Component, signal, computed, inject, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { toSignal } from '@angular/core/rxjs-interop';
import { Subject, switchMap, tap, debounceTime, distinctUntilChanged } from 'rxjs';
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

  private booksLoad$ = new Subject<any>();
  private categoriesLoad$ = new Subject<void>();
  private searchSubject$ = new Subject<string>();

  searchTerm = signal('');
  selectedCategoryId = signal('');
  page = signal(1);
  limit = signal(10);
  totalBooks = signal(0);
  isLoading = signal(false);
  
  displayedColumns = ['coverImage', 'title', 'author', 'isbn', 'price', 'stock', 'category', 'status', 'actions'];

  categories = toSignal(
    this.categoriesLoad$.pipe(
      switchMap(() => this.booksService.getCategories())
    ),
    { initialValue: [] as Array<{ id: string; name: string }> }
  );

  books = toSignal(
    this.booksLoad$.pipe(
      tap(() => this.isLoading.set(true)),
      switchMap((params) => this.booksService.getBooks(params)),
      tap((response) => {
        this.totalBooks.set(response.meta.total);
        this.isLoading.set(false);
      })
    ),
    { initialValue: { data: [], meta: { total: 0, page: 1, limit: 10, totalPages: 0 } } }
  );

  booksData = computed(() => this.books()?.data || []);

  constructor() {
    this.categoriesLoad$.next();
    
    toSignal(
      this.searchSubject$.pipe(
        debounceTime(500),
        distinctUntilChanged(),
        tap((searchValue) => {
          this.searchTerm.set(searchValue);
          this.page.set(1);
          this.triggerBooksLoad();
        })
      )
    );
    
    this.triggerBooksLoad();
  }

  triggerBooksLoad(): void {
    const params: any = {
      page: this.page(),
      limit: this.limit()
    };

    const search = this.searchTerm().trim();
    if (search) {
      params.search = search;
    }

    const categoryId = this.selectedCategoryId().trim();
    if (categoryId) {
      params.categoryId = categoryId;
    }

    this.booksLoad$.next(params);
  }

  onSearch(searchValue: string): void {
    this.searchSubject$.next(searchValue);
  }

  onCategoryChange(): void {
    this.page.set(1);
    this.triggerBooksLoad();
  }

  onPageChange(event: PageEvent): void {
    this.page.set(event.pageIndex + 1);
    this.limit.set(event.pageSize);
    this.triggerBooksLoad();
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
        this.triggerBooksLoad();
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
        this.triggerBooksLoad();
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
          this.triggerBooksLoad();
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
        this.triggerBooksLoad();
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
          this.triggerBooksLoad();
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

