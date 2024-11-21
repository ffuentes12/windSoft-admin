export interface ResumenVentas {
    mesActual: MesVentas;
    mesAnterior: MesVentas;
    cambiosPorcentuales: CambiosPorcentuales;
}

export interface MesVentas {
    totalVentas: number;
    cantidadVentas: number;
    ticketPromedio: number;
    clientesActivos: number;
}

export interface CambiosPorcentuales {
    totalVentas: number;
    cantidadVentas: number;
    ticketPromedio: number;
    clientesActivos: number;
}

export interface ClientePareto {
    _id: string;
    totalVentasCliente: number;
    razonSocial: string;
}

export interface ClientesParetoData {
    totalVentas: number;
    limite80: number;
    clientes80_20: ClientePareto[];
}


export interface ProductoPareto {
    _id: string;
    totalVentasProducto: number;
    totalCantidadVendida: number;
    nombreProducto: string;
    porcentajeVentas: number;
    imagenProducto?: string; 
    color?: string;
  }
  
  export interface ProductosParetoData {
    totalVentas: number;
    limite80: number;
    productos80_20: ProductoPareto[];
  }