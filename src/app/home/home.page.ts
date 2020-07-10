import { Component } from '@angular/core';

import { Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';



// IMPORTO EL ROUTER COMO ULTIMO PASO.
import { Router } from "@angular/router";
import { MenuController, LoadingController, AlertController } from '@ionic/angular';
import { async } from '@angular/core/testing';
import {AngularFirestore} from "@angular/fire/firestore";
import { DatabaseService } from '../servicios/database.service';
import { AuthService } from '../servicios/auth.service';

// BARCODE SCANNER:
import { BarcodeScanner } from '@ionic-native/barcode-scanner/ngx';
import { ComplementosService } from '../servicios/complementos.service';
import { flatten } from '@angular/compiler';
import { Camera,CameraOptions } from '@ionic-native/camera/ngx';
import {AngularFireStorage} from "@angular/fire/storage"

import * as firebase from 'firebase/app';


@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  splash = true;

  perfilUsuario : any;
  coleccionRef ;
  tieneCorreo : string; // Comprobamos si tiene correo el usuario
 
  // Nombre del usuario anonimo que se va aguardar en la lista de espera.
  nombreAnonimo = {
    nombre : '',
    foto : '',
    perfil : '',
  };

  // Lista de usuarios que se registran
  listaUsuarios = [];

  // Lista de usuarios en espera
  listaEspera = [];

  // Lista de pedidos
  listaPedidos = [];

  constructor(private router : Router,
    private barcodeScanner : BarcodeScanner,
    private menu: MenuController ,
    private firestore : AngularFirestore,
    private bd : DatabaseService,
    public complemento: ComplementosService,
    private camera : Camera,
    private auth : AuthService,
    private st : AngularFireStorage,
    public alertController: AlertController,
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar) { 
     }

    // Informacion de la lista de espera
  usuarioMesa = {
    mesa : "",
    estadoMesa : "",
    nombreUsuario: "",
    perfilUsuario : "",
    consulta: "noRealizo",
    consultaMozo : "",
    consultaDescripcion : "",
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

  // Lista de los pedidos cargados con su respectivo perfil
  listaPedidoCocinero=[];
  listaPedidoBartender = [];

  // Lista de pedidos finalizados
  listaPedidosFinalizados = [];

  //Contadores para las notificaciones
  //Para el mozo:
  contadorMozoConsulta = 0;
  contadorMozoPedidoFinalizado = 0;
  contadorMozoPedidoPendiente= 0;
  contadorMozoCuentaPagada = 0;

  // Lista las cuentas pagadas
  listaCuentasPagadas = [];


  // Contador para la encuesta. enc1010
  contadorInterno;
  pathImagenesEncuesta = [];

  ngOnInit() {

    //this.complemento.presentLoading();

    setTimeout(() => {
      this.splash = false;
    }, 4000);



    this.contadorInterno = -1; // enc1010 
    this.jsonEncuesta.fotos[0] = 'https://i.imgur.com/zH3i014.png';
    this.jsonEncuesta.fotos[1] = 'https://i.imgur.com/zH3i014.png';
    this.jsonEncuesta.fotos[2] = 'https://i.imgur.com/zH3i014.png';


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
                
                this.contadorMozoConsulta = this.listaEspera.length;

                 })

                 this.correoCliente = this.correoUsuario ;
                 let fb2 = this.firestore.collection('pedidos');
   
                 fb2.valueChanges().subscribe(datos =>{       // <-- MUESTRA CAMBIOS HECHOS EN LA BASE DE DATOS.
                 
                 this.listaPedidos = [];
                 this.listaPedidosFinalizados = [];
                 this.listaCuentasPagadas = [];
         
                   datos.forEach((dato:any) => {
   
                     if(dato.estadoPedido == 'enEspera'){
   
                       this.listaPedidos.push(dato);
   
                     }
                     else if(dato.estadoBartender == 'finalizado' && dato.estadoChef == 'finalizado' && dato.estadoPedido == 'enPreparacion') // Pedir bebida
                     {
                       this.listaPedidosFinalizados.push(dato);
                     }
                     else if(dato.estadoPedido == 'pagado')
                     {
                        this.listaCuentasPagadas.push(dato);
                     }
                   })

                   
                   this.contadorMozoPedidoPendiente = this.listaPedidos.length;
                   this.contadorMozoPedidoFinalizado = this.listaPedidosFinalizados.length;
                   this.contadorMozoCuentaPagada = this.listaCuentasPagadas.length;
                  })
                  
            }
            // SI EL PERFIL ES COCINERO
            else if (this.perfilUsuario == 'Cocinero')
            {
              this.infoUsuario = datos.data();
              let fb = this.firestore.collection('pedidos');

      
            // Me voy a suscribir a la colección, y si el usuario está "ESPERANDO", se va a guardar en una lista de usuarios.
            fb.valueChanges().subscribe(datos =>{       // <-- MUESTRA CAMBIOS HECHOS EN LA BASE DE DATOS.
              
              this.listaPedidoCocinero = [];
      
              datos.forEach( (dato:any) =>{
      
                if((dato.estadoChef == 'enProceso' || dato.estadoChef == 'enPreparacion') && (dato.estadoPedido=="pendiente" || dato.estadoPedido=="enPreparacion")) // Verifico que el estado sea esperando.
                {
                  this.listaPedidoCocinero.push(dato);      // <--- LISTA DE USUARIOS.
                }
                
              });
      
               })
            
            }

            else if (this.perfilUsuario == 'BarTender')
            {
              this.infoUsuario = datos.data();
              let fb = this.firestore.collection('pedidos');

      
            // Me voy a suscribir a la colección, y si el usuario está "ESPERANDO", se va a guardar en una lista de usuarios.
            fb.valueChanges().subscribe(datos =>{       // <-- MUESTRA CAMBIOS HECHOS EN LA BASE DE DATOS.
              
              this.listaPedidoBartender = [];
      
              datos.forEach( (dato:any) =>{
      
                if((dato.estadoBartender == 'enProceso' || dato.estadoBartender == 'enPreparacion') && (dato.estadoPedido=="pendiente" || dato.estadoPedido=="enPreparacion")) // Verifico que el estado sea esperando.
                {
                  this.listaPedidoBartender.push(dato);      // <--- LISTA DE USUARIOS.
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
                  console.log(datoCl.consultaMozo);
                  if(datoCl.consultaMozo != '')
                  {
                    console.log("estoy aca tambien");
                    this.listaEspera.push(datoCl);
                  }
                }
                
                });
      
               })

               let fb2 = this.firestore.collection('pedidos');
          
               fb2.valueChanges().subscribe(datos =>{       // <-- MUESTRA CAMBIOS HECHOS EN LA BASE DE DATOS.
               
       
               datos.forEach( (datoCl:any) =>{
                 
                 // Si el estado de la mesa esta asignada y coincide la informacion del usuario que inicio sesion, se guardara en un json el numero de mesa que se le asigno uy una bandera
                 if(datoCl.estadoPedido=="finalizado" && datoCl.mesa == this.informarEstadoMesa.mesa) 
                 {
                  this.presentAlert();
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
      
      // let variable = localStorage.getItem('nombreAnonimo'); 
      // this.nombreAnonimo = JSON.parse(variable);

      let variable = localStorage.getItem('nombreAnonimo');
      this.perfilUsuario = "Anonimo";

      this.firestore.collection('usuarios').get().subscribe((querySnapShot) => {
        querySnapShot.forEach((doc) => {
  
          // Correo de la BD == Correo de la lista.
         if(doc.data().nombre == variable && doc.data().perfil == this.perfilUsuario)
         {

          this.nombreAnonimo.nombre = doc.data().nombre;
          this.nombreAnonimo.foto = doc.data().foto;
          this.nombreAnonimo.perfil = doc.data().perfil;
         }
  
        })
      })
  



      let fb = this.firestore.collection('listaEspera');
          
      fb.valueChanges().subscribe(datos =>{       // <-- MUESTRA CAMBIOS HECHOS EN LA BASE DE DATOS.
      
      this.listaEspera = [];

      datos.forEach( (datoCl:any) =>{
        
        // Si el estado de la mesa esta asignada y coincide la informacion del usuario que inicio sesion, se guardara en un json el numero de mesa que se le asigno uy una bandera
        if(datoCl.estadoMesa == 'mesaAsignada' && datoCl.nombreUsuario == this.nombreAnonimo.nombre) 
        {
          this.informarEstadoMesa.mesa = datoCl.mesa;
          this.informarEstadoMesa.seAsignoMesa = "si";
          if(datoCl.consultaMozo != '')
          {
            this.listaEspera.push(datoCl);
          }
        }
        
        });

       })

       let fb2 = this.firestore.collection('pedidos');
          
       fb2.valueChanges().subscribe(datos =>{       // <-- MUESTRA CAMBIOS HECHOS EN LA BASE DE DATOS.
       

       datos.forEach( (datoCl:any) =>{
         
         // Si el estado de la mesa esta asignada y coincide la informacion del usuario que inicio sesion, se guardara en un json el numero de mesa que se le asigno uy una bandera
         if(datoCl.estadoPedido=="finalizado" && datoCl.mesa == this.informarEstadoMesa.mesa) 
         {
          this.presentAlert();
         }
         
         });

        })
    }

    this.cargarProductos(); // Probamos a ver si funciona

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
          this.listaUsuarios = [];
         }

         else{    // Estado aceptado.


          if (doc.data().perfil == "Cliente")
          {
          usuario.estado = estado;                                          // El cliente pasa a estar aceptado.
          this.bd.actualizar('usuarios',usuario,doc.id);                    // Actualiza el estado del cliente.               
          this.auth.registrarUsuario(usuario.correo,usuario.contrasenia);   // Registra el usuario en la BD. Asi puede ingresar al login. Con el estado aceptado.
          this.auth.mandarCorreoElectronico(usuario.correo);    
          this.listaUsuarios = [];            // Le envia un correo electrónico informado lo sucedido.
          }

          else
          {
            usuario.estado = estado;                                          // El cliente pasa a estar aceptado.
            this.bd.actualizar('usuarios',usuario,doc.id);    
            this.listaUsuarios = [];                // Actualiza el estado del cliente.              
          }

         }
        
         this.listaUsuarios = []; // esto pone la lista vacía para que quede facherisima.
       }

      })
    })

    
  
    
  }

/*
  // PARA EL CLIENTE -> Recorre la coleccion de usuarios de la bd verificando el correo del cliente y no su nombre
  listaEsperaQRCliente() // ESTO FUNCIONA PERFECTO
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
          else // PONER QR DE MESA 
          {
            this.firestore.collection('listaMesas').get().subscribe((qSnapSh => {
              qSnapSh.forEach((mesa) => {
                if(mesa.data().numero == auxMesa)
                {
                  this.complemento.presentToastConMensajeYColor(`La mesa se encuentra ${mesa.data().estado} por favor, solicite al metre para asignarle una mesa.`,'danger');
                }
              })
            }))
          }
          
        }

          this.listaEspera = []; // esto pone la lista vacía para que quede facherisima.

      })

    })

     }).catch(err => {
         console.log('Error', err);
     });
     
  }
*/

  // PARA EL CLIENTE -> Recorre la coleccion de usuarios de la bd verificando el correo del cliente y no su nombre
 
  listaEsperaQRCliente() // ESTO FUNCIONA PERFECTO
  {

    let auxiliar;
    this.barcodeScanner.scan().then(barcodeData => {

      //auxiliar = JSON.parse(barcodeData.text);
      auxiliar = barcodeData.text;

    
    this.firestore.collection('usuarios').get().subscribe((querySnapShot) => {
      querySnapShot.forEach((doc) => {

        if(doc.data().correo == this.correoCliente)
        {
          
          switch(auxiliar) // CAMBIAR ESTO SI NO FUNCIONA
          {
            case "enEspera":
              this.usuarioMesa.nombreUsuario = doc.data().nombre;
              this.usuarioMesa.estadoMesa = "enEspera";
              this.usuarioMesa.perfilUsuario = doc.data().perfil;
              this.bd.crear('listaEspera', this.usuarioMesa);
            break ;

            default:

              this.firestore.collection('listaMesas').get().subscribe((qSnapSh => {
                qSnapSh.forEach((mesa) => {
                  if(mesa.data().numero == auxiliar)
                  {
                    this.complemento.presentToastConMensajeYColor(`La mesa se encuentra ${mesa.data().estado} por favor, solicite al metre para asignarle una mesa.`,'danger');
                  }
                })
              }))
            break;
          }
        }
          
          this.listaEspera = []; // esto pone la lista vacía para que quede facherisima.

      })

    })

     }).catch(err => {
         console.log('Error', err);
     });
     
}


listaEsperaQRAnonimo()
{

  //let variable = localStorage.getItem('nombreAnonimo'); //***** VALIDAR EL NOMBRE TAMBIEN PORQUE SE VA ROMPER TODO */
  //let nombreAnonimo = JSON.parse(variable);


  let auxiliar;
  this.barcodeScanner.scan().then(barcodeData => {

    auxiliar = barcodeData.text;

    this.firestore.collection('usuarios').get().subscribe((querySnapShot) => {
    querySnapShot.forEach((doc) => {

        if(doc.data().nombre == this.nombreAnonimo.nombre) // VERIFICAR EL PUTO IF
        {

          switch(auxiliar) // CAMBIAR ESTO SI NO FUNCIONA
          {
            case "enEspera":
              this.usuarioMesa.nombreUsuario = doc.data().nombre;
              this.usuarioMesa.estadoMesa = "enEspera";
              this.usuarioMesa.perfilUsuario = doc.data().perfil;
              this.bd.crear('listaEspera', this.usuarioMesa);
            break ;

            default:

              this.firestore.collection('listaMesas').get().subscribe((qSnapSh => {
                qSnapSh.forEach((mesa) => {
                  if(mesa.data().numero == auxiliar)
                  {
                    this.complemento.presentToastConMensajeYColor(`La mesa se encuentra ${mesa.data().estado} por favor, solicite al metre para asignarle una mesa.`,'danger');
                  }
                })
              }))
            break;
          }
    
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
    localStorage.removeItem('tieneCorreo');
    localStorage.removeItem('correoUsuario');
    this.router.navigate(['/login']);
  }

   // PARA EL METRE -> cuando se seleccione un usuario en espera, se redireccionara a la pagina de  listado-mesas y se guardara en el local storage la info del usuario seleccionado
  comprobarMesas(mesa)
  {
    localStorage.setItem('usuarioSelMesa',JSON.stringify(mesa));
    this.router.navigate(['/listado-mesas']);
  }

  mostrarCuentaBoton = false;
  mostrarEncuestaBoton = false;

  mostrarCuentaDiv = false;
  mostrarEncuestaDiv = false;

  mostrarEncuestaLista()
  {
    this.mostrarCuentaDiv = false;
    this.mostrarEncuestaDiv = true;
    this.mostrarProductos = false;
    this.mostrarConsultaRealizada = false;
  }

  darPropina()
  {
    let auxiliar;
    this.barcodeScanner.scan().then(barcodeData => {

      //auxiliar = JSON.parse(barcodeData.text);
      auxiliar = barcodeData.text;

        switch(auxiliar) // CAMBIAR ESTO SI NO FUNCIONA
        {
          case "Excelente":
            this.propina = "Excelente -> 20%";
            this.jsonCuenta.precioTotal = this.jsonCuenta.precioTotal  * 0.2 + this.jsonCuenta.precioTotal ;
          break ;
          case "Muy bien" :
            this.propina = "Muy bien -> 15%";
            this.jsonCuenta.precioTotal = this.jsonCuenta.precioTotal  * 0.15 + this.jsonCuenta.precioTotal;
            break;
          case "Bien" : 
          this.propina = "Bien -> 10%";
          this.jsonCuenta.precioTotal = this.jsonCuenta.precioTotal  * 0.1 + this.jsonCuenta.precioTotal;
          break;
          case "Regular" :
            this.propina = "Regular -> 5%";
            this.jsonCuenta.precioTotal = this.jsonCuenta.precioTotal  * 0.05 + this.jsonCuenta.precioTotal;
            break;
            case "Malo" :
              this.propina = "Malo -> 0%";
            break;
        }
        
      }).catch(err => {
        console.log('Error', err);
})

  }

  propina;

  jsonCuenta = {
    pedidos: [],
    propina: this.propina,
    precioTotal:0
  }
  mostrarCuentaLista()
  { 
    // Desactivamos y activamos los div
    this.mostrarCuentaDiv = true;
    this.mostrarEncuestaDiv = false;
    this.mostrarProductos = false;
    // Se esperara 5 segundos para esperar la cuenta
    //this.complemento.presentLoading();
    this.splash = true;
    setTimeout(() => {
      this.splash = false;
    }, 5000);



    // Tenemos que recorrer y comparar
    this.firestore.collection('pedidos').get().subscribe((querySnapShot) => {
      querySnapShot.forEach((doc) => {

        if(doc.data().mesa == this.informarEstadoMesa.mesa) // Comparamos las mesas y nos dara el pedido de esa mesa
        {
            doc.data().platosPlato.forEach(element => {
              this.firestore.collection('productos').get().subscribe((querySnapShot) => {
                querySnapShot.forEach((docP) => { 
       
                  if(element == docP.data().nombre)
                  {
                    let jsonPedido = {
                      precioUnitario : 0,
                      nombreProducto : ""
                    }
                    jsonPedido.precioUnitario = docP.data().precio;
                    jsonPedido.nombreProducto = element;
                    this.jsonCuenta.pedidos.push(jsonPedido);
                  }
                })
                   
              });
            });

            doc.data().platosPostre.forEach(element => {
              this.firestore.collection('productos').get().subscribe((querySnapShot) => {
                querySnapShot.forEach((docP) => { 
       
                  if(element == docP.data().nombre)
                  {
                    let jsonPedido = {
                      precioUnitario : 0,
                      nombreProducto : ""
                    }
                    jsonPedido.precioUnitario = docP.data().precio;
                    jsonPedido.nombreProducto = element;
                    this.jsonCuenta.pedidos.push(jsonPedido);
                  }
                })
                   
              });
            });

            doc.data().platosBebida.forEach(element => {
              this.firestore.collection('productos').get().subscribe((querySnapShot) => {
                querySnapShot.forEach((docP) => { 
       
                  if(element == docP.data().nombre)
                  {
                    let jsonPedido = {
                      precioUnitario : 0,
                      nombreProducto : ""
                    }
                    jsonPedido.precioUnitario = docP.data().precio;
                    jsonPedido.nombreProducto = element;
                    this.jsonCuenta.pedidos.push(jsonPedido);
                  }
                })
                   
              });
            });
            this.jsonCuenta.precioTotal = doc.data().precioTotal;

        }

      })

    
    })

  }

  pagarCuenta()
  {
    let auxPedido;
    let auxLisEsp;

    this.firestore.collection('pedidos').get().subscribe((querySnapShot) => {
      querySnapShot.forEach((doc) => {
        if(doc.data().mesa == this.informarEstadoMesa.mesa)
        {
          auxPedido = doc.data();
          auxPedido.estadoPedido = "pagado"
          this.bd.actualizar("pedidos",auxPedido,doc.id);
 
          this.firestore.collection('listaEspera').get().subscribe((querySnapShot) => {
            querySnapShot.forEach((docDos) => {
              if(this.informarEstadoMesa.mesa == docDos.data().mesa)
              {
                this.informarEstadoMesa.mesa = "";
                this.informarEstadoMesa.seAsignoMesa = "no";
                // this.firestore.doc(docDos.id).delete() -> Fijarse como borrlo de la lista de espera
                this.firestore.collection('listaEspera').doc(docDos.id).delete();
                this.mostrarCuentaBoton = false;
                this.mostrarEncuestaBoton =false;
                this.complemento.presentToastConMensajeYColor("Su pago esta por ser confirmado, gracias por utilizarnos!","success");
              }
            })
          });
        
        }

      })
    });

  }

  mensajeEscanearMesa = false;
  banderaQrMesa = false;
  // PARA CLIENTES Y ANONIMOS -> El usuario al escanear el codigo qr de la mesa podra ver los productos
  qrMesa()
  {
    /*
    this.mostrarCuentaDiv = false;
    this.mostrarEncuestaDiv = false;
    this.mensajeEscanearMesa = true;
    this.mostrarConsultaRealizada = false;
    this.mostrarBotonConsulta = true;*/
    //this.mostrarProductos = true;
    localStorage.setItem("mesa",this.informarEstadoMesa.mesa);
    let auxMesa;

    this.barcodeScanner.scan().then(barcodeData => {

    auxMesa = JSON.parse(barcodeData.text);

    let auxMesaString = auxMesa.toString();
    
    this.firestore.collection('listaMesas').get().subscribe((querySnapShot) => {
      querySnapShot.forEach((doc) => {

        if(doc.data().numero == auxMesaString) //Recorremos las mesas y comprobamos que coincida // PONER CODIGO QR MESA
        {
          if(this.informarEstadoMesa.mesa == auxMesaString)
          {
            this.mostrarCuentaDiv = false;
            this.mostrarEncuestaDiv = false;
            this.mensajeEscanearMesa = true;
            this.mostrarConsultaRealizada = false;
            this.mostrarBotonConsulta = true;
            
            this.mostrarProductos = true;

            let fb = this.firestore.collection('pedidos');
  
              // Me voy a suscribir a la colección, y si el usuario está "ESPERANDO", se va a guardar en una lista de usuarios.
            fb.valueChanges().subscribe(datos =>{       // <-- MUESTRA CAMBIOS HECHOS EN LA BASE DE DATOS.
            
            datos.forEach( (dato:any) =>{
  
              if(this.informarEstadoMesa.mesa == dato.mesa ) // Verifico que el estado sea esperando.
              {
              
                  if(dato.estadoPedido == 'finalizado')
                  {
                      this.complemento.presentToastConMensajeYColor("Su pedido se finalizo con exito","success");
                      if(this.banderaQrMesa == true)
                      {
                        this.complemento.presentToastConMensajeYColor("Podra acceder a la encuesta y a la cuenta","success");
                        this.mostrarCuentaBoton = true;
                        this.mostrarEncuestaBoton = true;
                      }
                      else
                      {
                        this.banderaQrMesa = true;
                      }
                  }
                  else if(dato.estadoPedido == 'enProceso')
                  {
                    this.complemento.presentToastConMensajeYColor("Su pedido esta pendiente del mozo","primary");
                  }
                  else if(dato.estadoPedido == 'enPreparacion')
                  {
                    this.complemento.presentToastConMensajeYColor(`Su pedido esta en preparacion, tiempo aprox ${dato.tiempoTotal}minutos`,"primary");
                  }
            
              }
              });
            })
          }
          else
          {
            this.complemento.presentToastConMensajeYColor(`La mesa ${auxMesaString} en estado ${doc.data().estado} no le corresponde, vuelva a escanear el qr `,"primary");
          }
         
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
          auxConsulta.consultaDescripcion = this.consulta;
          this.bd.actualizar('listaEspera',auxConsulta,dato.id);
          this.cancelarConsulta();
          this.complemento.presentToastConMensajeYColor("Su consulta se realizo con exito,espere a que el mozo se acerce.","success");
        }

      })
    
    });
      
  }

  // Creamos la bandera que lo activara
  deplegarConsultaMozo : boolean = false;

  // VARIABLE CONSULTA 
  consulta  : string;

  // PARA EL CLIENTE Y ANONIMO -> Abrira una mini pestaña para mostrar si se envia o no
  desplegarConsulta()
  {
    this.deplegarConsultaMozo = true;
  }
  
  cancelarConsulta()
  {
    this.consulta = "";
    this.deplegarConsultaMozo = false;
  }

  //Banderas del MOZO
  banderaMostrarPedidos = false;
  banderaMostrarConsultas = false;
  mostrarPedidoFinalizado:boolean = false;
  banderaMostrarCuentasPagadas = false;

  // PARA EL MOZO -> muestra los pedidos 
  mostrarPedidos()
  {
    this.banderaMostrarPedidos = true;
    this.banderaMostrarConsultas = false;
    this.mostrarPedidoFinalizado = false
    this.banderaMostrarCuentasPagadas = false;
  }

  mostrarConsultas()
  {
    this.banderaMostrarPedidos = false;
    this.banderaMostrarConsultas = true;
    this.mostrarPedidoFinalizado = false;
    this.banderaMostrarCuentasPagadas = false;
  }

  mostrarPedidosFinalizados()
  {
    this.banderaMostrarPedidos = false;
    this.banderaMostrarConsultas = false;
    this.mostrarPedidoFinalizado = true;
    this.banderaMostrarCuentasPagadas = false;
  }


  enviarPedidos(mesa)
  {
    let auxPedido;

    this.firestore.collection('pedidos').get().subscribe((querySnapShot) => {
      
      querySnapShot.forEach(dato => {

        if(dato.data().mesa == mesa)
        {
          auxPedido = dato.data();
          auxPedido.estadoChef = "enProceso";
          auxPedido.estadoBartender = "enProceso";
          auxPedido.estadoPedido = "pendiente";
          this.bd.actualizar('pedidos',auxPedido,dato.id);
          this.cancelarConsulta();
        }

      })
    
    });
  }

  cancelarPedido(mesa)
  {
    let auxPedido;

    this.firestore.collection('pedidos').get().subscribe((querySnapShot) => {
      
      querySnapShot.forEach(dato => {

        if(dato.data().mesa == mesa)
        {
          auxPedido = dato.data();
          auxPedido.estadoPedido = "cancelado";
          this.bd.actualizar('pedidos',auxPedido,dato.id);
          this.cancelarConsulta();
        }

      })
    
    });
  }

  enviarPedidoFinalizado(mesa)
  {
    let auxPedido;

    this.firestore.collection('pedidos').get().subscribe((querySnapShot) => {
      
      querySnapShot.forEach(dato => {

        if(dato.data().mesa == mesa)
        {
            auxPedido = dato.data();
            auxPedido.estadoPedido = "finalizado"; // Cuando le da a enviar, el cliente escaneara el codigo QR donde el estado le saldra finalizado
            this.bd.actualizar('pedidos',auxPedido,dato.id);
        }

      })
    
    });
  }


  // PARA EL BARTENDER O COCINERO -> PREPARARA EL PEDIDO 
  // estados del pedido .. 
  // enProceso -> cuando el mozo le asigna al bartender y/o al Cocinero
  // enPreparacion -> cuando el bartender y/o el cocinero 
  // finalizado -> cuando el pedido se finalizo
  elaborarPedido(mesa, estadoPedido,perfil)
  {
    let auxPedido;
    
    this.firestore.collection('pedidos').get().subscribe((querySnapShot) => {
      
      querySnapShot.forEach(dato => {

        if(dato.data().mesa == mesa)
        {
          if(perfil == "BarTender" && estadoPedido == "enPreparacion")
          {
            auxPedido = dato.data();
            auxPedido.estadoBartender =estadoPedido;
            auxPedido.estadoPedido = estadoPedido;
            this.bd.actualizar('pedidos',auxPedido,dato.id);
            this.cancelarConsulta();
          }
          else if(perfil == "BarTender" && estadoPedido == "finalizado")
          {
            auxPedido = dato.data();
            auxPedido.estadoBartender =estadoPedido;
            this.bd.actualizar('pedidos',auxPedido,dato.id);
            this.cancelarConsulta();
          }
          if(perfil == "Cocinero" && estadoPedido == "enPreparacion")
          {
            auxPedido = dato.data();
            auxPedido.estadoChef =estadoPedido;
            auxPedido.estadoPedido = estadoPedido;
            this.bd.actualizar('pedidos',auxPedido,dato.id);
            this.cancelarConsulta();
          }
          else if(perfil == "Cocinero" && estadoPedido == "finalizado")
          {
            auxPedido = dato.data();
            auxPedido.estadoChef =estadoPedido;
            this.bd.actualizar('pedidos',auxPedido,dato.id);
            this.cancelarConsulta();
          }
          
        }

      })
    
    });


  }

  gradoSatisfaccion ;
  gradoSatisfaccionRes;

  jsonEncuesta ={
    preguntaUno: 0,
    preguntaDos: 0,
    fotos : [],
  }

  cambioRango(event){

    this.gradoSatisfaccion = event.detail.value;
  }
  cambioRangoRes(event){

    console.log(event.detail.value);
    this.gradoSatisfaccionRes = event.detail.value;
  }

  async presentAlert() {

      const alert = await this.alertController.create({
        cssClass: 'success',
        header: 'Su pedido se a completado',
        buttons: [
          {
            text:'Cancelar',
            role:'cancel',
            cssClass:'success',
            handler:(bla) =>{
              console.log("confirm cancel:blah");
            }

          },
          {
            text:'Okey',
            cssClass:'success',
            handler: (ok) =>{
              console.log("Confirmar");
            }
          }

        ]
      });
  
      await alert.present();

  }

  pathImagen = [];
  tomarTresFotografias()
  {
    if(this.jsonEncuesta.fotos.length <=3)
    {
    
    const options: CameraOptions =  { 
      quality:100,
      targetHeight:600,
      targetWidth:600,
      destinationType: this.camera.DestinationType.DATA_URL,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE,
    }
  
    this.camera.getPicture(options).then((imageData)=> {
  
      var base64Str = 'data:image/jpeg;base64,'+imageData;
      //Para que la fotografia se muestre apenas se tomo
  
      var storageRef = firebase.storage().ref();
     
      let obtenerMili = new Date().getTime(); 
  
      var nombreFoto = "encuestas/"+obtenerMili+".jpg";
  
      var childRef = storageRef.child(nombreFoto);
  
      this.pathImagen.push(nombreFoto);
  
      childRef.putString(base64Str,'data_url').then(function(snapshot)
      {
        
        this.pathImagen.array.forEach(element => {
          this.st.storage.ref(element).getDownloadURL().then((link) =>
          {
            this.this.jsonEncuesta.fotos.push(link);
          });
        });
       
      })
  
    },(Err)=>{
      alert(JSON.stringify(Err));
      })
    }
  }

  verEncuestas()
  {  
    this.router.navigate(['encuestas']);  
  }

  enviarEncuesta()
  {

    this.jsonEncuesta.preguntaUno=this.gradoSatisfaccion;
    this.jsonEncuesta.preguntaDos=this.gradoSatisfaccionRes;
     this.bd.crear('encuestas',this.jsonEncuesta);
     this.complemento.presentToastConMensajeYColor('¡Su encuesta se finalizo con exito!','success');
     this.mostrarEncuestaDiv = false;

    // enc1010
     this.contadorInterno = -1; // enc1010 
     this.jsonEncuesta.fotos[0] = 'https://i.imgur.com/zH3i014.png';
     this.jsonEncuesta.fotos[1] = 'https://i.imgur.com/zH3i014.png';
     this.jsonEncuesta.fotos[2] = 'https://i.imgur.com/zH3i014.png';
 
  } 

  mostrarCuentasPagadas()
  {
    this.banderaMostrarPedidos = false;
    this.banderaMostrarConsultas = false;
    this.mostrarPedidoFinalizado = false;
    this.banderaMostrarCuentasPagadas = true;
  }

  // PARA EL MOZO -> Se libera la mesa una vez confirmado el pago
  liberarMesa(mesa)
  {
    let auxMesa ;

    this.firestore.collection('pedidos').get().subscribe((querySnapShot) => {
      
      querySnapShot.forEach(dato => {  
        if(mesa == dato.data().mesa)
        {
          this.firestore.collection('listaMesas').get().subscribe((querySnapShot) => {
      
            querySnapShot.forEach(datoMesa => {  

              if(mesa == datoMesa.data().numero)
              {
                auxMesa = datoMesa.data();
                auxMesa.estado = "desocupada";
                this.bd.actualizar("listaMesas",auxMesa,datoMesa.id);
                this.firestore.collection('pedidos').doc(dato.id).delete();
                this.complemento.presentToastConMensajeYColor("La mesa a sido liberada","success");
              }

             })

          });
        }

      })

    });
  }
 
  consultaMozo : string; // Variable para el mozo
 // PARA EL MOZO -> Finaliza con exito una consulta
 consultaConExito(espera,consultaMozo)
 {
   let auxListaEspera;
   
  this.firestore.collection('listaEspera').get().subscribe((querySnapShot) => {
      
    querySnapShot.forEach(dato => {  

      if(dato.data().mesa == espera.mesa)
      {
        auxListaEspera = dato.data();
        auxListaEspera.consulta = 'noRealizo';
        //auxListaEspera.consultaDescripcion = '';
        auxListaEspera.consultaMozo = consultaMozo;
        this.bd.actualizar('listaEspera',auxListaEspera,dato.id);
        this.complemento.presentToastConMensajeYColor('La consulta fue completada con exito!','success');

      }
    })

  })
 }


 mostrarBotonConsulta = false;

 mostrarConsultaRealizada = false;
 
 // PARA LOS CLIENTES (ANONIMO TAMBIEN) -> Boton que me muestra las consultas
 botonMostrarConsulta(numeroMesa)
 {
  this.mostrarCuentaDiv = false;
  this.mostrarEncuestaDiv = false;
  this.mostrarProductos = false;
  this.mostrarConsultaRealizada = true;

 }



 // LO QUE ESTUVE MODIFICANDO DE ENCUESTA:

 // FUNCION QUE TOMA 3 FOTOS EN LA ENCUESTA:

 tomarFotosEncuesta() //enc1010
  {
    const options: CameraOptions =  { 
      quality:100,
      targetHeight:600,
      targetWidth:600,
      destinationType: this.camera.DestinationType.DATA_URL,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE,
    }

    this.camera.getPicture(options).then((imageData)=> {

      var base64Str = 'data:image/jpeg;base64,'+imageData;
      
      //Para que la fotografia se muestre apenas se tomo
      this.jsonEncuesta.fotos[this.contadorInterno] = base64Str;

      var storageRef = firebase.storage().ref();
     
      let obtenerMili = new Date().getTime(); 

      var nombreFoto = "fotosEncuesta/"+obtenerMili+"."+".jpg";

      var childRef = storageRef.child(nombreFoto);

      this.pathImagenesEncuesta[this.contadorInterno] = nombreFoto;

      childRef.putString(base64Str,'data_url').then(function(snapshot)
      {
        
      })

    },(Err)=>{
      alert(JSON.stringify(Err));
    })
    
  }


  manejadorEncuesta()
  {
    this.tomarFotosEncuesta();
    this.contadorInterno += 1;
  }


 


}
