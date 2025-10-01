import { Component, Inject, computed, signal, inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { DefaultSchedulerTranslationService } from '../../../services/scheduler-translation.service';

export interface ConfirmDialogData {
  confirmationType?: 'delete' | 'custom';
  message?: string;
  title?: string;
  action?: string;
}

@Component({
  selector: 'sl-confirm-dialog',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule,
    MatIconModule
  ],
  templateUrl: './confirm-dialog.component.html',
  styleUrls: ['./confirm-dialog.component.scss'],
})
export class ConfirmDialogComponent {
  private readonly data = signal<ConfirmDialogData>({} as ConfirmDialogData);
  public readonly translate = inject(DefaultSchedulerTranslationService);

  // Computed properties using Angular 20 signals
  readonly confirmMessage = computed(() => {
    const dataValue = this.data();
    
    if (dataValue.confirmationType === 'delete') {
      return this.translate.instant('CONFIRM-DIALOG.DELETE.MESSAGE', 'Are you sure you want to delete this item?');
    }
    return dataValue.message || this.translate.instant('CONFIRM-DIALOG.MESSAGE', 'Are you sure you want to proceed?');
  });

  readonly title = computed(() => {
    const dataValue = this.data();
    
    if (dataValue.confirmationType === 'delete') {
      return this.translate.instant('CONFIRM-DIALOG.DELETE.TITLE', 'Confirm Delete');
    }
    return dataValue.title || this.translate.instant('CONFIRM-DIALOG.TITLE', 'Confirm Action');
  });

  readonly action = computed(() => {
    const dataValue = this.data();
    
    if (dataValue.confirmationType === 'delete') {
      return this.translate.instant('SCHEDULER-GENERAL.BUTTONS.DELETE', 'Delete');
    }
    return dataValue.action || this.translate.instant('SCHEDULER-GENERAL.BUTTONS.CONFIRM', 'Confirm');
  });

  private readonly dialogData = inject<ConfirmDialogData>(MAT_DIALOG_DATA);
  public dialogRef = inject(MatDialogRef<ConfirmDialogComponent>);

  constructor() {
    // Set the data signal
    this.data.set(this.dialogData);
  }

  /**
   * Closes the dialog with a confirmation result
   */
  onConfirm(): void {
    this.dialogRef.close(true);
  }

  /**
   * Closes the dialog without confirmation
   */
  onCancel(): void {
    this.dialogRef.close(false);
  }
}
