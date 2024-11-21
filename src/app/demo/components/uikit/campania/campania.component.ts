import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
 
import { Table } from 'primeng/table';
import { Customer, Representative } from 'src/app/demo/api/customer';
import { Product } from 'src/app/demo/api/product';
import { CustomerService } from 'src/app/demo/service/customer.service';
import { ProductService } from 'src/app/demo/service/product.service';

import { MessageService, ConfirmationService } from 'primeng/api';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { ApiService } from 'src/app/demo/service/api-service.service';
import { FileUpload } from 'primeng/fileupload';
interface expandedRows {
  [key: string]: boolean;
}

@Component({
    templateUrl: './campania.component.html',
    providers: [MessageService, ConfirmationService],
})
export class CampaniaComponent implements OnInit { 
  base64Image: string = ''; 
  catalogos: any[] = [];
  uploadedFiles: any[] = [];
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
  nombreCatalogo:string="";
  isExpanded: boolean = false;

  idFrozen: boolean = false;

  loading: boolean = true;

  @ViewChild('filter') filter!: ElementRef;
  @ViewChild('fileUpload') fileUpload!: FileUpload; 
  @ViewChild('fileUploadImage') fileUploadImage!: FileUpload; 
  

  constructor(private apiService:ApiService, private confirmationService: ConfirmationService,private http: HttpClient,private customerService: CustomerService, private productService: ProductService,private messageService: MessageService) { }

  ngOnInit() {
    this.getCatalos();
      this.customerService.getCustomersLarge().then(customers => {
          this.customers1 = customers;
          this.loading = false;

          // @ts-ignore
          this.customers1.forEach(customer => customer.date = new Date(customer.date));
      });
      this.customerService.getCustomersMedium().then(customers => this.customers2 = customers);
      this.customerService.getCustomersLarge().then(customers => this.customers3 = customers);
      this.productService.getProductsWithOrdersSmall().then(data => this.products = data);

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
          { name: 'XuXue Feng', image: 'xuxuefeng.png' }
      ];

      this.statuses = [
          { label: 'Unqualified', value: 'unqualified' },
          { label: 'Qualified', value: 'qualified' },
          { label: 'New', value: 'new' },
          { label: 'Negotiation', value: 'negotiation' },
          { label: 'Renewal', value: 'renewal' },
          { label: 'Proposal', value: 'proposal' }
      ];
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
                  this.rowGroupMetadata[representativeName] = { index: 0, size: 1 };
              }
              else {
                  const previousRowData = this.customers3[i - 1];
                  const previousRowGroup = previousRowData?.representative?.name;
                  if (representativeName === previousRowGroup) {
                      this.rowGroupMetadata[representativeName].size++;
                  }
                  else {
                      this.rowGroupMetadata[representativeName] = { index: i, size: 1 };
                  }
              }
          }
      }
  }

  expandAll() {
      if (!this.isExpanded) {
          this.products.forEach(product => product && product.name ? this.expandedRows[product.name] = true : '');

      } else {
          this.expandedRows = {};
      }
      this.isExpanded = !this.isExpanded;
  }

  formatCurrency(value: number) {
      return value.toLocaleString('en-US', { style: 'currency', currency: 'USD' });
  }

  onGlobalFilter(table: Table, event: Event) {
      table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
  }

  clear(table: Table) {
      table.clear();
      this.filter.nativeElement.value = '';
  }
  onUpload(event: any) {
    if (!this.nombreCatalogo.trim()) {
        this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'El nombre del catálogo es obligatorio',
        });
        return;
    }

    const formData = new FormData();
    formData.append('nombreCatalogo', this.nombreCatalogo);

    const file = event.files[0];
    if (file) {
        formData.append('file', file, file.name);
    }

    // Añadir la imagen en base64 al payload
    if (this.base64Image) {
        formData.append('imagen', this.base64Image);
    }

    this.http
        .post('http://localhost:3000/api/catalogo/procesar-excel', formData)
        .subscribe({
            next: (response) => {
                this.messageService.add({
                    severity: 'success',
                    summary: 'Éxito',
                    detail: 'Catálogo procesado exitosamente',
                });
                console.log('Respuesta del servidor:', response);
                this.resetForm();
            },
            error: (error) => {
                this.messageService.add({
                    severity: 'error',
                    summary: 'Error',
                    detail: 'Ocurrió un error al procesar el catálogo',
                });
                console.error('Error al subir el archivo:', error);
            },
        });
}
resetForm(): void {
  // Limpia el nombre del catálogo
  this.nombreCatalogo = '';
  // Limpia los archivos seleccionados
  this.uploadedFiles = [];
  this.fileUpload.clear(); 
  this.fileUploadImage.clear();
}
onImageSelect(event: any) {
    const file = event.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = (e: any) => {
            this.base64Image = e.target.result.split(',')[1]; // Extrae solo el contenido base64
            console.log('Imagen en Base64:', this.base64Image);
        };
        reader.readAsDataURL(file);
    }
}


async getCatalos(): Promise<void> {
  try {
      // Llama al endpoint y espera los datos en el formato esperado
      const data: any = await firstValueFrom(
          this.apiService.get<any>('catalogo/get', '')
      );
      this.catalogos =data;
      console.log()
     
  } catch (error) {
      console.error('Error al obtener el resumen de ventas:', error);
  }
}
confirm1() {
  this.confirmationService.confirm({
      key: 'confirm1',
      message: 'Are you sure to perform this action?'
  });
}

}
