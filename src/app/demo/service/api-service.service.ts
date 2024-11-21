import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';


@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private baseUrl = environment.ApiPronovel.apiUrl;

  constructor(private http: HttpClient) { }

  get<T>(endpoint: string, params?: any): Observable<T> {
    let httpParams = new HttpParams();
    if (params) {
      for (let key in params) {
        if (params.hasOwnProperty(key)) {
          httpParams = httpParams.set(key, params[key]);
        }
      }
    }
    const url = `${this.baseUrl}${endpoint}`;
    return this.http.get<T>(url, { params: httpParams });
  }

  getPromesa<T>(endpoint: string, params?: any): Promise<T> {
    let httpParams = new HttpParams();
    if (params) {
      for (let key in params) {
        if (params.hasOwnProperty(key)) {
          httpParams = httpParams.set(key, params[key]);
        }
      }
    }
    const url = `${this.baseUrl}${endpoint}`;

    return this.http.get<T>(url, { params: httpParams }).toPromise();
  }

  post<T>(endpoint: string, body: any, params?: any): Observable<T> {
    let httpParams = new HttpParams();
    if (params) {
      for (let key in params) {
        if (params.hasOwnProperty(key)) {
          httpParams = httpParams.set(key, params[key]);
        }
      }
    }
    const url = `${this.baseUrl}${endpoint}`;
    return this.http.post<T>(url, body, { params: httpParams });
  }

  put<T>(endpoint: string, body: any, params?: any): Observable<T> {
    let httpParams = new HttpParams();
    if (params) {
      for (let key in params) {
        if (params.hasOwnProperty(key)) {
          httpParams = httpParams.set(key, params[key]);
        }
      }
    }
    const url = `${this.baseUrl}${endpoint}`;
    return this.http.put<T>(url, body, { params: httpParams });
  }

  patch(id: number, objUpdate: any[], controller: string): Observable<any> {
    const url = `${this.baseUrl}/api/${controller}/update/${id}`;
    const headers = new HttpHeaders({
      'Content-Type': 'application/json-patch+json',
      accept: 'text/plain',
    });
    return this.http.patch(url, objUpdate, { headers });
  }

  delete<T>(endpoint: string): Observable<T> {
    const url = `${this.baseUrl}${endpoint}`;
    return this.http.delete<T>(url);
  }

}
