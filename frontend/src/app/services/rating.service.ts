import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface RatingResponse {
  averageRating: number;
  totalRatings: number;
  rated: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class RatingService {
  private apiUrl = 'http://localhost:3000/movies';

  constructor(private http: HttpClient) {}

  getRatings(movieId: number): Observable<RatingResponse> {
    return this.http.get<RatingResponse>(`${this.apiUrl}/${movieId}/ratings`);
  }

  rateMovie(movieId: number, rating: number): Observable<{success: boolean}> {
    return this.http.post<{success: boolean}>(`${this.apiUrl}/${movieId}/ratings`, { rating });
  }

  deleteRating(movieId: number): Observable<{success: boolean}> {
    return this.http.delete<{success: boolean}>(`${this.apiUrl}/${movieId}/ratings`);
  }
}
