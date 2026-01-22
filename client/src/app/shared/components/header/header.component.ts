import { Component, inject, signal } from '@angular/core';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink, Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

/**
 * Header Component (Smart Component)
 * 
 * Purpose: Navigation bar shown on every page
 * Features: Auth-aware navigation, responsive design
 */
@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    RouterLink
  ],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {
  private authService = inject(AuthService);
  private router = inject(Router);
  
  // Signal: reactive authentication state (auto-updates when auth changes)
  isLoggedIn = this.authService.isLoggedIn;
  
  onLogout() {
    this.authService.logout().subscribe({
      next: () => {
        this.router.navigate(['/']);
      },
      error: () => {
        // Even if API fails, state is already cleared by service
        this.router.navigate(['/']);
      }
    });
  }
}
