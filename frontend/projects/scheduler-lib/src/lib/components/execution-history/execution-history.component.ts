import { Component, OnInit, ViewChild, signal, computed, inject, DestroyRef, AfterViewInit } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { of as observableOf, Observable } from 'rxjs';
import { catchError, map, startWith, switchMap } from 'rxjs/operators';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';

import { ListFiltersComponent } from '../common/list-filters/list-filters.component';
import { IExecutionHistory } from '../../models/execution-history.model';
import { SchedulerApiService } from '../../services/scheduler-api.service';
import { DefaultSchedulerTranslationService } from '../../services/scheduler-translation.service';
import { IListColumn, ISearchField, ListColumnType } from '../../models/search.model';

@Component({
  selector: 'sl-execution-history',
  templateUrl: './execution-history.component.html',
  styleUrls: ['./execution-history.component.scss'],
  standalone: true,
  imports: [
    CommonModule, 
    MatCardModule, 
    MatTableModule, 
    MatSortModule,
    MatProgressSpinnerModule, 
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatChipsModule,
    ListFiltersComponent
  ],  
})
export class ExecutionHistoryComponent implements OnInit, AfterViewInit {
  @ViewChild(MatSort) sort!: MatSort;
  isLoadingResults = signal(true);

  currentPage = signal(0);
  pageSize = signal(50);
  lastProcessedOffset = signal(-1);
  hasMoreRecords = signal(true);

  columns: IListColumn[] = [];

  selectedColumns = this.columns;
  displayedColumnsExecutionHistory: string[] = [];

  public searchValue = signal<ISearchField[]>([]);
  public dataSource: any = signal<MatTableDataSource<IExecutionHistory>>(new MatTableDataSource<IExecutionHistory>([]));
  sortedData = signal<IExecutionHistory[]>([]);

  userId = signal<number>(0);
  executionHistory = signal<IExecutionHistory[]>([]);
  errorMessage = signal('');
  
  // Angular 20 dependency injection
  private schedulerApiService = inject(SchedulerApiService);
  public translationService = inject(DefaultSchedulerTranslationService);
  private dialog = inject(MatDialog);
  private destroyRef = inject(DestroyRef);

  ngOnInit() {
    // Initialize columns and other setup
    this.initializeColumns();
    this.loadData();
  }

  ngAfterViewInit() {
    // Set up sorting after view is initialized
    this.setSort();
  }

  private loadData() {
    this.isLoadingResults.set(true);
    this.schedulerApiService
      .getJobExecutionHistory(this.searchValue(), 0, this.pageSize(), this.getSortValue())
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (data: IExecutionHistory[]) => {
          this.isLoadingResults.set(false);
          this.executionHistory.set(data);
          this.dataSource.set(new MatTableDataSource(data));
          this.updatePageInfo(data);
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

  onExport() {
    // Create CSV content
    const csvContent = this.createCSVContent();
    this.downloadCSV(csvContent, 'execution-history.csv');
  }

  private createCSVContent(): string {
    const headers = this.columns.map(col => col.label).join(',');
    const rows = this.executionHistory().map(item => [
      item.triggerName,
      item.triggerGroup,
      item.jobName,
      item.jobGroup,
      item.jobClass,
      item.jobStatus,
      item.duration,
      item.firedTime?.toISOString(),
      item.finishedTime?.toISOString()
    ].join(','));
    
    return [headers, ...rows].join('\n');
  }

  private downloadCSV(content: string, filename: string) {
    const blob = new Blob([content], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  private initializeColumns() {
    this.columns = [
      {
        column: 'triggerName',
        searchColumn: 'triggerName',
        label: this.translationService.instant('EXECUTION-HISTORY.FIELDS.TRIGGER-NAME'),
        sort: true,
        filter: true,
        type: ListColumnType.String,
      },
      {
        column: 'triggerGroup',
        searchColumn: 'triggerGroup',
        label: this.translationService.instant('EXECUTION-HISTORY.FIELDS.TRIGGER-GROUP'),
        sort: false,
        filter: true,
        type: ListColumnType.String,
      },
      {
        column: 'jobName',
        searchColumn: 'jobName',
        label: this.translationService.instant('EXECUTION-HISTORY.FIELDS.JOB-NAME'),
        sort: false,
        filter: true,
        type: ListColumnType.String,
      },
      {
        column: 'jobGroup',
        searchColumn: 'jobGroup',
        label: this.translationService.instant('EXECUTION-HISTORY.FIELDS.JOB-GROUP'),
        sort: false,
        filter: true,
        type: ListColumnType.String,
      },
      {
        column: 'jobClass',
        searchColumn: 'jobClass',
        label: this.translationService.instant('EXECUTION-HISTORY.FIELDS.JOB-CLASS'),
        sort: false,
        filter: true,
        type: ListColumnType.String,
      },
      {
        column: 'jobStatus',
        searchColumn: 'jobStatus',
        label: this.translationService.instant('EXECUTION-HISTORY.FIELDS.STATUS'),
        sort: false,
        filter: true,
        type: ListColumnType.String,
      },
      {
        column: 'duration',
        searchColumn: 'duration',
        label: this.translationService.instant('EXECUTION-HISTORY.FIELDS.DURATION'),
        sort: false,
        filter: true,
        type: ListColumnType.String,
      },
      {
        column: 'firedTime',
        searchColumn: 'firedTime',
        label: this.translationService.instant('EXECUTION-HISTORY.FIELDS.FIRE-TIME'),
        sort: false,
        filter: true,
        type: ListColumnType.Date,
      },
      {
        column: 'finishedTime',
        searchColumn: 'finishedTime',
        label: this.translationService.instant('EXECUTION-HISTORY.FIELDS.FINISHED-TIME'),
        sort: false,
        filter: true,
        type: ListColumnType.Date,
      },
    ];
    
    // Initialize displayed columns after columns are set
    this.displayedColumnsExecutionHistory = this.columns.map((obj) => {
      return obj.column;
    });
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
        switchMap((): Observable<IExecutionHistory[]> => {
          this.isLoadingResults.set(true);
          this.initializePageInfo();
          return this.schedulerApiService.getJobExecutionHistory(this.searchValue(), 0, this.pageSize(), this.getSortValue());
        }),
        map((data: IExecutionHistory[]) => {
          this.isLoadingResults.set(false);
          return data;
        }),
        catchError(() => {
          this.isLoadingResults.set(false);
          return observableOf([]);
        }),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe((data: IExecutionHistory[]) => {
        this.executionHistory.set(data);
        this.dataSource.set(new MatTableDataSource(data));
        this.updatePageInfo(data);
      });
  }

  applyFilter(searchFields: ISearchField[]) {
    console.log('Applying filters:', searchFields);
    this.initializePageInfo();
    this.searchValue.set(searchFields);
    this.loadData();
  }

  initializePageInfo() {
    this.pageSize.set(50);
    this.lastProcessedOffset.set(-1);
    this.currentPage.set(0);
  }

  updatePageInfo(data: IExecutionHistory[]) {
    if (data.length > 0) {
      this.currentPage.update(page => page + 1);
      this.lastProcessedOffset.update(offset => offset + data.length);
    } else {
      this.hasMoreRecords.set(false);
    }
  }

  onTableScroll() {
    if (!this.isLoadingResults() && this.hasMoreRecords() && this.lastProcessedOffset() < this.executionHistory().length) {
      this.isLoadingResults.set(true);
      this.schedulerApiService
        .getJobExecutionHistory(this.searchValue(), this.currentPage() * this.pageSize(), this.pageSize(), this.getSortValue())
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe({
          next: (data: IExecutionHistory[]) => {
            this.isLoadingResults.set(false);
            const currentHistory = this.executionHistory();
            const updatedHistory = [...currentHistory, ...data];
            this.executionHistory.set(updatedHistory);
            this.dataSource.set(new MatTableDataSource(updatedHistory));

            this.updatePageInfo(data);
          },
          error: (error: any) => this.errorMessage.set(error)
        });
    }
  }

  getSortValue(): string {
    let sortVal = '';
    if (this.sort && this.sort.active && this.sort.direction) {
      sortVal = this.sort.active + ',' + this.sort.direction;
    }
    return sortVal;
  }

  getStatusColor(status: string): string {
    switch (status?.toUpperCase()) {
      case 'SUCCESS':
        return 'primary';
      case 'FAILED':
      case 'FAILURE':
        return 'warn';
      case 'RUNNING':
        return 'accent';
      case 'PENDING':
        return '';
      default:
        return '';
    }
  }

  getStatusIcon(status: string): string {
    switch (status?.toUpperCase()) {
      case 'SUCCESS':
        return 'check_circle';
      case 'FAILED':
      case 'FAILURE':
        return 'error';
      case 'RUNNING':
        return 'play_circle';
      case 'PENDING':
        return 'schedule';
      default:
        return 'help';
    }
  }
}
