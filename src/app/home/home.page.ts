import { Component } from '@angular/core';


// IMPORTO EL ROUTER COMO ULTIMO PASO.
import { Router } from "@angular/router";
import { MenuController } from '@ionic/angular';
import { async } from '@angular/core/testing';
import {AngularFirestore} from "@angular/fire/firestore";
import { DatabaseService } from '../servicios/database.service';
import { AuthService } from '../servicios/auth.service';

// Importamos el barcodeScanner
import { BarcodeScanner } from '@ionic-native/barcode-scanner/ngx';


@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  perfilUsuario : any;
  coleccionRef ;
  tieneCorreo : string;
 
  // Nombre del usuario anonimo que se va aguardar en la lista de espera.
  nombreAnonimo;

  // Lista de usuarios que se registran
  listaUsuarios = [];

  // Lista de usuarios en espera
  listaEspera = [];

  constructor(private router : Router,
    private barcodeScanner : BarcodeScanner,
    private menu: MenuController ,
    private firestore : AngularFirestore,
    private bd : DatabaseService,
    private auth : AuthService) {  }

    // Informacion de la lista de espera
  usuarioMesa = {
    mesa : "",
    estadoMesa : "",
    nombreUsuario: "",
    perfilUsuario : "",
  }

  anonimoNombre;
  anonimoFoto;
  usuarioAnonimo : any ;

  ngOnInit() {

    this.tieneCorreo  = localStorage.getItem('tieneCorreo');

    if(this.tieneCorreo == 'conCorreo') // Si ingreso con correo, comprobara el perfil de la base de datos
    {
      
       let auxCorreoUsuario = localStorage.getItem('correoUsuario'); // Obtenemos el correo del usuario que ingreso 
       //this.perfilUsuario = this.bd.obtenerUsuariosBD('usuarios',auxCorreoUsuario); // Lo que obtenemos aca es el perfil del usuario 
       //console.log(this.perfilUsuario);
       this.firestore.collection('usuarios').get().subscribe((querySnapShot) => {

        querySnapShot.forEach(datos => {
  
          if(datos.data().correo == auxCorreoUsuario )
          {
            this.perfilUsuario = datos.data().perfil;

            if(this.perfilUsuario == 'Dueño' || this.perfilUsuario == 'Supervisor')
            {
              // Voy a obtener la colección de usuarios y la guardo en FB.
              console.log("Estoy aca dentro");
            let fb = this.firestore.collection('usuarios');
              
      
            // Me voy a suscribir a la colección, y si el usuario está "ESPERANDO", se va a guardar en una lista de usuarios.
            fb.valueChanges().subscribe(datos =>{       // <-- MUESTRA CAMBIOS HECHOS EN LA BASE DE DATOS.
              
              this.listaUsuarios = [];
      
              datos.forEach( (dato:any) =>{
      
                if(dato.estado == 'esperando') // Verifico que el estado sea esperando.
                {
                  this.listaUsuarios.push(dato);      // <--- LISTA DE USUARIOS.
                }
                
              });
      
            })
            }
      
            // Si el perfil es metre le cargara la lista de espera
            else if (this.perfilUsuario == 'Metre')
            {
              let fb = this.firestore.collection('listaEspera');

              
      
            // Me voy a suscribir a la colección, y si el usuario está "ESPERANDO", se va a guardar en una lista de usuarios.
            fb.valueChanges().subscribe(datos =>{       // <-- MUESTRA CAMBIOS HECHOS EN LA BASE DE DATOS.
              
              this.listaEspera = [];
      
              datos.forEach( (dato:any) =>{
      
                if(dato.estadoMesa == 'enEspera') // Verifico que el estado sea esperando.
                {
                  this.listaEspera.push(dato);      // <--- LISTA DE USUARIOS.
                }
                
              });
      
               })
            
            }
          
          }
        })
  
      })


    

    }
    else // Si no ingreso con correo, automaticamente sabe que es un usuario anonimo
    {
      
      this.nombreAnonimo = localStorage.getItem('nombreAnonimo');

    }

  

    // Con esto obtengo el usuario del LocalStorage (el cual yo entré)
    // Voy a asignar el perfil del usuario para luego mostrarlo en el HTML.
    /*let auxUsuario = JSON.parse(localStorage.getItem("usuario"));

    
    this.perfilUsuario = auxUsuario.perfil;


    if(this.perfilUsuario = 'Anonimo')
    {
      this.anonimoFoto = localStorage.getItem('anonimoFoto');
      this.anonimoNombre = localStorage.getItem('anonimoNombre');
    }

    else if(this.perfilUsuario == 'Metre')
    {

      
      let fb = this.firestore.collection('listaEspera');
        

      // Me voy a suscribir a la colección, y si el usuario está "ESPERANDO", se va a guardar en una lista de usuarios.
      fb.valueChanges().subscribe(datos =>{       // <-- MUESTRA CAMBIOS HECHOS EN LA BASE DE DATOS.
        
        this.listaUsuarios = [];

        datos.forEach( (dato:any) =>{

          if(dato.estadoMesa == 'enEspera') // Verifico que el estado sea esperando.
          {
            this.listaUsuarios.push(dato);      // <--- LISTA DE USUARIOS.
          }
          
        });

    })
      
    }
    else
    {
      // Voy a obtener la colección de usuarios y la guardo en FB.
      let fb = this.firestore.collection('usuarios');
        

      // Me voy a suscribir a la colección, y si el usuario está "ESPERANDO", se va a guardar en una lista de usuarios.
      fb.valueChanges().subscribe(datos =>{       // <-- MUESTRA CAMBIOS HECHOS EN LA BASE DE DATOS.
        
        this.listaUsuarios = [];

        datos.forEach( (dato:any) =>{

          if(dato.estado == 'esperando') // Verifico que el estado sea esperando.
          {
            this.listaUsuarios.push(dato);      // <--- LISTA DE USUARIOS.
          }
          
        });

 })
    }
   
*/

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


    let indice = this.listaUsuarios.indexOf(usuario); // Encontrar el indice del usuario.

    this.listaUsuarios.splice(indice,1); // Borrar exclusivamente ese índice.
    // Esto borra de la LISTA, no de la base de datos.


    // A partir de acá empiezo a realizar cambios en la base de datos.

    // Obtengo la coleción y me suscribo a ella.
    this.firestore.collection('usuarios').get().subscribe((querySnapShot) => {
      querySnapShot.forEach((doc) => {

      
        // Correo de la BD == Correo de la lista.
       if(doc.data().correo == usuario.correo)
       {

        // Si lo rechaza.
         if(estado == "rechazado")
         {
          usuario.estado = estado;                        // El cliente pasa a estar rechazado.
          this.bd.actualizar('usuarios',usuario,doc.id);  // Actualiza el estado del cliente.
         }

         else{    // Estado aceptado.


          if (doc.data().perfil == "Cliente")
          {
          usuario.estado = estado;                                          // El cliente pasa a estar aceptado.
          this.bd.actualizar('usuarios',usuario,doc.id);                    // Actualiza el estado del cliente.               
          this.auth.registrarUsuario(usuario.correo,usuario.contrasenia);   // Registra el usuario en la BD. Asi puede ingresar al login. Con el estado aceptado.
          this.auth.mandarCorreoElectronico(usuario.correo);                // Le envia un correo electrónico informado lo sucedido.
          }

          else
          {
            usuario.estado = estado;                                          // El cliente pasa a estar aceptado.
            this.bd.actualizar('usuarios',usuario,doc.id);                    // Actualiza el estado del cliente.              
          }

         }
        
         this.listaUsuarios = []; // esto pone la lista vacía para que quede facherisima.
       }

      })
    })
    
  }

  listaDeEspera()
  {
    let auxMesa;

    this.barcodeScanner.scan().then(barcodeData => {

      auxMesa = JSON.parse(barcodeData.text);

        this.firestore.collection('usuarios').get().subscribe((querySnapShot) => {
          querySnapShot.forEach((doc) => {
    
          
            // Correo de la BD == Correo de la lista.
            if(doc.data().usuario == this.nombreAnonimo)
            {
     
            //this.usuarioAnonimo = doc.data();
            //this.usuarioAnonimo.estadoMesa = auxMesa
            alert("estoy acá");
            this.usuarioMesa.nombreUsuario = doc.data().nombre;
            this.usuarioMesa.estadoMesa = auxMesa;
            this.usuarioMesa.perfilUsuario = doc.data().perfil;
            this.bd.crear('listaEspera', this.usuarioMesa);
     
            }
             
              this.listaEspera = []; // esto pone la lista vacía para que quede facherisima.
    
          })
        })
        

      })
      
  
  }

  
  
}
