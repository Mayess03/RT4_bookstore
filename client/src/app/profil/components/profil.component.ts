// profil.component.ts
import { Component, signal } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { ProfilService } from '../services/profil.service';
import { AuthService } from '../../shared/services/auth.service';
import { User } from '../../shared/models/user.model';
import { Order } from '../../shared/models/order.model';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-profil',
  templateUrl: './profil.component.html',
  styleUrls: ['./profil.component.css'],
  imports: [FormsModule, CommonModule],
  standalone: true,
})
export class ProfilComponent {
  model: Partial<User> = {
    firstName: '',
    lastName: '',
    email: ''
  } as Partial<User>;

  passwordModel = {
    oldPassword: '',
    newPassword: '',
    confirmPassword: ''
  };

  loadingFlag = signal(false);
  errorMessage = signal('');
  successMessage = signal('');
  passwordChangeSuccess = signal(false);
  orders = signal<Order[]>([]);

  // ✅ Add delete confirmation state
  showDeleteConfirmation = signal(false);
  deleteConfirmationText = signal('');

  constructor(
    private profilService: ProfilService,
    private authService: AuthService,
    private router: Router
  ) {
    this.loadProfile();
    this.loadOrders();
  }

  loading() { return this.loadingFlag(); }
  error() { return this.errorMessage(); }
  success() { return this.successMessage(); }
  ordersList() { return this.orders(); }

  loadProfile() {
    this.profilService.getProfil().subscribe({
      next: (user) => this.model = { ...user },
      error: () => this.errorMessage.set('Failed to load profile')
    });
  }

  loadOrders() {
    this.profilService.getOrders().subscribe({
      next: (orders) => this.orders.set(orders),
      error: () => this.errorMessage.set('Failed to load orders')
    });
  }

  saveProfil(form: NgForm) {
    if (form.invalid) return;

    this.loadingFlag.set(true);
    this.errorMessage.set('');
    this.successMessage.set('');

    const updateData = {
      firstName: this.model.firstName,
      lastName: this.model.lastName,
      email: this.model.email
    };

    this.profilService.updateProfil(updateData).subscribe({
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

  changePassword(form: NgForm) {
    if (form.invalid || this.passwordModel.newPassword !== this.passwordModel.confirmPassword) {
      return;
    }

    this.loadingFlag.set(true);
    this.errorMessage.set('');
    this.successMessage.set('');

    this.profilService.changePassword({
      oldPassword: this.passwordModel.oldPassword,
      newPassword: this.passwordModel.newPassword
    }).subscribe({
      next: () => {
        this.passwordChangeSuccess.set(true);
        this.successMessage.set('Password changed successfully!');
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

  // ✅ Show delete confirmation modal
  openDeleteConfirmation() {
    this.showDeleteConfirmation.set(true);
    this.deleteConfirmationText.set('');
  }

  // ✅ Close delete confirmation modal
  closeDeleteConfirmation() {
    this.showDeleteConfirmation.set(false);
    this.deleteConfirmationText.set('');
  }

  // ✅ Delete account
  confirmDeleteAccount() {
    // Require user to type "DELETE" to confirm
    if (this.deleteConfirmationText() !== 'DELETE') {
      this.errorMessage.set('Please type DELETE to confirm');
      return;
    }

    this.loadingFlag.set(true);
    this.errorMessage.set('');

    this.profilService.deleteAccount().subscribe({
      next: () => {
        // Clear tokens and redirect to home
        this.authService.logout();
        this.router.navigate(['/']);
      },
      error: () => {
        this.errorMessage.set('Failed to delete account');
        this.loadingFlag.set(false);
        this.closeDeleteConfirmation();
      }
    });
  }
}
