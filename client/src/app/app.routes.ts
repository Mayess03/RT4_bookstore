import { Routes } from '@angular/router';
import { LoginComponent } from './components/auth/login/login.component';
import { HomeComponent } from './components/home/home.component';
import { AdminComponent } from './components/admin/admin.component';
import { RegisterComponent } from './components/auth/register/register.component';
import { authGuard } from './guards/auth.guard';
import { adminGuard } from './guards/role.guard';
import { ForgotPasswordComponent } from './components/auth/forgot-password/forgot-password.component';
import { AdminUsersComponent } from './components/admin/admin-users/admin-users.component';
import { AdminOrders } from './components/admin/admin-orders/admin-orders';
import { AdminHome } from './components/admin/admin-home/admin-home.component';
import { AdminBooks } from './components/admin/admin-books/admin-books';
import { AdminCategories } from './components/admin/admin-categories/admin-categories';
import { ProfilComponent } from './components/profile/profil.component';
import { OrderDetailsAdminComponent } from './components/admin/admin-orders/order-details.component/order-details.component';
import { AdminUserDetailsComponent } from './components/admin/admin-user-details/admin-user-details.component';
import { WishlistPageComponent } from './components/wishlist/wishlist-page/wishlist-page.component';
import { CartListComponent } from './components/cart-list/cart-list.component';
export const routes: Routes = [
  { path: '', component: HomeComponent },

  { path: 'auth/login', component: LoginComponent },
  { path: 'auth/register', component: RegisterComponent },
  { path: 'auth/forgot-password', component: ForgotPasswordComponent },

  { path: 'profile', canActivate: [authGuard], component: ProfilComponent },

  {
    path: 'books',
    loadChildren: () => import('./routes/books.routes').then((m) => m.BOOKS_ROUTES),
  },

  {
    path: 'cart',
    component: CartListComponent,
    canActivate: [authGuard],
    data: { title: 'Shopping Cart' },
  },

  {
    path: 'wishlist',
    component: WishlistPageComponent,
    canActivate: [authGuard],
  },

  {
    path: 'orders',
    loadChildren: () => import('./routes/orders.routes').then((m) => m.ORDERS_ROUTES),
    canActivate: [authGuard],
  },

  {
    path: 'admin',
    component: AdminComponent,
    canActivate: [authGuard, adminGuard],
    children: [
      { path: '', component: AdminHome },
      { path: 'users', component: AdminUsersComponent },
      { path: 'books', component: AdminBooks },
      { path: 'category', component: AdminCategories },
      { path: 'orders', component: AdminOrders },
      { path: 'orders/:id', component: OrderDetailsAdminComponent },
      { path: 'users/:id', component: AdminUserDetailsComponent },
      { path: 'profile', component: ProfilComponent },
    ],
  },

  { path: '**', redirectTo: '' },
];
