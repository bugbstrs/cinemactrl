import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';

export interface User {
  id: number;
  username: string;
  fullName: string;
  role: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:3000/api/user/auth';
  private tokenKey = 'auth_token';
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  currentUser$ = this.currentUserSubject.asObservable();

  constructor(private http: HttpClient) {
    this.loadUser();
  }

  register(username: string, password: string, fullName: string): Observable<{token: string}> {
    return this.http.post<{token: string}>(`${this.apiUrl}/register`, { username, password, fullName })
      .pipe(tap(response => this.setToken(response.token)));
  }

  login(username: string, password: string): Observable<{token: string}> {
    return this.http.post<{token: string}>(`${this.apiUrl}/login`, { username, password })
      .pipe(tap(response => this.setToken(response.token)));
  }

  logout(): void {
    localStorage.removeItem(this.tokenKey);
    this.currentUserSubject.next(null);
  }

  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  private setToken(token: string): void {
    localStorage.setItem(this.tokenKey, token);
    this.loadUser();
  }

  private loadUser(): void {
    const token = this.getToken();
    if (token) {
      const payload = JSON.parse(atob(token.split('.')[1]));
      this.currentUserSubject.next({
        id: payload.sub,
        username: payload.username,
        fullName: payload.fullName || '',
        role: payload.role
      });
    }
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }

  isAdmin(): boolean {
    const user = this.currentUserSubject.value;
    return user?.role === 'admin';
  }
}
