import { Component } from '@angular/core';


// IMPORTO EL ROUTER COMO ULTIMO PASO.
import { Router } from "@angular/router";
import { MenuController } from '@ionic/angular';
import { async } from '@angular/core/testing';
import {AngularFirestore} from "@angular/fire/firestore";
import { DatabaseService } from '../servicios/database.service';




@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  perfilUsuario : string;
  coleccionRef ;
  usuarios;
  listaUsuarios = [];

  constructor(private router : Router,
    private menu: MenuController ,
    private firestore : AngularFirestore,
    private bd : DatabaseService) {  }

  


  ngOnInit() {

    let auxUsuario = JSON.parse(localStorage.getItem("usuario"));
    this.perfilUsuario = auxUsuario.perfil;
    console.log(this.perfilUsuario);


    let fb = this.firestore.collection('usuarios');
    this.coleccionRef = fb.ref;
    console.log(this.coleccionRef);
    console.log(fb);

    fb.valueChanges().subscribe(datos =>{
      datos.forEach( (dato:any) =>{

        console.log(dato);
        console.log(dato.nombre);
        this.listaUsuarios.push(dato);
      });
    })

 
    /*this.usuarios.valueChanges().suscribe( data => {

      console.log(data);
      this.listaUsuarios = data;
    })*/
    

  }


  redireccionar(perfil)
  {
    switch(perfil)
    {
      case 'supervisor' :  
      this.router.navigate(['/alta-supervisor']);
        break;
      case 'empleado' : 
      this.router.navigate(['/alta-empleado']);
      break;
      case 'cliente' : 
      this.router.navigate(['/alta-cliente']);
      break;
      case 'producto' : 
      this.router.navigate(['/alta-producto']);
      break;
      case 'atras' : 
      this.router.navigate(['/login']);
      break;
    }
     
  }


  openFirst() {
    this.menu.enable(true, 'first');
    this.menu.open('first');
  }

  openEnd() {
    this.menu.open('end');
  }

  openCustom() {
    this.menu.enable(true, 'custom');
    this.menu.open('custom');
  }


  rechazarUsuario(){

    /*var modificar = this.bd.obtenerPorId('usuarios',id);
    modificar.subscribe( datos => {
      console.log(datos);
    })*/
    console.log(this.firestore.createId());

   /* this.bd.obtenerTodos('usuarios').subscribe(dato => {

      dato.forEach((response) => {

        let id : any  = response.payload.doc.data();
        id = response.payload.doc.id;

        
      
      })

    })*/

    
  }


  
  
}
