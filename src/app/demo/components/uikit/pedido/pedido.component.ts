import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Customer, Representative } from 'src/app/demo/api/customer';
import { CustomerService } from 'src/app/demo/service/customer.service';
import { Product } from 'src/app/demo/api/product';
import { ProductService } from 'src/app/demo/service/product.service';
import { Table } from 'primeng/table';
import { MessageService, ConfirmationService, MenuItem } from 'primeng/api';
import { ApiService } from 'src/app/demo/service/api-service.service';
import { firstValueFrom } from 'rxjs';
import { Pedido } from 'src/app/_models/pedido';
import { codStatusPedido } from 'src/app/_enum/codigoPedido';

interface expandedRows {
    [key: string]: boolean;
}

@Component({
    selector: 'app-pedido',
    templateUrl: './pedido.component.html',
    styleUrl: './pedido.component.scss',
    providers: [MessageService, ConfirmationService],
})
export class PedidoComponent implements OnInit {
    tieredItems: MenuItem[] = [];
    pedidos: Pedido[] = [];
    customers1: Customer[] = [];

    customers2: Customer[] = [];

    customers3: Customer[] = [];

    selectedCustomers1: Customer[] = [];

    selectedCustomer: Customer = {};

    representatives: Representative[] = [];

    statuses: any[] = [];

    products: Product[] = [];

    rowGroupMetadata: any;

    expandedRows: expandedRows = {};

    activityValues: number[] = [0, 100];

    isExpanded: boolean = false;

    idFrozen: boolean = false;

    loading: boolean = true;

    @ViewChild('filter') filter!: ElementRef;
    value5: any;

    constructor(
        private customerService: CustomerService,
        private productService: ProductService,
        private apiService: ApiService
    ) {}

    ngOnInit() {
        this.tieredItems = [
            {
                label: 'Estado',
                icon: 'pi pi-fw pi-shopping-cart',
                items: [
                    {
                        label: 'Abierto',
                    },
                    {
                        label: 'Enviado',
                    },
                ],
            },

            {
                label: 'Vendedor',
                icon: 'pi pi-fw pi-user',
                items: [
                    {
                        label: 'ven 1',
                    },
                    {
                        label: 'Ven 2',
                    },
                ],
            },
            { separator: true },
            {
                label: 'Limpiar',
                icon: 'pi pi-fw pi-sign-out',
            },
        ];
        this.loadPedidos();
        this.customerService.getCustomersLarge().then((customers) => {
            this.customers1 = customers;
            this.loading = false;

            // @ts-ignore
        });
        this.customerService
            .getCustomersMedium()
            .then((customers) => (this.customers2 = customers));
        this.customerService
            .getCustomersLarge()
            .then((customers) => (this.customers3 = customers));
        this.productService
            .getProductsWithOrdersSmall()
            .then((data) => (this.products = data));

        this.representatives = [
            { name: 'Amy Elsner', image: 'amyelsner.png' },
            { name: 'Anna Fali', image: 'annafali.png' },
            { name: 'Asiya Javayant', image: 'asiyajavayant.png' },
            { name: 'Bernardo Dominic', image: 'bernardodominic.png' },
            { name: 'Elwin Sharvill', image: 'elwinsharvill.png' },
            { name: 'Ioni Bowcher', image: 'ionibowcher.png' },
            { name: 'Ivan Magalhaes', image: 'ivanmagalhaes.png' },
            { name: 'Onyama Limba', image: 'onyamalimba.png' },
            { name: 'Stephen Shaw', image: 'stephenshaw.png' },
            { name: 'XuXue Feng', image: 'xuxuefeng.png' },
        ];

        this.statuses = [
            { label: 'Unqualified', value: 'unqualified' },
            { label: 'Qualified', value: 'qualified' },
            { label: 'New', value: 'new' },
            { label: 'Negotiation', value: 'negotiation' },
            { label: 'Renewal', value: 'renewal' },
            { label: 'Proposal', value: 'proposal' },
        ];
    }
  async  onDateChange(newDate: Date) {
      let request = {
        fechaIni: newDate, // Fecha inicial
    };

    try {
        const data: Pedido[] = await firstValueFrom(
            this.apiService.get<Pedido[]>(
                'pedido/get-pedidos-by-usr',
                request
            )
        );
        this.pedidos = data;
    } catch (error) {
        console.error('Error al obtener los pedidos:', error);
    }
    }
    async loadPedidos(): Promise<void> {
        let request = {
            fechaIni: '2024-11-01', // Fecha inicial
        };

        try {
            const data: Pedido[] = await firstValueFrom(
                this.apiService.get<Pedido[]>(
                    'pedido/get-pedidos-by-usr',
                    request
                )
            );
            this.pedidos = data;
        } catch (error) {
            console.error('Error al obtener los pedidos:', error);
        }
    }

    onSort() {
        this.updateRowGroupMetaData();
    }

    updateRowGroupMetaData() {
        this.rowGroupMetadata = {};

        if (this.customers3) {
            for (let i = 0; i < this.customers3.length; i++) {
                const rowData = this.customers3[i];
                const representativeName = rowData?.representative?.name || '';

                if (i === 0) {
                    this.rowGroupMetadata[representativeName] = {
                        index: 0,
                        size: 1,
                    };
                } else {
                    const previousRowData = this.customers3[i - 1];
                    const previousRowGroup =
                        previousRowData?.representative?.name;
                    if (representativeName === previousRowGroup) {
                        this.rowGroupMetadata[representativeName].size++;
                    } else {
                        this.rowGroupMetadata[representativeName] = {
                            index: i,
                            size: 1,
                        };
                    }
                }
            }
        }
    }

    expandAll() {
        if (!this.isExpanded) {
            this.products.forEach((product) =>
                product && product.name
                    ? (this.expandedRows[product.name] = true)
                    : ''
            );
        } else {
            this.expandedRows = {};
        }
        this.isExpanded = !this.isExpanded;
    }

    formatCurrency(value: number) {
        return value.toLocaleString('en-US', {
            style: 'currency',
            currency: 'USD',
        });
    }

    onGlobalFilter(table: Table, event: Event) {
        table.filterGlobal(
            (event.target as HTMLInputElement).value,
            'contains'
        );
    }

    clear(table: Table) {
        table.clear();
        this.filter.nativeElement.value = '';
    }

    getStatusName(status: number): string {
        const statusMap = new Map<number, string>([
            [codStatusPedido.PEDIDO_ABIERTO, 'Pedido Abierto'],
            [codStatusPedido.PEDIDO_CERRADO, 'Pedido Cerrado'],
            [codStatusPedido.PEDIDO_ENVIADO, 'Pedido Enviado'],
            [codStatusPedido.PEDIDO_NOEVIADO, 'Pedido No Enviado'],
            [codStatusPedido.PEDIDO_ENDESPACHO, 'En Despacho'],
            [codStatusPedido.PEDIDO_CANCELADO, 'Cancelado'],
            [codStatusPedido.PEDIDO_ENTREGADO, 'Entregado'],
            [codStatusPedido.PEDIDO_ENPROGRESO, 'En Progreso'],
        ]);
        return statusMap.get(status) || 'Desconocido';
    }
}
