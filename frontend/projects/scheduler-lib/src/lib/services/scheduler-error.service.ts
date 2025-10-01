import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

/**
 * Error service for the Scheduler Library
 * Provides error handling and user feedback
 */
@Injectable({
  providedIn: 'root'
})
export class SchedulerErrorService {
  constructor(private snackBar: MatSnackBar) {}

  /**
   * Show an error message to the user
   * @param message The error message to display
   * @param action The action button text (optional)
   * @param duration Duration in milliseconds (default: 5000)
   */
  showError(message: string, action: string = 'Close', duration: number = 5000): void {
    this.snackBar.open(message, action, {
      duration,
      panelClass: ['error-snackbar'],
      horizontalPosition: 'center',
      verticalPosition: 'top'
    });
  }

  /**
   * Show a success message to the user
   * @param message The success message to display
   * @param action The action button text (optional)
   * @param duration Duration in milliseconds (default: 3000)
   */
  showSuccess(message: string, action: string = 'Close', duration: number = 3000): void {
    this.snackBar.open(message, action, {
      duration,
      panelClass: ['success-snackbar'],
      horizontalPosition: 'center',
      verticalPosition: 'top'
    });
  }

  /**
   * Show a warning message to the user
   * @param message The warning message to display
   * @param action The action button text (optional)
   * @param duration Duration in milliseconds (default: 4000)
   */
  showWarning(message: string, action: string = 'Close', duration: number = 4000): void {
    this.snackBar.open(message, action, {
      duration,
      panelClass: ['warning-snackbar'],
      horizontalPosition: 'center',
      verticalPosition: 'top'
    });
  }

  /**
   * Show an info message to the user
   * @param message The info message to display
   * @param action The action button text (optional)
   * @param duration Duration in milliseconds (default: 3000)
   */
  showInfo(message: string, action: string = 'Close', duration: number = 3000): void {
    this.snackBar.open(message, action, {
      duration,
      panelClass: ['info-snackbar'],
      horizontalPosition: 'center',
      verticalPosition: 'top'
    });
  }
}
