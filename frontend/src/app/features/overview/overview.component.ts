import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-overview',
  standalone: true,
  imports: [CommonModule, MatCardModule],
  template: `
    <div class="overview-container">
      <mat-card>
        <mat-card-header>
          <mat-card-title>Timesheet Review</mat-card-title>
        </mat-card-header>
        <mat-card-content>
          <p>Timesheet review functionality will be implemented here.</p>
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: [`
    .overview-container {
      padding: 20px;
    }
  `]
})
export class OverviewComponent {}
