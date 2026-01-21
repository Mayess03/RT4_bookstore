import { Component, inject, signal } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';

import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, RouterLink],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent {
  private auth = inject(AuthService);
  private router = inject(Router);

  loading = signal(false);
  error = signal<string | null>(null);

  //  Model (Template-driven)
  model = {
    email: '',
    password: '',
  };

  private getRoleFromToken(): string | null {
    const token = localStorage.getItem('accessToken');
    if (!token) return null;

    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload?.role ?? null; // ex: "admin" or "ADMIN"
    } catch {
      return null;
    }
  }

  submit(formulaire: NgForm) {
    if (formulaire.invalid) {
      Object.values(formulaire.controls).forEach((c) => c.markAsTouched());
      return;
    }

    this.loading.set(true);
    this.error.set(null);

    this.auth.login(this.model).subscribe({
      next: (res) => {
        this.auth.saveTokens(res);

        //  Redirect based on role (handles "admin" and "ADMIN")
        const role = (this.getRoleFromToken() ?? '').toLowerCase();

        if (role === 'admin') {
          this.router.navigateByUrl('/admin');
        } else {
          this.router.navigateByUrl('/home');
        }
      },
      error: (err) => {
        this.error.set(err?.error?.message ?? 'Invalid credentials');
        this.loading.set(false);
      },
      complete: () => this.loading.set(false),
    });
  }
}
