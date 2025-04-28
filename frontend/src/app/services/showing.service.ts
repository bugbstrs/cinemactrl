import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Showing {
  id: number;
  theaterId: number;
  movieId: number;
  startTime: string;
  theaterName?: string;
  movieName?: string;
}

export interface AvailableSeats {
  totalSeats: number;
  availableSeats: number[];
  reservedSeats: number[];
}

@Injectable({
  providedIn: 'root'
})
export class ShowingService {
  private apiUrl = 'http://localhost:3000/api/booking/showings';

  constructor(private http: HttpClient) {}

  getShowings(): Observable<Showing[]> {
    return this.http.get<Showing[]>(this.apiUrl);
  }

  getShowing(id: number): Observable<Showing> {
    return this.http.get<Showing>(`${this.apiUrl}/${id}`);
  }

  createShowing(showing: Omit<Showing, 'id'>): Observable<Showing> {
    return this.http.post<Showing>(this.apiUrl, showing);
  }

  updateShowing(id: number, showing: Partial<Showing>): Observable<Showing> {
    return this.http.put<Showing>(`${this.apiUrl}/${id}`, showing);
  }

  deleteShowing(id: number): Observable<{success: boolean}> {
    return this.http.delete<{success: boolean}>(`${this.apiUrl}/${id}`);
  }

  getAvailableSeats(showingId: number): Observable<AvailableSeats> {
    return this.http.get<AvailableSeats>(`${this.apiUrl}/${showingId}/available-seats`);
  }
}
