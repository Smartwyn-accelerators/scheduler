import { Component, OnInit, ViewChild, signal, inject, DestroyRef, AfterViewInit } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { of as observableOf, Observable } from 'rxjs';
import { catchError, map, startWith, switchMap } from 'rxjs/operators';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatChipsModule } from '@angular/material/chips';
import { JobService } from '../jobs/job.service';

export interface IExecutingJob {
  id?: number;
  jobName?: string;
  jobGroup?: string;
  triggerName?: string;
  triggerGroup?: string;
  jobClass?: string;
  firedTime?: Date;
  nextExecutionTime?: Date;
  jobMapData?: Map<string, string>;
}

@Component({
  selector: 'app-executing-jobs',
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
    TranslateModule,
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

  public dataSource = signal<MatTableDataSource<IExecutingJob>>(new MatTableDataSource<IExecutingJob>([]));
  sortedData = signal<IExecutingJob[]>([]);

  userId = signal<number>(0);
  executingJobs = signal<IExecutingJob[]>([]);
  errorMessage = signal('');
  
  // Angular 20 dependency injection
  private jobService = inject(JobService);
  private destroyRef = inject(DestroyRef);

  constructor(private translate: TranslateService) {}

  ngOnInit() {
    this.loadData();
  }

  ngAfterViewInit() {
    // Set up sorting after view is initialized
    this.setSort();
  }

  private loadData() {
    this.isLoadingResults.set(true);
    this.jobService
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
          return this.jobService.getExecutingJobs();
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
