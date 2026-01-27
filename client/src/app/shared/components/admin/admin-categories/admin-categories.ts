import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTooltipModule } from '@angular/material/tooltip';
import { CategoryService, Category } from '../../../services/category.service';
import { CategoryDialogComponent } from './category-dialog/category-dialog.component';

@Component({
  selector: 'app-admin-categories',
  imports: [
    CommonModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatDialogModule,
    MatSnackBarModule,
    MatProgressSpinnerModule,
    MatTooltipModule
  ],
  templateUrl: './admin-categories.html',
  styleUrl: './admin-categories.css',
})
export class AdminCategories implements OnInit {
  categories = signal<Category[]>([]);
  isLoading = signal(false);
  displayedColumns = ['name', 'description', 'actions'];

  constructor(
    private categoryService: CategoryService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.loadCategories();
  }

  loadCategories(): void {
    this.isLoading.set(true);
    this.categoryService.getAllCategories().subscribe({
      next: (categories) => {
        this.categories.set(categories);
        this.isLoading.set(false);
      },
      error: (error) => {
        console.error('Error loading categories:', error);
        this.snackBar.open('Failed to load categories', 'Close', { duration: 3000 });
        this.isLoading.set(false);
      }
    });
  }

  openCreateDialog(): void {
    const dialogRef = this.dialog.open(CategoryDialogComponent, {
      width: '500px',
      data: { category: null }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.createCategory(result);
      }
    });
  }

  openEditDialog(category: Category): void {
    const dialogRef = this.dialog.open(CategoryDialogComponent, {
      width: '500px',
      data: { category }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.updateCategory(category.id, result);
      }
    });
  }

  createCategory(categoryData: any): void {
    this.categoryService.createCategory(categoryData).subscribe({
      next: () => {
        this.snackBar.open('Category created successfully', 'Close', { duration: 3000 });
        this.loadCategories();
      },
      error: (error) => {
        console.error('Error creating category:', error);
        this.snackBar.open(error.error?.message || 'Failed to create category', 'Close', { duration: 3000 });
      }
    });
  }

  updateCategory(id: string, categoryData: any): void {
    this.categoryService.updateCategory(id, categoryData).subscribe({
      next: () => {
        this.snackBar.open('Category updated successfully', 'Close', { duration: 3000 });
        this.loadCategories();
      },
      error: (error) => {
        console.error('Error updating category:', error);
        this.snackBar.open(error.error?.message || 'Failed to update category', 'Close', { duration: 3000 });
      }
    });
  }

  deleteCategory(category: Category): void {
    if (confirm(`Are you sure you want to delete "${category.name}"?`)) {
      this.categoryService.deleteCategory(category.id).subscribe({
        next: () => {
          this.snackBar.open('Category deleted successfully', 'Close', { duration: 3000 });
          this.loadCategories();
        },
        error: (error) => {
          console.error('Error deleting category:', error);
          this.snackBar.open(error.error?.message || 'Failed to delete category', 'Close', { duration: 3000 });
        }
      });
    }
  }
}
