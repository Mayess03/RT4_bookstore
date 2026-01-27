import {
  Component,
  Input,
  OnInit,
  signal,
  inject,
  OnChanges,
  SimpleChanges,
  ChangeDetectionStrategy,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { Review } from '../../../shared/models/review.model';
import { ReviewsService } from '../../services/reviews.service';
import { AuthService } from '../../../shared/services/auth.service';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

/**
 * Review List Component
 *
 * Purpose: Display all reviews for a book
 * Features:
 * - Show rating with stars
 * - Display user name and date
 * - Show comment text
 * - Allow delete if user is owner
 * - Auto-refresh when bookId changes
 */
@Component({
  selector: 'app-review-list',
  standalone: true,
  imports: [CommonModule, MatIconModule, MatButtonModule, MatDividerModule, MatSnackBarModule],
  templateUrl: './review-list.component.html',
  styleUrl: './review-list.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ReviewListComponent implements OnInit, OnChanges {
  @Input() bookId: string = '';

  private reviewsService = inject(ReviewsService);
  private authService = inject(AuthService);
  private snackBar = inject(MatSnackBar);

  reviews = signal<Review[]>([]);
  loading = signal(true);
  error = signal<string | null>(null);
  currentUserId = this.authService.currentUser()?.id;

  ngOnInit() {
    this.loadReviews();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['bookId'] && !changes['bookId'].firstChange) {
      this.loadReviews();
    }
  }

  /**
   * Load reviews for the book
   */
  loadReviews() {
    if (!this.bookId) return;

    this.loading.set(true);
    this.error.set(null);

    this.reviewsService.getReviewsByBook(this.bookId).subscribe({
      next: (reviews) => {
        this.reviews.set(reviews);
        this.loading.set(false);
      },
      error: (err) => {
        console.error('Failed to load reviews:', err);
        this.error.set('Failed to load reviews');
        this.loading.set(false);
      },
    });
  }

  /**
   * Generate array of stars for rating display
   */
  getStars(rating: number): boolean[] {
    return Array(5)
      .fill(false)
      .map((_, i) => i < rating);
  }

  /**
   * Check if current user is the review owner
   */
  isOwner(userId: string): boolean {
    return this.currentUserId === userId;
  }

  /**
   * Delete a review
   */
  deleteReview(review: Review) {
    if (!confirm('Are you sure you want to delete your review?')) {
      return;
    }

    this.reviewsService.removeReview(this.bookId).subscribe({
      next: () => {
        this.reviews.update((reviews) => reviews.filter((r) => r.id !== review.id));
        this.snackBar.open('Review deleted successfully', 'Close', {
          duration: 3000,
          horizontalPosition: 'end',
          verticalPosition: 'bottom',
          panelClass: ['success-snackbar'],
        });
      },
      error: (err) => {
        console.error('Failed to delete review:', err);
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
