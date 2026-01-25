import { Component, signal } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { ProfilService } from '../services/profil.service';
import { User } from '../../shared/models/user.model';
import { Order } from '../../shared/models/order.model';
import { Observable } from 'rxjs';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-profil',
  templateUrl: './profil.component.html',
  styleUrls: ['./profil.component.css'],
  imports: [FormsModule, CommonModule],
  standalone: true,
})
export class ProfilComponent {

  // Template-driven form models (plain objects for ngModel)
  model: Partial<User> = {
    firstName: '',
    lastName: '',
    email: ''
  } as Partial<User>;
  passwordModel = { oldPassword: '', newPassword: '', confirmPassword: '' };

  // Synchronous state: use signals for loading/error/success
  loadingFlag = signal(false);
  errorMessage = signal('');
  successMessage = signal('');

  // Orders state
  orders = signal<Order[]>([]);

  constructor(private profilService: ProfilService) {
    this.loadProfile();
    this.loadOrders(); // load orders on init
  }

  // Helper getters for template
  loading() { return this.loadingFlag(); }
  error() { return this.errorMessage(); }
  success() { return this.successMessage(); }
  ordersList() { return this.orders(); } // to use in template

  // Load user profile (async)
  loadProfile() {
    this.profilService.getProfil().subscribe({
      next: (user) => this.model = { ...user },
      error: () => this.errorMessage.set('Failed to load profile')
    });
  }

  // Load orders (async)
  loadOrders() {
    this.profilService.getOrders().subscribe({
      next: (orders) => this.orders.set(orders),
      error: () => this.errorMessage.set('Failed to load orders')
    });
  }

  // Save profile changes
  saveProfil(form: NgForm) {
    if (form.invalid) return;

    this.loadingFlag.set(true);
    this.errorMessage.set('');
    this.successMessage.set('');

    this.profilService.updateProfil(this.model).subscribe({
      next: (user) => {
        this.model = { ...user };
        this.successMessage.set('Profile updated!');
        this.loadingFlag.set(false);
      },
      error: () => {
        this.errorMessage.set('Failed to update profile');
        this.loadingFlag.set(false);
      }
    });
  }

  // Change password
  passwordChangeSuccess = signal(false);  // ← Add this

  changePassword(form: NgForm) {
    if (form.invalid || this.passwordModel.newPassword !== this.passwordModel.confirmPassword) return;

    this.loadingFlag.set(true);
    this.errorMessage.set('');
    this.successMessage.set('');

    this.profilService.changePassword({
      oldPassword: this.passwordModel.oldPassword,
      newPassword: this.passwordModel.newPassword
    }).subscribe({
      next: () => {
        this.passwordChangeSuccess.set(true);
        this.successMessage.set('Password changed!');
        this.passwordModel = { oldPassword: '', newPassword: '', confirmPassword: '' };
        form.resetForm();
        this.loadingFlag.set(false);
        setTimeout(() => {
          this.passwordChangeSuccess.set(false);
          this.successMessage.set('');
        }, 5000);
      },
      error: () => {
        this.errorMessage.set('Failed to change password');
        this.loadingFlag.set(false);
      }
    });
  }
}
