import { HttpInterceptorFn } from '@angular/common/http';

/**
 * Auth Interceptor
 * 
 * Purpose: Automatically adds JWT token to ALL HTTP requests
 * 
 * How it works:
 * 1. Checks if token exists in localStorage
 * 2. If yes, clones request and adds Authorization header
 * 3. Sends modified request to backend
 * 
 * Why needed:
 * Without this, you'd have to manually add token to EVERY request:
 *   http.get('/books', { headers: { Authorization: 'Bearer token' } })
 * 
 * With this interceptor, it happens automatically:
 *   http.get('/books')  // Token auto-added!
 */
export const authInterceptor: HttpInterceptorFn = (req, next) => {
  // Get JWT token from localStorage (saved during login)
  const token = localStorage.getItem('accessToken');

  // If token exists, add it to request
  if (token) {
    // Clone the request and add Authorization header
    // Why clone? HTTP requests are immutable (can't modify directly)
    req = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`  // Format: "Bearer eyJhbGc..."
      }
    });
  }

  // Continue with the (possibly modified) request
  return next(req);
};
