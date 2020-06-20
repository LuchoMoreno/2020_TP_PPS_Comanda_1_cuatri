import { Component } from '@angular/core';


// IMPORTO EL ROUTER COMO ULTIMO PASO.
import { Router } from "@angular/router";
import { MenuController, LoadingController } from '@ionic/angular';
import { async } from '@angular/core/testing';
import {AngularFirestore} from "@angular/fire/firestore";
import { DatabaseService } from '../servicios/database.service';
import { AuthService } from '../servicios/auth.service';

// BARCODE SCANNER:
import { BarcodeScanner } from '@ionic-native/barcode-scanner/ngx';
import { ComplementosService } from '../servicios/complementos.service';


@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  perfilUsuario : any;
  coleccionRef ;
  tieneCorreo : string; // Comprobamos si tiene correo el usuario
 
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
    public complemento: ComplementosService,

    private auth : AuthService) {  }

    // Informacion de la lista de espera
  usuarioMesa = {
    mesa : "",
    estadoMesa : "",
    nombreUsuario: "",
    perfilUsuario : "",
    consulta: "noRealizo"
  }

  // Datos del anonimo
  anonimoNombre;
  anonimoFoto;
  usuarioAnonimo : any ;
  
  // Se obtiene el correo del cliente
  correoCliente ;

  // Se obtiene la info de la persona que ingreso
  infoUsuario : any;

  // Correo del usuario que ingreso
  correoUsuario : string;

  // Mensaje avisando al cliente  su asignacion de mesa
  informarEstadoMesa ={
    mesa: "",
    seAsignoMesa : "no",
  };

  // Variable que nos mostrara los productos una vez escaneado el codigo qr
  mostrarProductos : boolean = false;

  // Lista de los productos que se mostraran
  listaProductos = [];

  ngOnInit() {

    this.complemento.presentLoading();

    this.tieneCorreo  = localStorage.getItem('tieneCorreo');

    if(this.tieneCorreo == 'conCorreo') // Si ingreso con correo, comprobara el perfil de la base de datos
    {
      
       this.correoUsuario = localStorage.getItem('correoUsuario'); // Obtenemos el correo del usuario que ingreso 
       //this.perfilUsuario = this.bd.obtenerUsuariosBD('usuarios',auxCorreoUsuario); // Lo que obtenemos aca es el perfil del usuario 
       //console.log(this.perfilUsuario);
       this.firestore.collection('usuarios').get().subscribe((querySnapShot) => {

        querySnapShot.forEach(datos => {
  
          if(datos.data().correo == this.correoUsuario  )
          {
            this.perfilUsuario = datos.data().perfil;
            this.infoUsuario = datos.data();
            
            if(this.perfilUsuario == 'Dueño' || this.perfilUsuario == 'Supervisor')
            {
              // Voy a obtener la colección de usuarios y la guardo en FB.
            let fb = this.firestore.collection('usuarios');
              
      
            // Me voy a suscribir a la colección, y si el usuario está "ESPERANDO", se va a guardar en una lista de usuarios.
            fb.valueChanges().subscribe(datos =>{       // <-- MUESTRA CAMBIOS HECHOS EN LA BASE DE DATOS.
              
              this.listaUsuarios = [];
      
              datos.forEach( (dato:any) =>{
      
                if(dato.estado == 'esperando') // Verifico que el estado sea esperando.
                {
                  this.listaUsuarios.push(dato);      // <--- LISTA DE USUARIOS ESPERANDO
                }
                
               });
      
              })
            }

            else if (this.perfilUsuario == 'Mozo')
            {
              // ** verificamos que al mozo le carguen las consultas
              let fb = this.firestore.collection('listaEspera');
  
              // Me voy a suscribir a la colección, y si el usuario está "ESPERANDO", se va a guardar en una lista de usuarios.
              fb.valueChanges().subscribe(datos =>{       // <-- MUESTRA CAMBIOS HECHOS EN LA BASE DE DATOS.
                
                this.listaEspera = [];
        
                datos.forEach( (dato:any) =>{
        
                  if(dato.consulta == 'realizoConsulta') // Verifico que el estado sea esperando.
                  {
                    this.listaEspera.push(dato);      // <--- LISTA DE USUARIOS.
                  }
                  
                });
        
                 })
            }

      
            // Si el perfil es metre le cargara la lista de espera
            else if (this.perfilUsuario == 'Metre')
            {
              this.infoUsuario = datos.data();
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
            //Si el perfil del usuario que ingreso es un cliente, comprobara el estado de lista de espera
            else if (this.perfilUsuario == 'Cliente')
            {
              // Obtenemos el correo del usuario que 
              this.correoCliente = this.correoUsuario ;
              let fb = this.firestore.collection('listaEspera');
          
              fb.valueChanges().subscribe(datos =>{       // <-- MUESTRA CAMBIOS HECHOS EN LA BASE DE DATOS.
              
              this.listaEspera = [];
      
              datos.forEach( (datoCl:any) =>{
                
                // Si el estado de la mesa esta asignada y coincide la informacion del usuario que inicio sesion, se guardara en un json el numero de mesa que se le asigno uy una bandera
                if(datoCl.estadoMesa == 'mesaAsignada' && datoCl.nombreUsuario == this.infoUsuario.nombre) 
                {
                  this.informarEstadoMesa.mesa = datoCl.mesa;
                  this.informarEstadoMesa.seAsignoMesa = "si";
                }
                
                });
      
               })
              
            }
            // SI EL PERFIL DE USUARIO ES UN MOZO
          
          
          }
        })
  
      })

    }

    else // Si no ingreso con correo, automaticamente sabe que es un usuario anonimo
    {
      
      this.nombreAnonimo = localStorage.getItem('nombreAnonimo'); //***** VALIDAR EL NOMBRE TAMBIEN PORQUE SE VA ROMPER TODO */

    }

    this.cargarProductos(); // Probamos a ver si funciona

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

  // PARA EL DUEÑO O SUPERVISOR -> aceptara o rechazara al cliente se le carga el estado del boton y los dtos del usuario
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

  // PARA EL ANONIMO ->Recorre la coleccion de usuarios de la bd verificando su nombre
  listaEsperaQRAnonimo()
  {
    let auxMesa;

    this.barcodeScanner.scan().then(barcodeData => {

    auxMesa = JSON.parse(barcodeData.text);

    this.firestore.collection('usuarios').get().subscribe((querySnapShot) => {
      querySnapShot.forEach((doc) => {

        if(doc.data().nombre == this.nombreAnonimo)
        {
          if(auxMesa == 101010)
          {
                this.usuarioMesa.nombreUsuario = doc.data().nombre;
                this.usuarioMesa.estadoMesa = "enEspera";
                this.usuarioMesa.perfilUsuario = doc.data().perfil;
                this.bd.crear('listaEspera', this.usuarioMesa);
          }
          
        }

          this.listaEspera = []; // esto pone la lista vacía para que quede facherisima.

      })

    })


     }).catch(err => {
         console.log('Error', err);
     });
     
  }

  // PARA EL CLIENTE -> Recorre la coleccion de usuarios de la bd verificando el correo del cliente y no su nombre
  listaEsperaQRCliente()
  {
    let auxMesa;

    this.barcodeScanner.scan().then(barcodeData => {

    auxMesa = JSON.parse(barcodeData.text);

    this.firestore.collection('usuarios').get().subscribe((querySnapShot) => {
      querySnapShot.forEach((doc) => {

        if(doc.data().correo == this.correoCliente)
        {
          if(auxMesa == 101010)
          {
                this.usuarioMesa.nombreUsuario = doc.data().nombre;
                this.usuarioMesa.estadoMesa = "enEspera";
                this.usuarioMesa.perfilUsuario = doc.data().perfil;
                this.bd.crear('listaEspera', this.usuarioMesa);
          }
          // Tendria que poner una validacion que compruebe que la  mesa esta vacia, ocupada, desocupada
          
        }

          this.listaEspera = []; // esto pone la lista vacía para que quede facherisima.

      })

    })

     }).catch(err => {
         console.log('Error', err);
     });
     
  }

 // PARA TODOS -> Cerrara sesion, redireccionara a login y se vaciara el correoUsuario
  cerrarSesion()
  {
    this.correoUsuario  = "";
    this.router.navigate(['/login']);
  }

   // PARA EL METRE -> cuando se seleccione un usuario en espera, se redireccionara a la pagina de  listado-mesas y se guardara en el local storage la info del usuario seleccionado
  comprobarMesas(mesa)
  {
    localStorage.setItem('usuarioSelMesa',JSON.stringify(mesa));
    this.router.navigate(['/listado-mesas']);
  }

  // PARA CLIENTES Y ANONIMOS -> El usuario al escanear el codigo qr de la mesa podra ver los productos
  qrMesa()
  {
    let auxMesa;

    this.barcodeScanner.scan().then(barcodeData => {

    auxMesa = JSON.parse(barcodeData.text);

    let auxMesaString = auxMesa.toString();
    this.firestore.collection('listaMesas').get().subscribe((querySnapShot) => {
      querySnapShot.forEach((doc) => {

        if(doc.data().numero == auxMesaString) //Recorremos las mesas y comprobamos que coincida
        {
          this.mostrarProductos = true;
        }

      })

    })

     }).catch(err => {
         console.log('Error', err);
     });
  }

  // PARA LOS CLIENTES Y ANONIMOS -> Cargara un listado completo de los productos
  cargarProductos()
  {
    let fb = this.firestore.collection('productos');
              
    fb.valueChanges().subscribe(datos =>{       // <-- MUESTRA CAMBIOS HECHOS EN LA BASE DE DATOS.
      
      this.listaProductos = [];

      datos.forEach( (dato:any) =>{

     this.listaProductos.push(dato);      // <--- LISTA DE USUARIOS.
        
      });

    })
  }

  // CLIENTE O ANONIMO -> Se realiza una consulta al mozo (no se cargara)
  consultarMozo(numeroMesa)
  {
    let auxConsulta ;

    this.firestore.collection('listaEspera').get().subscribe((querySnapShot) => {
      
      querySnapShot.forEach(dato => {

        if(dato.data().mesa == numeroMesa)
        {
          auxConsulta = dato.data();
          auxConsulta.consulta = "realizoConsulta";
          this.bd.actualizar('listaEspera',auxConsulta,dato.id);
        }

      })
    
    });
      
  }

  


}
