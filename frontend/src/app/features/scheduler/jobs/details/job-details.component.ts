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
import { MatTableDataSource } from '@angular/material/table';
import { CommonModule } from '@angular/common';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { first } from 'rxjs/operators';
import { of, Observable } from 'rxjs';
import { JobService } from '../job.service';
import { IJob } from '../ijob';
import { JobData } from '../jobData';
import { ExecutionHistory, IExecutionHistory } from '../../execution-history/executionHistory';
import { plainToClass } from 'class-transformer';
import { ITrigger } from '../../triggers/trigger';
import { IListColumn, ListColumnType } from '../../common/models/ilistColumn';
import { ErrorService } from '../../common/services/error.service';
import { MatTooltipModule } from '@angular/material/tooltip';

@Component({
  selector: 'app-job-details',
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
    TranslateModule,
    MatTooltipModule
  ],
  templateUrl: './job-details.component.html',
  styleUrls: ['./job-details.component.scss'],
})
export class JobDetailsComponent implements OnInit {
  // Signal-based state management
  errorMessage = signal('');
  job = signal<IJob | null>(null);
  loading = signal(false);
  submitted = signal(false);
  jobClasses = signal<string[]>([]);
  
  // Table data signals
  jobData = signal<JobData[]>([]);
  triggers = signal<ITrigger[]>([]);
  executionHistory = signal<IExecutionHistory[]>([]);
  
  // Computed values
  isFormValid = computed(() => this.jobForm?.valid ?? false);
  hasJobData = computed(() => this.jobData().length > 0);
  hasTriggers = computed(() => this.triggers().length > 0);
  hasExecutionHistory = computed(() => this.executionHistory().length > 0);
  
  // Form
  jobForm!: FormGroup;

  // Table configuration
  displayedColumns: string[] = ['position', 'name', 'actions'];
  displayedColumnsTriggers: string[] = ['triggerName', 'triggerGroup', 'type', 'startTime', 'endTime'];
  
  // Data sources
  dataSourceJobData = computed(() => new MatTableDataSource(this.jobData()));
  dataSourceTriggers = computed(() => new MatTableDataSource(this.triggers()));
  dataSourceExecutionHistory = computed(() => {
    const data = this.executionHistory();
    console.log('Creating data source with data:', data);
    return new MatTableDataSource<IExecutionHistory>(data);
  });
  
  private formBuilder = inject(FormBuilder);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private jobService = inject(JobService);
  private translate = inject(TranslateService);
  private errorService = inject(ErrorService);
  
  // Execution history configuration
  executionHistorycolumns: IListColumn[] = [];
  displayedColumnsExecutionHistory: string[] = [];
  
  // Route parameters
  jobNameParam: string | null;
  jobGroupParam: string | null;
  
  // Make ListColumnType available in template
  ListColumnType = ListColumnType;


  constructor() {
    this.jobNameParam = this.route.snapshot.paramMap.get('jobName');
    this.jobGroupParam = this.route.snapshot.paramMap.get('jobGroup');

    this.setupEffects();

  }

  ngOnInit(): void {
    this.initializeForm();
    this.initializeExecutionHistoryColumns();
    this.loadJobClasses();
    
    
    if (this.jobNameParam && this.jobGroupParam) {
      this.getJob(this.jobNameParam, this.jobGroupParam);
      this.getJobExecutionHistory(this.jobNameParam, this.jobGroupParam);
    }
  }

  private initializeExecutionHistoryColumns(): void {
    this.executionHistorycolumns = [
      {
        column: 'triggerName',
        label: this.translate.instant('EXECUTION-HISTORY.FIELDS.TRIGGER-NAME'),
        sort: true,
        filter: true,
        type: ListColumnType.String,
      },
      {
        column: 'triggerGroup',
        label: this.translate.instant('EXECUTION-HISTORY.FIELDS.TRIGGER-GROUP'),
        sort: false,
        filter: true,
        type: ListColumnType.String,
      },
      {
        column: 'jobClass',
        label: this.translate.instant('EXECUTION-HISTORY.FIELDS.JOB-CLASS'),
        sort: false,
        filter: true,
        type: ListColumnType.String,
      },
      {
        column: 'jobStatus',
        label: this.translate.instant('EXECUTION-HISTORY.FIELDS.STATUS'),
        sort: false,
        filter: true,
        type: ListColumnType.String,
      },
      {
        column: 'duration',
        label: this.translate.instant('EXECUTION-HISTORY.FIELDS.DURATION'),
        sort: false,
        filter: true,
        type: ListColumnType.String,
      },
      {
        column: 'firedTime',
        label: this.translate.instant('EXECUTION-HISTORY.FIELDS.FIRE-TIME'),
        sort: false,
        filter: true,
        type: ListColumnType.Date,
      },
      {
        column: 'finishedTime',
        label: this.translate.instant('EXECUTION-HISTORY.FIELDS.FINISHED-TIME'),
        sort: false,
        filter: true,
        type: ListColumnType.Date,
      },
    ];
    this.displayedColumnsExecutionHistory = this.executionHistorycolumns.map((obj) => obj.column);
  }

  private setupEffects(): void {
    // Effect to update form when job changes
    effect(() => {
      const currentJob = this.job();
      if (currentJob && this.jobForm) {
        this.jobForm.patchValue(currentJob);
      }
    });
  }

  private initializeForm(): void {
    this.jobForm = this.formBuilder.group({
      jobName: [{ value: '', disabled: true }, Validators.required],
      jobGroup: [{ value: '', disabled: true }, Validators.required],
      jobClass: [{ value: '', disabled: true }, Validators.required],
      isDurable: [false],
      jobDescription: ['', Validators.maxLength(500)],
    });
  }

  private loadJobClasses(): void {
    this.jobService.getJobClasses().subscribe({
      next: (jobClasses) => {
        this.jobClasses.set(jobClasses);
      },
      error: (error) => this.handleError(error)
    });
  }

  getJob(jobName: string, jobGroup: string): void {
    this.loading.set(true);
    this.jobService.get(jobName, jobGroup).subscribe({
      next: (job) => {
        this.job.set(job);
        this.setJobData(job);
        this.setTriggers(job);
        this.setExecutionHistory(job);
        this.loading.set(false);
      },
      error: (error) => {
        this.handleError(error);
        this.loading.set(false);
      }
    });
  }

  getJobExecutionHistory(jobName: string, jobGroup: string): void {
    this.jobService.getJobExecutionHistoryByJob(jobName, jobGroup, [], 0, 30, "").subscribe({
      next: (executionHistory) => {
        console.log('Execution history data received:', executionHistory);
        // Convert date strings to Date objects if needed
        const processedHistory = executionHistory.map(item => ({
          ...item,
          firedTime: item.firedTime ? new Date(item.firedTime) : undefined,
          finishedTime: item.finishedTime ? new Date(item.finishedTime) : undefined
        }));
        this.executionHistory.set(processedHistory);
        console.log('Execution history set:', this.executionHistory());
      },
      error: (error) => this.handleError(error)
    });
  }

  private setTriggers(job: IJob): void {
    if (job.triggerDetails) {
      this.triggers.set(job.triggerDetails);
    }
  }

  private setExecutionHistory(job: IJob): void {
    if (job.executionHistory) {
      this.executionHistory.set(job.executionHistory);
    }
  }

  private setJobData(job: IJob): void {
    const jobMapData: any = job['jobMapData'];
    if (jobMapData) {
      const jobDataKeys = Object.keys(jobMapData);
      const jobDataArray = jobDataKeys.map((key) =>
        plainToClass(JobData, {
          dataKey: key,
          dataValue: jobMapData[key]
        } as Object)
      );
      this.jobData.set(jobDataArray);
    }
  }

  addJobData(): void {
    const currentJobData = this.jobData();
    const newJobData = [
      ...currentJobData,
      plainToClass(JobData, {
        dataKey: '',
        dataValue: '',
      })
    ];
    this.jobData.set(newJobData);
  }

  removeJobData(index: number): void {
    const currentJobData = this.jobData();
    const newJobData = currentJobData.filter((_, i) => i !== index);
    this.jobData.set(newJobData);
  }

  compareFn: ((f1: any, f2: any) => boolean) | null = this.compareByValue;

  compareByValue(f1: any, f2: any): boolean {
    return f1 && f2 && f1 === f2;
  }

  onSubmit(): void {
    this.submitted.set(true);

    if (this.jobForm.invalid) {
      return;
    }

    this.loading.set(true);
    const newJob = this.prepareJobData();
    
    this.jobService
      .update(newJob, newJob['jobName'], newJob['jobGroup'])
      .pipe(first())
      .subscribe({
        next: (data) => {
          this.errorService.showError(this.translate.instant('JOBS.MESSAGES.UPDATED'));
          this.router.navigate(['/scheduler/jobs']);
        },
        error: (error) => {
          this.handleError(error);
          this.loading.set(false);
        }
      });
  }

  private prepareJobData(): any {
    const newJob = this.jobForm.getRawValue();
    newJob['jobMapData'] = {};
    
    this.jobData().forEach((obj) => {
      if (obj.dataKey && obj.dataValue) {
        newJob['jobMapData'][obj.dataKey] = obj.dataValue;
      }
    });
    
    return newJob;
  }

  back(): void {
    this.router.navigate(['/scheduler/jobs']);
  }

  private handleError(error: any): void {
    const errorMsg = error as string;
    this.errorMessage.set(errorMsg);
    this.errorService.showError(errorMsg);
  }

  getErrorMessage(fieldName: string): string {
    const field = this.jobForm.get(fieldName);
    if (field?.hasError('required')) {
      return this.translate.instant('SCHEDULER-GENERAL.ERRORS.REQUIRED');
    }
    if (field?.hasError('maxlength')) {
      const maxLength = field.errors?.['maxlength']?.requiredLength;
      return this.translate.instant('SCHEDULER-GENERAL.ERRORS.LENGTH-EXCEEDING', { length: maxLength });
    }
    return '';
  }
}
