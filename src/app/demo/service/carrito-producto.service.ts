import { Injectable } from '@angular/core';
import { CarritoService } from './carrito.service';
import { Producto } from 'src/app/_models/producto';
import { BehaviorSubject } from 'rxjs';

export interface ProductoCarrito {
  codpro: string;
  cantidad: number;
  neto: number;
  iva: number;
  total: number;
  despro: string;
}

@Injectable({
  providedIn: 'root',
})
export class CarritoProductoService {
  private cantidadSKUSubject = new BehaviorSubject<number>(0);
  cantidadSKU$ = this.cantidadSKUSubject.asObservable();

  constructor(private carritoService: CarritoService) {}

  /**
   * Agrega un producto al carrito o actualiza su cantidad si ya existe.
   */
  async agregarProducto(
    rutcli: string,
    cencos: string,
    producto: ProductoCarrito
  ): Promise<void> {
    const carrito = await this.carritoService.getCarrito(rutcli, cencos);

    const index = carrito.findIndex((p: ProductoCarrito) => p.codpro === producto.codpro);
    if (index > -1) {
      // Si ya existe el producto, actualizamos los valores
      carrito[index].cantidad += producto.cantidad;
      carrito[index].neto += producto.neto;
      carrito[index].total += producto.total;
    } else {
      // Si no existe, lo agregamos al carrito
      carrito.push(producto);
    }

    // Guardamos el carrito actualizado
    await this.carritoService.setCarrito(rutcli, cencos, carrito);
    this.actualizarCantidadSKU(carrito);
  }

  /**
   * Simplifica la lógica para agregar productos usando datos del producto y tipo de cantidad.
   */
  async agregarProductoSimplificado(
    rutcli: string,
    cencos: string,
    producto: Producto,
    tipoCantidad: 'embalaje' | 'sub_embalaje'
  ): Promise<void> {
    const cantidad = Number(producto[tipoCantidad]);
    const neto = cantidad * Number(producto.lista_precio[0]?.prelis || 0);
    const iva = neto * 0.19; // IVA del 19%
    const total = neto + iva;

    const productoCarrito: ProductoCarrito = {
      codpro: producto.codpro.toString(),
      cantidad,
      neto,
      iva,
      total,
      despro: producto.despro,
    };

    await this.agregarProducto(rutcli, cencos, productoCarrito);
  }

  /**
   * Elimina un producto específico del carrito.
   */
  async eliminarProducto(rutcli: string, cencos: string, codpro: string): Promise<void> {
    const carrito = await this.carritoService.getCarrito(rutcli, cencos);

    const carritoActualizado = carrito.filter((p: ProductoCarrito) => p.codpro !== codpro);

    await this.carritoService.setCarrito(rutcli, cencos, carritoActualizado);
  }

  /**
   * Limpia completamente el carrito de un cliente y sucursal.
   */
  async limpiarCarrito(rutcli: string, cencos: string): Promise<void> {
    await this.carritoService.eliminarCarrito(rutcli, cencos);
  }

  /**
   * Obtiene la cantidad de un producto específico en el carrito.
   */
  async obtenerCantidadProducto(
    rutcli: string,
    cencos: string,
    codpro: string
  ): Promise<number> {
    const carrito = await this.carritoService.getCarrito(rutcli, cencos);
    const producto = carrito.find((p: ProductoCarrito) => p.codpro === codpro);
    return producto ? producto.cantidad : 0;
  }

  /**
   * Obtiene el carrito completo para un cliente y sucursal.
   */
  async obtenerCarrito(rutcli: string, cencos: string): Promise<ProductoCarrito[]> {
    return await this.carritoService.getCarrito(rutcli, cencos);
  }


  async obtenerCantidadSKU(rutcli: string, cencos: string): Promise<number> {
    const carrito = await this.carritoService.getCarrito(rutcli, cencos);
    return carrito.length;
  }

  private actualizarCantidadSKU(carrito: ProductoCarrito[]) {
    this.cantidadSKUSubject.next(carrito.length);
  }
}
