import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ImagenesRoutingModule } from './imagenes-routing.module';
import { ImagenesComponent } from './imagenes.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { CalendarModule } from 'primeng/calendar';
import { ChipsModule } from 'primeng/chips';
import { DropdownModule } from 'primeng/dropdown';
import { InputMaskModule } from 'primeng/inputmask';
import { InputNumberModule } from 'primeng/inputnumber';
import { RatingModule } from 'primeng/rating';
import { InputTextModule } from 'primeng/inputtext';
import { RadioButtonModule } from 'primeng/radiobutton';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { SliderModule } from 'primeng/slider';
import { ToggleButtonModule } from 'primeng/togglebutton';
import { MultiSelectModule } from 'primeng/multiselect';
import { CascadeSelectModule } from 'primeng/cascadeselect';
import { ColorPickerModule } from 'primeng/colorpicker';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import { InputGroupModule } from 'primeng/inputgroup';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { SelectButtonModule } from 'primeng/selectbutton';
import { ListboxModule } from 'primeng/listbox';
import { InputSwitchModule } from 'primeng/inputswitch';
import { KnobModule } from 'primeng/knob';
import { ChipModule } from 'primeng/chip';
import { TableModule } from 'primeng/table';

@NgModule({
    declarations: [ImagenesComponent],
    imports: [
        CommonModule,
        ReactiveFormsModule,
        ImagenesRoutingModule,
        CommonModule,
        FormsModule,
        AutoCompleteModule,
        CalendarModule,
        ChipsModule,
        DropdownModule,
        InputMaskModule,
        InputNumberModule,
        ColorPickerModule,
        CascadeSelectModule,
        MultiSelectModule,
        TableModule,
        ToggleButtonModule,
        SliderModule,
        InputTextareaModule,
        RadioButtonModule,
        InputTextModule,
        RatingModule,
        ChipModule,
        KnobModule,
        InputSwitchModule,
        ListboxModule,
        SelectButtonModule,
        CheckboxModule,
        ButtonModule,
        InputGroupModule,
        InputGroupAddonModule,
    ],
})
export class ImagenesModule {}
