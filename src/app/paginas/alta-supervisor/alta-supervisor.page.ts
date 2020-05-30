import { Component, OnInit } from '@angular/core';
import { ComplementosService } from 'src/app/servicios/complementos.service';

@Component({
  selector: 'app-alta-supervisor',
  templateUrl: './alta-supervisor.page.html',
  styleUrls: ['./alta-supervisor.page.scss'],
})
export class AltaSupervisorPage implements OnInit {

  // Variables 
  nombre : string;
  apellido : string;
  dni : string ;
  cuil : string; 
  foto : string;
  
  constructor(public complementos  : ComplementosService) { }

  ngOnInit() {
  }

  escanearDni()
  {
    // Hay que validar que el dni ingresado 
    let dniNuevo = this.complementos.escanearDni();
    this.dni = dniNuevo;

    alert("COMPLEMENTO:" + this.complementos.escanearDni());
    alert("DNI IGUALADO:" + this.dni);
    alert("DNI NUEVO:" + dniNuevo);
  

  }


}
