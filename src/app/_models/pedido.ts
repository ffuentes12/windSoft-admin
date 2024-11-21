export interface Pedido {
    numPedido: string;
    codPedido?: string;
    userPedido?: string;
    fechaPedido: Date;
    totalNeto: number;
    iva: number;
    totalBruto: number;
    tipoDocumento: string;
    formaPago: string;
    observacion?: string;
    rut: string;
    nombreContacto: string;
    telefonoContacto: string;
    correoContacto: string;
    razonSocial: string;
    giro?: string;
    facturacion: Factura;
    despacho: Despacho;
    detalle: Detalle[];
    listaPrecio: number;
    envioPedido: boolean;
    status: number;
    eventos: Evento[];
    rutCli?: string;
    cenCos?: string;
    direcc?: string;
  }
  
  export interface Factura {
    direccion: string;
    comuna: string;
    ciudad: string;
    region: string;
  }
  
  export interface Despacho {
    direccion: string;
    comuna: string;
    ciudad: string;
    region: string;
  }
  
  export interface Detalle {
    codPro: string;
    cantidad: number;
    neto: number;
    iva: number;
    bruto: any;
    total: number;
    desPro: string;
    desRub: string;
    precio: string;
    subEmbalaje: any;
    embalaje: any;
    codSap: string;
    stocks: string;
    codLin?: string;
    desLin: string;
    codSec: string;
    desSec: string;
    codRub: string;
    peso: string;
    uniPeso: string;
    pesoEmb: string;
    uniPesoEmb: string;
    volumenEmb: string;
    uniVolumenEmb: string;
    precios: Precio[];
    qty: number;
    listaFotosUri: FotosUri[];
  }
  
  export interface Precio {
    codPro?: string;
    preLis?: number;
    codLve: string;
    codLpr: string;
    multip?: string;
    default?: boolean;
  }
  
  export interface Evento {
    nombre: string;
    fechaEvento?: string;
    ocurrido: boolean;
    icono?: string;
    visible?: boolean;
    observacionEvento?: string;
  }
  
  export interface FotosUri {
    uri: string;
  }
  