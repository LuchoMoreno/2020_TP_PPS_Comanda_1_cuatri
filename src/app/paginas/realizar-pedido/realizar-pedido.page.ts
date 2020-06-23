import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';


// IMPORTO SERVICIO DE BASE DE DATOS
import { DatabaseService } from "../../servicios/database.service";


// IMPORTO SERVICIO DE BASE DE DATOS
import { ComplementosService } from "../../servicios/complementos.service";


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
    precioTotal : 0,
    estadoChef : "",
    estadoBartender : "",
    mesa : "",
  };


  listaProductosTipoPlato = [];
  listaProductosTipoBebida = [];
  listaProductosTipoPostre = [];


  // IMPORTANTISIMOS
  tipoPlatoPedido : string = null;

  contadorPlatos;
  contadorBebidas;
  contadorPostres;
  contadorVecesQueConfirmaPedido;
  

  // PURA ESTÉTICA:

  variabledesplegarPedido : boolean;


  
  constructor( private firestore : AngularFirestore,
    private bd : DatabaseService,
    private complementos : ComplementosService) { }

  ngOnInit() {

    this.listaProductosTipoPlato = this.cargarProductosTipo("Plato");
    this.listaProductosTipoBebida = this.cargarProductosTipo("Bebida");
    this.listaProductosTipoPostre = this.cargarProductosTipo("Postre");

    this.contadorPlatos = 0;
    this.contadorBebidas = 0;
    this.contadorPostres = 0;
    this.contadorVecesQueConfirmaPedido = 0;

    this.variabledesplegarPedido = false;
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


  cargarJSONPedidosPlatos(plato : string, tipoDePlato : string, precio : number)
  {
   
    if (tipoDePlato == "Plato")
    {

      this.pedidoEnFormatoJSON.platosPlato[this.contadorPlatos] = plato;
      this.contadorPlatos = this.contadorPlatos + 1;
      this.pedidoEnFormatoJSON.precioTotal = this.pedidoEnFormatoJSON.precioTotal + precio;
    }

    if (tipoDePlato == "Bebida")
    {
      this.pedidoEnFormatoJSON.platosBebida[this.contadorBebidas] = plato;
      this.contadorBebidas = this.contadorBebidas + 1;
      this.pedidoEnFormatoJSON.precioTotal = this.pedidoEnFormatoJSON.precioTotal + precio;
      
    }

    if (tipoDePlato == "Postre")
    {
      this.pedidoEnFormatoJSON.platosPostre[this.contadorPostres] = plato;
      this.contadorPostres = this.contadorPostres + 1;
      this.pedidoEnFormatoJSON.precioTotal = this.pedidoEnFormatoJSON.precioTotal + precio;
    }


    console.log(this.pedidoEnFormatoJSON);


  }



  // ACA ES PURO ESTÉTICA, SOLO PARA CONFIRMAR EL PEDIDO.


  // PARA EL CLIENTE Y ANONIMO -> Abrira una mini pestaña para mostrar si se envia o no
  desplegarPedido()
  {
    this.variabledesplegarPedido = true;
  }

  desplegarInversoPedido()
  {
    this.variabledesplegarPedido = false;
  }


  confirmarPedido()
  {

    if (this.contadorVecesQueConfirmaPedido == 0)
    {
      this.complementos.presentToastConMensajeYColor("Pedido generado con éxito. Será redirigido al menú!", "success")
      this.bd.crear('pedidos',this.pedidoEnFormatoJSON);
      this.contadorVecesQueConfirmaPedido = 1;
    }

    else
    {
      this.complementos.presentToastConMensajeYColor("¡Su orden ya fue cargada!", "warning")
    }

   
  }
  
  cancelarPedido()
  {
    if (this.contadorVecesQueConfirmaPedido == 0)
    {
      this.pedidoEnFormatoJSON.platosPlato = [];
      this.pedidoEnFormatoJSON.platosBebida = [];
      this.pedidoEnFormatoJSON.platosPostre = [];
      this.pedidoEnFormatoJSON.precioTotal = 0;


      this.contadorPlatos = 0;
      this.contadorBebidas = 0;
      this.contadorPostres = 0;

      this.complementos.presentToastConMensajeYColor("¡El pedido fue cancelado!", "success")
    }
    else
    {
      this.complementos.presentToastConMensajeYColor("¡No puede cancelar un pedido ya enviado!", "warning")
    }
    
  }


  // CON ESTO AGREGO A UNA COLECCIÓN.




}
