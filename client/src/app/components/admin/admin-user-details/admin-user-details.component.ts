import { Component, inject, signal, effect } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AdminUsersService } from '../../../services/admin-users.service';
import { User } from '../../../models';

@Component({
  selector: 'app-admin-user-details',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './admin-user-details.component.html',
  styleUrls: ['./admin-user-details.component.css'],
})
export class AdminUserDetailsComponent {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private adminService = inject(AdminUsersService);

  user = signal<User | null>(null);
  loading = signal(true);

  constructor() {
    effect(() => {
      const id = this.route.snapshot.paramMap.get('id');
      if (!id) return;

      this.loading.set(true);

      this.adminService.getById(id).subscribe({
        next: (u) => {
          this.user.set(u);
          this.loading.set(false);
        },
        error: () => {
          this.router.navigate(['/admin/users']);
        },
      });
    });
  }
}
