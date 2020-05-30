import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-alta-cliente',
  templateUrl: './alta-cliente.page.html',
  styleUrls: ['./alta-cliente.page.scss'],
})
export class AltaClientePage implements OnInit {

  pickedName : string;

  listaPerfiles = [ 
    { perfil : "Cliente" },
    { perfil : "Anonimo" }
  ]

  constructor() { }

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

}
