import { Component, OnInit, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { BooksService } from '../../services/services/books.service';
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

  // Categories data
  categories = [
    { name: 'Fiction', icon: '📖', count: 250 },
    { name: 'Science Fiction', icon: '🚀', count: 180 },
    { name: 'Fantasy', icon: '🧙', count: 200 },
    { name: 'Business', icon: '💼', count: 120 },
    { name: 'Technology', icon: '💻', count: 150 },
    { name: 'Self-Help', icon: '🌟', count: 100 },
    { name: 'History', icon: '📜', count: 90 },
    { name: 'Science', icon: '🔬', count: 110 }
  ];

  // Testimonials data
  testimonials = [
    {
      name: 'Sarah Johnson',
      initial: 'S',
      role: 'Book Enthusiast',
      text: 'Amazing selection and fast delivery! I found books I couldn\'t find anywhere else. The customer service is exceptional.'
    },
    {
      name: 'Michael Chen',
      initial: 'M',
      role: 'Fiction Lover',
      text: 'The curated collections are fantastic. I love the personalized recommendations and the easy browsing experience.'
    },
    {
      name: 'Emma Williams',
      initial: 'E',
      role: 'Avid Reader',
      text: 'Best bookstore I\'ve used! The prices are competitive and I appreciate the detailed book descriptions and reviews.'
    }
  ];

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

  browseByCategory(categoryName: string) {
    this.router.navigate(['/books'], {
      queryParams: { category: categoryName }
    });
  }

  scrollToSection(sectionId: string) {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }

  onAddToCart(book: Book) {
    console.log('Add to cart:', book);
    alert(`Added "${book.title}" to cart!`);
  }
}
