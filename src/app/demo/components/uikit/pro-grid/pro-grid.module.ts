import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { DataViewModule } from 'primeng/dataview';
import { PickListModule } from 'primeng/picklist';
import { OrderListModule } from 'primeng/orderlist';
import { InputTextModule } from 'primeng/inputtext';
import { DropdownModule } from 'primeng/dropdown';
import { RatingModule } from 'primeng/rating';
import { ButtonModule } from 'primeng/button';
import { BadgeModule } from 'primeng/badge';
import { ProGridComponent } from './pro-grid.component';
import { ProGridRoutingModule } from './pro-grid-routing.module';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        ProGridRoutingModule,
        DataViewModule,
        PickListModule,
        OrderListModule,
        InputTextModule,
        DropdownModule,
        RatingModule,
        ButtonModule,
        BadgeModule,
    ],
    declarations: [ProGridComponent],
})
export class ProGridModule {}
