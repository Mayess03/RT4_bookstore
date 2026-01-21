import { Component } from '@angular/core';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink } from '@angular/router';

/**
 * Header Component
 * 
 * Purpose: Navigation bar shown on every page
 * 
 * Uses Material:
 * - mat-toolbar: Navigation bar
 * - mat-button: Styled buttons
 * - mat-icon: Material icons
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
  // TODO Dev 1: Add authentication logic
  isLoggedIn = false;
  
  onLogout() {
    // TODO Dev 1: Implement logout
    console.log('Logout clicked');
  }
}
