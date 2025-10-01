import { Component, OnInit, inject, signal, computed, effect } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatTableModule } from '@angular/material/table';
import { MatTabsModule } from '@angular/material/tabs';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDividerModule } from '@angular/material/divider';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatChipsModule } from '@angular/material/chips';
import { MatSortModule } from '@angular/material/sort';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatTooltipModule } from '@angular/material/tooltip';
import { CommonModule } from '@angular/common';
import { first } from 'rxjs/operators';
import { of, Observable } from 'rxjs';

import { SchedulerApiService } from '../../../services/scheduler-api.service';
import { DefaultSchedulerTranslationService } from '../../../services/scheduler-translation.service';
import { ITrigger } from '../../../models/trigger.model';
import { IListColumn, ListColumnType } from '../../../models/search.model';
import { MatSnackBar } from '@angular/material/snack-bar';
import { JobData } from '../../../models/job.model';
import { IExecutionHistory } from '../../../models/execution-history.model';

@Component({
  selector: 'sl-trigger-details',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    RouterModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatCheckboxModule,
    MatTableModule,
    MatTabsModule,
    MatProgressSpinnerModule,
    MatDividerModule,
    MatToolbarModule,
    MatChipsModule,
    MatSortModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatTooltipModule
  ],
  templateUrl: './trigger-details.component.html',
  styleUrls: ['./trigger-details.component.scss'],
})
export class TriggerDetailsComponent implements OnInit {
  // Signal-based state management
  errorMessage = signal('');
  trigger = signal<ITrigger | null>(null);
  loading = signal(false);
  submitted = signal(false);

  // Table data signals
  triggerMapData = signal<JobData[]>([]);
  executionHistory = signal<IExecutionHistory[]>([]);

  // Computed values
  isFormValid = computed(() => this.triggerForm?.valid ?? false);
  hasTriggerMapData = computed(() => this.triggerMapData().length > 0);
  hasExecutionHistory = computed(() => this.executionHistory().length > 0);

  // Form
  triggerForm!: FormGroup;

  // Table configuration
  displayedColumns: string[] = ['position', 'name', 'actions'];

  // Data sources
  dataSourceJobData = computed(() => of(this.triggerMapData()));
  dataSourceExecutionHistory = computed(() => of(this.executionHistory()));

  // Constants
  triggerTypes: string[] = ['Simple', 'Cron'];
  ListColumnType = ListColumnType;

  private formBuilder = inject(FormBuilder);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private schedulerApiService = inject(SchedulerApiService);
  public translationService = inject(DefaultSchedulerTranslationService);
  private snackBar = inject(MatSnackBar);

  // Route parameters
  triggerNameParam = this.route?.snapshot.paramMap.get('triggerName') as string;
  triggerGroupParam = this.route?.snapshot.paramMap.get('triggerGroup') as string;

  // Execution history table configuration
  executionHistorycolumns: IListColumn[] = [
    {
      column: 'jobStatus',
      label: this.translationService.instant('EXECUTION-HISTORY.FIELDS.STATUS'),
      sort: false,
      filter: true,
      type: ListColumnType.String,
    },
    {
      column: 'duration',
      label: this.translationService.instant('EXECUTION-HISTORY.FIELDS.DURATION'),
      sort: false,
      filter: true,
      type: ListColumnType.String,
    },
    {
      column: 'firedTime',
      label: this.translationService.instant('EXECUTION-HISTORY.FIELDS.FIRE-TIME'),
      sort: false,
      filter: true,
      type: ListColumnType.Date,
    },
    {
      column: 'finishedTime',
      label: this.translationService.instant('EXECUTION-HISTORY.FIELDS.FINISHED-TIME'),
      sort: false,
      filter: true,
      type: ListColumnType.Date,
    },
  ];

  displayedColumnsExecutionHistory: string[] = this.executionHistorycolumns.map((obj) => {
    return obj.column;
  });

  constructor() { }

  ngOnInit() {
    this.createForm();

    if (this.triggerNameParam && this.triggerGroupParam) {
      this.getTrigger(this.triggerNameParam, this.triggerGroupParam);
      this.getTriggerExecutionHistory(this.triggerNameParam, this.triggerGroupParam);
    }
  }

  private createForm() {
    this.triggerForm = this.formBuilder.group({
      jobName: ['', Validators.required],
      jobGroup: ['', Validators.required],
      triggerName: ['', Validators.required],
      triggerGroup: ['', Validators.required],
      triggerType: ['', Validators.required],
      startDate: [''],
      startTime: [''],
      endDate: [''],
      endTime: [''],
      lastExecutionTime: [''],
      nextExecutionTime: [''],
      cronExpression: [''],
      repeatInterval: ['', Validators.required],
      repeatIndefinitely: [''],
      repeatCount: [''],
      description: [''],
    });
  }

  getTrigger(triggerName: string, triggerGroup: string) {
    this.loading.set(true);
    this.schedulerApiService.getTrigger(triggerName, triggerGroup).subscribe({
      next: (trigger) => {
        if (trigger) {
          this.trigger.set(trigger);
          let triggerobj = {
            ...trigger,
            lastExecutionTime: trigger.lastExecutionTime ? new Date(trigger.lastExecutionTime) : null,
            nextExecutionTime: trigger.nextExecutionTime ? new Date(trigger.nextExecutionTime) : null,
            startTime: this.formatDateStringToAMPM(trigger.startTime),
            startDate: trigger.startTime ? new Date(trigger.startTime) : null,
            endTime: this.formatDateStringToAMPM(trigger.endTime),
            endDate: trigger.endTime ? new Date(trigger.endTime) : null,
          };

          this.triggerForm?.patchValue(triggerobj);
          this.setJobData();
        }
        this.loading.set(false);
      },
      error: (error) => {
        this.errorMessage.set(error);
        this.loading.set(false);
      }
    });
  }

  getTriggerExecutionHistory(triggerName: string, triggerGroup: string) {
    this.schedulerApiService.getTriggerExecutionHistoryByJob(triggerName, triggerGroup, [], 0, 30, null).subscribe({
      next: (executionHistory: IExecutionHistory[]) => {
        this.executionHistory.set(executionHistory);
      },
      error: (error) => this.errorMessage.set(error)
    });
  }

  formatDateStringToAMPM(d: any) {
    if (d) {
      let date = new Date(d);
      let hours = date.getHours();
      let minutes = date.getMinutes();
      let ampm = hours >= 12 ? 'pm' : 'am';
      hours = hours % 12;
      hours = hours ? hours : 12; // the hour '0' should be '12'
      let minutes_str = minutes < 10 ? '0' + minutes : minutes;
      let strTime = hours + ':' + minutes_str + ' ' + ampm;
      return strTime;
    }
    return null;
  }

  private setJobData() {
    let triggerMapData = this.trigger()?.triggerMapData;
    if (triggerMapData) {
      let jobDataArray: JobData[] = [];
      let jobDataKeys = Object.keys(triggerMapData);
      jobDataKeys.forEach((key: any) => {
        jobDataArray.push({
          dataKey: key,
          dataValue: triggerMapData[key]
        } as JobData);
      });

      this.triggerMapData.set(jobDataArray);
    }
  }

  onSubmit() {
    this.submitted.set(true);

    // stop here if form is invalid
    if (this.triggerForm?.invalid) {
      return;
    }

    this.loading.set(true);
    console.log(this.triggerForm?.value);
    let newTrigger: any = {};
    newTrigger = this.triggerForm?.value;
    newTrigger['triggerMapData'] = {};
    this.triggerMapData().forEach(function (obj: any) {
      let tmp: any = {};
      tmp[obj.dataKey] = obj.dataValue;
      newTrigger['triggerMapData'][obj.dataKey] = obj.dataValue;
    });

    //to combine both date and time into same object for start and end times of triggers
    newTrigger['startTime'] = this.combineDateAndTime(newTrigger['startDate'], newTrigger['startTime']);
    newTrigger['endTime'] = this.combineDateAndTime(newTrigger['endDate'], newTrigger['endTime']);
    delete newTrigger['startDate'];
    delete newTrigger['endDate'];

    this.schedulerApiService
      .updateTrigger(newTrigger, this.trigger()?.triggerName as string, this.trigger()?.triggerGroup as string)
      .pipe(first())
      .subscribe({
        next: (data) => {
          this.snackBar.open(this.translationService.instant('TRIGGERS.MESSAGES.UPDATED'), 'Close', { duration: 3000 });
          this.router.navigate(['/scheduler/triggers']);
        },
        error: (error) => {
          this.loading.set(false);
        }
      });
  }

  combineDateAndTime(date: string, time: string): Date {
    let tmpDate = new Date(date);
    let hours: number = parseInt(time.substring(0, 2));
    let minutes = parseInt(time.substring(3, 5));
    let ampm = time.substring(6, 8) ? time.substring(6, 8) : 'am';
    if (ampm.toLocaleLowerCase() == 'pm') {
      hours = hours + 12;
    } else if (ampm.toLocaleLowerCase() == 'am' && hours === 12) {
      hours = 0;
    }
    tmpDate.setHours(hours ? hours : 0);
    tmpDate.setMinutes(minutes ? minutes : 0);
    return tmpDate;
  }

  back() {
    this.router?.navigate(['/scheduler/triggers']);
  }

  addJobData(): void {
    const currentData = this.triggerMapData();
    const newData = [...currentData, {
      dataKey: '',
      dataValue: '',
    }];
    this.triggerMapData.set(newData);
  }

  removeJobData(index: any): void {
    const currentData = this.triggerMapData();
    const newData = currentData.filter((_, i) => i !== index);
    this.triggerMapData.set(newData);
  }

  getErrorMessage(fieldName: string): string {
    const field = this.triggerForm?.get(fieldName);
    if (field?.errors && field.touched) {
      if (field.errors['required']) {
        return this.translationService.instant('SCHEDULER-GENERAL.ERRORS.REQUIRED') || 'This field is required';
      }
      if (field.errors['maxlength']) {
        return this.translationService.instant('SCHEDULER-GENERAL.ERRORS.LENGTH-EXCEDDING') || 'Length exceeded';
      }
    }
    return '';
  }
}
