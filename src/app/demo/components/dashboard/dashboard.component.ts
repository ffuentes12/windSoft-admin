import { Component, OnInit, OnDestroy } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { Product } from '../../api/product';
import { ProductService } from '../../service/product.service';
import { Subscription, debounceTime, firstValueFrom } from 'rxjs';
import { LayoutService } from 'src/app/layout/service/app.layout.service';
import { ApiService } from '../../service/api-service.service';
import { SelectItem } from 'primeng/api';
import {
    CambiosPorcentuales,
    ClientesParetoData,
    MesVentas,
    ProductosParetoData,
    ResumenVentas,
} from 'src/app/_models/model';

@Component({
    templateUrl: './dashboard.component.html',
})
export class DashboardComponent implements OnInit, OnDestroy {
    lineData: any;

    barData: any;

    pieData: any;

    polarData: any;

    radarData: any;

    lineOptions: any;

    barOptions: any;

    pieOptions: any;

    polarOptions: any;

    radarOptions: any;

    dataPareto: ClientesParetoData | null = null;

    items!: MenuItem[];

    products!: Product[];

    chartData: any;

    chartOptions: any;

    subscription!: Subscription;
    mesActual!: MesVentas;
    mesAnterior!: MesVentas;
    cambiosPorcentuales!: CambiosPorcentuales;

    //dataProductosPareto: ProductosParetoData | null = null;
    productosMostrar = 5;
    dataProductosPareto = {
        totalVentas: 0,
        limite80: 0,
        productos80_20: [], // Asegúrate de cargar la lista de productos en esta propiedad
    };
    value: string = 'F';
    paymentOptions: any[] = [];
    stateOptions: any[] = [];
    valSelect1: any = '';
    constructor(
        private productService: ProductService,
        public layoutService: LayoutService,
        private apiService: ApiService
    ) {
        this.subscription = this.layoutService.configUpdate$
            .pipe(debounceTime(25))
            .subscribe((config) => {
                this.initChart();
            });
    }
    resetResumen(): void {
        this.mesActual = {
            totalVentas: 0,
            cantidadVentas: 0,
            ticketPromedio: 0,
            clientesActivos: 0,
        };

        this.mesAnterior = {
            totalVentas: 0,
            cantidadVentas: 0,
            ticketPromedio: 0,
            clientesActivos: 0,
        };

        this.cambiosPorcentuales = {
            totalVentas: 0,
            cantidadVentas: 0,
            ticketPromedio: 0,
            clientesActivos: 0,
        };
    }
    onPaymentOptionChange(event: any) {
        if (event?.value) {
            this.getResumenVenedor(event.value.value);
            this.getResumen(event.value.value);
            this.getClientesPareto(event.value.value);
            this.getProductosPareto(event.value.value);
            console.log('Nueva opción seleccionada:', event.value);
        } else {
            console.error('El evento no contiene un valor válido:', event);
        }
    }
    ngOnInit() {
        this.paymentOptions = [
            { name: 'Mes Actual', value: 'mesActual' },
            { name: '3 meses', value: 'ultimo3' },
            { name: '6 meses', value: 'ultimo6' },
            { name: '12 meses', value: 'ultimo12' },
        ];

        this.getResumen();
        this.getClientesPareto();
        this.getProductosPareto();
        this.getResumenVenedor();
        this.initChart();
        this.productService
            .getProductsSmall()
            .then((data) => (this.products = data));

        this.items = [
            { label: 'Add New', icon: 'pi pi-fw pi-plus' },
            { label: 'Remove', icon: 'pi pi-fw pi-minus' },
        ];
    }
    verMasProductos() {
        this.productosMostrar += 10;
    }
    initChart() {
        const documentStyle = getComputedStyle(document.documentElement);
        const textColor = documentStyle.getPropertyValue('--text-color');
        const textColorSecondary = documentStyle.getPropertyValue(
            '--text-color-secondary'
        );
        const surfaceBorder =
            documentStyle.getPropertyValue('--surface-border');

        this.chartData = {
            labels: [
                'January',
                'February',
                'March',
                'April',
                'May',
                'June',
                'July',
            ],
            datasets: [
                {
                    label: 'First Dataset',
                    data: [65, 59, 80, 81, 56, 55, 40],
                    fill: false,
                    backgroundColor:
                        documentStyle.getPropertyValue('--bluegray-700'),
                    borderColor:
                        documentStyle.getPropertyValue('--bluegray-700'),
                    tension: 0.4,
                },
                {
                    label: 'Second Dataset',
                    data: [28, 48, 40, 19, 86, 27, 90],
                    fill: false,
                    backgroundColor:
                        documentStyle.getPropertyValue('--green-600'),
                    borderColor: documentStyle.getPropertyValue('--green-600'),
                    tension: 0.4,
                },
            ],
        };

        this.chartOptions = {
            plugins: {
                legend: {
                    labels: {
                        color: textColor,
                    },
                },
            },
            scales: {
                x: {
                    ticks: {
                        color: textColorSecondary,
                    },
                    grid: {
                        color: surfaceBorder,
                        drawBorder: false,
                    },
                },
                y: {
                    ticks: {
                        color: textColorSecondary,
                    },
                    grid: {
                        color: surfaceBorder,
                        drawBorder: false,
                    },
                },
            },
        };
    }

    async getResumen(valor: string = 'mesActual') {
        try {
            // Especifica el tipo de `data` como `ResumenVentas`
            const data: ResumenVentas = await firstValueFrom(
                this.apiService.get<ResumenVentas>('dashboard/resumen', {
                    intervalo: valor,
                })
            );

            // Asigna los datos a las propiedades del componente
            this.mesActual = data.mesActual;
            this.mesAnterior = data.mesAnterior;
            this.cambiosPorcentuales = data.cambiosPorcentuales;
        } catch (error) {
            console.error('Error al obtener el resumen de ventas:', error);
        }
    }

    async getClientesPareto(valor: string = 'mesActual'): Promise<void> {
        try {
            const data: ClientesParetoData = await firstValueFrom(
                this.apiService.get<ClientesParetoData>(
                    'dashboard/clientes-pareto',
                    {
                        intervalo: valor,
                    }
                )
            );

            // Definir colores de más intenso a menos intenso
            const colors = [
                '#66BB6A', // Verde
                '#9CCC65', // Verde claro
                '#D4E157', // Lima
                '#FFEB3B', // Amarillo
                '#FFCA28', // Amarillo oscuro
                '#FFA726', // Naranja
                '#EF5350', // Rojo claro
                '#D32F2F', // Rojo
            ];

            // Mapear clientes y asignar colores secuenciales
            this.dataPareto = {
                ...data,
                clientes80_20: data.clientes80_20.map((cliente, index) => ({
                    ...cliente,
                    porcentajeVentas:
                        (cliente.totalVentasCliente / data.totalVentas) * 100,
                    color: colors[index % colors.length], // Asignar color en orden
                })),
            };
        } catch (error) {
            console.error('Error al obtener datos de clientes Pareto:', error);
        }
    }

    async getProductosPareto(valor: string = 'mesActual'): Promise<void> {
        try {
            const data: ProductosParetoData = await firstValueFrom(
                this.apiService.get<ProductosParetoData>(
                    'dashboard/productos-pareto',
                    {
                        intervalo: valor,
                    }
                )
            );

            // Definir colores de más intenso a menos intenso
            const colors = [
                '#66BB6A', // Verde
                '#9CCC65', // Verde claro
                '#D4E157', // Lima
                '#FFEB3B', // Amarillo
                '#FFCA28', // Amarillo oscuro
                '#FFA726', // Naranja
                '#EF5350', // Rojo claro
                '#D32F2F', // Rojo
            ];

            // Mapear productos y asignar colores secuenciales
            this.dataProductosPareto = {
                ...data,
                productos80_20: data.productos80_20.map((producto, index) => ({
                    ...producto,
                    color: colors[index % colors.length], // Asignar color en orden
                })),
            };
        } catch (error) {
            console.error('Error al obtener datos de productos Pareto:', error);
        }
    }

    getRandomColor(): string {
        const colors = [
            '#66BB6A', // Verde
            '#9CCC65', // Verde claro
            '#D4E157', // Lima
            '#FFEB3B', // Amarillo
            '#FFCA28', // Amarillo oscuro
            '#FFA726', // Naranja
            '#EF5350', // Rojo claro
            '#D32F2F', // Rojo
        ];
        return colors[Math.floor(Math.random() * colors.length)];
    }
    ngOnDestroy() {
        if (this.subscription) {
            this.subscription.unsubscribe();
        }
    }
    async getResumenVenedor(valor: string = 'mesActual'): Promise<void> {
        try {
            // Llama al endpoint y espera los datos en el formato esperado
            const data: any = await firstValueFrom(
                this.apiService.get<any>('dashboard/resumen-vendedor', {
                    intervalo: valor,
                })
            );
            // Inicializa el gráfico con los datos obtenidos
            this.initCharts(data);
        } catch (error) {
            console.error('Error al obtener el resumen de ventas:', error);
        }
    }
    formatToMillions(value: number): string {
        if (value >= 1000000) {
          // Divide por 1,000,000, trunca el resultado y agrega el sufijo "mi"
          return Math.floor(value / 1000000) + '.' + Math.floor((value % 1000000) / 100000) + ' mi';
        }
        return value.toString();
      }
    initCharts(data: any) {
        const nombreMesActual = new Date().toLocaleString('default', {
            month: 'long',
        });
        const nombreMesAnterior = new Date(
            new Date().setMonth(new Date().getMonth() - 1)
        ).toLocaleString('default', { month: 'long' });
        const documentStyle = getComputedStyle(document.documentElement);
        const textColor = documentStyle.getPropertyValue('--text-color');
        const textColorSecondary = documentStyle.getPropertyValue(
            '--text-color-secondary'
        );
        const surfaceBorder =
            documentStyle.getPropertyValue('--surface-border');

        this.barData = {
            labels: data.labels,
            datasets: [
                {
                    label: nombreMesActual,
                    backgroundColor:
                        documentStyle.getPropertyValue('--primary-500'),
                    borderColor:
                        documentStyle.getPropertyValue('--primary-500'),
                    data: data.dataActual,
                },
                {
                    label: nombreMesAnterior,
                    backgroundColor:
                        documentStyle.getPropertyValue('--primary-200'),
                    borderColor:
                        documentStyle.getPropertyValue('--primary-200'),
                    data: data.dataAnterior,
                },
            ],
        };

        this.pieData = {
            labels: ['A', 'B', 'C'],
            datasets: [
                {
                    data: [540, 325, 702],
                    backgroundColor: [
                        documentStyle.getPropertyValue('--indigo-500'),
                        documentStyle.getPropertyValue('--purple-500'),
                        documentStyle.getPropertyValue('--teal-500'),
                    ],
                    hoverBackgroundColor: [
                        documentStyle.getPropertyValue('--indigo-400'),
                        documentStyle.getPropertyValue('--purple-400'),
                        documentStyle.getPropertyValue('--teal-400'),
                    ],
                },
            ],
        };

        this.pieOptions = {
            plugins: {
                legend: {
                    labels: {
                        usePointStyle: true,
                        color: textColor,
                    },
                },
            },
        };
    }
}
