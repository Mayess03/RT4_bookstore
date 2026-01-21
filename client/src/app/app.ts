import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from './shared/components/header/header.component';
// import { LoadingComponent } from './shared/components/loading/loading.component';
// import { BookCardComponent } from './shared/components/book-card/book-card.component';
// import { Book } from './shared/models';

@Component({
  selector: 'app-root',
  imports: [
    RouterOutlet,
    HeaderComponent
    // LoadingComponent,  // Uncomment for testing
    // BookCardComponent  // Uncomment for testing
  ],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('client');

  // TEST DATA - Uncomment to test BookCardComponent
  /*
  testBook: Book = {
    id: '1',
    title: 'The Great Gatsby',
    author: 'F. Scott Fitzgerald',
    isbn: '978-0743273565',
    price: 15.99,
    stock: 10,
    description: 'A classic American novel set in the Jazz Age.',
    imageUrl: 'https://via.placeholder.com/150'
  };

  onTestAddToCart(book: Book) {
    console.log('Add to cart clicked!', book);
    alert(`Added "${book.title}" to cart!`);
  }
  */
}
