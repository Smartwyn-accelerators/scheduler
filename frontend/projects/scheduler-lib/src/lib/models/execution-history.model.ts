export interface IExecutionHistory {
  id?: number;
  triggerName?: string;
  triggerGroup?: string;
  jobName?: string;
  jobGroup?: string;
  jobClass?: string;
  jobStatus?: string;
  duration?: string;
  firedTime?: Date;
  finishedTime?: Date;
  jobMapData?: Map<string, string>;
}
