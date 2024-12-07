export interface RespuestaProductos {
    totalRegistros: number;  // Total de registros disponibles
    paginaActual: number;    // Número de la página actual
    cantidadPorPagina: number; // Cantidad de registros por página
    productos: Producto[];   // Lista de productos
}

export interface Producto {
    _id: string;
    codpro: number;
    despro: string;
    codsap: string;
    stockSegment: StockSegment[];
    stocks: string;
    deslin: string;
    codsec: string;
    dessec: string;
    codrub: string;
    desrub: string;
    embalaje: string;
    sub_embalaje: string;
    lista_fotos_uri: ListaFotoUri[];
    lista_precio: ListaPrecio[];

    cantidadEnCarrito?: number; // 
    stockPorNegocio?:number
  }
  
  export interface StockSegment {
    negocio: string;
    stock: number;
    _id: string;
  }
  
  export interface ListaFotoUri {
    _id: string;
    codpr: number;
    uri: string;
  }
  
  export interface ListaPrecio {
    codpro: string;
    prelis: number;
    codlve: string;
    codlpr: string;
    multip: string;
    default: boolean;
    _id: string;
  }
  

 
export interface FiltroProductos {
    codpro?: string;
    despro?: string;
    codsap?: string;
    stocks?: number;
    codsec?: string;
    deslin?: string;
    desrub?: string;
    codrub?: string;
    dessec?: string;
    urisFotos?: string; // 'empty' o 'notEmpty'
    negocio?: string; // stockSegment.negocio
    paginaActual?: number; // Número de página
    cantidadPorPagina?: number; // Cantidad de productos por página
    orden?: string; // Campo para ordenar
    total?: number;
    lista_precio?: ListaPrecio[]; // Arreglo de objetos con codlve y codlpr
  }
  
  export interface ListaPrecio {
      codlve: string; // Código del nivel de precio
      codlpr: string; // Código de la lista de precio
  }