import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Theater {
  id: number;
  name: string;
  capacity: number;
}

@Injectable({
  providedIn: 'root'
})
export class TheaterService {
  private apiUrl = 'http://localhost:3000/theaters';

  constructor(private http: HttpClient) {}

  getTheaters(): Observable<Theater[]> {
    return this.http.get<Theater[]>(this.apiUrl);
  }

  getTheater(id: number): Observable<Theater> {
    return this.http.get<Theater>(`${this.apiUrl}/${id}`);
  }

  createTheater(theater: Omit<Theater, 'id'>): Observable<Theater> {
    return this.http.post<Theater>(this.apiUrl, theater);
  }

  updateTheater(id: number, theater: Partial<Theater>): Observable<Theater> {
    return this.http.put<Theater>(`${this.apiUrl}/${id}`, theater);
  }

  deleteTheater(id: number): Observable<{success: boolean}> {
    return this.http.delete<{success: boolean}>(`${this.apiUrl}/${id}`);
  }
}
