/**
 * Translation interface for the Scheduler Library
 * This allows users to provide their own translation service
 */
export interface SchedulerTranslationService {
  /**
   * Get translation for a key
   * @param key Translation key
   * @param params Optional parameters for interpolation
   * @returns Translated string
   */
  instant(key: string, params?: any): string;
  
  /**
   * Get translation for a key (observable)
   * @param key Translation key
   * @param params Optional parameters for interpolation
   * @returns Observable of translated string
   */
  get(key: string, params?: any): any;
}

/**
 * Default translation keys for the scheduler
 */
export interface SchedulerTranslationKeys {
  // Jobs
  'JOBS.FIELDS.NAME': string;
  'JOBS.FIELDS.GROUP': string;
  'JOBS.FIELDS.CLASS': string;
  'JOBS.FIELDS.DESCRIPTION': string;
  'JOBS.FIELDS.IS-DURABLE': string;
  'JOBS.FIELDS.JOB-MAP-DATA': string;
  'JOBS.FIELDS.NAME-HELP': string;
  'JOBS.FIELDS.GROUP-HELP': string;
  'JOBS.FIELDS.CLASS-HELP': string;
  'JOBS.FIELDS.DESCRIPTION-HELP': string;
  'JOBS.FIELDS.IS-DURABLE-HELP': string;
  'JOBS.FIELDS.JOB-MAP-DATA-HELP': string;
  'JOBS.FIELDS.NAME-PLACEHOLDER': string;
  'JOBS.FIELDS.GROUP-PLACEHOLDER': string;
  'JOBS.FIELDS.DESCRIPTION-PLACEHOLDER': string;
  'JOBS.CREATE.TITLE': string;
  'JOBS.ACTIONS.ADD-JOB-DATA': string;
  'JOBS.ACTIONS.REMOVE-JOB-DATA': string;
  'JOBS.MESSAGES.CREATED': string;
  'JOBS.MESSAGES.DELETED': string;
  'JOBS.MESSAGES.PAUSED': string;
  'JOBS.MESSAGES.RESUMED': string;
  'JOBS.MESSAGES.CONFIRM.TRIGGER': string;
  'JOBS.MESSAGES.CONFIRM.PAUSE': string;
  'JOBS.MESSAGES.CONFIRM.RESUME': string;
  'JOBS.MESSAGES.CONFIRM.DELETE': string;
  
  // Triggers
  'TRIGGERS.FIELDS.NAME': string;
  'TRIGGERS.FIELDS.GROUP': string;
  'TRIGGERS.FIELDS.TYPE': string;
  'TRIGGERS.FIELDS.JOB-NAME': string;
  'TRIGGERS.FIELDS.JOB-GROUP': string;
  'TRIGGERS.FIELDS.START-TIME': string;
  'TRIGGERS.FIELDS.END-TIME': string;
  'TRIGGERS.FIELDS.LAST-EXECUTION-TIME': string;
  'TRIGGERS.FIELDS.NEXT-EXECUTION-TIME': string;
  'TRIGGERS.MESSAGES.CREATED': string;
  'TRIGGERS.MESSAGES.DELETED': string;
  'TRIGGERS.MESSAGES.PAUSED': string;
  'TRIGGERS.MESSAGES.RESUMED': string;
  'TRIGGERS.MESSAGES.CONFIRM.PAUSE': string;
  'TRIGGERS.MESSAGES.CONFIRM.RESUME': string;
  'TRIGGERS.MESSAGES.CONFIRM.DELETE': string;
  'TRIGGERS.ACTIONS.SELECT-JOB': string;
  'TRIGGERS.NEW.TITLE': string;
  'TRIGGERS.NEW.SUBTITLE': string;
  
  // General
  'SCHEDULER-GENERAL.ACTIONS.ACTIONS': string;
  'SCHEDULER-GENERAL.BUTTONS.CREATE': string;
  'SCHEDULER-GENERAL.BUTTONS.EDIT': string;
  'SCHEDULER-GENERAL.BUTTONS.DELETE': string;
  'SCHEDULER-GENERAL.BUTTONS.PAUSE': string;
  'SCHEDULER-GENERAL.BUTTONS.RESUME': string;
  'SCHEDULER-GENERAL.BUTTONS.TRIGGER': string;
  'SCHEDULER-GENERAL.BUTTONS.CANCEL': string;
  'SCHEDULER-GENERAL.BUTTONS.SAVE': string;
  'SCHEDULER-GENERAL.BUTTONS.CONFIRM': string;
  'SCHEDULER-GENERAL.BUTTONS.YES': string;
  'SCHEDULER-GENERAL.BUTTONS.NO': string;
  
  // Job Data
  'JOB-DATA.KEY': string;
  'JOB-DATA.VALUE': string;
  'JOB-DATA.KEY-PLACEHOLDER': string;
  'JOB-DATA.VALUE-PLACEHOLDER': string;
  
  // Common
  'COMMON.LOADING': string;
  'COMMON.ERROR': string;
  'COMMON.SUCCESS': string;
  'COMMON.CONFIRM': string;
  'COMMON.CANCEL': string;
  
  // General Errors
  'SCHEDULER-GENERAL.ERRORS.REQUIRED': string;
  'SCHEDULER-GENERAL.ERRORS.LENGTH-EXCEEDING': string;
  
  // Execution History
  'EXECUTION-HISTORY.TITLE': string;
  'EXECUTION-HISTORY.SUBTITLE': string;
  'EXECUTION-HISTORY.CARD-TITLE': string;
  'EXECUTION-HISTORY.CARD-SUBTITLE': string;
  'EXECUTION-HISTORY.LOADING': string;
  'EXECUTION-HISTORY.EMPTY-TITLE': string;
  'EXECUTION-HISTORY.EMPTY-MESSAGE': string;
  'EXECUTION-HISTORY.FIELDS.TRIGGER-NAME': string;
  'EXECUTION-HISTORY.FIELDS.TRIGGER-GROUP': string;
  'EXECUTION-HISTORY.FIELDS.JOB-NAME': string;
  'EXECUTION-HISTORY.FIELDS.JOB-GROUP': string;
  'EXECUTION-HISTORY.FIELDS.JOB-CLASS': string;
  'EXECUTION-HISTORY.FIELDS.STATUS': string;
  'EXECUTION-HISTORY.FIELDS.DURATION': string;
  'EXECUTION-HISTORY.FIELDS.FIRE-TIME': string;
  'EXECUTION-HISTORY.FIELDS.FINISHED-TIME': string;
}
