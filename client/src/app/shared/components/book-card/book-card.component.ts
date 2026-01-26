import { Component, input, output } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink } from '@angular/router';
import { Book } from '../../models';
import { CurrencyPipe, DecimalPipe } from '@angular/common';

/**
 * Book Card Component (Presentational)
 * 
 * Purpose: Display a book in a card format
 * Used by: Dev 2 (book lists), Dev 3 (cart)
 * 
 * Usage:
 * <app-book-card [book]="myBook" (addToCart)="onAddToCart($event)"></app-book-card>
 */
@Component({
  selector: 'app-book-card',
  standalone: true,
  imports: [
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    RouterLink,
    CurrencyPipe,
    DecimalPipe
  ],
  templateUrl: './book-card.component.html',
  styleUrl: './book-card.component.css'
})
export class BookCardComponent {
  // Signal Inputs (Modern Angular 21)
  book = input.required<Book>();
  isLoading = input<boolean>(false);
  
  // Signal Outputs (Modern Angular 21)
  addToCart = output<Book>();
  viewDetails = output<string>();
  
  // Placeholder image for missing covers
  private readonly placeholderImage = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMjAwIiBoZWlnaHQ9IjMwMCIgZmlsbD0iI2YwZjBmMCIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMTYiIGZpbGw9IiM5OTk5OTkiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIj5ObyBDb3ZlcjwvdGV4dD48L3N2Zz4=';
  
  onAddToCart() {
    this.addToCart.emit(this.book());
  }
  
  onViewDetails() {
    this.viewDetails.emit(this.book().id);
  }
  
  /**
   * Handle image loading errors - show placeholder
   */
  onImageError(event: Event) {
    const img = event.target as HTMLImageElement;
    img.src = this.placeholderImage;
  }
}
