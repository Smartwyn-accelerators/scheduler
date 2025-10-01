import { Injectable, Inject, Optional, inject } from '@angular/core';
import { SchedulerTranslationService, SchedulerTranslationKeys } from '../interfaces/translation.interface';
import { SCHEDULER_CONFIG, SchedulerConfig } from '../interfaces/scheduler-config.interface';

/**
 * Default translation service for the Scheduler Library
 * Falls back to default English translations if no user translation service is provided
 */
@Injectable({
  providedIn: 'root'
})
export class DefaultSchedulerTranslationService implements SchedulerTranslationService {
  private defaultTranslations: SchedulerTranslationKeys = {
    // Jobs
    'JOBS.FIELDS.NAME': 'Name',
    'JOBS.FIELDS.GROUP': 'Group',
    'JOBS.FIELDS.CLASS': 'Class',
    'JOBS.FIELDS.DESCRIPTION': 'Description',
    'JOBS.FIELDS.IS-DURABLE': 'Is Durable',
    'JOBS.FIELDS.JOB-MAP-DATA': 'Job Data Map',
    'JOBS.FIELDS.NAME-HELP': 'The unique name of the job',
    'JOBS.FIELDS.GROUP-HELP': 'The group to which the job belongs',
    'JOBS.FIELDS.CLASS-HELP': 'The Java class that will be executed',
    'JOBS.FIELDS.DESCRIPTION-HELP': 'A brief description of the job',
    'JOBS.FIELDS.IS-DURABLE-HELP': 'Whether the job should remain in the scheduler after all its triggers are removed',
    'JOBS.FIELDS.JOB-MAP-DATA-HELP': 'Additional data to be passed to the job',
    'JOBS.FIELDS.NAME-PLACEHOLDER': 'Enter job name',
    'JOBS.FIELDS.GROUP-PLACEHOLDER': 'Enter job group',
    'JOBS.FIELDS.DESCRIPTION-PLACEHOLDER': 'Enter job description',
    'JOBS.CREATE.TITLE': 'Create Job',
    'JOBS.ACTIONS.ADD-JOB-DATA': 'Add Job Data',
    'JOBS.ACTIONS.REMOVE-JOB-DATA': 'Remove Job Data',
    'JOBS.MESSAGES.CREATED': 'Job created successfully',
    'JOBS.MESSAGES.DELETED': 'Job deleted successfully',
    'JOBS.MESSAGES.PAUSED': 'Job paused successfully',
    'JOBS.MESSAGES.RESUMED': 'Job resumed successfully',
    'JOBS.MESSAGES.CONFIRM.TRIGGER': 'Are you sure you want to trigger this job?',
    'JOBS.MESSAGES.CONFIRM.PAUSE': 'Are you sure you want to pause this job?',
    'JOBS.MESSAGES.CONFIRM.RESUME': 'Are you sure you want to resume this job?',
    'JOBS.MESSAGES.CONFIRM.DELETE': 'Are you sure you want to delete this job?',
    
    // Triggers
    'TRIGGERS.FIELDS.NAME': 'Name',
    'TRIGGERS.FIELDS.GROUP': 'Group',
    'TRIGGERS.FIELDS.TYPE': 'Type',
    'TRIGGERS.FIELDS.JOB-NAME': 'Job Name',
    'TRIGGERS.FIELDS.JOB-GROUP': 'Job Group',
    'TRIGGERS.FIELDS.START-TIME': 'Start Time',
    'TRIGGERS.FIELDS.END-TIME': 'End Time',
    'TRIGGERS.FIELDS.LAST-EXECUTION-TIME': 'Last Execution',
    'TRIGGERS.FIELDS.NEXT-EXECUTION-TIME': 'Next Execution',
    'TRIGGERS.MESSAGES.CREATED': 'Trigger created successfully',
    'TRIGGERS.MESSAGES.DELETED': 'Trigger deleted successfully',
    'TRIGGERS.MESSAGES.PAUSED': 'Trigger paused successfully',
    'TRIGGERS.MESSAGES.RESUMED': 'Trigger resumed successfully',
    'TRIGGERS.MESSAGES.CONFIRM.PAUSE': 'Are you sure you want to pause this trigger?',
    'TRIGGERS.MESSAGES.CONFIRM.RESUME': 'Are you sure you want to resume this trigger?',
    'TRIGGERS.MESSAGES.CONFIRM.DELETE': 'Are you sure you want to delete this trigger?',
    'TRIGGERS.ACTIONS.SELECT-JOB': 'Select Job',
    'TRIGGERS.NEW.TITLE': 'New Trigger',
    'TRIGGERS.NEW.SUBTITLE': 'Create a new trigger',
    
    // General
    'SCHEDULER-GENERAL.ACTIONS.ACTIONS': 'Actions',
    'SCHEDULER-GENERAL.BUTTONS.CREATE': 'Create',
    'SCHEDULER-GENERAL.BUTTONS.EDIT': 'Edit',
    'SCHEDULER-GENERAL.BUTTONS.DELETE': 'Delete',
    'SCHEDULER-GENERAL.BUTTONS.PAUSE': 'Pause',
    'SCHEDULER-GENERAL.BUTTONS.RESUME': 'Resume',
    'SCHEDULER-GENERAL.BUTTONS.TRIGGER': 'Trigger',
    'SCHEDULER-GENERAL.BUTTONS.CANCEL': 'Cancel',
    'SCHEDULER-GENERAL.BUTTONS.SAVE': 'Save',
    'SCHEDULER-GENERAL.BUTTONS.CONFIRM': 'Confirm',
    'SCHEDULER-GENERAL.BUTTONS.YES': 'Yes',
    'SCHEDULER-GENERAL.BUTTONS.NO': 'No',
    
    // Job Data
    'JOB-DATA.KEY': 'Key',
    'JOB-DATA.VALUE': 'Value',
    'JOB-DATA.KEY-PLACEHOLDER': 'Enter key',
    'JOB-DATA.VALUE-PLACEHOLDER': 'Enter value',
    
    // Common
    'COMMON.LOADING': 'Loading...',
    'COMMON.ERROR': 'Error',
    'COMMON.SUCCESS': 'Success',
    'COMMON.CONFIRM': 'Confirm',
    'COMMON.CANCEL': 'Cancel',
    
    // General Errors
    'SCHEDULER-GENERAL.ERRORS.REQUIRED': 'This field is required',
    'SCHEDULER-GENERAL.ERRORS.LENGTH-EXCEEDING': 'Length cannot exceed {{length}} characters',
    
    // Execution History
    'EXECUTION-HISTORY.TITLE': 'Execution History',
    'EXECUTION-HISTORY.SUBTITLE': 'View the execution history of scheduled jobs',
    'EXECUTION-HISTORY.CARD-TITLE': 'Job Execution History',
    'EXECUTION-HISTORY.CARD-SUBTITLE': 'Track the execution status and details of your scheduled jobs',
    'EXECUTION-HISTORY.LOADING': 'Loading execution history...',
    'EXECUTION-HISTORY.EMPTY-TITLE': 'No Execution History',
    'EXECUTION-HISTORY.EMPTY-MESSAGE': 'No job executions have been recorded yet. Jobs will appear here once they start running.',
    'EXECUTION-HISTORY.FIELDS.TRIGGER-NAME': 'Trigger Name',
    'EXECUTION-HISTORY.FIELDS.TRIGGER-GROUP': 'Trigger Group',
    'EXECUTION-HISTORY.FIELDS.JOB-NAME': 'Job Name',
    'EXECUTION-HISTORY.FIELDS.JOB-GROUP': 'Job Group',
    'EXECUTION-HISTORY.FIELDS.JOB-CLASS': 'Job Class',
    'EXECUTION-HISTORY.FIELDS.STATUS': 'Status',
    'EXECUTION-HISTORY.FIELDS.DURATION': 'Duration',
    'EXECUTION-HISTORY.FIELDS.FIRE-TIME': 'Fire Time',
    'EXECUTION-HISTORY.FIELDS.FINISHED-TIME': 'Finished Time'
  };

  private config = inject(SCHEDULER_CONFIG, { optional: true });
  private userTranslationService: DefaultSchedulerTranslationService | null = null;

  instant(key: string, params?: any): string {
    // If user provided a translation service and wants to use it
    if (this.userTranslationService && this.config?.translation?.useExistingTranslation) {
      try {
        return this.userTranslationService.instant(key, params);
      } catch (error) {
        console.warn(`Translation key '${key}' not found in user translation service, falling back to default`);
      }
    }

    // Use default translations
    const translationKey = this.config?.translation?.prefix 
      ? `${this.config.translation.prefix}.${key}`
      : key;
    
    return this.defaultTranslations[translationKey as keyof SchedulerTranslationKeys] || key;
  }

  get(key: string, params?: any): any {
    // If user provided a translation service and wants to use it
    if (this.userTranslationService && this.config?.translation?.useExistingTranslation) {
      try {
        return this.userTranslationService.get(key, params);
      } catch (error) {
        console.warn(`Translation key '${key}' not found in user translation service, falling back to default`);
      }
    }

    // Return observable with default translation
    const translationKey = this.config?.translation?.prefix 
      ? `${this.config.translation.prefix}.${key}`
      : key;
    
    const translation = this.defaultTranslations[translationKey as keyof SchedulerTranslationKeys] || key;
    
    // Return a simple observable-like object
    return {
      subscribe: (callback: (value: string) => void) => {
        callback(translation);
        return { unsubscribe: () => {} };
      }
    };
  }
}
