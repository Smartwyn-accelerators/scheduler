import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-customers',
  standalone: true,
  imports: [CommonModule, MatCardModule],
  template: `
    <div class="customers-container">
      <mat-card>
        <mat-card-header>
          <mat-card-title>Customers Management</mat-card-title>
        </mat-card-header>
        <mat-card-content>
          <p>Customer management functionality will be implemented here.</p>
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: [`
    .customers-container {
      padding: 20px;
    }
  `]
})
export class CustomersComponent {}
