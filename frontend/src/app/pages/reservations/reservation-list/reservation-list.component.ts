import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { CardModule } from 'primeng/card';
import { ReservationService, Reservation } from '../../../services/reservation.service';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-reservation-list',
  standalone: true,
  imports: [CommonModule, TableModule, ButtonModule, DialogModule, ToastModule, CardModule],
  providers: [MessageService],
  templateUrl: './reservation-list.component.html',
  styleUrls: ['./reservation-list.component.scss'],
})
export class ReservationListComponent implements OnInit {
  reservations: Reservation[] = [];
  cancelDialogVisible = false;
  selectedReservation: Reservation | null = null;

  constructor(
    private reservationService: ReservationService,
    private authService: AuthService,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    this.loadReservations();
  }

  loadReservations(): void {
    this.reservationService.getReservations().subscribe(reservations => {
      this.reservations = reservations;
    });
  }

  confirmCancel(reservation: Reservation): void {
    this.selectedReservation = reservation;
    this.cancelDialogVisible = true;
  }

  cancelReservation(): void {
    if (this.selectedReservation) {
      this.reservationService.cancelReservation(this.selectedReservation.id).subscribe({
        next: () => {
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: 'Reservation cancelled successfully'
          });
          this.loadReservations();
          this.cancelDialogVisible = false;
        },
        error: (err) => {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: err.error?.message || 'Failed to cancel reservation'
          });
        }
      });
    }
  }
}
