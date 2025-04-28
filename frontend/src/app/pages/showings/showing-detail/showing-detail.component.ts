import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { ShowingService, Showing } from '../../../services/showing.service';
import { ReservationService } from '../../../services/reservation.service';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-showing-detail',
  standalone: true,
  imports: [CommonModule, FormsModule, CardModule, ButtonModule, DialogModule, ToastModule],
  providers: [MessageService],
  templateUrl: './showing-detail.component.html',
  styleUrls: ['./showing-detail.component.scss'],
})
export class ShowingDetailComponent implements OnInit {
  showing: Showing | null = null;
  seatInfo: { totalSeats: number; availableSeats: number[]; reservedSeats: number[] } | null = null;
  bookingDialogVisible = false;
  selectedSeat: number | null = null;
  isAuthenticated = false;
  showBookingDiv = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private showingService: ShowingService,
    private reservationService: ReservationService,
    private authService: AuthService,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    this.isAuthenticated = this.authService.isAuthenticated();
    
    this.route.paramMap.subscribe(params => {
      const id = Number(params.get('id'));
      if (id) {
        this.loadShowing(id);
        this.loadAvailableSeats(id);
      }
    });
  }

  loadShowing(id: number): void {
    this.showingService.getShowing(id).subscribe({
      next: (showing) => {
        this.showing = showing;
      },
      error: (err) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to load showing details'
        });
        this.router.navigate(['/showings']);
      }
    });
  }

  loadAvailableSeats(showingId: number): void {
    this.showingService.getAvailableSeats(showingId).subscribe({
      next: (seatInfo) => {
        this.seatInfo = seatInfo;
      },
      error: (err) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to load seat information'
        });
      }
    });
  }

  openBookingDialog(): void {
    if (!this.isAuthenticated) {
      this.router.navigate(['/login']);
      return;
    }
    this.selectedSeat = null;
    this.bookingDialogVisible = true;
  }

  bookSeat(): void {
    if (!this.showing || this.selectedSeat === null) return;

    this.reservationService.createReservation(this.showing.id, this.selectedSeat).subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: `Seat ${this.selectedSeat} booked successfully!`
        });
        this.bookingDialogVisible = false;
        this.loadAvailableSeats(this.showing!.id);
      },
      error: (err) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: err.error?.message || 'Failed to book seat'
        });
      }
    });
  }
}
