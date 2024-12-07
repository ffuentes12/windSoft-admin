import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Storage } from '@ionic/storage-angular';
import { Cliente } from 'src/app/_models/cliente';
@Injectable({
  providedIn: 'root',
})
export class ClienteActivoService {
  private clienteActivoSubject = new BehaviorSubject<Cliente | null>(null);
  clienteActivo$ = this.clienteActivoSubject.asObservable();
  private readonly storageKey = 'clienteActivo';

  constructor(private storage: Storage) {
      this.initStorage();
  }

  private async initStorage() {
      await this.storage.create(); // Asegura que el almacenamiento esté inicializado
      const cliente = await this.storage.get(this.storageKey);
      if (cliente) {
          this.clienteActivoSubject.next(cliente); // Sincroniza el cliente activo
      }
  }

  async setClienteActivo(cliente: Cliente) {
      this.clienteActivoSubject.next(cliente);
      await this.storage.set(this.storageKey, cliente);
  }

  getClienteActivo(): Cliente | null {
      return this.clienteActivoSubject.value;
  }

  async clearClienteActivo() {
      this.clienteActivoSubject.next(null);
      await this.storage.remove(this.storageKey);
  }
}
