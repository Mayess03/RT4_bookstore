import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import { Review, CreateReviewDto, UpdateReviewDto } from '../models/review.model';

@Injectable({
  providedIn: 'root',
})
export class ReviewsService extends ApiService {
  getReviewsByBook(bookId: string): Observable<Review[]> {
    return this.http.get<Review[]>(`${this.apiUrl}/reviews/book/${bookId}`);
  }

  addReview(bookId: string, dto: CreateReviewDto): Observable<Review> {
    return this.http.post<Review>(`${this.apiUrl}/reviews/${bookId}`, dto);
  }

  updateReview(bookId: string, dto: UpdateReviewDto): Observable<Review> {
    return this.http.patch<Review>(`${this.apiUrl}/reviews/${bookId}`, dto);
  }

  removeReview(bookId: string): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(`${this.apiUrl}/reviews/${bookId}`);
  }
}
