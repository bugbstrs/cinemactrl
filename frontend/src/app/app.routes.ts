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
  {
    path: 'admin/theaters',
    loadComponent: () => import('./pages/theaters/theater-list/theater-list.component').then(m => m.TheaterListComponent),
    canActivate: [authGuard, adminGuard]
  },
  {
    path: 'admin/theaters/:id/edit',
    loadComponent: () => import('./pages/theaters/theater-form/theater-form.component').then(m => m.TheaterFormComponent),
    canActivate: [authGuard, adminGuard]
  },
  {
    path: 'admin/theaters/create',
    loadComponent: () => import('./pages/theaters/theater-form/theater-form.component').then(m => m.TheaterFormComponent),
    canActivate: [authGuard, adminGuard]
  },
  {
    path: 'showings',
    loadComponent: () => import('./pages/showings/showing-list/showing-list.component').then(m => m.ShowingListComponent),
    canActivate: [authGuard]
  },
  {
    path: 'showings/:id',
    loadComponent: () => import('./pages/showings/showing-detail/showing-detail.component').then(m => m.ShowingDetailComponent),
    canActivate: [authGuard]
  },
  {
    path: 'admin/showings/:id/edit',
    loadComponent: () => import('./pages/showings/showing-form/showing-form.component').then(m => m.ShowingFormComponent),
    canActivate: [authGuard, adminGuard]
  },
  {
    path: 'admin/showings/create',
    loadComponent: () => import('./pages/showings/showing-form/showing-form.component').then(m => m.ShowingFormComponent),
    canActivate: [authGuard, adminGuard]
  },
  {
    path: 'reservations',
    loadComponent: () => import('./pages/reservations/reservation-list/reservation-list.component').then(m => m.ReservationListComponent),
    canActivate: [authGuard]
  },
  { path: '**', redirectTo: '' }
];
