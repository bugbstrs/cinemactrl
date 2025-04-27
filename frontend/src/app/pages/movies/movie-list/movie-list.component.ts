import { Component, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { TagModule } from 'primeng/tag';
import { DialogModule } from 'primeng/dialog';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { AuthService } from '../../../services/auth.service';
import { MovieService, Movie } from '../../../services/movie.service';
import { CommonModule, DatePipe } from '@angular/common';

@Component({
  selector: 'app-movie-list',
  standalone: true,
  imports: [TableModule, ButtonModule, TagModule, DialogModule, CommonModule, ToastModule, RouterLink, DatePipe],
  providers: [MessageService],
  templateUrl: './movie-list.component.html',
  styleUrls: ['./movie-list.component.scss']
})
export class MovieListComponent implements OnInit {
  movies: Movie[] = [];
  deleteDialogVisible = false;
  selectedMovie: Movie | null = null;
  isAdmin = false;

  constructor(
    private movieService: MovieService,
    private authService: AuthService,
    private messageService: MessageService
  ) { }

  ngOnInit(): void {
    this.loadMovies();
    this.isAdmin = this.authService.isAdmin();
  }

  loadMovies(): void {
    this.movieService.getMovies().subscribe(movies => {
      this.movies = movies;
    });
  }

  confirmDelete(movie: Movie): void {
    this.selectedMovie = movie;
    this.deleteDialogVisible = true;
  }

  deleteMovie(): void {
    if (this.selectedMovie) {
      this.movieService.deleteMovie(this.selectedMovie.id).subscribe({
        next: () => {
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: `${this.selectedMovie?.name} has been deleted`
          });
          this.loadMovies();
          this.deleteDialogVisible = false;
        },
        error: (err) => {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: err.error?.message || 'Failed to delete movie'
          });
        }
      });
    }
  }
}
