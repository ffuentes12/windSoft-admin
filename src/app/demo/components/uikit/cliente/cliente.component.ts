import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Cliente, Sucursal } from 'src/app/_models/cliente';
import { ClienteActivoService } from 'src/app/demo/service/cliente-activo.service';
import { ClientesService } from 'src/app/demo/service/cliente.service';

@Component({
    templateUrl: './cliente.component.html',
    styleUrls: ['./cliente.component.scss'],
    providers: [MessageService, ConfirmationService],
})
export class ClienteComponent implements OnInit {
    @ViewChild('filter') filter!: ElementRef;
    clientes: Cliente[] = []; // Lista completa de clientes
    clientesFiltrados: Cliente[] = []; // Lista filtrada que se muestra en el acordeón
    clienteActivo: Cliente | null = null; // Cliente actualmente seleccionado
    usuario = 'PSINUES';

    constructor(
        private clientesService: ClientesService,
        private clienteActivoService: ClienteActivoService,
        private confirmationService: ConfirmationService,
        private messageService: MessageService
    ) {}

    ngOnInit() {
        // Cargar clientes y cliente activo
        this.clientesService.obtenerClientes(this.usuario).subscribe({
            next: (clientes) => {
                this.clientes = clientes;
                this.clientesFiltrados = [...this.clientes]; // Inicializar la lista filtrada

                console.log('Clientes cargados:', this.clientes);
            },
            error: (err) => console.error('Error al cargar clientes:', err),
        });
        // Recuperar el cliente activo al cargar el componente
        this.clienteActivoService.clienteActivo$.subscribe((cliente) => {
            this.clienteActivo = cliente; // Actualiza el cliente activo al recuperarlo
            console.log(this.clienteActivo);
        });
    }

    filtrarClientes(event: Event) {
        const filtro = (event.target as HTMLInputElement).value.toLowerCase();

        this.clientesFiltrados = this.clientes.filter(
            (cliente) =>
                cliente.razons.toLowerCase().includes(filtro) || // Filtra por razón social
                cliente.rutcli.toLowerCase().includes(filtro) // Filtra por RUT
        );
    }

    seleccionarCliente(cliente: Cliente, sucursal: Sucursal) {
        const clienteConSucursal = {
            ...cliente, // Copia los datos del cliente
            ...sucursal, // Sobrescribe con los datos de la sucursal seleccionada
        };

        this.clienteActivoService.setClienteActivo(clienteConSucursal); // Guardar como cliente activo
        this.clienteActivo = clienteConSucursal; // Actualizar localmente

        console.log('Cliente activo seleccionado:', clienteConSucursal);
    }

    confirm(event: Event, cliente: Cliente, sucursal: Sucursal) {
        const mensaje = `¿Desea Empezar a vender al cliente ${ (cliente.razons + ', ' + sucursal.direcc)}?`;
     
        this.confirmationService.confirm({
            target: event.target,
            message: mensaje,
            icon: 'pi pi-exclamation-triangle',
            acceptLabel: 'Sí',
            rejectLabel: 'No',
            accept: () => {
                this.seleccionarCliente(cliente, sucursal);
                this.messageService.add({
                    severity: 'info',
                    summary: 'Venta Iniciada',
                    detail: '',
                    life: 50000,
                });
               /*  this.clienteService.promocionClientes(cliente.rutcli).subscribe(
                    (response: PromocionesCliente[]) => {},
                    (error) => {
                        console.error('Error al cargar los clientes:', error);
                    }
                ); */
              
            },
        });
    }
}
