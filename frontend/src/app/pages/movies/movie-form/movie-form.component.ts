import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
import { Textarea } from 'primeng/textarea';
import { InputNumberModule } from 'primeng/inputnumber';
import { CalendarModule } from 'primeng/calendar';
import { ButtonModule } from 'primeng/button';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { MovieService, Movie } from '../../../services/movie.service';

@Component({
  selector: 'app-movie-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    CardModule,
    InputTextModule,
    InputNumberModule,
    CalendarModule,
    ButtonModule,
    ToastModule
  ],
  providers: [MessageService],
  templateUrl: './movie-form.component.html',
  styleUrls: ['./movie-form.component.scss']
})
export class MovieFormComponent implements OnInit {
  movieForm: FormGroup;
  isEditMode = false;
  movieId: number | null = null;

  constructor(
    private fb: FormBuilder,
    private movieService: MovieService,
    private route: ActivatedRoute,
    private router: Router,
    private messageService: MessageService
  ) {
    this.movieForm = this.fb.group({
      name: ['', Validators.required],
      ageRating: [0, [Validators.required, Validators.min(0)]],
      description: ['', Validators.required],
      imageUrl: ['', [Validators.required, Validators.pattern('https?://.+')]],
      duration: [90, [Validators.required, Validators.min(1)]],
      releaseDate: [new Date(), Validators.required]
    });
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.isEditMode = true;
        this.movieId = +id;
        this.loadMovie(this.movieId);
      }
    });
  }

  loadMovie(id: number): void {
    this.movieService.getMovie(id).subscribe({
      next: (movie) => {
        this.movieForm.patchValue({
          ...movie,
          releaseDate: new Date(movie.releaseDate)
        });
      },
      error: () => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to load movie details'
        });
        this.router.navigate(['/movies']);
      }
    });
  }

  onSubmit(): void {
    if (this.movieForm.invalid) return;

    const movieData = {
      ...this.movieForm.value,
      releaseDate: this.formatDate(this.movieForm.value.releaseDate)
    };

    if (this.isEditMode && this.movieId) {
      this.movieService.updateMovie(this.movieId, movieData).subscribe({
        next: () => {
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: 'Movie updated successfully'
          });
          this.router.navigate(['/movies', this.movieId]);
        },
        error: (err) => {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: err.error?.message || 'Failed to update movie'
          });
        }
      });
    } else {
      this.movieService.createMovie(movieData).subscribe({
        next: (movie) => {
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: 'Movie created successfully'
          });
          this.router.navigate(['/movies', movie.id]);
        },
        error: (err) => {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: err.error?.message || 'Failed to create movie'
          });
        }
      });
    }
  }

  private formatDate(date: Date): string {
    return date.toISOString().split('T')[0];
  }
}
