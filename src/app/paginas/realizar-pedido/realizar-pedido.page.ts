import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';

@Component({
  selector: 'app-realizar-pedido',
  templateUrl: './realizar-pedido.page.html',
  styleUrls: ['./realizar-pedido.page.scss'],
})
export class RealizarPedidoPage implements OnInit {


  pedidoEnFormatoJSON = {
    platosPlato : [],
    platosBebida : [],
    platosPostre : [],
  };



  listaProductosTipoPlato = [];
  cantidadPedidoTipoPlato = [];
  pickedCantTipoPlato : string;



  listaProductosTipoBebida = [];
  cantidadPedidoTipoBebida = [];
  pickedCantTipoBebida : string;


  listaProductosTipoPostre = [];
  cantidadPedidoTipoPostre = [];
  pickedCantTipoPostre : string;


  // IMPORTANTISIMOS
  tipoPlatoPedido : string = null;

  contadorPlatos;
  contadorBebidas;
  contadorPostres;
  

  // VARIABLES DE VERO.

  listaProductos = [];
  cantidadPedido = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25]
  pickedCant :string;
  jsonDatos:any;


  listaPedido : any;

  jsonPedido = {
    nombreProducto : "",
    cantidad : this.cantidadPedido
  }

  constructor( private firestore : AngularFirestore) { }

  ngOnInit() {

    this.cargarProductos();
    console.log(this.listaPedido);
    this.listaProductosTipoPlato = this.cargarProductosTipo("Plato");
    this.listaProductosTipoBebida = this.cargarProductosTipo("Bebida");
    this.listaProductosTipoPostre = this.cargarProductosTipo("Postre");

    this.contadorPlatos = 0;
    this.contadorBebidas = 0;
    this.contadorPostres = 0;
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

 

 seleccionCantidad(pickedCant,producto){
    this.listaProductos.forEach((auxProducto) =>{
      if(auxProducto.nombre === producto.nombre)
      {
       this.pickedCant = pickedCant;
       this.jsonDatos.nombre = producto.nombre;
       this.jsonDatos.cantidad = pickedCant;
       console.log(producto);
      return
      }
    })
  
 
  } 



  cargarProductosTipo(tipoProducto : string) : any
  {

    var listaProductos = [];
    this.firestore.collection("productos").get().subscribe((querySnapShot) => {
      querySnapShot.forEach((doc) => {

        // Correo de la BD == Correo de la lista.
       if(doc.data().tipo == tipoProducto)
       {
        listaProductos.push(doc.data());  
       }

      })
    })

    return listaProductos;
  }


  cargarJSONPedidosPlatos(plato : string, tipoDePlato : string)
  {
   
    if (tipoDePlato == "Plato")
    {

      this.pedidoEnFormatoJSON.platosPlato[this.contadorPlatos] = plato;
      this.contadorPlatos = this.contadorPlatos + 1;
    }

    if (tipoDePlato == "Bebida")
    {
      this.pedidoEnFormatoJSON.platosBebida[this.contadorBebidas] = plato;
      this.contadorBebidas = this.contadorBebidas + 1;
    }

    if (tipoDePlato == "Postre")
    {
      this.pedidoEnFormatoJSON.platosPostre[this.contadorPostres] = plato;
      this.contadorPostres = this.contadorPostres + 1;
    }
   // ACA LO PIENSO DE MANERA 1, TIPO LISTA.

    this.tipoPlatoPedido = this.tipoPlatoPedido + "," + plato;
    console.log(this.tipoPlatoPedido);


    console.log(this.pedidoEnFormatoJSON);


  }



  agregarTodoAJSON()
  {

  }

}
