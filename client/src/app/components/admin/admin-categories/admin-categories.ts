import { Component, signal, computed, effect, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { toSignal } from '@angular/core/rxjs-interop';
import { Subject, switchMap } from 'rxjs';
import { CategoryService } from '../../../services/category.service';
import { Category, CreateCategoryDto } from '../../../models';

@Component({
  selector: 'app-admin-categories',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-categories.html',
  styleUrls: ['./admin-categories.css']
})
export class AdminCategories {
  private categoryService = inject(CategoryService);

  loading = signal<boolean>(true);
  error = signal<string | null>(null);
  isModalOpen = signal<boolean>(false);
  editingCategory = signal<Category | undefined>(undefined);
  isStatsModalOpen = signal<boolean>(false);
  isDeleteModalOpen = signal(false);
  searchTerm = signal<string>('');

  formName = '';
  formDescription = '';

  categoryToDelete = signal<{ id: string; name: string; booksCount: number } | null>(null);

  private categoriesLoad$ = new Subject<void>();
  private categoryCreate$ = new Subject<CreateCategoryDto>();
  private categoryUpdate$ = new Subject<{ id: string; data: CreateCategoryDto }>();
  private categoryDelete$ = new Subject<string>();
  private statsLoad$ = new Subject<string>();

  categories = toSignal(
    this.categoriesLoad$.pipe(
      switchMap(() => {
        this.loading.set(true);
        this.error.set(null);
        return this.categoryService.findAll(true);
      })
    ),
    { initialValue: [] as Category[] }
  );

  categoryCreateResult = toSignal(
    this.categoryCreate$.pipe(
      switchMap((data) => this.categoryService.create(data))
    )
  );

  categoryUpdateResult = toSignal(
    this.categoryUpdate$.pipe(
      switchMap(({ id, data }) => this.categoryService.update(id, data))
    )
  );

  categoryDeleteResult = toSignal(
    this.categoryDelete$.pipe(
      switchMap((id) => this.categoryService.remove(id))
    )
  );

  selectedCategoryStats = toSignal(
    this.statsLoad$.pipe(
      switchMap((id) => this.categoryService.getCategoryStats(id))
    )
  );

  isDeleteAllowed = computed(() => (this.categoryToDelete()?.booksCount ?? 0) === 0);

  filteredCategories = computed(() => {
    const term = this.searchTerm().toLowerCase();
    if (!term) return this.categories();
    return this.categories().filter(cat =>
      cat.name.toLowerCase().includes(term)
    );
  });

  modalTitle = computed(() =>
    this.editingCategory() ? 'Edit Category' : 'New Category'
  );

  submitButtonText = computed(() =>
    this.editingCategory() ? 'Update' : 'Create'
  );

  constructor() {
    effect(() => {
      const cats = this.categories();
      if (cats) {
        this.loading.set(false);
      }
    });

    effect(() => {
      const result = this.categoryCreateResult();
      if (result) {
        this.categoriesLoad$.next();
        this.closeModal();
      }
    });

    effect(() => {
      const result = this.categoryUpdateResult();
      if (result) {
        this.categoriesLoad$.next();
        this.closeModal();
      }
    });

    effect(() => {
      const result = this.categoryDeleteResult();
      if (result) {
        this.categoriesLoad$.next();
        this.closeDeleteModal();
      }
    });

    effect(() => {
      const stats = this.selectedCategoryStats();
      if (stats) {
        this.isStatsModalOpen.set(true);
      }
    });

    this.categoriesLoad$.next();
  }

  openModal(category?: Category): void {
    if (category) {
      this.editingCategory.set(category);
      this.formName = category.name;
      this.formDescription = category.description || '';
    } else {
      this.editingCategory.set(undefined);
      this.formName = '';
      this.formDescription = '';
    }
    this.isModalOpen.set(true);
  }


  closeModal(): void {
    this.isModalOpen.set(false);
    this.editingCategory.set(undefined);
    this.formName = '';
    this.formDescription = '';
  }


  onSubmit(form: NgForm): void {
    if (form.invalid) return;

    const formData: CreateCategoryDto = {
      name: this.formName,
      description: this.formDescription
    };

    const editingCat = this.editingCategory();

    if (editingCat) {
      this.categoryUpdate$.next({ id: editingCat.id, data: formData });
    } else {
      this.categoryCreate$.next(formData);
    }
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
    if (!this.isDeleteAllowed()) return;

    const cat = this.categoryToDelete();
    if (!cat) return;

    this.categoryDelete$.next(cat.id);
  }


  viewStats(id: string): void {
    this.statsLoad$.next(id);
  }


  closeStatsModal(): void {
    this.isStatsModalOpen.set(false);
  }
}
