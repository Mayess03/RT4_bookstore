import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { map } from 'rxjs/operators';
import { ApiService } from '../../shared/services/api.service';
import { WishlistItem } from '../../shared/models/wishlist.model';

/**
 * Wishlist Service
 * Backend endpoints (from WishlistController):
 * POST   /api/wishlist/:bookId      - Add book to wishlist (USER only)
 * DELETE /api/wishlist/:bookId      - Remove book from wishlist (USER only)
 * GET    /api/wishlist              - Get user's wishlist (USER only)
 */
@Injectable({
  providedIn: 'root',
})
export class WishlistService extends ApiService {
  private wishlistItems = new BehaviorSubject<WishlistItem[]>([]);
  public wishlistItems$ = this.wishlistItems.asObservable();

  /**
   * Get user's wishlist
   *
   * @returns Observable of wishlist items array
   */
  getWishlist(): Observable<WishlistItem[]> {
    return this.http.get<WishlistItem[]>(`${this.apiUrl}/wishlist`);
  }

  /**
   * Add book to wishlist
   *
   * @param bookId - The ID of the book to add
   * @returns Observable of created wishlist item
   */
  addBook(bookId: string): Observable<WishlistItem> {
    return this.http.post<WishlistItem>(`${this.apiUrl}/wishlist/${bookId}`, {});
  }

  /**
   * Remove book from wishlist
   *
   * @param bookId - The ID of the book to remove
   * @returns Observable of delete response
   */
  removeBook(bookId: string): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(`${this.apiUrl}/wishlist/${bookId}`);
  }

  /**
   * Check if a book is in the wishlist
   *
   * @param bookId - The ID of the book to check
   * @returns Observable of boolean
   */
  isInWishlist(bookId: string): Observable<boolean> {
    return this.http
      .get<WishlistItem[]>(`${this.apiUrl}/wishlist`)
      .pipe(map((items) => items.some((item) => item.bookId === bookId)));
  }

  /**
   * Update cached wishlist items
   */
  setWishlistItems(items: WishlistItem[]) {
    this.wishlistItems.next(items);
  }

  /**
   * Get current wishlist items from cache
   */
  getWishlistItemsSync(): WishlistItem[] {
    return this.wishlistItems.value;
  }
}
