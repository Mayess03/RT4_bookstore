import { Routes } from '@angular/router';
import { OrderListComponent } from '../components/orders/order-list/order-list.component';
import { OrderDetailsComponent } from '../components/orders/order-details/order-details.component';
import { CheckoutComponent } from '../components/orders/checkout/checkout.component';

export const ORDERS_ROUTES: Routes = [
  {
    path: '',
    pathMatch: 'full',
    component: OrderListComponent,
  },
  {
    path: 'checkout',
    component: CheckoutComponent,
  },
  {
    path: ':id',
    component: OrderDetailsComponent,
  },
];

