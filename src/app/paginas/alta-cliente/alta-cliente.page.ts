import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-alta-cliente',
  templateUrl: './alta-cliente.page.html',
  styleUrls: ['./alta-cliente.page.scss'],
})
export class AltaClientePage implements OnInit {

  listaTipos = [ 
    { tipo : "Usuario" },
    { tipo : "Anonimo" }
  ]

  constructor() { }

  ngOnInit() {
  
  }

  pickerUser(pickedName){
    this.listaTipos.forEach((user) =>{
      if(user.tipo == pickedName )
      {

      }
    })
  }

}
