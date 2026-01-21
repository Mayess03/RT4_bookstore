import { Routes } from '@angular/router';
import { LoginComponent } from './shared/components/auth/login/login.component';
import { HomeComponent } from './shared/components/home/home.component';
import { AdminComponent } from './shared/components/admin/admin.component';
import { RegisterComponent } from './shared/components/auth/register/register.component';
import { authGuard } from './shared/guards/auth.guard';
import { adminGuard } from './shared/guards/role.guard';
import { ForgotPasswordComponent } from './shared/components/auth/forgot-password/forgot-password.component';
export const routes: Routes = [
  { path: '', redirectTo: 'auth/login', pathMatch: 'full' },

  { path: 'auth/login', component: LoginComponent },

  { path: 'home', canActivate: [authGuard], component: HomeComponent },
  { path: 'admin', canActivate: [authGuard, adminGuard], component: AdminComponent },
{ path: 'auth/register', component: RegisterComponent },
  { path: 'auth/forgot-password', component: ForgotPasswordComponent },

  { path: '**', redirectTo: 'auth/login' },
];
