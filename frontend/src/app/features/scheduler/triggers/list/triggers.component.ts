import { Component, OnInit, ChangeDetectorRef, ViewChild, signal, computed, AfterViewInit, inject, DestroyRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormGroup } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatDialogModule, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatSortModule, MatSort } from '@angular/material/sort';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTooltipModule } from '@angular/material/tooltip';
import { of as observableOf } from 'rxjs';
import { catchError, map, startWith, switchMap } from 'rxjs/operators';

import { ITrigger } from '../trigger';
import { TriggerService } from '../trigger.service';
import { TriggerNewComponent } from '../new/trigger-new.component';
import { IListColumn, ListColumnType } from '../../common/models/ilistColumn';
import { ISearchField } from '../../../list-filters/ISearchCriteria';
import { ErrorService } from '../../common/services/error.service';
import { ListFiltersComponent } from '../../../list-filters/list-filters.component';
import { MatChipsModule } from '@angular/material/chips';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { IJob } from '../../jobs/ijob';
import { ConfirmDialogComponent } from '../../common/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-triggers',
  templateUrl: './triggers.component.html',
  styleUrls: ['./triggers.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    TranslateModule,
    MatTableModule,
    MatDialogModule,
    MatSortModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatProgressSpinnerModule,
    MatTooltipModule,
    ListFiltersComponent,
    MatChipsModule
  ]
})
export class TriggersComponent implements OnInit, AfterViewInit {
  @ViewChild(MatSort, { static: true }) sort!: MatSort;

  // Computed properties
  isLoadingResults = signal(true);
  triggers = signal<ITrigger[]>([]);
  errorMessage = signal('');
  isMediumDeviceOrLess = signal(false);
  dataSource = signal<MatTableDataSource<ITrigger>>(new MatTableDataSource<ITrigger>([]));

  // table data for triggers
  columns: IListColumn[] = [];
  selectedColumns = this.columns;
  allDisplayedColumns: string[] = [
    'triggerName',
    'triggerGroup',
    'type',
    'jobName',
    'jobGroup',
    'startTime',
    'endTime',
    'lastExecutionTime',
    'nextExecutionTime',
    'actions',
  ];
  displayedColumns: string[] = this.allDisplayedColumns;
  userId = signal<number>(0);
  filterSelect = signal<string>('');

  currentPage = signal(0);
  pageSize = signal(10);
  lastProcessedOffset = signal(-1);
  hasMoreRecords = signal(true);
  searchValue = signal<ISearchField[]>([]);

  filterForm!: FormGroup;
  loading = false;
  submitted = false;
  filterList = signal<any>({});
  // sortedData!: ITrigger[];

  dialogRef!: MatDialogRef<any>;
  confirmDialogRef!: MatDialogRef<any>;

  mediumDeviceOrLessDialogSize: string = '100%';
  largerDeviceDialogWidthSize: string = '70%';
  largerDeviceDialogHeightSize: string = '80%';

  private triggerService = inject(TriggerService);
  public dialog = inject(MatDialog);
  private changeDetectorRefs = inject(ChangeDetectorRef);
  private translate = inject(TranslateService);
  private errorService = inject(ErrorService);
  private destroyRef = inject(DestroyRef);

  constructor() { 
    this.initializeColumns();
  }

  ngOnInit() {
    this.manageScreenResizing();
    this.loadData();
    this.filterList.set(this.selectedColumns.filter((items: any) => {
      if (items.filter) {
        return items;
      }
    }));
  }

  private loadData() {
    this.isLoadingResults.set(true);
    this.triggerService.getAll(this.searchValue(), 0, this.pageSize(), this.getSortValue())
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (data) => {
          this.isLoadingResults.set(false);
          this.triggers.set(data);
          this.setDataSource(data);
          this.updatePageInfo(data);
        },
        error: (error) => {
          this.isLoadingResults.set(false);
          this.errorMessage.set(<any>error);
        }
      });
  }

  initializeColumns() {
        // Initialize columns with translated labels
        this.columns = [
          {
            column: 'triggerName',
            label: this.translate.instant('TRIGGERS.FIELDS.NAME'),
            sort: true,
            filter: true,
            type: ListColumnType.String,
            searchColumn: 'triggerName'
          },
          {
            column: 'type',
            label: this.translate.instant('TRIGGERS.FIELDS.TYPE'),
            sort: true,
            filter: true,
            type: ListColumnType.String,
            searchColumn: 'triggerType'
          },
          {
            column: 'triggerGroup',
            label: this.translate.instant('TRIGGERS.FIELDS.GROUP'),
            sort: false,
            filter: true,
            type: ListColumnType.String,
            searchColumn: 'triggerGroup'
          },
          {
            column: 'jobName',
            label: this.translate.instant('TRIGGERS.FIELDS.JOB-NAME'),
            sort: false,
            filter: true,
            type: ListColumnType.String,
            searchColumn: 'jobName'
          },
          {
            column: 'jobGroup',
            label: this.translate.instant('TRIGGERS.FIELDS.JOB-GROUP'),
            sort: false,
            filter: true,
            type: ListColumnType.String,
            searchColumn: 'jobGroup'
          },
          {
            column: 'startTime',
            label: this.translate.instant('TRIGGERS.FIELDS.START-TIME'),
            sort: false,
            filter: true,
            type: ListColumnType.Date,
            searchColumn: 'startTime'
          },
          {
            column: 'endTime',
            label: this.translate.instant('TRIGGERS.FIELDS.END-TIME'),
            sort: false,
            filter: true,
            type: ListColumnType.Date,
            searchColumn: 'endTime'
          },
          {
            column: 'lastExecutionTime',
            label: this.translate.instant('TRIGGERS.FIELDS.LAST-EXECUTION-TIME'),
            sort: false,
            filter: true,
            type: ListColumnType.Date,
            searchColumn: 'lastExecutionTime'
          },
          {
            column: 'nextExecutionTime',
            label: this.translate.instant('TRIGGERS.FIELDS.NEXT-EXECUTION-TIME'),
            sort: false,
            filter: true,
            type: ListColumnType.Date,
            searchColumn: 'nextExecutionTime'
          },
        ];
        this.selectedColumns = this.columns;
  }

  ngAfterViewInit() {
    this.setSort();
  }

  selectedFilter!: String;
  selctFilter(event: any) {
    this.filterSelect = event;
    this.selectedFilter = event;
  }
  applyFilter1(filterValue: string) {
    if (filterValue !== '') {
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
          console.log('DFS');
          this.isLoadingResults.set(true);
          this.initializePageInfo();
          return this.triggerService.getAll(this.searchValue(), 0, this.pageSize(), this.getSortValue());
        }),
        map((data) => {
          // Flip flag to show that loading has finished.
          this.isLoadingResults.set(false);
          return data;
        }),
        catchError(() => {
          this.isLoadingResults.set(false);
          // Catch if some error occurred. Return empty data.
          return observableOf([]);
        })
      )
      .subscribe((data) => {
        this.triggers.set(data);
        this.setDataSource(data);
        //manage pages for virtual scrolling
        this.updatePageInfo(data);
      });
  }

  manageScreenResizing() {
    // Simple responsive check - can be enhanced with actual responsive service
    const checkScreenSize = () => {
      const isMediumOrLess = window.innerWidth <= 768;
      this.isMediumDeviceOrLess.set(isMediumOrLess);

      if (this.dialogRef)
        this.dialogRef.updateSize(
          isMediumOrLess ? this.mediumDeviceOrLessDialogSize : this.largerDeviceDialogWidthSize,
          isMediumOrLess ? this.mediumDeviceOrLessDialogSize : this.largerDeviceDialogHeightSize
        );
    };

    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
  }
  add() {
    this.openDialog();
  }

  openDialog() {
    this.dialogRef = this.dialog.open(TriggerNewComponent, {
      disableClose: true,
      height: this.isMediumDeviceOrLess() ? this.mediumDeviceOrLessDialogSize : this.largerDeviceDialogHeightSize,
      width: this.isMediumDeviceOrLess() ? this.mediumDeviceOrLessDialogSize : this.largerDeviceDialogWidthSize,
      maxWidth: 'none',
      panelClass: 'fc-modal-dialog',
    });
    this.dialogRef.afterClosed().subscribe((result) => {
      console.log(`Dialog result: ${result}`);
      if (result) {
        this.errorService.showError(this.translate.instant('TRIGGERS.MESSAGES.CREATED'));
        this.loadData();
        this.setSort();
      }
    });
  }

  pauseTrigger(trigger: any): void {
    this.openConfirmMessage(
      this.translate.instant('TRIGGERS.MESSAGES.CONFIRM.PAUSE'),
      this.pauseTriggerActionResult,
      trigger
    );
  }

  pauseTriggerActionResult = (action: any, trigger: any) => {
    if (action) {
      this.triggerService.pauseTrigger(trigger.triggerName, trigger.triggerGroup).subscribe((resp) => {
        if (resp) {
          trigger.triggerState = 'PAUSED';
          this.errorService.showError(this.translate.instant('TRIGGERS.MESSAGES.PAUSED'));
        }
      });
      console.log(trigger, 'trigger paused');
    }
  };

  resumeTrigger(trigger: any): void {
    this.openConfirmMessage(
      this.translate.instant('TRIGGERS.MESSAGES.CONFIRM.RESUME'),
      this.resumeTriggerActionResult,
      trigger
    );
  }

  resumeTriggerActionResult = (action: any, trigger: any) => {
    if (action) {
      this.triggerService.resumeTrigger(trigger.triggerName, trigger.triggerGroup).subscribe((resp) => {
        if (resp) {
          trigger.triggerState = 'NORMAL';
          this.errorService.showError(this.translate.instant('TRIGGERS.MESSAGES.RESUMED'));
        }
      });
      console.log(trigger, 'trigger paused');
    }
  };

  deleteTrigger(trigger: any): void {
    this.openConfirmMessage(
      this.translate.instant('TRIGGERS.MESSAGES.CONFIRM.DELETE'),
      this.deleteTriggerActionResult,
      trigger
    );
  }

  deleteTriggerActionResult = (action: any, trigger: any) => {
    if (action) {
      this.triggerService.delete(trigger.triggerName, trigger.triggerGroup).subscribe({
        next: (resp) => {
          const currentTriggers = this.triggers();
          const updatedTriggers = currentTriggers.filter(t => t !== trigger);
          this.triggers.set(updatedTriggers);
          this.errorService.showError(this.translate.instant('TRIGGERS.MESSAGES.DELETED'));
          this.setDataSource(updatedTriggers);
          this.changeDetectorRefs.detectChanges();
        },
        error: (error) => this.errorMessage.set(error)
      });
    }
  };

  openConfirmMessage(message: any, callback: any, trigger: any): void {
    this.confirmDialogRef = this.dialog.open(ConfirmDialogComponent, {
      disableClose: true,
      data: {
        message: message,
      },
    });
    this.confirmDialogRef.afterClosed().subscribe((action) => {
      if (action) {
        callback(action, trigger);
      }
    });
  }

  applyFilter(searchValue: any) {
    this.initializePageInfo();
    this.searchValue.set(searchValue);
    this.isLoadingResults.set(true);
    this.triggerService
      .getAll(this.searchValue(), this.currentPage() * this.pageSize(), this.pageSize(), this.getSortValue())
      .subscribe({
        next: (data) => {
          this.isLoadingResults.set(false);
          this.triggers.set(data);
          this.setDataSource(data);
          this.updatePageInfo(data);
        },
        error: (error) => this.errorMessage.set(error)
      });
  }

  initializePageInfo() {
    this.pageSize.set(10);
    this.lastProcessedOffset.set(-1);
    this.currentPage.set(0);
    this.hasMoreRecords.set(true);
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
    if (!this.isLoadingResults() && this.hasMoreRecords() && this.lastProcessedOffset() < this.triggers().length) {
      this.isLoadingResults.set(true);
      this.triggerService
        .getAll(this.searchValue(), this.currentPage() * this.pageSize(), this.pageSize(), this.getSortValue())
        .subscribe({
          next: (data) => {
            this.isLoadingResults.set(false);
            const currentTriggers = this.triggers();
            const updatedTriggers = [...currentTriggers, ...data];
            this.triggers.set(updatedTriggers);
            this.setDataSource(updatedTriggers);

            this.updatePageInfo(data);
          },
          error: (error) => this.errorMessage.set(error)
        });
    }
  }

  getSortValue(): string {
    let sortVal = '';
    if (this.sort?.active && this.sort?.direction) {
      sortVal = this.sort.active + ',' + this.sort.direction;
    }
    return sortVal;
  }

  private setDataSource(data: ITrigger[]) {
    const ds = new MatTableDataSource<ITrigger>(data);
    ds.sort = this.sort;
    this.dataSource.set(ds);
  }
}
