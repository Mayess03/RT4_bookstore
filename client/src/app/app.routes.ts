import { Routes } from '@angular/router';
import { LoginComponent } from './shared/components/auth/login/login.component';
import { HomeComponent } from './shared/components/home/home.component';
import { AdminComponent } from './shared/components/admin/admin.component';
import { RegisterComponent } from './shared/components/auth/register/register.component';
import { authGuard } from './shared/guards/auth.guard';
import { adminGuard } from './shared/guards/role.guard';
import { ForgotPasswordComponent } from './shared/components/auth/forgot-password/forgot-password.component';
import { AdminUsersComponent } from './shared/components/admin/admin-users/admin-users.component';
import { AdminOrders } from './shared/components/admin/admin-orders/admin-orders';
import { AdminHome } from './shared/components/admin/admin-home/admin-home.component';
import { AdminBooks } from './shared/components/admin/admin-books/admin-books';
import { AdminCategories } from './shared/components/admin/admin-categories/admin-categories';
import { ProfilComponent } from './profil/components/profil.component';
import { OrderDetailsAdminComponent } from './shared/components/admin/admin-orders/order-details.component/order-details.component';
import { AdminUserDetailsComponent } from './shared/components/admin/admin-user-details/admin-user-details.component';
import { WishlistPageComponent } from './wishlist/components/wishlist-page/wishlist-page.component';
import { CartListComponent } from './cart/components/cart-list/cart-list.component';
export const routes: Routes = [
  { path: '', component: HomeComponent }, // Landing page (public)

  // Auth routes (public)
  { path: 'auth/login', component: LoginComponent },
  { path: 'auth/register', component: RegisterComponent },
  { path: 'auth/forgot-password', component: ForgotPasswordComponent },

  // Protected routes
  { path: 'profile', canActivate: [authGuard], component: ProfilComponent },

  // Books module - lazy loaded (public browsing, will need cart auth)
  {
    path: 'books',
    loadChildren: () => import('./books/books.routes').then((m) => m.BOOKS_ROUTES),
  },

  // Cart module - lazy loaded (protected)
  {
    path: 'cart',
    component: CartListComponent,
    canActivate: [authGuard],
    data: { title: 'Shopping Cart' },
  },

  // Wishlist module - lazy loaded (protected)
  {
    path: 'wishlist',
    component: WishlistPageComponent,
    canActivate: [authGuard],
  },

  // Orders module - lazy loaded (protected)
  {
    path: 'orders',
    loadChildren: () => import('./orders/orders.routes').then((m) => m.ORDERS_ROUTES),
    canActivate: [authGuard],
  },

  // Admin routes (protected) - Dev 6's admin dashboard
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
    ],
  },

  { path: '**', redirectTo: '' }, // Redirect unknown routes to home
];
