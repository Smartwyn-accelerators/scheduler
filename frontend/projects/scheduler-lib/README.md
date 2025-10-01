# Scheduler Library for Angular 20

A comprehensive scheduler library for Angular 20 applications with full Angular Material 20 integration, theme support, and translation capabilities.

## Features

- 🚀 **Angular 20 Compatible** - Built with the latest Angular features
- 🎨 **Theme Integration** - Seamlessly integrates with your existing theme
- 🌍 **Translation Support** - Works with your existing translation service
- 📱 **Responsive Design** - Mobile-first responsive components
- 🎯 **Standalone Components** - Modern Angular architecture
- 🔧 **TypeScript Support** - Full type definitions included
- 📦 **Modular** - Use only the components you need

## Installation

```bash
npm install @your-org/scheduler-lib
```

## Quick Start

### 1. Import the Module

```typescript
import { SchedulerLibModule } from '@your-org/scheduler-lib';

@NgModule({
  imports: [
    SchedulerLibModule.forRoot({
      apiUrl: 'https://your-api.com/scheduler',
      translation: {
        useExistingTranslation: true,
        prefix: 'SCHEDULER'
      },
      theme: {
        useExistingTheme: true
      },
      features: {
        jobs: true,
        triggers: true,
        executionHistory: true,
        executingJobs: true
      }
    })
  ]
})
export class AppModule { }
```

### 2. Initialize Theme (Optional)

```typescript
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

### 3. Use Components

```html
<!-- Jobs List Component -->
<sl-jobs-list></sl-jobs-list>

<!-- Triggers List Component -->
<sl-triggers-list></sl-triggers-list>

<!-- Execution History Component -->
<sl-execution-history></sl-execution-history>

<!-- Executing Jobs Component -->
<sl-executing-jobs></sl-executing-jobs>
```

## Configuration

### Basic Configuration

```typescript
const schedulerConfig: SchedulerConfig = {
  apiUrl: 'https://your-api.com/scheduler',
  features: {
    jobs: true,
    triggers: true,
    executionHistory: true,
    executingJobs: true
  }
};
```

### With Translation Integration

```typescript
import { TranslateService } from '@ngx-translate/core';

const schedulerConfig: SchedulerConfig = {
  apiUrl: 'https://your-api.com/scheduler',
  translation: {
    useExistingTranslation: true,
    prefix: 'SCHEDULER'
  }
};

// Use with your existing translation service
SchedulerLibModule.forRootWithTranslation(schedulerConfig, translateService)
```

### With Custom Theme

```typescript
const schedulerConfig: SchedulerConfig = {
  apiUrl: 'https://your-api.com/scheduler',
  theme: {
    useExistingTheme: true,
    customProperties: {
      'scheduler-primary': '#your-primary-color',
      'scheduler-container-padding': '32px'
    }
  }
};
```

## Theme Integration

The scheduler library automatically integrates with your existing Angular Material theme. It uses CSS custom properties that inherit from your theme variables.

### Using Your Theme

```scss
// In your global styles.scss
@import '@your-org/scheduler-lib/themes/scheduler-theme.scss';

// The library will automatically use your theme colors
```

### Custom Theme Properties

```typescript
// Update theme properties at runtime
this.schedulerThemeService.updateThemeProperty('scheduler-primary', '#ff5722');
this.schedulerThemeService.updateThemeProperties({
  'scheduler-container-padding': '32px',
  'scheduler-border-radius': '16px'
});
```

## Translation Integration

### With ngx-translate

```typescript
import { TranslateService } from '@ngx-translate/core';

// Configure with your existing translation service
SchedulerLibModule.forRootWithTranslation(config, translateService);
```

### Translation Keys

The library uses the following translation key structure:

```json
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
        "DELETED": "Job deleted successfully"
      }
    },
    "TRIGGERS": {
      "FIELDS": {
        "NAME": "Name",
        "GROUP": "Group",
        "TYPE": "Type"
      }
    }
  }
}
```

## API Integration

The library expects your backend API to follow this structure:

```
GET    /api/scheduler/jobs                    - Get all jobs
POST   /api/scheduler/jobs                    - Create job
GET    /api/scheduler/jobs/{name}/{group}     - Get job
PUT    /api/scheduler/jobs/{name}/{group}     - Update job
DELETE /api/scheduler/jobs/{name}/{group}     - Delete job
GET    /api/scheduler/jobs/pause/{name}/{group} - Pause job
GET    /api/scheduler/jobs/resume/{name}/{group} - Resume job

GET    /api/scheduler/triggers                - Get all triggers
POST   /api/scheduler/triggers                - Create trigger
GET    /api/scheduler/triggers/{name}/{group} - Get trigger
PUT    /api/scheduler/triggers/{name}/{group} - Update trigger
DELETE /api/scheduler/triggers/{name}/{group} - Delete trigger

GET    /api/scheduler/execution-history       - Get execution history
GET    /api/scheduler/executing-jobs          - Get executing jobs
```

## Components

### Jobs Components

- `sl-jobs-list` - List all jobs with filtering and sorting
- `sl-job-details` - View job details
- `sl-job-new` - Create new job dialog

### Triggers Components

- `sl-triggers-list` - List all triggers with filtering and sorting
- `sl-trigger-details` - View trigger details
- `sl-trigger-new` - Create new trigger dialog
- `sl-select-job` - Job selection component

### Execution Components

- `sl-execution-history` - View job execution history
- `sl-executing-jobs` - Monitor currently executing jobs

### Common Components

- `sl-confirm-dialog` - Confirmation dialog
- `sl-list-filters` - Advanced filtering component

## Styling

### Using SCSS Mixins

```scss
@import '@your-org/scheduler-lib/themes/scheduler-theme.scss';

.my-scheduler-page {
  @include sl-scheduler-container;
  
  .page-header {
    @include sl-scheduler-page-header;
    
    .page-title {
      @include sl-scheduler-page-title;
    }
  }
  
  .scheduler-card {
    @include sl-scheduler-card;
  }
}
```

### Using CSS Custom Properties

```scss
.my-custom-scheduler {
  --sl-scheduler-primary: #your-color;
  --sl-scheduler-container-padding: 32px;
  --sl-scheduler-border-radius: 16px;
}
```

## Advanced Usage

### Custom API Service

```typescript
import { SchedulerApiService } from '@your-org/scheduler-lib';

@Injectable()
export class CustomSchedulerApiService extends SchedulerApiService {
  // Override methods as needed
  getAllJobs(searchFields: ISearchField[], offset: number, limit: number, sort: string) {
    // Custom implementation
    return super.getAllJobs(searchFields, offset, limit, sort);
  }
}
```

### Custom Translation Service

```typescript
import { SchedulerTranslationService } from '@your-org/scheduler-lib';

@Injectable()
export class CustomTranslationService implements SchedulerTranslationService {
  instant(key: string, params?: any): string {
    // Your custom translation logic
    return this.translateService.instant(key, params);
  }
  
  get(key: string, params?: any): any {
    // Your custom translation logic
    return this.translateService.get(key, params);
  }
}
```

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Dependencies

- Angular 20+
- Angular Material 20+
- RxJS 7+

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

For support and questions, please open an issue on GitHub or contact us at support@your-org.com.
