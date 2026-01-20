import { Component, Input, Output, EventEmitter } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Book } from '../../models';
import { CurrencyPipe } from '@angular/common';

/**
 * Book Card Component
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
  styleUrl: './book-card.component.scss'
})
export class BookCardComponent {
  @Input() book!: Book;  // Required input
  @Output() addToCart = new EventEmitter<Book>();
  
  onAddToCart() {
    this.addToCart.emit(this.book);
  }
}
