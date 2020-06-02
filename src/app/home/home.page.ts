import { Component } from '@angular/core';


// IMPORTO EL ROUTER COMO ULTIMO PASO.
import { Router } from "@angular/router";
import { MenuController } from '@ionic/angular';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  perfilUsuario : string;

  constructor(private router : Router,
    private menu: MenuController ) {  }



  ngOnInit() {

    let auxUsuario = JSON.parse(localStorage.getItem("usuario"));
    console.log(auxUsuario);
  }


  redireccionPrueba(perfilUsuario)
  {
    if(perfilUsuario == 'supervisor' || perfilUsuario == 'duenio')
    {
      this.router.navigate(['/alta-supervisor']);
    }

  }


  
}
