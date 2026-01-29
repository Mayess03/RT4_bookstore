import { Component, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  CategoryService,
  Category,
  CreateCategoryDto,
  CategoryStatsResponse
} from '../../../services/category.service';

@Component({
  selector: 'app-admin-categories',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-categories.html',
  styleUrls: ['./admin-categories.css']
})
export class AdminCategories implements OnInit {
  // Signals for synchronous state management
  categories = signal<Category[]>([]);
  loading = signal<boolean>(true);
  error = signal<string | null>(null);
  isModalOpen = signal<boolean>(false);
  editingCategory = signal<Category | null>(null);
  selectedCategoryStats = signal<CategoryStatsResponse | null>(null);
  isStatsModalOpen = signal<boolean>(false);
  // delete confirmation
  isDeleteModalOpen = signal(false);
  categoryToDelete = signal<{ id: string; name: string; booksCount: number } | null>(null);
  isDeleteAllowed = computed(() => (this.categoryToDelete()?.booksCount ?? 0) === 0);
  searchTerm = signal<string>(''); // new


  // Form data as signal
  formData = signal<CreateCategoryDto>({
    name: '',
    description: ''
  });

  // Computed signals
  modalTitle = computed(() =>
    this.editingCategory() ? 'Edit Category' : 'New Category'
  );

  submitButtonText = computed(() =>
    this.editingCategory() ? 'Update' : 'Create'
  );

  constructor(private categoryService: CategoryService) {}

  ngOnInit(): void {
    this.loadCategories();
  }

  /**
   * Load all categories with book count
   */
  loadCategories(): void {
    this.loading.set(true);
    this.categoryService.findAll(true).subscribe({
      next: (data) => {
        this.categories.set(data);
        this.error.set(null);
        this.loading.set(false);
      },
      error: (err) => {
        this.error.set(err.error?.message || 'Failed to load categories');
        this.loading.set(false);
      }
    });
  }
  filteredCategories = computed(() => {
    const term = this.searchTerm().toLowerCase();
    if (!term) return this.categories(); // no filter if empty
    return this.categories().filter(cat =>
      cat.name.toLowerCase().includes(term)
    );
  });

  /**
   * Open modal for create or edit
   */
  openModal(category?: Category): void {
    if (category) {
      this.editingCategory.set(category);
      this.formData.set({
        name: category.name,
        description: category.description || ''
      });
    } else {
      this.editingCategory.set(null);
      this.formData.set({ name: '', description: '' });
    }
    this.isModalOpen.set(true);
  }

  /**
   * Close create/edit modal
   */
  closeModal(): void {
    this.isModalOpen.set(false);
    this.editingCategory.set(null);
    this.formData.set({ name: '', description: '' });
  }

  /**
   * Submit form (create or update)
   */
  onSubmit(): void {
    const currentFormData = this.formData();
    const editingCat = this.editingCategory();

    if (editingCat) {
      // Update existing category
      this.categoryService.update(editingCat.id, currentFormData).subscribe({
        next: () => {
          this.loadCategories();
          this.closeModal();
        },
        error: (err) => {
          this.error.set(err.error?.message || 'Failed to update category');
        }
      });
    } else {
      // Create new category
      this.categoryService.create(currentFormData).subscribe({
        next: () => {
          this.loadCategories();
          this.closeModal();
        },
        error: (err) => {
          this.error.set(err.error?.message || 'Failed to create category');
        }
      });
    }
  }

  /**
   * Delete category
   */
  deleteCategory(id: string, name: string): void {
    if (!confirm(`Are you sure you want to delete "${name}"? This will fail if the category contains books.`)) {
      return;
    }

    this.categoryService.remove(id).subscribe({
      next: (response) => {
        this.loadCategories();
        // Show success message
        alert(response.message);
      },
      error: (err) => {
        this.error.set(err.error?.message || 'Failed to delete category');
      }
    });
  }
  openDeleteModal(id: string, name: string, booksCount: number): void {
    this.categoryToDelete.set({ id, name, booksCount });
    this.isDeleteModalOpen.set(true);
  }

  closeDeleteModal(): void {
    this.isDeleteModalOpen.set(false);
    this.categoryToDelete.set(null);
  }

  confirmDelete(): void {
    if (!this.isDeleteAllowed()) return; // safety check

    const cat = this.categoryToDelete();
    if (!cat) return;

    this.categoryService.remove(cat.id).subscribe({
      next: () => {
        this.loadCategories();
        this.closeDeleteModal();
      },
      error: (err) => {
        this.error.set(err.error?.message || 'Failed to delete category');
      }
    });
  }


  /**
   * Update form field
   */
  updateFormField(field: keyof CreateCategoryDto, value: string): void {
    this.formData.update(current => ({
      ...current,
      [field]: value
    }));
  }

  /**
   * View category statistics
   */
  viewStats(id: string): void {
    this.categoryService.getCategoryStats(id).subscribe({
      next: (stats) => {
        this.selectedCategoryStats.set(stats);
        this.isStatsModalOpen.set(true);
      },
      error: (err) => {
        this.error.set(err.error?.message || 'Failed to load statistics');
      }
    });
  }

  /**
   * Close statistics modal
   */
  closeStatsModal(): void {
    this.isStatsModalOpen.set(false);
    this.selectedCategoryStats.set(null);
  }
}
