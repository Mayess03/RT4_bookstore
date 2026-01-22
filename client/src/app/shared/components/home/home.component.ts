import { Component, OnInit, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { BooksService } from '../../../books/services/books.service';
import { BookCardComponent } from '../book-card/book-card.component';
import { Book } from '../../models';

/**
 * Home Component (Landing Page)
 * 
 * Purpose: Main landing page with hero section, featured books, bestsellers
 * Uses: Modern Angular 21 signals, Material Design
 */
@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    BookCardComponent
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit {
  private router = inject(Router);
  private booksService = inject(BooksService);

  // Signal state
  bestsellers = signal<Book[]>([]);
  newArrivals = signal<Book[]>([]);
  loading = signal(true);

  ngOnInit() {
    this.loadFeaturedBooks();
  }

  loadFeaturedBooks() {
    this.loading.set(true);
    
    // Load bestsellers and new arrivals in parallel
    Promise.all([
      this.booksService.getBestsellers(6).toPromise(),
      this.booksService.getNewArrivals(6).toPromise()
    ]).then(([bestsellers, newArrivals]) => {
      this.bestsellers.set(bestsellers || []);
      this.newArrivals.set(newArrivals || []);
      this.loading.set(false);
    }).catch(err => {
      console.error('Error loading featured books:', err);
      this.loading.set(false);
    });
  }

  browseBooks() {
    this.router.navigate(['/books']);
  }

  onAddToCart(book: Book) {
    console.log('Add to cart:', book);
    alert(`Added "${book.title}" to cart!`);
  }
}
