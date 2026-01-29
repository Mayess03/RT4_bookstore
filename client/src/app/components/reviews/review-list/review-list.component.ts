import { Component, signal, inject, ChangeDetectionStrategy, effect, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

import { Review } from '../../../models/review.model';
import { ReviewsService } from '../../../services/reviews.service';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-review-list',
  standalone: true,
  imports: [CommonModule, MatIconModule, MatButtonModule, MatDividerModule, MatSnackBarModule],
  templateUrl: './review-list.component.html',
  styleUrl: './review-list.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ReviewListComponent {
  bookId = input<string>();

  private reviewsService = inject(ReviewsService);
  private authService = inject(AuthService);
  private snackBar = inject(MatSnackBar);

  reviews = signal<Review[]>([]);
  loading = signal(true);
  error = signal<string | null>(null);
  currentUserId = this.authService.currentUser()?.id;

  constructor() {
    effect(() => {
      const id = this.bookId();
      if (!id) return;
      this.loadReviews(id);
    });
  }

  private loadReviews(id: string) {
    this.loading.set(true);
    this.error.set(null);

    this.reviewsService.getReviewsByBook(id).subscribe({
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

  getStars(rating: number): boolean[] {
    return Array.from({ length: 5 }, (_, i) => i < rating);
  }

  isOwner(userId: string): boolean {
    return this.currentUserId === userId;
  }

  deleteReview(review: Review) {
    if (!confirm('Are you sure you want to delete your review?')) return;

    const id = this.bookId();
    if (!id) return;

    this.reviewsService.removeReview(id).subscribe({
      next: () => {
        this.reviews.update((reviews) => reviews.filter((r) => r.id !== review.id));
        this.snackBar.open('Review deleted successfully', 'Close', {
          duration: 3000,
          horizontalPosition: 'end',
          verticalPosition: 'bottom',
          panelClass: ['success-snackbar'],
        });
      },
      error: () => {
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
