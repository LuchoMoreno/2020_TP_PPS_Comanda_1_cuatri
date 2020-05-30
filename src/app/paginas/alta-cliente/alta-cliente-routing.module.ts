import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AltaClientePage } from './alta-cliente.page';

const routes: Routes = [
  {
    path: '',
    component: AltaClientePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AltaClientePageRoutingModule {}
