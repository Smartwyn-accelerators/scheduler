import { JobData } from "../../public-api";

/**
 * Trigger model for the Scheduler Library
 */
export interface ITrigger {
  triggerName: string;
  triggerGroup: string;
  triggerType: 'SIMPLE' | 'CRON';
  jobName: string;
  jobGroup: string;
  triggerState?: 'NORMAL' | 'PAUSED' | 'COMPLETE' | 'ERROR' | 'BLOCKED' | 'NONE';
  startTime?: Date;
  endTime?: Date;
  lastExecutionTime?: Date;
  nextExecutionTime?: Date;
  priority?: number;
  misfireInstruction?: number;
  description?: string;
  jobDataMap?: Record<string, any>;
  
  // Simple trigger specific
  repeatInterval?: number;
  repeatCount?: number;
  timesTriggered?: number;
  
  // Cron trigger specific
  cronExpression?: string;
  timeZone?: string;
  triggerMapData: JobData[];
}

/**
 * Trigger types enum
 */
export enum TriggerType {
  SIMPLE = 'SIMPLE',
  CRON = 'CRON'
}

/**
 * Trigger states enum
 */
export enum TriggerState {
  NORMAL = 'NORMAL',
  PAUSED = 'PAUSED',
  COMPLETE = 'COMPLETE',
  ERROR = 'ERROR',
  BLOCKED = 'BLOCKED',
  NONE = 'NONE'
}
