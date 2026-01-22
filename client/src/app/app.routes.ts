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
export const routes: Routes = [
  { path: '', redirectTo: 'auth/login', pathMatch: 'full' },

  { path: 'auth/login', component: LoginComponent },

  { path: 'home', canActivate: [authGuard], component: HomeComponent },
{ path: 'auth/register', component: RegisterComponent },
  { path: 'auth/forgot-password', component: ForgotPasswordComponent },

  {
    path: 'admin',
    component: AdminComponent,
    canActivate: [authGuard, adminGuard],
    children: [
      { path: '', component: AdminHome },
      { path: 'users', component: AdminUsers },
      { path: 'books', component: AdminBooks },
      { path: 'orders', component: AdminOrders },
      { path: 'profile', component: AdminProfile }
    ]
  },

  { path: '**', redirectTo: 'auth/login' },
];
