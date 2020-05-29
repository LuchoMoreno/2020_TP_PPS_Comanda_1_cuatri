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
    this.dni = this.complementos.escanearDni();
  }


}
