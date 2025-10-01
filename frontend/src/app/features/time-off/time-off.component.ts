import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-time-off',
  standalone: true,
  imports: [CommonModule, MatCardModule],
  template: `
    <div class="time-off-container">
      <mat-card>
        <mat-card-header>
          <mat-card-title>Time Off Management</mat-card-title>
        </mat-card-header>
        <mat-card-content>
          <p>Time off management functionality will be implemented here.</p>
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: [`
    .time-off-container {
      padding: 20px;
    }
  `]
})
export class TimeOffComponent {}
