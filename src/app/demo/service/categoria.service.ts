import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, from, of, throwError } from 'rxjs';
import { switchMap, catchError, tap } from 'rxjs/operators';
import { StorageService } from './storage.service';
import { EndPoint } from 'src/app/_models/EndPoint';
import { CategoriasResponse } from 'src/app/_models/categoria';

@Injectable({
    providedIn: 'root',
})
export class CategoriasService {
    private categoriasSubject = new BehaviorSubject<CategoriasResponse | null>(
        null
    );

    constructor(
        private http: HttpClient,
        private almacenamiento: StorageService
    ) {}

    obtenerCategorias(): Observable<CategoriasResponse> {
        if (!this.categoriasSubject.value) {
            return this.cargarCategorias();
        }
        return this.categoriasSubject.asObservable();
    }

    private cargarCategorias(): Observable<CategoriasResponse> {
        return from(
            this.almacenamiento.get<CategoriasResponse>('Categorias')
        ).pipe(
            switchMap((categoriasAlmacenadas) => {
                if (categoriasAlmacenadas) {
                    this.categoriasSubject.next(categoriasAlmacenadas);
                    return of(categoriasAlmacenadas);
                } else {
                    return this.cargarDesdeApi();
                }
            }),
            catchError((error) => {
                console.error('Error al cargar categorías:', error);
                return throwError(error);
            })
        );
    }

    // Cargar categorías desde la API
    private cargarDesdeApi(): Observable<CategoriasResponse> {
        const url = `${EndPoint.categorias}`;
        return this.http.get<CategoriasResponse>(url).pipe(
            tap((categorias) => {
                categorias.forEach((categoria) => {
                    categoria.ultimaActualizacionOff = new Date();
                });
                this.almacenamiento.set('Categorias', categorias);
                this.categoriasSubject.next(categorias);
            }),
            catchError((error) => {
                console.error(
                    'Error al obtener categorías desde la API:',
                    error
                );
                throw 'No se pudo obtener las categorías desde la API.';
            })
        );
    }

    // Método opcional para sincronizar categorías (forzar actualización)
    sincronizarCategorias(): Observable<CategoriasResponse> {
        return this.cargarDesdeApi();
    }
}
