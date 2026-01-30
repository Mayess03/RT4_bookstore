import { Component, effect, inject, signal } from '@angular/core';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink, Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { AdminNavbarComponent } from '../admin/admin-navbar/admin-navbar.component';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    RouterModule,
    AdminNavbarComponent
  ],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {
  private authService = inject(AuthService);
  private router = inject(Router);
  isAdmin = this.authService.isAdmin;
  isLoggedIn = this.authService.isLoggedIn;
  constructor() {
    // Log initial value
    console.log('Initial isAdmin:', this.isAdmin());
    
    // React to changes
    effect(() => {
      console.log('isAdmin updated:', this.isAdmin());
    });
  }
  onLogout() {
    console.log('Logout clicked, isLoggedIn before:', this.isLoggedIn());
    this.authService.clearTokens();

    // Call logout API but ignore errors (user may be already logged out server-side)
    this.authService.logout().subscribe({
      next: () => console.log('Logout API success'),
      error: (err) => console.log('Logout API failed (ignored):', err.status)
    });
    
    this.router.navigate(['/']);
  }
}
