import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { from, Observable, of, throwError } from 'rxjs';
import { switchMap, catchError, tap } from 'rxjs/operators';
import { StorageService } from './storage.service';
import { Cliente } from 'src/app/_models/cliente';

@Injectable({
    providedIn: 'root',
})
export class ClientesService {
    constructor(
        private http: HttpClient,
        private almacenamiento: StorageService
    ) {}

    // Obtener clientes: intenta cargar desde el almacenamiento local o desde la API si no están disponibles
    obtenerClientes(usuario: string): Observable<Cliente[]> {
        return from(this.almacenamiento.get<Cliente[]>(`Clientes_${usuario}`)).pipe(
            switchMap((clientesAlmacenados) => {
                if (clientesAlmacenados) {
                    // Si los clientes están en el almacenamiento local, los devuelve
                    return of(clientesAlmacenados);
                } else {
                    // Si no están, los carga desde la API
                    return this.cargarDesdeApi(usuario);
                }
            }),
            catchError((error) => {
                console.error('Error al cargar clientes:', error);
                return throwError(error);
            })
        );
    }

    // Cargar clientes desde la API
    private cargarDesdeApi(usuario: string): Observable<Cliente[]> {
        const url = `http://localhost:3000/api//pronobel/usuario/clientes/${usuario}`;

        return this.http.get<Cliente[]>(url).pipe(
            tap((clientes) => {
                // Guardar los clientes en el almacenamiento local usando el usuario como clave
                this.almacenamiento.set(`Clientes_${usuario}`, clientes);
            }),
            catchError((error) => {
                console.error('Error al obtener clientes desde la API:', error);
                throw 'No se pudo obtener los clientes desde la API.';
            })
        );
    }
}
