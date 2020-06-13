import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ListadoMesasPageRoutingModule } from './listado-mesas-routing.module';

import { ListadoMesasPage } from './listado-mesas.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ListadoMesasPageRoutingModule
  ],
  declarations: [ListadoMesasPage]
})
export class ListadoMesasPageModule {}
