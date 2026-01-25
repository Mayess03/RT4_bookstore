import { Injectable } from '@angular/core';
import { ApiService } from '../../shared/services/api.service';
import { User } from '../../shared/models/user.model';
import { Order } from '../../shared/models/order.model';
import { Observable, map } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ProfilService extends ApiService {
  apiUrlBase = `${this.apiUrl}/users`;

  getProfil(): Observable<User> {
    return this.http.get<User>(`${this.apiUrlBase}/me`).pipe(  // ← Fixed: ( not `
      map(user => ({
        ...user,
        firstName: (user as any).first_name ?? user.firstName,
        lastName: (user as any).last_name ?? user.lastName,
      }))
    );
  }

  updateProfil(data: Partial<User>): Observable<User> {
    // ✅ Only send allowed fields to avoid 400 error
    const allowedFields = {
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email
    };

    return this.http.patch<User>(`${this.apiUrlBase}/me`, allowedFields).pipe(  // ← Fixed: ( not `
      map(user => ({
        ...user,
        firstName: (user as any).first_name ?? user.firstName,
        lastName: (user as any).last_name ?? user.lastName,
      }))
    );
  }

  changePassword(data: { oldPassword: string; newPassword: string }): Observable<any> {
    return this.http.patch(`${this.apiUrlBase}/change-password`, data);  // ← Fixed: ( not `
  }

  getOrders(): Observable<Order[]> {
    return this.http.get<Order[]>(`${this.apiUrlBase}/orders`);  // ← Fixed: ( not `
  }
  deleteAccount(): Observable<any> {
    return this.http.delete(`${this.apiUrlBase}/me`);
  }
}
