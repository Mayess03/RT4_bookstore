import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { User } from '../models';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AdminUsersService extends ApiService {

  getAll(): Observable<User[]> {
    return this.http.get<User[]>(`${this.apiUrl}/admin/users`);
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/admin/users/${id}`);
  }
  getById(id: string) {
  return this.http.get<User>(`${this.apiUrl}/admin/users/${id}`);
}

}
