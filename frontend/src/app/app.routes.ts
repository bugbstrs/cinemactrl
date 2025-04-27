import { Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard';
import { adminGuard } from './guards/admin.guard';

export const routes: Routes = [
  { path: '', loadComponent: () => import('./pages/home/home.component').then(m => m.HomeComponent) },
  { path: 'login', loadComponent: () => import('./pages/login/login.component').then(m => m.LoginComponent) },
  { path: 'register', loadComponent: () => import('./pages/register/register.component').then(m => m.RegisterComponent) },
  
  { path: 'movies', loadComponent: () => import('./pages/movies/movie-list/movie-list.component').then(m => m.MovieListComponent) },
  { path: 'movies/:id', loadComponent: () => import('./pages/movies/movie-detail/movie-detail.component').then(m => m.MovieDetailComponent) },
  
  { 
    path: 'admin/movies/create', 
    loadComponent: () => import('./pages/movies/movie-form/movie-form.component').then(m => m.MovieFormComponent),
    canActivate: [authGuard, adminGuard]
  },
  { 
    path: 'admin/movies/:id/edit', 
    loadComponent: () => import('./pages/movies/movie-form/movie-form.component').then(m => m.MovieFormComponent),
    canActivate: [authGuard, adminGuard]
  },
  
  { path: '**', redirectTo: '' }
];
