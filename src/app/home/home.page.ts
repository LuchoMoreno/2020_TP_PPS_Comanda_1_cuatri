import { Component } from '@angular/core';


// IMPORTO EL ROUTER COMO ULTIMO PASO.
import { Router } from "@angular/router";
import { MenuController } from '@ionic/angular';
import { async } from '@angular/core/testing';
import {AngularFirestore} from "@angular/fire/firestore";
import { DatabaseService } from '../servicios/database.service';
import { AuthService } from '../servicios/auth.service';




@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  perfilUsuario : string;
  coleccionRef ;
 // usuarios;
  listaUsuarios = [];

  constructor(private router : Router,
    private menu: MenuController ,
    private firestore : AngularFirestore,
    private bd : DatabaseService,
    private auth : AuthService) {  }

  


  ngOnInit() {

    let auxUsuario = JSON.parse(localStorage.getItem("usuario"));
    this.perfilUsuario = auxUsuario.perfil;
    //console.log(this.perfilUsuario);

    let fb = this.firestore.collection('usuarios');
   
    fb.valueChanges().subscribe(datos =>{
      this.listaUsuarios = [];
      datos.forEach( (dato:any) =>{

        if(dato.estado == 'esperando')
        {

          this.listaUsuarios.push(dato);
        }
       
      });

    })


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


  /*
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
  }*/


  organizarUsuario(usuario,estado){

    let indice = this.listaUsuarios.indexOf(usuario); // Encontrar el indice que quiero borrar
    this.listaUsuarios.splice(indice,1); // Borrar

    this.firestore.collection('usuarios').get().subscribe((querySnapShot) => {
      querySnapShot.forEach((doc) => {

        
       if(doc.data().correo == usuario.correo)
       {
         if(estado == "rechazado")
         {
          usuario.estado = estado;
          this.bd.actualizar('usuarios',usuario,doc.id);
         }
         else{
          usuario.estado = estado;
          this.bd.actualizar('usuarios',usuario,doc.id);
          this.auth.registrarUsuario(usuario.correo,usuario.contrasenia);
          this.auth.mandarCorreoElectronico(usuario.correo);
         }
        
         this.listaUsuarios = [];
       }

      })
    })
    
  }


  
  
}
