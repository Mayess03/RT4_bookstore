import { Component, inject, signal } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';

import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [FormsModule, RouterLink],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css',
})
export class RegisterComponent {
  private auth = inject(AuthService);
  private router = inject(Router);

  loading = signal(false);
  error = signal<string | null>(null);
  success = signal<string | null>(null);

  model = {
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
  };

  submit(formulaire: NgForm) {
    if (formulaire.invalid) {
      Object.values(formulaire.controls).forEach((c) => c.markAsTouched());
      return;
    }

    if (this.model.password !== this.model.confirmPassword) {
      this.error.set('Passwords do not match');
      return;
    }

    this.loading.set(true);
    this.error.set(null);
    this.success.set(null);

    this.auth.register({
      firstName: this.model.firstName,
      lastName: this.model.lastName,
      email: this.model.email,
      password: this.model.password,
    }).subscribe({
      next: (res) => {
        this.success.set(res?.message ?? 'Account created successfully');
        // option: redirect automatically after 1s
        setTimeout(() => this.router.navigate(['/auth/login']), 900);

      },
      error: (err) => {
        this.error.set(err?.error?.message ?? 'Registration failed');
        this.loading.set(false);
      },
      complete: () => this.loading.set(false),
    });
  }
}
