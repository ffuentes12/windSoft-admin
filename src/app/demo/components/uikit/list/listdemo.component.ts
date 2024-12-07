import { Component, OnInit } from '@angular/core';
import { SelectItem } from 'primeng/api';
import { DataView } from 'primeng/dataview';
import { Product } from 'src/app/demo/api/product';
import { ProductService } from 'src/app/demo/service/product.service';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import html2canvas from 'html2canvas';
import { ProductosService } from 'src/app/demo/service/producto.service';
import { Producto, RespuestaProductos } from 'src/app/_models/producto';

@Component({
    templateUrl: './listdemo.component.html',
})
export class ListDemoComponent implements OnInit {
    products: Product[] = [];

    sortOptions: SelectItem[] = [];

    sortOrder: number = 0;

    sortField: string = '';

    sourceCities: any[] = [];

    targetCities: any[] = [];

    orderCities: any[] = [];
    productosRespuesta: RespuestaProductos | null = null;   
     productos: Producto[] = [];

    constructor(
        private productService: ProductService,
        private productosService: ProductosService
    ) {}

    ngOnInit() {
        this.productosService
            .obtenerProductos({ total: 1 })
            .subscribe((data) => {
                if (data) {
                    this.productosRespuesta = data; // Almacena la respuesta completa
                    this.productos = data.productos; // Extrae los productos

                    console.log('Productos recibidos:', this.productos);
                }
            });

        this.productService
            .getProducts()
            .then((data) => (this.products = data));

        this.sourceCities = [
            { name: 'San Francisco', code: 'SF' },
            { name: 'London', code: 'LDN' },
            { name: 'Paris', code: 'PRS' },
            { name: 'Istanbul', code: 'IST' },
            { name: 'Berlin', code: 'BRL' },
            { name: 'Barcelona', code: 'BRC' },
            { name: 'Rome', code: 'RM' },
        ];

        this.targetCities = [];

        this.orderCities = [
            { name: 'San Francisco', code: 'SF' },
            { name: 'London', code: 'LDN' },
            { name: 'Paris', code: 'PRS' },
            { name: 'Istanbul', code: 'IST' },
            { name: 'Berlin', code: 'BRL' },
            { name: 'Barcelona', code: 'BRC' },
            { name: 'Rome', code: 'RM' },
        ];

        this.sortOptions = [
            { label: 'Price High to Low', value: '!price' },
            { label: 'Price Low to High', value: 'price' },
        ];
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

    onFilter(dv: DataView, event: Event) {
        dv.filter((event.target as HTMLInputElement).value);
    }

    exportToPDF() {
        const dataViewElement = document.querySelector('p-dataView'); // Selecciona el elemento p-dataView

        if (dataViewElement) {
            html2canvas(dataViewElement as HTMLElement).then((canvas) => {
                const imgData = canvas.toDataURL('image/png'); // Convierte a imagen
                const pdf = new jsPDF('p', 'mm', 'a4'); // Crea un documento PDF en formato A4
                const imgWidth = 190; // Ancho de la imagen en el PDF
                const pageHeight = 295; // Alto de la página A4
                const imgHeight = (canvas.height * imgWidth) / canvas.width; // Calcula la altura de la imagen manteniendo la proporción
                let heightLeft = imgHeight;

                let position = 10; // Posición inicial en el PDF

                pdf.addImage(imgData, 'PNG', 10, position, imgWidth, imgHeight);
                heightLeft -= pageHeight;

                while (heightLeft > 0) {
                    position = heightLeft - imgHeight; // Mueve la posición hacia abajo
                    pdf.addPage();
                    pdf.addImage(
                        imgData,
                        'PNG',
                        10,
                        position,
                        imgWidth,
                        imgHeight
                    );
                    heightLeft -= pageHeight;
                }

                pdf.save('DataView.pdf'); // Guarda el archivo como "DataView.pdf"
            });
        }
    }
}
