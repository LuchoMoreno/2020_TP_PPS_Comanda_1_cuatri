import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AltaSupervisorPage } from './alta-supervisor.page';

const routes: Routes = [
  {
    path: '',
    component: AltaSupervisorPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AltaSupervisorPageRoutingModule {}
