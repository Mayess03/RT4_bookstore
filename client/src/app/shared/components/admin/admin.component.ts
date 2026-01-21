//pour tester 
import { Component } from '@angular/core';

@Component({
  selector: 'app-admin',
  standalone: true,
  template: `
    <div class="container mt-5 text-center">
      <h1>Admin Dashboard</h1>
      <p>Welcome, you are logged in as ADMIN.</p>
    </div>
  `,
})
export class AdminComponent {}
