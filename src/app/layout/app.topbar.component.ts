import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Subscription } from 'rxjs';
import { LayoutService } from './service/app.layout.service';
import { ClienteActivoService } from '../demo/service/cliente-activo.service';
import { CarritoProductoService } from '../demo/service/carrito-producto.service';
import { MenuItem } from 'primeng/api';

@Component({
    selector: 'app-topbar',
    templateUrl: './app.topbar.component.html',
})
export class AppTopBarComponent implements OnInit, OnDestroy {
    items!: MenuItem[];
    @ViewChild('menubutton') menuButton!: ElementRef;
    @ViewChild('topbarmenubutton') topbarMenuButton!: ElementRef;
    @ViewChild('topbarmenu') menu!: ElementRef;

    clienteActivo: any = null; // Incluye sucursal activa en el primer nivel
    cantidadProductosCarrito: number = 0;

    private subscriptions: Subscription = new Subscription();

    constructor(
        private clienteActivoService: ClienteActivoService,
        private carritoProductoService: CarritoProductoService,
        public layoutService: LayoutService
    ) {}

    ngOnInit() {
        // Suscripción al cliente activo
        const clienteSub = this.clienteActivoService.clienteActivo$.subscribe((cliente) => {
            this.clienteActivo = cliente;

            if (cliente?.rutcli && this.clienteActivo?.cencos) {
                this.actualizarCantidadSKU(cliente.rutcli, this.clienteActivo.cencos);
            } else {
                this.cantidadProductosCarrito = 0;
            }
        });

        // Suscripción a cambios en el carrito
        const carritoSub = this.carritoProductoService.cantidadSKU$.subscribe((cantidad) => {
            this.cantidadProductosCarrito = cantidad;
        });

        // Agregamos las suscripciones a la lista
        this.subscriptions.add(clienteSub);
        this.subscriptions.add(carritoSub);
    }

    private async actualizarCantidadSKU(rutcli: string, cencos: string) {
        const cantidad = await this.carritoProductoService.obtenerCantidadSKU(rutcli, cencos);
        this.cantidadProductosCarrito = cantidad;
    }

    ngOnDestroy() {
        this.subscriptions.unsubscribe();
    }
}
