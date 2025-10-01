import { ITrigger } from "./trigger.model";
import { IExecutionHistory } from "./execution-history.model";

/**
 * Job model for the Scheduler Library
 */
export interface IJob {
  id?: number;
  jobName?: string;
  jobGroup?: string;
  jobDescription?: string;
  jobClass?: string;
  jobStatus?: string;
  isDurable?: boolean;
  jobMapData?: Map<string, string>;
  triggerDetails?: Array<ITrigger>;
  executionHistory?: Array<IExecutionHistory>;
}

export class JobData {
  dataKey?: string;
  dataValue?: string;
}

