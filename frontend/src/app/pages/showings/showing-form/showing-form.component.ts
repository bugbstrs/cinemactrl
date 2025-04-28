import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { CardModule } from 'primeng/card';
import { DropdownModule } from 'primeng/dropdown';
import { CalendarModule } from 'primeng/calendar';
import { ButtonModule } from 'primeng/button';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { ShowingService } from '../../../services/showing.service';
import { MovieService, Movie } from '../../../services/movie.service';
import { TheaterService, Theater } from '../../../services/theater.service';
import { DatePickerModule } from 'primeng/datepicker';
import { SelectModule } from 'primeng/select';

@Component({
  selector: 'app-showing-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterLink,
    CardModule,
    SelectModule,
    DatePickerModule,
    ButtonModule,
    ToastModule
  ],
  providers: [MessageService],
  templateUrl: './showing-form.component.html',
  styleUrls: ['./showing-form.component.scss']
})
export class ShowingFormComponent implements OnInit {
  showingForm: FormGroup;
  isEditMode = false;
  showingId: number | null = null;
  movies: Movie[] = [];
  theaters: Theater[] = [];
  
  constructor(
    private fb: FormBuilder,
    private showingService: ShowingService,
    private movieService: MovieService,
    private theaterService: TheaterService,
    private route: ActivatedRoute,
    private router: Router,
    private messageService: MessageService
  ) {
    this.showingForm = this.fb.group({
      movieId: ['', Validators.required],
      theaterId: ['', Validators.required],
      startTime: [new Date(), Validators.required]
    });
  }

  ngOnInit(): void {
    this.loadMovies();
    this.loadTheaters();
    
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.isEditMode = true;
        this.showingId = +id;
        this.loadShowing(this.showingId);
      }
    });
  }

  loadMovies(): void {
    this.movieService.getMovies().subscribe(movies => {
      this.movies = movies;
    });
  }

  loadTheaters(): void {
    this.theaterService.getTheaters().subscribe(theaters => {
      this.theaters = theaters;
    });
  }

  loadShowing(id: number): void {
    this.showingService.getShowing(id).subscribe({
      next: (showing) => {
        this.showingForm.patchValue({
          ...showing,
          startTime: new Date(showing.startTime)
        });
      },
      error: () => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to load showing details'
        });
        this.router.navigate(['/showings']);
      }
    });
  }

  onSubmit(): void {
    if (this.showingForm.invalid) return;

    const showingData = {
      ...this.showingForm.value,
      startTime: this.formatDateTime(this.showingForm.value.startTime)
    };

    if (this.isEditMode && this.showingId) {
      this.showingService.updateShowing(this.showingId, showingData).subscribe({
        next: () => {
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: 'Showing updated successfully'
          });
          this.router.navigate(['/showings']);
        },
        error: (err) => {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: err.error?.message || 'Failed to update showing'
          });
        }
      });
    } else {
      this.showingService.createShowing(showingData).subscribe({
        next: () => {
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: 'Showing created successfully'
          });
          this.router.navigate(['/showings']);
        },
        error: (err) => {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: err.error?.message || 'Failed to create showing'
          });
        }
      });
    }
  }

  private formatDateTime(date: Date): string {
    return date.toISOString();
  }
}
