import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PedidoComponent } from './pedido.component';

 
@NgModule({
  imports: [RouterModule.forChild([
		{ path: '', component: PedidoComponent }
	])],
  exports: [RouterModule]
})
export class PedidoRoutingModule { }

 