import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';
import { map } from 'rxjs/operators';
import { ApiService } from './api.service';
import { WishlistItem } from '../models/wishlist.model';

@Injectable({
  providedIn: 'root',
})
export class WishlistService extends ApiService {
  private wishlistItems = new BehaviorSubject<WishlistItem[]>([]);
  public wishlistItems$ = this.wishlistItems.asObservable();

  getWishlist(): Observable<WishlistItem[]> {
    return this.http.get<WishlistItem[]>(`${this.apiUrl}/wishlist`);
  }

  addBook(bookId: string): Observable<WishlistItem> {
    return this.http.post<WishlistItem>(`${this.apiUrl}/wishlist/${bookId}`, {});
  }

  removeBook(bookId: string): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(`${this.apiUrl}/wishlist/${bookId}`);
  }

  isInWishlist(bookId: string): Observable<boolean> {
    return this.http
      .get<WishlistItem[]>(`${this.apiUrl}/wishlist`)
      .pipe(map((items) => items.some((item) => item.bookId === bookId)));
  }

  setWishlistItems(items: WishlistItem[]) {
    this.wishlistItems.next(items);
  }

  getWishlistItemsSync(): WishlistItem[] {
    return this.wishlistItems.value;
  }
}
