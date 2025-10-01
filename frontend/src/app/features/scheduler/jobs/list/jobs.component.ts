import { Component, OnInit, ViewChild, TemplateRef, ChangeDetectorRef, signal, inject, DestroyRef, AfterViewInit } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatDialog, MatDialogConfig, MatDialogRef } from '@angular/material/dialog';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { of as observableOf } from 'rxjs';
import { catchError, map, startWith, switchMap } from 'rxjs/operators';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { JobService } from '../job.service';
import { IJob } from '../ijob';
import { FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { ISearchField } from '../../../list-filters/ISearchCriteria';
import { IListColumn, ListColumnType } from '../../common/models/ilistColumn';
import { ErrorService } from '../../common/services/error.service';
import { ListFiltersComponent } from '../../../list-filters/list-filters.component';
import { MatTooltipModule } from '@angular/material/tooltip';
import { JobNewComponent } from '../new/job-new.component';
import { ConfirmationDialogComponent } from '../../common/confirmation-dialog/confirmation-dialog.component';

@Component({
  selector: 'app-jobs',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatTableModule,
    MatProgressSpinnerModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
    MatSortModule,
    TranslateModule,
    ListFiltersComponent,
    MatTooltipModule
  ],
  templateUrl: './jobs.component.html',
  styleUrl: './jobs.component.scss'
})
export class JobsComponent implements OnInit, AfterViewInit {
  @ViewChild(MatSort, { static: true }) sort!: MatSort;
  @ViewChild('deleteBox', { static: true }) deleteBox!: TemplateRef<any>;

  // Angular 20 signals
  userId = signal<number>(0);
  filterSelect = signal<string>('');
  jobs = signal<IJob[]>([]);
  dataSource = signal<MatTableDataSource<IJob>>(new MatTableDataSource<IJob>([]));
  isLoadingResults = signal(true);
  filterList = signal<any>({});
  currentPage = signal(0);
  pageSize = signal(10);
  lastProcessedOffset = signal(-1);
  hasMoreRecords = signal(true);
  searchValue = signal<ISearchField[]>([]);
  errorMessage = signal('');
  isMediumDeviceOrLess = signal(false);

  // Dialog references
  dialogRef: MatDialogRef<any> | null = null;
  confirmDialogRef: MatDialogRef<any> | null = null;
  mediumDeviceOrLessDialogSize = '100%';
  largerDeviceDialogWidthSize = '70%';
  largerDeviceDialogHeightSize = '80%';

  filterForm: FormGroup | null = null;

  columns: IListColumn[] = [];
  selectedColumns = this.columns;
  allDisplayedColumns: string[] = ['jobName', 'jobGroup', 'jobClass', 'actions'];
  displayedColumns: string[] = this.allDisplayedColumns;

  // Angular 20 dependency injection
  private jobService = inject(JobService);
  private dialog = inject(MatDialog);
  private changeDetectorRefs = inject(ChangeDetectorRef);
  private translate = inject(TranslateService);
  private errorService = inject(ErrorService);
  private router = inject(Router);
  private destroyRef = inject(DestroyRef);

  constructor() {
    this.initializeColumns();
  }

  ngOnInit() {
    // this.manageScreenResizing();
    this.loadData();
    this.filterList.set(this.selectedColumns.filter((items: any) => {
      if (items.filter) {
        return items;
      }
    }));
  }

  private loadData() {
    this.isLoadingResults.set(true);
    this.jobService.getAll(this.searchValue(), 0, this.pageSize(), this.getSortValue())
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (data) => {
          this.isLoadingResults.set(false);
          this.jobs.set(data);
          this.setDatasource(data);
          this.updatePageInfo(data);
        },
        error: (error) => {
          this.isLoadingResults.set(false);
          this.errorMessage.set(<any>error);
        }
      });
  }


  ngAfterViewInit() {
    // Set up sorting after view is initialized
    // Use setTimeout to ensure MatSort is available
    setTimeout(() => {
      this.setSort();
    }, 0);
  }

  private initializeColumns() {
    this.columns = [
      {
        column: 'jobName',
        label: this.translate.instant('JOBS.FIELDS.NAME'),
        sort: true,
        filter: true,
        type: ListColumnType.String,
        searchColumn: 'jobName'
      },
      {
        column: 'jobGroup',
        label: this.translate.instant('JOBS.FIELDS.GROUP'),
        sort: true,
        filter: true,
        type: ListColumnType.String,
        searchColumn: 'jobGroup'
      },
      {
        column: 'jobClass',
        label: this.translate.instant('JOBS.FIELDS.CLASS'),
        sort: true,
        filter: true,
        type: ListColumnType.String,
        searchColumn: 'jobClass'
      },
      {
        column: 'actions',
        label: this.translate.instant('SCHEDULER-GENERAL.ACTIONS.ACTIONS'),
        sort: false,
        filter: false,
        type: ListColumnType.String,
      },
    ];
    this.selectedColumns = this.columns;
  }

  selectedFilter = signal<String>('');

  selctFilter(event: any) {
    this.filterSelect.set(event);
    this.selectedFilter.set(event);
  }

  applyFilter1(filterValue: string) {
    if (filterValue !== '') {
      // Implementation for filter1
    }
  }

  setSort() {
    if (!this.sort) {
      console.warn('MatSort is not available yet');
      return;
    }

    this.sort.sortChange
      .pipe(
        switchMap(() => {
          this.isLoadingResults.set(true);
          this.initializePageInfo();
          return this.jobService.getAll(this.searchValue(), 0, this.pageSize(), this.getSortValue());
        }),
        map((data) => {
          this.isLoadingResults.set(false);
          return data;
        }),
        catchError(() => {
          this.isLoadingResults.set(false);
          return observableOf([]);
        }),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe((data) => {
        this.jobs.set(data);
        this.setDatasource(data);
        this.updatePageInfo(data);
      });
  }

  setDatasource(data: any) {
    const ds = new MatTableDataSource<IJob>(data);
    ds.sort = this.sort;
    this.dataSource.set(ds);
  }

  // manageScreenResizing() {
  //   this.global.isMediumDeviceOrLess$
  //     .pipe(takeUntilDestroyed(this.destroyRef))
  //     .subscribe((value: boolean) => {
  //       this.isMediumDeviceOrLess.set(value);
  //       if (value) {
  //         this.selectedColumns = this.columns.slice(0, 3);
  //         this.displayedColumns = this.allDisplayedColumns.slice(0, 3);
  //       } else {
  //         this.selectedColumns = this.columns;
  //         this.displayedColumns = this.allDisplayedColumns;
  //       }

  //       if (this.dialogRef) {
  //         this.dialogRef.updateSize(
  //           value ? this.mediumDeviceOrLessDialogSize : this.largerDeviceDialogWidthSize,
  //           value ? this.mediumDeviceOrLessDialogSize : this.largerDeviceDialogHeightSize
  //         );
  //       }
  //     });
  // }


  openCreateJobDialog() {
    this.dialogRef = this.dialog.open(JobNewComponent, {
      disableClose: true,
      height: this.isMediumDeviceOrLess() ? this.mediumDeviceOrLessDialogSize : this.largerDeviceDialogHeightSize,
      width: this.isMediumDeviceOrLess() ? this.mediumDeviceOrLessDialogSize : this.largerDeviceDialogWidthSize,
      maxWidth: 'none',
    });
    this.dialogRef.afterClosed()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((result: any) => {
        console.log(`Dialog result: ${result}`);
        if (result) {
          this.jobs.update(jobs => [...jobs, result]);
          this.errorService.showError(this.translate.instant('JOBS.MESSAGES.CREATED'));
          // this.dataSource.set(new MatTableDataSource<IJob>(this.jobs()));
          this.setDatasource(this.jobs());
          this.changeDetectorRefs.detectChanges();
        }
      });
  }

  closeUserDialog() {
    var result: any;
    //this.dialogRef.close(result);
  }

  triggerJob(job: any, index: any): void {
    let config: MatDialogConfig = {
      hasBackdrop: true,
      data: {
        type: "Confirmation",
        heading: "Trigger Job",
        content: this.translate.instant('JOBS.MESSAGES.CONFIRM.TRIGGER'),
        action: {
          cancelText: "No", saveText: "Confirm"
        }
      }
    }
    this.openConfirmMessage(
      this.triggerJobActionResult,
      job,
      index, config
    );
  }

  triggerJobActionResult = (action: any, job: any) => {
    if (action) {
      console.log(job, 'job triggered');
    }
  };

  pauseJob(job: any, index: any): void {
    let config: MatDialogConfig = {
      hasBackdrop: true,
      data: {
        type: "Confirmation",
        heading: "Pause Job",
        content: this.translate.instant('JOBS.MESSAGES.CONFIRM.PAUSE'),
        action: {
          cancelText: "No", saveText: "Confirm"
        }
      }
    }
    this.openConfirmMessage(
      this.pauseJobActionResult,
      job,
      index, config
    );
  }

  pauseJobActionResult = (action: any, job: IJob) => {
    if (action) {
      this.jobService.pauseJob(job.jobName, job.jobGroup)
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe({
          next: (resp: any) => {
            if (resp) {
              job.jobStatus = 'PAUSED';
              this.errorService.showError(this.translate.instant('JOBS.MESSAGES.PAUSED'));
            }
          },
          error: (error: any) => this.errorMessage.set(error)
        });
    }
  };

  resumeJob(job: any, index: any): void {
    let config: MatDialogConfig = {
      hasBackdrop: true,
      data: {
        type: "Confirmation",
        heading: "Resume Job",
        content: this.translate.instant('JOBS.MESSAGES.CONFIRM.RESUME'),
        action: {
          cancelText: "No", saveText: "Confirm"
        }
      }
    }
    this.openConfirmMessage(
      this.resumeJobActionResult,
      job,
      index, config
    );
  }

  resumeJobActionResult = (action: any, job: any) => {
    if (action) {
      this.jobService.resumeJob(job.jobName, job.jobGroup)
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe({
          next: (resp: any) => {
            if (resp) {
              job.jobStatus = 'ACTIVE';
              this.errorService.showError(this.translate.instant('JOBS.MESSAGES.RESUMED'));
            }
          },
          error: (error: any) => this.errorMessage.set(error)
        });
    }
  };

  deleteJob(job: any, index: any): void {
    let config: MatDialogConfig = {
      hasBackdrop: true,
      data: {
        type: "Delete",
        heading: "Delete Job",
        content: this.translate.instant('JOBS.MESSAGES.CONFIRM.DELETE'),
        action: {
          cancelText: "No", saveText: "Yes"
        }
      }
    }
    this.openConfirmMessage(
      this.deleteJobActionResult,
      job,
      index, config
    );
  }

  deleteJobActionResult = (action: any, job: any, index: any) => {
    if (action) {
      this.jobService.delete(job.jobName, job.jobGroup)
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe({
          next: (resp: any) => {
            this.jobs.update(jobs => {
              const newJobs = [...jobs];
              newJobs.splice(index, 1);
              return newJobs;
            });
            this.errorService.showError(this.translate.instant('JOBS.MESSAGES.DELETED'));
            // this.dataSource.set(new MatTableDataSource<IJob>(this.jobs()));
            this.setDatasource(this.jobs());
            this.changeDetectorRefs.detectChanges();
          },
          error: (error: any) => this.errorMessage.set(error)
        });
    }
  };

  openConfirmMessage(callback: any, job: any, index: any, config: MatDialogConfig): void {
    this.confirmDialogRef = this.dialog.open(ConfirmationDialogComponent, config);
    this.confirmDialogRef.afterClosed()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((action) => {
        if (action) {
          callback(action, job, index);
        }
      });
  }

  applyFilter(searchValue: any) {
    console.log('searchhh', searchValue);
    this.initializePageInfo();
    this.searchValue.set(searchValue);
    this.isLoadingResults.set(true);
    this.jobService
      .getAll(this.searchValue(), this.currentPage() * this.pageSize(), this.pageSize(), this.getSortValue())
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (data) => {
          this.isLoadingResults.set(false);
          this.jobs.set(data);
          this.setDatasource(data);
          this.updatePageInfo(data);
        },
        error: (error) => this.errorMessage.set(<any>error)
      });
  }

  initializePageInfo() {
    this.pageSize.set(10);
    this.lastProcessedOffset.set(-1);
    this.currentPage.set(0);
  }

  //manage pages for virtual scrolling
  updatePageInfo(data: any) {
    if (data.length > 0) {
      this.currentPage.update(page => page + 1);
      this.lastProcessedOffset.update(offset => offset + data.length);
    } else {
      this.hasMoreRecords.set(false);
    }
  }

  onTableScroll() {
    if (!this.isLoadingResults() && this.hasMoreRecords() && this.lastProcessedOffset() < this.jobs().length) {
      this.isLoadingResults.set(true);
      this.jobService
        .getAll(this.searchValue(), this.currentPage() * this.pageSize(), this.pageSize(), this.getSortValue())
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe({
          next: (data) => {
            this.isLoadingResults.set(false);
            this.jobs.update(jobs => jobs.concat(data));
            // this.dataSource.set(new MatTableDataSource<IJob>(this.jobs()));
            this.setDatasource(this.jobs());
            this.updatePageInfo(data);
          },
          error: (error) => this.errorMessage.set(<any>error)
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

  deleteItem = signal<any>(null);

  delete1(val: any) {
    this.deleteItem.set(val);
    this.dialog.open(this.deleteBox, {
      panelClass: 'delete-dialog-box',
    });
  }

  editJob(name: string, group: string) {
    const url = `scheduler/jobs/${name}/${group}`;
    this.router.navigate([url]);
  }
}
