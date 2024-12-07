export interface User {
    codusu: string;
    rutusu: string;
    nombre: string;
    apepat: string;
    fono01: string;
    email1: string;
    token: string;
    ultimaActualizacionOff?: Date;
    listPerfil: Perfil[];
    error?: string;
    upass?: string;
}

export interface Perfil {
    codder: string;
    system: string;
    glosas: string;
}

export interface LoginRequest {
    userid: string;
    pass: string;
  }
