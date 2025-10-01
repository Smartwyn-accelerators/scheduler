import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-audit',
  standalone: true,
  imports: [CommonModule, MatCardModule],
  template: `
    <div class="audit-container">
      <mat-card>
        <mat-card-header>
          <mat-card-title>Audit Management</mat-card-title>
        </mat-card-header>
        <mat-card-content>
          <p>Audit management functionality will be implemented here.</p>
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: [`
    .audit-container {
      padding: 20px;
    }
  `]
})
export class AuditComponent {}
