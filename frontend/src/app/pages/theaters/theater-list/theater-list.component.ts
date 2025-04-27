import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { CommonModule } from '@angular/common';
import { TheaterService, Theater } from '../../../services/theater.service';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-theater-list',
  standalone: true,
  imports: [CommonModule, RouterLink, TableModule, ButtonModule, DialogModule, ToastModule],
  providers: [MessageService],
  templateUrl: './theater-list.component.html',
  styleUrls: ['./theater-list.component.scss']
})
export class TheaterListComponent implements OnInit {
  theaters: Theater[] = [];
  deleteDialogVisible = false;
  selectedTheater: Theater | null = null;
  isAdmin = false;

  constructor(
    private theaterService: TheaterService,
    private authService: AuthService,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    this.loadTheaters();
    this.isAdmin = this.authService.isAdmin();
  }

  loadTheaters(): void {
    this.theaterService.getTheaters().subscribe(theaters => {
      this.theaters = theaters;
    });
  }

  confirmDelete(theater: Theater): void {
    this.selectedTheater = theater;
    this.deleteDialogVisible = true;
  }

  deleteTheater(): void {
    if (this.selectedTheater) {
      this.theaterService.deleteTheater(this.selectedTheater.id).subscribe({
        next: () => {
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: `${this.selectedTheater?.name} has been deleted`
          });
          this.loadTheaters();
          this.deleteDialogVisible = false;
        },
        error: (err) => {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: err.error?.message || 'Failed to delete theater'
          });
        }
      });
    }
  }
}
