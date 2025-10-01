import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { AuthenticationService } from '../../core/services/authentication.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatCardModule],
  template: `
    <div class="home-container">
      <mat-card>
        <mat-card-header>
          <mat-card-title>Welcome to Timesheet Application</mat-card-title>
        </mat-card-header>
        <mat-card-content>
          <p>You are successfully logged in!</p>
          <p>User ID: {{ getUserId() }}</p>
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: [`
    .home-container {
      padding: 20px;
      max-width: 600px;
      margin: 0 auto;
    }
  `]
})
export class HomeComponent {
  private authService = inject(AuthenticationService);

  getUserId(): number | undefined {
    return this.authService.getLoggedinUserId();
  }
}
