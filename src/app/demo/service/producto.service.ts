import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { from, Observable, of, throwError } from 'rxjs';
import { switchMap, catchError, tap } from 'rxjs/operators';
import { StorageService } from './storage.service';
import { EndPoint } from 'src/app/_models/EndPoint';
import { FiltroProductos, ListaPrecio, RespuestaProductos, StockSegment } from 'src/app/_models/producto';

@Injectable({
    providedIn: 'root',
})
export class ProductosService {
    constructor(private http: HttpClient, private almacenamiento: StorageService) {}

    obtenerProductos(filtro: FiltroProductos): Observable<RespuestaProductos> {
        return from(this.almacenamiento.get<RespuestaProductos>('Productos')).pipe(
            switchMap((productosAlmacenados) => {
                if (productosAlmacenados) {
                    const productosFiltrados = this.filtrarProductos(productosAlmacenados, filtro);
                    return of(productosFiltrados);
                } else {
                    return this.cargarDesdeApi(filtro);
                }
            }),
            catchError((error) => {
                console.error('Error al cargar productos:', error);
                return throwError(() => new Error('Error al cargar productos.'));
            })
        );
    }

    // Cargar productos desde la API con filtros
    private cargarDesdeApi(filtro: FiltroProductos): Observable<RespuestaProductos> {
        const url = `${EndPoint.productos2}`;
        const params: any = this.generarParametrosApi(filtro);
        return this.http.get<RespuestaProductos>(url, { params }).pipe(
            tap((productos) => {
                // Guardar los productos en el almacenamiento local
                this.almacenamiento.set('Productos', productos);
            }),
            catchError((error) => {
                console.error('Error al obtener productos desde la API:', error);
                return throwError(() => new Error('No se pudo obtener los productos desde la API.'));
            })
        );
    }

    // Generar los parámetros dinámicos para la API
    private generarParametrosApi(filtro: FiltroProductos): any {
        const params: any = {};
        Object.keys(filtro).forEach((key) => {
            if (filtro[key as keyof FiltroProductos] !== undefined) {
                params[key] = filtro[key as keyof FiltroProductos];
            }
        });
        return params;
    }

    // Filtrar productos localmente
    private filtrarProductos(productosAlmacenados: RespuestaProductos, filtro: FiltroProductos): RespuestaProductos {
        const negocioFiltro = filtro.negocio?.toLowerCase() || '';
        return {
            ...productosAlmacenados,
            productos: productosAlmacenados.productos.map((producto) => {
                const nuevoStock = this.obtenerNuevoStock(producto.stockSegment, negocioFiltro);
                const nuevoPrecio = this.obtenerNuevoPrecio(producto.lista_precio, filtro.lista_precio);
                return {
                    ...producto,
                    nuevoStock: nuevoStock ?? 0, 
                    nuevoPrecio: nuevoPrecio?.prelis ?? null, 
                    multip: nuevoPrecio?.multip ?? null 
                };
            }).filter((producto) => producto.nuevoStock > 0 && producto.nuevoPrecio !== null), 
        };
    }

    // Obtener el stock basado en el negocio
    private obtenerNuevoStock(stockSegment: StockSegment[], negocioFiltro: string): number | null {
        const segmento = stockSegment.find(
            (segmento) => segmento.negocio?.toLowerCase() === negocioFiltro
        );
        return segmento ? segmento.stock : null;
    }

    // Obtener el precio basado en la lista de precios
    private obtenerNuevoPrecio(
        listaPrecios: ListaPrecio[],
        listaFiltro?: ListaPrecio[]
    ): { prelis: number; multip: string } | null {
        if (!listaFiltro || listaFiltro.length === 0) {
            return null;
        }
        const precio = listaPrecios.find((precio) =>
            listaFiltro.some((clientePrecio) => clientePrecio.codlpr === precio.codlpr)
        );
        return precio ? { prelis: precio.prelis, multip: precio.multip } : null;
    }
}
