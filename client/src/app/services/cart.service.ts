import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { Cart, CartItem, AddToCartDto, UpdateCartItemDto } from '../models';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root',
})
export class CartService extends ApiService {
  private readonly cartApiUrl = `${this.apiUrl}/cart`;

  private cartSubject = new BehaviorSubject<Cart | null>(null);
  public cart$ = this.cartSubject.asObservable();

  private loadingSubject = new BehaviorSubject<boolean>(false);
  public loading$ = this.loadingSubject.asObservable();

  private errorSubject = new BehaviorSubject<string | null>(null);
  public error$ = this.errorSubject.asObservable();

  getCart(userId: string): Observable<Cart> {
    this.loadingSubject.next(true);
    return this.http.get<Cart>(`${this.cartApiUrl}/${userId}`);
  }

  addToCart(addToCartDto: AddToCartDto): Observable<CartItem> {
    this.loadingSubject.next(true);
    return this.http.post<CartItem>(`${this.cartApiUrl}/add`, addToCartDto);
  }

  updateItemQuantity(updateDto: UpdateCartItemDto): Observable<CartItem> {
    this.loadingSubject.next(true);
    return this.http.patch<CartItem>(`${this.cartApiUrl}/item`, updateDto);
  }

  removeItem(userId: string, bookId: string): Observable<void> {
    this.loadingSubject.next(true);
    const params = new HttpParams().set('userId', userId).set('bookId', bookId);

    return this.http.delete<void>(`${this.cartApiUrl}/item`, { params });
  }

  clearCart(userId: string): Observable<void> {
    this.loadingSubject.next(true);
    return this.http.delete<void>(`${this.cartApiUrl}/${userId}/clear`);
  }

  calculateTotal(
    userId: string,
    tax: number = 0,
  ): Observable<{ total: number; tax: number; subTotal: number }> {
    const params = new HttpParams().set('tax', tax.toString());
    return this.http.get<{ total: number; tax: number; subTotal: number }>(
      `${this.cartApiUrl}/${userId}/total`,
      { params },
    );
  }

  setCart(cart: Cart | null) {
    this.cartSubject.next(cart);
  }

  getCartValue(): Cart | null {
    return this.cartSubject.value;
  }

  setLoading(loading: boolean) {
    this.loadingSubject.next(loading);
  }

  setError(error: string | null) {
    this.errorSubject.next(error);
  }

  getSubTotal(items: CartItem[]): number {
    return items.reduce((total, item) => total + (item.book?.price || 0) * item.quantity, 0);
  }

  getItemCount(items: CartItem[]): number {
    return items.reduce((count, item) => count + item.quantity, 0);
  }
}
