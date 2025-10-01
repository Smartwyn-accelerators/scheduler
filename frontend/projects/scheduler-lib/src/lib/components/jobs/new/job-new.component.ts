import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatDividerModule } from '@angular/material/divider';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { CommonModule } from '@angular/common';
import { Observable, of } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { MatTooltipModule } from '@angular/material/tooltip';
import { SchedulerApiService } from '../../../services/scheduler-api.service';
import { DefaultSchedulerTranslationService } from '../../../services/scheduler-translation.service';
import { SchedulerErrorService } from '../../../services/scheduler-error.service';

// import { SchedulerApiService } from '../../services/scheduler-api.service';
// import { DefaultSchedulerTranslationService } from '../../services/scheduler-translation.service';
// import { SchedulerErrorService } from '../../services/scheduler-error.service';

@Component({
  selector: 'sl-job-new',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatCheckboxModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatTableModule,
    MatDividerModule,
    MatAutocompleteModule,
    MatProgressSpinnerModule,
    MatTooltipModule
  ],
  templateUrl: './job-new.component.html',
  styleUrls: ['./job-new.component.scss'],
})
export class JobNewComponent implements OnInit {
  jobForm: FormGroup = new FormGroup({});
  loading = false;
  submitted = false;
  ELEMENT_DATA: any = [];
  title = 'Create job';
  isMediumDeviceOrLess: boolean = false;

  displayedColumns: string[] = ['key', 'value', 'actions'];
  dataSource = of(this.ELEMENT_DATA);

  jobClasses: string[] = [];
  options: string[] = [];
  filteredOptions: Observable<string[]> = of([]);
  
  private formBuilder = inject(FormBuilder);
  private schedulerApiService = inject(SchedulerApiService);
  public translationService = inject(DefaultSchedulerTranslationService);
  private errorService = inject(SchedulerErrorService);
  
  constructor(public dialogRef: MatDialogRef<JobNewComponent>) {}

  ngOnInit(): void {
    this.initializeForm();
    this.loadJobGroups();
    this.loadJobClasses();
  }

  private initializeForm(): void {
    this.jobForm = this.formBuilder.group({
      jobName: ['', [Validators.required, Validators.maxLength(100)]],
      jobGroup: ['', [Validators.required, Validators.maxLength(50)]],
      jobClass: ['', Validators.required],
      isDurable: [false],
      description: ['', Validators.maxLength(500)],
    });
  }

  private loadJobGroups(): void {
    this.schedulerApiService.getJobGroups().subscribe({
      next: (groups) => {
        this.options = groups;
        this.setupAutocomplete();
      },
      error: (error) => this.handleError(error)
    });
  }

  private loadJobClasses(): void {
    this.schedulerApiService.getJobClasses().subscribe({
      next: (jobClasses) => {
        this.jobClasses = jobClasses;
      },
      error: (error) => this.handleError(error)
    });
  }

  private setupAutocomplete(): void {
    this.filteredOptions = this.jobForm.get('jobGroup')?.valueChanges.pipe(
      startWith(''),
      map((value) => this._filter(value || ''))
    ) || of([]);
  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();

    return this.options.filter((option) => option.toLowerCase().includes(filterValue));
  }

  onSubmit(): void {
    this.submitted = true;

    if (this.jobForm.invalid) {
      return;
    }

    this.loading = true;
    const newJob = this.prepareJobData();
    
    this.schedulerApiService.createJob(newJob).subscribe({
      next: (data) => {
        this.dialogRef.close(data);
      },
      error: (error) => {
        this.handleError(error);
        this.loading = false;
      }
    });
  }

  private prepareJobData(): any {
    const jobData = this.jobForm.value;
    jobData.jobMapData = {};
    
    this.ELEMENT_DATA.forEach((obj: any) => {
      if (obj.dataKey && obj.dataValue) {
        jobData.jobMapData[obj.dataKey] = obj.dataValue;
      }
    });
    
    return jobData;
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  addJobData(): void {
    this.ELEMENT_DATA.push({
      dataKey: '',
      dataValue: '',
    });
    this.updateDataSource();
  }

  removeJobData(index: number): void {
    this.ELEMENT_DATA.splice(index, 1);
    this.updateDataSource();
  }

  private updateDataSource(): void {
    this.dataSource = of([...this.ELEMENT_DATA]);
  }

  private handleError(error: any): void {
    this.errorService.showError(error as string, 'close');
  }

  getErrorMessage(fieldName: string): string {
    const field = this.jobForm.get(fieldName);
    if (field?.hasError('required')) {
      return this.translationService.instant('SCHEDULER-GENERAL.ERRORS.REQUIRED');
    }
    if (field?.hasError('maxlength')) {
      const maxLength = field.errors?.['maxlength']?.requiredLength;
      return this.translationService.instant('SCHEDULER-GENERAL.ERRORS.LENGTH-EXCEEDING', { length: maxLength });
    }
    return '';
  }
}
