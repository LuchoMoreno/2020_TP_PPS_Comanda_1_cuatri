import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { RealizarPedidoPage } from './realizar-pedido.page';

const routes: Routes = [
  {
    path: '',
    component: RealizarPedidoPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RealizarPedidoPageRoutingModule {}
