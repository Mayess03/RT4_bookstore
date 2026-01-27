import { Component, Input, Output, EventEmitter, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { ReviewsService } from '../../services/reviews.service';
import { CreateReviewDto, UpdateReviewDto, Review } from '../../../shared/models/review.model';
import { AuthService } from '../../../shared/services/auth.service';

/**
 * Add Review Component
 *
 * Purpose: Display form for user to add/update a review to a book
 * Features:
 * - Star rating selector (1-5)
 * - Optional comment textarea
 * - Submit and cancel buttons
 * - Loading state during submission
 * - Check for existing review and allow updates
 * - Emits refresh event on successful submission
 */
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
export class AddReviewComponent implements OnInit {
  @Input() bookId: string = '';
  @Output() reviewAdded = new EventEmitter<void>();

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

  ngOnInit() {
    this.initForm();
    this.checkExistingReview();
  }

  /**
   * Check if user already has a review for this book
   */
  checkExistingReview() {
    this.loadingExisting.set(true);
    const currentUser = this.authService.currentUser();

    if (!currentUser) {
      this.loadingExisting.set(false);
      return;
    }

    this.reviewsService.getReviewsByBook(this.bookId).subscribe({
      next: (reviews) => {
        const userReview = reviews.find((r) => r.userId === currentUser.id);
        if (userReview) {
          this.existingReview.set(userReview);
          this.isUpdating.set(true);
          this.populateForm(userReview);
        }
        this.loadingExisting.set(false);
      },
      error: () => {
        this.loadingExisting.set(false);
      },
    });
  }

  /**
   * Populate form with existing review data
   */
  populateForm(review: Review) {
    this.selectedRating.set(review.rating);
    this.form.patchValue({
      rating: review.rating,
      comment: review.comment || '',
    });
  }

  /**
   * Initialize the form
   */
  initForm() {
    this.form = this.fb.group({
      rating: [0, [Validators.required, Validators.min(1), Validators.max(5)]],
      comment: ['', [Validators.maxLength(500)]],
    });
  }

  /**
   * Set rating and update form
   */
  setRating(rating: number) {
    this.selectedRating.set(rating);
    this.form.patchValue({ rating });
  }

  /**
   * Get array for star display
   */
  getStars(): boolean[] {
    return Array(5)
      .fill(false)
      .map((_, i) => i < this.selectedRating());
  }

  /**
   * Submit review (add or update)
   */
  submitReview() {
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

    if (this.isUpdating()) {
      // Update existing review
      const dto: UpdateReviewDto = {
        rating: this.form.value.rating,
        comment: this.form.value.comment || undefined,
      };

      this.reviewsService.updateReview(this.bookId, dto).subscribe({
        next: () => {
          this.submitting.set(false);
          this.snackBar.open('Review updated successfully!', 'Close', {
            duration: 3000,
            horizontalPosition: 'end',
            verticalPosition: 'bottom',
            panelClass: ['success-snackbar'],
          });
          this.reviewAdded.emit();
        },
        error: (err) => {
          this.submitting.set(false);
          console.error('Error updating review:', err);
          this.snackBar.open('Failed to update review', 'Close', {
            duration: 5000,
            horizontalPosition: 'end',
            verticalPosition: 'bottom',
            panelClass: ['error-snackbar'],
          });
        },
      });
    } else {
      // Add new review
      const dto: CreateReviewDto = {
        rating: this.form.value.rating,
        comment: this.form.value.comment || undefined,
      };

      this.reviewsService.addReview(this.bookId, dto).subscribe({
        next: () => {
          this.submitting.set(false);
          this.snackBar.open('Review added successfully!', 'Close', {
            duration: 3000,
            horizontalPosition: 'end',
            verticalPosition: 'bottom',
            panelClass: ['success-snackbar'],
          });
          this.existingReview.set(null);
          this.isUpdating.set(false);
          this.resetForm();
          this.reviewAdded.emit();
        },
        error: (err) => {
          this.submitting.set(false);
          console.error('Error adding review:', err);

          let errorMessage = 'Failed to add review';
          if (err?.error?.message) {
            errorMessage = err.error.message;
          }

          this.snackBar.open(errorMessage, 'Close', {
            duration: 5000,
            horizontalPosition: 'end',
            verticalPosition: 'bottom',
            panelClass: ['error-snackbar'],
          });
        },
      });
    }
  }

  /**
   * Reset form to initial state
   */
  resetForm() {
    this.form.reset();
    this.selectedRating.set(0);
  }

  /**
   * Cancel and reset form or delete review
   */
  cancel() {
    if (this.isUpdating()) {
      // Ask to delete
      if (confirm('Do you want to delete your review?')) {
        this.submitting.set(true);
        this.reviewsService.removeReview(this.bookId).subscribe({
          next: () => {
            this.submitting.set(false);
            this.existingReview.set(null);
            this.isUpdating.set(false);
            this.resetForm();
            this.snackBar.open('Review deleted successfully', 'Close', {
              duration: 3000,
              horizontalPosition: 'end',
              verticalPosition: 'bottom',
              panelClass: ['success-snackbar'],
            });
            this.reviewAdded.emit();
          },
          error: (err) => {
            this.submitting.set(false);
            console.error('Error deleting review:', err);
            this.snackBar.open('Failed to delete review', 'Close', {
              duration: 3000,
              horizontalPosition: 'end',
              verticalPosition: 'bottom',
              panelClass: ['error-snackbar'],
            });
          },
        });
      }
    } else {
      this.resetForm();
    }
  }
}
