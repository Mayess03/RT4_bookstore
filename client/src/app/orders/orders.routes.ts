import { Routes } from '@angular/router';
import { OrderListComponent } from './components/order-list/order-list.component';
import { OrderDetailsComponent } from './components/order-details/order-details.component';
import { CheckoutComponent } from './pages/checkout/checkout.component';

export const ORDERS_ROUTES: Routes = [
  { path: '', component: OrderListComponent },
  { path: 'checkout', component: CheckoutComponent },
  { path: ':id', component: OrderDetailsComponent },
];
