import { Routes } from '@angular/router';
import { BookListComponent } from './components/book-list/book-list.component';

export const BOOKS_ROUTES: Routes = [
  {
    path: '',
    component: BookListComponent
  },
  // TODO: Add book details route
  // {
  //   path: ':id',
  //   component: BookDetailsComponent
  // }
];
