import { Routes } from '@angular/router';
import { authGuard } from '../shared/guards/auth.guard';
import { CartListComponent } from './components/cart-list/cart-list.component';

/**
 * Cart Module Routes
 *
 * Routes:
 * - /cart - Main cart page (protected)
 */
export const CART_ROUTES: Routes = [
  {
    path: '',
    component: CartListComponent,
    canActivate: [authGuard],
    data: { title: 'Shopping Cart' },
  },
];
