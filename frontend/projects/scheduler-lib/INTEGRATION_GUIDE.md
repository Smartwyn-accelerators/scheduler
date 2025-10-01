# Scheduler Library Integration Guide

This guide provides detailed instructions for integrating the Scheduler Library into your Angular 20 application with theme and translation support.

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Installation](#installation)
3. [Basic Integration](#basic-integration)
4. [Theme Integration](#theme-integration)
5. [Translation Integration](#translation-integration)
6. [Advanced Configuration](#advanced-configuration)
7. [Troubleshooting](#troubleshooting)

## Prerequisites

- Angular 20+
- Angular Material 20+
- Node.js 18+
- TypeScript 5+

## Installation

### 1. Install the Library

```bash
npm install @your-org/scheduler-lib
```

### 2. Install Peer Dependencies

```bash
npm install @angular/material @angular/cdk
```

## Basic Integration

### 1. Import the Module

```typescript
// app.module.ts
import { SchedulerLibModule } from '@your-org/scheduler-lib';

@NgModule({
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    SchedulerLibModule.forRoot({
      apiUrl: 'https://your-api.com/scheduler',
      features: {
        jobs: true,
        triggers: true,
        executionHistory: true,
        executingJobs: true
      }
    })
  ],
  // ...
})
export class AppModule { }
```

### 2. Add Routes (Optional)

```typescript
// app.routes.ts
import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'scheduler',
    children: [
      {
        path: 'jobs',
        loadComponent: () => import('./features/scheduler/jobs/jobs.component').then(m => m.JobsComponent)
      },
      {
        path: 'triggers',
        loadComponent: () => import('./features/scheduler/triggers/triggers.component').then(m => m.TriggersComponent)
      },
      {
        path: 'execution-history',
        loadComponent: () => import('./features/scheduler/execution-history/execution-history.component').then(m => m.ExecutionHistoryComponent)
      },
      {
        path: 'executing-jobs',
        loadComponent: () => import('./features/scheduler/executing-jobs/executing-jobs.component').then(m => m.ExecutingJobsComponent)
      }
    ]
  }
];
```

## Theme Integration

### 1. Import Theme Styles

```scss
// styles.scss
@import '@your-org/scheduler-lib/themes/scheduler-theme.scss';

// Your existing theme
@use '@angular/material' as mat;

$my-primary: mat.define-palette(mat.$indigo-palette);
$my-accent: mat.define-palette(mat.$pink-palette, A200, A100, A400);
$my-theme: mat.define-light-theme((
  color: (
    primary: $my-primary,
    accent: $my-accent,
  ),
  typography: mat.define-typography-config(),
  density: 0,
));

@include mat.all-component-themes($my-theme);
```

### 2. Initialize Theme Service

```typescript
// app.component.ts
import { Component, OnInit } from '@angular/core';
import { SchedulerThemeService } from '@your-org/scheduler-lib';

@Component({
  selector: 'app-root',
  template: '<router-outlet></router-outlet>'
})
export class AppComponent implements OnInit {
  constructor(private schedulerThemeService: SchedulerThemeService) {}

  ngOnInit() {
    // Initialize scheduler theme integration
    this.schedulerThemeService.initializeTheme();
  }
}
```

### 3. Custom Theme Properties

```typescript
// app.component.ts
export class AppComponent implements OnInit {
  constructor(private schedulerThemeService: SchedulerThemeService) {}

  ngOnInit() {
    this.schedulerThemeService.initializeTheme();
    
    // Apply custom theme properties
    this.schedulerThemeService.updateThemeProperties({
      'scheduler-primary': '#your-primary-color',
      'scheduler-container-padding': '32px',
      'scheduler-border-radius': '16px'
    });
  }
}
```

## Translation Integration

### 1. With ngx-translate

```typescript
// app.module.ts
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { SchedulerLibModule } from '@your-org/scheduler-lib';

@NgModule({
  imports: [
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      }
    }),
    SchedulerLibModule.forRootWithTranslation({
      apiUrl: 'https://your-api.com/scheduler',
      translation: {
        useExistingTranslation: true,
        prefix: 'SCHEDULER'
      }
    }, translateService)
  ],
  // ...
})
export class AppModule { }
```

### 2. Translation Files

```json
// assets/i18n/en.json
{
  "SCHEDULER": {
    "JOBS": {
      "FIELDS": {
        "NAME": "Name",
        "GROUP": "Group",
        "CLASS": "Class"
      },
      "MESSAGES": {
        "CREATED": "Job created successfully",
        "DELETED": "Job deleted successfully",
        "PAUSED": "Job paused successfully",
        "RESUMED": "Job resumed successfully",
        "CONFIRM": {
          "TRIGGER": "Are you sure you want to trigger this job?",
          "PAUSE": "Are you sure you want to pause this job?",
          "RESUME": "Are you sure you want to resume this job?",
          "DELETE": "Are you sure you want to delete this job?"
        }
      }
    },
    "TRIGGERS": {
      "FIELDS": {
        "NAME": "Name",
        "GROUP": "Group",
        "TYPE": "Type",
        "JOB-NAME": "Job Name",
        "JOB-GROUP": "Job Group",
        "START-TIME": "Start Time",
        "END-TIME": "End Time",
        "LAST-EXECUTION-TIME": "Last Execution",
        "NEXT-EXECUTION-TIME": "Next Execution"
      },
      "MESSAGES": {
        "CREATED": "Trigger created successfully",
        "DELETED": "Trigger deleted successfully",
        "PAUSED": "Trigger paused successfully",
        "RESUMED": "Trigger resumed successfully",
        "CONFIRM": {
          "PAUSE": "Are you sure you want to pause this trigger?",
          "RESUME": "Are you sure you want to resume this trigger?",
          "DELETE": "Are you sure you want to delete this trigger?"
        }
      }
    },
    "SCHEDULER-GENERAL": {
      "ACTIONS": {
        "ACTIONS": "Actions"
      },
      "BUTTONS": {
        "CREATE": "Create",
        "EDIT": "Edit",
        "DELETE": "Delete",
        "PAUSE": "Pause",
        "RESUME": "Resume",
        "TRIGGER": "Trigger",
        "CANCEL": "Cancel",
        "SAVE": "Save",
        "CONFIRM": "Confirm",
        "YES": "Yes",
        "NO": "No"
      }
    },
    "COMMON": {
      "LOADING": "Loading...",
      "ERROR": "Error",
      "SUCCESS": "Success",
      "CONFIRM": "Confirm",
      "CANCEL": "Cancel"
    }
  }
}
```

### 3. Custom Translation Service

```typescript
// custom-translation.service.ts
import { Injectable } from '@angular/core';
import { SchedulerTranslationService } from '@your-org/scheduler-lib';

@Injectable()
export class CustomSchedulerTranslationService implements SchedulerTranslationService {
  constructor(private translateService: TranslateService) {}

  instant(key: string, params?: any): string {
    return this.translateService.instant(`SCHEDULER.${key}`, params);
  }

  get(key: string, params?: any): any {
    return this.translateService.get(`SCHEDULER.${key}`, params);
  }
}

// app.module.ts
@NgModule({
  providers: [
    {
      provide: SchedulerTranslationService,
      useClass: CustomSchedulerTranslationService
    }
  ]
})
export class AppModule { }
```

## Advanced Configuration

### 1. Custom API Service

```typescript
// custom-scheduler-api.service.ts
import { Injectable } from '@angular/core';
import { SchedulerApiService } from '@your-org/scheduler-lib';

@Injectable()
export class CustomSchedulerApiService extends SchedulerApiService {
  constructor(http: HttpClient) {
    super(http, { apiUrl: 'https://your-custom-api.com/scheduler' });
  }

  // Override methods as needed
  getAllJobs(searchFields: ISearchField[], offset: number, limit: number, sort: string) {
    // Add custom headers, authentication, etc.
    return super.getAllJobs(searchFields, offset, limit, sort);
  }
}
```

### 2. Feature Flags

```typescript
// app.module.ts
SchedulerLibModule.forRoot({
  apiUrl: 'https://your-api.com/scheduler',
  features: {
    jobs: true,           // Enable job management
    triggers: true,       // Enable trigger management
    executionHistory: false, // Disable execution history
    executingJobs: true   // Enable executing jobs monitoring
  }
})
```

### 3. Custom Theme Properties

```typescript
// app.component.ts
export class AppComponent implements OnInit {
  constructor(private schedulerThemeService: SchedulerThemeService) {}

  ngOnInit() {
    this.schedulerThemeService.initializeTheme();
    
    // Apply custom theme properties
    this.schedulerThemeService.updateThemeProperties({
      'scheduler-primary': '#your-primary-color',
      'scheduler-secondary': '#your-secondary-color',
      'scheduler-container-padding': '32px',
      'scheduler-card-padding': '24px',
      'scheduler-border-radius': '16px',
      'scheduler-font-size-title': '28px'
    });
  }
}
```

## Troubleshooting

### Common Issues

#### 1. Theme Not Applied

**Problem**: Scheduler components don't use your theme colors.

**Solution**: 
- Ensure you've imported the theme styles in your `styles.scss`
- Call `schedulerThemeService.initializeTheme()` in your app component
- Check that your theme variables are properly defined

#### 2. Translations Not Working

**Problem**: Components show translation keys instead of translated text.

**Solution**:
- Verify your translation files include the scheduler keys
- Check that the translation service is properly configured
- Ensure the translation prefix is correct

#### 3. API Errors

**Problem**: Components show API errors.

**Solution**:
- Verify your API URL is correct
- Check that your backend API follows the expected structure
- Ensure CORS is properly configured
- Verify authentication headers if required

#### 4. Styling Issues

**Problem**: Components don't look right or are not responsive.

**Solution**:
- Import the theme styles in your global styles
- Check that Angular Material is properly configured
- Verify that the theme service is initialized
- Use browser dev tools to check CSS custom properties

### Debug Mode

Enable debug mode to see additional logging:

```typescript
// app.module.ts
SchedulerLibModule.forRoot({
  apiUrl: 'https://your-api.com/scheduler',
  debug: true // Enable debug logging
})
```

### Getting Help

If you encounter issues:

1. Check the browser console for errors
2. Verify your configuration matches the examples
3. Check the API documentation
4. Open an issue on GitHub with:
   - Angular version
   - Library version
   - Error messages
   - Configuration code
   - Steps to reproduce

## Migration from Previous Versions

### From v1.x to v2.x

1. Update import paths
2. Update configuration structure
3. Update theme integration
4. Update translation keys

### Breaking Changes

- Configuration structure has changed
- Some CSS class names have been updated
- Translation key structure has been updated

See the [CHANGELOG](CHANGELOG.md) for detailed migration instructions.
