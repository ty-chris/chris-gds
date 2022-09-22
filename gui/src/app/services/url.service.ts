import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class UrlService {
  baseUrl: string = `${environment.backendUrl}`;

  constructor(private readonly http: HttpClient) {}

  createUrl(payload) {
    return this.http
      .post<any>(this.baseUrl, payload)
      .pipe(catchError(this.handleError));
  }

  getUrlPair(short_url: string) {
    const url = this.baseUrl + `/${short_url}`;
    return this.http.get<any>(url).pipe(catchError(this.handleError));
  }

  getAllUrls() {
    const url = this.baseUrl + '/all';
    return this.http.get<any>(url).pipe(catchError(this.handleError));
  }

  convertToFullLink(url) {
    // Regex test to check if http is needed or not
    if (!/^(?:f|ht)tps?\:\/\//.test(url)) {
      url = 'https://' + url;
    }
    return url;
  }

  private handleError(error: HttpErrorResponse) {
    let errorMessage: string = '';
    if (error.error instanceof ErrorEvent) {
      errorMessage = 'An unknown error has occurred: ' + error.error;
    } else {
      errorMessage =
        'A HTTP error has occurred: ' + `HTTP ${error.status}: ${error.error}`;
    }
    console.error(errorMessage);
    return throwError(errorMessage);
  }
}
