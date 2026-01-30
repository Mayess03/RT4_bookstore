import { Component, signal, inject, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { User } from '../../../models';
import { AdminUsersService } from '../../../services/admin-users.service';

@Component({
  selector: 'app-admin-users',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './admin-users.component.html',
  styleUrls: ['./admin-users.component.css'],
})
export class AdminUsersComponent {
  private adminService = inject(AdminUsersService);

  users = signal<User[]>([]);
  loading = signal(false);
  error = signal<string | null>(null);

  constructor() {
    effect(() => {
      this.loadUsers(); 
    });
  }

  loadUsers() {
    this.loading.set(true);
    this.error.set(null);

    this.adminService.getAll().subscribe({
      next: (data) => {
        this.users.set(data);
        this.loading.set(false);
      },
      error: (err) => {
        this.error.set(err?.error?.message ?? 'Erreur chargement');
        this.loading.set(false);
      },
    });
  }

  deleteUser(user: User) {
    const ok = confirm(`Supprimer ${user.firstName} ${user.lastName} ?`);
    if (!ok) return;

    this.adminService.delete(user.id).subscribe({
      next: () => {
        this.users.update((list) => list.filter((u) => u.id !== user.id));
      },
      error: () => alert('Erreur suppression'),
    });
  }
}
//nejmou zeda bel tosignal nekhdmou donc nwaliw maghir subscribe(automatiquement tsir)