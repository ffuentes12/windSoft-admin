import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { SelectItem } from 'primeng/api';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import { ProductosService } from 'src/app/demo/service/producto.service';
import { Producto, RespuestaProductos } from 'src/app/_models/producto';
import { ClienteActivoService } from 'src/app/demo/service/cliente-activo.service';
import { CarritoProductoService } from 'src/app/demo/service/carrito-producto.service';

@Component({
    selector: 'app-pro-grid',
    templateUrl: './pro-grid.component.html',
    styleUrls: ['./pro-grid.component.scss'],
})
export class ProGridComponent implements OnInit, OnDestroy {
    sortOptions: SelectItem[] = [];
    sortOrder: number = 0;
    sortField: string = '';

    clienteActivo: any = null; // Cliente activo
    productosRespuesta: RespuestaProductos | null = null; // Respuesta de productos
    productos: Producto[] = []; // Lista de productos
    cantidadesCarrito: { [codpro: number]: number } = {}; // Cantidad por producto en el carrito

    private subscriptions: Subscription = new Subscription();

    constructor(
        private productosService: ProductosService,
        private clienteActivoService: ClienteActivoService,
        private carritoProductoService: CarritoProductoService
    ) {}

    ngOnInit() {
        this.subscriptions.add(
            this.clienteActivoService.clienteActivo$.subscribe((cliente) => {
                this.clienteActivo = cliente;
                if (this.clienteActivo) {
                    this.cargarCarrito();
                    this.cargarProductos();
                }
            })
        );

        this.sortOptions = [
            { label: 'Price High to Low', value: '!price' },
            { label: 'Price Low to High', value: 'price' },
        ];
    }

    cargarProductos() {
        try {
            this.subscriptions.add(
                this.productosService.obtenerProductos({ total: 1, negocio: this.clienteActivo.negocio , lista_precio : this.clienteActivo.lista_precio  }).subscribe((data) => {
                    if (data) {
                        this.productosRespuesta = data;
                        this.productos = data.productos;
                        this.sincronizarCantidades();
                        console.log('Productos recibidos:', this.productos);
                    }
                })
            );
        } catch (error) {
            console.error('Error al agregar producto:', error);
        }
    }

    async cargarCarrito() {
        if (!this.clienteActivo || !this.clienteActivo.cencos) return;

        const carrito = await this.carritoProductoService.obtenerCarrito(this.clienteActivo.rutcli, this.clienteActivo.cencos);
        this.cantidadesCarrito = carrito.reduce((map, prod) => {
            map[prod.codpro] = prod.cantidad;
            return map;
        }, {});
        this.sincronizarCantidades();
    }

    sincronizarCantidades() {
        this.productos.forEach((producto) => {
            // Obtener la cantidad en carrito
            producto['cantidadEnCarrito'] = this.cantidadesCarrito[producto.codpro] || 0;
        });
    }

    obtenerStockPorNegocio(producto: Producto): number {
        if (!this.clienteActivo?.negocio) return 0;

        const segmento = producto.stockSegment.find((segment) => segment.negocio.toLowerCase() === this.clienteActivo.negocio.toLowerCase());
        return segmento ? segmento.stock : 0;
    }

    onSortChange(event: any) {
        const value = event.value;
        if (value.indexOf('!') === 0) {
            this.sortOrder = -1;
            this.sortField = value.substring(1, value.length);
        } else {
            this.sortOrder = 1;
            this.sortField = value;
        }
    }

    onFilter(event: Event) {
        const value = (event.target as HTMLInputElement).value.toLowerCase();
        this.productos = this.productos.filter((prod) => prod.despro.toLowerCase().includes(value) || prod.codpro.toString().includes(value));
    }

    exportToPDF() {
        const dataViewElement = document.querySelector('p-dataView');
        if (dataViewElement) {
            html2canvas(dataViewElement as HTMLElement).then((canvas) => {
                const imgData = canvas.toDataURL('image/png');
                const pdf = new jsPDF('p', 'mm', 'a4');
                const imgWidth = 190;
                const pageHeight = 295;
                const imgHeight = (canvas.height * imgWidth) / canvas.width;
                let heightLeft = imgHeight;
                let position = 10;

                pdf.addImage(imgData, 'PNG', 10, position, imgWidth, imgHeight);
                heightLeft -= pageHeight;

                while (heightLeft > 0) {
                    position = heightLeft - imgHeight;
                    pdf.addPage();
                    pdf.addImage(imgData, 'PNG', 10, position, imgWidth, imgHeight);
                    heightLeft -= pageHeight;
                }

                pdf.save('DataView.pdf');
            });
        }
    }

    async agregarProducto(producto: Producto, tipoCantidad: 'embalaje' | 'sub_embalaje') {
        if (!this.clienteActivo || !this.clienteActivo.cencos) {
            console.error('No hay cliente o sucursal activa.');
            return;
        }

        try {
            await this.carritoProductoService.agregarProductoSimplificado(
                this.clienteActivo.rutcli,
                this.clienteActivo.cencos,
                producto,
                tipoCantidad
            );
            this.cargarCarrito(); // Actualiza las cantidades en el carrito
        } catch (error) {
            console.error('Error al agregar producto:', error);
        }
    }

    ngOnDestroy() {
        this.subscriptions.unsubscribe();
    }
}
