import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { environment } from '../../environments/environment';

/**
 * Service - ApiService
 *
 * Handles all HTTP server communication
 */
@Injectable()
export class HttpService {

  // tslint:disable-next-line: variable-name
  private api_url = `${environment.api_base_url}`;
  constructor(
    private http: HttpClient
  ) {
  }

  /**
   * Get default headers for a request
   */
  get headers() {
    return new HttpHeaders({

    });
  }

  private handleError(error: HttpErrorResponse) {
    console.error(error);
    return throwError(
      'Could not connect to remote server.'
    );
  }

  getData(): Observable<any> {
    return this.http
      .get<any>(`${this.api_url}`, { headers: this.headers })
      .pipe(
        catchError(err => this.handleError(err))
      );
  }

  get(path: string): Observable<any> {
    return this.http
      .get<any>(`${this.api_url}${path}`, { headers: this.headers })
      .pipe(
        catchError(err => this.handleError(err))
      );
  }

  // tslint:disable-next-line: ban-types
  put(path: string, body: Object = {}): Observable<any> {
    return this.http
      .put<any>(`${this.api_url}${path}`, JSON.stringify(body), { headers: this.headers })
      .pipe(
        catchError(err => this.handleError(err))
      );
  }


  // tslint:disable-next-line: ban-types
  post(path: string, body: Object = {}): Observable<any> {
    return this.http
      .post<any>(`${this.api_url}${path}`, JSON.stringify(body), { headers: this.headers }
    )
    .pipe(
      catchError(err => this.handleError(err))
    );
  }


  delete(path: string): Observable<any> {
    return this.http
      .delete<any>(`${this.api_url}${path}`, { headers: this.headers })
      .pipe(
        catchError(err => this.handleError(err))
      );
  }
}
