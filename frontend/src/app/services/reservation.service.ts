import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Reservation {
  id: number;
  userId: number;
  showingId: number;
  seat: number;
  movieName?: string;
  theaterName?: string;
  startTime?: string;
}

@Injectable({
  providedIn: 'root'
})
export class ReservationService {
  private apiUrl = 'http://localhost:3000/api/booking/reservations';

  constructor(private http: HttpClient) {}

  getReservations(): Observable<Reservation[]> {
    return this.http.get<Reservation[]>(this.apiUrl);
  }

  createReservation(showingId: number, seat: number): Observable<Reservation> {
    return this.http.post<Reservation>(this.apiUrl, { showingId, seat });
  }

  cancelReservation(id: number): Observable<{success: boolean}> {
    return this.http.delete<{success: boolean}>(`${this.apiUrl}/${id}`);
  }
}
