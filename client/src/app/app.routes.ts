import { Routes } from '@angular/router';
import { LoginComponent } from './shared/components/auth/login/login.component';
import { HomeComponent } from './shared/components/home/home.component';
import { AdminComponent } from './shared/components/admin/admin.component';
import { RegisterComponent } from './shared/components/auth/register/register.component';
import { authGuard } from './shared/guards/auth.guard';
import { adminGuard } from './shared/guards/role.guard';
import { ForgotPasswordComponent } from './shared/components/auth/forgot-password/forgot-password.component';
import { AdminUsers } from './shared/components/admin/admin-users/admin-users';
import { AdminOrders } from './shared/components/admin/admin-orders/admin-orders';
import { AdminProfile } from './shared/components/admin/admin-profile/admin-profile';
import { AdminHome } from './shared/components/admin/admin-home/admin-home.component';
import { AdminBooks } from './shared/components/admin/admin-books/admin-books';
import { AdminCategories } from './shared/components/admin/admin-categories/admin-categories';
import { ProfilComponent } from './profil/components/profil.component';
import { OrderDetailsComponent } from './orders/components/order-details/order-details.component';
import { OrderDetailsAdminComponent } from './shared/components/admin/admin-orders/order-details.component/order-details.component';
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
    loadChildren: () => import('./books/books.routes').then(m => m.BOOKS_ROUTES)
  },

  // Cart module - lazy loaded (protected)
  {
    path: 'cart',
    loadChildren: () => import('./cart/cart.routes').then(m => m.CART_ROUTES),
    canActivate: [authGuard]
  },
  // Orders module - lazy loaded (protected)
{
  path: 'orders',
  loadChildren: () =>
    import('./orders/orders.routes').then(m => m.ORDERS_ROUTES),
  canActivate: [authGuard]
},

  // Admin routes (protected) - Dev 6's admin dashboard
  {
    path: 'admin',
    component: AdminComponent,
    canActivate: [authGuard, adminGuard],
    children: [
      { path: '', component: AdminHome },
      { path: 'users', component: AdminUsers },
      { path: 'books', component: AdminBooks },
      { path: 'category', component: AdminCategories },
      { path: 'orders', component: AdminOrders },
      { path: 'orders/:id', component: OrderDetailsAdminComponent },
      { path: 'profile', component: AdminProfile }
    ]
  },

  { path: '**', redirectTo: '' }, // Redirect unknown routes to home
];
