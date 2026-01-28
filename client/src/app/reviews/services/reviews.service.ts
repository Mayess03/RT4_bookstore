import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiService } from '../../shared/services/api.service';
import { Review, CreateReviewDto, UpdateReviewDto } from '../../shared/models/review.model';

/**
 * Reviews Service

 * Backend endpoints (from ReviewsController):
 * POST   /api/reviews/:bookId           - Add review (USER only)
 * PATCH  /api/reviews/:bookId           - Update review (USER + owner)
 * DELETE /api/reviews/:bookId           - Delete review (USER + owner)
 * GET    /api/reviews/book/:bookId      - Get reviews by book (PUBLIC)
 */
@Injectable({
  providedIn: 'root',
})
export class ReviewsService extends ApiService {
  /**
   * Get all reviews for a specific book
   *
   * @param bookId - The ID of the book
   * @returns Observable of reviews array
   */
  getReviewsByBook(bookId: string): Observable<Review[]> {
    return this.http.get<Review[]>(`${this.apiUrl}/reviews/book/${bookId}`);
  }

  /**
   * Add a review for a book (USER only)
   *
   * @param bookId - The ID of the book
   * @param dto - The review data (rating and optional comment)
   * @returns Observable of created review
   */
  addReview(bookId: string, dto: CreateReviewDto): Observable<Review> {
    return this.http.post<Review>(`${this.apiUrl}/reviews/${bookId}`, dto);
  }

  /**
   * Update a review (USER + owner only)
   *
   * @param bookId - The ID of the book
   * @param dto - The updated review data
   * @returns Observable of updated review
   */
  updateReview(bookId: string, dto: UpdateReviewDto): Observable<Review> {
    return this.http.patch<Review>(`${this.apiUrl}/reviews/${bookId}`, dto);
  }

  /**
   * Delete a review (USER + owner only)
   *
   * @param bookId - The ID of the book
   * @returns Observable of delete response
   */
  removeReview(bookId: string): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(`${this.apiUrl}/reviews/${bookId}`);
  }
}
