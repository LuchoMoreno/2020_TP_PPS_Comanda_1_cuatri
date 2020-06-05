import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AltaEmpleadoPageRoutingModule } from './alta-empleado-routing.module';

import { AltaEmpleadoPage } from './alta-empleado.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ReactiveFormsModule,
    AltaEmpleadoPageRoutingModule
  ],
  declarations: [AltaEmpleadoPage]
})
export class AltaEmpleadoPageModule {}
