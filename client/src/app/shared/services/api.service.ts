import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

/**
 * Base API Service
 * 
 * Purpose: Provides common API URL for all services
 * 
 * How to use:
 * Other services extend this class to inherit apiUrl and http
 * 
 * Example:
 * export class BooksService extends ApiService {
 *   getBooks() {
 *     return this.http.get(`${this.apiUrl}/books`);
 *   }
 * }
 */
@Injectable({
  providedIn: 'root'  // Available everywhere in the app
})
export class ApiService {
  /**
   * Backend API base URL
   * Change this if backend moves to different URL/port
   */
  protected readonly apiUrl = 'http://localhost:3000/api';

  /**
   * HttpClient for making HTTP requests
   * Protected = child services can access it
   */
  constructor(protected http: HttpClient) {}
}
