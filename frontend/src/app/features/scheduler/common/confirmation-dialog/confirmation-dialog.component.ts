import { Component, Inject, computed, signal, WritableSignal } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';

export enum ConfirmationType {
  Confirm = 'Confirm',
  Delete = 'Delete'
}

export interface ConfirmationDialogData {
  heading?: string;
  content: string;
  type?: ConfirmationType;
  action: {
    cancelText: string;
    saveText: string;
  };
}

@Component({
  selector: 'app-confirmation-dialog',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule,
    MatIconModule
  ],
  templateUrl: './confirmation-dialog.component.html',
  styleUrls: ['./confirmation-dialog.component.scss']
})
export class ConfirmationDialogComponent {
  private readonly data: WritableSignal<ConfirmationDialogData>;
  
  // Computed properties using Angular 20 signals
  readonly confirmationType = ConfirmationType;
  readonly heading = computed(() => this.data().heading || 'Confirmation');
  readonly content = computed(() => this.data().content);
  readonly isDeleteType = computed(() => this.data().type === ConfirmationType.Delete);
  readonly cancelText = computed(() => this.data().action.cancelText);
  readonly saveText = computed(() => this.data().action.saveText);

  constructor(
    @Inject(MAT_DIALOG_DATA) private dialogData: ConfirmationDialogData,
    public dialogRef: MatDialogRef<ConfirmationDialogComponent>
  ) {
    this.data = signal<ConfirmationDialogData>(this.dialogData);
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
