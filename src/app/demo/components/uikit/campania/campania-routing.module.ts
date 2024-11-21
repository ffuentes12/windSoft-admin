import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CampaniaComponent } from './campania.component';

@NgModule({
	imports: [RouterModule.forChild([
		{ path: '', component: CampaniaComponent }
	])],
	exports: [RouterModule]
})
export class CampaniaRoutingModule { }
