import { Injectable } from '@angular/core';
import { HttpParams } from '@angular/common/http';
import { ApiService } from '../../shared/services/api.service';
import { Book } from '../../shared/models';
import { Observable } from 'rxjs';

/**
 * Books Service
 * 
 * Purpose: Handle all book-related API calls
 * Extends ApiService to inherit apiUrl and http client
 * 
 * Backend endpoints (from BooksController):
 * GET    /api/books              - List all books (with filters)
 * GET    /api/books/:id          - Get single book details
 * POST   /api/books              - Create book (ADMIN only)
 * PATCH  /api/books/:id          - Update book (ADMIN only)
 * DELETE /api/books/:id          - Delete book (ADMIN only)
 */
@Injectable({
  providedIn: 'root'
})
export class BooksService extends ApiService {
  
  /**
   * Get paginated list of books with optional filters
   * 
   * @param params - Query parameters for filtering/sorting
   * @returns Observable of books array with pagination info
   * 
   * Example params:
   * {
   *   page: 1,
   *   limit: 12,
   *   search: 'gatsby',
   *   minPrice: 10,
   *   maxPrice: 50,
   *   category: 'fiction',
   *   sortBy: 'price',
   *   sortOrder: 'asc'
   * }
   */
  getBooks(params?: {
    page?: number;
    limit?: number;
    search?: string;
    author?: string;
    isbn?: string;
    category?: string;
    minPrice?: number;
    maxPrice?: number;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
  }): Observable<{
    data: Book[];
    meta: {
      total: number;
      page: number;
      limit: number;
      totalPages: number;
    };
  }> {
    // Build query params using Angular's HttpParams (type-safe and clean)
    let httpParams = new HttpParams();
    
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          httpParams = httpParams.set(key, String(value));
        }
      });
    }
    
    return this.http.get<{
      data: Book[];
      meta: {
        total: number;
        page: number;
        limit: number;
        totalPages: number;
      };
    }>(`${this.apiUrl}/books`, { params: httpParams });
  }

  /**
   * Get single book details by ID
   * 
   * @param id - Book UUID
   * @returns Observable of book details
   */
  getBookById(id: string): Observable<Book> {
    return this.http.get<Book>(`${this.apiUrl}/books/${id}`);
  }

  /**
   * Get bestselling books
   * 
   * @param limit - Number of bestsellers to fetch (default: 10)
   * @returns Observable of bestselling books
   */
  getBestsellers(limit: number = 10): Observable<Book[]> {
    return this.http.get<Book[]>(`${this.apiUrl}/books/bestsellers`, {
      params: new HttpParams().set('limit', String(limit))
    });
  }

  /**
   * Get newly arrived books
   * 
   * @param limit - Number of new arrivals to fetch (default: 10)
   * @returns Observable of new books
   */
  getNewArrivals(limit: number = 10): Observable<Book[]> {
    return this.http.get<Book[]>(`${this.apiUrl}/books/new-arrivals`, {
      params: new HttpParams().set('limit', String(limit))
    });
  }

  /**
   * Get all book categories
   * 
   * @returns Observable of categories
   */
  getCategories(): Observable<Array<{ id: string; name: string }>> {
    return this.http.get<Array<{ id: string; name: string }>>(`${this.apiUrl}/books/categories`);
  }

  /**
   * Check if book has sufficient stock
   * 
   * @param id - Book UUID
   * @param quantity - Quantity to check
   * @returns Observable with availability status
   */
  checkStock(id: string, quantity: number): Observable<{ available: boolean; stock: number }> {
    return this.http.get<{ available: boolean; stock: number }>(
      `${this.apiUrl}/books/${id}/check-stock`,
      { params: new HttpParams().set('quantity', String(quantity)) }
    );
  }

  /**
   * Search books by title, author, or ISBN
   * Convenience method that calls getBooks with search param
   * 
   * @param searchTerm - Text to search for
   * @returns Observable of matching books
   */
  searchBooks(searchTerm: string): Observable<{
    data: Book[];
    meta: {
      total: number;
      page: number;
      limit: number;
      totalPages: number;
    };
  }> {
    return this.getBooks({ search: searchTerm });
  }

  /**
   * Filter books by category
   * 
   * @param category - Category name
   * @returns Observable of books in that category
   */
  getBooksByCategory(category: string): Observable<{
    data: Book[];
    meta: {
      total: number;
      page: number;
      limit: number;
      totalPages: number;
    };
  }> {
    return this.getBooks({ category });
  }

  /**
   * Filter books by price range
   * 
   * @param minPrice - Minimum price
   * @param maxPrice - Maximum price
   * @returns Observable of books within price range
   */
  getBooksByPriceRange(minPrice: number, maxPrice: number): Observable<{
    data: Book[];
    meta: {
      total: number;
      page: number;
      limit: number;
      totalPages: number;
    };
  }> {
    return this.getBooks({ minPrice, maxPrice });
  }
}
