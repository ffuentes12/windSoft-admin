import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { from, Observable, of, throwError } from 'rxjs';
import { switchMap, catchError, tap } from 'rxjs/operators';
import { StorageService } from './storage.service';
import { EndPoint } from 'src/app/_models/EndPoint';
import { FiltroProductos, Producto, RespuestaProductos } from 'src/app/_models/producto';

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
                return throwError(error);
            })
        );
    }

 
    // Cargar productos desde la API con filtros
    private cargarDesdeApi(filtro: FiltroProductos): Observable<RespuestaProductos> {
        const url = `${EndPoint.productos2}`;
        const params: any = {};

        // Añadir dinámicamente los filtros a los parámetros de la API
        Object.keys(filtro).forEach((key) => {
            if (filtro[key as keyof FiltroProductos] !== undefined) {
                params[key] = filtro[key as keyof FiltroProductos];
            }
        });

        return this.http.get<RespuestaProductos>(url, { params }).pipe(
            tap((productos) => {
                // Guardar los productos en el almacenamiento local
                this.almacenamiento.set('Productos', productos);
            }),
            catchError((error) => {
                console.error('Error al obtener productos desde la API:', error);
                throw 'No se pudo obtener los productos desde la API.';
            })
        );
    }


    private filtrarProductos(productosAlmacenados: RespuestaProductos, filtro: FiltroProductos): RespuestaProductos {
        const negocioFiltro = filtro.negocio?.toLowerCase() || '';
    
        return {
            ...productosAlmacenados,
            productos: productosAlmacenados.productos.filter((producto) =>
                this.cumpleFiltrosProducto(producto, filtro, negocioFiltro)
            ),
        };
    }
    
    // Función para verificar si un producto cumple con los filtros
    private cumpleFiltrosProducto(producto: Producto, filtro: FiltroProductos, negocioFiltro: string): boolean {
        const cumpleNegocio = producto.stockSegment.some(
            (segmento) => segmento.negocio?.toLowerCase() === negocioFiltro
        );
    
        const cumpleListaPrecio = filtro.lista_precio
            ? producto.lista_precio.some((precio) =>
                  filtro.lista_precio.some((clientePrecio) => clientePrecio.codlpr === precio.codlpr)
              )
            : true;
    
        return cumpleNegocio && cumpleListaPrecio;
    }
}
