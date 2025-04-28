import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { TagModule } from 'primeng/tag';
import { RatingModule } from 'primeng/rating';
import { FormsModule } from '@angular/forms';
import { DialogModule } from 'primeng/dialog';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { MovieService, Movie } from '../../../services/movie.service';
import { RatingService } from '../../../services/rating.service';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-movie-detail',
  standalone: true,
  imports: [CommonModule, RouterLink, ButtonModule, CardModule, TagModule, RatingModule, FormsModule, DialogModule, ToastModule],
  providers: [MessageService],
  templateUrl: './movie-detail.component.html',
  styleUrls: ['./movie-detail.component.scss']
})
export class MovieDetailComponent implements OnInit {
  movie: Movie | null = null;
  ratings: { averageRating: number; totalRatings: number; rated: boolean } | null = null;
  userRating = 0;
  ratingDialogVisible = false;
  isAuthenticated = false;

  constructor(
    private route: ActivatedRoute,
    private movieService: MovieService,
    private ratingService: RatingService,
    private authService: AuthService,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    this.isAuthenticated = this.authService.isAuthenticated();
    this.route.paramMap.subscribe(params => {
      const id = Number(params.get('id'));
      if (id) {
        this.loadMovie(id);
        this.loadRatings(id);
      }
    });
  }

  loadMovie(id: number): void {
    this.movieService.getMovie(id).subscribe(movie => {
      this.movie = movie;
    });
  }

  loadRatings(movieId: number): void {
    this.ratingService.getRatings(movieId).subscribe(ratings => {
      this.ratings = ratings;
      if (ratings.rated) {
        // If user has rated, pre-fill the rating value
        // Note: API would need to return user's rating value
        this.userRating = ratings.averageRating;
      }
    });
  }

  openRatingDialog(): void {
    if (!this.isAuthenticated) {
      this.messageService.add({
        severity: 'info',
        summary: 'Login Required',
        detail: 'Please login to rate this movie'
      });
      return;
    }
    this.ratingDialogVisible = true;
  }

  submitRating(): void {
    if (this.movie && this.userRating > 0) {
      this.ratingService.rateMovie(this.movie.id, this.userRating).subscribe({
        next: () => {
          this.messageService.add({
            severity: 'success',
            summary: 'Rating Submitted',
            detail: 'Thank you for your rating!'
          });
          this.ratingDialogVisible = false;
          this.loadRatings(this.movie!.id);
        },
        error: (err) => {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: err.error?.message || 'Failed to submit rating'
          });
        }
      });
    }
  }

  removeRating(): void {
    if (this.movie) {
      this.ratingService.deleteRating(this.movie.id).subscribe({
        next: () => {
          this.messageService.add({
            severity: 'success',
            summary: 'Rating Removed',
            detail: 'Your rating has been removed'
          });
          this.userRating = 0;
          this.ratingDialogVisible = false;
          this.loadRatings(this.movie!.id);
        },
        error: (err) => {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: err.error?.message || 'Failed to remove rating'
          });
        }
      });
    }
  }
}
