import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { environment } from '../../../../environments/environment';
import { ISearchField } from '../../list-filters/ISearchCriteria';
import { ServiceUtils } from '../common/services/serviceUtils';
import { IExecutingJob } from '../executing-jobs/executing-jobs.component';
import { IJob } from './ijob';
import { IExecutionHistory } from '../execution-history/executionHistory';
;

@Injectable({
  providedIn: 'root',
})
export class JobService {
  baseUrl = '';
  constructor(private httpclient: HttpClient) {
    this.baseUrl = environment.apiUrl + '/scheduler/jobs';
  }

  public getJobExecutionHistoryByJob(
    jobName: string,
    jobGroup: string,
    searchFields: ISearchField[],
    offset: number,
    limit: number,
    sort: string
  ): Observable<IExecutionHistory[]> {
    let params = ServiceUtils.buildQueryData(searchFields, offset, limit, sort);
    const headers = {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    };
    return this.httpclient
      .get<IExecutionHistory[]>(`${this.baseUrl}/${jobName}/${jobGroup}/jobExecutionHistory`, { params, headers })
      .pipe(catchError(this.handleError));
  }

  public getJobExecutionHistory(
    searchFields: ISearchField[],
    offset: number,
    limit: number,
    sort: string
  ): Observable<IExecutionHistory[]> {
    let params = ServiceUtils.buildQueryData(searchFields, offset, limit, sort);
    const headers = {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    };
    return this.httpclient
      .get<IExecutionHistory[]>(this.baseUrl + '/jobExecutionHistory', { params, headers })
      .pipe(catchError(this.handleError));
  }

  public getExecutingJobs(): Observable<IExecutingJob[]> {
    const headers = {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    };
    return this.httpclient
      .get<IExecutingJob[]>(this.baseUrl + '/executingJobs', { headers })
      .pipe(catchError(this.handleError));
  }

  public getAll(searchFields: ISearchField[], offset: number, limit: number, sort: string): Observable<IJob[]> {
    let params = ServiceUtils.buildQueryData(searchFields, offset, limit, sort);
    const headers = { 'Content-Type': 'application/json' }; // Added here
    return this.httpclient
      .get<IJob[]>(this.baseUrl, { params, headers })
      .pipe(catchError(this.handleError));
  }

  public get(jobName: any, jobGroup: any): Observable<IJob> {
    const headers = {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    };
    return this.httpclient.get<IJob>(this.baseUrl + '/' + jobName + '/' + jobGroup, { headers });
  }

  public create(item: IJob): Observable<IJob> {
    const headers = {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    };
    return this.httpclient.post<IJob>(this.baseUrl, item, { headers });
  }
  public update(item: IJob, jobName: any, jobGroup: any): Observable<IJob> {
    const headers = {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    };
    return this.httpclient
      .put<IJob>(this.baseUrl + '/' + jobName + '/' + jobGroup, item, { headers })
      .pipe(catchError(this.handleError));
  }
  public delete(jobName: any, jobGroup: any): Observable<null> {
    const headers = {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    };
    return this.httpclient.delete(this.baseUrl + '/' + jobName + '/' + jobGroup, { headers }).pipe(
      map((res) => null),
      catchError(this.handleError)
    );
  }

  public getJobGroups(): Observable<string[]> {
    const headers = {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    };
    return this.httpclient.get<string[]>(this.baseUrl + '/getJobGroups', { headers }).pipe(catchError(this.handleError));
  }

  public getJobClasses(): Observable<string[]> {
    const headers = {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    };
    return this.httpclient.get<string[]>(this.baseUrl + '/getJobClasses', { headers }).pipe(catchError(this.handleError));
  }

  public pauseJob(jobName: any, jobGroup: any): Observable<boolean> {
    const headers = {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    };
    return this.httpclient
      .get<boolean>(this.baseUrl + '/pauseJob/' + jobName + '/' + jobGroup, { headers })
      .pipe(catchError(this.handleError));
  }

  public resumeJob(jobName: any, jobGroup: any): Observable<boolean> {
    const headers = {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    };
    return this.httpclient
      .get<boolean>(this.baseUrl + '/resumeJob/' + jobName + '/' + jobGroup, { headers })
      .pipe(catchError(this.handleError));
  }

  protected handleError(err: HttpErrorResponse) {
    let errorMessage;
    if (err.error instanceof ErrorEvent) {
      // A client-side or network error occurred. Handle it accordingly.
      errorMessage = `An error occurred: ${err.error.message}`;
    } else {
      errorMessage = `Server returned code: ${err.status}, error message is: ${err.message}`;
    }
    console.error(errorMessage);
    return throwError(errorMessage);
  }
}
