import { Component, OnInit, signal, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatTableModule } from '@angular/material/table';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { IJob } from '../../../models/job.model';
import { SchedulerApiService } from '../../../services/scheduler-api.service';
import { DefaultSchedulerTranslationService } from '../../../services/scheduler-translation.service';

@Component({
  selector: 'sl-select-job',
  templateUrl: './select-job.component.html',
  styleUrls: ['./select-job.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatTableModule,
    MatCardModule,
    MatIconModule,
    MatButtonModule,
    MatProgressSpinnerModule
  ]
})
export class SelectJobComponent implements OnInit {
  // Angular 20 dependency injection using inject()
  private schedulerApiService = inject(SchedulerApiService);
  public translationService = inject(DefaultSchedulerTranslationService);
  public dialogRef = inject(MatDialogRef<SelectJobComponent>);

  // Signals for reactive state management
  private _loading = signal(true);
  private _jobs = signal<IJob[]>([]);
  private _errorMessage = signal('');

  // Computed properties
  loading = this._loading.asReadonly();
  jobs = this._jobs.asReadonly();
  errorMessage = this._errorMessage.asReadonly();

  displayedColumns: string[] = ['jobName', 'jobGroup', 'jobClass'];

  ngOnInit() {
    this.schedulerApiService.getAllJobs([], 0, 100, '').subscribe({
      next: (jobs: IJob[]) => {
        this._loading.set(false);
        this._jobs.set(jobs);
      },
      error: (error: any) => {
        this._loading.set(false);
        this._errorMessage.set(error);
        console.error('Error loading jobs:', error);
      }
    });
  }

  selectJob(job: IJob): void {
    this.dialogRef.close(job);
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}
