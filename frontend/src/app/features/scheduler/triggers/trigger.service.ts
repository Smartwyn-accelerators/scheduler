import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { ITrigger } from './trigger';
import { environment } from '../../../../environments/environment';
import { ISearchField } from '../../list-filters/ISearchCriteria';
import { ServiceUtils } from '../common/services/serviceUtils';
import { IExecutionHistory } from '../execution-history/executionHistory';


@Injectable({
  providedIn: 'root',
})
export class TriggerService {
  baseUrl = '';

  resp: any;
  constructor(private httpclient: HttpClient) {
    this.baseUrl = environment.apiUrl + '/scheduler/triggers';
  }

  public getAll(searchFields: ISearchField[], offset: number, limit: number, sort: string): Observable<ITrigger[]> {
    let params = ServiceUtils.buildQueryData(searchFields, offset, limit, sort);
    const headers = { 'Content-Type': 'application/json' };
    return this.httpclient
      .get<ITrigger[]>(this.baseUrl, { params, headers })
      .pipe(catchError(this.handleError));
  }

  public getTriggerExecutionHistoryByJob(
    triggerName: string,
    triggerGroup: string,
    searchFields: ISearchField[],
    offset: number,
    limit: number,
    sort: any
  ): Observable<IExecutionHistory[]> {
    let params = ServiceUtils.buildQueryData(searchFields, offset, limit, sort);
    const headers = {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    };
    return this.httpclient
      .get<IExecutionHistory[]>(`${this.baseUrl}/${triggerName}/${triggerGroup}/jobExecutionHistory`, { params, headers })
      .pipe(catchError(this.handleError));
  }

  public get(triggerName: any, triggerGroup: any): Observable<ITrigger> {
    const headers = {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    };
    this.resp = this.httpclient.get<ITrigger>(this.baseUrl + '/' + triggerName + '/' + triggerGroup, { headers });
    return this.resp;
  }

  public create(item: ITrigger): Observable<ITrigger> {
    const headers = {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    };
    return this.httpclient.post<ITrigger>(this.baseUrl, item, { headers }).pipe(catchError(this.handleError));
  }
  public update(item: any, triggerName: any, triggerGroup: any): Observable<ITrigger> {
    const headers = {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    };
    return this.httpclient.put<ITrigger>(this.baseUrl + '/' + triggerName + '/' + triggerGroup, item, { headers }).pipe(catchError(this.handleError));
}
  public delete(triggerName: any, triggerGroup: any): Observable<null> {
    const headers = {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    };
    return this.httpclient.delete(this.baseUrl + '/' + triggerName + '/' + triggerGroup, { headers }).pipe(map((res) => null), catchError(this.handleError));
  }

  public getTriggerGroups(): Observable<string[]> {
    const headers = {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    };
    return this.httpclient.get<string[]>(this.baseUrl + '/getTriggerGroups', { headers }).pipe(catchError(this.handleError));
  }

  public pauseTrigger(triggerName: string, triggerGroup: string): Observable<boolean> {
    const headers = {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    };
    return this.httpclient.get<boolean>(this.baseUrl + '/pauseTrigger/' + triggerName + '/' + triggerGroup, { headers }).pipe(catchError(this.handleError));
  }

  public resumeTrigger(triggerName: string, triggerGroup: string): Observable<boolean> {
    const headers = {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    };
    return this.httpclient.get<boolean>(this.baseUrl + '/resumeTrigger/' + triggerName + '/' + triggerGroup, { headers }).pipe(catchError(this.handleError));
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
