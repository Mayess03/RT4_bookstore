import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { AuthResponse, LoginDto, RegisterDto } from '../models/user.model';

@Injectable({ providedIn: 'root' })
export class AuthService extends ApiService {
  private readonly accessKey = 'accessToken';
  private readonly refreshKey = 'refreshToken';

  //  LOGIN => POST /api/auth/login
  login(dto: LoginDto) {
    return this.http.post<AuthResponse>(`${this.apiUrl}/auth/login`, dto);
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
  return this.http.post<{ message: string }>(
    `${this.apiUrl}/auth/reset-password`,
    { email, newPassword }
  );
}


  //  REFRESH (si tu veux l'utiliser plus tard)
  refresh() {
    return this.http.post<{ accessToken: string }>(`${this.apiUrl}/auth/refresh`, {});
  }

  //  LOGOUT (optionnel)
  logout() {
    return this.http.post<{ message: string }>(`${this.apiUrl}/auth/logout`, {});
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
  }

  get accessToken() {
    return localStorage.getItem(this.accessKey);
  }

  get refreshToken() {
    return localStorage.getItem(this.refreshKey);
  }

  get isLoggedIn() {
    return !!this.accessToken;
  }
}
