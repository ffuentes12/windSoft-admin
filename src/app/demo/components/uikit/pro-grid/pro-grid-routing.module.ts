import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router'; 
import { ProGridComponent } from './pro-grid.component';

@NgModule({
	imports: [RouterModule.forChild([
		{ path: '', component: ProGridComponent }
	])],
	exports: [RouterModule]
})
export class ProGridRoutingModule { }
