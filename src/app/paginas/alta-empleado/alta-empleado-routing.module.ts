import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AltaEmpleadoPage } from './alta-empleado.page';

const routes: Routes = [
  {
    path: '',
    component: AltaEmpleadoPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AltaEmpleadoPageRoutingModule {}
