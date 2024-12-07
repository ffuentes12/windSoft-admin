export interface Categoria {
    cod_categoria: string;
    categoria: string;
    sub_categoria: SubCategoria;
    ultimaActualizacionOff: Date;
}

export interface SubCategoria {
    cod_categoria: string;
    categoria: string;
    subsub_categoria: SubSubCategoria[];
}

export interface SubCategoria {
    cod_categoria: string;
    categoria: string;
    subsub_categoria: SubSubCategoria[];
}

export interface SubSubCategoria {
    cod_categoria: string;
    categoria: string;
}

export type CategoriasResponse = Categoria[];