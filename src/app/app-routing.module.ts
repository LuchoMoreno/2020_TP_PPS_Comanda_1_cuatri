import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'home', loadChildren: () => import('./home/home.module').then( m => m.HomePageModule)},
  {
    //Cambia el nombre de componentes por paginas
    path: 'login',
    loadChildren: () => import('./paginas/login/login.module').then( m => m.LoginPageModule)
  },
  {
    path: 'alta-supervisor',
    loadChildren: () => import('./paginas/alta-supervisor/alta-supervisor.module').then( m => m.AltaSupervisorPageModule)
  },  {
    path: 'alta-cliente',
    loadChildren: () => import('./paginas/alta-cliente/alta-cliente.module').then( m => m.AltaClientePageModule)
  },


];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
