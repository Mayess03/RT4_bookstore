/**
 * NOTE FOR Mayess (Admin Module)
 * 
 * Admin Book Management Endpoints
 * ================================
 * 
 * These backend endpoints are available for admin book management.
 * You'll need to create an AdminBooksService in your admin module.
 * 
 * Backend API Endpoints (Books Controller):
 * -----------------------------------------
 * 
 * POST   /api/books
 *        Create new book (ADMIN only)
 *        Body: CreateBookDto { title, author, isbn, price, stock, description, imageUrl, categoryId }
 * 
 * PATCH  /api/books/:id
 *        Update existing book (ADMIN only)
 *        Body: UpdateBookDto (partial CreateBookDto)
 * 
 * DELETE /api/books/:id
 *        Delete book - soft delete (ADMIN only)
 * 
 * PATCH  /api/books/:id/stock
 *        Update book stock quantity (ADMIN only)
 *        Body: { quantity: number }
 * 
 * PATCH  /api/books/:id/toggle-active
 *        Activate/Deactivate book (ADMIN only)
 *        Body: { isActive: boolean }
 * 
 * 
 * Implementation Guide:
 * --------------------
 * 
 * 1. Create: client/src/app/admin/services/admin-books.service.ts
 *    - Extend ApiService (like BooksService does)
 *    - Implement the 5 methods above
 *    - All methods require JWT auth (handled by interceptor)
 * 
 * 2. Create admin components:
 *    - BookManagementComponent (list with edit/delete buttons)
 *    - CreateBookComponent (form to add new books)
 *    - EditBookComponent (form to update books)
 * 
 * 3. Example service method:
 *    ```typescript
 *    createBook(bookData: CreateBookDto): Observable<Book> {
 *      return this.http.post<Book>(`${this.apiUrl}/books`, bookData);
 *    }
 *    ```
 * 
 * 4. Remember:
 *    - User must be logged in as ADMIN
 *    - Backend validates Role.ADMIN on these endpoints
 *    - Use reactive forms for create/edit
 *    - Add confirmation dialogs for delete actions
 * 
 *  Check  :
 * - backend/src/modules/books/books.controller.ts (lines 118-196)
 * - backend/src/modules/books/dto/ (for DTOs structure)
 * 
 
 */
