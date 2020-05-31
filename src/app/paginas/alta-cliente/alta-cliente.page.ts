import { Component, OnInit } from '@angular/core';
// IMPORTO LA CAMARA 
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';

// IMPORTO SERVICIO
import { DatabaseService } from "../../servicios/database.service";

import { Validators, FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-alta-cliente',
  templateUrl: './alta-cliente.page.html',
  styleUrls: ['./alta-cliente.page.scss'],
})
export class AltaClientePage implements OnInit {

  pickedName : string;
  miFormulario : FormGroup;

  listaPerfiles = [ 
    { perfil : "Cliente" },
    { perfil : "Anonimo" }
  ]

  constructor(
    private camera : Camera,
    private bd : DatabaseService,
    private formBuilder: FormBuilder) {
      this.miFormulario = this.formBuilder.group({
        nombre: ['', [Validators.required, Validators.pattern('^[a-zA-Z]{3,10}$')]],
        apellido: ['', [Validators.required, Validators.pattern('^[a-zA-Z]{3,10}$')]],
        dni: ['', [Validators.required, Validators.pattern('^[0-9]{8}$')]],
     });
   }
   
  ngOnInit() {
  
    this.pickedName = "Cliente";

  }

  pickerUser(pickedName){
    this.listaPerfiles.forEach((usuario) =>{
      if(usuario.perfil == pickedName )
      {
        
      }
    })
  }

  registrarCliente()
  {

  }

  tomarFotografia()
  {

  }



}
