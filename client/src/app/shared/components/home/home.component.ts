//juste mtestya behom 
import { Component } from '@angular/core';

@Component({
  selector: 'app-home',
  standalone: true,
  template: `
    <div class="container mt-5 text-center">
      <h1>Home Page</h1>
      <p>Welcome, you are logged in as a USER.</p>
    </div>
  `,
})
export class HomeComponent {}
