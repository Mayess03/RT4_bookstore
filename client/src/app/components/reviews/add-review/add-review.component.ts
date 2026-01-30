import { Component, signal, inject, effect, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

import { ReviewsService } from '../../../services/reviews.service';
import { CreateReviewDto, UpdateReviewDto, Review } from '../../../models/review.model';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-add-review',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatIconModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatSnackBarModule,
  ],
  templateUrl: './add-review.component.html',
  styleUrl: './add-review.component.css',
})
export class AddReviewComponent {
  // ✅ Signal Input
  bookId = input<string>();
  // ✅ Signal Output
  reviewAdded = output<void>();

  private fb = inject(FormBuilder);
  private reviewsService = inject(ReviewsService);
  private snackBar = inject(MatSnackBar);
  private authService = inject(AuthService);

  form!: FormGroup;
  selectedRating = signal(0);
  submitting = signal(false);
  existingReview = signal<Review | null>(null);
  isUpdating = signal(false);
  loadingExisting = signal(true);

  constructor() {
    effect(() => {
      const id = this.bookId();
      if (!id) return;

      this.initForm();
      this.checkExistingReview(id);
    });
  }

  private initForm() {
    if (this.form) return;

    this.form = this.fb.group({
      rating: [0, [Validators.required, Validators.min(1), Validators.max(5)]],
      comment: ['', [Validators.maxLength(500)]],
    });
  }

  private checkExistingReview(bookId: string) {
    this.loadingExisting.set(true);
    this.existingReview.set(null);
    this.isUpdating.set(false);

    const currentUser = this.authService.currentUser();
    if (!currentUser) {
      this.loadingExisting.set(false);
      return;
    }

    this.reviewsService.getReviewsByBook(bookId).subscribe({
      next: (reviews) => {
        const userReview = reviews.find((r) => r.userId === currentUser.id);
        if (userReview) {
          this.existingReview.set(userReview);
          this.isUpdating.set(true);
          this.populateForm(userReview);
        }
        this.loadingExisting.set(false);
      },
      error: () => this.loadingExisting.set(false),
    });
  }

  private populateForm(review: Review) {
    this.selectedRating.set(review.rating);
    this.form.patchValue({
      rating: review.rating,
      comment: review.comment ?? '',
    });
  }

  setRating(rating: number) {
    this.selectedRating.set(rating);
    this.form.patchValue({ rating });
  }

  getStars(): boolean[] {
    return Array.from({ length: 5 }, (_, i) => i < this.selectedRating());
  }

  submitReview() {
    const bookId = this.bookId();
    if (!bookId) return;

    if (!this.form.valid) {
      this.snackBar.open('Please select a rating', 'Close', {
        duration: 3000,
        horizontalPosition: 'end',
        verticalPosition: 'bottom',
        panelClass: ['error-snackbar'],
      });
      return;
    }

    this.submitting.set(true);

    const dto = {
      rating: this.form.value.rating,
      comment: this.form.value.comment || undefined,
    };

    const request$ = this.isUpdating()
      ? this.reviewsService.updateReview(bookId, dto as UpdateReviewDto)
      : this.reviewsService.addReview(bookId, dto as CreateReviewDto);

    request$.subscribe({
      next: () => {
        this.submitting.set(false);
        this.snackBar.open(
          this.isUpdating() ? 'Review updated successfully!' : 'Review added successfully!',
          'Close',
          {
            duration: 3000,
            horizontalPosition: 'end',
            verticalPosition: 'bottom',
            panelClass: ['success-snackbar'],
          },
        );
        this.reviewAdded.emit();
        this.reviewsService.notifyReviewsChanged(bookId);
        if (!this.isUpdating()) this.resetForm();
      },
      error: (err) => {
        this.submitting.set(false);
        this.snackBar.open(err?.error?.message ?? 'Operation failed', 'Close', {
          duration: 5000,
          horizontalPosition: 'end',
          verticalPosition: 'bottom',
          panelClass: ['error-snackbar'],
        });
      },
    });
  }

  resetForm() {
    this.form.reset();
    this.selectedRating.set(0);
    this.isUpdating.set(false);
    this.existingReview.set(null);
  }

  cancel() {
    if (!this.isUpdating()) {
      this.resetForm();
      return;
    }

    if (!confirm('Do you want to delete your review?')) return;

    const bookId = this.bookId();
    if (!bookId) return;

    this.submitting.set(true);
    this.reviewsService.removeReview(bookId).subscribe({
      next: () => {
        this.submitting.set(false);
        this.resetForm();
        this.snackBar.open('Review deleted successfully', 'Close', {
          duration: 3000,
          horizontalPosition: 'end',
          verticalPosition: 'bottom',
          panelClass: ['success-snackbar'],
        });
        this.reviewAdded.emit();
        // Notify that reviews have changed
        this.reviewsService.notifyReviewsChanged(bookId);
      },
      error: () => {
        this.submitting.set(false);
        this.snackBar.open('Failed to delete review', 'Close', {
          duration: 3000,
          horizontalPosition: 'end',
          verticalPosition: 'bottom',
          panelClass: ['error-snackbar'],
        });
      },
    });
  }
}
