import { Injectable, Inject, Optional } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { SCHEDULER_CONFIG, SchedulerConfig } from '../interfaces/scheduler-config.interface';
import { IJob } from '../models/job.model';
import { ITrigger } from '../models/trigger.model';
import { ISearchField } from '../models/search.model';
import { IExecutionHistory } from '../models/execution-history.model';
import { IExecutingJob } from '../models/executing-job.model';

/**
 * Base API service for scheduler operations
 */
@Injectable({
  providedIn: 'root'
})
export class SchedulerApiService {
  private baseUrl: string;

  constructor(
    private http: HttpClient,
    @Optional() @Inject(SCHEDULER_CONFIG) config?: SchedulerConfig
  ) {
    this.baseUrl = config?.apiUrl || '/api/scheduler';
  }

  /**
   * Get default headers for API requests
   */
  private getDefaultHeaders() {
    return {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    };
  }

  // ============================================================================
  // JOB OPERATIONS
  // ============================================================================

  /**
   * Get all jobs
   */
  getAllJobs(searchFields: ISearchField[], offset: number, limit: number, sort: string): Observable<IJob[]> {
    const params = this.buildQueryParams(searchFields, offset, limit, sort);
    return this.http.get<IJob[]>(`${this.baseUrl}/jobs`, { params, headers: this.getDefaultHeaders() })
      .pipe(catchError(this.handleError));
  }

  /**
   * Get job by name and group
   */
  getJob(jobName: string, jobGroup: string): Observable<IJob> {
    return this.http.get<IJob>(`${this.baseUrl}/jobs/${jobName}/${jobGroup}`, { headers: this.getDefaultHeaders() })
      .pipe(catchError(this.handleError));
  }

  /**
   * Create a new job
   */
  createJob(job: IJob): Observable<IJob> {
    return this.http.post<IJob>(`${this.baseUrl}/jobs`, job, { headers: this.getDefaultHeaders() })
      .pipe(catchError(this.handleError));
  }

  /**
   * Update an existing job
   */
  updateJob(job: IJob, jobName: string, jobGroup: string): Observable<IJob> {
    return this.http.put<IJob>(`${this.baseUrl}/jobs/${jobName}/${jobGroup}`, job, { headers: this.getDefaultHeaders() })
      .pipe(catchError(this.handleError));
  }

  /**
   * Delete a job
   */
  deleteJob(jobName?: string, jobGroup?: string): Observable<null> {
    return this.http.delete(`${this.baseUrl}/jobs/${jobName}/${jobGroup}`, { headers: this.getDefaultHeaders() })
      .pipe(
        map(() => null),
        catchError(this.handleError)
      );
  }

  /**
   * Pause a job
   */
  pauseJob(jobName?: string, jobGroup?: string): Observable<boolean> {
    return this.http.get<boolean>(`${this.baseUrl}/jobs/pauseJob/${jobName}/${jobGroup}`, { headers: this.getDefaultHeaders() })
      .pipe(catchError(this.handleError));
  }

  /**
   * Resume a job
   */
  resumeJob(jobName?: string, jobGroup?: string): Observable<boolean> {
    return this.http.get<boolean>(`${this.baseUrl}/jobs/resumeJob/${jobName}/${jobGroup}`, { headers: this.getDefaultHeaders() })
      .pipe(catchError(this.handleError));
  }

  /**
   * Get job groups
   */
  getJobGroups(): Observable<string[]> {
    return this.http.get<string[]>(`${this.baseUrl}/jobs/getJobGroups`, { headers: this.getDefaultHeaders() })
      .pipe(catchError(this.handleError));
  }

  /**
   * Get job classes
   */
  getJobClasses(): Observable<string[]> {
    return this.http.get<string[]>(`${this.baseUrl}/jobs/getJobClasses`, { headers: this.getDefaultHeaders() })
      .pipe(catchError(this.handleError));
  }

  // ============================================================================
  // TRIGGER OPERATIONS
  // ============================================================================

  /**
   * Get all triggers
   */
  getAllTriggers(searchFields: ISearchField[], offset: number, limit: number, sort: string): Observable<ITrigger[]> {
    const params = this.buildQueryParams(searchFields, offset, limit, sort);
    return this.http.get<ITrigger[]>(`${this.baseUrl}/triggers`, { params, headers: this.getDefaultHeaders() })
      .pipe(catchError(this.handleError));
  }

  /**
   * Get trigger by name and group
   */
  getTrigger(triggerName: string, triggerGroup: string): Observable<ITrigger> {
    return this.http.get<ITrigger>(`${this.baseUrl}/triggers/${triggerName}/${triggerGroup}`, { headers: this.getDefaultHeaders() })
      .pipe(catchError(this.handleError));
  }

  public getTriggerGroups(): Observable<string[]> {
    return this.http.get<string[]>(this.baseUrl + '/triggers/getTriggerGroups', { headers: this.getDefaultHeaders() }).pipe(catchError(this.handleError));
  }

  public getTriggerExecutionHistoryByJob(
    triggerName: string,
    triggerGroup: string,
    searchFields: ISearchField[],
    offset: number,
    limit: number,
    sort: any
  ): Observable<IExecutionHistory[]> {
    let params = this.buildQueryParams(searchFields, offset, limit, sort);
    return this.http
      .get<IExecutionHistory[]>(`${this.baseUrl}/triggers/${triggerName}/${triggerGroup}/jobExecutionHistory`, { params, headers: this.getDefaultHeaders() })
      .pipe(catchError(this.handleError));
  }

  /**
   * Create a new trigger
   */
  createTrigger(trigger: ITrigger): Observable<ITrigger> {
    return this.http.post<ITrigger>(`${this.baseUrl}/triggers`, trigger, { headers: this.getDefaultHeaders() })
      .pipe(catchError(this.handleError));
  }

  /**
   * Update an existing trigger
   */
  updateTrigger(trigger: ITrigger, triggerName: string, triggerGroup: string): Observable<ITrigger> {
    return this.http.put<ITrigger>(`${this.baseUrl}/triggers/${triggerName}/${triggerGroup}`, trigger, { headers: this.getDefaultHeaders() })
      .pipe(catchError(this.handleError));
  }

  /**
   * Delete a trigger
   */
  deleteTrigger(triggerName: string, triggerGroup: string): Observable<null> {
    return this.http.delete(`${this.baseUrl}/triggers/${triggerName}/${triggerGroup}`, { headers: this.getDefaultHeaders() })
      .pipe(
        map(() => null),
        catchError(this.handleError)
      );
  }

  /**
   * Pause a trigger
   */
  pauseTrigger(triggerName?: string, triggerGroup?: string): Observable<boolean> {
    return this.http.get<boolean>(`${this.baseUrl}/triggers/pauseTrigger/${triggerName}/${triggerGroup}`, { headers: this.getDefaultHeaders() })
      .pipe(catchError(this.handleError));
  }

  /**
   * Resume a trigger
   */
  resumeTrigger(triggerName?: string, triggerGroup?: string): Observable<boolean> {
    return this.http.get<boolean>(`${this.baseUrl}/triggers/resumeTrigger/${triggerName}/${triggerGroup}`, { headers: this.getDefaultHeaders() })
      .pipe(catchError(this.handleError));
  }

  // ============================================================================
  // EXECUTION OPERATIONS
  // ============================================================================

  /**
   * Get job execution history
   */
  getJobExecutionHistory(
    searchFields: ISearchField[], 
    offset: number, 
    limit: number, 
    sort: string
  ): Observable<IExecutionHistory[]> {
    const params = this.buildQueryParams(searchFields, offset, limit, sort);
    return this.http.get<IExecutionHistory[]>(`${this.baseUrl}/jobs/jobExecutionHistory`, { params, headers: this.getDefaultHeaders() })
      .pipe(catchError(this.handleError));
  }

  /**
   * Get job execution history by job
   */
  getJobExecutionHistoryByJob(
    jobName: string,
    jobGroup: string,
    searchFields: ISearchField[],
    offset: number,
    limit: number,
    sort: string
  ): Observable<IExecutionHistory[]> {
    const params = this.buildQueryParams(searchFields, offset, limit, sort);
    return this.http.get<IExecutionHistory[]>(
      `${this.baseUrl}/jobs/${jobName}/${jobGroup}/jobExecutionHistory`, 
      { params, headers: this.getDefaultHeaders() }
    ).pipe(catchError(this.handleError));
  }

  /**
   * Get currently executing jobs
   */
  getExecutingJobs(): Observable<IExecutingJob[]> {
    return this.http.get<IExecutingJob[]>(`${this.baseUrl}/jobs/executingJobs`, { headers: this.getDefaultHeaders() })
      .pipe(catchError(this.handleError));
  }

  // ============================================================================
  // UTILITY METHODS
  // ============================================================================

  /**
   * Build query parameters from search fields
   */
  private buildQueryParams(searchFields: ISearchField[], offset: number, limit: number, sort: string): any {
    const params: any = {
      offset: offset.toString(),
      limit: limit.toString()
    };

    if (sort) {
      params.sort = sort;
    }

    if (searchFields && searchFields.length > 0) {
      searchFields.forEach((field, index) => {
        params[`search[${index}].field`] = field.field;
        params[`search[${index}].value`] = field.value;
        if (field.operator) {
          params[`search[${index}].operator`] = field.operator;
        }
      });
    }

    return params;
  }

  /**
   * Handle HTTP errors
   */
  private handleError(error: HttpErrorResponse): Observable<never> {
    let errorMessage: string;
    
    if (error.error instanceof ErrorEvent) {
      // Client-side error
      errorMessage = `Client Error: ${error.error.message}`;
    } else {
      // Server-side error
      errorMessage = `Server Error: ${error.status} - ${error.message}`;
    }
    
    console.error('Scheduler API Error:', errorMessage);
    return throwError(() => new Error(errorMessage));
  }
}
