import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
import { InputNumberModule } from 'primeng/inputnumber';
import { ButtonModule } from 'primeng/button';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { TheaterService, Theater } from '../../../services/theater.service';

@Component({
  selector: 'app-theater-form',
  standalone: true,
  imports: [
    CommonModule, 
    ReactiveFormsModule, 
    RouterLink,
    CardModule, 
    InputTextModule, 
    InputNumberModule, 
    ButtonModule, 
    ToastModule
  ],
  providers: [MessageService],
  templateUrl: './theater-form.component.html',
  styleUrls: ['./theater-form.component.scss']
})
export class TheaterFormComponent implements OnInit {
  theaterForm: FormGroup;
  isEditMode = false;
  theaterId: number | null = null;
  
  constructor(
    private fb: FormBuilder,
    private theaterService: TheaterService,
    private route: ActivatedRoute,
    private router: Router,
    private messageService: MessageService
  ) {
    this.theaterForm = this.fb.group({
      name: ['', Validators.required],
      capacity: [100, [Validators.required, Validators.min(1)]]
    });
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.isEditMode = true;
        this.theaterId = +id;
        this.loadTheater(this.theaterId);
      }
    });
  }

  loadTheater(id: number): void {
    this.theaterService.getTheater(id).subscribe({
      next: (theater) => {
        this.theaterForm.patchValue(theater);
      },
      error: () => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to load theater details'
        });
        this.router.navigate(['/theaters']);
      }
    });
  }

  onSubmit(): void {
    if (this.theaterForm.invalid) return;

    if (this.isEditMode && this.theaterId) {
      this.theaterService.updateTheater(this.theaterId, this.theaterForm.value).subscribe({
        next: () => {
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: 'Theater updated successfully'
          });
          this.router.navigate(['/theaters']);
        },
        error: (err) => {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: err.error?.message || 'Failed to update theater'
          });
        }
      });
    } else {
      this.theaterService.createTheater(this.theaterForm.value).subscribe({
        next: () => {
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: 'Theater created successfully'
          });
          this.router.navigate(['/theaters']);
        },
        error: (err) => {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: err.error?.message || 'Failed to create theater'
          });
        }
      });
    }
  }
}
