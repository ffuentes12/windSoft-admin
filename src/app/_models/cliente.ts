export interface Cliente {
    rutcli: string;
    digcli: string;
    razons: string;
    emails: string;
    fono: string;
    totalCarritos: number;
    id_cliente_sap: string;
    sucursales: Sucursal[];
    ultimaActualizacionOff: Date;
    lista_precio: Precio[];
    negocio: string;
    direcciones: Direccion[];
}
export interface Direccion {
    direcc: string;
    coddir: string;
}

export interface Precio {
    codlve: string;
    codlpr: string;
    prelis: string;
    multip?: string;
    default?: boolean;
}

export interface Sucursal {
    descco: string;
    cencos: string;
    direcc: string;
    codcom: string;
    codciu: string;
    codreg: string;
    contac: string;
    emails: string;
    pedido: Pedido;
    aperDetalle: boolean;
    isSelected: boolean;
}

export interface Pedido {
    num_pedido: string;
    cod_pedido: string;
    userpedido: string;
    fecha_pedido: Date;
    total_neto: number;
    iva: number;
    total_bruto: number;
    tipo_documento: string;
    forma_pago: string;
    observacion: string | null;
    rut: string;
    nombre_contacto: string;
    telefono_contacto: string;
    correo_contacto: string;
    razon_social: string;
    giro: string | null;
    facturacion: Facturacion;
    despacho: Despacho;
    detalle: Detalle[];
    lista_precio: number;
    envioPedido: boolean;
    status: number;
    eventos: Evento[];
    rutcli?: string;
    cencos?: string;
    direcc?: string;
    cordinate: any;
}
export interface Evento {
    nombre: string;
    fecha_evento: string;
    ocurrido: boolean;
    icono: String;
    observacionEvento: string;
    visible?: boolean;
}

export interface Detalle {
    codpro: string;
    cantidad: number;
    neto: number;
    iva: number;
    bruto: string | number;
    total: number;
    despro: string;
    desrub: string;
    precio: string;
    sub_embalaje: string | number;
    embalaje: string | number;
    codsap: string;
    stocks: string;
    codlin: string;
    deslin: string;
    codsec: string;
    dessec: string;
    codrub: string;
    peso: string;
    uni_peso: string;
    peso_emb: string;
    uni_peso_emb: string;
    volumen_emb: string;
    uni_volumen_emb: string;
    ultimaActualizacionOff: Date;
    precios: Precio[];
    lista_precio: Precio[];
    speedDialModel: any;
    showZoomIcon: boolean;
    qty: number;
    precioFinal: number;
    precioDescuento: number;
    lista_fotos_uri: any[];
}

export interface Despacho {
    direccion: string;
    comuna: string;
    ciudad: string;
    region: string;
}

export interface Facturacion {
    direccion: string;
    comuna: string;
    ciudad: string;
    region: string;
}
