import { Component, OnInit, ViewChild, signal, inject, DestroyRef, AfterViewInit } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { of as observableOf, Observable } from 'rxjs';
import { catchError, map, startWith, switchMap } from 'rxjs/operators';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatChipsModule } from '@angular/material/chips';

import { IExecutingJob } from '../../models/executing-job.model';
import { SchedulerApiService } from '../../services/scheduler-api.service';
import { DefaultSchedulerTranslationService } from '../../services/scheduler-translation.service';

@Component({
  selector: 'sl-executing-jobs',
  templateUrl: './executing-jobs.component.html',
  styleUrls: ['./executing-jobs.component.scss'],
  standalone: true,
  imports: [
    CommonModule, 
    MatCardModule, 
    MatTableModule, 
    MatProgressSpinnerModule, 
    MatIconModule,
    MatChipsModule,
  ],  
})
export class ExecutingJobsComponent implements OnInit, AfterViewInit {
  @ViewChild(MatSort) sort!: MatSort;
  isLoadingResults = signal(true);

  displayedColumnsExecutingJobs: string[] = [
    'triggerName',
    'triggerGroup',
    'jobName',
    'jobGroup',
    'jobClass',
    'firedTime',
    'nextExecutionTime',
  ];

  public dataSource: any = signal<MatTableDataSource<IExecutingJob>>(new MatTableDataSource<IExecutingJob>([]));
  sortedData = signal<IExecutingJob[]>([]);

  userId = signal<number>(0);
  executingJobs = signal<IExecutingJob[]>([]);
  errorMessage = signal('');
  
  // Angular 20 dependency injection
  private schedulerApiService = inject(SchedulerApiService);
  public translationService = inject(DefaultSchedulerTranslationService);
  private destroyRef = inject(DestroyRef);

  ngOnInit() {
    this.loadData();
  }

  ngAfterViewInit() {
    // Set up sorting after view is initialized
    this.setSort();
  }

  private loadData() {
    this.isLoadingResults.set(true);
    this.schedulerApiService
      .getExecutingJobs()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (data: IExecutingJob[]) => {
          this.isLoadingResults.set(false);
          this.executingJobs.set(data);
          this.dataSource.set(new MatTableDataSource(data));
        },
        error: (error: any) => {
          this.isLoadingResults.set(false);
          this.errorMessage.set(error);
        }
      });
  }

  onRefresh() {
    this.loadData();
  }

  setSort() {
    // Safety check to ensure sort is available
    if (!this.sort) {
      console.warn('MatSort is not available yet');
      return;
    }

    this.sort.sortChange
      .pipe(
        startWith({}),
        switchMap((): Observable<IExecutingJob[]> => {
          this.isLoadingResults.set(true);
          return this.schedulerApiService.getExecutingJobs();
        }),
        map((data: IExecutingJob[]) => {
          this.isLoadingResults.set(false);
          return data;
        }),
        catchError(() => {
          this.isLoadingResults.set(false);
          return observableOf([]);
        }),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe((data: IExecutingJob[]) => {
        this.executingJobs.set(data);
        this.dataSource.set(new MatTableDataSource(data));
      });
  }
}
