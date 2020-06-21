import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { RealizarPedidoPageRoutingModule } from './realizar-pedido-routing.module';

import { RealizarPedidoPage } from './realizar-pedido.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RealizarPedidoPageRoutingModule
  ],
  declarations: [RealizarPedidoPage]
})
export class RealizarPedidoPageModule {}
