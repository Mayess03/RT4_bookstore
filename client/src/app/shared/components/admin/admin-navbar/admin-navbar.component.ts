import { Component, inject } from '@angular/core';
import { RouterModule, Router } from '@angular/router';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-admin-navbar',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './admin-navbar.component.html',
  styleUrls: ['./admin-navbar.component.css'],
})
export class AdminNavbarComponent {

  private authService = inject(AuthService);
  private router = inject(Router);

  logout() {
    this.authService.clearTokens(); // supprime les tokens
    this.router.navigate(['/auth/login']);
  }
}
