import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage-angular';

@Injectable({
  providedIn: 'root',
})
export class CarritoService {
  private readonly storageKey = 'carritos';

  constructor(private storage: Storage) {
    this.initStorage();
  }

  private async initStorage() {
    await this.storage.create();
    const carritos = await this.storage.get(this.storageKey);
    if (!carritos) {
      await this.storage.set(this.storageKey, {}); // Inicializa con un objeto vacío
    }
  }

  private generarClave(rutcli: string, cencos: string): string {
    return `${rutcli}-${cencos}`;
  }

  async getCarrito(rutcli: string, cencos: string): Promise<any[]> {
    const carritos = (await this.storage.get(this.storageKey)) || {};
    const clave = this.generarClave(rutcli, cencos);
    return carritos[clave] || [];
  }

  async setCarrito(rutcli: string, cencos: string, carrito: any[]) {
    const carritos = (await this.storage.get(this.storageKey)) || {};
    const clave = this.generarClave(rutcli, cencos);
    carritos[clave] = carrito;
    await this.storage.set(this.storageKey, carritos);
  }

  async eliminarCarrito(rutcli: string, cencos: string) {
    const carritos = (await this.storage.get(this.storageKey)) || {};
    const clave = this.generarClave(rutcli, cencos);
    delete carritos[clave];
    await this.storage.set(this.storageKey, carritos);
  }

  
}
