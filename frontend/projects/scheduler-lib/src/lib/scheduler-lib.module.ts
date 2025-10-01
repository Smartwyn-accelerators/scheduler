import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';

// Angular Material Modules
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSortModule } from '@angular/material/sort';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatSnackBarModule } from '@angular/material/snack-bar';

// Services
import { SchedulerApiService } from './services/scheduler-api.service';
import { DefaultSchedulerTranslationService } from './services/scheduler-translation.service';
import { SchedulerThemeService } from './services/scheduler-theme.service';

// Configuration
import { SCHEDULER_CONFIG, SchedulerConfig } from './interfaces/scheduler-config.interface';

/**
 * Scheduler Library Module
 * 
 * This module provides a complete scheduler solution for Angular applications
 * with support for jobs, triggers, execution history, and executing jobs monitoring.
 * 
 * Features:
 * - Theme integration with user's existing theme
 * - Translation integration with user's translation service
 * - Standalone components for easy integration
 * - Angular Material 20 compatible
 * - TypeScript support with full type definitions
 */
@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    HttpClientModule,
    
    // Angular Material Modules
    MatCardModule,
    MatTableModule,
    MatProgressSpinnerModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
    MatDialogModule,
    MatSortModule,
    MatTooltipModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatSnackBarModule
  ],
  providers: [
    SchedulerApiService,
    SchedulerThemeService,
    {
      provide: DefaultSchedulerTranslationService,
      useClass: DefaultSchedulerTranslationService
    }
  ]
})
export class SchedulerLibModule {
  /**
   * Configure the scheduler library with user-specific settings
   * 
   * @param config Configuration object
   * @returns ModuleWithProviders
   */
  static forRoot(config: SchedulerConfig): ModuleWithProviders<SchedulerLibModule> {
    return {
      ngModule: SchedulerLibModule,
      providers: [
        {
          provide: SCHEDULER_CONFIG,
          useValue: config
        },
        SchedulerApiService,
        SchedulerThemeService,
        {
          provide: DefaultSchedulerTranslationService,
          useClass: DefaultSchedulerTranslationService
        }
      ]
    };
  }

  /**
   * Configure the scheduler library with user's translation service
   * 
   * @param config Configuration object
   * @param userTranslationService User's translation service
   * @returns ModuleWithProviders
   */
  static forRootWithTranslation(
    config: SchedulerConfig, 
    userTranslationService: any
  ): ModuleWithProviders<SchedulerLibModule> {
    return {
      ngModule: SchedulerLibModule,
      providers: [
        {
          provide: SCHEDULER_CONFIG,
          useValue: config
        },
        {
          provide: DefaultSchedulerTranslationService,
          useValue: userTranslationService
        },
        SchedulerApiService,
        SchedulerThemeService
      ]
    };
  }
}
