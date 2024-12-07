import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, from, of } from 'rxjs';
import { switchMap, catchError, tap } from 'rxjs/operators';
import { LoginRequest, User } from 'src/app/_models/user';
import { EndPoint } from 'src/app/_models/EndPoint';
import { StorageService } from './storage.service';

@Injectable({
  providedIn: 'root',
})
export class LoginService {
  constructor(private http: HttpClient, private storageService: StorageService) {}

  iniciarSesion(loginRequest: LoginRequest): Observable<User> {
    return from(this.checkConnection()).pipe(
      switchMap((connected) =>
        connected ? this.loginConInternet(loginRequest) : this.loginOffline(loginRequest)
      ),
      catchError((error) => {
        console.error('Error en iniciarSesion:', error);
        throw error;
      })
    );
  }

  private loginConInternet(loginRequest: LoginRequest): Observable<User> {
    const url = `${EndPoint.login}`;
    return this.http.post<User>(url, loginRequest).pipe(
      tap((user) => this.storageService.set('Usuario', user)), // Guarda el usuario en el almacenamiento local
      catchError((error) => {
        console.error('Error al autenticar en el servicio:', error);
        throw 'No se pudo autenticar con el servidor.';
      })
    );
  }

  private loginOffline(loginRequest: LoginRequest): Observable<User> {
    return from(this.storageService.get<User>('Usuario')).pipe(
      switchMap((storedUser) => {
        if (
          storedUser &&
          storedUser.codusu === loginRequest.userid &&
          storedUser.upass === loginRequest.pass
        ) {
          return of(storedUser);
        } else {
          throw 'Credenciales incorrectas o usuario no encontrado en modo offline.';
        }
      }),
      catchError((error) => {
        console.error('Error al autenticar en modo offline:', error);
        throw error;
      })
    );
  }

  private async checkConnection(): Promise<boolean> {
    return navigator.onLine;
  }
}
