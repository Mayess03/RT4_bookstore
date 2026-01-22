import { Component, input } from '@angular/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

/**
 * Loading Component
 * 
 * Purpose: Show spinner while data loads
 * 
 * Usage:
 * <app-loading [isLoading]="true" message="Loading books..."></app-loading>
 */
@Component({
  selector: 'app-loading',
  standalone: true,
  imports: [MatProgressSpinnerModule],
  templateUrl: './loading.component.html',
  styleUrl: './loading.component.css'
})
export class LoadingComponent {
  // Signal Inputs (Modern Angular 21)
  isLoading = input(false);
  message = input('Loading...');
}
