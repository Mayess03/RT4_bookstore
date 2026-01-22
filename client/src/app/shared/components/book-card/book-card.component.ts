import { Component, input, output } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Book } from '../../models';
import { CurrencyPipe } from '@angular/common';

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
    CurrencyPipe
  ],
  templateUrl: './book-card.component.html',
  styleUrl: './book-card.component.css'
})
export class BookCardComponent {
  // Signal Inputs (Modern Angular 21)
  book = input.required<Book>();
  
  // Signal Outputs (Modern Angular 21)
  addToCart = output<Book>();
  
  onAddToCart() {
    this.addToCart.emit(this.book());
  }
}
