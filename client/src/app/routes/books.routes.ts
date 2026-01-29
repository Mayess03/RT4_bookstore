import { Routes } from '@angular/router';
import { BookListComponent } from '../components/books/book-list/book-list.component';
import { BookDetailComponent } from '../components/books/book-detail/book-detail.component';

export const BOOKS_ROUTES: Routes = [
  {
    path: '',
    component: BookListComponent
  },
  {
    path: ':id',
    component: BookDetailComponent
  }
];
