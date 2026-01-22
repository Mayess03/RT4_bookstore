import { Injectable, signal, computed } from '@angular/core';
import { tap } from 'rxjs/operators';
import { ApiService } from './api.service';
import { AuthResponse, LoginDto, RegisterDto, User } from '../models/user.model';

/**
 *
 * Uses signals for reactive auth state management
 * Automatically updates all components when auth state changes
 */
@Injectable({ providedIn: 'root' })
export class AuthService extends ApiService {
  private readonly accessKey = 'accessToken';
  private readonly refreshKey = 'refreshToken';

  // Signal state
  private currentUserSignal = signal<User | null>(null);

  // Computed signals (reactive, auto-update components)
  currentUser = computed(() => this.currentUserSignal());
  isLoggedIn = computed(() => !!this.currentUserSignal());

  constructor() {
    super();
    // Restore user from localStorage on init
    this.initializeAuth();
  }

  private initializeAuth() {
    const token = this.accessToken;
    if (token) {
      // User is logged in (token exists)
      // Decode JWT to get user info
      const user = this.decodeToken(token);
      if (user) {
        this.currentUserSignal.set(user);
      }
    }
  }

  /**
   * Decode JWT token to extract user info
   */
  private decodeToken(token: string): User | null {
    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split('')
          .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
          .join(''),
      );
      const decoded = JSON.parse(jsonPayload);
      return {
        id: decoded.id || decoded.sub || '',
        email: decoded.email || '',
        firstName: decoded.firstName || '',
        lastName: decoded.lastName || '',
        role: decoded.role || 'USER',
        isActive: decoded.isActive !== false,
      };
    } catch (error) {
      console.error('Error decoding token:', error);
      return null;
    }
  }

  //  LOGIN => POST /api/auth/login
  login(dto: LoginDto) {
    return this.http.post<AuthResponse>(`${this.apiUrl}/auth/login`, dto).pipe(
      tap((res) => {
        this.saveTokens(res);
        // Decode token to get user info
        const user = this.decodeToken(res.accessToken);
        if (user) {
          this.currentUserSignal.set(user);
        }
      }),
    );
  }

  //  REGISTER => POST /api/auth/register
  register(dto: RegisterDto) {
    return this.http.post<{ message: string }>(`${this.apiUrl}/auth/register`, dto);
  }

  //  FORGOT PASSWORD => POST /api/auth/forgot-password
  forgotPassword(email: string) {
    return this.http.post<{ message: string }>(`${this.apiUrl}/auth/forgot-password`, { email });
  }

  //  RESET PASSWORD => POST /api/auth/reset-password
  resetPasswordByEmail(email: string, newPassword: string) {
    return this.http.post<{ message: string }>(`${this.apiUrl}/auth/reset-password`, {
      email,
      newPassword,
    });
  }

  //  REFRESH
  refresh() {
    return this.http.post<{ accessToken: string }>(`${this.apiUrl}/auth/refresh`, {}).pipe(
      tap((res) => {
        this.setAccessToken(res.accessToken);
      }),
    );
  }

  //  LOGOUT
  logout() {
    return this.http.post<{ message: string }>(`${this.apiUrl}/auth/logout`, {}).pipe(
      tap(() => {
        this.clearTokens();
        this.currentUserSignal.set(null);
      }),
    );
  }

  // ---------- Token helpers ----------
  saveTokens(res: AuthResponse) {
    localStorage.setItem(this.accessKey, res.accessToken);
    localStorage.setItem(this.refreshKey, res.refreshToken);
  }

  setAccessToken(accessToken: string) {
    localStorage.setItem(this.accessKey, accessToken);
  }

  clearTokens() {
    localStorage.removeItem(this.accessKey);
    localStorage.removeItem(this.refreshKey);
    this.currentUserSignal.set(null);
  }

  get accessToken() {
    return localStorage.getItem(this.accessKey);
  }

  get refreshToken() {
    return localStorage.getItem(this.refreshKey);
  }

  /**
   * Get current user
   */
  getCurrentUser(): User | null {
    return this.currentUserSignal();
  }
}
