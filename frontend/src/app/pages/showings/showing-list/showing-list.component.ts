import { Component, OnInit } from '@angular/core';
import { DatePipe, CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { ShowingService, Showing } from '../../../services/showing.service';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-showing-list',
  standalone: true,
  imports: [CommonModule, RouterLink, TableModule, ButtonModule, DialogModule, ToastModule, DatePipe],
  providers: [MessageService],
  templateUrl: './showing-list.component.html',
  styleUrls: ['./showing-list.component.scss'],
})
export class ShowingListComponent implements OnInit {
  showings: Showing[] = [];
  deleteDialogVisible = false;
  selectedShowing: Showing | null = null;
  isAdmin = false;

  constructor(
    private showingService: ShowingService,
    private authService: AuthService,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    this.loadShowings();
    this.isAdmin = this.authService.isAdmin();
  }

  loadShowings(): void {
    this.showingService.getShowings().subscribe(showings => {
      this.showings = showings;
    });
  }

  confirmDelete(showing: Showing): void {
    this.selectedShowing = showing;
    this.deleteDialogVisible = true;
  }

  deleteShowing(): void {
    if (this.selectedShowing) {
      this.showingService.deleteShowing(this.selectedShowing.id).subscribe({
        next: () => {
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: 'Showing has been deleted'
          });
          this.loadShowings();
          this.deleteDialogVisible = false;
        },
        error: (err) => {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: err.error?.message || 'Failed to delete showing'
          });
        }
      });
    }
  }
}
