import { Component, Inject, computed, signal } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { TranslateService, TranslateModule } from '@ngx-translate/core';
import { CommonModule } from '@angular/common';

export interface ConfirmDialogData {
  confirmationType?: 'delete' | 'custom';
  message?: string;
  title?: string;
  action?: string;
}

@Component({
  selector: 'app-confirm-dialog',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule,
    MatIconModule,
    TranslateModule
  ],
  templateUrl: './confirm-dialog.component.html',
  styleUrls: ['./confirm-dialog.component.css'],
})
export class ConfirmDialogComponent {
  private readonly data = signal<ConfirmDialogData>({} as ConfirmDialogData);
  private readonly translate = signal<TranslateService>({} as TranslateService);

  // Computed properties using Angular 20 signals
  readonly confirmMessage = computed(() => {
    const dataValue = this.data();
    const translateValue = this.translate();
    
    if (dataValue.confirmationType === 'delete') {
      return translateValue.instant('CONFIRM-DIALOG.DELETE.MESSAGE');
    }
    return dataValue.message || translateValue.instant('CONFIRM-DIALOG.MESSAGE');
  });

  readonly title = computed(() => {
    const dataValue = this.data();
    const translateValue = this.translate();
    
    if (dataValue.confirmationType === 'delete') {
      return translateValue.instant('CONFIRM-DIALOG.DELETE.TITLE');
    }
    return dataValue.title || translateValue.instant('CONFIRM-DIALOG.TITLE');
  });

  readonly action = computed(() => {
    const dataValue = this.data();
    const translateValue = this.translate();
    
    if (dataValue.confirmationType === 'delete') {
      return translateValue.instant('GENERAL.ACTIONS.DELETE');
    }
    return dataValue.action || translateValue.instant('GENERAL.ACTIONS.CONFIRM');
  });

  constructor(
    @Inject(MAT_DIALOG_DATA) private dialogData: ConfirmDialogData,
    public dialogRef: MatDialogRef<ConfirmDialogComponent>,
    private translateService: TranslateService
  ) {
    // Now that dialogData and translateService are initialized, set the signals
    this.data.set(this.dialogData);
    this.translate.set(this.translateService);
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
