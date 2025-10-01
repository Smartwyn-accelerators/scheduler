import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { landingGuard } from './core/guards/landing.guard';

export const routes: Routes = [
  {
    path: 'auth',
    loadChildren: () => import('./features/auth/auth.routes').then(m => m.authRoutes),
    canActivate: [landingGuard]
  },
  {
    path: '',
    loadComponent: () => import('./features/layout/timesheet-layout.component').then(m => m.TimesheetLayoutComponent),
    canActivate: [authGuard],
    children: [
      {
        path: 'home',
        loadComponent: () => import('./features/home/home.component').then(m => m.HomeComponent)
      },
      {
        path: 'customers',
        loadComponent: () => import('./features/customers/customers.component').then(m => m.CustomersComponent)
      },
      {
        path: 'projects',
        loadComponent: () => import('./features/projects/projects.component').then(m => m.ProjectsComponent)
      },
      {
        path: 'overview',
        loadComponent: () => import('./features/overview/overview.component').then(m => m.OverviewComponent)
      },
      {
        path: 'details',
        loadComponent: () => import('./features/details/details.component').then(m => m.DetailsComponent)
      },
      {
        path: 'timeOff',
        loadComponent: () => import('./features/time-off/time-off.component').then(m => m.TimeOffComponent)
      },
      {
        path: 'audit',
        loadComponent: () => import('./features/audit/audit.component').then(m => m.AuditComponent)
      },
      // Existing scheduler routes (commented out to use library instead)
      // {
      //   path: 'scheduler/jobs',
      //   loadComponent: () => import('./features/scheduler/jobs/list/jobs.component').then(m => m.JobsComponent)
      // },
      // {
      //   path: 'scheduler/jobs/:jobName/:jobGroup',
      //   loadComponent: () => import('./features/scheduler/jobs/details/job-details.component').then(m => m.JobDetailsComponent)
      // },
      // {
      //   path: 'scheduler/executingJobs',
      //   loadComponent: () => import('./features/scheduler/executing-jobs/executing-jobs.component').then(m => m.ExecutingJobsComponent)
      // },
      // {
      //   path: 'scheduler/executionHistory',
      //   loadComponent: () => import('./features/scheduler/execution-history/execution-history.component').then(m => m.ExecutionHistoryComponent)
      // },
      // {
      //   path: 'scheduler/triggers',
      //   loadComponent: () => import('./features/scheduler/triggers/list/triggers.component').then(m => m.TriggersComponent)
      // },
      // {
      //   path: 'scheduler/triggers/:triggerName/:triggerGroup',
      //   loadComponent: () => import('./features/scheduler/triggers/details/trigger-details.component').then(m => m.TriggerDetailsComponent)
      // },
      
      // New scheduler library routes
      {
        path: 'scheduler/jobs',
        loadComponent: () => import('scheduler-lib').then(m => m.JobsListComponent)
      },
      {
        path: 'scheduler/jobs/:jobName/:jobGroup',
        loadComponent: () => import('scheduler-lib').then(m => m.JobDetailsComponent)
      },
      {
        path: 'scheduler/executing-jobs',
        loadComponent: () => import('scheduler-lib').then(m => m.ExecutingJobsComponent)
      },
      {
        path: 'scheduler/execution-history',
        loadComponent: () => import('scheduler-lib').then(m => m.ExecutionHistoryComponent)
      },
      {
        path: 'scheduler/triggers',
        loadComponent: () => import('scheduler-lib').then(m => m.TriggersListComponent)
      },
      {
        path: 'scheduler/triggers/:triggerName/:triggerGroup',
        loadComponent: () => import('scheduler-lib').then(m => m.TriggerDetailsComponent)
      },
      {
        path: '',
        redirectTo: '/home',
        pathMatch: 'full'
      }
    ]
  },
  {
    path: '**',
    redirectTo: '/auth/login'
  }
];
