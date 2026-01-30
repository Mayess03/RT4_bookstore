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
  error = signal<string | null>(null); //ken login echoue => msg d erreur

 
  model = {
    email: '',
    password: '',
  };

  private getRoleFromToken(): string | null {
    const token = localStorage.getItem('accessToken');
    if (!token) return null;

    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload?.role ?? null; 
    } catch {
      return null;
    }
  }

  submit(formulaire: NgForm) {
    if (formulaire.invalid) {
      //object.values c pour transformer en tab
      Object.values(formulaire.controls).forEach((c) => c.markAsTouched()); // controls feha les champs mtaa l form
      return;
    }

    this.loading.set(true);
    this.error.set(null);

    this.auth.login(this.model).subscribe({
      next: (res) => {
        this.auth.saveTokens(res);

        
        const role = (this.getRoleFromToken() ?? '').toLowerCase();

        if (role === 'admin') {
          this.router.navigate(['/admin']);

        } else {
          this.router.navigate(['/home']);

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
