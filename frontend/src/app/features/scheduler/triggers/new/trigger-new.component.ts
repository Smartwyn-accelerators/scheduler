import { Component, OnInit, ChangeDetectorRef, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, AbstractControl, FormBuilder, FormGroup, Validators, FormsModule, ValidatorFn } from '@angular/forms';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { MatDialogModule, MatDialogRef, MatDialog } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatRadioModule } from '@angular/material/radio';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { first } from 'rxjs/operators';
import { Observable, of } from 'rxjs';
import { map, startWith } from 'rxjs/operators';

import { TriggerService } from '../trigger.service';
import { SelectJobComponent } from '../select-job/select-job.component';
import { MatTooltipModule } from '@angular/material/tooltip';

@Component({
  selector: 'app-trigger-new',
  templateUrl: './trigger-new.component.html',
  styleUrls: ['./trigger-new.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    TranslateModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatCardModule,
    MatTableModule,
    MatIconModule,
    MatRadioModule,
    MatCheckboxModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatAutocompleteModule,
    SelectJobComponent,
    MatIconModule,
    MatTooltipModule
  ]
})
export class TriggerNewComponent implements OnInit {
  selectJobDialogRef: MatDialogRef<any> | null = null;

  // Signals for reactive state management
  private _isMediumDeviceOrLess = signal(false);
  private _loading = signal(false);

  // Computed properties
  isMediumDeviceOrLess = this._isMediumDeviceOrLess.asReadonly();
  loading = this._loading.asReadonly();

  mediumDeviceOrLessDialogSize: string = '100%';
  largerDeviceDialogWidthSize: string = '65%';
  largerDeviceDialogHeightSize: string = '75%';

  triggerForm!: FormGroup  ;
  submitted = false;
  jobselected = false;
  triggerMapData: any = [];

  triggerTypes: string[] = ['Simple', 'Cron'];

  displayedColumns: string[] = ['position', 'name', 'actions'];
  dataSource = of(this.triggerMapData);

  options: string[] = [];
  filteredOptions: Observable<string[]> | null | undefined = null;
  constructor(
    private formBuilder: FormBuilder,
    private triggerService: TriggerService,
    public dialogRef: MatDialogRef<TriggerNewComponent>,
    public dialog: MatDialog,
    private changeDetectorRefs: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.createForm();
    this.getTriggerGroups();
    // Set up autocomplete after form is created
    setTimeout(() => {
      this.setupAutocomplete();
    }, 0);
  }
  private _filter(value: string): string[] {
    if (!value || !this.options) {
      return this.options || [];
    }
    const filterValue = value.toLowerCase();
    return this.options.filter((option) => option.toLowerCase().includes(filterValue));
  }

  createForm() {
    this.triggerForm = this.formBuilder.group(
      {
        jobName: [{ value: 'ads', disabled: true }, Validators.required],
        jobGroup: [{ value: 'asd', disabled: true }, Validators.required],
        // jobClass: [{ value: '', disabled: true }, Validators.required],
        triggerName: ['', Validators.required],
        triggerGroup: ['', Validators.required],
        triggerType: ['', Validators.required],
        startDate: [''],
        startTime: ['12:00'],
        endDate: [''],
        endTime: [''],
        cronExpression: [''],
        repeatInterval: ['', Validators.required],
        repeatIndefinite: [''],
        repeatCount: [''],
        description: [''],
      },
      { validator: this.jobValidatorFn }
    );

    this.triggerForm.get('triggerType')?.setValue(this.triggerTypes[0]);
    this.triggerForm.get('repeatIndefinite')?.setValue(true);

    this.triggerForm.get('triggerType')?.valueChanges.subscribe((newForm) => {
      let triggerType = this.triggerForm?.get('triggerType')?.value as string;

      if (triggerType === this.triggerTypes[0]) {
        //making cron expression not required in case of simple trigger
        this.triggerForm?.get('cronExpression')?.setValidators([] as ValidatorFn[]);
        this.triggerForm?.get('cronExpression')?.updateValueAndValidity();

        //making repeat Interval required in case of simple trigger
        this.triggerForm?.get('repeatInterval')?.setValidators([Validators.required] as ValidatorFn[]);
        this.triggerForm?.get('repeatInterval')?.updateValueAndValidity();
      } else {
        //making cron expression required in case of cron trigger
        this.triggerForm?.get('cronExpression')?.setValidators([Validators.required] as ValidatorFn[]);
        this.triggerForm?.get('cronExpression')?.updateValueAndValidity();

        //making repeat Interval not required in case of cron trigger
        this.triggerForm?.get('repeatInterval')?.setValidators([] as ValidatorFn[]);
        this.triggerForm?.get('repeatInterval')?.updateValueAndValidity();
      }
    });

    this.triggerForm.get('repeatIndefinite')?.valueChanges.subscribe((newForm) => {
      let triggerType = this.triggerForm?.get('triggerType')?.value as string;
      let repeatIndefinite = this.triggerForm?.get('repeatIndefinite')?.value as boolean;

      if (triggerType === this.triggerTypes[1] || repeatIndefinite) {
        //making repeat count not required in case of repeating indefinitely
        this.triggerForm?.get('repeatCount')?.setValidators([] as ValidatorFn[]);
        this.triggerForm?.get('repeatCount')?.updateValueAndValidity();
      } else if (triggerType === this.triggerTypes[0] && !repeatIndefinite) {
        //making repeat count required in case of not repeating indefinitely
        this.triggerForm?.get('repeatCount')?.setValidators([Validators.required] as ValidatorFn[]);
        this.triggerForm?.get('repeatCount')?.updateValueAndValidity();
      }
    });

    this.triggerForm.get('repeatIndefinite')?.valueChanges.subscribe((newForm) => {
      let triggerType = this.triggerForm?.get('triggerType')?.value as string;
      let repeatIndefinite = this.triggerForm?.get('repeatIndefinite')?.value as boolean;

      if (triggerType === this.triggerTypes[1] || repeatIndefinite) {
        //making repeat count not required in case of repeating indefinitely
        this.triggerForm?.get('repeatCount')?.setValidators([] as ValidatorFn[]);
        this.triggerForm?.get('repeatCount')?.updateValueAndValidity();
      } else if (triggerType === this.triggerTypes[0] && !repeatIndefinite) {
        //making repeat count required in case of not repeating indefinitely
        this.triggerForm?.get('repeatCount')?.setValidators([Validators.required] as ValidatorFn[]);
        this.triggerForm?.get('repeatCount')?.updateValueAndValidity();
      }
    });
  }

  getTriggerGroups() {
    this.triggerService.getTriggerGroups().subscribe((groups: string[]) => {
      this.options = groups;
      this.setupAutocomplete();
    });
  }

  private setupAutocomplete() {
    if (this.triggerForm?.get('triggerGroup')) {
      this.filteredOptions = this.triggerForm.get('triggerGroup')?.valueChanges.pipe(
        startWith(''),
        map((value: string) => this._filter(value))
      );
    }
  }

  onSubmit() {
    this.submitted = true;
    // stop here if form is invalid
    if (this.triggerForm?.invalid) {
      return;
    }

    this._loading.set(true);
    let newTrigger;
    // using getRawValues to get disabled fields values as well
    newTrigger = this.triggerForm?.getRawValue();
    newTrigger['triggerMapData'] = this.getTriggerMapData();
    //to combine both date and time into same object for start and end times of triggers
    newTrigger['startTime'] = this.combineDateAndTime(newTrigger['startDate'], newTrigger['startTime']);
    newTrigger['endTime'] = this.combineDateAndTime(newTrigger['endDate'], newTrigger['endTime']);
    delete newTrigger['startDate'];
    delete newTrigger['endDate'];
    this.triggerService
      .create(newTrigger)
      .pipe(first())
      .subscribe({
        next: (data: any) => {
          this.dialogRef.close(data);
        },
        error: (error: any) => {
          this._loading.set(false);
        }
      });
  }

  getTriggerMapData() {
    let triggerMapData: any = {};
    this.triggerMapData.forEach(function (obj:any) {
      triggerMapData[obj.dataKey] = obj.dataValue;
    });
    return triggerMapData;
  }

  combineDateAndTime(date: string, time: string){
    if (!date) {
      return null;
    }
    let tmpDate = new Date(date);
    
    // Handle HTML time input format (HH:MM)
    if (time && time.includes(':')) {
      let [hours, minutes] = time.split(':').map(Number);
      tmpDate.setHours(hours || 0);
      tmpDate.setMinutes(minutes || 0);
    } else {
      // Fallback for old format if needed
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
    }
    
    return tmpDate;
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  addJobData(): void {
    this.triggerMapData.push({
      dataKey: '',
      dataValue: '',
    });
    this.dataSource = of(this.triggerMapData);
  }

  removeJobData(index: any): void {
    this.triggerMapData.splice(index, 1);
    this.dataSource = of(this.triggerMapData);
  }

  selectJob(): void {
    this.selectJobDialogRef = this.dialog.open(SelectJobComponent, {
      disableClose: true,
      height: this.isMediumDeviceOrLess() ? this.mediumDeviceOrLessDialogSize : this.largerDeviceDialogHeightSize,
      width: this.isMediumDeviceOrLess() ? this.mediumDeviceOrLessDialogSize : this.largerDeviceDialogWidthSize,
      maxWidth: 'none',
      panelClass: 'fc-modal-dialog',
    });
    this.selectJobDialogRef.afterClosed().subscribe((result) => {
      if (result) {
      this.jobselected = true;
      this.triggerForm?.get('jobName')?.setValue(result.jobName);
      this.triggerForm?.get('jobGroup')?.setValue(result.jobGroup);
      this.changeDetectorRefs.detectChanges();
      }
    });
  }

  jobValidatorFn = (group: AbstractControl) => {
    return !group?.get('jobName')?.value || !group?.get('jobGroup')?.value ? { invalidRepository: true } : null;
  };
}
