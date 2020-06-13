import { Component, OnInit } from '@angular/core';
import {AngularFirestore} from "@angular/fire/firestore";

@Component({
  selector: 'app-listado-mesas',
  templateUrl: './listado-mesas.page.html',
  styleUrls: ['./listado-mesas.page.scss'],
})
export class ListadoMesasPage implements OnInit {

  // Variable lista mesas
  listadoMesas = [];

  constructor(    private firestore : AngularFirestore,
    ) { }



  ngOnInit() {
    let fb = this.firestore.collection('listaMesas');
              
      
    // Me voy a suscribir a la colección, y si el usuario está "ESPERANDO", se va a guardar en una lista de usuarios.
    fb.valueChanges().subscribe(datos =>{       // <-- MUESTRA CAMBIOS HECHOS EN LA BASE DE DATOS.
      
      this.listadoMesas = [];

      datos.forEach( (dato:any) =>{

        if(dato.numero == 'desocupada') // Verifico que el estado sea esperando.
        {
          this.listadoMesas.push(dato);      // <--- LISTA DE USUARIOS.
        }
        
      });

    })
  }

}
