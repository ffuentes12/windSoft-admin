import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { SelectItem } from 'primeng/api';
import { Table } from 'primeng/table';
import { firstValueFrom } from 'rxjs';
import { ApiService } from 'src/app/demo/service/api-service.service';
import { CountryService } from 'src/app/demo/service/country.service';

@Component({
    selector: 'app-imagenes',
    templateUrl: './imagenes.component.html',
    styleUrls: ['./imagenes.component.scss'], // Corregido `styleUrl` a `styleUrls`
})
export class ImagenesComponent implements OnInit {
    loading: boolean = false;
    countries: any[] = [];
    filteredCountries: any[] = [];
    productos: any[] = [];
    totalRegistros: number = 0;

    // Paginación
    paginaActual: number = 1;
    cantidadPorPagina: number = 100;

    filterForm: FormGroup;

    constructor(
        private apiService: ApiService,
        private fb: FormBuilder,
        private countryService: CountryService
    ) {
        this.filterForm = this.fb.group({
            codpro: [''],
            despro: [''],
            codsap: [''],
            stocks: [''],
            codsec: [''],
            codrub: [''],
            deslin: [''],

            desrub: [''],

            urisFotos: [''],
        });
    }

    ngOnInit() {
        this.countryService.getCountries().then((countries) => {
            this.countries = countries;
        });

        this.loadProductos(); // Carga inicial de datos
    }

    async loadProductos(): Promise<void> {
        this.loading = true;

        try {
            const filters = this.filterForm.value;
            const request = {
                ...filters,
                paginaActual: this.paginaActual,
                cantidadPorPagina: this.cantidadPorPagina,
            };

            const response = await firstValueFrom(
                this.apiService.get<any>('producto/get', request)
            );

            this.productos = response.productos;
            this.totalRegistros = response.totalRegistros;
        } catch (error) {
            console.error('Error al obtener los productos:', error);
        } finally {
            this.loading = false;
        }
    }

    async onSubmit(): Promise<void> {
        this.paginaActual = 1; // Reinicia a la primera página al aplicar nuevos filtros
        await this.loadProductos();
    }

    async onLazyLoad(event: any): Promise<void> {
        this.paginaActual = event.first / event.rows + 1; // Calcula la página actual
        this.cantidadPorPagina = event.rows; // Actualiza la cantidad por página
        await this.loadProductos(); // Vuelve a cargar los datos con los nuevos valores
    }

    filterCountry(event: any) {
        const query = event.query.toLowerCase();
        this.filteredCountries = this.countries.filter((country) =>
            country.name.toLowerCase().startsWith(query)
        );
    }

    getStockClass(stocks: string, embalaje: string): string {
        const stockActual = parseInt(stocks, 10);
        const unidadesEmbalaje = parseInt(embalaje, 10);

        if (!unidadesEmbalaje || isNaN(stockActual)) {
            return 'status-unknown'; // Clase para datos no válidos
        }

        if (stockActual < unidadesEmbalaje) {
            return 'status-2'; // Rojo
        } else if (stockActual < 3 * unidadesEmbalaje) {
            return 'status-1'; // Amarillo
        } else {
            return 'status-3'; // Verde
        }
    }

    onGlobalFilter(table: Table, event: Event) {
      table.filterGlobal(
          (event.target as HTMLInputElement).value,
          'contains'
      );
  }
}
